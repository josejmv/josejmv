// Fuentes: vault "Core - Profesional Profile", autoría verificada en commits y CV de oct-2026.
// Confidencialidad: sin nombres de clientes institucionales, bancos ni proveedores.
// Estado real de cada proyecto: nada se presenta "en producción" si no lo está.
import type { ProjectInput } from "./schema";

export const projects = [
  {
    slug: "payment-orchestrator",
    title: { es: "Orquestador de pagos", en: "Payment orchestrator" },
    company: "Upcard",
    year: 2026,
    role: { es: "Backend y sitio de pagos", en: "Backend and payment site" },
    status: "preproduction",
    summary: {
      es: "Plataforma de recaudo con la que los deudores de un cliente institucional pagan en línea por PSE y Bre-B. Certificada por la procesadora y desplegada; en pruebas preproductivas antes del corte.",
      en: "Collections platform an institutional client's borrowers use to pay online via PSE and Bre-B. Certified by the payment processor and deployed; in pre-production testing before cutover.",
    },
    areas: ["backend-pagos", "frontend"],
    tech: ["NestJS", "Next.js", "PostgreSQL", "Redis/Valkey", "Docker"],
    metrics: [
      {
        value: "5",
        label: {
          es: "reglas de precedencia para resolver el retorno del pagador",
          en: "precedence rules to resolve the payer's return",
        },
      },
      {
        value: "PSE · Bre-B",
        label: { es: "rieles de pago", en: "payment rails" },
      },
    ],
    caseStudy: true,
  },
  {
    slug: "payment-gateway",
    title: { es: "Pasarela de pagos propia (PSP)", en: "In-house payment gateway (PSP)" },
    company: "Upcard",
    year: 2026,
    role: { es: "Co-desarrollador del núcleo", en: "Core co-developer" },
    status: "in-development",
    summary: {
      es: "PSP conectado directo a los rieles PSE y Bre-B, sin tocar fondos, diseñado para no cobrar dos veces, siempre notificar y exponer estados de pago explícitos. En camino a certificación.",
      en: "A PSP connected directly to the PSE and Bre-B rails without holding funds, designed to never charge twice, always notify and expose explicit payment states. On its way to certification.",
    },
    areas: ["backend-pagos"],
    tech: ["NestJS", "Next.js", "Go", "PostgreSQL", "Turborepo"],
    metrics: [
      {
        value: "AES-256-GCM",
        label: { es: "cifrado de campos sensibles", en: "field-level encryption" },
      },
      {
        value: "Go",
        label: {
          es: "un conector por riel, único dueño de sus credenciales",
          en: "one connector per rail, sole owner of its credentials",
        },
      },
    ],
  },
  {
    slug: "export-engine",
    title: { es: "Motor de exportación asíncrona", en: "Async export engine" },
    company: "Upcard",
    year: 2026,
    role: { es: "Autor único del núcleo", en: "Sole author of the core" },
    status: "production",
    summary: {
      es: "Exportaciones de datos financieros sin timeouts ni memoria sin límite: patrón registry, cola de jobs, streaming multipart a object storage, paginación keyset y una API de estado del job.",
      en: "Financial data exports without timeouts or unbounded memory: registry pattern, job queue, multipart streaming to object storage, keyset pagination and a job status API.",
    },
    areas: ["backend-pagos"],
    tech: ["NestJS", "BullMQ", "PostgreSQL", "Redis"],
    metrics: [
      {
        value: "−98.8%",
        label: {
          es: "tiempo por página del cursor (300k filas)",
          en: "cursor page time (300k rows)",
        },
      },
      {
        value: "10",
        label: { es: "dominios de negocio migrados", en: "business domains migrated" },
      },
    ],
    caseStudy: true,
  },
  {
    slug: "kyc-engine",
    title: { es: "Motor KYC automatizado", en: "Automated KYC engine" },
    company: "Minca AI",
    year: 2026,
    role: { es: "Responsable de punta a punta", en: "End-to-end owner" },
    status: "production",
    summary: {
      es: "Módulo AML/KYC de una plataforma de seguros (art. 492): ingiere los adjuntos de una solicitud, los clasifica, extrae sus campos, ejecuta validaciones y guarda un veredicto con el motivo de cada una.",
      en: "AML/KYC module of an insurance platform (art. 492): it ingests a request's attachments, classifies them, extracts their fields, runs checks and stores a verdict with the reason for each one.",
    },
    areas: ["compliance", "ai-engineering"],
    tech: ["Python", "FastAPI", "SQLAlchemy", "React", "pytest"],
    metrics: [
      {
        value: "224",
        label: { es: "commits de código en 8 semanas", en: "code commits in 8 weeks" },
      },
      {
        value: "+40.8k",
        label: { es: "líneas de Python", en: "lines of Python" },
      },
    ],
    caseStudy: true,
  },
  {
    slug: "design-tokens",
    title: { es: "Design system multimarca", en: "Multi-brand design system" },
    company: "Upcard",
    year: 2026,
    role: { es: "Autor del ADR y de la implementación", en: "ADR author and implementer" },
    status: "production",
    summary: {
      es: "Tokens en 3 capas (fundamentos de marca → tokens semánticos → componentes) con configuraciones de marca validadas con Zod y un scaffolder CLI para marcas nuevas.",
      en: "3-layer tokens (brand foundations → semantic tokens → components) with Zod-validated brand configs and a CLI scaffolder for new brands.",
    },
    areas: ["frontend"],
    tech: ["Next.js", "Tailwind CSS", "Zod", "TypeScript"],
    metrics: [
      {
        value: "3",
        label: { es: "marcas en producción", en: "brands in production" },
      },
      {
        value: "~11",
        label: {
          es: "líneas para cambiar el color de una marca",
          en: "lines to change a brand's color",
        },
      },
    ],
  },
  {
    slug: "merge-request-gate",
    title: { es: "Gate de CI para merge requests", en: "Merge-request CI gate" },
    company: "Upcard",
    year: 2026,
    role: { es: "Autor del pipeline", en: "Pipeline author" },
    status: "production",
    summary: {
      es: "Pipeline de GitLab que limita lint, typecheck, tests y build al diff del merge request y falla de forma explícita si la lista de cambios llega vacía. Bloqueante en dos repositorios.",
      en: "GitLab pipeline that scopes lint, typecheck, tests and build to the merge-request diff and fails loudly when the change list comes back empty. Blocking in two repositories.",
    },
    areas: ["devops"],
    tech: ["GitLab CI", "Docker", "pnpm"],
    metrics: [
      {
        value: "1:36 → 0:03",
        label: { es: "guardado de caché", en: "cache save" },
      },
      {
        value: "2",
        label: { es: "repositorios, el mismo día", en: "repositories, same day" },
      },
    ],
  },
] satisfies ProjectInput[];
