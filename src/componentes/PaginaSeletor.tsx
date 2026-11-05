import { Plus, Trash } from "phosphor-react";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { usePageContext } from "../contexts/PageContext";
import useMe, { ME_KEY } from "../hooks/useMe";
import useApi from "../server/api";

const MAX_PAGINAS_EXTRAS = 5; // mesmo limite da API

// Troca a página que o painel está editando (principal ou extra) e cria/exclui páginas extras.
export default function PaginaSeletor() {
  const { data: me } = useMe();
  const { pageId, setPageId } = usePageContext();
  const { createPage, deletePage } = useApi();
  const client = useQueryClient();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  const paginas = me?.pages ?? [];

  const criar = useMutation((n: string) => createPage(n), {
    onSuccess: async (nova: any) => {
      await client.invalidateQueries(ME_KEY);
      setPageId(nova.id);
      setCriando(false);
      setNome("");
    },
    onError: (err: any) => setErro(err?.response?.data?.message ?? "Não foi possível criar a página."),
  });

  const excluir = useMutation((id: string) => deletePage(id), {
    onSuccess: async () => {
      setPageId("");
      client.removeQueries([ME_KEY, "page"]);
      await client.invalidateQueries();
    },
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    if (nome.trim()) criar.mutate(nome.trim());
  }

  const atual = paginas.find((p) => p.id === pageId);
  if (!me) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4 text-sm">
      <label htmlFor="pagina" className="text-zinc-500 dark:text-zinc-400">Editando:</label>
      <select
        id="pagina"
        value={pageId}
        onChange={(e) => setPageId(e.target.value)}
        className="h-9 rounded-lg px-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500"
      >
        <option value="">Página principal</option>
        {paginas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {paginas.length < MAX_PAGINAS_EXTRAS && !criando && (
        <button type="button" onClick={() => setCriando(true)} className="flex items-center gap-1 h-9 px-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
          <Plus size={14} weight="bold" /> Nova página
        </button>
      )}

      {atual && (
        <button
          type="button"
          onClick={() => window.confirm(`Excluir a página "${atual.name}" com todos os links, contatos e estatísticas dela? Isso não pode ser desfeito.`) && excluir.mutate(atual.id)}
          className="flex items-center gap-1 h-9 px-3 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
        >
          <Trash size={14} /> Excluir
        </button>
      )}

      {criando && (
        <form onSubmit={enviar} className="flex items-center gap-2">
          <input
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da página (ex.: Loja)"
            maxLength={60}
            className="h-9 rounded-lg px-3 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500"
          />
          <button type="submit" disabled={criar.isLoading} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:opacity-60">Criar</button>
          <button type="button" onClick={() => { setCriando(false); setErro(""); }} className="h-9 px-2 text-zinc-500">Cancelar</button>
        </form>
      )}
      {erro && <span className="text-red-600 text-xs">{String(erro)}</span>}
    </div>
  );
}
