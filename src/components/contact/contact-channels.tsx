import type { ContactChannelView } from "@/lib/content";
import { Button } from "@/components/ui/button";

import { ContactIcon } from "./contact-icon";
import { CopyEmailButton } from "./copy-email-button";

interface ContactChannelsProps {
  channels: ContactChannelView[];
  labels: {
    title: string;
    primaryEyebrow: string;
    writeEmail: string;
    copy: string;
    copied: string;
    manual: string;
    newTab: string;
  };
}

const EMAIL_ID = "contact-email";

/**
 * Canales de contacto: Gmail ocupa toda la fila (vía principal, regla 8) con «Escribir» y «Copiar»;
 * LinkedIn, GitHub y WhatsApp son tarjetas-enlace completas.
 */
export function ContactChannels({ channels, labels }: ContactChannelsProps) {
  const primary = channels.find((c) => c.primary)!;
  const secondary = channels.filter((c) => !c.primary);

  return (
    <section aria-label={labels.title} className="container-page">
      <ul className="grid gap-3.5 sm:grid-cols-3">
        <li className="col-span-full flex flex-col gap-5 rounded-card border border-accent-text/30 bg-linear-120 from-accent/14 to-accent-2/10 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4 min-[480px]:flex-row min-[480px]:items-center">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-on-accent"
            >
              <ContactIcon id="gmail" className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs text-accent-text">{labels.primaryEyebrow}</p>
              <p
                id={EMAIL_ID}
                className="font-display text-[clamp(17px,4.6vw,26px)] font-semibold [overflow-wrap:anywhere]"
              >
                {primary.handle}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button href={primary.href} size="lg" shape="pill" className="text-[15px]">
              {labels.writeEmail}
            </Button>
            <CopyEmailButton
              email={primary.handle}
              targetId={EMAIL_ID}
              labels={{ copy: labels.copy, copied: labels.copied, manual: labels.manual }}
            />
          </div>
        </li>

        {secondary.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-1.5 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent-text/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text sm:p-6"
            >
              <span
                aria-hidden="true"
                className="mb-2 grid size-11 place-items-center rounded-xl bg-chip text-text-2 transition-colors group-hover:text-accent-text"
              >
                <ContactIcon id={channel.id} className="size-5" />
              </span>
              <span className="text-lg font-semibold">
                {channel.label}
                <span className="sr-only"> {labels.newTab}</span>
              </span>
              <span className="font-mono text-xs text-muted">{channel.handle}</span>
              <span className="text-sm text-text-2">{channel.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
