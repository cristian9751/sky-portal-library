import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src")
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      outDir: "dist/types",
      entryRoot: "src",
      include: [
        "src/index.ts",
        "src/components/ui/**/*.tsx",
        "src/lib/utils.ts",
        "src/hooks/use-mobile.tsx"
      ],
      exclude: ["src/**/*.test.*", "src/**/*.spec.*"]
    })
  ],
  build: {
    lib: {
      entry: resolve(projectRoot, "src/index.ts"),
      name: "SkyPortalComponents",
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "es"
          ? "sky-portal-components.js"
          : "sky-portal-components.cjs",
      cssFileName: "style"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"]
    }
  }
});
