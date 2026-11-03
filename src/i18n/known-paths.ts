import { projects } from "@content/projects";
import { AREA_SLUGS } from "@content/schema";

import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];
type InternalPath = keyof typeof routing.pathnames;

/** Segmento interno de la página 404 estática (`src/app/[locale]/not-found-page`). */
export const NOT_FOUND_SEGMENT = "not-found-page";

/** Slugs válidos de cada ruta dinámica. */
const slugsFor: Partial<Record<InternalPath, ReadonlySet<string>>> = {
  "/areas/[slug]": new Set<string>(AREA_SLUGS),
  "/proyectos/[slug]": new Set(projects.filter((p) => p.caseStudy).map((p) => p.slug)),
};

function publicPattern(internal: InternalPath, locale: Locale): string {
  const entry = routing.pathnames[internal];
  return typeof entry === "string" ? entry : entry[locale];
}

function matches(pattern: string, path: string, slugs?: ReadonlySet<string>): boolean {
  if (!pattern.includes("[slug]")) return pattern === path;
  const prefix = pattern.replace("[slug]", "");
  if (!path.startsWith(prefix)) return false;
  const slug = path.slice(prefix.length);
  return !slug.includes("/") && !!slugs?.has(slug);
}

export type PathVerdict =
  | { kind: "pass" } // fuera de un locale: que next-intl decida (redirige al locale por defecto).
  | { kind: "known" }
  | { kind: "unknown"; locale: Locale };

/**
 * Clasifica una URL pública contra `routing.pathnames` y los slugs del contenido. Con
 * `cacheComponents` una ruta dinámica emite su shell (200) antes de llamar a `notFound()`, así que
 * el 404 se decide aquí, antes de renderizar.
 */
export function classifyPath(pathname: string): PathVerdict {
  const [, first, ...rest] = pathname.split("/");
  if (!(routing.locales as readonly string[]).includes(first)) return { kind: "pass" };
  const locale = first as Locale;
  const path = `/${rest.join("/")}`.replace(/(.)\/$/, "$1");
  if (path === `/${NOT_FOUND_SEGMENT}`) return { kind: "known" };

  for (const internal of Object.keys(routing.pathnames) as InternalPath[]) {
    if (matches(publicPattern(internal, locale), path, slugsFor[internal]))
      return { kind: "known" };
  }
  // La ruta interna del otro idioma (p. ej. `/en/proyectos`): next-intl la redirige a la buena.
  for (const internal of Object.keys(routing.pathnames) as InternalPath[]) {
    if (matches(internal, path, slugsFor[internal])) return { kind: "known" };
  }
  return { kind: "unknown", locale };
}
