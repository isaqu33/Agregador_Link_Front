'use client';

import ClientOnly from '../../src/componentes/ClientOnly';
import Loader from '../../src/componentes/Loader';
import VerifyEmail from '../../src/views/VerifyEmail';

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <ClientOnly fallback={<Loader fullScreen />}>
      <VerifyEmail token={searchParams.token ?? ''} />
    </ClientOnly>
  );
}
