import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const SCANNED = ["src/components", "src/app"].map((dir) => join(ROOT, dir));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(tsx?|jsx?)$/.test(name) ? [path] : [];
  });
}

const files = SCANNED.flatMap(walk);

describe("reglas de diseño (CLAUDE.md)", () => {
  it("regla 4: no hay colores hex en componentes ni páginas", () => {
    const offenders = files
      .filter((file) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(file, "utf8")))
      .map((file) => relative(ROOT, file));
    expect(offenders).toEqual([]);
  });

  it("regla 10: archivos en kebab-case", () => {
    const offenders = files
      .map((file) => relative(ROOT, file))
      .filter((path) => !/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(path.split(/[\\/]/).pop()!));
    expect(offenders).toEqual([]);
  });
});
