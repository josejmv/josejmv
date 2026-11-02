interface FlowProps {
  /** Pasos del flujo, en orden. */
  steps: string[];
  /** Descripción accesible del diagrama. */
  label: string;
}

/**
 * Diagrama de flujo simple (Arquitectura en los case studies): pasos conectados por flechas.
 * Es una lista ordenada, así que se lee bien sin estilos y con lector de pantalla.
 */
export function Flow({ steps, label }: FlowProps) {
  return (
    <figure className="mt-6">
      <ol
        aria-label={label}
        className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
      >
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-subtle sm:inline">
                →
              </span>
            )}
            <span className="rounded-xl border border-border bg-surface-2 px-3.5 py-2 font-mono text-xs text-text">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
