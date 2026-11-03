import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { ContactCta } from "@/components/sections/home/contact-cta";
import { EducationCard } from "@/components/sections/home/education-card";
import { StackCloud } from "@/components/sections/home/stack-cloud";
import { getEducation, getStack } from "@/lib/content";

import es from "../../messages/es.json";

describe("EducationCard", () => {
  it("lista carrera y certificaciones bajo su encabezado", () => {
    render(<EducationCard title={es.Education.title} items={getEducation("es")} />);
    const section = screen.getByRole("region", { name: es.Education.title });
    expect(within(section).getByText("Ingeniería en Informática (estudios)")).toBeInTheDocument();
    expect(within(section).getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("StackCloud", () => {
  it("muestra cada tecnología como chip", () => {
    render(<StackCloud title={es.Stack.title} items={getStack()} />);
    const section = screen.getByRole("region", { name: es.Stack.title });
    expect(within(section).getAllByRole("listitem")).toHaveLength(getStack().length);
  });
});

describe("ContactCta", () => {
  it("es el ancla #contacto, su CTA abre Gmail y el secundario lleva a Contacto", () => {
    const { container } = render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ContactCta
          title={es.Cta.title}
          subtitle={es.Cta.subtitle}
          action={es.Cta.action}
          href="mailto:josejmvasquez@gmail.com"
          secondary={es.Cta.secondary}
        />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("link", { name: es.Cta.secondary })).toHaveAttribute(
      "href",
      "/es/contacto",
    );
    expect(container.querySelector("#contacto")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: es.Cta.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: es.Cta.action })).toHaveAttribute(
      "href",
      "mailto:josejmvasquez@gmail.com",
    );
  });
});
