import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Isolated, plain client-only SPA build for GitHub Pages. Deliberately does
// NOT use the tanstackStart/nitro SSR pipeline from vite.config.ts — TanStack
// Start's prerender currently breaks under a non-default `base`
// (https://github.com/TanStack/router/issues/5261), and this app has no
// server-only data/loaders, so a plain client-rendered SPA is both simpler
// and more reliable for a static host with no server runtime.
export default defineConfig({
  base: "/FMEA/",
  css: { transformer: "lightningcss" },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
  },
  build: {
    outDir: "dist-gh-pages",
    rollupOptions: {
      input: `${process.cwd()}/gh-pages.html`,
    },
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    viteReact(),
  ],
});
