import type { ContactFormValues } from "@content/contact-form";

export interface MailtoOptions {
  /** Destinatario (Gmail del perfil). */
  to: string;
  /** "Portafolio" / "Portfolio". */
  subjectPrefix: string;
  /** Etiqueta localizada del tipo de oportunidad. */
  typeLabel: string;
  /** Largo máximo de la URL completa: algunos clientes cortan las mailto largas. */
  maxLength?: number;
}

const ELLIPSIS = "…";

/**
 * Arma la URL `mailto:` del formulario de Contacto (ADR 0005: sin backend ni terceros).
 * - Asunto: `{prefijo} · {tipo} · {nombre}`.
 * - Cuerpo: el mensaje y una firma con nombre, email y, si existe, empresa.
 * Si la URL supera `maxLength`, recorta el mensaje (nunca la firma) y le añade "…".
 */
export function buildMailto(
  values: Pick<ContactFormValues, "name" | "email" | "message"> & { company?: string },
  { to, subjectPrefix, typeLabel, maxLength = 1800 }: MailtoOptions,
): string {
  const name = values.name.trim();
  const company = values.company?.trim();
  const subject = `${subjectPrefix} · ${typeLabel} · ${name}`;
  const signature = `\n\n—\n${name}\n${values.email.trim()}${company ? `\n${company}` : ""}`;
  const base = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=`;
  const url = (message: string) => base + encodeURIComponent(message + signature);

  // Por caracteres (no unidades UTF-16) para no partir un emoji ni una tilde combinada.
  const chars = Array.from(values.message.trim());
  if (url(chars.join("")).length <= maxLength) return url(chars.join(""));

  // Búsqueda binaria del prefijo más largo del mensaje que cabe con "…".
  let low = 0;
  let high = chars.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (url(chars.slice(0, mid).join("").trimEnd() + ELLIPSIS).length <= maxLength) low = mid;
    else high = mid - 1;
  }
  return url(chars.slice(0, low).join("").trimEnd() + ELLIPSIS);
}
