import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    css: false,
    // Los componentes con import diferido (cmdk, Sheet, globo) pueden tardar más de 5 s en frío
    // cuando corren todas las suites en paralelo.
    testTimeout: 15_000,
    // next-intl importa `next/navigation` sin extensión; Vite debe procesarlo para resolverlo.
    server: { deps: { inline: ["next-intl"] } },
  },
});
