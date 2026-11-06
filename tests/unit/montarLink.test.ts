import { describe, expect, it } from "vitest";
import { montarLink, tipoPorNome, urlHttpValida, valorDoLink } from "../../src/utils/objectstoberendered";

const tipo = (nome: string) => {
  const t = tipoPorNome(nome);
  if (!t) throw new Error(`tipo ${nome} não existe`);
  return t;
};

describe("urlHttpValida", () => {
  it("aceita só http e https", () => {
    expect(urlHttpValida("https://example.com")).toBe(true);
    expect(urlHttpValida("http://example.com")).toBe(true);
    expect(urlHttpValida("javascript:alert(1)")).toBe(false);
    expect(urlHttpValida("ftp://example.com")).toBe(false);
    expect(urlHttpValida("texto solto")).toBe(false);
  });
});

describe("montarLink", () => {
  it("WhatsApp: número com DDD vira wa.me com 55", () => {
    expect(montarLink(tipo("Whatsapp"), "(11) 91234-5678").link).toBe("https://wa.me/5511912345678");
  });

  it("WhatsApp: número curto demais é recusado", () => {
    expect(montarLink(tipo("Whatsapp"), "1234").erro).toBeTruthy();
  });

  it("Telefone vira tel:", () => {
    expect(montarLink(tipo("Telefone"), "11 91234-5678").link).toBe("tel:+5511912345678");
  });

  it("E-mail vira mailto: e recusa texto inválido", () => {
    expect(montarLink(tipo("Email"), "maria@example.com").link).toBe("mailto:maria@example.com");
    expect(montarLink(tipo("Email"), "maria").erro).toBeTruthy();
  });

  it("Link recusa javascript: e aceita https", () => {
    expect(montarLink(tipo("Link"), "javascript:alert(1)").erro).toBeTruthy();
    expect(montarLink(tipo("Link"), " https://example.com ").link).toBe("https://example.com");
  });

  it("Pix exige uma chave", () => {
    expect(montarLink(tipo("Pix"), "").erro).toBeTruthy();
    expect(montarLink(tipo("Pix"), "maria@example.com").link).toBe("maria@example.com");
  });
});

describe("valorDoLink (inverso de montarLink)", () => {
  it("devolve o texto que o usuário digitou", () => {
    expect(valorDoLink(tipo("Email"), "mailto:a@b.co")).toBe("a@b.co");
    expect(valorDoLink(tipo("Whatsapp"), "https://wa.me/5511912345678")).toBe("5511912345678");
    expect(valorDoLink(tipo("Telefone"), "tel:+5511912345678")).toBe("+5511912345678");
  });
});
