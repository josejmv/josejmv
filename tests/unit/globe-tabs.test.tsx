import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GlobeTabs } from "@/components/three/globe/globe-tabs";
import { getGlobeData } from "@/lib/content";

const data = getGlobeData("es");

function renderTabs() {
  return render(
    <GlobeTabs
      label="Vista del globo"
      home={data.home}
      views={{
        team: {
          label: "Equipo · 12 nacionalidades",
          points: data.team,
          fallback: <div role="img" aria-label="Globo del equipo" />,
          legend: <p>Nacionalidades del equipo</p>,
        },
        company: {
          label: "Empresas · 5 países",
          points: data.company,
          fallback: <div role="img" aria-label="Globo de empresas" />,
          legend: <p>Sedes de las empresas</p>,
        },
      }}
    />,
  );
}

describe("GlobeTabs", () => {
  it("arranca en Equipo con su globo y su leyenda", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Equipo · 12 nacionalidades" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("img", { name: "Globo del equipo" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Nacionalidades del equipo");
  });

  it("cambia de dataset y de leyenda al elegir Empresas (también con teclado)", async () => {
    const user = userEvent.setup();
    renderTabs();
    screen.getByRole("tab", { name: "Equipo · 12 nacionalidades" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Empresas · 5 países" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("img", { name: "Globo de empresas" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Sedes de las empresas");
  });
});
