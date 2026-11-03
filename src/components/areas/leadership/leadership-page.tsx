import { getTranslations } from "next-intl/server";

import { type TeamStage, TeamGrowthChart } from "@/components/charts/team-growth";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import type { ChainStep } from "../step-chain";
import { type DocsStat, DocsStandard } from "./docs-standard";
import { type Principle, Principles } from "./principles";

export async function LeadershipPage({ locale }: AreaPageProps) {
  const t = await getTranslations({ locale, namespace: "AreaLeadership" });

  return (
    <AreaShell slug="leadership" locale={locale}>
      <SignatureModule
        name="TeamGrowthChart + DocsStandard"
        title={t("title")}
        description={t("description")}
        disclaimer={t("disclaimer")}
      >
        <TeamGrowthChart
          title={t("team.title")}
          stages={t.raw("team.stages") as TeamStage[]}
          legend={{
            start: t("team.legend.start"),
            growth: t("team.legend.growth"),
            maybe: t("team.legend.maybe"),
          }}
        />
        <DocsStandard
          title={t("docs.title")}
          label={t("docs.label")}
          steps={t.raw("docs.steps") as ChainStep[]}
          stats={t.raw("docs.stats") as DocsStat[]}
        />
        <Principles
          title={t("principles.title")}
          items={t.raw("principles.items") as Principle[]}
        />
      </SignatureModule>
    </AreaShell>
  );
}
