import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/components/sections/home/hero-section";
import { getProfile } from "@/lib/content";

import es from "../../messages/es.json";

const labels = {
  terminalTitle: es.Hero.terminalTitle,
  terminalCommand: es.Hero.terminalCommand,
  contactList: es.Hero.contactList,
};

describe("HeroSection", () => {
  const profile = getProfile("es");

  it("muestra el nombre completo como h1 con el apellido destacado", () => {
    render(<HeroSection profile={profile} labels={labels} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(profile.name);
    expect(within(heading).getByText("Vasquez")).toHaveClass("bg-clip-text");
  });

  it("lista los canales de contacto con Gmail primero y como CTA primario", () => {
    render(<HeroSection profile={profile} labels={labels} />);
    const list = screen.getByRole("list", { name: es.Hero.contactList });
    const links = within(list).getAllByRole("link");
    expect(links[0]).toHaveTextContent("Gmail");
    expect(links[0]).toHaveAttribute("href", "mailto:josejmvasquez@gmail.com");
    expect(links[0]).toHaveClass("bg-accent");
    expect(links.slice(1).every((l) => !l.className.includes("bg-accent"))).toBe(true);
  });

  it("abre los enlaces externos en otra pestaña de forma segura", () => {
    render(<HeroSection profile={profile} labels={labels} />);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("deja el comando completo en el HTML (el efecto de escritura es solo CSS)", () => {
    render(<HeroSection profile={profile} labels={labels} />);
    expect(screen.getByText(es.Hero.terminalCommand)).toHaveClass("typing");
  });
});
