import { describe, expect, it } from "vitest";

import { areas } from "../../content/areas";
import { companyCountries } from "../../content/countries";
import { education } from "../../content/education";
import { experience } from "../../content/experience";
import { profile } from "../../content/profile";
import {
  Area,
  AREA_SLUGS,
  Education,
  Experience,
  Profile,
  StackItem,
  Stat,
} from "../../content/schema";
import { stack } from "../../content/stack";
import { stats } from "../../content/stats";

/** Nombres que nunca deben aparecer en el contenido publicado (CLAUDE.md, regla 7, y vault). */
const FORBIDDEN = [/walls team/i];

describe("contenido de content/*.ts", () => {
  it("valida contra los esquemas Zod", () => {
    expect(() => Profile.parse(profile)).not.toThrow();
    expect(() => experience.map((e) => Experience.parse(e))).not.toThrow();
    expect(() => areas.map((a) => Area.parse(a))).not.toThrow();
    expect(() => stats.map((s) => Stat.parse(s))).not.toThrow();
    expect(() => education.map((e) => Education.parse(e))).not.toThrow();
    expect(() => stack.map((s) => StackItem.parse(s))).not.toThrow();
  });

  it("tiene las 6 áreas, una por slug y en orden", () => {
    expect(areas.map((a) => a.slug)).toEqual([...AREA_SLUGS]);
  });

  it("ordena la experiencia: puesto actual primero, luego por fin y por inicio (desc)", () => {
    const key = (e: (typeof experience)[number]) => `${e.end ?? "9999-12"}|${e.start}`;
    const keys = experience.map(key);
    expect(keys).toEqual([...keys].sort().reverse());
  });

  it("usa ids únicos", () => {
    for (const list of [experience, stats, education, stack]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("cada empresa del globo existe en la experiencia", () => {
    const companies = new Set(experience.map((e) => e.company));
    for (const country of companyCountries) {
      for (const company of country.companies ?? []) {
        expect(companies.has(company), company).toBe(true);
      }
    }
  });

  it("no contiene nombres prohibidos", () => {
    const blob = JSON.stringify({ profile, experience, areas, stats, education, stack });
    for (const pattern of FORBIDDEN) expect(blob).not.toMatch(pattern);
  });
});
