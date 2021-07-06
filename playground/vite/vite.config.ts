import vueMd from "@poyoho/md-loader-vite"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    vueMd({
      vueCompile: {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ["demo-block", "component-block"].includes(tag)
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

