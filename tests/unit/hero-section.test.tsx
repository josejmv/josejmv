import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeroSection } from "@/components/sections/home/hero-section";
import { getProfile } from "@/lib/content";

import es from "../../messages/es.json";

// El prompt interactivo se prueba aparte (commands.test.ts y E2E): aquí solo el markup del servidor.
vi.mock("@/components/contact/terminal/terminal-prompt", () => ({ TerminalPrompt: () => null }));

const terminal = {
  data: {} as never,
  strings: es.Terminal,
  labels: { input: "", placeholder: "", output: "" },
};

const labels = {
  terminalTitle: es.Hero.terminalTitle,
  terminalCommand: es.Hero.terminalCommand,
  contactList: es.Hero.contactList,
};

describe("HeroSection", () => {
  const profile = getProfile("es");

  it("muestra el nombre completo como h1 con el apellido destacado", () => {
    render(<HeroSection profile={profile} labels={labels} terminal={terminal} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(profile.name);
    expect(within(heading).getByText("Vasquez")).toHaveClass("bg-clip-text");
  });

  it("lista los canales de contacto con Gmail primero y como CTA primario", () => {
    render(<HeroSection profile={profile} labels={labels} terminal={terminal} />);
    const list = screen.getByRole("list", { name: es.Hero.contactList });
    const links = within(list).getAllByRole("link");
    expect(links[0]).toHaveTextContent("Gmail");
    expect(links[0]).toHaveAttribute("href", "mailto:josejmvasquez@gmail.com");
    expect(links[0]).toHaveClass("bg-accent");
    expect(links.slice(1).every((l) => !l.className.includes("bg-accent"))).toBe(true);
  });

  it("abre los enlaces externos en otra pestaña de forma segura", () => {
    render(<HeroSection profile={profile} labels={labels} terminal={terminal} />);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("deja el comando completo en el HTML (el efecto de escritura es solo CSS)", () => {
    render(<HeroSection profile={profile} labels={labels} terminal={terminal} />);
    expect(screen.getByText(es.Hero.terminalCommand)).toHaveClass("typing");
  });
});
