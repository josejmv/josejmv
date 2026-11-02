import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { GradientText } from "@/components/ui/gradient-text";
import { StatCard } from "@/components/ui/stat-card";

function withIntl(node: ReactNode, locale: "es" | "en" = "es") {
  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      {node}
    </NextIntlClientProvider>
  );
}

describe("Button", () => {
  it("renderiza <button type=button> por defecto", () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute("type", "button");
  });

  it("renderiza <a> cuando recibe href", () => {
    render(<Button href="mailto:hola@example.com">Gmail</Button>);
    expect(screen.getByRole("link", { name: "Gmail" })).toHaveAttribute(
      "href",
      "mailto:hola@example.com",
    );
  });

  it("todas las variantes cumplen el objetivo táctil de 44px", () => {
    expect(buttonClasses({ size: "md" })).toContain("h-11");
    expect(buttonClasses({ size: "lg" })).toContain("h-[50px]");
  });

  it("permite sobrescribir clases sin duplicar conflictos", () => {
    expect(buttonClasses({ className: "px-8" })).not.toMatch(/\bpx-4\b/);
  });
});

describe("Chip", () => {
  it("aplica la variante pedida", () => {
    render(<Chip variant="tech">nestjs</Chip>);
    expect(screen.getByText("nestjs")).toHaveClass("font-mono");
  });
});

describe("GradientText", () => {
  it("mantiene el texto accesible", () => {
    render(
      <h1>
        José M. <GradientText>Vasquez</GradientText>
      </h1>,
    );
    expect(screen.getByRole("heading", { name: "José M. Vasquez" })).toBeInTheDocument();
  });
});

describe("AvailabilityBadge", () => {
  it("oculta el punto a los lectores de pantalla", () => {
    const { container } = render(<AvailabilityBadge>Disponible</AvailabilityBadge>);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("bg-success");
  });
});

describe("AnimatedCounter", () => {
  it("muestra el valor final con formato del locale (es)", () => {
    render(withIntl(<AnimatedCounter value={4238} />, "es"));
    // jsdom: matchMedia simulado sin reduced-motion e IntersectionObserver ausente → no anima.
    expect(screen.getAllByText("4238").length).toBeGreaterThan(0);
  });

  it("usa separador de miles en inglés", () => {
    render(withIntl(<AnimatedCounter value={4238} />, "en"));
    expect(screen.getAllByText("4,238").length).toBeGreaterThan(0);
  });
});

describe("StatCard", () => {
  it("muestra valor y etiqueta", () => {
    render(withIntl(<StatCard value={7} label="años de experiencia" />));
    expect(screen.getByText("años de experiencia")).toBeInTheDocument();
    expect(screen.getAllByText("7").length).toBeGreaterThan(0);
  });
});
