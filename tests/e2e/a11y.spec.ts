import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** Todas las páginas públicas, en los dos idiomas, más el 404. */
const PAGES = [
  "/es",
  "/en",
  "/es/experiencia",
  "/en/experience",
  "/es/proyectos",
  "/en/projects",
  "/es/proyectos/payment-orchestrator",
  "/en/projects/kyc-engine",
  "/es/areas/frontend",
  "/en/areas/backend-pagos",
  "/es/areas/compliance",
  "/en/areas/devops",
  "/es/areas/ai-engineering",
  "/en/areas/leadership",
  "/es/areas",
  "/en/areas",
  "/es/contacto",
  "/en/contact",
  "/es/no-existe",
];

const THEMES = ["dark", "light"] as const;

async function openWithTheme(page: Page, path: string, theme: (typeof THEMES)[number]) {
  // next-themes lee `theme` de localStorage antes del primer paint.
  await page.addInitScript((value) => window.localStorage.setItem("theme", value), theme);
  // La página 404 responde con status 404: no se exige `ok`.
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  // Las animaciones de entrada (opacity) no deben falsear el contraste.
  await page.emulateMedia({ reducedMotion: "reduce" });
}

for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`axe sin violaciones WCAG 2.2 AA · ${theme} · ${path}`, async ({ page }) => {
      await openWithTheme(page, path, theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        // El lienzo WebGL del globo no es contenido evaluable (tiene fallback y etiqueta propia).
        .exclude("canvas")
        .analyze();

      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} — ${n.failureSummary}`),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }
}
