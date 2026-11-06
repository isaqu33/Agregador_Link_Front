import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ArrowsClockwise, DownloadSimple } from "phosphor-react";
import { usePageContext } from "../contexts/PageContext";
import useApi from "../server/api";
import { Spinner } from "../componentes/Loader";

const PERIODOS = [7, 30, 90];

function Cartao({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {titulo}
      </p>
      <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{valor}</p>
      {nota && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{nota}</p>}
    </div>
  );
}

const botaoExportar =
  "flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors";

const NOMES_DISPOSITIVO: Record<string, string> = {
  mobile: "Celular",
  tablet: "Tablet",
  desktop: "Computador",
  desconhecido: "Não identificado",
};
const CORES_DISPOSITIVO = ["#8b5cf6", "#10b981", "#f59e0b", "#94a3b8"];

// rosca em SVG: cada fatia é um traço do círculo (sem biblioteca de gráficos)
function Dispositivos({ itens }: { itens: { device: string; views: number }[] }) {
  const total = itens.reduce((t, i) => t + i.views, 0);
  if (total === 0) return <p className="text-sm text-zinc-500 dark:text-zinc-400">Sem dados ainda.</p>;
  const R = 40;
  const C = 2 * Math.PI * R;
  let acumulado = 0;

  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 100 100"
        width="112"
        height="112"
        role="img"
        aria-label="Visitas por dispositivo"
        className="shrink-0 -rotate-90"
      >
        {itens.map((i, idx) => {
          const parte = (i.views / total) * C;
          const el = (
            <circle
              key={i.device}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              strokeWidth="16"
              stroke={CORES_DISPOSITIVO[idx % CORES_DISPOSITIVO.length]}
              strokeDasharray={`${parte} ${C - parte}`}
              strokeDashoffset={-acumulado}
            />
          );
          acumulado += parte;
          return el;
        })}
      </svg>
      <ul className="flex flex-col gap-1.5 text-sm">
        {itens.map((i, idx) => (
          <li key={i.device} className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            <i
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: CORES_DISPOSITIVO[idx % CORES_DISPOSITIVO.length] }}
            />
            {NOMES_DISPOSITIVO[i.device] ?? i.device}
            <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">
              {Math.round((i.views / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const formatarDia = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export default function Analytics() {
  const { getAnalytics, exportUrl } = useApi();
  const { pageId } = usePageContext();
  const [dias, setDias] = useState(30);
  const client = useQueryClient();
  const { data, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useQuery(
    ["analytics", dias, pageId],
    () => getAnalytics(dias),
    { staleTime: 30 * 1000 }
  );

  // Ao vivo: a API avisa (SSE) a cada visita ou clique e a tela busca os números de novo.
  const [aoVivo, setAoVivo] = useState(false);
  const [ultimo, setUltimo] = useState<"view" | "click" | null>(null);
  useEffect(() => {
    const origem = new EventSource("/api/backend/analytics/stream");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const aoEvento = (tipo: "view" | "click") => () => {
      setUltimo(tipo);
      clearTimeout(timer); // vários eventos seguidos viram uma só atualização
      timer = setTimeout(() => client.invalidateQueries("analytics"), 300);
    };
    let jaConectou = false;
    origem.onopen = () => {
      setAoVivo(true);
      // voltou depois de uma queda (repouso, rede): busca o que foi perdido nesse intervalo
      if (jaConectou) client.invalidateQueries("analytics");
      jaConectou = true;
    };
    origem.onerror = () => setAoVivo(false); // o navegador reconecta sozinho
    origem.addEventListener("view", aoEvento("view"));
    origem.addEventListener("click", aoEvento("click"));
    return () => {
      clearTimeout(timer);
      origem.close();
    };
  }, [client]);

  const maximo = Math.max(1, ...(data?.daily.map((d) => Math.max(d.views, d.clicks)) ?? [1]));
  const maxLink = Math.max(1, ...(data?.links.map((l) => l.clicks) ?? [1]));

  return (
    <div className="flex flex-col min-h-[560px]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Analytics
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Visitas e cliques da sua página.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${aoVivo ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}`}
            title={aoVivo ? "Recebendo visitas e cliques em tempo real" : "Sem conexão em tempo real"}
          >
            <i
              className={`w-2 h-2 rounded-full ${aoVivo ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`}
            />
            {aoVivo
              ? ultimo
                ? `Ao vivo · ${ultimo === "click" ? "novo clique" : "nova visita"}`
                : "Ao vivo"
              : "Offline"}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Atualizar"
            title={
              dataUpdatedAt
                ? `Atualizado às ${new Date(dataUpdatedAt).toLocaleTimeString("pt-BR")}`
                : "Atualizar"
            }
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60 transition-colors"
          >
            <ArrowsClockwise size={16} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
          <div
            className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
            role="group"
            aria-label="Período"
          >
            {PERIODOS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={dias === p}
                onClick={() => setDias(p)}
                className={`h-8 px-3 rounded-md text-sm font-medium transition-colors ${
                  dias === p
                    ? "bg-white dark:bg-zinc-700 text-violet-700 dark:text-violet-300 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {p} dias
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : isError || !data ? (
        <p className="text-red-600 text-sm mt-6">Não foi possível carregar os dados. Tente novamente.</p>
      ) : (
        <>
          <div className="flex gap-3 flex-wrap mt-6">
            <Cartao titulo="Visitas" valor={String(data.views)} />
            <Cartao titulo="Cliques" valor={String(data.clicks)} />
            <Cartao
              titulo="Taxa de cliques"
              valor={`${data.ctr.toLocaleString("pt-BR")}%`}
              nota="cliques ÷ visitas"
            />
          </div>

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Por dia</h2>
            <div
              className="flex items-end gap-[3px] h-40 border-b border-zinc-200 dark:border-zinc-800"
              role="img"
              aria-label={`Gráfico de visitas e cliques por dia nos últimos ${data.days} dias`}
            >
              {data.daily.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 min-w-0 h-full flex items-end justify-center gap-px group relative"
                  title={`${formatarDia(d.day)}: ${d.views} visitas, ${d.clicks} cliques`}
                >
                  <div
                    className="w-1/2 rounded-t bg-violet-500"
                    style={{ height: `${(d.views / maximo) * 100}%`, minHeight: d.views ? 2 : 0 }}
                  />
                  <div
                    className="w-1/2 rounded-t bg-emerald-500"
                    style={{ height: `${(d.clicks / maximo) * 100}%`, minHeight: d.clicks ? 2 : 0 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              <span>{formatarDia(data.daily[0].day)}</span>
              <span>{formatarDia(data.daily[data.daily.length - 1].day)}</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-sm bg-violet-500" /> Visitas
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Cliques
              </span>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Cliques por link</h2>
            {data.links.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Você ainda não tem links.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.links.map((l) => (
                  <li key={l.id}>
                    <div className="flex justify-between text-sm text-zinc-800 dark:text-zinc-200 mb-1">
                      <span className="truncate pr-3">{l.name}</span>
                      <span className="font-medium tabular-nums">{l.clicks}</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${(l.clicks / maxLink) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            <section>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Dispositivos</h2>
              <Dispositivos itens={data.devices} />
            </section>
            <section>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                De onde vêm as visitas
              </h2>
              {data.referrers.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sem dados ainda.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {data.referrers.map((r) => (
                    <li key={r.host}>
                      <div className="flex justify-between text-sm text-zinc-800 dark:text-zinc-200 mb-1">
                        <span className="truncate pr-3">
                          {r.host === "direto" ? "Direto / sem origem" : r.host}
                        </span>
                        <span className="font-medium tabular-nums">{r.views}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${(r.views / Math.max(1, data.referrers[0].views)) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mr-2">
              Exportar ({data.days} dias)
            </span>
            <a href={exportUrl("analytics/export", `days=${dias}&kind=daily`)} className={botaoExportar}>
              <DownloadSimple size={16} /> Visitas e cliques por dia
            </a>
            <a href={exportUrl("analytics/export", `days=${dias}&kind=links`)} className={botaoExportar}>
              <DownloadSimple size={16} /> Cliques por link
            </a>
          </section>
        </>
      )}
    </div>
  );
}
