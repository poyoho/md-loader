// markdown-it plugin for wrapping <pre> ... </pre>.
//
// If your plugin was chained before preWrapper, you can add additional element directly.
// If your plugin was chained after preWrapper, you can use these slots:
//   1. <!--beforebegin-->
//   2. <!--afterbegin-->
//   3. <!--beforeend-->
//   4. <!--afterend-->

import MarkdownIt from "markdown-it"

// 代码块添加语言class
export const preWrapperPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const rawCode = fence(...args)
    console.log("preWrapperPlugin", token)
    return `<div slot="highlight"><div class="language-${token.info.trim()}">${rawCode}</div></div>`
  }
}
