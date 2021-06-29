import vueMd from "@poyoho/md-loader-vite"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    vueMd({
      vueCompile: {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === "demo-block"
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    }
  }
})

