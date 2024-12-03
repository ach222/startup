import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/api/ws": {
        target: "ws://localhost:3000/api/ws",
        ws: true,
      },
    },
  },
});
