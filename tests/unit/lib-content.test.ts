import { describe, expect, it } from "vitest";

import { LOCALES } from "../../content/schema";
import {
  getArea,
  getAreas,
  getAreaSlugs,
  getEducation,
  getExperience,
  getGlobeData,
  getProfile,
  getStack,
  getStats,
  localize,
} from "@/lib/content";

/** Devuelve las rutas donde quedó un objeto `{ es, en }` sin localizar. */
function findUnlocalized(value: unknown, path = "$"): string[] {
  if (Array.isArray(value))
    return value.flatMap((item, i) => findUnlocalized(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.includes("es") && keys.includes("en")) return [path];
    return Object.entries(value).flatMap(([k, v]) => findUnlocalized(v, `${path}.${k}`));
  }
  return [];
}

describe("localize", () => {
  it("resuelve objetos anidados y arrays", () => {
    const input = { a: { es: "hola", en: "hi" }, list: [{ b: { es: "uno", en: "one" } }], n: 3 };
    expect(localize(input, "en")).toEqual({ a: "hi", list: [{ b: "one" }], n: 3 });
    expect(localize(input, "es")).toEqual({ a: "hola", list: [{ b: "uno" }], n: 3 });
  });
});

describe.each(LOCALES)("getters de contenido (%s)", (locale) => {
  const all = {
    profile: getProfile(locale),
    experience: getExperience(locale),
    areas: getAreas(locale),
    stats: getStats(locale),
    education: getEducation(locale),
    globe: getGlobeData(locale),
  };

  it("no deja ningún campo sin localizar", () => {
    expect(findUnlocalized(all)).toEqual([]);
  });

  it("devuelve textos en el idioma pedido", () => {
    expect(all.profile.headline).toBe(
      locale === "es"
        ? "Ingeniería de pagos, compliance y plataforma"
        : "Payments, Compliance & Platform Engineering",
    );
  });

  it("encuentra cada área por slug", () => {
    for (const slug of getAreaSlugs()) {
      expect(getArea(slug, locale)?.slug).toBe(slug);
    }
  });

  it("separa los datasets del globo", () => {
    expect(all.globe.team.every((c) => c.kind === "team")).toBe(true);
    expect(all.globe.company.every((c) => c.kind === "company")).toBe(true);
  });
});

describe("getStack", () => {
  it("devuelve etiquetas sin traducir", () => {
    expect(getStack().length).toBeGreaterThan(0);
  });
});
