import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "phosphor-react";
import useApi from "../server/api";
import { LinkOptions, link } from "../utils/types";

// Opções avançadas de um link: miniatura, destaque, agendamento, player e senha.
export interface OpcoesState {
  thumbnail: string | null;
  featured: boolean;
  startAt: string; // valor do <input type="datetime-local"> ("" = sem)
  endAt: string;
  embed: boolean;
  locked: boolean; // já tem senha salva
  password: string; // nova senha ("" = não mexer)
  removePassword: boolean;
}

const doisDigitos = (n: number) => String(n).padStart(2, "0");

function isoParaLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}T${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

export function opcoesIniciais(l?: link): OpcoesState {
  return {
    thumbnail: l?.thumbnail ?? null,
    featured: !!l?.featured,
    startAt: isoParaLocal(l?.startAt),
    endAt: isoParaLocal(l?.endAt),
    embed: !!l?.embed,
    locked: !!l?.locked,
    password: "",
    removePassword: false,
  };
}

// edição: envia sempre os campos (null limpa); criação: só o que foi preenchido
export function opcoesParaApi(o: OpcoesState, editando: boolean): LinkOptions {
  const out: LinkOptions = {};
  const iso = (v: string) => (v ? new Date(v).toISOString() : null);

  if (editando || o.thumbnail) out.thumbnail = o.thumbnail;
  if (editando || o.featured) out.featured = o.featured;
  if (editando || o.startAt) out.startAt = iso(o.startAt);
  if (editando || o.endAt) out.endAt = iso(o.endAt);
  if (editando || o.embed) out.embed = o.embed;
  if (o.password) out.password = o.password;
  else if (editando && o.removePassword) out.removePassword = true;
  return out;
}

export function validarOpcoes(o: OpcoesState): string | null {
  if (o.startAt && o.endAt && new Date(o.endAt) <= new Date(o.startAt)) {
    return "O fim do agendamento deve ser depois do início.";
  }
  if (o.password && (o.password.length < 4 || o.password.length > 72)) {
    return "A senha do link deve ter de 4 a 72 caracteres.";
  }
  return null;
}

const campo =
  "w-full h-10 rounded-lg px-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-500/30 transition";
const rotulo = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

function Caixa({
  marcado,
  onChange,
  children,
  desc,
}: {
  marcado: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  desc?: string;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={marcado}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-violet-600"
      />
      <span className="flex flex-col">
        <span className={rotulo}>{children}</span>
        {desc && <span className="text-xs text-zinc-500 dark:text-zinc-400">{desc}</span>}
      </span>
    </label>
  );
}

interface Props {
  tipo: string; // Link.type
  value: OpcoesState;
  onChange: (v: OpcoesState) => void;
  podeEmbed: boolean; // YouTube/Spotify
}

export default function OpcoesLink({ tipo, value, onChange, podeEmbed }: Props) {
  const { uploadImage } = useApi();
  const arquivo = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  if (tipo === "Cabecalho") return null;
  const set = (parcial: Partial<OpcoesState>) => onChange({ ...value, ...parcial });
  const semUrl = tipo === "Newsletter";

  async function escolher(file?: File) {
    if (!file) return;
    setErro("");
    if (!file.type.startsWith("image/")) return setErro("Escolha uma imagem.");
    if (file.size > 5 * 1024 * 1024) return setErro("A imagem pode ter até 5 MB.");
    setEnviando(true);
    try {
      set({ thumbnail: await uploadImage(file) });
    } catch {
      setErro("Não foi possível enviar a imagem.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <details className="rounded-lg border border-zinc-200 dark:border-zinc-800 group">
      <summary className="cursor-pointer select-none px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 list-none flex items-center justify-between">
        Opções avançadas
        <span className="text-xs text-zinc-400 group-open:hidden">miniatura, destaque, agendamento…</span>
      </summary>

      <div className="px-3 pb-3 pt-1 flex flex-col gap-4">
        {!semUrl && (
          <div className="flex flex-col gap-1.5">
            <span className={rotulo}>Miniatura</span>
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-zinc-400">
                {value.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={value.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={22} />
                )}
              </span>
              <input
                ref={arquivo}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  escolher(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => arquivo.current?.click()}
                disabled={enviando}
                className="h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-60"
              >
                {enviando ? "Enviando..." : value.thumbnail ? "Trocar" : "Escolher imagem"}
              </button>
              {value.thumbnail && (
                <button
                  type="button"
                  aria-label="Remover miniatura"
                  onClick={() => set({ thumbnail: null })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {erro && <span className="text-red-600 text-xs">{erro}</span>}
          </div>
        )}

        <Caixa
          marcado={value.featured}
          onChange={(v) => set({ featured: v })}
          desc="Aparece maior na sua página (com a miniatura em destaque)."
        >
          Destacar este link
        </Caixa>

        {podeEmbed && (
          <Caixa
            marcado={value.embed}
            onChange={(v) => set({ embed: v })}
            desc="Mostra o player do vídeo/música direto na página, no lugar do botão."
          >
            Mostrar player
          </Caixa>
        )}

        <div className="flex flex-col gap-1.5">
          <span className={rotulo}>Agendamento</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              Aparece a partir de
              <input
                type="datetime-local"
                className={campo}
                value={value.startAt}
                onChange={(e) => set({ startAt: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              Some em
              <input
                type="datetime-local"
                className={campo}
                value={value.endAt}
                onChange={(e) => set({ endAt: e.target.value })}
              />
            </label>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Deixe vazio para ficar sempre visível.
          </span>
        </div>

        {!semUrl && (
          <div className="flex flex-col gap-1.5">
            <span className={rotulo}>Senha do link</span>
            <input
              type="password"
              className={campo}
              value={value.password}
              onChange={(e) => set({ password: e.target.value, removePassword: false })}
              placeholder={value.locked ? "Nova senha (deixe vazio para manter)" : "Sem senha"}
              autoComplete="new-password"
              maxLength={72}
            />
            {value.locked && (
              <Caixa
                marcado={value.removePassword}
                onChange={(v) => set({ removePassword: v, password: v ? "" : value.password })}
              >
                Remover a senha atual
              </Caixa>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Quem clicar precisa digitar a senha para abrir. O endereço real nunca é enviado antes disso.
            </span>
          </div>
        )}
      </div>
    </details>
  );
}
