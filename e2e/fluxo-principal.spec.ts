import { expect, test } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://localhost:3070";

// Each run creates its own user, so it never depends on (or pollutes) existing data.
const email = `e2e+${Date.now()}@example.com`;
const senha = "senha-e2e-12345";

test.describe("fluxo principal", () => {
  let userId = "";

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${API}/auth/register`, {
      data: { name: "Pessoa E2E", email, password: senha },
    });
    expect(res.status()).toBe(201);
    userId = (await res.json()).user.id;
  });

  test("login recusa senha errada", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Senha").fill("senha-errada-123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("entra, cria um link e ele aparece na página pública renderizada no servidor", async ({
    page,
    request,
  }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Senha").fill(senha);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/costumer/);

    // estado vazio com atalhos
    await expect(page.getByText("Sua página ainda não tem links")).toBeVisible();
    await page.getByRole("button", { name: "Link", exact: true }).click();

    await page.getByLabel("Título").fill("Meu portfólio");
    await page.getByLabel("URL").fill("https://example.com/portfolio");
    await page.getByRole("button", { name: "Adicionar" }).click();
    await expect(page.getByText("Meu portfólio").first()).toBeVisible();

    // a página pública vem como HTML pronto (SSR), sem depender de JavaScript
    const html = await (await request.get(`/${userId}`)).text();
    expect(html).toContain("Meu portfólio");
    expect(html).toContain('property="og:title"');
  });

  test("rota privada sem sessão redireciona para o login", async ({ page }) => {
    await page.goto("/costumer");
    await expect(page).toHaveURL(/\/login/);
  });

  test("o proxy não aceita rota fora da lista branca", async ({ request }) => {
    const res = await request.get("/api/backend/health/ready");
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
