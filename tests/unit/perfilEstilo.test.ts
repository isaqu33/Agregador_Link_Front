import { describe, expect, it, vi } from "vitest";

// next/font só existe dentro do build do Next; aqui devolvemos uma fonte falsa
vi.mock("next/font/google", () => {
  const fonte = () => ({ className: "fonte-falsa", variable: "--fonte-falsa" });
  return { Inter: fonte, Poppins: fonte, Playfair_Display: fonte, Roboto_Mono: fonte };
});

import { ESTILO_PADRAO, TEMAS, lerTemplate } from "../../src/perfilEstilo";

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
      expect(lido).toEqual({ cor: tema.cor, formato: tema.formato, fonte: tema.fonte, botao: tema.botao });
    }
  });
});
