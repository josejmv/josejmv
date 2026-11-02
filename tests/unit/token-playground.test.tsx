import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { TokenPlayground } from "@/components/areas/frontend/token-playground";

import es from "../../messages/es.json";

function renderPlayground() {
  const utils = render(
    <NextIntlClientProvider locale="es" messages={es}>
      <TokenPlayground />
    </NextIntlClientProvider>,
  );
  const preview = () =>
    utils.container.querySelector<HTMLElement>('[style*="--demo-action"]')!.style;
  return { ...utils, preview };
}

describe("TokenPlayground", () => {
  it("cambia los tokens semánticos al elegir otra marca", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();
    expect(preview().getPropertyValue("--demo-action")).toContain(" 75)");

    await user.click(screen.getByRole("radio", { name: "Marca B" }));
    expect(screen.getByRole("radio", { name: "Marca B" })).toHaveAttribute("aria-checked", "true");
    expect(preview().getPropertyValue("--demo-action")).toContain(" 250)");
    expect(preview().getPropertyValue("--demo-radius")).toBe("4px");
  });

  it("el slider de tono re-tematiza en vivo", () => {
    const { preview } = renderPlayground();
    fireEvent.change(screen.getByLabelText(/Tono de marca/), { target: { value: "300" } });
    expect(preview().getPropertyValue("--demo-action")).toContain(" 300)");
  });
});
