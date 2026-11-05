'use client';

import dynamic from 'next/dynamic';
import Loader from '../../src/componentes/Loader';

const Tela = dynamic(() => import('../../src/views/ResetPassword'), { ssr: false, loading: () => <Loader fullScreen /> });

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  return <Tela token={searchParams.token ?? ''} />;
}
