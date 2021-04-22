import { UserConfig } from "vite"
import path from "path"
import vueMd from "../src/vite"

const viteConfig: UserConfig = {
  plugins: [
    vueMd(),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    }
  }
}

export default viteConfig
