import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AvailabilityCard } from "@/components/contact/availability-card";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactForm } from "@/components/contact/contact-form";
import { CvCard } from "@/components/contact/cv-card";
import { ClientMessages } from "@/components/i18n/client-messages";
import { GradientHero } from "@/components/layout/gradient-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getContact, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return pageMetadata({
    href: "/contacto",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/** Página de Contacto. Sin el CTA de cierre: toda la página ya es contacto. */
export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const contact = getContact(locale);
  const profile = getProfile(locale);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: `${SITE_URL}${getPathname({ href: "/contacto", locale })}`,
          inLanguage: locale,
          mainEntity: {
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.role,
            email: `mailto:${contact.email}`,
            sameAs: contact.channels
              .filter((c) => c.id === "linkedin" || c.id === "github")
              .map((c) => c.href),
          },
        }}
      />

      <GradientHero
        eyebrow={t("eyebrow")}
        titleStart={t("titleStart")}
        titleHighlight={t("titleHighlight")}
        lead={t("lead")}
      />

      <ContactChannels
        channels={contact.channels}
        labels={{
          title: t("channelsLabel"),
          primaryEyebrow: t("primaryEyebrow"),
          writeEmail: t("writeEmail"),
          copy: t("copyEmail"),
          copied: t("copied"),
          manual: t("copyManually"),
          newTab: t("newTab"),
        }}
      />

      <div className="container-page mt-3.5 flex flex-wrap gap-3.5">
        <ClientMessages namespaces={["ContactPage"]}>
          <ContactForm email={contact.email} opportunityTypes={contact.opportunityTypes} />
        </ClientMessages>
        <aside className="flex flex-[1_1_360px] flex-col gap-3.5">
          <AvailabilityCard
            availability={contact.availability}
            unavailableTitle={t("unavailable")}
            label={t("availabilityTitle")}
          />
          <CvCard
            href={contact.cv.href}
            labels={{
              title: t("cv.title"),
              subtitle: t("cv.subtitle"),
              download: t("cv.download"),
              experience: t("cv.experience"),
            }}
          />
        </aside>
      </div>
    </main>
  );
}
