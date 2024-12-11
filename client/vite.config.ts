import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hämta miljövariabeln för API-URL
const API_URL = process.env.VITE_API_URL || "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_URL, 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
