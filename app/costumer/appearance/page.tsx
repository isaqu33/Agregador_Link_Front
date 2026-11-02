'use client';

import dynamic from 'next/dynamic';

const Appearance = dynamic(() => import('../../../src/views/Appearance'), { ssr: false });

export default function Page() {
  return <Appearance />;
}
