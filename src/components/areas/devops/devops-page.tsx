import { getTranslations } from "next-intl/server";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { InfraMap, type InfraNode } from "./infra-map";
import { PipelineRunner } from "./pipeline-runner";

export async function DevopsPage({ locale }: AreaPageProps) {
  const [t, tArea] = await Promise.all([
    getTranslations({ locale, namespace: "AreaDevops" }),
    getTranslations({ locale, namespace: "AreaPage" }),
  ]);

  return (
    <AreaShell slug="devops" locale={locale}>
      <SignatureModule
        name="PipelineRunner"
        title={t("title")}
        description={t("description")}
        disclaimer={tArea("disclaimer")}
      >
        <PipelineRunner />
        <InfraMap
          title={t("infra.title")}
          label={t("infra.label")}
          nodes={t.raw("infra.nodes") as InfraNode[]}
        />
      </SignatureModule>
    </AreaShell>
  );
}
