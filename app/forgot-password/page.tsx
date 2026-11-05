'use client';

import dynamic from 'next/dynamic';
import Loader from '../../src/componentes/Loader';

const Tela = dynamic(() => import('../../src/views/ForgotPassword'), { ssr: false, loading: () => <Loader fullScreen /> });

export default function Page() {
  return <Tela />;
}
