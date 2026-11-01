import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "../../src/app/globals.css"), "utf8");

/** Tokens de la tabla de CLAUDE.md, más `--on-accent` (texto sobre `--accent`). */
const TOKENS = [
  "bg",
  "surface",
  "surface-2",
  "chip",
  "border",
  "text",
  "text-2",
  "muted",
  "subtle",
  "accent",
  "on-accent",
  "accent-text",
  "accent-2",
  "success",
] as const;

function block(selector: RegExp): string {
  const match = css.match(selector);
  if (!match) throw new Error(`No se encontró el bloque ${selector}`);
  return match[1];
}

const dark = block(/:root,\s*\[data-theme="dark"\]\s*\{([^}]*)\}/);
const light = block(/\[data-theme="light"\]\s*\{([^}]*)\}/);
const theme = block(/@theme inline\s*\{([^}]*)\}/);

describe("tokens de diseño (globals.css)", () => {
  it.each(TOKENS)("--%s existe en tema oscuro y claro", (token) => {
    expect(dark).toMatch(new RegExp(`--${token}:`));
    expect(light).toMatch(new RegExp(`--${token}:`));
  });

  it.each(TOKENS)("--%s está expuesto a Tailwind como --color-%s", (token) => {
    expect(theme).toContain(`--color-${token}: var(--${token});`);
  });

  it("mapea las tres familias tipográficas a next/font", () => {
    expect(theme).toContain("--font-display: var(--font-sora)");
    expect(theme).toContain("--font-sans: var(--font-inter)");
    expect(theme).toContain("--font-mono: var(--font-jetbrains)");
  });
});
