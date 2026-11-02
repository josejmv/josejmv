import type { ContactLink as ContactLinkData } from "@content/schema";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { ContactIcon } from "./contact-icon";

interface ContactLinkProps {
  link: ContactLinkData;
  className?: string;
}

/** Enlace de contacto con ícono. El primario (Gmail) usa el relleno champagne. */
export function ContactLink({ link, className }: ContactLinkProps) {
  const external = link.href.startsWith("http");

  return (
    <a
      href={link.href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={buttonClasses({
        variant: link.primary ? "primary" : "secondary",
        className: cn("font-sans", className),
      })}
    >
      <ContactIcon id={link.id} />
      {link.label}
    </a>
  );
}
