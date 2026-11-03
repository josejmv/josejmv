import "server-only";

import { z } from "zod";

import { areas as rawAreas } from "@content/areas";
import { companyCountries, HOME, teamCountries } from "@content/countries";
import { education as rawEducation } from "@content/education";
import { experience as rawExperience } from "@content/experience";
import { profile as rawProfile } from "@content/profile";
import { projects as rawProjects } from "@content/projects";
import {
  Area,
  type AreaSlug,
  type ContentLocale,
  Country,
  Education,
  Experience,
  type Localized,
  type LocalizedTo,
  Profile,
  Project,
  StackItem,
  Stat,
} from "@content/schema";
import { stack as rawStack } from "@content/stack";
import { stats as rawStats } from "@content/stats";

// La validación corre al importar el módulo: si el contenido es inválido, el build falla.
const content = {
  profile: Profile.parse(rawProfile),
  experience: z.array(Experience).parse(rawExperience),
  areas: z.array(Area).parse(rawAreas),
  stats: z.array(Stat).parse(rawStats),
  education: z.array(Education).parse(rawEducation),
  stack: z.array(StackItem).parse(rawStack),
  projects: z.array(Project).parse(rawProjects),
  countries: {
    team: z.array(Country).parse(teamCountries),
    company: z.array(Country).parse(companyCountries),
  },
};

function isLocalized(value: unknown): value is Localized {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return (
    keys.length === 2 &&
    typeof (value as Record<string, unknown>).es === "string" &&
    typeof (value as Record<string, unknown>).en === "string"
  );
}

/** Reemplaza recursivamente cada `{ es, en }` por el texto del locale. */
export function localize<T>(value: T, locale: ContentLocale): LocalizedTo<T> {
  if (isLocalized(value)) return value[locale] as LocalizedTo<T>;
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as LocalizedTo<T>;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localize(item, locale)]),
    ) as LocalizedTo<T>;
  }
  return value as LocalizedTo<T>;
}

export type LocalizedProfile = LocalizedTo<Profile>;
export type LocalizedExperience = LocalizedTo<Experience>;
export type LocalizedArea = LocalizedTo<Area>;
export type LocalizedStat = LocalizedTo<Stat>;
export type LocalizedEducation = LocalizedTo<Education>;
export type LocalizedCountry = LocalizedTo<Country>;
export type LocalizedProject = LocalizedTo<Project>;

export function getProfile(locale: ContentLocale): LocalizedProfile {
  return localize(content.profile, locale);
}

export function getExperience(locale: ContentLocale): LocalizedExperience[] {
  return localize(content.experience, locale);
}

export function getAreas(locale: ContentLocale): LocalizedArea[] {
  return localize(content.areas, locale);
}

export function getArea(slug: AreaSlug, locale: ContentLocale): LocalizedArea | undefined {
  const area = content.areas.find((a) => a.slug === slug);
  return area && localize(area, locale);
}

export function getAreaSlugs(): AreaSlug[] {
  return content.areas.map((a) => a.slug);
}

export function getStats(locale: ContentLocale): LocalizedStat[] {
  return localize(content.stats, locale);
}

export function getEducation(locale: ContentLocale): LocalizedEducation[] {
  return localize(content.education, locale);
}

export function getStack(): StackItem[] {
  return content.stack;
}

export function getGlobeData(locale: ContentLocale) {
  return {
    home: HOME,
    team: localize(content.countries.team, locale),
    company: localize(content.countries.company, locale),
  };
}

export function getProjects(locale: ContentLocale): LocalizedProject[] {
  return localize(content.projects, locale);
}

export function getProject(slug: string, locale: ContentLocale): LocalizedProject | undefined {
  const project = content.projects.find((p) => p.slug === slug);
  return project && localize(project, locale);
}

/** Proyectos con case study en MDX (rutas `/proyectos/[slug]`). */
export function getCaseStudySlugs(): string[] {
  return content.projects.filter((p) => p.caseStudy).map((p) => p.slug);
}
