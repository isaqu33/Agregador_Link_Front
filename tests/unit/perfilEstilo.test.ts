import { describe, expect, it, vi } from "vitest";

// next/font só existe dentro do build do Next; aqui devolvemos uma fonte falsa
vi.mock("next/font/google", () => {
  const fonte = () => ({ className: "fonte-falsa", variable: "--fonte-falsa" });
  return { Inter: fonte, Poppins: fonte, Playfair_Display: fonte, Roboto_Mono: fonte };
});

import { ESTILO_PADRAO, TEMAS, ehVideo, lerTemplate } from "../../src/perfilEstilo";

const U = "123e4567-e89b-12d3-a456-426614174000";

describe("lerTemplate", () => {
  it("sem template devolve o estilo padrão", () => {
    expect(lerTemplate(undefined)).toEqual(ESTILO_PADRAO);
    expect(lerTemplate("")).toEqual(ESTILO_PADRAO);
  });

  it("JSON quebrado não derruba a página", () => {
    expect(lerTemplate("{não é json")).toEqual(ESTILO_PADRAO);
  });

  it("valores desconhecidos de fonte e botão voltam ao padrão", () => {
    const t = lerTemplate(JSON.stringify({ cor: "#fff", fonte: "comic", botao: "neon" }));
    expect(t.cor).toBe("#fff");
    expect(t.fonte).toBe("inter");
    expect(t.botao).toBe("preenchido");
  });

  it("todo tema pronto é lido sem perder nada", () => {
    for (const tema of TEMAS) {
      const lido = lerTemplate(JSON.stringify(tema));
      expect(lido).toEqual({
        ...ESTILO_PADRAO,
        cor: tema.cor,
        formato: tema.formato,
        fonte: tema.fonte,
        botao: tema.botao,
      });
    }
  });

  it("lê cor do texto, fundo e marca d'água", () => {
    const t = lerTemplate(
      JSON.stringify({ texto: "#112233", fundoMidia: `/media/${"a".repeat(24)}/${U}.mp4`, marca: false })
    );
    expect(t.texto).toBe("#112233");
    expect(t.fundoMidia).toContain(".mp4");
    expect(t.marca).toBe(false);
  });

  it("marca d'água aparece por padrão", () => {
    expect(lerTemplate(undefined).marca).toBe(true);
    expect(lerTemplate(JSON.stringify({ cor: "#000" })).marca).toBe(true);
  });

  it("descarta cor do texto e fundo inválidos (nada vira CSS ou URL arbitrária)", () => {
    const t = lerTemplate(
      JSON.stringify({ texto: "red; background:url(x)", fundoMidia: "https://evil.example/x.mp4" })
    );
    expect(t.texto).toBe("");
    expect(t.fundoMidia).toBe("");
  });

  it("ehVideo reconhece mp4 e webm", () => {
    expect(ehVideo("/media/x/y.mp4")).toBe(true);
    expect(ehVideo("/media/x/y.webm")).toBe(true);
    expect(ehVideo("/media/x/y.png")).toBe(false);
  });
});
