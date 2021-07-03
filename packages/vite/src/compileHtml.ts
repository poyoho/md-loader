const demoComponentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm
const componentRE = /(\bcomponentBlock\b)|<!--component-prop: ([\S\s]+?) :component-prop-->/gm

export function createHtml2VueRenderFn() {
  const cache = new Map<string, Map<string, string>>()
  return {
    render: (html: string, filename: string) => {
      let demoCount = 0, componentCount = -1
      const imports: string[] = []
      const exposeProps: string[] = []
      const defineSetup: string[] = []
      const onMounted: string[] = []
      const components = new Map<string, string>()
      const template = html
        .replace(demoComponentRE, (_, s) => {
          demoCount++
          components.set(`DemoComponent${demoCount}`, s)
          imports.push(`DemoComponent${demoCount}`)
          return `<DemoComponent${demoCount} />`
        })
        .replace(componentRE, (_, s, s2) => {
          const num = ++componentCount % 2 ? componentCount - 1 : componentCount
          if (["componentBlock"].includes(s)) {
            defineSetup.push(`    const componentBlock${num} = ref()`)
            exposeProps.push(`componentBlock${num}`)
            return `${s}${num}`
          }
          console.log(s2)
          const propName = `componentProps${num}`
          defineSetup.push(`    const componentProps${num} = reactive(${s2})`)
          onMounted.push(`      _PCI(componentBlock${num}.value, {props: componentProps${num}})`)
          exposeProps.push(propName)
          return propName
        })
      const fileNoExtname = filename.substring(0, filename.lastIndexOf(".md"))
      // 不能发单一文件的请求 让vue hmr保存成多个文件
      const hoistedImport = imports.map(component => `import ${component} from "${fileNoExtname}_${component}.md";`)
      const vuePage = [
        `<template><div>${template}</div></template>`,
        `<script>`,
        `import { provideComponentInstance as _PCI } from "@poyoho/md-loader-components"`,
        `import { reactive, ref, onMounted } from "vue"`,
        hoistedImport.join("\n"),
        `export default {`,
        `  components: { ${imports.join(", ")} },`,
        `  setup() {`,
        defineSetup.join("\n"),
        `    onMounted(() => {`,
        onMounted.join("\n"),
        `    })`,
        `    return { ${exposeProps.join(",")} }`,
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
