import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CommandMenu } from "@/components/command/command-menu";
import { ThemeProvider } from "@/components/theme/theme-provider";

import es from "../../messages/es.json";

// La paleta se importa de forma diferida: la primera carga en frío puede superar el 1 s por defecto.
const LAZY = { timeout: 5000 };

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/es",
  useParams: () => ({ locale: "es" }),
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
}));

const areas = [
  { slug: "frontend", title: "Frontend" },
  { slug: "devops", title: "DevOps" },
];

function renderMenu() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <ThemeProvider>
        <CommandMenu
          areas={areas}
          projects={[{ slug: "payment-orchestrator", title: "Orquestador de pagos" }]}
          email="hola@example.com"
        />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

async function openWithButton(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /Buscar…/ }));
  return screen.findByPlaceholderText(es.Command.placeholder, {}, LAZY);
}

describe("CommandMenu", () => {
  beforeEach(() => {
    router.push.mockClear();
    router.replace.mockClear();
    localStorage.clear();
  });

  it("se abre con Ctrl+K", async () => {
    renderMenu();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    });
    expect(
      await screen.findByPlaceholderText(es.Command.placeholder, {}, LAZY),
    ).toBeInTheDocument();
  });

  it("filtra y navega a un área", async () => {
    const user = userEvent.setup();
    renderMenu();
    const input = await openWithButton(user);

    await user.type(input, "devops");
    expect(screen.queryByText("Frontend")).not.toBeInTheDocument();
    await user.click(screen.getByText("DevOps"));

    expect(router.push.mock.calls[0][0]).toBe("/es/areas/devops");
    await waitFor(() =>
      expect(screen.queryByPlaceholderText(es.Command.placeholder)).not.toBeInTheDocument(),
    );
  });

  it("navega a Contacto en la Home", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openWithButton(user);
    await user.click(screen.getByText(es.Nav.contact));
    expect(router.push.mock.calls[0][0]).toBe("/es#contacto");
  });

  it("devuelve el foco al botón al cerrar con Escape", async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole("button", { name: /Buscar…/ });
    await openWithButton(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("navega a un case study", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openWithButton(user);
    await user.click(screen.getByText("Orquestador de pagos"));
    expect(router.push.mock.calls[0][0]).toBe("/es/proyectos/payment-orchestrator");
  });

  it("cambia de idioma conservando la página", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openWithButton(user);
    await user.click(screen.getByText("Cambiar a inglés"));
    expect(router.replace.mock.calls[0][0]).toBe("/en");
  });

  it("alterna el tema", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openWithButton(user);
    await user.click(screen.getByText(es.Command.toggleTheme));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("copia el email y lo confirma", async () => {
    // user-event instala su propio portapapeles simulado en navigator.clipboard.
    const user = userEvent.setup();
    renderMenu();
    await openWithButton(user);
    await user.click(screen.getByText(es.Command.copyEmail));

    expect(await navigator.clipboard.readText()).toBe("hola@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(es.Command.copied);
  });
});
