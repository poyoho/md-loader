const demoComponentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm
const componentRE = /(\b_componentBlock\b|\b_component\b)/gm


export function createHtml2VueRenderFn() {
  const cache = new Map<string, Map<string, string>>()
  return {
    render: (html: string, filename: string) => {
      let demoCount = 0, componentCount = -1
      const imports: string[] = []
      const components = new Map<string, string>()
      const template = html
        .replace(demoComponentRE, (_, s) => {
          demoCount++
          components.set(`DemoComponent${demoCount}`, s)
          imports.push(`DemoComponent${demoCount}`)
          return `<DemoComponent${demoCount} />`
        })
        .replace(componentRE, (_, s) => {
          const num = ++componentCount % 2 ? componentCount - 1 : componentCount
          return `${s}${num}`
        })
      const fileNoExtname = filename.substring(0, filename.lastIndexOf(".md"))
      // 不能发单一文件的请求 让vue hmr保存成多个文件
      const hoistedImport = imports.map(component => `import ${component} from "${fileNoExtname}_${component}.md";`)
      const vuePage = [
        `<template><div>${template}</div></template>`,
        `<script>`,
        `import { provideComponentInstance as _PCI } from "@poyoho/md-loader-components"`,
        hoistedImport.join("\n"),
        `export default {`,
        `  components: { ${imports.join(", ")} },`,
        `  mounted() {`,
        new Array(componentCount)
          .fill(1)
          .map((_, idx) => `    _PCI(this.$refs._componentBlock${idx}, this.$refs._component${idx})`)
          .join("\n"),
        `  },`,
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
