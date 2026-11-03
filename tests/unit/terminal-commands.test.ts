import { describe, expect, it } from "vitest";

import {
  complete,
  resolvePath,
  run,
  type TerminalData,
} from "@/components/contact/terminal/commands";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

const data: TerminalData = {
  locale: "es",
  name: "José M. Vasquez",
  role: "Senior Full Stack Developer",
  location: "Cajicá, Colombia",
  summary: "Resumen.",
  experience: [{ period: "2025 – actualidad", role: "Senior Full Stack", company: "Upcard" }],
  stack: ["TypeScript", "NestJS"],
  areas: [
    { slug: "devops", title: "DevOps" },
    { slug: "frontend", title: "Frontend" },
  ],
  projects: [{ slug: "kyc-engine", title: "Motor KYC" }],
  contacts: [
    { id: "gmail", label: "Gmail", href: "mailto:hola@example.com" },
    { id: "github", label: "GitHub", href: "https://github.com/x" },
  ],
};
const ctx = { data, strings: es.Terminal };
const text = (input: string) =>
  run(input, ctx)
    .lines.map((l) => l.text)
    .join("\n");

describe("terminal: comandos", () => {
  it("help lista todos los comandos con su descripción", () => {
    const out = text("help");
    for (const command of ["whoami", "cd", "contact", "theme", "lang", "clear"]) {
      expect(out).toContain(command);
    }
    expect(out).toContain(es.Terminal.help.hint);
  });

  it("acepta alias en español y mayúsculas", () => {
    expect(text("AYUDA")).toBe(text("help"));
    expect(text("experiencia")).toContain("Upcard");
  });

  it("whoami, skills y experience salen de los datos", () => {
    expect(text("whoami")).toContain("José M. Vasquez — Senior Full Stack Developer");
    expect(text("skills")).toBe("TypeScript  NestJS");
    expect(text("experience")).toContain("Senior Full Stack @ Upcard");
  });

  it("ls muestra carpetas, áreas y proyectos", () => {
    expect(text("ls")).toBe("areas/  proyectos/  experiencia");
    expect(text("ls areas")).toBe("devops  frontend");
    expect(text("ls proyectos/")).toBe("kyc-engine");
    expect(run("ls nada", ctx).lines[0].tone).toBe("error");
  });

  it("cd navega a rutas reales y rechaza las que no existen", () => {
    expect(run("cd areas/devops", ctx).action).toEqual({
      type: "navigate",
      to: { kind: "area", slug: "devops" },
    });
    expect(run("cd ~/projects/kyc-engine/", ctx).action).toEqual({
      type: "navigate",
      to: { kind: "project", slug: "kyc-engine" },
    });
    expect(run("cd", ctx).action).toEqual({ type: "navigate", to: { kind: "home" } });
    const missing = run("cd areas/marketing", ctx);
    expect(missing.action).toBeUndefined();
    expect(missing.lines[0].text).toContain("areas/marketing");
  });

  it("contact lista los canales y abre uno por id", () => {
    expect(run("contact", ctx).lines.filter((l) => l.href)).toHaveLength(2);
    expect(run("contact github", ctx).action).toEqual({
      type: "open",
      href: "https://github.com/x",
    });
    expect(run("contact fax", ctx).lines[0].tone).toBe("error");
  });

  it("theme y lang validan su argumento", () => {
    expect(run("theme light", ctx).action).toEqual({ type: "theme", value: "light" });
    expect(run("theme", ctx).action).toEqual({ type: "theme", value: "toggle" });
    expect(run("theme blue", ctx).action).toBeUndefined();
    expect(run("lang en", ctx).action).toEqual({ type: "locale", value: "en" });
    expect(run("lang fr", ctx).action).toBeUndefined();
  });

  it("clear limpia y lo desconocido responde sin romper", () => {
    expect(run("clear", ctx).action).toEqual({ type: "clear" });
    expect(text("foo --bar")).toBe("comando no encontrado: foo. Prueba help.");
    expect(run("   ", ctx).lines).toEqual([]);
  });

  it("easter eggs: sudo hire, sudo a secas y rm -rf", () => {
    const hire = run("sudo hire jose", ctx).lines;
    expect(hire.at(-1)).toEqual({ text: "Gmail", href: "mailto:hola@example.com" });
    expect(text("sudo rm algo")).toBe(es.Terminal.sudoDenied);
    expect(text("rm -rf /")).toBe(es.Terminal.rm);
  });

  it("responde en inglés con los textos en inglés", () => {
    const out = run("nope", { data: { ...data, locale: "en" }, strings: en.Terminal });
    expect(out.lines[0].text).toBe("command not found: nope. Try help.");
  });
});

describe("terminal: autocompletado y rutas", () => {
  it("completa comandos y argumentos", () => {
    expect(complete("wh", data)).toBe("whoami ");
    expect(complete("cd areas/dev", data)).toBe("cd areas/devops");
    expect(complete("contact gi", data)).toBe("contact github");
    // Ambiguo: completa hasta el prefijo común.
    expect(complete("cd areas/", data)).toBe("cd areas/");
    expect(complete("c", data)).toBe("c");
  });

  it("resolvePath ignora mayúsculas, ~ y barras finales", () => {
    expect(resolvePath("~/Experiencia/", data)).toEqual({ kind: "experience" });
    expect(resolvePath("proyectos/no-existe", data)).toBeNull();
  });
});
