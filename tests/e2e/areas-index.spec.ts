import { expect, type Page, test } from "@playwright/test";

const BACKEND = "Correcto donde se mueve el dinero";
const COMPLIANCE = "AML/KYC automatizado (art. 492)";

async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
}

const panelTitle = (page: Page) => page.locator("#area-detail-title");

/**
 * El Chromium de CI solo tiene WebGL por software, donde la página se queda en 2D a propósito.
 * Esta clave (FORCE_3D_KEY en constellation-stage.tsx) fuerza la escena 3D para probarla.
 */
async function force3d(page: Page) {
  await page.addInitScript(() => window.localStorage.setItem("constellation:3d", "force"));
}

test("con WebGL se monta la escena 3D, decorativa, con radios accesibles en paralelo", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "basta con escritorio");
  await force3d(page);
  await gotoReady(page, "/es/areas");
  await expect(page.locator("[data-scene-3d] canvas")).toBeVisible();
  await expect(page.locator("[data-scene-3d]")).toHaveAttribute("aria-hidden", "true");
  const radios = page.getByRole("radiogroup", { name: "Áreas" }).getByRole("radio");
  await expect(radios).toHaveCount(6);
  await expect(page.getByRole("radio", { name: "Backend & Pagos", checked: true })).toHaveCount(1);
});

test.describe("Áreas · fallback 2D (reduced-motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("carga con Backend & Pagos y sin lienzo 3D", async ({ page }) => {
    await gotoReady(page, "/es/areas");
    await expect(panelTitle(page)).toHaveText(BACKEND);
    await expect(page.getByRole("radio", { name: "Backend & Pagos" })).toBeChecked();
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("pulsar Compliance actualiza el panel y la URL; Explorar lleva a su página", async ({
    page,
  }) => {
    await gotoReady(page, "/es/areas");
    await page.getByRole("radio", { name: "Compliance AML/KYC" }).click();
    await expect(panelTitle(page)).toHaveText(COMPLIANCE);
    await expect(page).toHaveURL(/\/es\/areas\?area=compliance$/);

    await page.getByRole("link", { name: "Explorar Compliance AML/KYC →" }).click();
    await expect(page).toHaveURL(/\/es\/areas\/compliance$/);
    // El breadcrumb vuelve al índice.
    await page.getByRole("navigation", { name: "Ruta de navegación" }).getByRole("link").click();
    await expect(page).toHaveURL(/\/es\/areas$/);
  });

  test("?area= válido se respeta y uno inválido cae en el valor por defecto", async ({ page }) => {
    test.setTimeout(60_000);
    await gotoReady(page, "/en/areas?area=devops");
    await expect(page.getByRole("radio", { name: "DevOps" })).toBeChecked();
    await gotoReady(page, "/en/areas?area=nope");
    await expect(page.getByRole("radio", { name: "Backend & Payments" })).toBeChecked();
  });
});

test("las flechas cambian el área seleccionada en la escena 3D", async ({ page, isMobile }) => {
  test.skip(isMobile, "flujo de teclado de escritorio");
  await force3d(page);
  await gotoReady(page, "/es/areas");
  await expect(page.locator("[data-scene-3d] canvas")).toBeVisible();
  // Con WebGL la capa accesible son radios ocultos; sin él, los botones del fallback.
  const group = page.getByRole("radiogroup", { name: "Áreas" }).last();
  await group.getByRole("radio", { name: "Backend & Pagos" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(panelTitle(page)).toHaveText(COMPLIANCE);
  await expect(group.getByRole("radio", { name: "Compliance AML/KYC" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(panelTitle(page)).toHaveText(BACKEND);
});

test("la lista «Todas las áreas» enlaza las 6 páginas de área", async ({ page }) => {
  await gotoReady(page, "/es/areas");
  const list = page.getByRole("region", { name: "Todas las áreas" });
  await expect(list.getByRole("link")).toHaveCount(6);
  await expect(list.getByRole("link").first()).toHaveAttribute("href", "/es/areas/frontend");
});

test("el header marca Áreas en el índice y en cada área", async ({ page, isMobile }) => {
  test.skip(isMobile, "la navegación principal es de escritorio");
  for (const path of ["/es/areas", "/es/areas/devops"]) {
    await gotoReady(page, path);
    await expect(
      page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Áreas" }),
    ).toHaveAttribute("aria-current", "page");
  }
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`a 390px no hay scroll horizontal ni etiquetas recortadas · ${reducedMotion}`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    if (reducedMotion === "no-preference") await force3d(page);
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const area of ["backend-pagos", "compliance", "ai-engineering", "leadership"]) {
      await gotoReady(page, `/es/areas?area=${area}`);
      // Deja que la escena 3D (si hay WebGL) termine su fundido y proyecte las etiquetas.
      await page.waitForTimeout(1200);
      const result = await page.evaluate(() => {
        const stage = document.querySelector<HTMLElement>("[data-focus-ring].isolate")!;
        const box = stage.getBoundingClientRect();
        const clipped = [...stage.querySelectorAll<HTMLElement>("[data-constellation-label]")]
          .filter((el) => {
            const style = getComputedStyle(el);
            const hidden = el.closest("[inert]");
            return style.display !== "none" && style.visibility !== "hidden" && !hidden;
          })
          .map((el) => ({ text: el.textContent, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0)
          .filter(
            ({ r }) =>
              r.left < box.left - 0.5 ||
              r.right > box.right + 0.5 ||
              r.top < box.top - 0.5 ||
              r.bottom > box.bottom + 0.5,
          )
          .map(({ text }) => text);
        return { overflow: document.documentElement.scrollWidth - innerWidth, clipped };
      });
      expect(result.overflow, area).toBeLessThanOrEqual(0);
      expect(result.clipped, area).toEqual([]);
    }
  });
}
