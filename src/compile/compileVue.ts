import createVuePlugin, { Options as VuePluginOptions } from "@vitejs/plugin-vue"



export function createVueRenderFn (
  root: string,
  options: VuePluginOptions = {},
) {
  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
    ...options
  })
  
  
//   vuePlugin.handleHotUpdate({
//   })
}
  