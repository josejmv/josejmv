import { getTranslations } from "next-intl/server";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { type ChainStep, StepChain } from "../step-chain";
import { ExtractionDemo, type ExtractionField } from "./extraction-demo";

export async function AiPage({ locale }: AreaPageProps) {
  const [t, tArea] = await Promise.all([
    getTranslations({ locale, namespace: "AreaAi" }),
    getTranslations({ locale, namespace: "AreaPage" }),
  ]);

  return (
    <AreaShell slug="ai-engineering" locale={locale}>
      <SignatureModule
        name="ExtractionDemo"
        title={t("title")}
        description={t("description")}
        disclaimer={tArea("disclaimer")}
      >
        <ExtractionDemo
          documentTitle={t("document.title")}
          documentLines={t.raw("document.lines") as string[]}
          fields={t.raw("fields") as ExtractionField[]}
        />
        <StepChain
          title={t("workflow.title")}
          label={t("workflow.label")}
          steps={t.raw("workflow.steps") as ChainStep[]}
        />
      </SignatureModule>
    </AreaShell>
  );
}
