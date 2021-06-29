import vueMd from "@poyoho/md-loader-vite"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    vueMd()
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    }
  }
})

