import { describe, expect, it } from "vitest";

import { companyCountries, teamCountries } from "../../content/countries";

describe("content/countries", () => {
  it("tiene 13 nacionalidades del equipo y 5 países de empresas", () => {
    expect(teamCountries).toHaveLength(13);
    expect(companyCountries).toHaveLength(5);
  });

  it("usa el kind correcto en cada vista", () => {
    expect(teamCountries.every((c) => c.kind === "team")).toBe(true);
    expect(companyCountries.every((c) => c.kind === "company")).toBe(true);
  });
});
