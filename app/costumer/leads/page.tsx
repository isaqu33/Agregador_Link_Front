'use client';

import dynamic from 'next/dynamic';
import Loader from '../../../src/componentes/Loader';

const Leads = dynamic(() => import('../../../src/views/Leads'), { ssr: false, loading: () => <Loader /> });

export default function Page() {
  return <Leads />;
}
