import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const apiUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3070";

// Login with Google is on only when all three are set (see .env.example)
export const googleEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.OAUTH_SHARED_SECRET
);

declare module "next-auth" {
  interface Session {
    user: { id?: string; name?: string | null; email?: string | null };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/login" },
  providers: [
    ...(googleEnabled
      ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
      : []),
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials, request) => {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // the API rate-limits per visitor IP; without this every login would look like it comes from the Next server
            ...(request?.headers?.get("x-forwarded-for")
              ? { "x-forwarded-for": request.headers.get("x-forwarded-for") as string }
              : {}),
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) return null;

        const { accessToken, user } = await response.json();
        // accessToken rides along in the encrypted session JWT; it is never exposed to the browser.
        return { id: user.id, name: user.name, email: user.email, accessToken } as never;
      },
    }),
  ],
  callbacks: {
    // Google: Auth.js already verified the OAuth login. The API creates/finds the account and issues
    // its own token; it is called here on the server with a shared secret (never from the browser).
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return true;
      const secret = process.env.OAUTH_SHARED_SECRET;
      if (!secret || !profile?.email || profile.email_verified !== true) return false;

      const response = await fetch(`${apiUrl}/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-oauth-secret": secret },
        body: JSON.stringify({
          provider: "google",
          email: profile.email,
          name: profile.name ?? profile.email,
          emailVerified: true,
        }),
      });
      if (!response.ok) return false;

      const { accessToken, user: apiUser } = await response.json();
      user.id = apiUser.id;
      user.name = apiUser.name;
      (user as { accessToken?: string }).accessToken = accessToken;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
