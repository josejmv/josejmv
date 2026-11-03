import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConstellationFallback2D } from "@/components/areas/index/constellation-fallback-2d";
import {
  initialSelection,
  stepSelection,
  useAreaSelection,
} from "@/components/areas/index/use-area-selection";
import { getConstellation } from "@/lib/content";

const IDS = ["frontend", "backend-pagos", "compliance"] as const;

describe("selección de área", () => {
  afterEach(() => window.history.replaceState(null, "", "/es/areas"));

  it("parte del valor por defecto o de un ?area= válido", () => {
    expect(initialSelection("", IDS, "backend-pagos")).toBe("backend-pagos");
    expect(initialSelection("?area=compliance", IDS, "backend-pagos")).toBe("compliance");
    expect(initialSelection("?area=nope", IDS, "backend-pagos")).toBe("backend-pagos");
    expect(initialSelection("?foo=1&area=frontend", IDS, "backend-pagos")).toBe("frontend");
  });

  it("las flechas avanzan en orden y dan la vuelta", () => {
    expect(stepSelection(IDS, "frontend", 1)).toBe("backend-pagos");
    expect(stepSelection(IDS, "compliance", 1)).toBe("frontend");
    expect(stepSelection(IDS, "frontend", -1)).toBe("compliance");
  });

  it("el hook lee la URL al montar y la actualiza al seleccionar", () => {
    window.history.replaceState(null, "", "/es/areas?area=compliance");
    const { result } = renderHook(() => useAreaSelection(IDS, "backend-pagos"));
    expect(result.current.selected).toBe("compliance");

    act(() => result.current.step(1));
    expect(result.current.selected).toBe("frontend");
    expect(window.location.search).toBe("?area=frontend");
  });
});

describe("ConstellationFallback2D", () => {
  const graph = getConstellation("es");

  function Harness() {
    const { selected, select, step } = useAreaSelection(
      graph.nodes.map((n) => n.id),
      graph.defaultSelected,
    );
    return (
      <ConstellationFallback2D
        graph={graph}
        selected={selected}
        onSelect={select}
        onStep={step}
        groupLabel="Áreas"
        coreLabel="JMV"
      />
    );
  }

  it("es un radiogroup con un radio por área y Backend & Pagos marcado", () => {
    render(<Harness />);
    const group = screen.getByRole("radiogroup", { name: "Áreas" });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(screen.getByRole("radio", { name: "Backend & Pagos" })).toBeChecked();
    // Solo el activo entra en el orden de Tab.
    expect(screen.getByRole("radio", { name: "Backend & Pagos" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Frontend" })).toHaveAttribute("tabindex", "-1");
  });

  it("clic y flechas cambian la selección; solo se etiquetan las conexiones activas", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const edgeLabels = () =>
      [...container.querySelectorAll("span[data-constellation-label]")]
        .map((el) => el.textContent)
        .filter((text) => text && !graph.nodes.some((n) => n.title === text));

    expect(edgeLabels()).toEqual(["Sitio de pagos (Next.js)", "Gate de CI", "Motor KYC (FastAPI)"]);

    await user.click(screen.getByRole("radio", { name: "Compliance AML/KYC" }));
    expect(screen.getByRole("radio", { name: "Compliance AML/KYC" })).toBeChecked();
    expect(edgeLabels()).toEqual(["Motor KYC (FastAPI)", "Extracción con Bedrock"]);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "DevOps" })).toBeChecked();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Backend & Pagos" })).toBeChecked();
  });
});
