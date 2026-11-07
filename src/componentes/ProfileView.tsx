"use client";

import { FormEvent, useState } from "react";
import Dialog from "./Dialog";
import QrCode from "./QrCode";
import ShareButton from "./ShareButton";
import useApi from "../server/api";
import { EstiloPerfil, FONTES, ehVideo } from "../perfilEstilo";
import { redePorId, tipoPorNome } from "../utils/objectstoberendered";

export interface LinkPublico {
  id?: string;
  name?: string;
  link?: string;
  type?: string;
  isActivit?: boolean;
  thumbnail?: string | null;
  featured?: boolean;
  embedUrl?: string | null;
  locked?: boolean;
  startAt?: string | null;
  endAt?: string | null;
}

export interface DadosPerfil {
  name?: string;
  title?: string | null;
  about?: string | null;
  photoURL?: string | null;
  socials?: { network: string; url: string }[];
  links?: LinkPublico[];
}

interface Props {
  dados: DadosPerfil;
  estilo: EstiloPerfil;
  // "publico" registra cliques e usa as funções reais; "preview" é só a prévia do painel
  modo: "publico" | "preview";
  // endereço público da página (botão de compartilhar)
  urlPublica?: string;
  className?: string;
}

// na prévia, links fora do agendamento somem como na página pública (a API já filtra a pública)
function dentroDoPrazo(l: LinkPublico) {
  const agora = Date.now();
  if (l.startAt && new Date(l.startAt).getTime() > agora) return false;
  if (l.endAt && new Date(l.endAt).getTime() <= agora) return false;
  return true;
}

const FUNDO_PADRAO = "linear-gradient(160deg, #7c3aed 0%, #4c1d95 60%, #312e81 100%)";

const externo = (url: string) => /^https?:/i.test(url);

function registrarClique(linkId?: string) {
  if (!linkId) return;
  fetch("/api/backend/analytics/click", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ linkId }),
    keepalive: true,
  }).catch(() => {});
}

