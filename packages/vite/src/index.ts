import { createMarkdownRenderer } from "@poyoho/md-loader-compile"
import createVuePlugin, { Options } from "@vitejs/plugin-vue"
import path from "path"
import { Plugin } from "vite"

import { createHtml2VueRenderFn } from "./compileHtml"
import { parseRequest } from "./query"

function slash(p: string): string {
  return p.replace(/\\/g, "/")
}

interface VueMarkdownOptions {
  vueCompile?: Options
}

export default function createVueMarkDownPlugin(opts: VueMarkdownOptions = {}) {
  let root = ""
  const md = createMarkdownRenderer(__dirname, {
    modules: {
      demo: true,
      component: true,
      snippet: true
    }
  })
  const template = createHtml2VueRenderFn()
  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
    ...opts.vueCompile
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
      if (!query.component) {
        // console.log("transform", filename, query, id);
        const html = md.render(code)
        return template.render(html.html, filename)
      }
    },

    // sub-part requests (*.component.) as virtual modules
    resolveId(id) {
      const { query } = parseRequest(id)
      // console.log("resolveId", id, filename)
      if (query.component && !query.vue) { // pass query vue
        return id
      }
    },

    // load virtual modules
    load (id) {
      // console.log("load", id);
      const { filename, query } = parseRequest(id)
      if (query.component && !query.vue) { // pass query vue
        // because there is no real file, add use the config root path
        const virtualPath = slash(filename.includes(root) ? filename : path.join(root, filename))
        // console.log("load", virtualPath, query);
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
