import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CollaborationGlobe } from "@/components/three/globe/collaboration-globe";
import { getGlobeData } from "@/lib/content";

const canvasLoaded = vi.hoisted(() => vi.fn());

vi.mock("@/components/three/globe/globe-canvas", () => {
  canvasLoaded();
  return { default: () => <div data-testid="globe-canvas" /> };
});

const data = getGlobeData("es");
const fallback = <div role="img" aria-label="Globo estático" />;

// El globo siempre está "en viewport": así los casos negativos dependen solo de WebGL y reduced-motion.
class VisibleObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}

/** Contexto WebGL falso con el renderer indicado. */
function fakeGl(renderer = "ANGLE (NVIDIA GeForce RTX)") {
  return {
    getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 1 }),
    getParameter: () => renderer,
  } as unknown as RenderingContext;
}

/** Simula un desktop con puntero fino; `reduce` activa prefers-reduced-motion. */
function mockMedia({ reduce = false, desktop = true } = {}) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: query.includes("reduce") ? reduce : query.includes("min-width") ? desktop : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", VisibleObserver);
  mockMedia();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("CollaborationGlobe", () => {
  it("con WebGL, sin reduced-motion y en viewport carga el globo 3D", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeGl());
    render(<CollaborationGlobe points={data.team} home={data.home} fallback={fallback} />);

    expect(await screen.findByTestId("globe-canvas", {}, { timeout: 5000 })).toBeInTheDocument();
    // El estático sigue en el árbol accesible mientras el 3D carga.
    expect(screen.getByRole("img", { name: "Globo estático" })).toBeInTheDocument();
  });

  it("en móvil o tablet se queda en el globo estático", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeGl());
    mockMedia({ desktop: false });
    render(<CollaborationGlobe points={data.team} home={data.home} fallback={fallback} />);

    await new Promise((r) => setTimeout(r, 1500));
    expect(screen.queryByTestId("globe-canvas")).not.toBeInTheDocument();
  });

  it("con WebGL por software (sin GPU) se queda en el globo estático", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      fakeGl("Google SwiftShader"),
    );
    render(<CollaborationGlobe points={data.team} home={data.home} fallback={fallback} />);

    await new Promise((r) => setTimeout(r, 1500));
    expect(screen.queryByTestId("globe-canvas")).not.toBeInTheDocument();
  });

  it("sin WebGL muestra el globo estático y no carga el 3D", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    render(<CollaborationGlobe points={data.team} home={data.home} fallback={fallback} />);

    expect(screen.getByRole("img", { name: "Globo estático" })).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1500));
    expect(screen.queryByTestId("globe-canvas")).not.toBeInTheDocument();
  });

  it("con reduced-motion se queda en el globo estático aunque haya WebGL", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeGl());
    mockMedia({ reduce: true });
    render(<CollaborationGlobe points={data.team} home={data.home} fallback={fallback} />);

    await new Promise((r) => setTimeout(r, 1500));
    expect(screen.queryByTestId("globe-canvas")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Globo estático" })).toBeInTheDocument();
  });
});
