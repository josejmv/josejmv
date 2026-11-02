interface MetricHighlightProps {
  delta: string;
  label: string;
  detail: string;
  context: string;
}

/** Métrica destacada (wireframe de Experiencia): variación grande + qué se midió y dónde. */
export function MetricHighlight({ delta, label, detail, context }: MetricHighlightProps) {
  return (
    <div className="flex flex-col gap-1 rounded-[18px] border border-border bg-surface p-5">
      <p className="font-display text-[34px] leading-tight font-semibold text-accent-text">
        {delta}
      </p>
      <p className="text-sm text-text-2">{label}</p>
      <p className="font-mono text-[11px] text-subtle">{detail}</p>
      <p className="mt-1 text-xs text-muted">{context}</p>
    </div>
  );
}
