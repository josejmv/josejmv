import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GlobeStaticSvg } from "@/components/three/globe/globe-static-svg";
import { getGlobeData } from "@/lib/content";
import {
  arcPath,
  cameraAltitude,
  GLOBE_CENTER,
  GLOBE_RADIUS,
  project,
  toLimb,
} from "@/lib/globe/projection";

describe("proyección ortográfica", () => {
  it("coincide con las coordenadas del lienzo de diseño (Colombia)", () => {
    const co = project({ lat: 4.71, lng: -74.07 });
    expect(co.x).toBeCloseTo(94.3, 0);
    expect(co.y).toBeCloseTo(252.2, 0);
    expect(co.visible).toBe(true);
  });

  it("marca como ocultos los puntos de la cara posterior", () => {
    expect(project({ lat: 23.81, lng: 90.41 }).visible).toBe(false); // Bangladesh
  });

  it("lleva los puntos ocultos al borde del globo", () => {
    const limb = toLimb(project({ lat: 23.81, lng: 90.41 }));
    const distance = Math.hypot(limb.x - GLOBE_CENTER, limb.y - GLOBE_CENTER);
    expect(distance).toBeGreaterThan(GLOBE_RADIUS);
  });

  it("genera un arco cuadrático entre dos puntos", () => {
    expect(arcPath({ x: 0, y: 0, visible: true }, { x: 10, y: 0, visible: true })).toMatch(
      /^M0 0 Q[\d.-]+ [\d.-]+ 10 0$/,
    );
  });
});

describe("GlobeStaticSvg", () => {
  const data = getGlobeData("es");

  it("vista Equipo: un arco por país (sin contar el origen) y etiqueta accesible", () => {
    const { container } = render(
      <GlobeStaticSvg points={data.team} home={data.home} label="Globo del equipo" />,
    );
    expect(screen.getByRole("img", { name: "Globo del equipo" })).toBeInTheDocument();
    expect(container.querySelectorAll("path")).toHaveLength(data.team.length - 1);
    expect(screen.getByText("BD →")).toBeInTheDocument();
  });

  it("vista Empresas: anillos en lugar de puntos", () => {
    const { container } = render(
      <GlobeStaticSvg points={data.company} home={data.home} label="Globo de empresas" />,
    );
    expect(container.querySelectorAll("circle.stroke-accent-text[r='6']").length).toBeGreaterThan(
      0,
    );
    expect(container.querySelectorAll("circle.fill-accent-2")).toHaveLength(0);
  });
});

describe("cameraAltitude (fundido sin costuras)", () => {
  it("encuadra la esfera 3D al mismo tamaño que la del SVG (radio 200 de 440)", () => {
    const altitude = cameraAltitude();
    expect(altitude).toBeCloseTo(1.562, 2);
    // Comprobación inversa: a esa altitud la esfera ocupa el 90,9 % del lado.
    const distance = 100 * (1 + altitude);
    const fill = Math.tan(Math.asin(100 / distance)) / Math.tan((25 * Math.PI) / 180);
    expect(fill).toBeCloseTo((2 * GLOBE_RADIUS) / 440, 4);
  });
});
