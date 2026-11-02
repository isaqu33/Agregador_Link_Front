'use client';

import dynamic from 'next/dynamic';

const Links = dynamic(() => import('../../src/views/Links'), { ssr: false });

export default function Page() {
  return <Links />;
}
