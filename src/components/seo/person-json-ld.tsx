import type { LocalizedProfile } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

interface PersonJsonLdProps {
  profile: LocalizedProfile;
  locale: string;
  knowsAbout: string[];
}

/** JSON-LD `Person` (schema.org) del Home. Solo datos públicos del perfil. */
export function PersonJsonLd({ profile, locale, knowsAbout }: PersonJsonLdProps) {
  const sameAs = profile.contactLinks
    .filter((link) => link.href.startsWith("https://") && !link.href.includes("wa.me"))
    .map((link) => link.href);

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.summary,
    url: `${SITE_URL}/${locale}`,
    email: `mailto:${profile.email}`,
    sameAs,
    knowsAbout,
    knowsLanguage: profile.languages.map((language) => language.name),
    address: { "@type": "PostalAddress", addressCountry: profile.country },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify no escapa `<`: se reemplaza para que ningún texto pueda cerrar el <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
