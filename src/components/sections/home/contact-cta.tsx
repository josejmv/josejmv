import { Button } from "@/components/ui/button";

interface ContactCtaProps {
  title: string;
  subtitle: string;
  action: string;
  /** `mailto:` del contacto primario (Gmail, regla 8). */
  href: string;
}

/** Cierre del Home (Fusion). Ancla `#contacto` del menú. */
export function ContactCta({ title, subtitle, action, href }: ContactCtaProps) {
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
        <Button href={href} variant="inverted" size="lg" shape="pill">
          {action}
        </Button>
      </div>
    </section>
  );
}
