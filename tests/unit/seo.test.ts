import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { classifyPath } from "@/i18n/known-paths";
import { localizedAlternates } from "@/lib/seo";

describe("classifyPath (404 real desde el proxy)", () => {
  it.each([
    "/es",
    "/en",
    "/es/experiencia",
    "/en/experience",
    "/es/proyectos",
    "/en/projects/",
    "/es/proyectos/payment-orchestrator",
    "/en/projects/kyc-engine",
    "/es/areas/devops",
    "/en/areas/ai-engineering",
    // Ruta interna en el otro idioma: next-intl la redirige a la pública.
    "/en/experiencia",
    "/en/proyectos/export-engine",
    "/es/not-found-page",
  ])("%s es conocida", (path) => {
    expect(classifyPath(path)).toEqual({ kind: "known" });
  });

  it.each([
    ["/es/nope", "es"],
    ["/en/foo/bar", "en"],
    ["/es/areas/nope", "es"],
    ["/en/areas/frontend/extra", "en"],
    ["/es/proyectos/nope", "es"],
    // Proyecto sin case study: no tiene página propia.
    ["/es/proyectos/payment-gateway", "es"],
    ["/en/projects/design-tokens", "en"],
    ["/en/blog/monologos", "en"],
  ])("%s es desconocida (404 en %s)", (path, locale) => {
    expect(classifyPath(path)).toEqual({ kind: "unknown", locale });
  });

  it("deja pasar a next-intl lo que no lleva locale", () => {
    expect(classifyPath("/")).toEqual({ kind: "pass" });
    expect(classifyPath("/blog/poemas")).toEqual({ kind: "pass" });
  });
});

describe("localizedAlternates", () => {
  it("genera canonical, hreflang por locale y x-default al español", () => {
    const alternates = localizedAlternates(
      { pathname: "/proyectos/[slug]", params: { slug: "kyc-engine" } },
      "en",
    );
    expect(alternates.canonical).toBe("/en/projects/kyc-engine");
    expect(alternates.languages).toEqual({
      es: "/es/proyectos/kyc-engine",
      en: "/en/projects/kyc-engine",
      "x-default": "/es/proyectos/kyc-engine",
    });
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("incluye cada ruta pública en ambos idiomas, sin duplicados", () => {
    const urls = entries.map((e) => new URL(e.url).pathname);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(
      expect.arrayContaining([
        "/es",
        "/en",
        "/es/experiencia",
        "/en/experience",
        "/es/proyectos/payment-orchestrator",
        "/en/projects/payment-orchestrator",
        "/es/areas/leadership",
        "/en/areas/leadership",
      ]),
    );
    // 3 estáticas + 3 case studies + 6 áreas, por 2 idiomas.
    expect(entries).toHaveLength(24);
  });

  it("no lista proyectos sin case study ni la página 404", () => {
    const urls = entries.map((e) => e.url).join(" ");
    expect(urls).not.toContain("payment-gateway");
    expect(urls).not.toContain("not-found-page");
  });

  it("cada entrada declara sus alternates absolutos", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).sort()).toEqual(["en", "es", "x-default"]);
      for (const href of Object.values(languages)) expect(href).toMatch(/^https?:\/\//);
    }
  });
});
