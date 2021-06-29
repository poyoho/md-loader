import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

export function DemoContainer(md: MarkdownIt, supportLanguage: string[] = ["vue", "react"]) {
  // 使用md插件,让md支持 :::demo 语法
  md.use(MarkdownItContainer, "demo", {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(idx+1, tokens.findIndex(token => token.type === "container_demo_close"))
        const groupedToken = currentTokens.reduce((prev, token) => {
          if(token.type === "fence") {
            const info = token.info.trim()
            if (supportLanguage.includes(info)) {
              prev.fence.push(token)
            } else {
              prev.desc.push(token)
            }
          } else {
            prev.desc.push(token)
          }
          return prev
        }, {
          fence: [] as Token[],
          desc: [] as Token[]
        })
        // TODO delete rendered tokens
        console.log("DemoContainer")
        let content = ""
        if (groupedToken.fence.length !== 0) {
          const token = groupedToken.fence[0]
          content = token.content
          token.info += " component" // highlight using fence
        }
        const desc = md.renderer.render(groupedToken.desc, md.options, {})
        return [
          `<demo-block>`,
          ` ${desc ? `<div slot="description">${desc}</div>` : ""}`,
          ` <div slot="exec"><!--element-demo: ${content} :element-demo--></div>`
        ].join("\n")
      }
      return "</demo-block>"
    },
  })
}
