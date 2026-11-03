import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { MainNav } from "@/components/layout/main-nav";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeProvider } from "@/components/theme/theme-provider";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

const nav = vi.hoisted(() => ({
  pathname: "/es",
  params: { locale: "es" } as Record<string, string>,
}));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => nav.pathname,
  useParams: () => nav.params,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const navLabels = (m: typeof es) => ({ labels: m.Nav, label: m.Header.primaryNav });
const switchLabel = { es: "Cambiar idioma a inglés", en: "Switch language to Spanish" } as const;

function renderWith(node: ReactNode, locale: "es" | "en" = "es") {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === "es" ? es : en}>
      <ThemeProvider>{node}</ThemeProvider>
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  nav.pathname = "/es";
  nav.params = { locale: "es" };
});

describe("MainNav", () => {
  it("marca Inicio como página actual en la Home", () => {
    renderWith(<MainNav {...navLabels(es)} />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Experiencia" })).not.toHaveAttribute("aria-current");
  });

  it("usa las rutas localizadas en inglés", () => {
    nav.pathname = "/en/experience";
    nav.params = { locale: "en" };
    renderWith(<MainNav {...navLabels(en)} />, "en");
    const link = screen.getByRole("link", { name: "Experience" });
    expect(link).toHaveAttribute("href", "/en/experience");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("enlaza Áreas y Contacto a sus páginas", () => {
    renderWith(<MainNav {...navLabels(es)} />);
    expect(screen.getByRole("link", { name: "Áreas" })).toHaveAttribute("href", "/es/areas");
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/es/contacto");
  });
});

describe("LocaleSwitcher", () => {
  it("apunta a la misma página en el otro idioma", () => {
    nav.pathname = "/es/experiencia";
    renderWith(<LocaleSwitcher label={switchLabel.es} />);
    const link = screen.getByRole("link", { name: /Cambiar idioma a inglés/ });
    expect(link).toHaveAttribute("href", "/en/experience");
    expect(link).toHaveAttribute("hreflang", "en");
  });

  it("conserva los parámetros de rutas dinámicas", () => {
    nav.pathname = "/en/areas/devops";
    nav.params = { locale: "en", slug: "devops" };
    renderWith(<LocaleSwitcher label={switchLabel.en} />, "en");
    expect(screen.getByRole("link", { name: /Switch language to Spanish/ })).toHaveAttribute(
      "href",
      "/es/areas/devops",
    );
  });
});

describe("MobileMenu", () => {
  const areas = [
    { slug: "frontend", title: "Frontend" },
    { slug: "devops", title: "DevOps" },
  ];

  it("abre el Sheet con secciones, áreas, idioma y tema, y se cierra", async () => {
    const user = userEvent.setup();
    renderWith(<MobileMenu areas={areas} label={es.Header.openMenu} />);

    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(trigger);
    // El Sheet se importa de forma diferida: la primera carga en frío puede superar 1 s.
    const dialog = await screen.findByRole("dialog", {}, { timeout: 5000 });

    expect(within(dialog).getByRole("link", { name: "Experiencia" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "DevOps" })).toHaveAttribute(
      "href",
      "/es/areas/devops",
    );
    expect(
      within(dialog).getByRole("link", { name: /Cambiar idioma a inglés/ }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: es.Theme.toggle })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Cerrar menú" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
