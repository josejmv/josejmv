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
  frontend: () => import("./frontend/frontend-page").then((m) => m.FrontendPage),
  "backend-pagos": () => import("./backend/backend-page").then((m) => m.BackendPage),
  compliance: () => import("./compliance/compliance-page").then((m) => m.CompliancePage),
  devops: () => import("./devops/devops-page").then((m) => m.DevopsPage),
  "ai-engineering": () => import("./default-area-page").then((m) => m.aiPage),
  leadership: () => import("./default-area-page").then((m) => m.leadershipPage),
};
