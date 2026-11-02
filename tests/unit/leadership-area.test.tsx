import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type TeamStage, TeamGrowthChart } from "@/components/charts/team-growth";
import { type Principle, Principles } from "@/components/areas/leadership/principles";

import es from "../../messages/es.json";

const stages = es.AreaLeadership.team.stages as TeamStage[];

describe("TeamGrowthChart", () => {
  it("dibuja una persona por punto y marca los rangos como posibles, sin redondear", () => {
    const { container } = render(
      <TeamGrowthChart
        title="Equipos"
        stages={stages}
        legend={{ start: "al empezar", growth: "crecimiento", maybe: "rango" }}
      />,
    );
    const rows = within(screen.getAllByRole("list")[0]).getAllByRole("listitem");
    const centria = rows.find((row) => row.textContent?.includes("Centria Group"))!;
    expect(centria.querySelectorAll(".bg-accent-2")).toHaveLength(3);
    expect(centria.querySelectorAll(".bg-accent")).toHaveLength(2);
    expect(centria.querySelectorAll(".border-dashed")).toHaveLength(1);
    expect(centria).toHaveTextContent("de 3 a 5-6 ingenieros");
    expect(container.textContent).toContain("célula de 4-5");
  });
});

describe("Principles", () => {
  it("cada principio lleva su evidencia", () => {
    const items = es.AreaLeadership.principles.items as Principle[];
    render(<Principles title="Principios" items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.body)).toBeInTheDocument();
      expect(screen.getByText(item.evidence)).toBeInTheDocument();
    }
  });
});
