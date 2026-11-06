'use client';

import ClientOnly from '../../src/componentes/ClientOnly';
import Loader from '../../src/componentes/Loader';
import Login from '../../src/views/Login';

// A tela lê `window` na renderização: só roda no navegador.
export default function LoginClient({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <ClientOnly fallback={<Loader fullScreen />}>
      <Login googleEnabled={googleEnabled} />
    </ClientOnly>
  );
}
