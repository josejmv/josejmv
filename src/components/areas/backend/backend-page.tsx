import { getTranslations } from "next-intl/server";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { PaymentFlowSimulator } from "./payment-flow-simulator";

export async function BackendPage({ locale }: AreaPageProps) {
  const [t, tArea] = await Promise.all([
    getTranslations({ locale, namespace: "AreaBackend" }),
    getTranslations({ locale, namespace: "AreaPage" }),
  ]);

  return (
    <AreaShell slug="backend-pagos" locale={locale}>
      <SignatureModule
        name="PaymentFlowSimulator"
        title={t("title")}
        description={t("description")}
        disclaimer={tArea("disclaimer")}
      >
        <PaymentFlowSimulator />
      </SignatureModule>
    </AreaShell>
  );
}
