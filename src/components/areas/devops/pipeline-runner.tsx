"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import {
  emptyDiffRun,
  idleRun,
  MEASURED,
  type Mode,
  runAfter,
  type RunState,
  STAGES,
  stageDelay,
  type StageState,
} from "./pipeline-run";

const STATE_STYLES: Record<StageState, string> = {
  idle: "border-border bg-surface-2 text-muted",
  running: "border-accent-text bg-accent/15 text-text motion-safe:animate-pulse-soft",
  passed: "border-success/40 bg-success/10 text-text",
  failed: "border-text/40 bg-text/10 text-text",
  skipped: "border-border bg-surface-2 text-subtle line-through",
};

const STATE_ICONS: Record<StageState, string> = {
  idle: "·",
  running: "…",
  passed: "✓",
  failed: "✕",
  skipped: "–",
};

/**
 * PipelineRunner (módulo firma de DevOps): corre lint → typecheck → test → build → deploy. El toggle
 * compara el pipeline antes y después del gate de MR con los tiempos medidos.
 */
export function PipelineRunner() {
  const t = useTranslations("AreaDevops");
  const [mode, setMode] = useState<Mode>("after");
  const [run, setRun] = useState<RunState>(idleRun);
  const [done, setDone] = useState<number | null>(null);

  // Avanza etapa por etapa mientras la corrida está en curso.
  useEffect(() => {
    if (done === null || done >= STAGES.length) return;
    const timer = setTimeout(
      () => {
        const next = done + 1;
        setDone(next);
        setRun(runAfter(next));
      },
      stageDelay(STAGES[done], mode),
    );
    return () => clearTimeout(timer);
  }, [done, mode]);

  const start = () => {
    setDone(0);
    setRun(runAfter(0));
  };

  const emptyDiff = () => {
    setDone(null);
    setRun(emptyDiffRun());
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setDone(null);
    setRun(idleRun);
  };

  const running = run.outcome === "running";

  return (
    <div className="flex flex-col gap-5">
      <div role="radiogroup" aria-label={t("modeLabel")} className="flex flex-wrap gap-2">
        {(["before", "after"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={mode === key}
            onClick={() => switchMode(key)}
            className={cn(
              "h-11 rounded-pill border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              mode === key
                ? "border-transparent bg-accent font-semibold text-on-accent"
                : "border-border text-text-2 hover:bg-chip",
            )}
          >
            {t(`modes.${key}`)}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted">{t(`scope.${mode}`)}</p>

      <ol aria-label={t("stagesLabel")} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STAGES.map((stage) => {
          const state = run.stages[stage];
          return (
            <li
              key={stage}
              className={cn(
                "flex min-h-20 flex-col justify-between rounded-xl border p-3 transition-colors duration-300",
                STATE_STYLES[state],
              )}
            >
              <span className="flex items-center justify-between font-mono text-xs">
                {stage}
                <span aria-hidden="true">{STATE_ICONS[state]}</span>
              </span>
              <span className="sr-only">: {t(`states.${state}`)}</span>
              {stage === "test" && (
                <span className="font-mono text-[11px] text-text-2">{MEASURED.tests[mode]}</span>
              )}
            </li>
          );
        })}
      </ol>

      <dl className="grid gap-3 sm:grid-cols-2">
        {(["cacheSave", "tests"] as const).map((key) => (
          <div key={key} className="rounded-2xl border border-border bg-surface-2 p-4">
            <dt className="text-sm text-muted">{t(`measured.${key}`)}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-accent-text">
              {MEASURED[key][mode]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={start} disabled={running}>
          {t("actions.run")}
        </Button>
        <Button variant="secondary" onClick={emptyDiff} disabled={running || mode === "before"}>
          {t("actions.emptyDiff")}
        </Button>
      </div>

      <p role="status" className="min-h-6 font-mono text-xs text-text-2">
        {run.outcome !== "idle" && t(`outcome.${run.outcome}`)}
      </p>
    </div>
  );
}
