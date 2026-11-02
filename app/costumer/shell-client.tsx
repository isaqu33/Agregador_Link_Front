'use client';

import dynamic from 'next/dynamic';

const Shell = dynamic(() => import('../../src/Shell'), { ssr: false });

export default function ShellClient({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
