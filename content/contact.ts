// Datos propios de la página de Contacto. El email, los enlaces y los idiomas salen de
// content/profile.ts, y la ubicación de las variables HOME_* (src/lib/home.ts): aquí solo va lo
// que no existe en otro sitio. Validado con Zod en content/schema.ts.
import type { ContactContentInput } from "./schema";

export const contact = {
  /** Texto de cada canal, por `id` de `profile.contactLinks`. */
  channels: [
    {
      id: "gmail",
      handle: { es: "josejmvasquez@gmail.com", en: "josejmvasquez@gmail.com" },
      description: { es: "vía principal", en: "main channel" },
    },
    {
      id: "linkedin",
      handle: { es: "in/josejmv", en: "in/josejmv" },
      description: {
        es: "Trayectoria completa y recomendaciones.",
        en: "Full career and recommendations.",
      },
    },
    {
      id: "github",
      handle: { es: "github.com/josejmv", en: "github.com/josejmv" },
      description: {
        es: "Código público y este portafolio.",
        en: "Public code and this portfolio.",
      },
    },
    {
      id: "whatsapp",
      handle: { es: "mensaje directo", en: "direct message" },
      description: { es: "Para coordinar algo rápido.", en: "To coordinate something quickly." },
    },
  ],
  availability: {
    status: "available",
    title: { es: "Disponible para nuevos proyectos", en: "Available for new projects" },
    rows: [
      {
        key: "mode",
        label: { es: "Modalidad", en: "Work mode" },
        value: { es: "Remoto", en: "Remote" },
      },
      {
        key: "contract",
        label: { es: "Tipo de contrato", en: "Contract type" },
        value: {
          es: "Full-time (preferido) · contrato por tiempo con opción de renovación",
          en: "Full-time (preferred) · fixed-term contract with option to renew",
        },
      },
      {
        key: "timezone",
        label: { es: "Zona horaria", en: "Time zone" },
        // Fija: si cambian las variables HOME_*, actualízala aquí.
        value: { es: "Bogotá · UTC−5", en: "Bogotá · UTC−5" },
      },
    ],
    // Las filas de idiomas (profile.languages) y ubicación (HOME_*) se añaden en getContact().
    languagesLabel: { es: "Idiomas", en: "Languages" },
    locationLabel: { es: "Ubicación", en: "Location" },
  },
  opportunityTypes: [
    { value: "empleo", label: { es: "Empleo de tiempo completo", en: "Full-time job" } },
    { value: "contrato", label: { es: "Contrato o freelance", en: "Contract or freelance" } },
    { value: "consultoria", label: { es: "Consultoría", en: "Consulting" } },
    { value: "otro", label: { es: "Otro", en: "Other" } },
  ],
  cv: {
    href: "/cv/jose-vasquez-cv.pdf",
    /** Hoy solo existe el CV en inglés. */
    language: "en",
  },
} satisfies ContactContentInput;
