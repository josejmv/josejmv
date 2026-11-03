import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GlowOrbs } from "@/components/ui/backgrounds/glow-orbs";
import { GridBackground } from "@/components/ui/backgrounds/grid-background";

describe("fondos decorativos", () => {
  it("GridBackground queda oculto a tecnologías asistivas y no captura eventos", () => {
    const { container } = render(<GridBackground />);
    const node = container.firstElementChild!;
    expect(node).toHaveAttribute("aria-hidden", "true");
    expect(node).toHaveClass("bg-grid", "pointer-events-none");
  });

  it("GlowOrbs pinta dos halos con los tokens de glow", () => {
    const { container } = render(<GlowOrbs />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".bg-glow-1")).not.toBeNull();
    expect(container.querySelector(".bg-glow-2")).not.toBeNull();
  });
});
