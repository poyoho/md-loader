

const componentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gim


export function createHtml2VueRenderFn () {

  return (html: string, data: any) => {
    const components = Array.from(html.matchAll(componentRE)).map(el => el[1])
    console.log(components);
    
  }
}
  