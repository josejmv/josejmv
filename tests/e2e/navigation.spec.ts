import { expect, test } from "@playwright/test";

const AREAS = ["frontend", "backend-pagos", "compliance", "devops", "ai-engineering", "leadership"];

test.describe("enlaces de contacto", () => {
  test("los canales del hero apuntan a destinos reales y seguros", async ({ page }) => {
    await page.goto("/es");
    const list = page.getByRole("list", { name: "Canales de contacto" });
    const links = list.getByRole("link");
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute("href", /^mailto:.+@gmail\.com$/);
    await expect(list.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      /^https:\/\/www\.linkedin\.com\/in\//,
    );
    await expect(list.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      /^https:\/\/github\.com\//,
    );
    await expect(list.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/\d+$/,
    );
    for (const name of ["LinkedIn", "GitHub", "WhatsApp"]) {
      await expect(list.getByRole("link", { name })).toHaveAttribute("rel", /noopener/);
    }
  });

  test("el CTA de contacto del final usa Gmail en todas las páginas", async ({ page }) => {
    for (const path of ["/es", "/en/experience", "/es/proyectos", "/en/areas/devops"]) {
      await page.goto(path);
      const cta = page.getByRole("link", { name: /Gmail/ }).last();
      await expect(cta).toHaveAttribute("href", /^mailto:/);
    }
  });
});

test.describe("navegación de áreas", () => {
  test("desde el Home se llega a cada área y vuelve al inicio", async ({ page, isMobile }) => {
    test.skip(isMobile, "las tabs de áreas se prueban en escritorio");
    test.setTimeout(90_000);
    for (const slug of AREAS) {
      await page.goto("/es");
      // Como un usuario: elegir la tab del área y seguir su enlace (los otros paneles están ocultos).
      const panel = page.locator(`[role="tabpanel"]:has(a[href="/es/areas/${slug}"])`);
      const tabId = await panel.getAttribute("aria-labelledby");
      await page.locator(`[id="${tabId}"]`).click();
      await panel.locator(`a[href="/es/areas/${slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/es/areas/${slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    await page
      .getByRole("link", { name: /Inicio/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/es$/);
  });

  test("cada área responde en ES y EN con su h1 y su módulo firma", async ({ page }) => {
    for (const locale of ["es", "en"]) {
      for (const slug of AREAS) {
        const response = await page.goto(`/${locale}/areas/${slug}`);
        expect(response?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("#signature-title")).toBeVisible();
      }
    }
  });

  test("la navegación principal lleva a Experiencia y Proyectos", async ({ page, isMobile }) => {
    await page.goto("/en");
    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("dialog").getByRole("link", { name: "Experience" }).click();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Experience" })
        .click();
    }
    await expect(page).toHaveURL(/\/en\/experience$/);
  });
});
