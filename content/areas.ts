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
    cases: [
      {
        title: {
          es: "White-label multimarca",
          en: "Multi-brand white-label",
        },
        body: {
          es: "Un solo codebase sirve 3 marcas en producción: tokens en 3 capas, configuraciones de marca validadas con Zod y un scaffolder para sumar marcas nuevas.",
          en: "A single codebase serves 3 production brands: 3-layer tokens, Zod-validated brand configs and a scaffolder to add new brands.",
        },
        project: "design-tokens",
      },
      {
        title: {
          es: "Librería de componentes de Trades.org",
          en: "Trades.org component library",
        },
        body: {
          es: "Atomic design con unos 27 componentes (10 átomos, 7 moléculas, 5 organismos y 5 templates) compartidos por 2 apps web y una app en React Native.",
          en: "Atomic design with about 27 components (10 atoms, 7 molecules, 5 organisms and 5 templates) shared by 2 web apps and a React Native app.",
        },
      },
      {
        title: {
          es: "Migración de React a Next.js",
          en: "React to Next.js migration",
        },
        body: {
          es: "Una aplicación en producción pasó de React a Next.js con code splitting por ruta, renderizado en servidor y optimización de assets.",
          en: "A production application moved from React to Next.js with route-level code splitting, server rendering and asset optimization.",
        },
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
    cases: [
      {
        title: {
          es: "Orquestador de pagos PSE y Bre-B",
          en: "PSE and Bre-B payment orchestrator",
        },
        body: {
          es: "Recaudo en línea para un cliente institucional: retorno del pagador con reglas de precedencia, webhooks verificados y anti-abuso que nunca bloquea un pago.",
          en: "Online collections for an institutional client: payer return with precedence rules, verified webhooks and anti-abuse that never blocks a payment.",
        },
        project: "payment-orchestrator",
      },
      {
        title: {
          es: "Pasarela de pagos propia",
          en: "In-house payment gateway",
        },
        body: {
          es: "PSP directo a los rieles, sin tocar fondos: idempotencia, outbox transaccional, webhooks firmados y cifrado de campos.",
          en: "A PSP straight to the rails, without holding funds: idempotency, a transactional outbox, signed webhooks and field encryption.",
        },
        project: "payment-gateway",
      },
      {
        title: {
          es: "Motor de exportación asíncrona",
          en: "Async export engine",
        },
        body: {
          es: "Un solo motor para 10 dominios de negocio, con cola de jobs, streaming a object storage y paginación keyset.",
          en: "One engine for 10 business domains, with a job queue, streaming to object storage and keyset pagination.",
        },
        project: "export-engine",
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
    cases: [
      {
        title: {
          es: "Arquitectura hexagonal",
          en: "Hexagonal architecture",
        },
        body: {
          es: "Un paquete de dominio sin framework, con puertos tipados, sobre el que otro ingeniero siguió construyendo.",
          en: "A framework-free domain package with typed ports that a second engineer kept building on.",
        },
        project: "kyc-engine",
      },
      {
        title: {
          es: "Fronteras con import-linter",
          en: "Boundaries with import-linter",
        },
        body: {
          es: "Lideré la implementación de una capa de repositorio en más de 15 entregas en 3 días, protegida por tests de caracterización y un contrato de import-linter bloqueante en CI.",
          en: "I led the implementation of a repository layer in 15+ slices over 3 days, protected by characterization tests and a blocking import-linter contract in CI.",
        },
      },
      {
        title: {
          es: "El bug del discriminador nullable",
          en: "The nullable discriminator bug",
        },
        body: {
          es: "Una fuga de datos recurrente entre módulos venía de una columna nullable sin tipo. Mostré por qué los tests no la veían y escribí el contrato que la corrigió.",
          en: "A recurring cross-module data leak came from an untyped nullable column. I showed why the tests missed it and wrote the contract that fixed it.",
        },
      },
    ],
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
    cases: [
      {
        title: {
          es: "Gate de CI para merge requests",
          en: "Merge-request CI gate",
        },
        body: {
          es: "Lint, typecheck, tests y build limitados al diff del MR, bloqueante en dos repositorios el mismo día.",
          en: "Lint, typecheck, tests and build scoped to the MR diff, made blocking in two repositories on the same day.",
        },
        project: "merge-request-gate",
      },
      {
        title: {
          es: "Primer CI/CD de la empresa",
          en: "The company's first CI/CD",
        },
        body: {
          es: "Los despliegues a producción eran manuales y sin verificación; el pipeline automatizó build, tests y despliegue.",
          en: "Production deployments were manual and unverified; the pipeline automated build, tests and deploy.",
        },
      },
      {
        title: {
          es: "Runbooks e infraestructura propia",
          en: "Runbooks and self-hosted infrastructure",
        },
        body: {
          es: "Administro el GitLab autohospedado (actualizaciones, respaldos diarios y runbooks de reversa) y la VPN de la empresa.",
          en: "I run the self-hosted GitLab (upgrades, daily backups and rollback runbooks) and the company VPN.",
        },
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
    cases: [
      {
        title: {
          es: "Extracción con AWS Bedrock",
          en: "Extraction with AWS Bedrock",
        },
        body: {
          es: "Extracción documental con LLM en producción dentro de un módulo AML/KYC, con un veredicto auditable por cada validación.",
          en: "LLM document extraction in production inside an AML/KYC module, with an auditable verdict for each check.",
        },
        project: "kyc-engine",
      },
      {
        title: {
          es: "Workflow con Claude Code",
          en: "Claude Code workflow",
        },
        body: {
          es: "Integrado con el issue tracker: valida los requisitos de documentación en el repo y cierra los tickets.",
          en: "Wired into the issue tracker: it validates documentation requirements in the repo and closes tickets.",
        },
      },
      {
        title: {
          es: "Auditoría con agentes en paralelo",
          en: "Audit with parallel agents",
        },
        body: {
          es: "Revisión endpoint por endpoint de un backend legado de 339 endpoints, con verificación cruzada de cada hallazgo antes de declararlo.",
          en: "An endpoint-by-endpoint review of a 339-endpoint legacy backend, cross-checking every gap before declaring it.",
        },
      },
    ],
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
    cases: [
      {
        title: {
          es: "Lead de célula",
          en: "Cell lead",
        },
        body: {
          es: "Lideré una célula completa de 4-5 personas durante unos 5 meses y después acompañé al nuevo líder.",
          en: "I led a full 4–5 person cell for about 5 months and then supported the new lead.",
        },
      },
      {
        title: {
          es: "Mentoría y contratación",
          en: "Mentoring and hiring",
        },
        body: {
          es: "Un equipo frontend que creció de 3 a 5-6 ingenieros en 4 años, con mentoría, dirección técnica y participación en contrataciones.",
          en: "A frontend team that grew from 3 to 5–6 engineers over 4 years, with mentoring, technical direction and hiring input.",
        },
      },
      {
        title: {
          es: "Estándar de documentación",
          en: "Documentation standard",
        },
        body: {
          es: "RFC → ADR → realidad del backend → pasos atómicos, aplicado a 63 features, adoptado por 5 desarrolladores y migrado a un segundo repositorio.",
          en: "RFC → ADR → backend reality → atomic steps, applied to 63 features, adopted by 5 developers and carried over to a second repository.",
        },
      },
    ],
  },
] satisfies AreaInput[];
