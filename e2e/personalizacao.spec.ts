import { expect, test } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://localhost:3070";
const email = `e2e+pers${Date.now()}@example.com`;
const senha = "senha-e2e-12345";

test("fundo em vídeo, cor do texto e marca d'água aparecem na página pública", async ({ page, request }) => {
  const reg = await request.post(`${API}/auth/register`, {
    data: { name: "Pessoa Visual", email, password: senha },
  });
  const userId = (await reg.json()).user.id;

  // grava um vídeo WebM curto no próprio navegador (não depende de arquivo nem de ffmpeg)
  await page.goto("/login");
  const base64: string = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 240;
    const ctx = canvas.getContext("2d")!;
    const rec = new MediaRecorder(canvas.captureStream(15), { mimeType: "video/webm" });
    const partes: Blob[] = [];
    rec.ondataavailable = (e) => partes.push(e.data);
    const fim = new Promise<void>((ok) => (rec.onstop = () => ok()));
    rec.start();
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${i * 18}, 70%, 45%)`;
      ctx.fillRect(0, 0, 160, 240);
      await new Promise((r) => setTimeout(r, 100));
    }
    rec.stop();
    await fim;
    const buf = new Uint8Array(await new Blob(partes).arrayBuffer());
    let s = "";
    buf.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s);
  });
  const video = Buffer.from(base64, "base64");
  expect(video.length).toBeGreaterThan(1000);

  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Senha").fill(senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/costumer/);
  // (um carregamento direto de /costumer/appearance volta para /costumer; por isso o clique no menu)
  await page.getByRole("link", { name: "Aparência" }).click();
  await expect(page).toHaveURL(/appearance/);

  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: "fundo.webm", mimeType: "video/webm", buffer: video });
  await expect(page.getByRole("button", { name: "Trocar arquivo" })).toBeVisible();
  await page.getByLabel("Cor do texto").fill("#ffe066");
  await page.getByLabel(/Mostrar "Feito com FaceLink"/).uncheck();
  await page.getByRole("button", { name: "Atualizar" }).click();
  await expect(page.getByRole("button", { name: "Trocar arquivo" })).toBeVisible();

  // página pública (HTML do servidor): vídeo de fundo, cor do texto, sem marca d'água
  const html = await (await request.get(`/${userId}`)).text();
  expect(html).toMatch(/<video[^>]+src="\/media\/[0-9a-f]{24}\/[0-9a-f-]{36}\.webm"/);
  expect(html).toContain("#ffe066".toLowerCase());
  expect(html).not.toContain("Feito com FaceLink");

  // o arquivo é servido com suporte a Range (necessário para vídeo no Safari)
  const src = /src="(\/media\/[^"]+\.webm)"/.exec(html)![1];
  const parcial = await request.get(src, { headers: { Range: "bytes=0-99" } });
  expect(parcial.status()).toBe(206);
  expect(parcial.headers()["content-range"]).toMatch(/^bytes 0-99\//);
  expect((await parcial.body()).length).toBe(100);

  await page.goto(`/${userId}`);
  await page.waitForTimeout(800);
  await page.screenshot({ path: "test-results/pagina-com-video.png" });
});
