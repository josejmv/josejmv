import { getTranslations } from "next-intl/server";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { KycPipeline, type KycStep } from "./kyc-pipeline";
import { type CheckResult, VerdictCard, type VerdictCheck } from "./verdict-card";

export async function CompliancePage({ locale }: AreaPageProps) {
  const [t, tArea] = await Promise.all([
    getTranslations({ locale, namespace: "AreaCompliance" }),
    getTranslations({ locale, namespace: "AreaPage" }),
  ]);

  // Listas de la demo (datos ficticios) en messages/*.json.
  const steps = t.raw("steps") as KycStep[];
  const checks = t.raw("verdict.checks") as VerdictCheck[];

  return (
    <AreaShell slug="compliance" locale={locale}>
      <SignatureModule
        name="KycPipeline"
        title={t("title")}
        description={t("description")}
        disclaimer={tArea("disclaimer")}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
          <KycPipeline label={t("pipelineLabel")} steps={steps} />
          <div className="lg:sticky lg:top-28">
            <VerdictCard
              title={t("verdict.title")}
              subject={t("verdict.subject")}
              verdict={t("verdict.result")}
              verdictResult={t("verdict.resultKind") as CheckResult}
              checks={checks}
              resultLabels={{
                pass: t("results.pass"),
                review: t("results.review"),
                fail: t("results.fail"),
              }}
            />
          </div>
        </div>
      </SignatureModule>
    </AreaShell>
  );
}
