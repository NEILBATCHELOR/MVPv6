import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import polyfillNode from "rollup-plugin-polyfill-node";

const conditionalPlugins = [];
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["react", "react/jsx-runtime"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [polyfillNode()],
    },
    sourcemap: true,
  },
  plugins: [
    react({
      plugins: [...conditionalPlugins],
    }),
    tempo(),
    polyfillNode(), // Adds Node.js polyfills, fixing `buffer.Buffer` issue
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer", // Explicitly alias `buffer`
      process: "process/browser",
      util: "util",
    },
  },
  define: {
    "process.env": {},
    global: {},
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
