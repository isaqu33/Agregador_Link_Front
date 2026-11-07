import { useRef, useState } from "react";
import { observer } from "mobx-react";
import AppState from "../AppState";
import useApi from "../server/api";
import { EstiloPerfil, ehVideo } from "../perfilEstilo";

const rotulo = "text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block";
const botaoSec =
  "h-9 px-4 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60";

const LIMITE_IMAGEM = 5 * 1024 * 1024;
const LIMITE_VIDEO = 15 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];

// Fundo com imagem ou vídeo, cor do texto e marca d'água. Tudo vai para o rascunho (AppState):
// a prévia reage na hora e só salva em "Atualizar".
const InputPersonalizar = observer(({ atual }: { atual: EstiloPerfil }) => {
  const { uploadImage } = useApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const midia = AppState.fundoMidia === "remover" ? "" : AppState.fundoMidia || atual.fundoMidia;
  const texto = AppState.texto || atual.texto || "#ffffff";
  const marca = AppState.marca ? AppState.marca === "sim" : atual.marca;

  async function escolher(arquivo?: File) {
    if (!arquivo) return;
    setErro("");
    if (!TIPOS.includes(arquivo.type)) {
      setErro("Envie uma imagem (JPEG, PNG, WebP, GIF) ou um vídeo (MP4, WebM).");
      return;
    }
    const video = arquivo.type.startsWith("video/");
    if (arquivo.size > (video ? LIMITE_VIDEO : LIMITE_IMAGEM)) {
      setErro(video ? "O vídeo pode ter no máximo 15 MB." : "A imagem pode ter no máximo 5 MB.");
      return;
    }
    setEnviando(true);
    try {
      AppState.incrementFundoMidia(await uploadImage(arquivo));
    } catch {
      setErro("Não foi possível enviar o arquivo. Tente de novo.");
    } finally {
      setEnviando(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className={rotulo}>Imagem ou vídeo de fundo</span>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="w-14 h-20 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 ring-1 ring-black/10 shrink-0 flex items-center justify-center text-[10px] text-zinc-500"
            aria-hidden
          >
            {midia ? (
              ehVideo(midia) ? (
                <video src={midia} muted playsInline className="w-full h-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={midia} alt="" className="w-full h-full object-cover" />
              )
            ) : (
              "nenhum"
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className={botaoSec}
                disabled={enviando}
                onClick={() => inputRef.current?.click()}
              >
                {enviando ? "Enviando..." : midia ? "Trocar arquivo" : "Enviar imagem ou vídeo"}
              </button>
              {midia && (
                <button
                  type="button"
                  className={botaoSec}
                  onClick={() => AppState.incrementFundoMidia("remover")}
                >
                  Remover
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Imagem até 5 MB ou vídeo MP4/WebM até 15 MB (toca em loop, sem som).
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS.join(",")}
            className="hidden"
            onChange={(e) => escolher(e.target.files?.[0])}
          />
        </div>
        {erro && <p className="text-red-600 text-xs mt-2">{erro}</p>}
      </div>

      <div>
        <span className={rotulo}>Cor do texto</span>
        <div className="flex items-center gap-3">
          <input
            type="color"
            aria-label="Cor do texto"
            value={texto}
            onChange={(e) => AppState.incrementTexto(e.target.value)}
            className="w-10 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent cursor-pointer p-0.5"
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-300 tabular-nums">{texto}</span>
          {(AppState.texto || atual.texto) && (
            <button type="button" className={botaoSec} onClick={() => AppState.incrementTexto("#ffffff")}>
              Voltar ao branco
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          Vale para o nome, a descrição, os títulos de seção e os ícones. Os botões mantêm o estilo escolhido
          acima.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={marca}
            onChange={(e) => AppState.incrementMarca(e.target.checked ? "sim" : "nao")}
            className="w-4 h-4 accent-violet-600"
          />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Mostrar "Feito com FaceLink" no rodapé da página
          </span>
        </label>
      </div>
    </div>
  );
});

export default InputPersonalizar;
