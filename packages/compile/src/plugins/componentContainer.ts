import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

export function ComponentContainer(md: MarkdownIt) {
  md.renderer.rules.component_container_block = () => ""
  // :::component container
  md.use(MarkdownItContainer, "component", {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(idx+1, tokens.findIndex(token => token.type === "container_component_close"))

        console.log(currentTokens)

        return [
          `<div>`,
        ].join("\n")
      }
      return "</div>"
    },
  })
}
