"use client";

import ClientOnly from "../../src/componentes/ClientOnly";
import Loader from "../../src/componentes/Loader";
import { PageProvider } from "../../src/contexts/PageContext";
import Shell from "../../src/Shell";

export default function ShellClient({ children }: { children: React.ReactNode }) {
  // PageProvider: qual página (principal ou extra) o painel está editando
  return (
    <ClientOnly fallback={<Loader fullScreen />}>
      <PageProvider>
        <Shell>{children}</Shell>
      </PageProvider>
    </ClientOnly>
  );
}
