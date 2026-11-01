import { describe, expect, it } from "vitest";

import { companyCountries, teamCountries } from "../../content/countries";

describe("content/countries", () => {
  it("tiene 12 nacionalidades del equipo y 4 países de empresas", () => {
    expect(teamCountries).toHaveLength(12);
    expect(companyCountries).toHaveLength(4);
  });

  it("usa el kind correcto en cada vista", () => {
    expect(teamCountries.every((c) => c.kind === "team")).toBe(true);
    expect(companyCountries.every((c) => c.kind === "company")).toBe(true);
  });
});
