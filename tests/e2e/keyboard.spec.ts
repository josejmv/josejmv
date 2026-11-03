import { expect, type Page, test } from "@playwright/test";

/** Navega y espera a que la página esté hidratada (los botones son componentes cliente). */
async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

/** Describe el elemento con foco y si su indicador de foco es visible (outline o box-shadow). */
async function focusInfo(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const style = getComputedStyle(el);
    const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    const ring = style.boxShadow !== "none";
    // Indicadores en otro nodo: tarjeta con `focus-within` o borde que cambia al enfocar un input.
    const card = el.closest<HTMLElement>("[data-focus-ring]");
    const cardStyle = card ? getComputedStyle(card) : null;
    const delegated =
      !!cardStyle &&
      ((cardStyle.outlineStyle !== "none" && parseFloat(cardStyle.outlineWidth) > 0) ||
        cardStyle.boxShadow !== "none");
    return {
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40),
      visible: outline || ring || delegated,
    };
  });
}

test.describe("teclado (escritorio)", () => {
  test.skip(({ isMobile }) => isMobile, "flujo de escritorio");

  test("el primer Tab es «Saltar al contenido» y lleva el foco al main", async ({ page }) => {
    await gotoReady(page, "/es");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#contenido")).toBeFocused();
  });

  for (const path of [
    "/es",
    "/es/proyectos",
    "/en/projects/kyc-engine",
    "/es/areas/frontend",
    "/es/areas/devops",
  ]) {
    test(`todo lo enfocable con Tab muestra el foco · ${path}`, async ({ page }) => {
      await gotoReady(page, path);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const missing: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const info = await focusInfo(page);
        if (info && !info.visible) missing.push(`${info.tag} «${info.name}»`);
      }
      expect(missing, missing.join("\n")).toEqual([]);
    });
  }

  test("Ctrl+K abre el buscador, filtra, navega y Escape devuelve el foco", async ({ page }) => {
    await gotoReady(page, "/es");
    const trigger = page.getByRole("button", { name: /Buscar…/ });
    await trigger.focus();
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByPlaceholder("Escribe un comando o busca…")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.keyboard.press("Control+k");
    await page.keyboard.type("experiencia");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/es\/experiencia$/);
  });

  test("el cambio de tema se acciona con teclado", async ({ page }) => {
    await gotoReady(page, "/es");
    const html = page.locator("html");
    const before = await html.getAttribute("data-theme");
    const toggle = page.getByRole("button", { name: "Cambiar tema" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(html).not.toHaveAttribute("data-theme", before ?? "");
    await page.keyboard.press("Space");
    await expect(html).toHaveAttribute("data-theme", before ?? "dark");
  });

  test("las tabs del globo se recorren con flechas", async ({ page }) => {
    await gotoReady(page, "/es");
    const team = page.getByRole("tab", { name: /Equipo/ });
    const company = page.getByRole("tab", { name: /Empresas/ });
    await team.focus();
    await page.keyboard.press("ArrowRight");
    await expect(company).toBeFocused();
    await expect(company).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(team).toHaveAttribute("aria-selected", "true");
  });

  test("el selector de idioma conserva la página", async ({ page }) => {
    await gotoReady(page, "/es/proyectos/kyc-engine");
    await page
      .getByRole("link", { name: /Cambiar idioma a inglés/ })
      .first()
      .focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en\/projects\/kyc-engine$/);
  });
});

test.describe("teclado (móvil)", () => {
  test.skip(({ isMobile }) => !isMobile, "menú móvil");

  test("el menú se abre y se cierra con teclado y devuelve el foco", async ({ page }) => {
    await gotoReady(page, "/es");
    const open = page.getByRole("button", { name: "Abrir menú" });
    await open.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Experiencia" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });
});
