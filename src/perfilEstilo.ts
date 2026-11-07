import { Inter, Playfair_Display, Poppins, Roboto_Mono } from "next/font/google";

// next/font exige que as fontes sejam criadas no escopo do módulo
const inter = Inter({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const mono = Roboto_Mono({ subsets: ["latin"], display: "swap" });

export const FONTES: Record<string, { rotulo: string; className: string }> = {
  inter: { rotulo: "Inter", className: inter.className },
  poppins: { rotulo: "Poppins", className: poppins.className },
  playfair: { rotulo: "Playfair", className: playfair.className },
  mono: { rotulo: "Mono", className: mono.className },
};

export const BOTOES = [
  { id: "preenchido", rotulo: "Preenchido" },
  { id: "contorno", rotulo: "Contorno" },
  { id: "sombra", rotulo: "Sombra" },
];

export const FORMATOS = [
  { formato: "60px", nome: "Redondo" },
  { formato: "10px", nome: "Médio" },
  { formato: "0px", nome: "Reto" },
];

export interface EstiloPerfil {
  cor: string;
  formato: string;
  fonte: string;
  botao: string;
  // cor do texto da página (#rrggbb); vazio = branco
  texto: string;
  // imagem ou vídeo de fundo, enviados por /media; vazio = só a cor/degradê
  fundoMidia: string;
  // "Feito com FaceLink" no rodapé da página pública
  marca: boolean;
}

export const ESTILO_PADRAO: EstiloPerfil = {
  cor: "",
  formato: "",
  fonte: "inter",
  botao: "preenchido",
  texto: "",
  fundoMidia: "",
  marca: true,
};

const COR_HEX = /^#[0-9a-fA-F]{6}$/;
const MIDIA = /^\/media\/[0-9a-f]{24}\/[0-9a-f-]{36}\.(jpg|png|webp|gif|mp4|webm)$/;

export const ehVideo = (url: string) => /\.(mp4|webm)$/i.test(url);

// `template` é um JSON em string na API: { cor, formato, fonte, botao }
export function lerTemplate(template?: string | null): EstiloPerfil {
  if (!template) return { ...ESTILO_PADRAO };
  try {
    const t = JSON.parse(template);
    return {
      cor: typeof t.cor === "string" ? t.cor : "",
      formato: typeof t.formato === "string" ? t.formato : "",
      fonte: typeof t.fonte === "string" && FONTES[t.fonte] ? t.fonte : "inter",
      botao: typeof t.botao === "string" && BOTOES.some((b) => b.id === t.botao) ? t.botao : "preenchido",
      texto: typeof t.texto === "string" && COR_HEX.test(t.texto) ? t.texto : "",
      fundoMidia: typeof t.fundoMidia === "string" && MIDIA.test(t.fundoMidia) ? t.fundoMidia : "",
      marca: t.marca !== false,
    };
  } catch {
    return { ...ESTILO_PADRAO };
  }
}

export const TEMAS = [
  {
    id: "violeta",
    rotulo: "Violeta",
    cor: "linear-gradient(to right top, #4c1d95, #663da5, #7e5bb5, #9679c5, #ae97d4)",
    formato: "60px",
    fonte: "inter",
    botao: "preenchido",
  },
  {
    id: "oceano",
    rotulo: "Oceano",
    cor: "linear-gradient(to right top, #0f2027, #203a43, #2c5364)",
    formato: "10px",
    fonte: "poppins",
    botao: "contorno",
  },
  {
    id: "por-do-sol",
    rotulo: "Pôr do sol",
    cor: "linear-gradient(to right top, #ee0979, #ff6a00)",
    formato: "60px",
    fonte: "poppins",
    botao: "sombra",
  },
  {
    id: "floresta",
    rotulo: "Floresta",
    cor: "linear-gradient(to right top, #134e5e, #71b280)",
    formato: "0px",
    fonte: "inter",
    botao: "sombra",
  },
  { id: "noite", rotulo: "Noite", cor: "#111827", formato: "10px", fonte: "mono", botao: "contorno" },
  {
    id: "elegante",
    rotulo: "Elegante",
    cor: "#1f2937",
    formato: "10px",
    fonte: "playfair",
    botao: "preenchido",
  },
];
