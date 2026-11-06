'use client';

import ClientOnly from '../../../src/componentes/ClientOnly';
import Loader from '../../../src/componentes/Loader';
import Leads from '../../../src/views/Leads';

export default function Page() {
  return (
    <ClientOnly fallback={<Loader />}>
      <Leads />
    </ClientOnly>
  );
}
