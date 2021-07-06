import MarkdownIt, { PluginWithParams } from "markdown-it"
import Token from "markdown-it/lib/token"
import container from "markdown-it-container"

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer("tip", "TIP"))
    .use(...createContainer("warning", "WARNING"))
    .use(...createContainer("danger", "DANGER"))
}

type ContainerArgs = [
  PluginWithParams,
  string,
  {
    render(tokens: Token[], idx: number): string
  }
]

function createContainer(klass: string, defaultTitle: string): ContainerArgs {
  return [
    container as PluginWithParams,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx]
        const info = token.info.trim().slice(klass.length).trim()
        if (token.nesting === 1) {
          return `<div class="${klass} custom-block"><p class="custom-block-title">${
            info || defaultTitle
          }</p>\n`
        }
        return `</div>\n`
      }
    }
  ]
}
