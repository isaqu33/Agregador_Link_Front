import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash } from "phosphor-react";
import { useMutation, useQueryClient } from "react-query";
import useMe, { ME_KEY } from "../hooks/useMe";
import useApi from "../server/api";
import { REDES, redePorId, urlHttpValida } from "../utils/objectstoberendered";
import { Social } from "../utils/types";

const MAX_REDES = 8;
const inputClass =
  "w-full h-11 rounded-lg px-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-500/30 transition";
const botaoPrimario =
  "h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60";

function mensagemDaApi(err: any, padrao: string) {
  const status = err?.response?.status;
  if (status === 409) return "Esse nome de usuário já está em uso ou não está disponível.";
  const msg = err?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : typeof msg === "string" ? msg : padrao;
}

export default function Profile() {
  const { data: me } = useMe();
  const { editProfile } = useApi();
  const client = useQueryClient();

  const [username, setUsername] = useState("");
  const [redes, setRedes] = useState<Social[]>([]);
  const [erroUser, setErroUser] = useState("");
  const [erroRedes, setErroRedes] = useState("");
  const [okUser, setOkUser] = useState(false);
  const [okRedes, setOkRedes] = useState(false);

  useEffect(() => {
    setUsername(me?.username ?? "");
    setRedes(me?.socials ?? []);
  }, [me?.username, me?.socials]);

  const salvarUser = useMutation((u: string) => editProfile({ username: u }), {
    onSuccess: async () => {
      await client.invalidateQueries(ME_KEY);
      setOkUser(true);
    },
    onError: (err) => setErroUser(mensagemDaApi(err, "Não foi possível salvar o usuário.")),
  });

  const salvarRedes = useMutation((r: Social[]) => editProfile({ socials: r }), {
    onSuccess: async () => {
      await client.invalidateQueries(ME_KEY);
      setOkRedes(true);
    },
    onError: (err) => setErroRedes(mensagemDaApi(err, "Não foi possível salvar as redes.")),
  });

  function enviarUser(e: FormEvent) {
    e.preventDefault();
    setOkUser(false);
    const u = username.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9_.]{2,29}$/.test(u)) {
      setErroUser("Use de 3 a 30 caracteres: letras minúsculas, números, _ e . (começando por letra ou número).");
      return;
    }
    setErroUser("");
    salvarUser.mutate(u);
  }

  function enviarRedes(e: FormEvent) {
    e.preventDefault();
    setOkRedes(false);
    const limpas = redes.map((r) => ({ network: r.network, url: r.url.trim() })).filter((r) => r.url);
    for (const r of limpas) {
      const ok = r.network === "email" ? /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(r.url) : urlHttpValida(r.url);
      if (!ok) {
        setErroRedes(
          `${redePorId(r.network)?.rotulo}: ${r.network === "email" ? "use mailto:voce@exemplo.com" : "informe uma URL começando com http:// ou https://"}`
        );
        return;
      }
    }
    setErroRedes("");
    salvarRedes.mutate(limpas);
  }

  const atualizar = (i: number, parcial: Partial<Social>) =>
    setRedes((lista) => lista.map((r, idx) => (idx === i ? { ...r, ...parcial } : r)));

  const origem = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-col min-h-[560px] gap-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Perfil</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Escolha o endereço da sua página e as redes sociais que aparecem no topo.
        </p>

        <form onSubmit={enviarUser} className="mt-6 flex flex-col gap-2" noValidate>
          <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nome de usuário
          </label>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[220px] flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 dark:focus-within:ring-violet-500/30 transition">
              <span className="pl-3 text-sm text-zinc-500 dark:text-zinc-400 select-none">@</span>
              <input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase());
                  setOkUser(false);
                }}
                maxLength={30}
                placeholder="seunome"
                autoComplete="off"
                className="w-full h-11 px-1 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>
            <button type="submit" className={botaoPrimario} disabled={salvarUser.isLoading}>
              {salvarUser.isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sua página: <span className="font-medium">{origem}/@{username || "seunome"}</span>
          </p>
          {erroUser && <p className="text-red-600 text-sm">{erroUser}</p>}
          {okUser && <p className="text-emerald-600 text-sm">Endereço salvo!</p>}
        </form>
      </section>

      <section className="border-t border-zinc-100 dark:border-zinc-800 pt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Redes sociais no topo</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Aparecem como ícones logo abaixo do seu nome (até {MAX_REDES}).
        </p>

        <form onSubmit={enviarRedes} className="mt-4 flex flex-col gap-3" noValidate>
          {redes.map((r, i) => {
            const rede = redePorId(r.network);
            return (
              <div key={i} className="flex gap-2 items-center">
                <select
                  aria-label="Rede social"
                  value={r.network}
                  onChange={(e) => atualizar(i, { network: e.target.value })}
                  className={`${inputClass} !w-[150px] shrink-0`}
                >
                  {REDES.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.rotulo}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Endereço de ${rede?.rotulo}`}
                  value={r.url}
                  onChange={(e) => atualizar(i, { url: e.target.value })}
                  placeholder={rede?.placeholder}
                  maxLength={500}
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label="Remover rede"
                  onClick={() => setRedes((l) => l.filter((_, idx) => idx !== i))}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash size={18} />
                </button>
              </div>
            );
          })}

          {redes.length < MAX_REDES && (
            <button
              type="button"
              onClick={() => setRedes((l) => [...l, { network: "instagram", url: "" }])}
              className="self-start flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <Plus size={16} weight="bold" />
              Adicionar rede
            </button>
          )}

          {erroRedes && <p className="text-red-600 text-sm">{erroRedes}</p>}
          {okRedes && <p className="text-emerald-600 text-sm">Redes salvas!</p>}

          <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button type="submit" className={botaoPrimario} disabled={salvarRedes.isLoading}>
              {salvarRedes.isLoading ? "Salvando..." : "Salvar redes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
