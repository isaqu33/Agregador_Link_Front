import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const apiUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3070";

// Only these API paths are reachable from the browser. /auth/login is not here on
// purpose: logging in goes through Auth.js, never straight to the API.
const PUBLIC_PATHS = [
  /^auth\/(register|forgot-password|reset-password|verify-email)$/,
  /^links\/(getDataUser\/[^/]+|unlock)$/,
  /^analytics\/(view|click)$/,
];
// same path, different rules by method: POST /leads is the public e-mail form, GET /leads is the owner's list
const PUBLIC_POST_ONLY = [/^leads$/];
const PRIVATE_PATHS = [
  /^user\/(me|editProfile)$/,
  /^links\/(addLink|deletLink|editActivet|editLink|reorder)$/,
  /^auth\/resend-verification$/,
  /^analytics\/(summary|stream|export)$/,
  /^pages\/(create|edit|delete|[a-f0-9]{24})$/,
  /^leads(\/(export|delete))?$/,
  /^media$/,
];

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  const isPublic =
    PUBLIC_PATHS.some((re) => re.test(path)) ||
    (req.method === "POST" && PUBLIC_POST_ONLY.some((re) => re.test(path)));
  // a request that matched a public rule (POST /leads) never also demands a session
  const isPrivate = !isPublic && PRIVATE_PATHS.some((re) => re.test(path));
  if (!isPublic && !isPrivate) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const headers = new Headers();
  // the API counts visits per visitor: pass the browser IP along
  const ip = req.headers.get("x-forwarded-for");
  if (ip) headers.set("x-forwarded-for", ip);
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  if (isPrivate) {
    const secure = req.nextUrl.protocol === "https:";
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: secure,
      salt: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
    });
    if (!token?.accessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    headers.set("authorization", `Bearer ${token.accessToken}`);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const upstream = await fetch(`${apiUrl}/${path}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error required by Node's fetch when streaming a request body
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
    // closes the upstream connection when the browser leaves (matters for the SSE stream)
    signal: req.signal,
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      // CSV exports are downloads
      ...(upstream.headers.get("content-disposition")
        ? { "content-disposition": upstream.headers.get("content-disposition") as string }
        : {}),
      // SSE must not be cached or buffered on the way
      ...(upstream.headers.get("content-type")?.startsWith("text/event-stream")
        ? { "cache-control": "no-cache, no-transform", "x-accel-buffering": "no" }
        : {}),
    },
  });
}

export { proxy as GET, proxy as POST };
