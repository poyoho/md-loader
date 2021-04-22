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

    // transform markdown to vue template
    transform (code, id) {
      const { filename, query } = parseRequest(id)
      if (!query.component && !/\.md$/.test(id)) {
        return
      }
      if (!query.component) {
        console.log("transform", id);
        const html = md.render(code)
        const vue = template.render(html.html, filename)
        return vue
      } else {
        return template.component(filename, query.component)
      }
    },

    // sub-part requests (*?component) as virtual modules
    async resolveId(id) {
      if (parseRequest(id).query.component) {
        return id
      }
    },

    // load virtual modules
    load (id) {
      const { filename, query } = parseRequest(id)
      if (query.component) {
        return template.component(filename, query.component)
      }
    },

    // hmr
    async handleHotUpdate (ctx) {
      const { file, read, server } = ctx
      console.log("handleHotUpdate", file)
      if (file.endsWith(".md")) {
        const code = await read()
        const html = md.render(code)
        const vue = template.render(html.html, file)
        return vuePlugin.handleHotUpdate!({
          ...ctx,
          read: () => vue
        })
      }
    },
  }

  return [mdPlugin, vuePlugin]
}
