import { createMarkdownRenderer, MarkdownOptions } from "@poyoho/compile-md"
import MarkdownIt from "markdown-it"
import MarkdownItContainer from "markdown-it-container"
import Token from "markdown-it/lib/token"

export function DemoContainer(md: MarkdownIt) {
  // 使用md插件,让md支持 :::demo 语法
  md.use(MarkdownItContainer, "demo", {
    validate(params: string) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: Token[], idx: number) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : ""
        const content = tokens[idx + 1].type === "fence" ? tokens[idx + 1].content : ""
        return `<demo-block>
        ${description ? `<div>${md.render(description)}</div>` : ""}
        <!--element-demo: ${content} :element-demo-->
        `
      }
      return "</demo-block>"
    },
  })
}

export function createMarkdonw2HtmlRenderFn (
  root: string,
  options: MarkdownOptions = {},
) {
  const md = createMarkdownRenderer(root, options)

  md.use(DemoContainer)

  return {
    __data: md.__data,
    render: md.render,
  }
}
