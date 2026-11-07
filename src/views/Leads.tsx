import { DownloadSimple, Trash } from "phosphor-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { Spinner } from "../componentes/Loader";
import { usePageContext } from "../contexts/PageContext";
import useApi from "../server/api";

const formatarData = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// E-mails deixados pelos visitantes nos formulários "Captura de e-mail" da página.
export default function Leads() {
  const { getLeads, deleteLead, exportUrl } = useApi();
  const { pageId } = usePageContext();
  const client = useQueryClient();
  // paginado por cursor: "Carregar mais" busca os contatos mais antigos que o último da lista
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["leads", pageId],
    ({ pageParam }) => getLeads(pageParam),
    { staleTime: 30 * 1000, getNextPageParam: (ultima) => ultima.nextCursor ?? undefined }
  );
  const contatos = data?.pages.flatMap((p) => p.leads) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const remover = useMutation((id: string) => deleteLead(id), {
    onSuccess: () => client.invalidateQueries("leads"),
  });

  return (
    <div className="flex flex-col min-h-[560px]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Contatos</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            E-mails deixados pelos visitantes. Para receber, adicione um link do tipo{" "}
            <strong>Captura de e-mail</strong>.
          </p>
        </div>
        <a
          href={exportUrl("leads/export")}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <DownloadSimple size={16} />
          Exportar CSV
        </a>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : isError || !data ? (
        <p className="text-red-600 text-sm mt-6">Não foi possível carregar os contatos.</p>
      ) : contatos.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-10 text-center">Nenhum contato ainda.</p>
      ) : (
        <>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-6 mb-2">
            {total} {total === 1 ? "contato" : "contatos"}
          </p>
          <ul className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            {contatos.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{l.email}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {l.name ? `${l.name} · ` : ""}
                    {l.form} · {formatarData(l.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${l.email}`}
                  onClick={() => window.confirm(`Remover ${l.email}?`) && remover.mutate(l.id)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-4 self-center h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
            >
              {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
