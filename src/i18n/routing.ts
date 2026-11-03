import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Las claves son las rutas internas (carpetas de src/app/[locale]); los valores, la URL pública.
  pathnames: {
    "/": "/",
    "/experiencia": { es: "/experiencia", en: "/experience" },
    "/proyectos": { es: "/proyectos", en: "/projects" },
    "/proyectos/[slug]": { es: "/proyectos/[slug]", en: "/projects/[slug]" },
    "/areas": "/areas",
    "/areas/[slug]": "/areas/[slug]",
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});
