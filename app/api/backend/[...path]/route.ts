import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:3070';

// Only these API paths are reachable from the browser. /auth/login is not here on
// purpose: logging in goes through Auth.js, never straight to the API.
const PUBLIC_PATHS = [/^auth\/register$/, /^links\/getDataUser\/[^/]+$/];
const PRIVATE_PATHS = [/^user\/(me|editProfile)$/, /^links\/(addLink|deletLink|editActivet)$/, /^media$/];

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const isPublic = PUBLIC_PATHS.some((re) => re.test(path));
  const isPrivate = PRIVATE_PATHS.some((re) => re.test(path));
  if (!isPublic && !isPrivate) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  if (isPrivate) {
    const secure = req.nextUrl.protocol === 'https:';
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: secure,
      salt: secure ? '__Secure-authjs.session-token' : 'authjs.session-token',
    });
    if (!token?.accessToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    headers.set('authorization', `Bearer ${token.accessToken}`);
  }

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const upstream = await fetch(`${apiUrl}/${path}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error required by Node's fetch when streaming a request body
    duplex: hasBody ? 'half' : undefined,
    cache: 'no-store',
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}

export { proxy as GET, proxy as POST };
