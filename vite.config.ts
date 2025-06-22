import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["chart.js"],
  },
  server: {
    port: 3000,
    host: true,
  },
});
