// Fuente: vault "Core - Profesional Profile" (Logros/ y Skills/). Primera versión del texto.
// Solo se publican métricas con método documentado en el vault (ver "Métricas retiradas").
import type { AreaInput } from "./schema";

export const areas = [
  {
    slug: "frontend",
    title: { es: "Frontend", en: "Frontend" },
    tagline: {
      es: "Interfaces que escalan entre marcas",
      en: "Interfaces that scale across brands",
    },
    summary: {
      es: "Next.js App Router y React en producción: un portal white-label que sirve 3 marcas desde un solo codebase, con tokens de diseño, i18n a escala e infraestructura de testing propia.",
      en: "Next.js App Router and React in production: a white-label portal serving 3 brands from a single codebase, with design tokens, i18n at scale and in-house testing infrastructure.",
    },
    bullets: [
      {
        es: "Tokens en 3 capas: cambiar el color de una marca es un diff de ~11 líneas",
        en: "3-layer tokens: changing a brand's color is a ~11-line diff",
      },
      {
        es: "Librería atómica compartida por 2 apps web y una app React Native",
        en: "Atomic library shared by 2 web apps and a React Native app",
      },
      {
        es: "Migración de React a Next.js de una app en producción",
        en: "React to Next.js migration of a production app",
      },
    ],
    tech: ["next.js", "react", "typescript", "tailwind", "vitest", "playwright"],
    metrics: [
      {
        label: { es: "Suite de tests", en: "Test suite" },
        before: "255 s",
        after: "178 s",
        delta: "−30%",
        ratio: 177.53 / 255.3,
      },
    ],
  },
  {
    slug: "backend-pagos",
    title: { es: "Backend & Pagos", en: "Backend & Payments" },
    tagline: { es: "Correcto donde se mueve el dinero", en: "Correct where money moves" },
    summary: {
      es: "Dos stacks de backend, TypeScript/NestJS y Python/FastAPI, sobre PostgreSQL, Redis y colas. En una fintech regulada construí el orquestador de pagos de un sitio de recaudo en línea y co-desarrollo una pasarela de pagos propia sobre PSE y Bre-B, diseñada para no cobrar dos veces nunca.",
      en: "Two backend stacks, TypeScript/NestJS and Python/FastAPI, over PostgreSQL, Redis and queues. At a regulated fintech I built the payment orchestrator of an online collections site and co-develop an in-house payment gateway on PSE and Bre-B, designed to never charge twice.",
    },
    bullets: [
      {
        es: "Idempotencia, locks de fila y outbox transaccional en el núcleo de la pasarela",
        en: "Idempotency, row-level locks and a transactional outbox in the gateway core",
      },
      {
        es: "Webhooks firmados hacia el comercio y cifrado de campos con AES-256-GCM",
        en: "Signed webhooks to merchants and field-level encryption with AES-256-GCM",
      },
      {
        es: "Un conector en Go por riel, único dueño de las credenciales de ese riel",
        en: "One Go connector per rail, the sole owner of that rail's credentials",
      },
    ],
    tech: ["nestjs", "fastapi", "go", "postgresql", "redis/valkey", "bullmq"],
    metrics: [
      {
        label: { es: "Paginación por cursor (300k filas)", en: "Cursor pagination (300k rows)" },
        before: "33.66 ms",
        after: "0.42 ms",
        delta: "−98.8%",
        ratio: 0.42 / 33.66,
      },
    ],
  },
  {
    slug: "compliance",
    title: { es: "Compliance AML/KYC", en: "AML/KYC Compliance" },
    tagline: { es: "AML/KYC automatizado (art. 492)", en: "Automated AML/KYC (art. 492)" },
    summary: {
      es: "Entregué de punta a punta el módulo de validación AML/KYC de una plataforma de seguros: backend FastAPI, adaptador hexagonal con puertos tipados, bandeja de casos y wizard de 4 pasos.",
      en: "Delivered the AML/KYC validation module of an insurance platform end to end: FastAPI backend, a hexagonal adapter with typed ports, a case inbox and a 4-step wizard.",
    },
    bullets: [
      {
        es: "Arquitectura hexagonal sin framework en el dominio",
        en: "Framework-free hexagonal architecture in the domain",
      },
      {
        es: "Contrato de import-linter bloqueante en CI contra regresiones",
        en: "Blocking import-linter contract in CI against regressions",
      },
      {
        es: "Post-mortem de un discriminador nullable que filtraba datos entre módulos",
        en: "Post-mortem of a nullable discriminator leaking data across modules",
      },
    ],
    tech: ["python", "fastapi", "sqlalchemy", "postgresql", "pytest"],
    metrics: [],
  },
  {
    slug: "devops",
    title: { es: "DevOps", en: "DevOps" },
    tagline: { es: "CI que evita romper cosas", en: "CI that keeps things from breaking" },
    summary: {
      es: "Gates de CI que limitan lint, typecheck, tests y build al diff del merge request, implantados en dos repositorios el mismo día. Antes, el primer pipeline CI/CD de una empresa que desplegaba a mano.",
      en: "CI gates that scope lint, typecheck, tests and build to the merge-request diff, rolled out to two repositories on the same day. Before that, the first CI/CD pipeline of a company that deployed by hand.",
    },
    bullets: [
      {
        es: "Falla de forma explícita si la lista de cambios llega vacía",
        en: "Fails loudly when the change list comes back empty",
      },
      {
        es: "Caché solo del store del gestor de paquetes",
        en: "Caches only the package-manager store",
      },
      {
        es: "100% conventional commits sobre 659 commits",
        en: "100% conventional commits across 659 commits",
      },
    ],
    tech: ["gitlab ci", "github actions", "docker"],
    metrics: [
      {
        label: { es: "Guardado de caché en CI", en: "CI cache save" },
        before: "1:36",
        after: "0:03",
        delta: "−97%",
        ratio: 3 / 96,
      },
    ],
  },
  {
    slug: "ai-engineering",
    title: { es: "AI Engineering", en: "AI Engineering" },
    tagline: {
      es: "LLMs en producción y desarrollo asistido",
      en: "LLMs in production and assisted development",
    },
    summary: {
      es: "Trabajo con IA con rastro de artefactos: workflows spec-first con Claude Code integrados al issue tracker, y producto sobre una plataforma de extracción documental con LLM.",
      en: "AI work with an artifact trail: spec-first Claude Code workflows wired into the issue tracker, and product work on an LLM document-extraction platform.",
    },
    bullets: [
      {
        es: "403 commits pareados con IA en 4 repositorios durante 10 meses",
        en: "403 AI-paired commits across 4 repositories over 10 months",
      },
      {
        es: "Auditoría de un backend legado de 339 endpoints con agentes en paralelo y verificación cruzada",
        en: "Audit of a 339-endpoint legacy backend with parallel agents and cross-verification",
      },
      {
        es: "Skill de Claude Code que convierte el historial de git en reportes de avance",
        en: "A Claude Code skill that turns git history into progress reports",
      },
    ],
    tech: ["claude code", "aws bedrock", "python", "fastapi"],
    metrics: [],
  },
  {
    slug: "leadership",
    title: { es: "Leadership", en: "Leadership" },
    tagline: { es: "Liderar con proceso y calma", en: "Leading with process and calm" },
    summary: {
      es: "Liderazgo de personas en tres etapas (un equipo de 3, un equipo que creció de 3 a 5-6 y una célula de 4-5) y liderazgo de proceso con un estándar de documentación adoptado por 5 desarrolladores.",
      en: "People leadership across three stages (a team of 3, a team that grew from 3 to 5–6, and a 4–5 person cell) and process leadership with a documentation standard adopted by 5 developers.",
    },
    bullets: [
      {
        es: "RFC → ADR → realidad del backend → pasos atómicos, en 63 features",
        en: "RFC → ADR → backend reality → atomic steps, across 63 features",
      },
      {
        es: "Mentoría, dirección técnica y participación en contrataciones",
        en: "Mentorship, technical direction and hiring input",
      },
      {
        es: "Plantillas de requerimientos con contexto técnico desde el día cero",
        en: "Requirement templates with technical context from day zero",
      },
    ],
    tech: ["rfc", "adr", "jira"],
    metrics: [],
  },
] satisfies AreaInput[];
