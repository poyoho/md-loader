import { Plugin } from "vite"
import { parseRequest } from "./query"
import { createMarkdonwRenderFn } from "../compile/compileMd"
import { createHtml2VueRenderFn } from "../compile/compileHtml"
import createVuePlugin from "@vitejs/plugin-vue"
import path from "path"

function slash(p: string): string {
  return p.replace(/\\/g, "/")
}

export default function createVueMarkDownPlugin() {
  let root = ""
  const md = createMarkdonwRenderFn(__dirname)
  const template = createHtml2VueRenderFn()
  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
  })

  const mdPlugin: Plugin = {
    name: "loader-md",

    configResolved(config) {
      root = config.root
    },

    // transform markdown to vue template
    transform (code, id) {
      const { filename, query } = parseRequest(id)
      if (!query.component && !/\.md$/.test(filename)) {
        return
      }
      // console.log("transform", id);
      if (!query.component) {
        const html = md.render(code)
        const vue = template.render(html.html, filename)
        return vue
      }
    },

    // sub-part requests (*.component.) as virtual modules
    resolveId(id) {
      if (parseRequest(id).query.component) {
        // console.log("resolveId", parseRequest(id))
        return id
      }
    },

    // load virtual modules
    load (id) {
      const { filename, query } = parseRequest(id)
      if (query.component) {
        // because there is no real file, add use the config root path
        const virtualPath = slash(filename.includes(root) ? filename : path.join(root, filename))
        // console.log("load", virtualPath);
        return template.component(virtualPath, query.component)
      }
    },

    // TODO 精细化 hmr 对比新旧modules 找出需要render的模块
    // async handleHotUpdate (ctx) {
    //   const { file, read, server, modules } = ctx
    //   console.log("handleHotUpdate", file)
    //   if (file.endsWith(".md")) {
    //     const code = await read()
    //     const html = md.render(code)
    //     const vue = template.render(html.html, file)

    //     return vuePlugin.handleHotUpdate!({
    //       ...ctx,
    //       read: () => vue
    //     })
    //   }
    // },
  }

  return [mdPlugin, vuePlugin]
}
