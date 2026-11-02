'use client';

import dynamic from 'next/dynamic';

// These screens read window during render, so they only run in the browser.
const Login = dynamic(() => import('../../src/views/Login'), { ssr: false });

export default function LoginClient() {
  return <Login />;
}
