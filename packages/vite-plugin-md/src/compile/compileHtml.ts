const componentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm


export function createHtml2VueRenderFn () {
  const cache = new Map<string, Map<string, string>>()
  return {
    render: (html: string, filename: string) => {
      let count = 0
      const imports: string[] = []
      const components = new Map<string, string>()
      const template = html.replace(componentRE, (_, s) => {
        count++
        components.set(`DemoComponent${count}`, s)
        imports.push(`DemoComponent${count}`)
        return `<DemoComponent${count} />`
      })
      const fileNoExtname = filename.substring(0, filename.lastIndexOf(".md"))
      // 不能发单一文件的请求 让vue hmr保存成多个文件
      const hoistedImport = imports.map(component => `import ${component} from "${fileNoExtname}_${component}.md";`)
      const vuePage = [
        `<template><div>${template}</div></template>`,
        `<script>`,
        hoistedImport.join("\n"),
        `export default {`,
        `  components: { ${imports.join(", ")} }`,
        `}`,
        `</script>`
      ].join("\n")
      components.set(`DemoComponent0`, vuePage)
      cache.set(filename, components)
      return vuePage
    },
    component: (filename: string, componentName: string) => {
      return cache.get(filename)!.get(componentName)
    }
  }
}
