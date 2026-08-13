import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// dev server proxies /api calls to the backend so the frontend
// can talk to Express without CORS headaches during local dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
