import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { buildMailto } from "@/components/contact/build-mailto";
import { ContactForm } from "@/components/contact/contact-form";

import es from "../../messages/es.json";

const openMailto = vi.hoisted(() => vi.fn());
vi.mock("@/components/contact/open-mailto", () => ({ openMailto }));

const OPTIONS = { to: "jose@example.com", subjectPrefix: "Portafolio", typeLabel: "Consultoría" };

function decode(url: string) {
  const parsed = new URL(url);
  return {
    to: parsed.pathname,
    subject: parsed.searchParams.get("subject"),
    body: parsed.searchParams.get("body"),
  };
}

describe("buildMailto", () => {
  it("arma destinatario, asunto y cuerpo con firma", () => {
    const url = buildMailto(
      { name: " Ana ", email: "ana@example.com", company: "Acme", message: "Hola" },
      OPTIONS,
    );
    expect(decode(url)).toEqual({
      to: "jose@example.com",
      subject: "Portafolio · Consultoría · Ana",
      body: "Hola\n\n—\nAna\nana@example.com\nAcme",
    });
  });

  it("codifica tildes, saltos de línea y &", () => {
    const url = buildMailto(
      { name: "José", email: "a@b.co", message: "Diseño & pagos\nlínea 2" },
      OPTIONS,
    );
    expect(url).not.toMatch(/\s/);
    expect(url).toContain("Dise%C3%B1o%20%26%20pagos%0Al%C3%ADnea%202");
    // Un solo `&`: el que separa subject y body.
    expect(url.match(/&/g)).toHaveLength(1);
  });

  it("incluye la empresa solo si existe", () => {
    const without = buildMailto(
      { name: "Ana", email: "a@b.co", company: "  ", message: "Hola" },
      OPTIONS,
    );
    expect(decode(without).body).toBe("Hola\n\n—\nAna\na@b.co");
  });

  it("recorta el mensaje con … para respetar el límite, sin tocar la firma", () => {
    const url = buildMailto(
      { name: "Ana", email: "a@b.co", message: "ñ".repeat(3000) },
      { ...OPTIONS, maxLength: 1800 },
    );
    expect(url.length).toBeLessThanOrEqual(1800);
    const { body } = decode(url);
    expect(body).toMatch(/^ñ+…\n\n—\nAna\na@b\.co$/);
    // Usa casi todo el espacio disponible (búsqueda binaria, no recortes gruesos).
    expect(url.length).toBeGreaterThan(1800 - 20);
  });
});

function renderForm() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <ContactForm
        email="josejmvasquez@gmail.com"
        opportunityTypes={[
          { value: "empleo", label: "Empleo de tiempo completo" },
          { value: "consultoria", label: "Consultoría" },
        ]}
      />
    </NextIntlClientProvider>,
  );
}

describe("ContactForm", () => {
  it("enviar vacío muestra la alerta, marca los campos y enfoca Nombre", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByRole("alert")).toHaveTextContent(es.ContactPage.form.error);
    const name = screen.getByLabelText("Nombre *");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(es.ContactPage.form.errors.name);
    expect(screen.getByLabelText("Email *")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Mensaje *")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Empresa")).not.toHaveAttribute("aria-invalid");
    expect(name).toHaveFocus();
  });

  it("con datos válidos abre el mailto y muestra el estado enviado", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Nombre *"), "Ana");
    await user.type(screen.getByLabelText("Email *"), "ana@example.com");
    await user.selectOptions(screen.getByLabelText("Tipo de oportunidad"), "consultoria");
    await user.type(screen.getByLabelText("Mensaje *"), "Quiero hablar de un proyecto.");
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(openMailto).toHaveBeenCalledOnce();
    const url = openMailto.mock.calls[0][0] as string;
    expect(decode(url)).toEqual({
      to: "josejmvasquez@gmail.com",
      subject: "Portafolio · Consultoría · Ana",
      body: "Quiero hablar de un proyecto.\n\n—\nAna\nana@example.com",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Listo, Ana.");
    expect(screen.getByRole("link", { name: "Ábrelo aquí" })).toHaveAttribute("href", url);

    await user.click(screen.getByRole("button", { name: "Escribir otro mensaje" }));
    expect(screen.getByLabelText("Nombre *")).toHaveValue("");
  });
});
