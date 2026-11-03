import type { ProfileInput } from "./schema";

export const profile = {
  name: "José M. Vasquez",
  monogram: "JMV.",
  role: { es: "Senior Full Stack Developer", en: "Senior Full Stack Developer" },
  headline: {
    es: "Ingeniería de pagos, compliance y plataforma",
    en: "Payments, Compliance & Platform Engineering",
  },
  location: { es: "Cajicá, Colombia", en: "Cajicá, Colombia" },
  summary: {
    es: "7 años construyendo producto de punta a punta. Hoy, sistemas fintech regulados donde se mueve dinero y automatización AML/KYC, con TypeScript/NestJS, Python/FastAPI y Next.js.",
    en: "7 years building product end to end. Today, regulated fintech systems where money moves and AML/KYC automation, with TypeScript/NestJS, Python/FastAPI and Next.js.",
  },
  available: true,
  email: "josejmvasquez@gmail.com",
  contactLinks: [
    { id: "gmail", label: "Gmail", href: "mailto:josejmvasquez@gmail.com", primary: true },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/josejmv/" },
    { id: "github", label: "GitHub", href: "https://github.com/josejmv" },
    { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/573174480435" },
  ],
  languages: [
    { name: { es: "Español", en: "Spanish" }, level: { es: "nativo", en: "native" } },
    { name: { es: "Inglés", en: "English" }, level: { es: "B2", en: "B2" } },
  ],
} satisfies ProfileInput;
