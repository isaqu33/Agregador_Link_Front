import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:3070';

declare module 'next-auth' {
  interface Session {
    user: { id?: string; name?: string | null; email?: string | null };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!email || !password) return null;

        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
