import { Plugin, ViteDevServer } from "vite"
import { createMarkdonwToVueRenderFn } from "./md2vue"

export interface Options {
  devServer?: ViteDevServer;
}

function parseId(id: string) {
  const index = id.indexOf("?")
  if (index < 0)
    return id
  else
    return id.slice(0, index)
}

export default function createVueMarkDownPlugin(root: string): Plugin {
  let options: Options = {
    devServer: undefined
  }
      
  return {
    name: "vite-loader-md",
    configureServer(server) {
      if(server) {
        options.devServer = server
      }
    },
    transform(raw, id) {
      const path = parseId(id)
      if (!path.endsWith(".md")){
        return raw
      }
      const render = createMarkdonwToVueRenderFn(root, {
        lineNumbers: true
      })

      //   const content = render(path, )
      
      return "renderer(path)"
    },
  }
}
  