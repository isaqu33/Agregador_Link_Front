import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
const img = "/assets/pixeltruewebdesign.png";

import {
  ArrowSquareOut,
  Eye,
  HouseSimple,
  Link as IconLink,
  LinkSimpleHorizontalBreak,
  SignOut,
  SquaresFour,
} from "phosphor-react";
import LogoApp from "./componentes/logoApp";
import ThemeToggle from "./componentes/ThemeToggle";
import useMe from "./hooks/useMe";

import { useQueryClient } from "react-query";
import Preview from "./views/Preview";
import screenSize from "../src/hooks/screenSize";
import AppState from "./AppState";
import { observer } from "mobx-react";

const Shell = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const tamanhoTela = screenSize();


  const sair = () => {
    queryClient.clear();
    signOut({ callbackUrl: "/login" });
  };

  // an expired or invalid session sends the user back to the login
  const { data: me } = useMe({ onError: sair });

  const NavLink = [
    {
      Nome: "Links",
      rota: "/costumer",
      icon: <LinkSimpleHorizontalBreak size={18} />,
    },
    {
      Nome: "Aparência",
      rota: "/costumer/appearance",
      icon: <SquaresFour size={18} />,
    },
  ];


  const pathname = usePathname();
  const [previo, setprevio] = useState(false);

  const url = window.location.href;

  useEffect(() => {
    if (url.indexOf("costumer/appearance") != -1) {
      router.replace("/costumer");
    }
  }, []);

  return (
    <div className="min-h-[100vh] w-full text-zinc-900 select-none">
      <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <LogoApp />

          <div className="flex items-center gap-2">
            {me?.id ? (
              <a
                href={`/${me.id}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg px-3 h-9 transition-colors"
              >
                <ArrowSquareOut size={16} />
                Ver Link
              </a>
            ) : null}

            <ThemeToggle />

            {tamanhoTela <= 918 ? (
              <Link
                onClick={() => setprevio(!previo)}
                href={previo ? "/costumer" : "/costumer/preview"}
                replace
                aria-label={previo ? "Voltar" : "Pré-visualizar"}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {previo ? <HouseSimple size={18} /> : <Eye size={18} />}
              </Link>
            ) : null}

            <button
              type="button"
              onClick={sair}
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg px-3 h-9 transition-colors"
            >
              <SignOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex gap-8 items-start justify-center">
        <main className="w-full max-w-[760px] min-w-0">
          <nav className="flex gap-1 mb-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
            {NavLink.map((item) => {
              const ativo =
                item.rota === "/costumer"
                  ? pathname === "/costumer"
                  : pathname?.startsWith(item.rota);
              return (
                <Link
                  key={item.Nome}
                  href={item.rota}
                  className={`flex items-center gap-2 text-sm font-medium px-4 h-9 rounded-lg transition-colors ${
                    ativo
                      ? "bg-white dark:bg-zinc-700 text-violet-700 dark:text-violet-300 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.icon}
                  {item.Nome}
                </Link>
              );
            })}
          </nav>

          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-8 min-h-[400px]">
            {children}
          </div>
        </main>

        {tamanhoTela >= 918 ? (
          <aside className="w-[320px] shrink-0 sticky top-6 flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Pré-visualização
            </p>
            <div className="w-full h-[640px] bg-zinc-900 dark:bg-zinc-800 dark:ring-1 dark:ring-zinc-700 rounded-[44px] p-[10px] shadow-xl">
              <div className="w-full h-full rounded-[34px] overflow-hidden bg-white">
                <div className="w-full h-full overflow-y-auto scrollbar-none">
                  <Preview dados={me}></Preview>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
});

export default Shell;
