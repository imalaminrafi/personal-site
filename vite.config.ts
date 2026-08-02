import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 2048,
        manualChunks(id: string) {
          const nm = id.split(/node_modules[/\\]+/).pop() || "";
          if (!nm) return undefined;
          const parts = nm.split("/");
          const pkg = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
          if (pkg === "@tanstack/react-query") return "query";
          if (pkg === "react-router" || pkg === "react-router-dom") return "router";
          if (pkg.startsWith("@radix-ui") || pkg === "sonner" || pkg === "class-variance-authority" || pkg === "tailwind-merge" || pkg === "clsx") return "ui";
          if (pkg === "react" || pkg === "react-dom" || pkg === "scheduler" || pkg === "react-is") return "vendor";
          return undefined;
        },
      },
    },
  },
}));
