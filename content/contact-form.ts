/**
 * Esquema del formulario de Contacto (ADR 0005). Va aparte de `schema.ts` y usa `zod/mini` porque
 * es lo único de Zod que llega al navegador: así el JS de /contacto no carga Zod completo.
 * `schema.ts` lo reexporta junto al resto de esquemas.
 */
import * as z from "zod/mini";

export const OPPORTUNITY_TYPES = ["empleo", "contrato", "consultoria", "otro"] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

/** Cada mensaje de error es el nombre del campo: la UI lo traduce con `ContactPage.form.errors`. */
export const contactFormSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "name"), z.maxLength(80, "name")),
  email: z.string().check(z.trim(), z.email("email")),
  company: z._default(z.optional(z.string().check(z.trim(), z.maxLength(80, "company"))), ""),
  type: z._default(z.enum(OPPORTUNITY_TYPES, "type"), "empleo"),
  message: z.string().check(z.trim(), z.minLength(10, "message"), z.maxLength(2000, "message")),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormField = keyof ContactFormValues;
