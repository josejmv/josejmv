import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ExtractionDemo, type ExtractionField } from "@/components/areas/ai/extraction-demo";

import es from "../../messages/es.json";

const fields = es.AreaAi.fields as ExtractionField[];

function renderDemo() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <ExtractionDemo
        documentTitle={es.AreaAi.document.title}
        documentLines={es.AreaAi.document.lines}
        fields={fields}
      />
    </NextIntlClientProvider>,
  );
}

describe("ExtractionDemo", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it("arma el JSON por partes y termina con todos los campos", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = renderDemo();
    await user.click(screen.getByRole("button", { name: es.AreaAi.actions.extract }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    const partial = container.querySelector("pre")!.textContent!;
    expect(partial.length).toBeGreaterThan(0);
    expect(partial).not.toContain('"suma_asegurada"');

    for (let i = 0; i < 200; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });
    }
    const json = JSON.parse(container.querySelector("pre")!.textContent!);
    expect(Object.keys(json)).toEqual(fields.map((f) => f.key));
    expect(screen.getByRole("status")).toHaveTextContent("6 campos extraídos");
    expect(screen.getByRole("button", { name: es.AreaAi.actions.again })).toBeEnabled();
  });

  it("con reduced-motion muestra el JSON completo de inmediato", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = renderDemo();
    await user.click(screen.getByRole("button", { name: es.AreaAi.actions.extract }));
    expect(() => JSON.parse(container.querySelector("pre")!.textContent!)).not.toThrow();
  });
});
