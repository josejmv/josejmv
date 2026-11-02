"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

export interface ExtractionField {
  key: string;
  label: string;
  value: string;
  /** Fragmento del documento del que sale el valor (se resalta al extraerlo). */
  source: string;
}

interface ExtractionDemoProps {
  documentTitle: string;
  documentLines: string[];
  fields: ExtractionField[];
}

/** Caracteres por tic del "streaming" y duración del tic. */
const CHARS_PER_TICK = 3;
const TICK_MS = 28;

/**
 * ExtractionDemo (módulo firma de AI Engineering): un documento ficticio y el JSON que se extrae
 * campo por campo con efecto de streaming. El campo en curso resalta su fragmento en el documento.
 */
export function ExtractionDemo({ documentTitle, documentLines, fields }: ExtractionDemoProps) {
  const t = useTranslations("AreaAi");
  const reducedMotion = useReducedMotion();
  const json = `{\n${fields.map((f) => `  "${f.key}": ${JSON.stringify(f.value)}`).join(",\n")}\n}`;
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  // "En curso" se deriva del estado: no hace falta apagarlo desde el efecto.
  const running = started && shown < json.length;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setShown((n) => Math.min(n + CHARS_PER_TICK, json.length)),
      TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [running, shown, json.length]);

  const start = () => {
    setStarted(true);
    setShown(reducedMotion ? json.length : 0);
  };

  const visible = json.slice(0, shown);
  // Campo que se está escribiendo: el último cuya clave ya apareció en el texto visible.
  const activeIndex = fields.findLastIndex((f) => visible.includes(`"${f.key}"`));
  const active = running && activeIndex >= 0 ? fields[activeIndex] : null;
  const done = shown >= json.length && shown > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
          <figcaption className="flex items-center justify-between font-mono text-xs text-muted">
            <span>{documentTitle}</span>
            <span>PDF</span>
          </figcaption>
          <div className="flex flex-col gap-1.5 text-sm leading-relaxed text-text-2">
            {documentLines.map((line) => {
              const highlighted = active && line.includes(active.source);
              return (
                <p
                  key={line}
                  className={cn(
                    "rounded-md px-1.5 transition-colors duration-200",
                    highlighted && "bg-accent/25 text-text",
                  )}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </figure>

        <div className="flex flex-col rounded-2xl border border-border bg-surface-2">
          <p className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-xs text-muted">
            <span>extraction.json</span>
            <span>{running ? t("streaming") : done ? t("done") : t("waiting")}</span>
          </p>
          <pre
            aria-live="off"
            className="min-h-64 flex-1 overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-text-2"
          >
            {visible}
            {running && (
              <span
                aria-hidden="true"
                className="inline-block h-[14px] w-[7px] translate-y-0.5 bg-accent-text motion-safe:animate-caret"
              />
            )}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={start} disabled={running}>
          {done ? t("actions.again") : t("actions.extract")}
        </Button>
        <p role="status" className="text-sm text-muted">
          {done && t("result", { count: fields.length })}
        </p>
      </div>
    </div>
  );
}
