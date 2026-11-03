export interface KycStep {
  key: string;
  title: string;
  description: string;
  /** Ejemplo ficticio de lo que produce el paso. */
  sample: string;
}

interface KycPipelineProps {
  label: string;
  steps: KycStep[];
}

/**
 * KycPipeline (módulo firma de Compliance): los 5 pasos del motor KYC se revelan a medida que se
 * hace scroll (`scroll-reveal`, CSS puro). Server Component, sin JS.
 */
export function KycPipeline({ label, steps }: KycPipelineProps) {
  return (
    <ol aria-label={label} className="relative flex flex-col gap-4">
      {steps.map((step, index) => (
        <li
          key={step.key}
          className="grid scroll-reveal gap-3 rounded-2xl border border-accent-text/30 bg-surface-2 p-5 sm:grid-cols-[48px_1fr_minmax(0,1fr)] sm:items-start"
        >
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-xl bg-accent/15 font-display text-lg font-semibold text-accent-text"
          >
            {index + 1}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
          </div>
          <p className="rounded-xl bg-surface p-3 font-mono text-xs leading-relaxed text-text-2">
            {step.sample}
          </p>
        </li>
      ))}
    </ol>
  );
}
