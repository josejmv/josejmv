import { getTranslations } from "next-intl/server";

import { AreaShell } from "../area-shell";
import type { AreaPageProps } from "../registry";
import { SignatureModule } from "../signature-module";
import { AtomicLibraryMap } from "./atomic-library-map";
import { TokenPlayground } from "./token-playground";

/** Componentes de ejemplo por nivel (10 · 7 · 5 · 5, como la librería real). */
const LIBRARY = {
  atoms: [
    "Button",
    "Icon",
    "Badge",
    "Input",
    "Label",
    "Avatar",
    "Spinner",
    "Divider",
    "Link",
    "Text",
  ],
  molecules: ["FormField", "SearchBar", "Card", "Tabs", "Toast", "Dropdown", "Pagination"],
  organisms: ["Header", "DataTable", "Modal", "Sidebar", "FilterPanel"],
  templates: ["Dashboard", "ListPage", "DetailPage", "AuthPage", "SettingsPage"],
} as const;

export async function FrontendPage({ locale }: AreaPageProps) {
  const [t, tArea] = await Promise.all([
    getTranslations({ locale, namespace: "AreaFrontend" }),
    getTranslations({ locale, namespace: "AreaPage" }),
  ]);

  return (
    <AreaShell slug="frontend" locale={locale}>
      <SignatureModule
        name="TokenPlayground"
        title={t("title")}
        description={t("description")}
        disclaimer={tArea("disclaimer")}
      >
        <TokenPlayground />
        <AtomicLibraryMap
          title={t("library.title")}
          note={t("library.note")}
          levels={(Object.keys(LIBRARY) as (keyof typeof LIBRARY)[]).map((key) => ({
            key,
            label: t(`library.${key}`),
            items: [...LIBRARY[key]],
          }))}
        />
      </SignatureModule>
    </AreaShell>
  );
}
