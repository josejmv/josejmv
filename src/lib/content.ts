import "server-only";

import { z } from "zod";

import { areas as rawAreas } from "@content/areas";
import { areasGraph as rawAreasGraph } from "@content/areas-graph";
import { contact as rawContact } from "@content/contact";
import { companyCountries, teamCountries } from "@content/countries";
import { education as rawEducation } from "@content/education";
import { experience as rawExperience } from "@content/experience";
import { profile as rawProfile } from "@content/profile";
import { projects as rawProjects } from "@content/projects";
import {
  Area,
  AreasGraph,
  type AreaSlug,
  ContactContent,
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

import { neighbors } from "./constellation";
import { countryName, HOME } from "./home";

// La validación corre al importar el módulo: si el contenido es inválido, el build falla.
const content = {
  profile: Profile.parse(rawProfile),
  experience: z.array(Experience).parse(rawExperience),
  areas: z.array(Area).parse(rawAreas),
  stats: z.array(Stat).parse(rawStats),
  education: z.array(Education).parse(rawEducation),
  stack: z.array(StackItem).parse(rawStack),
  projects: z.array(Project).parse(rawProjects),
  contact: ContactContent.parse(rawContact),
  areasGraph: AreasGraph.parse(rawAreasGraph),
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

/** `location` («Ciudad, País») sale de las variables HOME_* (src/lib/home.ts). */
export type LocalizedProfile = LocalizedTo<Profile> & { location: string; country: string };
export type LocalizedExperience = LocalizedTo<Experience>;
export type LocalizedArea = LocalizedTo<Area>;
export type LocalizedStat = LocalizedTo<Stat>;
export type LocalizedEducation = LocalizedTo<Education>;
export type LocalizedCountry = LocalizedTo<Country>;
export type LocalizedProject = LocalizedTo<Project>;

export function getProfile(locale: ContentLocale): LocalizedProfile {
  return {
    ...localize(content.profile, locale),
    location: `${HOME.city}, ${countryName(HOME.country, locale)}`,
    country: HOME.country,
  };
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

/** Origen del globo (HOME_*): id del país, su nombre localizado y coordenadas de la ciudad. */
export interface GlobeHome {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export function getGlobeData(locale: ContentLocale) {
  const home: GlobeHome = {
    id: HOME.country,
    name: countryName(HOME.country, locale),
    lat: HOME.lat,
    lng: HOME.lng,
  };
  return {
    home,
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

/** Canal de contacto: el enlace de `profile.contactLinks` más su texto de `content/contact.ts`. */
export interface ContactChannelView {
  id: ContactContent["channels"][number]["id"];
  label: string;
  href: string;
  primary: boolean;
  handle: string;
  description: string;
}

export interface AvailabilityRow {
  key: string;
  label: string;
  value: string;
}

export interface ContactView {
  email: string;
  channels: ContactChannelView[];
  availability: { status: "available" | "unavailable"; title: string; rows: AvailabilityRow[] };
  opportunityTypes: { value: ContactContent["opportunityTypes"][number]["value"]; label: string }[];
  cv: { href: string; language: ContentLocale };
}

/**
 * Datos de la página de Contacto. Reúne `profile` (email, enlaces, idiomas), `content/contact.ts`
 * (handles, disponibilidad, tipos de oportunidad) y HOME_* (ubicación).
 */
export function getContact(locale: ContentLocale): ContactView {
  const profile = getProfile(locale);
  const contact = localize(content.contact, locale);
  const channels = profile.contactLinks.map((link) => {
    const extra = contact.channels.find((c) => c.id === link.id);
    if (!extra) throw new Error(`content/contact.ts: falta el canal "${link.id}"`);
    return { ...link, handle: extra.handle, description: extra.description };
  });
  const languages = profile.languages.map((l) => `${l.name} ${l.level}`).join(" · ");
  return {
    email: profile.email,
    channels,
    availability: {
      status: contact.availability.status,
      title: contact.availability.title,
      rows: [
        ...contact.availability.rows,
        { key: "languages", label: contact.availability.languagesLabel, value: languages },
        { key: "location", label: contact.availability.locationLabel, value: profile.location },
      ],
    },
    opportunityTypes: contact.opportunityTypes,
    cv: contact.cv,
  };
}

/** Nodo de la constelación con los datos de su área ya resueltos. */
export interface ConstellationNodeView {
  id: AreaSlug;
  code: string;
  module: string;
  title: string;
  tagline: string;
  summary: string;
  tech: string[];
  position3d: [number, number, number];
  position2d: { x: number; y: number };
  mobile: { x: number; y: number };
  depth: number;
  metric: { value: string; label: string };
  neighbors: { id: AreaSlug; title: string; label: string }[];
}

export interface ConstellationView {
  defaultSelected: AreaSlug;
  nodes: ConstellationNodeView[];
  edges: { from: AreaSlug; to: AreaSlug; label: string }[];
}

/** Grafo de /areas: posiciones y conexiones de `areas-graph.ts` más títulos y stack de `areas.ts`. */
export function getConstellation(locale: ContentLocale): ConstellationView {
  const graph = localize(content.areasGraph, locale);
  const areas = getAreas(locale);
  const titleOf = (slug: AreaSlug) => areas.find((a) => a.slug === slug)!.title;
  return {
    defaultSelected: graph.defaultSelected,
    edges: graph.edges,
    nodes: graph.nodes.map((node) => {
      const area = areas.find((a) => a.slug === node.id)!;
      return {
        ...node,
        // `localize` devuelve arrays; la tupla ya la validó Zod.
        position3d: node.position3d as [number, number, number],
        title: area.title,
        tagline: area.tagline,
        summary: area.summary,
        tech: area.tech.slice(0, 4),
        neighbors: neighbors(graph.edges, node.id).map((n) => ({ ...n, title: titleOf(n.id) })),
      };
    }),
  };
}
