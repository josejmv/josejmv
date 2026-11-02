import { type ChainStep, StepChain } from "../step-chain";

export interface DocsStat {
  value: string;
  label: string;
}

interface DocsStandardProps {
  title: string;
  label: string;
  steps: ChainStep[];
  stats: DocsStat[];
}

/** DocsStandard: el flujo de cuatro artefactos por feature y su adopción. */
export function DocsStandard({ title, label, steps, stats }: DocsStandardProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepChain title={title} label={label} steps={steps} />
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col rounded-2xl border border-border bg-surface p-4"
          >
            <dt className="order-2 text-xs text-muted">{stat.label}</dt>
            <dd className="order-1 font-display text-2xl font-semibold text-accent-text">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
