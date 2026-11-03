/**
 * Esquemas Zod del contenido. `content/*.ts` es la fuente única; `lib/content.ts` valida con estos
 * esquemas y expone getters por locale. Cualquier campo o idioma que falte rompe el test de contenido
 * (y por tanto el CI).
 */
import { z } from "zod";

// ── Primitivas ────────────────────────────────────────────────────────────────

export const LOCALES = ["es", "en"] as const;
export type ContentLocale = (typeof LOCALES)[number];

const text = z.string().trim().min(1);

/** Texto obligatorio en los dos idiomas. */
export const Localized = z.object({ es: text, en: text }).strict();
export type Localized = z.infer<typeof Localized>;

/** Mes en formato `YYYY-MM`. */
export const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Usa el formato YYYY-MM");

export const AREA_SLUGS = [
  "frontend",
  "backend-pagos",
  "compliance",
  "devops",
  "ai-engineering",
  "leadership",
] as const;
export const AreaSlug = z.enum(AREA_SLUGS);
export type AreaSlug = z.infer<typeof AreaSlug>;

// ── Perfil y contacto ─────────────────────────────────────────────────────────

export const ContactLink = z
  .object({
    id: z.enum(["gmail", "linkedin", "github", "whatsapp"]),
    /** Nombre de marca: no se traduce. */
    label: text,
    href: z.url(),
    /** Gmail es el único CTA primario (regla 8 de CLAUDE.md). */
    primary: z.boolean().default(false),
  })
  .strict();
export type ContactLink = z.infer<typeof ContactLink>;

export const SpokenLanguage = z
  .object({
    name: Localized,
    level: Localized,
  })
  .strict();

export const Profile = z
  .object({
    name: text,
    /** Marca corta del header, p. ej. "JMV." */
    monogram: text,
    role: Localized,
    headline: Localized,
    summary: Localized,
    available: z.boolean(),
    email: z.email(),
    contactLinks: z
      .array(ContactLink)
      .min(1)
      .refine((links) => links.filter((l) => l.primary).length === 1, {
        message: "Debe haber exactamente un enlace de contacto primario",
      }),
    languages: z.array(SpokenLanguage).min(1),
  })
  .strict();
export type Profile = z.infer<typeof Profile>;

// ── Experiencia ───────────────────────────────────────────────────────────────

export const SubProject = z
  .object({
    title: Localized,
    description: Localized,
  })
  .strict();

export const Experience = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    /** Empresa empleadora (se permite publicarla). */
    company: text,
    role: Localized,
    /** Línea corta bajo el nombre en el Gantt, p. ej. "Senior Full Stack · Fintech". */
    tagline: Localized,
    start: YearMonth,
    /** `null` = puesto actual. */
    end: YearMonth.nullable(),
    location: Localized,
    context: Localized,
    highlights: z.array(Localized).min(1),
    subProjects: z.array(SubProject).default([]),
    stack: z.array(text).default([]),
    areas: z.array(AreaSlug).default([]),
  })
  .strict()
  .refine((e) => e.end === null || e.end >= e.start, {
    message: "`end` no puede ser anterior a `start`",
    path: ["end"],
  });
export type Experience = z.infer<typeof Experience>;

// ── Áreas ─────────────────────────────────────────────────────────────────────

/** Métrica antes → después (ImpactBars). */
export const ImpactMetric = z
  .object({
    label: Localized,
    before: text,
    after: text,
    /** Variación mostrada, p. ej. "−98.8%". */
    delta: text,
    /** Proporción `after / before` (0–1) para el ancho de la barra. */
    ratio: z.number().min(0).max(1),
  })
  .strict();
export type ImpactMetric = z.infer<typeof ImpactMetric>;

/** Caso concreto de un área (AreaCases); enlaza al proyecto si tiene ficha. */
export const AreaCase = z
  .object({
    title: Localized,
    body: Localized,
    project: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
  })
  .strict();

export const Area = z
  .object({
    slug: AreaSlug,
    title: Localized,
    /** Frase del AreaHero. */
    tagline: Localized,
    summary: Localized,
    bullets: z.array(Localized).min(1),
    tech: z.array(text).min(1),
    metrics: z.array(ImpactMetric).default([]),
    cases: z.array(AreaCase).min(1),
  })
  .strict();
export type Area = z.infer<typeof Area>;

// ── Globo ─────────────────────────────────────────────────────────────────────

export const GlobeKind = z.enum(["team", "company"]);

export const Country = z
  .object({
    /** ISO 3166-1 alpha-2. */
    id: z.string().regex(/^[A-Z]{2}$/),
    kind: GlobeKind,
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    name: Localized,
    companies: z.array(text).min(1).optional(),
  })
  .strict()
  .refine((c) => (c.kind === "company") === (c.companies !== undefined), {
    message: "`companies` es obligatorio en kind 'company' y no se permite en 'team'",
    path: ["companies"],
  });
export type Country = z.infer<typeof Country>;

// ── Home: métricas, formación y stack ─────────────────────────────────────────

export const Stat = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    value: z.number().nonnegative(),
    label: Localized,
  })
  .strict();
export type Stat = z.infer<typeof Stat>;

export const Education = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(["degree", "certification"]),
    title: Localized,
    institution: Localized,
  })
  .strict();
export type Education = z.infer<typeof Education>;

export const StackItem = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    /** Nombre de tecnología: no se traduce. */
    label: text,
  })
  .strict();
