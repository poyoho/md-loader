import { Plugin } from "vite"
import { parseRequest } from "./query"
import { createMarkdonwRenderFn } from "../compile/compileMd"
import { createHtml2VueRenderFn } from "../compile/compileHtml"
import createVuePlugin from "@vitejs/plugin-vue"

export default function createVueMarkDownPlugin() {
  const md = createMarkdonwRenderFn(__dirname)
  const template = createHtml2VueRenderFn()

  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
  })

  const mdPlugin: Plugin = {
    name: "loader-md",

    transform (code, id) {
      const { filename, query } = parseRequest(id)
      if (!query.component && !/\.md$/.test(id)) {
        return
      }
      if (!query.component) {
        console.log("transform");
        const html = md.render(code)
        const vue = template.render(html.html, filename)
        return vue
      } else {
        return template.component(filename, query.component)
      }
    },
  }

  return [mdPlugin, vuePlugin]
}
