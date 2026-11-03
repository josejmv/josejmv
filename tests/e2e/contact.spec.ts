import { expect, type Page, test } from "@playwright/test";

const LOCALES = [
  {
    path: "/es/contacto",
    name: "Nombre *",
    email: "Email *",
    type: "Tipo de oportunidad",
    message: "Mensaje *",
    submit: "Enviar mensaje",
    alert: "Completa nombre, un email válido y el mensaje.",
    subject: "Portafolio · Consultoría · Ana Pérez",
    sent: "Listo, Ana Pérez.",
    openHere: "Ábrelo aquí",
    again: "Escribir otro mensaje",
    copy: "Copiar email",
    copied: "¡Copiado!",
  },
  {
    path: "/en/contact",
    name: "Name *",
    email: "Email *",
    type: "Opportunity type",
    message: "Message *",
    submit: "Send message",
    alert: "Fill in your name, a valid email and the message.",
    subject: "Portfolio · Consulting · Ana Pérez",
    sent: "Done, Ana Pérez.",
    openHere: "Open it here",
    again: "Write another message",
    copy: "Copy email",
    copied: "Copied!",
  },
] as const;

/** Navega y espera a que el formulario esté hidratado. */
async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
}

for (const l of LOCALES) {
  test.describe(`Contacto · ${l.path}`, () => {
    test("enviar vacío muestra la alerta, marca los campos y enfoca el nombre", async ({
      page,
    }) => {
      await gotoReady(page, l.path);
      await page.getByRole("button", { name: l.submit }).click();

      await expect(page.getByRole("alert").filter({ hasText: l.alert })).toBeVisible();
      for (const label of [l.name, l.email, l.message]) {
        await expect(page.getByLabel(label)).toHaveAttribute("aria-invalid", "true");
      }
      await expect(page.getByLabel(l.name)).toBeFocused();
    });

    test("con datos válidos arma el mailto, no hace peticiones y muestra el estado enviado", async ({
      page,
    }) => {
      await gotoReady(page, l.path);
      await page.getByLabel(l.name).fill("Ana Pérez");
      await page.getByLabel(l.email).fill("ana@example.com");
      await page.getByLabel(l.type).selectOption("consultoria");
      await page.getByLabel(l.message).fill("Hola & gracias.\nSegunda línea.");

      // Lo que el formulario envíe por red, aparte de abrir el mailto: nada (ADR 0005).
      const sent: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (url.protocol === "mailto:") return;
        const sameOriginGet =
          request.method() === "GET" && url.origin === new URL(page.url()).origin;
        if (!sameOriginGet) sent.push(`${request.method()} ${request.url()}`);
      });
      const navigation = page.waitForRequest((request) => request.url().startsWith("mailto:"));
      await page.getByRole("button", { name: l.submit }).click();

      const mailto = new URL((await navigation).url());
      await expect(page.getByRole("status").filter({ hasText: l.sent })).toBeVisible();
      await expect(page.getByRole("link", { name: l.openHere })).toHaveAttribute(
        "href",
        mailto.href,
      );
      expect(mailto.protocol).toBe("mailto:");
      expect(mailto.pathname).toBe("josejmvasquez@gmail.com");
      expect(mailto.searchParams.get("subject")).toBe(l.subject);
      expect(mailto.searchParams.get("body")).toBe(
        "Hola & gracias.\nSegunda línea.\n\n—\nAna Pérez\nana@example.com",
      );
      expect(sent).toEqual([]);

      await page.getByRole("button", { name: l.again }).click();
      await expect(page.getByLabel(l.name)).toHaveValue("");
    });

    test("«Copiar email» copia al portapapeles y lo confirma", async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await gotoReady(page, l.path);
      await page.getByRole("button", { name: l.copy }).click();
      await expect(page.getByRole("button", { name: l.copied })).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        "josejmvasquez@gmail.com",
      );
      // Vuelve a su texto a los 1,8 s.
      await expect(page.getByRole("button", { name: l.copy })).toBeVisible({ timeout: 4000 });
    });
  });
}

test("la página de Contacto no repite el CTA de cierre y su header marca Contacto", async ({
  page,
  isMobile,
}) => {
  await gotoReady(page, "/es/contacto");
  await expect(page.getByRole("heading", { name: "¿Construimos algo confiable?" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Ver todas las vías de contacto" })).toHaveCount(0);
  if (!isMobile) {
    await expect(
      page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Contacto" }),
    ).toHaveAttribute("aria-current", "page");
  }
});

test("los canales de Contacto abren destinos reales y seguros", async ({ page }) => {
  await gotoReady(page, "/es/contacto");
  const channels = page.getByRole("region", { name: "Vías de contacto" });
  await expect(channels.getByRole("link", { name: "Escribir un correo" })).toHaveAttribute(
    "href",
    "mailto:josejmvasquez@gmail.com",
  );
  for (const [name, href] of [
    [/LinkedIn/, /^https:\/\/www\.linkedin\.com\/in\//],
    [/GitHub/, /^https:\/\/github\.com\//],
    [/WhatsApp/, /^https:\/\/wa\.me\/\d+$/],
  ] as const) {
    const link = channels.getByRole("link", { name });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("las rutas viejas siguen funcionando: /#contacto es el ancla del Home", async ({ page }) => {
  await gotoReady(page, "/es#contacto");
  await expect(page.locator("#contacto")).toBeInViewport();
});

test("sin scroll horizontal a 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await gotoReady(page, "/es/contacto");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
