'use client';

import dynamic from 'next/dynamic';
import Loader from '../../../src/componentes/Loader';

const Profile = dynamic(() => import('../../../src/views/Profile'), { ssr: false, loading: () => <Loader /> });

export default function Page() {
  return <Profile />;
}
