import {
  EnvelopeSimple,
  Globe,
  Heart,
  EnvelopeOpen,
  InstagramLogo,
  LinkBreak,
  Phone,
  SpotifyLogo,
  TextT,
  TiktokLogo,
  TwitchLogo,
  WhatsappLogo,
  YoutubeLogo,
  FacebookLogo,
  GithubLogo,
  LinkedinLogo,
  TwitterLogo,
} from "phosphor-react";

// "url": http(s) | "email": vira mailto: | "telefone": vira tel:+ | "whatsapp": número vira wa.me | "nenhum": só título
export type Campo = "url" | "email" | "telefone" | "whatsapp" | "pix" | "nenhum";

export interface TipoLink {
  name: string; // valor gravado em Link.type (a API valida a mesma lista)
  rotulo: string;
  Icon: (props: any) => JSX.Element;
  campo: Campo;
  tituloObrigatorio: boolean; // false: usa o rótulo como nome se ficar vazio
  tituloModal: string;
  texto: string;
  placeholder: string;
  unavailable: boolean;
}

export const TIPOS_LINK: TipoLink[] = [
  {
    name: "Link",
    rotulo: "Link",
    Icon: (p) => <LinkBreak {...p} />,
    campo: "url",
    tituloObrigatorio: true,
    tituloModal: "Adicionar um link",
    texto: "Cole a URL do site ou página que você quer mostrar.",
    placeholder: "https://seusite.com",
    unavailable: false,
  },
  {
    name: "Cabecalho",
    rotulo: "Cabeçalho",
    Icon: (p) => <TextT {...p} />,
    campo: "nenhum",
    tituloObrigatorio: true,
    tituloModal: "Adicionar um cabeçalho",
    texto: "Um título para separar grupos de links na sua página.",
    placeholder: "",
    unavailable: false,
  },
  {
    name: "Newsletter",
    rotulo: "Captura de e-mail",
    Icon: (p) => <EnvelopeOpen {...p} />,
    campo: "nenhum",
    tituloObrigatorio: true,
    tituloModal: "Adicionar captura de e-mail",
    texto:
      "Um formulário na sua página para os visitantes deixarem o e-mail. Os contatos aparecem na aba Contatos.",
    placeholder: "",
    unavailable: false,
  },
  {
    name: "Pix",
    rotulo: "Gorjeta (Pix)",
    Icon: (p) => <Heart {...p} />,
    campo: "pix",
    tituloObrigatorio: false,
    tituloModal: "Adicionar gorjeta (Pix)",
    texto:
      'Informe sua chave Pix ou o código "copia e cola". O visitante copia a chave (e vê o QR Code, se for copia e cola).',
    placeholder: "chave Pix ou código copia e cola",
    unavailable: false,
  },
  {
    name: "Instagram",
    rotulo: "Instagram",
    Icon: (p) => <InstagramLogo {...p} />,
    campo: "url",
    tituloObrigatorio: false,
    tituloModal: "Adicionar Instagram",
    texto: "Cole o link do seu perfil ou de uma publicação.",
    placeholder: "https://instagram.com/seuusuario",
    unavailable: false,
  },
  {
    name: "Tiktok",
    rotulo: "TikTok",
    Icon: (p) => <TiktokLogo {...p} />,
    campo: "url",
    tituloObrigatorio: false,
    tituloModal: "Adicionar TikTok",
    texto: "Cole o link do seu perfil ou de um vídeo.",
    placeholder: "https://tiktok.com/@seuusuario",
    unavailable: false,
  },
  {
    name: "Whatsapp",
    rotulo: "WhatsApp",
    Icon: (p) => <WhatsappLogo {...p} />,
    campo: "whatsapp",
    tituloObrigatorio: false,
    tituloModal: "Adicionar WhatsApp",
    texto: "Informe seu número com DDD. Abriremos uma conversa direta.",
    placeholder: "(11) 99999-8888",
    unavailable: false,
  },
  {
    name: "Telefone",
    rotulo: "Telefone",
    Icon: (p) => <Phone {...p} />,
    campo: "telefone",
    tituloObrigatorio: false,
    tituloModal: "Adicionar telefone",
    texto: "Informe o número com DDD. Quem tocar vai ligar para você.",
    placeholder: "(11) 99999-8888",
    unavailable: false,
  },
  {
    name: "Email",
    rotulo: "E-mail",
    Icon: (p) => <EnvelopeSimple {...p} />,
    campo: "email",
    tituloObrigatorio: false,
    tituloModal: "Adicionar e-mail",
    texto: "Informe o e-mail que vai receber as mensagens.",
    placeholder: "voce@exemplo.com",
    unavailable: false,
  },
  {
    name: "Youtube",
    rotulo: "YouTube",
    Icon: (p) => <YoutubeLogo {...p} />,
    campo: "url",
    tituloObrigatorio: false,
    tituloModal: "Adicionar YouTube",
    texto: "Cole o link do seu canal ou de um vídeo.",
    placeholder: "https://youtube.com/@seucanal",
    unavailable: false,
  },
  {
    name: "Spotify",
    rotulo: "Spotify",
    Icon: (p) => <SpotifyLogo {...p} />,
    campo: "url",
    tituloObrigatorio: false,
    tituloModal: "Adicionar Spotify",
    texto: "Cole o link de uma música, playlist ou podcast.",
    placeholder: "https://open.spotify.com/...",
    unavailable: false,
  },
  {
    name: "Twitch",
    rotulo: "Twitch",
    Icon: (p) => <TwitchLogo {...p} />,
    campo: "url",
    tituloObrigatorio: false,
    tituloModal: "Adicionar Twitch",
    texto: "Cole o link do seu canal.",
    placeholder: "https://twitch.tv/seucanal",
    unavailable: false,
  },
];

