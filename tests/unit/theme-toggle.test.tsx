import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

function renderToggle(locale: "es" | "en" = "es") {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === "es" ? es : en}>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("arranca en oscuro por defecto", () => {
    renderToggle();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("alterna entre oscuro y claro", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = screen.getByRole("button", { name: es.Theme.toggle });

    await user.click(button);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    await user.click(button);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("tiene nombre accesible en inglés", () => {
    renderToggle("en");
    expect(screen.getByRole("button", { name: en.Theme.toggle })).toBeInTheDocument();
  });
});
