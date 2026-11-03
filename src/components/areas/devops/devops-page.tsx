import { getTranslations } from "next-intl/server";

import { ClientMessages } from "@/components/i18n/client-messages";
import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { type ChainStep, StepChain } from "../step-chain";
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
        <ClientMessages namespaces={["AreaDevops"]}>
          <PipelineRunner />
        </ClientMessages>
        <StepChain
          title={t("infra.title")}
          label={t("infra.label")}
          steps={t.raw("infra.nodes") as ChainStep[]}
        />
      </SignatureModule>
    </AreaShell>
  );
}
