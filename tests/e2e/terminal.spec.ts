import { expect, type Page, test } from "@playwright/test";

async function terminal(page: Page, path = "/es") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  const input = page.getByRole("textbox", { name: /Terminal interactiva|Interactive terminal/ });
  const log = page.getByRole("log");
  return {
    input,
    log,
    async type(command: string) {
      await input.fill(command);
      await input.press("Enter");
    },
  };
}

test("help, whoami y comando desconocido", async ({ page }) => {
  const t = await terminal(page);
  await t.type("help");
  await expect(t.log).toContainText("Comandos disponibles:");
  await t.type("whoami");
  await expect(t.log).toContainText("José M. Vasquez — Senior Full Stack Developer");
  await t.type("foo");
  await expect(t.log).toContainText("comando no encontrado: foo");
  await t.type("clear");
  await expect(t.log).toBeHidden();
});

test("cd navega por el sitio", async ({ page }) => {
  const t = await terminal(page);
  await t.type("cd areas/devops");
  await expect(page).toHaveURL(/\/es\/areas\/devops$/);
});

test("theme y lang cambian tema e idioma conservando la página", async ({ page }) => {
  const t = await terminal(page);
  const html = page.locator("html");
  await t.type("theme light");
  await expect(html).toHaveAttribute("data-theme", "light");
  await t.type("lang en");
  await expect(page).toHaveURL(/\/en$/);
  await expect(html).toHaveAttribute("lang", "en");
});

test("historial con flechas y autocompletado con Tab", async ({ page }) => {
  const t = await terminal(page);
  await t.type("whoami");
  await t.input.press("ArrowUp");
  await expect(t.input).toHaveValue("whoami");
  await t.input.fill("cd areas/fro");
  await t.input.press("Tab");
  await expect(t.input).toHaveValue("cd areas/frontend");
  await expect(t.input).toBeFocused();
});

test("easter egg: sudo hire jose termina en todos los canales de contacto", async ({ page }) => {
  const t = await terminal(page);
  await t.type("sudo hire jose");
  await expect(t.log).toContainText("Acceso concedido");
  await expect(t.log.getByRole("link", { name: "Gmail" })).toHaveAttribute("href", /^mailto:/);
  for (const name of ["LinkedIn", "GitHub", "WhatsApp"]) {
    await expect(t.log.getByRole("link", { name })).toHaveAttribute("href", /^https:\/\//);
  }
});
