'use client';

import dynamic from 'next/dynamic';
import Loader from '../../src/componentes/Loader';

const Links = dynamic(() => import('../../src/views/Links'), { ssr: false, loading: () => <Loader /> });

export default function Page() {
  return <Links />;
}
