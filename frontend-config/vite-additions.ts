/**
 * Vite Configuration Additions
 *
 * After running `npm create vite@latest . -- --template react-ts`,
 * add these configurations to your vite.config.ts file.
 *
 * This is NOT a complete vite.config.ts - it shows what to ADD to the generated file.
 */

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Add path alias for clean imports: import { Button } from '@/components/ui/Button'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Add proxy for backend API calls (Django on port 8000)
  server: {
    // Allow all hosts (needed for e2b sandbox preview)
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});

/**
 * Also add to tsconfig.json under "compilerOptions":
 *
 * {
 *   "compilerOptions": {
 *     "baseUrl": ".",
 *     "paths": {
 *       "@/*": ["src/*"]
 *     }
 *   }
 * }
 */

