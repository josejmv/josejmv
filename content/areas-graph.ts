// Grafo de la constelación de /areas (ADR 0006). Solo añade lo que la escena necesita: posiciones,
// códigos, módulo firma, métrica estrella y conexiones. Títulos, textos y stack salen de
// content/areas.ts. Validado con Zod en content/schema.ts (AreasGraph).
import type { AreasGraphInput } from "./schema";

export const areasGraph = {
  defaultSelected: "backend-pagos",
  nodes: [
    {
      id: "frontend",
      code: "FE",
      module: "TokenPlayground",
      position3d: [-2.9, 1.4, 0.6],
      position2d: { x: 210, y: 160 },
      mobile: { x: 24, y: 22 },
      depth: 1.08,
      metric: {
        value: "−30%",
        label: { es: "suite de tests (255 s → 178 s)", en: "test suite (255 s → 178 s)" },
      },
    },
    {
      id: "backend-pagos",
      code: "BE",
      module: "PaymentFlowSimulator",
      position3d: [-0.2, 2.1, -1.2],
      position2d: { x: 480, y: 100 },
      mobile: { x: 50, y: 10 },
      depth: 0.9,
      metric: {
        value: "−98.8%",
        label: { es: "paginación por cursor (300k filas)", en: "cursor pagination (300k rows)" },
      },
    },
    {
      id: "compliance",
      code: "KYC",
      module: "KycPipeline",
      position3d: [2.8, 1.3, 0.4],
      position2d: { x: 760, y: 175 },
      mobile: { x: 76, y: 26 },
      depth: 1.05,
      metric: {
        value: "224",
        label: { es: "commits de código en 8 semanas", en: "code commits in 8 weeks" },
      },
    },
    {
      id: "devops",
      code: "OPS",
      module: "PipelineRunner",
      position3d: [3.0, -1.2, -0.6],
      position2d: { x: 800, y: 420 },
      mobile: { x: 76, y: 68 },
      depth: 0.95,
      metric: {
        value: "−97%",
        label: {
          es: "guardado de caché en CI (1:36 → 0:03)",
          en: "CI cache save (1:36 → 0:03)",
        },
      },
    },
    {
      id: "ai-engineering",
      code: "AI",
      module: "ExtractionDemo",
      position3d: [0.2, -2.0, 1.0],
      position2d: { x: 520, y: 470 },
      mobile: { x: 50, y: 84 },
      depth: 1.1,
      metric: {
        value: "403",
        label: {
          es: "commits pareados con IA en 4 repositorios",
          en: "AI-paired commits across 4 repositories",
        },
      },
    },
    {
      id: "leadership",
      code: "LD",
      module: "DocsStandard",
      position3d: [-3.1, -1.3, -1.0],
      position2d: { x: 190, y: 440 },
      mobile: { x: 24, y: 66 },
      depth: 0.88,
      metric: {
        value: "63",
        label: {
          es: "features con el estándar RFC → ADR",
          en: "features with the RFC → ADR standard",
        },
      },
    },
  ],
  /** Cada conexión es un proyecto que cruza las dos áreas. */
  edges: [
    {
      from: "frontend",
      to: "backend-pagos",
      label: { es: "Sitio de pagos (Next.js)", en: "Payments site (Next.js)" },
    },
    { from: "backend-pagos", to: "devops", label: { es: "Gate de CI", en: "CI gate" } },
    {
      from: "backend-pagos",
      to: "compliance",
      label: { es: "Motor KYC (FastAPI)", en: "KYC engine (FastAPI)" },
    },
    {
      from: "compliance",
      to: "ai-engineering",
      label: { es: "Extracción con Bedrock", en: "Extraction with Bedrock" },
    },
    {
      from: "ai-engineering",
      to: "leadership",
      label: { es: "Workflow con Claude Code", en: "Claude Code workflow" },
    },
    {
      from: "leadership",
      to: "frontend",
      label: { es: "Estándar de documentación", en: "Documentation standard" },
    },
    {
      from: "frontend",
      to: "devops",
      label: { es: "Suite de tests −30%", en: "Test suite −30%" },
    },
  ],
} satisfies AreasGraphInput;
