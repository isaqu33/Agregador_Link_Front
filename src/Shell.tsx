import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
const img = "/assets/pixeltruewebdesign.png";

import {
  ArrowSquareOut,
  ChartBar,
  EnvelopeSimple,
  Eye,
  HouseSimple,
  Link as IconLink,
  LinkSimpleHorizontalBreak,
  SignOut,
  SquaresFour,
  UserCircle,
} from "phosphor-react";
import LogoApp from "./componentes/logoApp";
import ThemeToggle from "./componentes/ThemeToggle";
import useMe, { pageKey } from "./hooks/useMe";
import { usePageContext } from "./contexts/PageContext";
import useApi from "./server/api";
import Loader, { PreviewSkeleton } from "./componentes/Loader";
import PaginaSeletor from "./componentes/PaginaSeletor";

import { useQueryClient } from "react-query";
import Preview from "./views/Preview";
import screenSize from "../src/hooks/screenSize";
import AppState from "./AppState";
import { observer } from "mobx-react";

const Shell = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const tamanhoTela = screenSize();

  const { resendVerification, getAnalytics, getLeads, getPage } = useApi();
  const { pageId } = usePageContext();
  const [reenvio, setReenvio] = useState<"" | "enviando" | "ok" | "erro">("");
  async function reenviar() {
    setReenvio("enviando");
    try {
      await resendVerification();
      setReenvio("ok");
    } catch {
      setReenvio("erro");
    }
  }

  const sair = () => {
    queryClient.clear();
    signOut({ callbackUrl: "/login" });
  };

  // an expired or invalid session sends the user back to the login
  const { data: me, isLoading } = useMe({ onError: sair });

  // Páginas extras: busca os dados de todas assim que a lista chega, para a troca no seletor não esperar a rede
  const paginasExtras = (me as any)?.pages as { id: string }[] | undefined;
  useEffect(() => {
    paginasExtras?.forEach((p) =>
      queryClient.prefetchQuery(pageKey(p.id) as any, () => getPage(p.id), { staleTime: 1000 * 60 * 5 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginasExtras?.map((p) => p.id).join(",")]);

  // Ao passar o mouse na aba, adianta os dados dela (a tela abre já com números)
  const adiantar = (rota: string) => {
    if (rota.endsWith("/analytics")) {
      queryClient.prefetchQuery(["analytics", 30, pageId], () => getAnalytics(30), { staleTime: 30 * 1000 });
    } else if (rota.endsWith("/leads")) {
      queryClient.prefetchInfiniteQuery(["leads", pageId], () => getLeads(), { staleTime: 30 * 1000 });
    }
  };

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
    {
      Nome: "Perfil",
      rota: "/costumer/profile",
      icon: <UserCircle size={18} />,
    },
    {
      Nome: "Contatos",
      rota: "/costumer/leads",
      icon: <EnvelopeSimple size={18} />,
    },
    {
      Nome: "Analytics",
      rota: "/costumer/analytics",
      icon: <ChartBar size={18} />,
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
                href={me.username ? `/@${me.username}` : `/${me.id}`}
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

      {me && me.emailVerified === false ? (
        <div className="w-full bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
            <span>Confirme seu e-mail ({me.email}) para proteger sua conta e poder recuperar a senha.</span>
            <button
              type="button"
              onClick={reenviar}
              disabled={reenvio === "enviando" || reenvio === "ok"}
              className="font-medium underline underline-offset-2 disabled:no-underline disabled:opacity-70"
            >
              {reenvio === "ok"
                ? "E-mail enviado!"
                : reenvio === "enviando"
                  ? "Enviando..."
                  : reenvio === "erro"
                    ? "Falhou. Tentar de novo"
                    : "Reenviar e-mail"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex gap-8 items-start justify-center">
        <main className="w-full max-w-[760px] min-w-0">
          <PaginaSeletor />
          <nav className="flex gap-1 mb-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit max-w-full overflow-x-auto">
            {NavLink.map((item) => {
              const ativo =
                item.rota === "/costumer" ? pathname === "/costumer" : pathname?.startsWith(item.rota);
              return (
                <Link
                  key={item.Nome}
                  href={item.rota}
                  onMouseEnter={() => adiantar(item.rota)}
                  onFocus={() => adiantar(item.rota)}
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
            {isLoading ? <Loader /> : children}
          </div>
        </main>

        {tamanhoTela >= 918 ? (
          <aside className="w-[320px] shrink-0 sticky top-6 flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Pré-visualização
            </p>
            <div className="relative w-full h-[640px] rounded-[44px] p-[10px] bg-zinc-800 border border-zinc-700 shadow-2xl shadow-violet-900/30">
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] rounded-full bg-zinc-900 z-10" />
              <div className="w-full h-full rounded-[34px] overflow-hidden bg-white">
                <div className="w-full h-full overflow-y-auto scrollbar-none">
                  {isLoading ? <PreviewSkeleton /> : <Preview dados={me}></Preview>}
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
