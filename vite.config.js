import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/scores-ws": {
        target: "ws://localhost:3000",
        ws: true,
      },
      "/api": "http://localhost:3000",
    },
  },
});
