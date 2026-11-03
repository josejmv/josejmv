/**
 * Modelo del PipelineRunner. Los únicos tiempos que se muestran son los medidos en el gate real
 * (guardado de caché y suite de tests); el resto de etapas no lleva tiempo para no inventarlo.
 */

export const STAGES = ["lint", "typecheck", "test", "build", "deploy"] as const;
export type Stage = (typeof STAGES)[number];
export type Mode = "before" | "after";
export type StageState = "idle" | "running" | "passed" | "failed" | "skipped";

/** Tiempos medidos (ver content/areas.ts y el case study del gate). */
export const MEASURED = {
  cacheSave: { before: "1:36", after: "0:03" },
  tests: { before: "255 s", after: "178 s" },
} as const;

/** Duración de la animación de cada etapa en la demo (ms), proporcional en la etapa de tests. */
export function stageDelay(stage: Stage, mode: Mode): number {
  if (stage === "test") return mode === "before" ? 1400 : 980;
  return 520;
}

export interface RunState {
  stages: Record<Stage, StageState>;
  /** Mensaje final de la corrida (clave de traducción). */
  outcome: "idle" | "running" | "passed" | "emptyDiff";
}

export const idleRun: RunState = {
  stages: { lint: "idle", typecheck: "idle", test: "idle", build: "idle", deploy: "idle" },
  outcome: "idle",
};

/** Estado de la corrida después de completar `done` etapas. */
export function runAfter(done: number): RunState {
  const stages = { ...idleRun.stages };
  STAGES.forEach((stage, index) => {
    stages[stage] = index < done ? "passed" : index === done ? "running" : "idle";
  });
  return { stages, outcome: done >= STAGES.length ? "passed" : "running" };
}

/**
 * Con el gate, un MR cuya lista de cambios llega vacía falla de forma explícita en la primera etapa
 * en lugar de "pasar en verde" sin haber verificado nada.
 */
export function emptyDiffRun(): RunState {
  return {
    stages: {
      lint: "failed",
      typecheck: "skipped",
      test: "skipped",
      build: "skipped",
      deploy: "skipped",
    },
    outcome: "emptyDiff",
  };
}
