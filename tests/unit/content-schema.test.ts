import { describe, expect, it } from "vitest";

import { companyCountries, teamCountries } from "../../content/countries";
import { Area, ContactLink, Country, Experience, Localized, Profile } from "../../content/schema";

const loc = (es: string, en = es) => ({ es, en });

describe("Localized", () => {
  it("exige es y en", () => {
    expect(Localized.safeParse({ es: "Hola" }).success).toBe(false);
    expect(Localized.safeParse({ es: "Hola", en: "" }).success).toBe(false);
    expect(Localized.safeParse({ es: "Hola", en: "Hi" }).success).toBe(true);
  });

  it("rechaza idiomas extra", () => {
    expect(Localized.safeParse({ es: "Hola", en: "Hi", fr: "Salut" }).success).toBe(false);
  });
});

describe("Profile", () => {
  const base = {
    name: "Ana Pérez",
    monogram: "AP.",
    role: loc("Dev"),
    headline: loc("Titular"),
    location: loc("Ciudad"),
    summary: loc("Resumen"),
    available: true,
    email: "ana@example.com",
    languages: [{ name: loc("Español", "Spanish"), level: loc("nativo", "native") }],
  };
  const gmail = ContactLink.parse({
    id: "gmail",
    label: "Gmail",
    href: "mailto:ana@example.com",
    primary: true,
  });
  const github = ContactLink.parse({ id: "github", label: "GitHub", href: "https://github.com/x" });

  it("acepta exactamente un contacto primario", () => {
    expect(Profile.safeParse({ ...base, contactLinks: [gmail, github] }).success).toBe(true);
  });

  it("rechaza cero o varios primarios", () => {
    expect(Profile.safeParse({ ...base, contactLinks: [github] }).success).toBe(false);
    expect(
      Profile.safeParse({ ...base, contactLinks: [gmail, { ...github, primary: true }] }).success,
    ).toBe(false);
  });
});

describe("Experience", () => {
  const base = {
    id: "acme",
    company: "Acme",
    role: loc("Dev"),
    tagline: loc("Fintech"),
    start: "2022-03",
    end: "2023-01",
    location: loc("Remoto", "Remote"),
    context: loc("Contexto", "Context"),
    highlights: [loc("Logro", "Achievement")],
  };

  it("acepta un rol válido y rellena los defaults", () => {
    const parsed = Experience.parse(base);
    expect(parsed.subProjects).toEqual([]);
    expect(parsed.areas).toEqual([]);
  });

  it("acepta puesto actual (end null)", () => {
    expect(Experience.safeParse({ ...base, end: null }).success).toBe(true);
  });

  it("rechaza fechas mal formadas o invertidas", () => {
    expect(Experience.safeParse({ ...base, start: "2022-13" }).success).toBe(false);
    expect(Experience.safeParse({ ...base, end: "2021-12" }).success).toBe(false);
  });
});

describe("Area", () => {
  it("rechaza slugs desconocidos y ratios fuera de rango", () => {
    const area = {
      slug: "frontend",
      title: loc("Frontend"),
      tagline: loc("Lema"),
      summary: loc("Resumen"),
      bullets: [loc("Punto")],
      tech: ["react"],
      cases: [{ title: loc("Caso"), body: loc("Detalle") }],
      metrics: [
        { label: loc("Tests"), before: "255 s", after: "178 s", delta: "−30%", ratio: 0.7 },
      ],
    };
    expect(Area.safeParse(area).success).toBe(true);
    expect(Area.safeParse({ ...area, slug: "marketing" }).success).toBe(false);
    expect(Area.safeParse({ ...area, metrics: [{ ...area.metrics[0], ratio: 1.5 }] }).success).toBe(
      false,
    );
  });
});

describe("Country", () => {
  it("valida todos los países del globo", () => {
    for (const country of [...teamCountries, ...companyCountries]) {
      expect(Country.safeParse(country).success, country.id).toBe(true);
    }
  });

  it("exige companies solo en kind 'company'", () => {
    const team = teamCountries[0];
    expect(Country.safeParse({ ...team, companies: ["X"] }).success).toBe(false);
    const { companies: _omit, ...company } = companyCountries[0];
    void _omit;
    expect(Country.safeParse(company).success).toBe(false);
  });
});
