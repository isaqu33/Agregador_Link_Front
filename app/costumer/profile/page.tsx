"use client";

import ClientOnly from "../../../src/componentes/ClientOnly";
import Loader from "../../../src/componentes/Loader";
import Profile from "../../../src/views/Profile";

export default function Page() {
  return (
    <ClientOnly fallback={<Loader />}>
      <Profile />
    </ClientOnly>
  );
}
