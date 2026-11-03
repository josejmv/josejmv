import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ImpactBars } from "@/components/charts/impact-bars";
import { AreasShowcase } from "@/components/sections/home/areas-showcase";
import { StatsStrip } from "@/components/sections/home/stats-strip";
import { getAreas, getStats } from "@/lib/content";

import es from "../../messages/es.json";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/es",
  useParams: () => ({ locale: "es" }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const wrap = (node: ReactNode) => (
  <NextIntlClientProvider locale="es" messages={es}>
    {node}
  </NextIntlClientProvider>
);

const areaLabels = {
  title: es.Areas.title,
  allAreas: es.Areas.allAreas,
  tabs: es.Areas.tabs,
  impact: es.Areas.impact,
  cases: (area: string) => `Ver casos de ${area} →`,
};

describe("StatsStrip", () => {
  it("muestra las 4 cifras con su etiqueta", () => {
    render(wrap(<StatsStrip stats={getStats("es")} label={es.Stats.label} />));
    const region = screen.getByRole("region", { name: es.Stats.label });
    expect(within(region).getAllByRole("listitem")).toHaveLength(4);
    expect(within(region).getByText("años de experiencia")).toBeInTheDocument();
  });
});

describe("ImpactBars", () => {
  it("dibuja el ancho como after/before y muestra delta y valores", () => {
    const metrics = getAreas("es").find((a) => a.slug === "devops")!.metrics;
    const { container } = render(<ImpactBars title="impacto" metrics={metrics} />);
    expect(screen.getByText("−97%")).toBeInTheDocument();
    expect(screen.getByText("1:36 → 0:03")).toBeInTheDocument();
    const bar = container.querySelector<HTMLElement>(".bg-accent")!;
    expect(bar.style.width).toBe("3.1%");
  });
});

describe("AreasShowcase", () => {
  it("abre en Backend & Pagos y deja las 6 áreas en el HTML", () => {
    const { container } = render(
      wrap(
        <AreasShowcase areas={getAreas("es")} defaultSlug="backend-pagos" labels={areaLabels} />,
      ),
    );
    expect(screen.getByRole("tab", { name: "Backend & Pagos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(6);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("PSE y Bre-B");
  });

  it("cambia de área y enlaza a su página", async () => {
    const user = userEvent.setup();
    render(
      wrap(
        <AreasShowcase areas={getAreas("es")} defaultSlug="backend-pagos" labels={areaLabels} />,
      ),
    );
    await user.click(screen.getByRole("tab", { name: "DevOps" }));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByRole("link", { name: "Ver casos de DevOps →" })).toHaveAttribute(
      "href",
      "/es/areas/devops",
    );
  });

  it("sin métricas muestra la frase del área en lugar de barras", async () => {
    const user = userEvent.setup();
    render(
      wrap(
        <AreasShowcase areas={getAreas("es")} defaultSlug="backend-pagos" labels={areaLabels} />,
      ),
    );
    await user.click(screen.getByRole("tab", { name: "Leadership" }));
    expect(
      within(screen.getByRole("tabpanel")).getByText("Liderar con proceso y calma"),
    ).toBeInTheDocument();
  });
});
