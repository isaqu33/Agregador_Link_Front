"use client";

import ClientOnly from "../../src/componentes/ClientOnly";
import Loader from "../../src/componentes/Loader";
import ForgotPassword from "../../src/views/ForgotPassword";

export default function Page() {
  return (
    <ClientOnly fallback={<Loader fullScreen />}>
      <ForgotPassword />
    </ClientOnly>
  );
}
