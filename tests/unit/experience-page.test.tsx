import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { ExperienceCard } from "@/components/experience/experience-card";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { getAreas, getExperience } from "@/lib/content";

import es from "../../messages/es.json";

const roles = getExperience("es");
const labels = { highlights: "Logros", projects: "Proyectos del rol", stack: "stack" };

function renderTimeline() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <ExperienceTimeline
        areas={getAreas("es").map((a) => ({ value: a.slug, label: a.title }))}
        items={roles.map((role) => ({
          id: role.id,
          areas: role.areas,
          card: <ExperienceCard role={role} period="periodo" labels={labels} />,
        }))}
      />
    </NextIntlClientProvider>,
  );
}

describe("ExperienceCard", () => {
  it("muestra empresa, rol, periodo y secciones plegables", () => {
    const upcard = roles[0];
    const { container } = render(
      <ExperienceCard role={upcard} period="nov 2025 – actualidad" labels={labels} open />,
    );
    const card = screen.getByRole("article", { name: upcard.company });
    expect(within(card).getByText(upcard.role)).toBeInTheDocument();
    expect(within(card).getByText("nov 2025 – actualidad")).toBeInTheDocument();
    const details = container.querySelectorAll("details");
    expect(details[0]).toHaveAttribute("open");
    expect(details[1]).not.toHaveAttribute("open");
  });

  it("omite la sección de proyectos si el rol no tiene", () => {
    const seo = roles.find((r) => r.id === "seo-contenidos")!;
    render(<ExperienceCard role={seo} period="p" labels={labels} />);
    expect(screen.queryByText("Proyectos del rol")).not.toBeInTheDocument();
  });
});

describe("ExperienceTimeline", () => {
  it("muestra todos los roles y filtra por área", async () => {
    const user = userEvent.setup();
    renderTimeline();
    expect(screen.getAllByRole("article")).toHaveLength(roles.length);

    await user.click(screen.getByRole("button", { name: "Compliance AML/KYC" }));
    const visible = screen.getAllByRole("article");
    expect(visible.map((a) => a.getAttribute("aria-labelledby"))).toEqual(["role-minca-ai"]);
    expect(screen.getByRole("button", { name: "Compliance AML/KYC" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 rol");

    await user.click(screen.getByRole("button", { name: "Todas" }));
    expect(screen.getAllByRole("article")).toHaveLength(roles.length);
  });
});
