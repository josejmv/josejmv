import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CareerGantt } from "@/components/charts/career-gantt";
import { CareerGanttZoom } from "@/components/charts/career-gantt-zoom";
import { getExperience } from "@/lib/content";

const labels = { list: "Roles", present: "actualidad" };

describe("CareerGantt", () => {
  const roles = getExperience("es");

  function renderGantt() {
    return render(<CareerGantt roles={roles} now="2026-11" locale="es" labels={labels} />);
  }

  it("lista un rol por empresa, en orden", () => {
    renderGantt();
    const items = within(screen.getByRole("list", { name: "Roles" })).getAllByRole("listitem");
    expect(items.map((li) => within(li).getAllByText(/./)[0].textContent)).toEqual(
      roles.map((r) => r.company),
    );
  });

  it("expone el periodo en texto (visible en móvil, leído en desktop)", () => {
    renderGantt();
    expect(screen.getByText(/nov 2025 – actualidad/i)).toBeInTheDocument();
    expect(screen.getByText(/ago 2019 – sept? 2021/i)).toBeInTheDocument();
  });

  it("calcula posición y ancho sobre el eje (2019-07 → 2027-01)", () => {
    const { container } = renderGantt();
    const bars = container.querySelectorAll<HTMLElement>("li [title]");
    // SEO Contenidos: ago 2019 – sep 2021 → empieza 1 mes después del inicio del eje.
    const seo = bars[bars.length - 1];
    expect(parseFloat(seo.style.left)).toBeCloseTo((1 / 90) * 100, 0);
    expect(parseFloat(seo.style.width)).toBeCloseTo((26 / 90) * 100, 0);
    // El rol vigente usa el degradado.
    expect(bars[0].className).toContain("bg-linear-to-r");
  });

  it("muestra los años del eje", () => {
    renderGantt();
    for (const year of ["2020", "2023", "2026"]) expect(screen.getByText(year)).toBeInTheDocument();
  });

  it("con `year` enfoca el eje en los 12 meses de ese año y recorta las barras", () => {
    const { container } = render(
      <CareerGantt roles={roles} now="2026-11" locale="es" labels={labels} year={2021} />,
    );
    expect(screen.getByText("ene")).toBeInTheDocument();
    expect(screen.getByText("dic")).toBeInTheDocument();
    expect(screen.queryByText("2023")).not.toBeInTheDocument();
    for (const bar of container.querySelectorAll<HTMLElement>("li [title]")) {
      const left = parseFloat(bar.style.left);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left + parseFloat(bar.style.width)).toBeLessThanOrEqual(100.1);
    }
  });
});

describe("CareerGanttZoom", () => {
  it("cambia de la vista completa a un año y vuelve con «Todo»", async () => {
    const user = userEvent.setup();
    render(
      <CareerGanttZoom
        roles={getExperience("es")}
        now="2026-11"
        locale="es"
        labels={labels}
        zoomLabels={{ label: "Zoom por año", all: "Todo" }}
      />,
    );
    const group = screen.getByRole("group", { name: "Zoom por año" });
    expect(within(group).getByRole("button", { name: "Todo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(within(group).getByRole("button", { name: "2022" }));
    expect(within(group).getByRole("button", { name: "2022" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("jun")).toBeInTheDocument();
    await user.click(within(group).getByRole("button", { name: "Todo" }));
    expect(screen.queryByText("jun")).not.toBeInTheDocument();
  });
});
