import type { AreaSlug } from "@content/schema";
import type { ComponentType } from "react";

export interface AreaPageProps {
  locale: "es" | "en";
}

/**
 * Registro de páginas de área: `slug → componente`. Cada área tiene su propio diseño (shell común +
 * módulo firma). La ruta `/areas/[slug]` solo elige el componente de aquí.
 */
export const areaRegistry: Record<AreaSlug, () => Promise<ComponentType<AreaPageProps>>> = {
  frontend: () => import("./default-area-page").then((m) => m.frontendPage),
  "backend-pagos": () => import("./default-area-page").then((m) => m.backendPage),
  compliance: () => import("./default-area-page").then((m) => m.compliancePage),
  devops: () => import("./default-area-page").then((m) => m.devopsPage),
  "ai-engineering": () => import("./default-area-page").then((m) => m.aiPage),
  leadership: () => import("./default-area-page").then((m) => m.leadershipPage),
};
