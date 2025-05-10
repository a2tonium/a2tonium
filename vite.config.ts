import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ command }) => ({
  plugins: [react(), nodePolyfills()],
  base: command === "serve" ? "/" : "/a2tonium/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      buffer: "buffer",
      process: "process/browser",
    },
  },
  define: {
    global: "globalThis", // helps some packages expecting 'global'
  },
}));
