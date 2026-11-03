import { Button, buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface ContactCtaProps {
  title: string;
  subtitle: string;
  action: string;
  /** `mailto:` del contacto primario (Gmail, regla 8). */
  href: string;
  /** Botón secundario hacia /contacto («Ver todas las vías de contacto»). */
  secondary: string;
}

/**
 * Cierre de las páginas (Fusion): Gmail como CTA primario y la página de Contacto como secundario.
 * Contacto no lo usa (sería redundante). Conserva el ancla `#contacto` del Home.
 */
export function ContactCta({ title, subtitle, action, href, secondary }: ContactCtaProps) {
  return (
    <section
      id="contacto"
      aria-labelledby="contact-title"
      className="container-page mt-4 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-card border border-accent-text/25 bg-linear-120 from-accent/14 to-accent-2/12 p-6 sm:p-9">
        <div>
          <h2 id="contact-title" className="font-display text-2xl font-semibold sm:text-[30px]">
            {title}
          </h2>
          <p className="mt-2 text-muted">{subtitle}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <Button href={href} variant="inverted" size="lg" shape="pill">
            {action}
          </Button>
          <Link
            href="/contacto"
            className={buttonClasses({ variant: "secondary", size: "lg", shape: "pill" })}
          >
            {secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
