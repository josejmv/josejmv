import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

/** Contenido de la página 404 (lo usan `not-found.tsx` y la página 404 estática del proxy). */
export function NotFoundView() {
  const t = useTranslations("NotFound");

  return (
    <main className="container-page flex flex-1 flex-col items-start justify-center gap-4 py-24">
      <h1 className="font-display text-4xl">{t("title")}</h1>
      <p className="text-text-2">{t("description")}</p>
      <Link href="/" className="text-accent-text underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}
