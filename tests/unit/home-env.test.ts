import { describe, expect, it } from "vitest";

import { getGlobeData, getProfile } from "@/lib/content";
import { withHome } from "@/lib/globe/with-home";
import { countryName, readHome } from "@/lib/home";

describe("readHome (variables HOME_*)", () => {
  it("sin variables usa Cajicá, Colombia", () => {
    expect(readHome({})).toEqual({ country: "CO", city: "Cajicá", lat: 4.92, lng: -74.03 });
  });

  it("lee país, ciudad y coordenadas (p. ej. una mudanza a Chile)", () => {
    expect(
      readHome({
        HOME_COUNTRY: "cl",
        HOME_CITY: "Santiago",
        HOME_LAT: "-33.45",
        HOME_LNG: "-70.67",
      }),
    ).toEqual({ country: "CL", city: "Santiago", lat: -33.45, lng: -70.67 });
  });

  it("variables vacías caen al valor por defecto", () => {
    expect(readHome({ HOME_COUNTRY: " ", HOME_CITY: "" }).country).toBe("CO");
  });

  it("rompe con un mensaje claro si un valor es inválido", () => {
    expect(() => readHome({ HOME_COUNTRY: "Chile" })).toThrow(/HOME_COUNTRY/);
    expect(() => readHome({ HOME_LAT: "120" })).toThrow(/HOME_\*/);
  });

  it("nombra el país en cada idioma", () => {
    expect(countryName("ES", "es")).toBe("España");
    expect(countryName("ES", "en")).toBe("Spain");
  });
});

describe("origen en el perfil y el globo", () => {
  it("la ubicación del perfil es «Ciudad, País» localizada", () => {
    expect(getProfile("es").location).toBe("Cajicá, Colombia");
    expect(getProfile("es").country).toBe("CO");
  });

  it("el globo recibe el origen con nombre localizado", () => {
    expect(getGlobeData("en").home).toEqual({ id: "CO", name: "Colombia", lat: 4.92, lng: -74.03 });
  });

  it("withHome añade el origen si su país no está en la vista, sin duplicarlo si ya está", () => {
    const { team } = getGlobeData("es");
    const chile = { id: "CL", name: "Chile", lat: -33.45, lng: -70.67 };
    expect(withHome(team, chile)).toHaveLength(team.length + 1);
    expect(withHome(team, chile).at(-1)).toMatchObject({ id: "CL", kind: "team" });
    expect(withHome(team, getGlobeData("es").home)).toBe(team);
  });
});
