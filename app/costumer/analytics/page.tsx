'use client';

import dynamic from 'next/dynamic';
import Loader from '../../../src/componentes/Loader';

const Analytics = dynamic(() => import('../../../src/views/Analytics'), { ssr: false, loading: () => <Loader /> });

export default function Page() {
  return <Analytics />;
}
