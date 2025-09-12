import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/alarms": {
        target: "http://alarm-service:8080",
        changeOrigin: true,
      },
      "/api/customers": {
        target: "http://customer-service:8080",
        changeOrigin: true,
      },
      "/api/tickets": {
        target: "http://ticket-service:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "build",
  },
});
