import { compileStyle, compileTemplate } from "@vue/compiler-sfc" 
import hash from "hash-sum"
import { ViteDevServer } from "vite";

export interface Options {
  devServer?: ViteDevServer;
}

type PreprocessLang = "less" | "sass" | "scss" | "styl" | "stylus";

/**
 * 提交文本中script部分
 * @param content
 */
export function stripScript(content: string):string {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ""
}

/**
 * 提交文本中style部分
 * @param content
 */
export function stripStyle(content: string): {
  lang: PreprocessLang,
  code: string
} {
  const result = content.match(/<(style)\s*(lang="(less|sass|scss|styl|stylus)")?>([\s\S]+)<\/\1>/)
  return {
    lang: (result && result[3] ? result[3].trim() : "") as PreprocessLang,
    code: (result && result[4] ? result[4].trim() : "") 
  }
}

export function stripTemplate(content: string):string {
  content = content.trim()
  if (!content) {
    return content
  }
  // 编写例子时不一定有 template, 采取的方案是剔除其他的内容
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, "").trim()
}

/**
 * 导入包
*/
interface imports {
  code: string;
  imports: Record<string, Array<string>>;
}

/** 
 * 获取导入包并删除原来代码中的导入包
*/
function getImport(code: string): imports {
  // 提取import
  const imports: Record<string, Array<string>> = {}
  code = code.replace(/import {(.*)} from ['"](.*)['"]+?[;\n\s]/g, (s, s1, s2) => {
    const pkgs = s1.split(",").map((s: string) => s.trim());
    if(imports[s2]){
      imports[s2] = imports[s2].concat(pkgs)
    } else {
      imports[s2] = pkgs
    }
    return ""
  })
  return {
    code,
    imports,
  }
}

/**
 * 合并导入包
*/
function rewriteImports(imports: imports["imports"]) {
  return Object.keys(imports).map(k => {
    const pkg = Array.from(new Set(imports[k])).join(", ")
    return `import {${pkg}} from "${k}";`
  }).join("\n")
}

function _compileStyle(
  path: string,
  opts: Options,
  scopeId: string,
  style: string,
  styleLang?: PreprocessLang
) {
  const { devServer } = opts

  if (style) {
    const compiledStyle = compileStyle({
      source: style!,
      filename: path,
      id: scopeId+"-s",
      scoped: true,
      preprocessLang: styleLang,
    })
    if(devServer) {
      style = [
        `const id = "${path}?scope=${scopeId}"`,
        `import.meta.hot = __vite__createHotContext(id);`,
        `const css = ${JSON.stringify(compiledStyle.code)}`,
        `updateStyle(id, css)`,
        `import.meta.hot.accept()`,
        `import.meta.hot.prune(() => removeStyle(id))`
      ].join("\n")
    } else {
      style = [
        `let e=document.createElement("style");`,
        `const css = ${JSON.stringify(compiledStyle.code)}`,
        `e.innerHTML=css`,
        `document.head.appendChild(e);`,
      ].join("\n")
    }
  }
  return style
}

function _compileTemplate(path: string, source: string) {
  const compiled = compileTemplate({
    source: source,
    filename: path,
    id: path,
    transformAssetUrls: false,
  })

  let template = compiled.code.replace("export function render", "function render")
  return template
}

function _compileScript(path: string, script: string) {
  script = script.trim()
  if (script) {
    script = script
      .replace(/export\s+default/, "const democomponentExport =")
  } else {
    script = "const democomponentExport = {}"
  }
  return script
}

export function genInlineComponentText(
  path: string,
  opts: Options,
  template: string,
  script: string,
  style: string = "",
  styleLang?: PreprocessLang,
  genFun = false ) {

  const { devServer } = opts
    
  const scopeId = hash(path+template+script+style)
  template = _compileTemplate(path, template)
  style = _compileStyle(path, opts, scopeId, style, styleLang)
  script = _compileScript(path, script)

  if(genFun) {
    // 函数式组件
    return template = `(function() {
      ${template}
      ${script}
      ${style}
      return {
        render,
        __scopeId: "data-v-${scopeId}",
        ...democomponentExport
      }
    })()`
  }

  // 按照 element-demo${count} 分割script
  let scripts = script.split("element-demo")
  scripts.shift()
  scripts = scripts.map(script => script.replace(/\d: ([\s\S]+),/, (s, s1)=> s1))

  // 总页面编译成js
  template = template.replace(/_component_element_demo\d+ = (.*)/g, (s, s1) => {
    // 组件名称
    const componentName = s1.match(/_resolveComponent\(\"(.*)\"\)/)[1]
    // 引用vue代码
    const functionComponent = scripts[componentName.match(/\d+/)[0]!] // 匹配代码

    return s.replace(s1, functionComponent)
  })
  const compileTemplate = getImport(template)
  // 返回渲染函数
  return [
    devServer && `import { updateStyle, removeStyle } from "/@vite/client";`,
    `${rewriteImports(compileTemplate.imports)}`,
    compileTemplate.code,
    `const __script = { render };`,
    `export default __script;`
  ].join("\n")
  
}

export function render (path: string, content: string, opts: Options): string {
  const startTag = "<!--element-demo:";
  const startTagLen = startTag.length;
  const endTag = ":element-demo-->";
  const endTagLen = endTag.length;

  let componenetsString = "";
  let id = 0; // demo 的 id
  const output = []; // 输出的内容
  let start = 0; // 字符串开始位置

  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  while (commentStart !== -1 && commentEnd !== -1) {
    output.push(content.slice(start, commentStart));

    const commentContent = content.slice(
      commentStart + startTagLen,
      commentEnd
    );
    // 获取 <template> <script>
    const html = stripTemplate(commentContent);
    const script = stripScript(commentContent);
    const style = stripStyle(commentContent);
    const demoComponentContent = genInlineComponentText(path, opts, html, script, style.code, style.lang, true);
    const demoComponentName = `element-demo${id}`;
    // 生成函数式组件 渲染代码块的组件
    output.push(`<template #source><${demoComponentName} /></template>`);
    componenetsString += `${demoComponentName}: ${demoComponentContent},`;

    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }

  output.push(content.slice(start));
  const pageTemplate = `
  <template>
    <section class="content element-doc">
    ${output.join("")}
    </section>
  </template>`
  return genInlineComponentText(path, opts, pageTemplate, componenetsString)
}