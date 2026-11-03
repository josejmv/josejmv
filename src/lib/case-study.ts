import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import GithubSlugger from "github-slugger";
import { cacheLife } from "next/cache";

export interface TocEntry {
  id: string;
  title: string;
}

const CASE_DIR = join(process.cwd(), "content", "projects");

/** Ruta del MDX de un case study. */
export function caseStudyPath(locale: string, slug: string): string {
  return join(CASE_DIR, locale, `${slug}.mdx`);
}

/**
 * Índice del case study a partir de sus `##`. Usa el mismo slugger que rehype-slug, así que los
 * `id` coinciden con los encabezados renderizados.
 */
export function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inCode = false;
  for (const line of source.split(/\r?\n/)) {
    if (line.startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      const title = match[1].replace(/[*_`]/g, "");
      entries.push({ id: slugger.slug(title), title });
    }
  }
  return entries;
}

/** Lee el MDX del disco: con `cacheComponents`, la E/S debe ir en `use cache` para prerenderizar. */
export async function getCaseStudyToc(locale: string, slug: string): Promise<TocEntry[]> {
  "use cache";
  cacheLife("max");
  return extractToc(await readFile(caseStudyPath(locale, slug), "utf8"));
}
