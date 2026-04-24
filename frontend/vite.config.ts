import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react({
      include: [/\.tsx?$/, /shared\/.*\.ts$/],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },


  },
  server: {
    fs: {
      allow: [".."],
    },
  },
})

