import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { emptyDiffRun, runAfter, STAGES } from "@/components/areas/devops/pipeline-run";
import { PipelineRunner } from "@/components/areas/devops/pipeline-runner";

import es from "../../messages/es.json";

describe("pipeline-run", () => {
  it("marca las etapas completadas, la actual y las pendientes", () => {
    const state = runAfter(2);
    expect(state.stages).toEqual({
      lint: "passed",
      typecheck: "passed",
      test: "running",
      build: "idle",
      deploy: "idle",
    });
    expect(runAfter(STAGES.length).outcome).toBe("passed");
  });

  it("un diff vacío falla en la primera etapa y omite el resto", () => {
    const state = emptyDiffRun();
    expect(state.stages.lint).toBe("failed");
    expect(state.outcome).toBe("emptyDiff");
  });
});

describe("PipelineRunner", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  function renderRunner() {
    return render(
      <NextIntlClientProvider locale="es" messages={es}>
        <PipelineRunner />
      </NextIntlClientProvider>,
    );
  }

  it("corre las 5 etapas hasta aprobar el pipeline", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderRunner();
    await user.click(screen.getByRole("button", { name: es.AreaDevops.actions.run }));
    // Cada etapa programa la siguiente en un efecto: se avanza el reloj de a una etapa.
    for (let i = 0; i < STAGES.length; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1_500);
      });
    }
    expect(screen.getByRole("status")).toHaveTextContent(es.AreaDevops.outcome.passed);
  });

  it("el toggle cambia los tiempos medidos", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderRunner();
    expect(screen.getAllByText("0:03").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("radio", { name: es.AreaDevops.modes.before }));
    expect(screen.getAllByText("1:36").length).toBeGreaterThan(0);
    expect(
      within(screen.getByRole("list", { name: es.AreaDevops.stagesLabel })).getByText("255 s"),
    ).toBeInTheDocument();
    // Antes del gate no existe la protección contra diffs vacíos.
    expect(screen.getByRole("button", { name: es.AreaDevops.actions.emptyDiff })).toBeDisabled();
  });

  it("con el gate, un diff vacío falla de forma explícita", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderRunner();
    await user.click(screen.getByRole("button", { name: es.AreaDevops.actions.emptyDiff }));
    expect(screen.getByRole("status")).toHaveTextContent(/la lista de cambios llegó vacía/);
  });
});
