import { AREA_SLUGS } from "@content/schema";
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { AreaCases } from "@/components/areas/area-cases";
import { areaRegistry } from "@/components/areas/registry";
import { getArea, getCaseStudySlugs } from "@/lib/content";

import es from "../../messages/es.json";

describe("areaRegistry", () => {
  it("tiene una página para cada área", () => {
    expect(Object.keys(areaRegistry).sort()).toEqual([...AREA_SLUGS].sort());
  });
});

describe("AreaCases", () => {
  it("enlaza solo los casos cuyo proyecto tiene case study", () => {
    const area = getArea("backend-pagos", "es")!;
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <AreaCases
          cases={area.cases}
          caseStudies={getCaseStudySlugs()}
          labels={{ title: "Casos", readMore: "Leer el case study →" }}
        />
      </NextIntlClientProvider>,
    );
    const items = within(screen.getByRole("region", { name: "Casos" })).getAllByRole("listitem");
    expect(items).toHaveLength(area.cases.length);
    const links = screen.getAllByRole("link", { name: "Leer el case study →" });
    const linkable = area.cases.filter((c) => c.project && getCaseStudySlugs().includes(c.project));
    expect(links).toHaveLength(linkable.length);
    // La pasarela no tiene case study: su caso no enlaza.
    expect(links.some((l) => l.getAttribute("href")?.includes("payment-gateway"))).toBe(false);
  });
});