export type StackItem = z.infer<typeof StackItem>;

// ── Proyectos ─────────────────────────────────────────────────────────────────

export const PROJECT_STATUSES = ["production", "preproduction", "in-development"] as const;

/** Cifra destacada de un proyecto (ProjectCard, KeyMetrics del case study). */
export const KeyMetric = z
  .object({
    value: text,
    label: Localized,
  })
  .strict();

export const Project = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: Localized,
    /** Empresa empleadora (se permite publicarla). */
    company: text,
    year: z.number().int().min(2015).max(2100),
    /** Qué hice en el proyecto. */
    role: Localized,
    /** Estado real: nunca "producción" si no lo está. */
    status: z.enum(PROJECT_STATUSES),
    summary: Localized,
    areas: z.array(AreaSlug).min(1),
    tech: z.array(text).min(1),
    metrics: z.array(KeyMetric).max(3).default([]),
    /** `true` si tiene case study en `content/projects/{es,en}/<slug>.mdx`. */
    caseStudy: z.boolean().default(false),
  })
  .strict();
export type Project = z.infer<typeof Project>;

// ── Contacto ──────────────────────────────────────────────────────────────────

export const CONTACT_CHANNEL_IDS = ["gmail", "linkedin", "github", "whatsapp"] as const;
export const OPPORTUNITY_TYPES = ["empleo", "contrato", "consultoria", "otro"] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const ContactContent = z
  .object({
    /** Texto de cada canal; el `href` sale de `profile.contactLinks` con el mismo `id`. */
    channels: z
      .array(
        z
          .object({
            id: z.enum(CONTACT_CHANNEL_IDS),
            handle: Localized,
            description: Localized,
          })
          .strict(),
      )
      .length(CONTACT_CHANNEL_IDS.length),
    availability: z
      .object({
        status: z.enum(["available", "unavailable"]),
        title: Localized,
        rows: z.array(z.object({ key: text, label: Localized, value: Localized }).strict()),
        languagesLabel: Localized,
        locationLabel: Localized,
      })
      .strict(),
    opportunityTypes: z
      .array(z.object({ value: z.enum(OPPORTUNITY_TYPES), label: Localized }).strict())
      .length(OPPORTUNITY_TYPES.length),
    cv: z.object({ href: z.string().startsWith("/"), language: z.enum(LOCALES) }).strict(),
  })
  .strict();
export type ContactContent = z.infer<typeof ContactContent>;

/**
 * Formulario de Contacto (ADR 0005). Cada mensaje de error es el nombre del campo: la UI lo traduce
 * con `ContactPage.form.errors.<campo>`.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  email: z.string().trim().pipe(z.email("email")),
  company: z.string().trim().max(80, "company").optional().default(""),
  type: z.enum(OPPORTUNITY_TYPES, "type").default("empleo"),
  message: z.string().trim().min(10, "message").max(2000, "message"),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormField = keyof ContactFormValues;

// ── Constelación de áreas ─────────────────────────────────────────────────────

const Percent = z.number().min(0).max(100);

export const AreasGraph = z
  .object({
    defaultSelected: AreaSlug,
    nodes: z
      .array(
        z
          .object({
            id: AreaSlug,
            /** Texto dentro de la esfera (FE, BE…). */
            code: z.string().regex(/^[A-Z]{2,3}$/),
            /** Módulo firma de su página de área. */
            module: text,
            position3d: z.tuple([z.number(), z.number(), z.number()]),
            /** Posición en el viewBox 1000×600 del fallback 2D. */
            position2d: z.object({ x: z.number().min(0).max(1000), y: z.number().min(0).max(600) }),
            /** Posición en % del escenario móvil (4:5), más compacta. */
            mobile: z.object({ x: Percent, y: Percent }),
            /** Escala del nodo en el fallback. */
            depth: z.number().min(0.85).max(1.1),
            metric: KeyMetric,
          })
          .strict(),
      )
      .length(AREA_SLUGS.length)
      .refine((nodes) => new Set(nodes.map((n) => n.id)).size === nodes.length, {
        message: "Cada área aparece una sola vez",
      }),
    edges: z
      .array(z.object({ from: AreaSlug, to: AreaSlug, label: Localized }).strict())
      .min(1)
      .refine((edges) => edges.every((e) => e.from !== e.to), {
        message: "Una conexión une dos áreas distintas",
      }),
  })
  .strict();
export type AreasGraph = z.infer<typeof AreasGraph>;

// ── Tipos de entrada (lo que se escribe en content/*.ts, antes de defaults) ───

export type ContactContentInput = z.input<typeof ContactContent>;
export type AreasGraphInput = z.input<typeof AreasGraph>;

export type ProfileInput = z.input<typeof Profile>;
export type ExperienceInput = z.input<typeof Experience>;
export type AreaInput = z.input<typeof Area>;
export type StatInput = z.input<typeof Stat>;
export type EducationInput = z.input<typeof Education>;
export type StackItemInput = z.input<typeof StackItem>;
export type ProjectInput = z.input<typeof Project>;

// ── Utilidades ────────────────────────────────────────────────────────────────

/** Sustituye recursivamente cada `{ es, en }` por el string del locale. */
export type LocalizedTo<T> = T extends Localized
  ? string
  : T extends readonly (infer U)[]
    ? LocalizedTo<U>[]
    : T extends object
      ? { [K in keyof T]: LocalizedTo<T[K]> }
      : T;
