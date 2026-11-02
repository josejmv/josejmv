import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import type { ContentLocale } from "@content/schema";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/content";
import { getCurrentMonth } from "@/lib/time";

import { NAV_ITEMS } from "./nav-items";
import { SiteLogo } from "./site-logo";

const linkClasses =
  "inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

export async function SiteFooter({ locale }: { locale: ContentLocale }) {
  const [t, tNav, tHeader, month] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Header" }),
    getCurrentMonth(),
  ]);
  const profile = getProfile(locale);

  return (
    <footer className="relative z-10 container-page mt-16 pb-10">
      <div className="grid gap-8 border-t border-border pt-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <SiteLogo
            monogram={profile.monogram}
            label={tHeader("home", { name: profile.name })}
            className="self-start"
          />
          <p className="max-w-xs text-sm text-muted">{profile.headline}</p>
        </div>

        <nav aria-label={t("navTitle")}>
          <h2 className="mb-2 font-mono text-xs text-subtle">{t("navTitle")}</h2>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClasses}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-2 font-mono text-xs text-subtle">{t("contactTitle")}</h2>
          <ul>
            {profile.contactLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={linkClasses}
                  {...(link.href.startsWith("http") && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-subtle">
        <p>{t("rights", { year: month.slice(0, 4), name: profile.name })}</p>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}
