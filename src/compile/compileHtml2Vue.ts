
const componentRE = /<!--element-demo: ([\S\s]+?) :element-demo-->/gm

function hoistedImport() {
  // 提取import
  const imports: Record<string, Array<string>> = {}
  return {
    imports,
    hoisted: (code: string) => {
      return code.replace(/import {(.*)} from "(.*)"?;/g, (_s, s1, s2) => {
        const pkgs = s1.split(",").map((s: string) => s.trim());
        if(imports[s2]){
          imports[s2] = imports[s2].concat(pkgs)
        } else {
          imports[s2] = pkgs
        }
        return ""
      })
    }
  }
}


export function createHtml2VueRenderFn () {

  return (html: string, filename: string) => {
    Array.from(html.matchAll(componentRE)).map(el => el[1]).forEach(component => {
    
    })
  }
}