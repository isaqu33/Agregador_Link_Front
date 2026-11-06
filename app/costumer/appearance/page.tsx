'use client';

import ClientOnly from '../../../src/componentes/ClientOnly';
import Loader from '../../../src/componentes/Loader';
import Appearance from '../../../src/views/Appearance';

export default function Page() {
  return (
    <ClientOnly fallback={<Loader />}>
      <Appearance />
    </ClientOnly>
  );
}