export function tipoPorNome(name?: string) {
  return TIPOS_LINK.find((t) => t.name === name);
}

// Compatibilidade com os componentes que listam os tipos
export const typesSocialMediaa = TIPOS_LINK.map((t, id) => ({
  name: t.name,
  rotulo: t.rotulo,
  Icon: t.Icon,
  unavailable: t.unavailable,
  id,
}));

export const objmodalCreateLink = TIPOS_LINK.map((t) => ({
  type: t.name,
  titulo: t.tituloModal,
  texto: t.texto,
  formatolink: t.placeholder,
}));

// ---------- conversão entre o que o usuário digita e o que a API guarda ----------

const so_digitos = (v: string) => v.replace(/\D/g, "");

// 10–11 dígitos = número brasileiro sem país: acrescenta 55
function comPais(digitos: string) {
  return digitos.length <= 11 ? `55${digitos}` : digitos;
}

export function urlHttpValida(valor: string) {
  try {
    const { protocol } = new URL(valor);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function montarLink(tipo: TipoLink, valor: string): { link: string; erro?: string } {
  const v = valor.trim();
  switch (tipo.campo) {
    case "nenhum":
      return { link: "" };
    case "pix":
      return v.length >= 1 && v.length <= 600 && !/[\u0000-\u001f]/.test(v)
        ? { link: v }
        : { link: "", erro: "Informe a chave Pix (até 600 caracteres)" };
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? { link: `mailto:${v}` }
        : { link: "", erro: "Informe um e-mail válido" };
    case "telefone":
    case "whatsapp": {
      if (tipo.campo === "whatsapp" && urlHttpValida(v)) return { link: v }; // links antigos
      const d = so_digitos(v);
      if (d.length < 10 || d.length > 15) return { link: "", erro: "Informe o número com DDD" };
      return { link: tipo.campo === "whatsapp" ? `https://wa.me/${comPais(d)}` : `tel:+${comPais(d)}` };
    }
    default:
      return urlHttpValida(v)
        ? { link: v }
        : { link: "", erro: "Informe uma URL válida (começando com http:// ou https://)" };
  }
}

// inverso de montarLink: o texto que volta para o campo na edição
export function valorDoLink(tipo: TipoLink | undefined, link = "") {
  if (!tipo) return link;
  if (tipo.campo === "email") return link.replace(/^mailto:/i, "");
  if (tipo.campo === "telefone") return link.replace(/^tel:/i, "");
  if (tipo.campo === "whatsapp") return link.replace(/^https?:\/\/wa\.me\//i, "");
  return link;
}

// ---------- redes sociais do topo da página ----------

export interface Rede {
  id: string; // mesmo valor aceito pela API
  rotulo: string;
  Icon: (props: any) => JSX.Element;
  placeholder: string;
}

export const REDES: Rede[] = [
  {
    id: "instagram",
    rotulo: "Instagram",
    Icon: (p) => <InstagramLogo {...p} />,
    placeholder: "https://instagram.com/seuusuario",
  },
  {
    id: "tiktok",
    rotulo: "TikTok",
    Icon: (p) => <TiktokLogo {...p} />,
    placeholder: "https://tiktok.com/@seuusuario",
  },
  {
    id: "youtube",
    rotulo: "YouTube",
    Icon: (p) => <YoutubeLogo {...p} />,
    placeholder: "https://youtube.com/@seucanal",
  },
  {
    id: "x",
    rotulo: "X (Twitter)",
    Icon: (p) => <TwitterLogo {...p} />,
    placeholder: "https://x.com/seuusuario",
  },
  {
    id: "facebook",
    rotulo: "Facebook",
    Icon: (p) => <FacebookLogo {...p} />,
    placeholder: "https://facebook.com/seuusuario",
  },
  {
    id: "linkedin",
    rotulo: "LinkedIn",
    Icon: (p) => <LinkedinLogo {...p} />,
    placeholder: "https://linkedin.com/in/seuusuario",
  },
  {
    id: "github",
    rotulo: "GitHub",
    Icon: (p) => <GithubLogo {...p} />,
    placeholder: "https://github.com/seuusuario",
  },
  {
    id: "twitch",
    rotulo: "Twitch",
    Icon: (p) => <TwitchLogo {...p} />,
    placeholder: "https://twitch.tv/seucanal",
  },
  {
    id: "spotify",
    rotulo: "Spotify",
    Icon: (p) => <SpotifyLogo {...p} />,
    placeholder: "https://open.spotify.com/user/...",
  },
  {
    id: "whatsapp",
    rotulo: "WhatsApp",
    Icon: (p) => <WhatsappLogo {...p} />,
    placeholder: "https://wa.me/5511999998888",
  },
  {
    id: "email",
    rotulo: "E-mail",
    Icon: (p) => <EnvelopeSimple {...p} />,
    placeholder: "mailto:voce@exemplo.com",
  },
  { id: "site", rotulo: "Site", Icon: (p) => <Globe {...p} />, placeholder: "https://seusite.com" },
];

export const redePorId = (id?: string) => REDES.find((r) => r.id === id);
