import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

interface SiteLogoProps {
  /** Monograma con el punto final, p. ej. "JMV.". */
  monogram: string;
  label: string;
  className?: string;
}

/** "JMV" + punto en champagne. Enlace a la Home. */
export function SiteLogo({ monogram, label, className }: SiteLogoProps) {
  const base = monogram.endsWith(".") ? monogram.slice(0, -1) : monogram;

  return (
    <Link
      href="/"
      aria-label={label}
      className={cn(
        "inline-flex h-11 items-center rounded-pill font-display text-xl font-bold text-text",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        className,
      )}
    >
      {base}
      <span className="text-accent-text">.</span>
    </Link>
  );
}
