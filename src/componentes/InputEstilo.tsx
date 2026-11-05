import { observer } from "mobx-react";
import AppState from "../AppState";
import { BOTOES, FONTES, TEMAS } from "../perfilEstilo";

const rotulo = "text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block";

function chip(ativo: boolean) {
  return `h-9 px-4 rounded-lg text-sm font-medium border transition-colors ${
    ativo
      ? "bg-violet-600 border-violet-600 text-white"
      : "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
  }`;
}

// Temas prontos, fonte e estilo do botão. Tudo vai para o rascunho (AppState): a prévia reage na hora.
const InputEstilo = observer(({ fonteSalva, botaoSalvo }: { fonteSalva: string; botaoSalvo: string }) => {
  const fonte = AppState.fonte || fonteSalva;
  const botao = AppState.botao || botaoSalvo;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className={rotulo}>Temas prontos</span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {TEMAS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                AppState.incrementcorFundo(t.cor);
                AppState.incrementFormato(t.formato);
                AppState.incrementFonte(t.fonte);
                AppState.incrementBotao(t.botao);
              }}
              className="flex flex-col items-center gap-1.5 group"
            >
              <span
                className="w-full h-14 rounded-xl ring-1 ring-black/10 group-hover:scale-105 transition-transform"
                style={t.cor.includes("linear") ? { backgroundImage: t.cor } : { backgroundColor: t.cor }}
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{t.rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={rotulo}>Fonte</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(FONTES).map(([id, f]) => (
            <button
              key={id}
              type="button"
              aria-pressed={fonte === id}
              onClick={() => AppState.incrementFonte(id)}
              className={`${chip(fonte === id)} ${f.className}`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={rotulo}>Estilo do botão</span>
        <div className="flex flex-wrap gap-2">
          {BOTOES.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={botao === b.id}
              onClick={() => AppState.incrementBotao(b.id)}
              className={chip(botao === b.id)}
            >
              {b.rotulo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default InputEstilo;
