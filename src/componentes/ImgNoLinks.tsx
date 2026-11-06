import { Plus } from "phosphor-react";
import { tipoPorNome } from "../utils/objectstoberendered";

// Sugestões rápidas: abrem direto o formulário do tipo escolhido
const SUGESTOES = ["Link", "Instagram", "Whatsapp", "Youtube", "Pix", "Newsletter"];

// Estado vazio da lista de links (nenhum link ainda)
export default function ImgNoLinks({ onEscolher }: { onEscolher?: (tipo: string) => void }) {
  return (
    <div className="w-full rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 px-6 py-10 flex flex-col items-center text-center">
      <span className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center">
        <Plus size={26} weight="bold" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">Sua página ainda não tem links</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-[320px]">
        Adicione o primeiro link para ele aparecer na prévia ao lado. Comece por um destes:
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGESTOES.map((nome) => {
          const tipo = tipoPorNome(nome);
          if (!tipo) return null;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => onEscolher?.(nome)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <tipo.Icon size={16} />
              {tipo.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
