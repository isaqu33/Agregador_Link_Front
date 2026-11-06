"use client";

import ClientOnly from "../../../src/componentes/ClientOnly";
import Loader from "../../../src/componentes/Loader";
import Analytics from "../../../src/views/Analytics";

export default function Page() {
  return (
    <ClientOnly fallback={<Loader />}>
      <Analytics />
    </ClientOnly>
  );
}
