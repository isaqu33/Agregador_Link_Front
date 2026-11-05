"use client";

import { EstiloPerfil, FONTES } from "../perfilEstilo";
import { redePorId, tipoPorNome } from "../utils/objectstoberendered";

export interface DadosPerfil {
  name?: string;
  title?: string | null;
  about?: string | null;
  photoURL?: string | null;
  socials?: { network: string; url: string }[];
  links?: { id?: string; name?: string; link?: string; type?: string; isActivit?: boolean }[];
}

interface Props {
  dados: DadosPerfil;
  estilo: EstiloPerfil;
  // "publico" registra cliques; "preview" é só a prévia do painel
  modo: "publico" | "preview";
  className?: string;
}

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

// Mesma aparência na prévia do painel e na página pública. Sem `window`: renderiza no servidor.
export default function ProfileView({ dados, estilo, modo, className = "" }: Props) {
  const fundoImagem = estilo.cor.includes("linear") ? estilo.cor : undefined;
  const fundoCor = estilo.cor && !fundoImagem ? estilo.cor : undefined;
  const fonte = FONTES[estilo.fonte]?.className ?? "";
  const raio = estilo.formato || "50px";
  const titulo = dados.title || dados.name;

  const estiloBotao: Record<string, { cls: string; style?: React.CSSProperties }> = {
    preenchido: { cls: "bg-[#ffffffb8] text-[#4c1d95] hover:bg-white/90" },
    contorno: { cls: "bg-transparent text-white border-2 border-white/90 hover:bg-white/15" },
    sombra: {
      cls: "bg-white text-[#4c1d95] hover:bg-zinc-100",
      style: { boxShadow: "4px 4px 0 rgba(0,0,0,.35)" },
    },
  };
  const botao = estiloBotao[estilo.botao] ?? estiloBotao.preenchido;

  return (
    <div
      className={`w-full flex justify-center bg-slate-600 ${className}`}
      style={{ backgroundColor: fundoCor, backgroundImage: fundoImagem }}
    >
      <div className={`w-full max-w-[500px] min-h-full text-zinc-100 px-5 pt-12 pb-8 flex flex-col items-center ${fonte}`}>
        <div className="w-20 h-20 rounded-full overflow-hidden bg-black ring-4 ring-white/30 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dados.photoURL || "/assets/feliz.png"}
            alt={titulo ? `Foto de ${titulo}` : "Foto de perfil"}
            className="w-full h-full object-cover"
          />
        </div>

        {titulo ? (
          <h1 className="text-lg font-semibold w-full mt-3 text-center break-words">{titulo}</h1>
        ) : null}
        {dados.about ? (
          <p className="text-xs text-white/80 mt-1 text-center break-words whitespace-pre-line">{dados.about}</p>
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
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <rede.Icon size={18} />
                </a>
              );
            })}
          </div>
        ) : null}

        <div className="w-full flex flex-col mt-6">
          {dados.links
            ?.filter((l) => l.isActivit !== false)
            .map((l, i) => {
              if (l.type === "Cabecalho") {
                return (
                  <h2
                    key={l.id ?? i}
                    className="w-full text-center text-xs font-semibold uppercase tracking-wider text-white/80 mt-3 mb-3 break-words"
                  >
                    {l.name}
                  </h2>
                );
              }
              const Icone = tipoPorNome(l.type)?.Icon;
              return (
                <a
                  key={l.id ?? i}
                  href={l.link}
                  target={externo(l.link ?? "") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={modo === "publico" ? () => registrarClique(l.id) : undefined}
                  style={{ borderRadius: raio, ...botao.style }}
                  className={`relative w-full min-h-[44px] mb-3 px-10 py-2 flex items-center justify-center text-center text-[13px] font-medium transition-colors ${botao.cls}`}
                >
                  {Icone && l.type !== "Link" ? (
                    <span className="absolute left-4 flex items-center">
                      <Icone size={18} />
                    </span>
                  ) : null}
                  <span className="break-words">{l.name}</span>
                </a>
              );
            })}
        </div>

        <p className="mt-auto pt-8 text-[11px] text-white/70 font-medium">
          {modo === "publico" ? (
            <a href="/" className="hover:text-white">
              Feito com FaceLink
            </a>
          ) : (
            "FaceLink"
          )}
        </p>
      </div>
    </div>
  );
}
