import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Config de testes (Fase 9). Separado do Next.js: os testes rodam sob Vite/jsdom,
// não sob o Turbopack do `next dev`/`next build` — por isso os plugins de alias
// (`vite-tsconfig-paths`, para o `@/*` do tsconfig.json) e de React precisam ser
// declarados aqui de novo.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/**", // páginas: cobertas pelo fluxo manual (README/DEVELOPMENT.md), não por unit test
        "src/**/*.d.ts",
      ],
    },
  },
});
