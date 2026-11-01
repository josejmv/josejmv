// Fuente: vault "Core - Profesional Profile" (Experiencia/ y Logros/). Primera versión del texto.
// Confidencialidad: sin nombres de proveedores, compañeros, bancos ni clientes institucionales.
import type { ExperienceInput } from "./schema";

/** Orden: del más reciente al más antiguo. */
export const experience = [
  {
    id: "upcard",
    company: "Upcard",
    role: { es: "Senior Full Stack Developer", en: "Senior Full Stack Developer" },
    tagline: { es: "Senior Full Stack · Fintech", en: "Senior Full Stack · Fintech" },
    start: "2025-11",
    end: null,
    location: { es: "Remoto", en: "Remote" },
    context: {
      es: "Plataforma de una fintech regulada en tres repositorios: un portal white-label que sirve 3 marcas en producción desde un solo codebase, un back-office administrativo y el backend NestJS que reemplaza un ERP legado.",
      en: "A regulated fintech platform across three repositories: a white-label portal serving 3 production brands from a single codebase, an admin back-office, and the NestJS backend replacing a legacy ERP.",
    },
    highlights: [
      {
        es: "Diseñé y construí un motor de exportación asíncrona (cola de jobs, streaming multipart a object storage, paginación keyset y progreso por SSE) al que migraron 10 dominios de negocio; el tiempo de página del cursor bajó de 33,66 ms a 0,42 ms sobre 300.000 filas.",
        en: "Designed and built an async export engine (job queue, multipart streaming to object storage, keyset pagination and SSE progress) that 10 business domains migrated onto; cursor page time dropped from 33.66 ms to 0.42 ms over 300,000 rows.",
      },
      {
        es: "Establecí el estándar de documentación técnica del frontend (RFC → ADR → realidad del backend → pasos atómicos), aplicado a 63 features y adoptado por 5 desarrolladores.",
        en: "Established the frontend's technical documentation standard (RFC → ADR → backend reality → atomic steps), applied to 63 features and adopted by 5 developers.",
      },
      {
        es: "Convertí la validación de merge requests en un gate bloqueante en dos repositorios, limitando lint, typecheck, tests y build al diff del MR; el guardado de caché pasó de 1:36 a 0:03.",
        en: "Turned merge-request validation into a blocking gate in two repositories, scoping lint, typecheck, tests and build to the MR diff; cache save time went from 1:36 to 0:03.",
      },
      {
        es: "Reduje la suite de tests un 30% (255,30 s → 177,53 s) con los 4.238 tests en verde, separando las specs de lógica pura del entorno jsdom.",
        en: "Cut the test suite time by 30% (255.30 s → 177.53 s) with all 4,238 tests green, separating pure-logic specs from the jsdom environment.",
      },
      {
        es: "Diseñé un sistema de tokens en 3 capas con configuraciones de marca validadas con Zod: cambiar el color primario de una marca pasó a ser un diff de ~11 líneas.",
        en: "Designed a 3-layer token system with Zod-validated brand configs: changing a brand's primary color became a ~11-line diff.",
      },
    ],
    subProjects: [
      {
        title: { es: "Motor de exportación asíncrona", en: "Async export engine" },
        description: {
          es: "Patrón registry, cola de jobs y streaming a object storage para exportaciones financieras sin timeouts.",
          en: "Registry pattern, job queue and streaming to object storage for financial exports without timeouts.",
        },
      },
      {
        title: { es: "Design system multimarca", en: "Multi-brand design system" },
        description: {
          es: "Tokens de marca → tokens semánticos → componentes, con un scaffolder CLI para marcas nuevas.",
          en: "Brand tokens → semantic tokens → components, with a CLI scaffolder for new brands.",
        },
      },
      {
        title: { es: "Tooling interno", en: "Internal tooling" },
        description: {
          es: "6 de los 8 scripts del repositorio: scaffolder de marcas, codegen del catálogo de errores con gate de cobertura i18n y un codemod tipográfico.",
          en: "6 of the repository's 8 scripts: brand scaffolder, error-catalog codegen with an i18n-coverage gate, and a typography codemod.",
        },
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Drizzle",
      "Redis",
      "BullMQ",
      "Tailwind CSS",
      "TanStack Query",
      "Zod",
      "GitLab CI",
      "Docker",
      "Vitest",
      "Playwright",
    ],
    areas: ["frontend", "backend-pagos", "devops", "leadership"],
  },
  {
    id: "minca-ai",
    company: "Minca AI",
    role: { es: "Senior Full Stack Developer", en: "Senior Full Stack Developer" },
    tagline: { es: "Senior Full Stack · AML/KYC · LLM", en: "Senior Full Stack · AML/KYC · LLM" },
    start: "2026-06",
    end: "2026-10",
    location: { es: "Remoto", en: "Remote" },
    context: {
      es: "Monorepo políglota de microservicios en Python que convierte documentos de brokers en cotizaciones de seguros estandarizadas usando extracción con LLM.",
      en: "A polyglot Python microservices monorepo that turns broker documents into standardized insurance quotes using LLM extraction.",
    },
    highlights: [
      {
        es: "Entregué de punta a punta el módulo de validación AML/KYC (PLD, art. 492): backend FastAPI con repositorios SQLAlchemy, adaptador hexagonal con puertos tipados, bandeja de casos y wizard de 4 pasos en el frontend.",
        en: "Delivered the AML/KYC validation module (PLD, art. 492) end to end: FastAPI backend with SQLAlchemy repositories, a hexagonal adapter with typed ports, a case inbox and a 4-step frontend wizard.",
      },
      {
        es: "Fundé el paquete de dominio sobre el que después construyó otro ingeniero: +40.796 líneas de Python en 8 semanas.",
        en: "Founded the domain package another engineer later built on: +40,796 lines of Python in 8 weeks.",
      },
      {
        es: "Lideré la implementación de la migración del acceso a datos a una capa de repositorio: más de 15 entregas incrementales en 3 días y un contrato de import-linter bloqueante en CI.",
        en: "Led the implementation of moving data access into a repository layer: 15+ incremental slices in 3 days and a blocking import-linter contract in CI.",
      },
      {
        es: "Rastreé una fuga de datos recurrente entre módulos hasta una columna nullable usada como discriminador y escribí el contrato de taxonomía que la corrigió.",
        en: "Traced a recurring cross-module data leak to a nullable column acting as a discriminator and wrote the taxonomy contract that fixed it.",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "pgvector",
      "gRPC",
      "Redis",
      "React",
      "Vite",
      "GitHub Actions",
      "pytest",
    ],
    areas: ["compliance", "backend-pagos", "ai-engineering"],
  },
  {
    id: "inlaze",
    company: "Inlaze",
    role: { es: "Front End / Tech Lead (backup)", en: "Front End / Tech Lead (backup)" },
    tagline: { es: "Front End · Lead de célula", en: "Front End · Cell lead" },
    start: "2025-03",
    end: "2026-03",
    location: { es: "Colombia (remoto)", en: "Colombia (remote)" },
    context: {
      es: "Trabajo en células de 4-5 personas. Lideré una célula completa durante unos 5 meses y después acompañé al nuevo líder.",
      en: "Work in 4–5 person cells. I led a full cell for about 5 months and then supported the new cell lead.",
    },
    highlights: [
      {
        es: "Construí un workflow con Claude Code y CLI integrado con el issue tracker que valida los requisitos de documentación en el repo y cierra los tickets.",
        en: "Built a Claude Code + CLI workflow integrated with the issue tracker that validates documentation requirements in the repo and closes tickets.",
      },
      {
        es: "Planifiqué la base full-stack de un proyecto nuevo (infraestructura, frontend y backend) y lideré la ejecución del frontend.",
        en: "Planned the full-stack foundation of a new project (infrastructure, frontend and backend) and led the frontend execution.",
      },
      {
        es: "Estandaricé plantillas de requerimientos con contexto técnico completo desde el día cero y reconstruí los workflows de Jira.",
        en: "Standardized requirement templates with full technical context from day zero and rebuilt the Jira workflows.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "NestJS",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "AWS",
      "Docker",
    ],
    areas: ["frontend", "ai-engineering", "leadership"],
  },
  {
    id: "trades-org",
    company: "Trades.org",
    role: { es: "Front End Developer", en: "Front End Developer" },
    tagline: { es: "Front End · equipo en 6 países", en: "Front End · team across 6 countries" },
    start: "2023-02",
    end: "2025-02",
    location: { es: "Estados Unidos (remoto)", en: "United States (remote)" },
    context: {
      es: "Contrato remoto concurrente. Producto ATS con un equipo distribuido en Estados Unidos, Brasil, Ucrania, El Salvador, Bangladesh y Argentina.",
      en: "Concurrent remote contract role. An ATS product with a team distributed across the United States, Brazil, Ukraine, El Salvador, Bangladesh and Argentina.",
    },
    highlights: [
      {
        es: "Diseñé una librería de componentes con atomic design (~10 átomos, 7 moléculas, 5 organismos y 5 templates) con Tailwind CSS y shadcn/ui.",
        en: "Architected an atomic-design component library (~10 atoms, 7 molecules, 5 organisms and 5 templates) with Tailwind CSS and shadcn/ui.",
      },
      {
        es: "La misma librería sirvió a 2 aplicaciones web nuevas y a una app en React Native.",
        en: "The same library served 2 new web applications and a React Native app.",
      },
      {
        es: "Trabajo asíncrono entre varias zonas horarias.",
        en: "Asynchronous work across multiple time zones.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React Native"],
    areas: ["frontend"],
  },
  {
    id: "centria-group",
    company: "Centria Group",
    role: { es: "Front End Supervisor", en: "Front End Supervisor" },
    tagline: {
      es: "Front End Supervisor · equipo 3 → 5-6",
      en: "Front End Supervisor · team 3 → 5-6",
    },
    start: "2021-02",
    end: "2025-02",
    location: { es: "Panamá (remoto)", en: "Panama (remote)" },
    context: {
      es: "Lideré un equipo frontend en un proyecto de cliente a largo plazo y dos productos internos.",
      en: "Led a frontend team across a long-term client project and two internal products.",
    },
    highlights: [
      {
        es: "Lideré un equipo que creció de 3 a 5-6 ingenieros en 4 años, con mentoría, dirección técnica y participación en contrataciones.",
        en: "Led a team that grew from 3 to 5–6 engineers over 4 years, providing mentorship, technical direction and hiring input.",
      },
      {
        es: "Diseñé e implementé el primer pipeline CI/CD de la empresa: antes, los despliegues a producción eran manuales y sin verificación.",
        en: "Designed and implemented the company's first CI/CD pipeline: before that, production deployments were manual and unverified.",
      },
      {
        es: "Migré una aplicación en producción de React a Next.js, con code splitting por ruta, renderizado en servidor y optimización de assets.",
        en: "Migrated a production application from React to Next.js, with route-level code splitting, server rendering and asset optimization.",
      },
      {
        es: "Configuré Apollo Client para consumir microservicios GraphQL (queries, mutations y subscriptions) en varios proyectos.",
        en: "Set up Apollo Client to consume GraphQL microservices (queries, mutations and subscriptions) across several projects.",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "GraphQL", "Apollo Client", "CI/CD"],
    areas: ["frontend", "devops", "leadership"],
  },
  {
    id: "seo-contenidos",
    company: "SEO Contenidos",
    role: { es: "Team Lead", en: "Team Lead" },
    tagline: { es: "Team Lead · Venezuela", en: "Team Lead · Venezuela" },
    start: "2019-08",
    end: "2021-09",
    location: { es: "Venezuela", en: "Venezuela" },
    context: {
      es: "Lideré un equipo de 3 personas construyendo sitios WordPress optimizados para buscadores.",
      en: "Led a 3-person team building search-optimized WordPress sites.",
    },
    highlights: [
      {
        es: "Coordiné al equipo: plazos, asignación de tareas y entregas.",
        en: "Coordinated the team: deadlines, task assignment and delivery.",
      },
      {
        es: "Entregué 4 sitios WordPress optimizados para buscadores, con tiempos de carga de ~1 segundo en páginas con contenido pesado.",
        en: "Delivered 4 search-optimized WordPress sites, with ~1 second load times on content-heavy pages.",
      },
    ],
    stack: ["WordPress", "PHP", "React", "SEO"],
    areas: ["leadership"],
  },
] satisfies ExperienceInput[];
