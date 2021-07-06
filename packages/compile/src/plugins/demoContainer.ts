import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

export function DemoContainer(md: MarkdownIt, supportLanguage: string[] = ["vue", "react"]) {
  md.renderer.rules.demo_container_block = () => ""
  // :::demo container
  md.use(MarkdownItContainer, "demo", {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(idx+1, tokens.findIndex(token => token.type === "container_demo_close"))

        const descTokens = [] as Token[]
        let fence = null as Token | null
        for(const token of currentTokens) {
          if (
            token.type === "fence"
            && !fence
            && supportLanguage.includes(token.info.trim())
          ) {
            fence = token
          } else {
            descTokens.push(token)
          }
        }

        let content = ""
        if (fence) {
          const token = fence
          content = token.content
          token.info += " component" // highlight using fence
        }
        const desc = md.renderer.render(descTokens, md.options, {})
        // after render make the descript tokens don't render again
        descTokens.forEach(token => (token.type = "demo_container_block"))
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
