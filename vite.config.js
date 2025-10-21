import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    // Gzip + Brotli compression (auto serves smallest)
    viteCompression({ algorithm: "brotliCompress" }),
  ],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          framer: ["framer-motion"],
        },
      },
    },
  },
});
