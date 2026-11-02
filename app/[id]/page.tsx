'use client';

import dynamic from 'next/dynamic';

const PerfilId = dynamic(() => import('../../src/views/PerfilId'), { ssr: false });

export default function Page() {
  return <PerfilId />;
}
