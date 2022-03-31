const demoComponentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm
const cache = new Map<string, Map<string, string>>()

export function createHtml2VueRenderFn() {
  return {
    render: (html: string, filename: string) => {
      let demoCount = 0
      const imports: string[] = []
      const components = new Map<string, string>()
      const template = html
        .replace(demoComponentRE, (_, s) => {
          demoCount++
          components.set(`DemoComponent${demoCount}`, s)
          imports.push(`DemoComponent${demoCount}`)
          return `<DemoComponent${demoCount} />`
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
