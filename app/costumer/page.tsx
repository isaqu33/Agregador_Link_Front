'use client';

import ClientOnly from '../../src/componentes/ClientOnly';
import Loader from '../../src/componentes/Loader';
import Links from '../../src/views/Links';

export default function Page() {
  return (
    <ClientOnly fallback={<Loader />}>
      <Links />
    </ClientOnly>
  );
}
