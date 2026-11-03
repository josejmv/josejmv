import { expect, type Page, test } from "@playwright/test";

const PAGES = [
  "/es",
  "/en",
  "/es/experiencia",
  "/en/experience",
  "/es/proyectos",
  "/en/projects",
  "/es/proyectos/payment-orchestrator",
  "/en/projects/export-engine",
  "/es/areas/frontend",
  "/en/areas/backend-pagos",
  "/es/areas/compliance",
  "/en/areas/devops",
  "/es/areas/ai-engineering",
  "/en/areas/leadership",
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/**
 * Sin errores de consola en ninguna página. Cubre los mensajes que se envían al cliente
 * (`ClientMessages`): un namespace que falte aparece como `MISSING_MESSAGE`.
 */
for (const path of PAGES) {
  test(`sin errores de consola · ${path}`, async ({ page, isMobile }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    // Abrir el menú (móvil) o el buscador (escritorio) monta sus componentes diferidos.
    if (isMobile) {
      await page.getByRole("button", { name: /menú|menu/i }).click();
    } else {
      await page.keyboard.press("Control+k");
    }
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");

    // Las demos de área: activar el primer control interactivo del módulo firma.
    const demoButton = page
      .locator('section[aria-labelledby="signature-title"] button:visible')
      .first();
    if (await demoButton.count()) await demoButton.click();

    await page.waitForTimeout(300);
    expect(errors, errors.join("\n")).toEqual([]);
  });
}
