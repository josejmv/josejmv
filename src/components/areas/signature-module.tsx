import type { ReactNode } from "react";

interface SignatureModuleProps {
  /** Nombre del módulo, p. ej. "TokenPlayground". */
  name: string;
  title: string;
  description: string;
  /** Aviso de datos ficticios (todas las demos lo llevan). */
  disclaimer: string;
  children: ReactNode;
}

/** Contenedor del módulo firma de cada área (borde dorado punteado, como en el wireframe). */
export function SignatureModule({
  name,
  title,
  description,
  disclaimer,
  children,
}: SignatureModuleProps) {
  return (
    <section aria-labelledby="signature-title" className="container-page">
      <div className="flex flex-col gap-6 rounded-card border border-dashed border-accent-text/45 bg-accent/5 p-5 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs text-accent-text">◆ {name}</p>
          <h2 id="signature-title" className="font-display text-2xl font-semibold">
            {title}
          </h2>
          <p className="max-w-[720px] text-muted">{description}</p>
        </div>
        {children}
        <p className="font-mono text-[11px] text-subtle">{disclaimer}</p>
      </div>
    </section>
  );
}
