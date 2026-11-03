import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { extractToc } from "@/lib/case-study";
import { getCaseStudySlugs } from "@/lib/content";

describe("extractToc", () => {
  it("toma los ## con ids como los de rehype-slug e ignora los bloques de código", () => {
    const source = [
      "## Problema",
      "texto",
      "```md",
      "## no es un encabezado",
      "```",
      "### Subtítulo",
      "## Decisiones **clave**",
      "## Problema",
    ].join("\n");
    expect(extractToc(source)).toEqual([
      { id: "problema", title: "Problema" },
      { id: "decisiones-clave", title: "Decisiones clave" },
      { id: "problema-1", title: "Problema" },
    ]);
  });
});

describe("case studies", () => {
  it.each(getCaseStudySlugs())("%s tiene las mismas secciones en es y en", (slug) => {
    const read = (locale: string) =>
      readFileSync(resolve(__dirname, `../../content/projects/${locale}/${slug}.mdx`), "utf8");
    expect(extractToc(read("es")).length).toBeGreaterThan(0);
    expect(extractToc(read("es")).length).toBe(extractToc(read("en")).length);
  });
});
