const demoComponentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm
const componentRE = /(\bcomponentBlock\b)|<!--prop: ([\S\s]+?) :prop-->|<!--emit: ([\S\s]+?) :emit-->/gm

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
      defineSetup.push("    let _cb = () => {}")
      const template = html
        .replace(demoComponentRE, (_, s) => {
          demoCount++
          components.set(`DemoComponent${demoCount}`, s)
          imports.push(`DemoComponent${demoCount}`)
          return `<DemoComponent${demoCount} />`
        })
        .replace(componentRE, (_, block, prop, emit) => {
          const num = ++componentCount % 3 ? Math.floor(componentCount / 3) : componentCount
          if (block) {
            defineSetup.push(`    const componentBlock${num} = ref()`)
            exposeProps.push(`componentBlock${num}`)
            return `${block}${num}`
          } else if (prop) {
            const propName = `componentProps${num}`
            defineSetup.push(`    const componentProps${num} = reactive(${prop})`)
            exposeProps.push(propName)
            return propName
          } else if (emit) {
            const propName = `componentEmit${num}`
            defineSetup.push(`    const componentEmit${num} = ${emit}`)
            // eslint-disable-next-line max-len
            onMounted.push(`      _PCI(componentBlock${num}.value, {props:componentProps${num}, subscribe: (cb) => (_cb=cb)})`)
            exposeProps.push(propName)
            return propName
          }
          return ""
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
