import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../server/api";
import { ME_KEY } from "../hooks/useMe";
import { CreateLink } from "../utils/types";
import { montarLink, tipoPorNome } from "../utils/objectstoberendered";
import OpcoesLink, { opcoesIniciais, opcoesParaApi, OpcoesState, validarOpcoes } from "./OpcoesLink";

interface ModalCreateLinkProp {
  cancelModal: (item: any) => any;
  typeLinkSelected: { type: string; titulo: string; texto: string; formatolink: string };
  clinTypeSelected: (item: string) => any;
}

const inputClass =
  "w-full h-11 rounded-lg px-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-500/30 transition";

function ModalCreateLink({ cancelModal, typeLinkSelected, clinTypeSelected }: ModalCreateLinkProp) {
  const { CreateNewLink } = useApi();
  const client = useQueryClient();
  const tipo = tipoPorNome(typeLinkSelected.type);

  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [opcoes, setOpcoes] = useState<OpcoesState>(opcoesIniciais());
  const [erros, setErros] = useState<{ titulo?: string; valor?: string; geral?: string }>({});

  const fechar = () => {
    cancelModal(false);
    clinTypeSelected("");
  };

  const { mutate, isLoading } = useMutation((data: CreateLink) => CreateNewLink(data), {
    onSuccess: async () => {
      await client.invalidateQueries(ME_KEY);
      fechar();
    },
    onError: () => setErros({ geral: "Não foi possível adicionar. Confira os dados e tente de novo." }),
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!tipo) return;

    const novos: typeof erros = {};
    const nome = titulo.trim() || (tipo.tituloObrigatorio ? "" : tipo.rotulo);
    if (!nome) novos.titulo = "Informe um título";

    let link = "";
    if (tipo.campo !== "nenhum") {
      const resultado = montarLink(tipo, valor);
      if (resultado.erro) novos.valor = resultado.erro;
      link = resultado.link;
    }
    const erroOpcoes = tipo.name === "Cabecalho" ? null : validarOpcoes(opcoes);
    if (erroOpcoes) novos.geral = erroOpcoes;
    setErros(novos);
    if (Object.keys(novos).length) return;

    mutate({ name: nome, link, type: tipo.name, ...(tipo.name === "Cabecalho" ? {} : opcoesParaApi(opcoes, false)) });
  }

  if (!tipo) return null;

  return (
    <div className="w-full flex justify-center py-2">
      <form onSubmit={enviar} noValidate className="w-full max-w-[420px] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 shrink-0 bg-violet-600 rounded-lg flex justify-center items-center">
            <tipo.Icon color="#ffffff" size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              {typeLinkSelected.titulo}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{typeLinkSelected.texto}</p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Título{tipo.tituloObrigatorio ? "" : " (opcional)"}
          </span>
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            placeholder={tipo.tituloObrigatorio ? "" : tipo.rotulo}
            autoFocus
          />
          {erros.titulo && <span className="text-red-600 text-xs">{erros.titulo}</span>}
        </label>

        {tipo.campo !== "nenhum" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {tipo.campo === "email" ? "E-mail" : tipo.campo === "url" ? "URL" : tipo.campo === "pix" ? "Chave Pix" : "Número"}
            </span>
            <input
              className={inputClass}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              maxLength={2000}
              placeholder={tipo.placeholder}
              inputMode={tipo.campo === "telefone" || tipo.campo === "whatsapp" ? "tel" : undefined}
            />
            {erros.valor && <span className="text-red-600 text-xs">{erros.valor}</span>}
          </label>
        )}

        <OpcoesLink tipo={tipo.name} value={opcoes} onChange={setOpcoes} podeEmbed={tipo.name === "Youtube" || tipo.name === "Spotify"} />

        {erros.geral && <p className="text-red-600 text-sm">{erros.geral}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={fechar}
            className="h-10 px-5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="h-10 px-5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalCreateLink;
