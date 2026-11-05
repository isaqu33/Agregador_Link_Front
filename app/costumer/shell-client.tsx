'use client';

import dynamic from 'next/dynamic';
import Loader from '../../src/componentes/Loader';

const Shell = dynamic(() => import('../../src/Shell'), { ssr: false, loading: () => <Loader fullScreen /> });

export default function ShellClient({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
