import type { AreaSlug } from "@content/schema";

import { AreaShell } from "./area-shell";
import type { AreaPageProps } from "./registry";

/** Página de área sin módulo firma (se reemplaza en las tareas 6.1–6.6). */
function withoutModule(slug: AreaSlug) {
  function DefaultAreaPage({ locale }: AreaPageProps) {
    return <AreaShell slug={slug} locale={locale} />;
  }
  DefaultAreaPage.displayName = `DefaultAreaPage(${slug})`;
  return DefaultAreaPage;
}

export const frontendPage = withoutModule("frontend");
export const backendPage = withoutModule("backend-pagos");
export const compliancePage = withoutModule("compliance");
export const devopsPage = withoutModule("devops");
export const aiPage = withoutModule("ai-engineering");
export const leadershipPage = withoutModule("leadership");
