'use client';

import dynamic from 'next/dynamic';
import Loader from '../../../src/componentes/Loader';

const Appearance = dynamic(() => import('../../../src/views/Appearance'), { ssr: false, loading: () => <Loader /> });

export default function Page() {
  return <Appearance />;
}
