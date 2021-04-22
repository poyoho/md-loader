const componentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm


export function createHtml2VueRenderFn () {
  const cache = new Map<string, Map<string, string>>()
  return {
    render: (html: string, filename: string) => {
      let count = 0
      const imports = []
      const components = new Map<string, string>();
      const template = html.replace(componentRE, (_, s) => {
        count++
        components.set(`DemoComponent${count}`, s)
        imports.push(`DemoComponent${count}`)
        return `<DemoComponent${count} />`
      })
      cache.set(filename, components)
      const hoistedImport = imports.map(component => `import ${component} from "${filename}?component=${component}";`)
      const vuePage = [
        `<template><div>${template}</div></template>`,
        `<script>`,
        hoistedImport.join("\n"),
        `export default {`,
        `  components: { ${imports.join(", ")} }`,
        `}`,
        `</script>`
      ].join("\n")
      return vuePage
    },
    component: ( filename: string, componentName: string) => {
      return cache.get(filename).get(componentName)
    }
  }
}