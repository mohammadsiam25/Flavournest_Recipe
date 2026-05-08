import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/recipe": "http://localhost:3000",
      "/signUp": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/user": "http://localhost:3000",
      "/images": "http://localhost:3000",
    },
  },
});
