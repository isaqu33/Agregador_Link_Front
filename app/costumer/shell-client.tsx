'use client';

import dynamic from 'next/dynamic';
import Loader from '../../src/componentes/Loader';
import { PageProvider } from '../../src/contexts/PageContext';

const Shell = dynamic(() => import('../../src/Shell'), { ssr: false, loading: () => <Loader fullScreen /> });

export default function ShellClient({ children }: { children: React.ReactNode }) {
  // PageProvider: qual página (principal ou extra) o painel está editando
  return (
    <PageProvider>
      <Shell>{children}</Shell>
    </PageProvider>
  );
}
