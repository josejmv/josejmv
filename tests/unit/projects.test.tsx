import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { projects } from "../../content/projects";
import { AREA_SLUGS, Project } from "../../content/schema";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getProjects } from "@/lib/content";

import es from "../../messages/es.json";

describe("content/projects", () => {
  it("valida contra el esquema y usa slugs únicos", () => {
    expect(() => projects.map((p) => Project.parse(p))).not.toThrow();
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("cada case study tiene su MDX en es y en", () => {
    for (const project of projects.filter((p) => "caseStudy" in p && p.caseStudy)) {
      for (const locale of ["es", "en"]) {
        const file = resolve(__dirname, `../../content/projects/${locale}/${project.slug}.mdx`);
        expect(existsSync(file), file).toBe(true);
      }
    }
  });

  it("solo usa áreas conocidas", () => {
    for (const p of projects) for (const a of p.areas) expect(AREA_SLUGS).toContain(a);
  });
});

const labels = { status: "en producción", readCase: "Leer el case study →" };

describe("ProjectCard", () => {
  const list = getProjects("es");

  it("enlaza al case study cuando existe", () => {
    const project = { ...list[0], caseStudy: true };
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ProjectCard project={project} labels={labels} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
      "href",
      `/es/proyectos/${project.slug}`,
    );
  });

  it("no enlaza si no hay case study", () => {
    const project = { ...list[0], caseStudy: false };
    render(<ProjectCard project={project} labels={labels} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
  });
});

describe("ProjectGrid", () => {
  it("combina los filtros de área y tecnología", async () => {
    const user = userEvent.setup();
    const list = getProjects("es");
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ProjectGrid
          areas={[
            { value: "backend-pagos", label: "Backend & Pagos" },
            { value: "frontend", label: "Frontend" },
          ]}
          tech={[
            { value: "NestJS", label: "NestJS" },
            { value: "Python", label: "Python" },
          ]}
          items={list.map((p) => ({
            slug: p.slug,
            areas: p.areas,
            tech: p.tech,
            card: <article aria-label={p.title} />,
          }))}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getAllByRole("article")).toHaveLength(list.length);

    const areaGroup = screen.getByRole("group", { name: es.Projects.filterArea });
    await user.click(within(areaGroup).getByRole("button", { name: "Backend & Pagos" }));
    const backend = list.filter((p) => p.areas.includes("backend-pagos"));
    expect(screen.getAllByRole("article")).toHaveLength(backend.length);

    const techGroup = screen.getByRole("group", { name: es.Projects.filterTech });
    await user.click(within(techGroup).getByRole("button", { name: "Python" }));
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText(es.Projects.empty)).toBeInTheDocument();
  });
});
