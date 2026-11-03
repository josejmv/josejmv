import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      Object.assign(acc, flatten(value as Record<string, unknown>, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});
}

describe("messages", () => {
  const flatEs = flatten(es);
  const flatEn = flatten(en);

  it("es y en tienen las mismas claves", () => {
    expect(Object.keys(flatEn).sort()).toEqual(Object.keys(flatEs).sort());
  });

  it("ningún texto está vacío (los datos de las demos pueden ser números)", () => {
    for (const [key, value] of Object.entries({ ...flatEs, ...flatEn })) {
      const ok =
        (typeof value === "string" && value.trim().length > 0) ||
        (typeof value === "number" && Number.isFinite(value));
      expect(ok, key).toBe(true);
    }
  });
});
