'use client';

import ClientOnly from '../../src/componentes/ClientOnly';
import Loader from '../../src/componentes/Loader';
import ResetPassword from '../../src/views/ResetPassword';

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <ClientOnly fallback={<Loader fullScreen />}>
      <ResetPassword token={searchParams.token ?? ''} />
    </ClientOnly>
  );
}