// Mesma aparência na prévia do painel e na página pública. Sem `window` na renderização: roda no servidor.
export default function ProfileView({ dados, estilo, modo, urlPublica, className = "" }: Props) {
  const [bloqueado, setBloqueado] = useState<LinkPublico | null>(null);
  const [pix, setPix] = useState<LinkPublico | null>(null);

  // sem cor escolhida: o mesmo degradê roxo do resto do produto (antes era um cinza liso)
  const cor = estilo.cor || FUNDO_PADRAO;
  const fundoImagem = cor.includes("linear") ? cor : undefined;
  const fundoCor = !fundoImagem ? cor : undefined;
  const fonte = FONTES[estilo.fonte]?.className ?? "";
  const raio = estilo.formato || "50px";
  const titulo = dados.title || dados.name;
  const publico = modo === "publico";
  const visiveis = (dados.links ?? []).filter((l) => l.isActivit !== false && (publico || dentroDoPrazo(l)));

  const estiloBotao: Record<string, { cls: string; style?: React.CSSProperties }> = {
    preenchido: { cls: "bg-[#ffffffb8] text-[#4c1d95] hover:bg-white/90" },
    contorno: { cls: "bg-transparent text-white border-2 border-white/90 hover:bg-white/15" },
    sombra: {
      cls: "bg-white text-[#4c1d95] hover:bg-zinc-100",
      style: { boxShadow: "4px 4px 0 rgba(0,0,0,.35)" },
    },
  };
  const botao = estiloBotao[estilo.botao] ?? estiloBotao.preenchido;

  // conteúdo de um botão (miniatura ou ícone + texto)
  function conteudo(l: LinkPublico, grande = false) {
    const Icone = tipoPorNome(l.type)?.Icon;
    return (
      <>
        {l.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.thumbnail} alt="" className="absolute left-2 w-9 h-9 rounded-full object-cover" />
        ) : Icone && l.type !== "Link" ? (
          <span className="absolute left-4 flex items-center">
            <Icone size={18} />
          </span>
        ) : null}
        <span className={`break-words ${grande ? "text-sm font-semibold" : ""}`}>{l.name}</span>
      </>
    );
  }

  const classeBotao = (grande = false) =>
    `relative w-full ${grande ? "min-h-[56px]" : "min-h-[44px]"} px-11 py-2 flex items-center justify-center text-center text-[13px] font-medium transition-colors ${botao.cls}`;

  function renderLink(l: LinkPublico, i: number) {
    const chave = l.id ?? i;

    if (l.type === "Cabecalho") {
      return (
        <h2
          key={chave}
          className="w-full text-center text-xs font-semibold uppercase tracking-wider opacity-80 mt-3 mb-3 break-words"
        >
          {l.name}
        </h2>
      );
    }

    if (l.type === "Newsletter") {
      return (
        <FormularioEmail
          key={chave}
          link={l}
          publico={publico}
          raio={raio}
          botaoCls={botao.cls}
          botaoStyle={botao.style}
        />
      );
    }

    if (l.embedUrl) {
      const altura = l.embedUrl.includes("spotify.com")
        ? /\/embed\/(track|episode)\//.test(l.embedUrl)
          ? 152
          : 352
        : undefined;
      return (
        <div
          key={chave}
          className="w-full mb-3 rounded-xl overflow-hidden bg-black/20"
          style={{ height: altura }}
        >
          <iframe
            src={l.embedUrl}
            title={l.name ?? "Player"}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            className={`w-full border-0 ${altura ? "h-full" : "aspect-video"}`}
          />
        </div>
      );
    }

    const grande = !!l.featured;
    const estiloItem = { borderRadius: grande && l.thumbnail ? `calc(${raio} / 2)` : raio, ...botao.style };
    const bannerFeatured = grande && l.thumbnail;

    // botões que abrem uma janela em vez de um endereço
    if (l.locked || l.type === "Pix") {
      return (
        <button
          key={chave}
          type="button"
          onClick={() => (l.locked ? setBloqueado(l) : setPix(l))}
          style={estiloItem}
          className={`${classeBotao(grande)} mb-3`}
        >
          {conteudo(l, grande)}
          {l.locked && (
            <span aria-hidden className="absolute right-4 text-xs">
              🔒
            </span>
          )}
        </button>
      );
    }

    return (
      <a
        key={chave}
        href={l.link}
        target={externo(l.link ?? "") ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={publico ? () => registrarClique(l.id) : undefined}
        style={
          bannerFeatured
            ? { borderRadius: `calc(${raio} / 2)`, overflow: "hidden", ...botao.style }
            : estiloItem
        }
        className={
          bannerFeatured ? `block w-full mb-3 transition-colors ${botao.cls}` : `${classeBotao(grande)} mb-3`
        }
      >
        {bannerFeatured ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.thumbnail as string} alt="" className="w-full aspect-video object-cover" />
            <span className="block px-4 py-3 text-center text-sm font-semibold break-words">{l.name}</span>
          </>
        ) : (
          conteudo(l, grande)
        )}
      </a>
    );
  }

  return (
    <div
      className={`relative overflow-hidden w-full flex justify-center bg-slate-600 ${className}`}
      style={{ backgroundColor: fundoCor, backgroundImage: fundoImagem }}
    >
      {estilo.fundoMidia ? (
        <>
          {ehVideo(estilo.fundoMidia) ? (
            // decorativo: sem som, em loop, e some com "reduzir movimento" (fica só a cor)
            <video
              src={estilo.fundoMidia}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={estilo.fundoMidia}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* véu escuro para o texto continuar legível sobre qualquer imagem */}
          <div aria-hidden className="absolute inset-0 bg-black/35" />
        </>
      ) : null}
      <div
        className={`relative w-full max-w-[500px] min-h-full text-zinc-100 px-5 pt-12 pb-8 flex flex-col items-center ${fonte}`}
        style={estilo.texto ? { color: estilo.texto } : undefined}
      >
        {publico && urlPublica ? (
          <ShareButton
            url={urlPublica}
            titulo={titulo ?? undefined}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-inherit flex items-center justify-center transition-colors"
          />
        ) : null}

        <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 ring-4 ring-white/30 shrink-0 flex items-center justify-center">
          {dados.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dados.photoURL}
              alt={titulo ? `Foto de ${titulo}` : "Foto de perfil"}
              className="w-full h-full object-cover"
            />
          ) : (
            // sem foto: inicial do nome (antes aparecia uma carinha que não combinava com o design)
            <span aria-hidden className="text-3xl font-semibold select-none">
              {(titulo ?? "?").trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>

        {titulo ? (
          <h1 className="text-lg font-semibold w-full mt-3 text-center break-words">{titulo}</h1>
        ) : null}
        {dados.about ? (
          <p className="text-xs opacity-80 mt-1 text-center break-words whitespace-pre-line">{dados.about}</p>
        ) : null}

        {dados.socials && dados.socials.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {dados.socials.map((s, i) => {
              const rede = redePorId(s.network);
              if (!rede) return null;
              return (
                <a
                  key={`${s.network}-${i}`}
                  href={s.url}
                  target={externo(s.url) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={rede.rotulo}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-inherit flex items-center justify-center transition-colors"
                >
                  <rede.Icon size={18} />
                </a>
              );
            })}
          </div>
        ) : null}

        <div className="w-full flex flex-col mt-6">
          {visiveis.map(renderLink)}
          {visiveis.length === 0 &&
            (publico ? (
              <p className="text-center text-sm opacity-70">Ainda não há links por aqui.</p>
            ) : (
              <EstadoVazioPrevia />
            ))}
        </div>

        {estilo.marca ? (
          <p className="mt-auto pt-8 text-[11px] opacity-70 font-medium">
            {publico ? (
              <a href="/" className="hover:opacity-100">
                Feito com FaceLink
              </a>
            ) : (
              "FaceLink"
            )}
          </p>
        ) : null}
      </div>

      {bloqueado && <JanelaSenha link={bloqueado} publico={publico} onClose={() => setBloqueado(null)} />}
      {pix && <JanelaPix link={pix} onClose={() => setPix(null)} />}
    </div>
  );
}

// ---------- link com senha ----------
function JanelaSenha({
  link,
  publico,
  onClose,
}: {
  link: LinkPublico;
  publico: boolean;
  onClose: () => void;
}) {
  const { unlockLink } = useApi();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [destino, setDestino] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!publico) return;
    setErro("");
    setCarregando(true);
    try {
      const { link: url } = await unlockLink(link.id as string, senha);
      registrarClique(link.id);
      setDestino(url);
    } catch (err: any) {
      setErro(
        err?.response?.status === 429
          ? "Muitas tentativas. Tente de novo em alguns minutos."
          : "Senha incorreta."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Dialog titulo={link.name ?? "Link protegido"} onClose={onClose}>
      {destino ? (
        <a
          href={destino}
          target={externo(destino) ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={onClose}
          className="block text-center rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5"
        >
          Abrir link
        </a>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-3">
          <p className="text-sm text-zinc-600">
            {publico
              ? "Este link é protegido. Digite a senha para abrir."
              : "Na página pública, quem clicar digita a senha aqui."}
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            maxLength={72}
            autoFocus
            disabled={!publico}
            className="w-full h-11 rounded-lg px-3 text-sm border border-zinc-300 outline-none focus:border-violet-500"
          />
          {erro && (
            <p role="alert" className="text-red-600 text-xs">
              {erro}
            </p>
          )}
          <button
            type="submit"
            disabled={!publico || carregando || !senha}
            className="h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-60"
          >
            {carregando ? "Verificando..." : "Desbloquear"}
          </button>
        </form>
      )}
    </Dialog>
  );
}

// ---------- gorjeta (Pix) ----------
function JanelaPix({ link, onClose }: { link: LinkPublico; onClose: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const chave = link.link ?? "";
  // "copia e cola" (BR Code) começa com 000201: dá para virar QR Code
  const ehCopiaECola = chave.startsWith("000201");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(chave);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  }

  return (
    <Dialog titulo={link.name ?? "Pix"} onClose={onClose}>
      <div className="flex flex-col items-center gap-3">
        {ehCopiaECola && <QrCode texto={chave} tamanho={200} />}
        <p className="w-full text-xs text-zinc-500">{ehCopiaECola ? "Pix copia e cola" : "Chave Pix"}</p>
        <code className="w-full text-xs bg-zinc-100 rounded-lg p-2.5 break-all max-h-24 overflow-auto">
          {chave}
        </code>
        <button
          type="button"
          onClick={copiar}
          className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
        >
          {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>
    </Dialog>
  );
}

// ---------- captura de e-mail ----------
function FormularioEmail({
  link,
  publico,
  raio,
  botaoCls,
  botaoStyle,
}: {
  link: LinkPublico;
  publico: boolean;
  raio: string;
  botaoCls: string;
  botaoStyle?: React.CSSProperties;
}) {
  const { captureLead } = useApi();
  const [email, setEmail] = useState("");
  const [armadilha, setArmadilha] = useState(""); // campo escondido: só robôs preenchem
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "erro">("");

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!publico) return;
    setEstado("enviando");
    try {
      await captureLead({ linkId: link.id as string, email: email.trim(), website: armadilha });
      setEstado("ok");
      setEmail("");
    } catch {
      setEstado("erro");
    }
  }

  const raioCampo = raio === "60px" ? "9999px" : raio;
  return (
    <form onSubmit={enviar} className="w-full mb-3 flex flex-col gap-2" noValidate>
      <p className="text-center text-sm font-semibold break-words">{link.name}</p>
      {estado === "ok" ? (
        <p role="status" className="text-center text-sm rounded-lg bg-white/20 py-3">
          Obrigado! Você está na lista.
        </p>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            aria-label="Seu e-mail"
            maxLength={254}
            style={{ borderRadius: raioCampo }}
            className="w-full h-11 px-4 text-sm text-zinc-900 bg-white/95 outline-none placeholder:text-zinc-500"
          />
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={armadilha}
            onChange={(e) => setArmadilha(e.target.value)}
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />
          <button
            type="submit"
            disabled={estado === "enviando" || !email}
            style={{ borderRadius: raio, ...botaoStyle }}
            className={`w-full min-h-[44px] text-[13px] font-medium disabled:opacity-60 ${botaoCls}`}
          >
            {estado === "enviando" ? "Enviando..." : "Quero receber"}
          </button>
          {estado === "erro" && (
            <p role="alert" className="text-center text-xs text-red-200">
              Não foi possível enviar. Confira o e-mail.
            </p>
          )}
        </>
      )}
    </form>
  );
}

// Prévia do painel sem nenhum link: mostra onde eles vão aparecer
function EstadoVazioPrevia() {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-11 rounded-full border border-dashed border-white/40 bg-white/10 flex items-center justify-center text-[12px] text-white/70"
          style={{ opacity: 1 - i * 0.3 }}
        >
          {i === 0 ? "Seus links aparecem aqui" : ""}
        </div>
      ))}
    </div>
  );
}
