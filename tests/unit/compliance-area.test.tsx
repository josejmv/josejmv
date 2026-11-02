import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KycPipeline, type KycStep } from "@/components/areas/compliance/kyc-pipeline";
import { VerdictCard, type VerdictCheck } from "@/components/areas/compliance/verdict-card";

import es from "../../messages/es.json";

const steps = es.AreaCompliance.steps as KycStep[];
const checks = es.AreaCompliance.verdict.checks as VerdictCheck[];

describe("KycPipeline", () => {
  it("lista los 5 pasos en orden, con revelado por scroll en CSS", () => {
    render(<KycPipeline label="Pasos" steps={steps} />);
    const items = within(screen.getByRole("list", { name: "Pasos" })).getAllByRole("listitem");
    expect(items.map((li) => within(li).getByRole("heading").textContent)).toEqual([
      "Ingesta",
      "Clasificar",
      "Extraer",
      "Checks",
      "Veredicto",
    ]);
    expect(items.every((li) => li.classList.contains("scroll-reveal"))).toBe(true);
  });
});

describe("VerdictCard", () => {
  it("muestra el veredicto y el motivo de cada validación, con su resultado accesible", () => {
    render(
      <VerdictCard
        title="veredicto"
        subject="Ana Ejemplo Ruiz"
        verdict="Requiere revisión"
        verdictResult="review"
        checks={checks}
        resultLabels={{ pass: "aprobada", review: "a revisar", fail: "rechazada" }}
      />,
    );
    expect(screen.getByText("Requiere revisión")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(checks.length);
    expect(screen.getByText(/Comprobante de domicilio reciente/)).toHaveTextContent("a revisar");
    expect(screen.getByText("Tiene 95 días; la política pide 90 o menos.")).toBeInTheDocument();
  });
});
