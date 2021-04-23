import { UserConfig } from "vite"
import path from "path"
import vueMd from "../src"

const viteConfig: UserConfig = {
  plugins: [
    vueMd()
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    }
  }
}

export default viteConfig
