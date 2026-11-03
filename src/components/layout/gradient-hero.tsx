import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/cn";

interface GradientHeroProps {
  eyebrow: string;
  /** Primera parte del título, en `--text`. */
  titleStart: string;
  /** Segunda parte, con el degradado champagne → azul. */
  titleHighlight: string;
  lead: string;
  /** `lg`: Contacto (hasta 68px). `md`: Áreas (hasta 60px). */
  size?: "md" | "lg";
}

/** Hero de las páginas de Contacto y Áreas: eyebrow mono, H1 con degradado y lead. Es el LCP. */
export function GradientHero({
  eyebrow,
  titleStart,
  titleHighlight,
  lead,
  size = "lg",
}: GradientHeroProps) {
  return (
    <header className="container-page flex flex-col gap-5 pt-12 pb-8 lg:pt-16">
      <p className="font-mono text-[13px] text-muted">{eyebrow}</p>
      <h1
        className={cn(
          "max-w-[900px] font-display font-semibold text-balance",
          size === "lg"
            ? "text-[clamp(44px,7vw,68px)] tracking-[-1.6px]"
            : "text-[clamp(40px,6vw,60px)] tracking-[-1.4px]",
          // Después del tamaño: tailwind-merge descarta un `leading-*` anterior a `text-[…]`.
          "leading-[1.04]",
        )}
      >
        {titleStart}
        <GradientText>{titleHighlight}</GradientText>
      </h1>
      <p className="max-w-[760px] text-[17px] leading-[1.7] text-muted">{lead}</p>
    </header>
  );
}
