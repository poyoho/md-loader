import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

// eslint-disable-next-line no-useless-escape
const HTML_OPEN_CLOSE_TAG_RE = /<[A-Za-z][A-Za-z0-9\-]*\s*\/?>|<\/[A-Za-z][A-Za-z0-9\-]*\s*>/gm

interface Cursor {
  start: number
  end: number
}

function sliceTokens(tokens: Token[], startTokenType: string, endTokenType: string, cursor?: Cursor) {
  const _tokens = cursor ? tokens.slice(cursor.end) : tokens
  console.log(cursor)
  console.log(_tokens.length)
  const startIdx = _tokens.findIndex(token => token.type === startTokenType)
  const endIdx = _tokens.findIndex(token => token.type === endTokenType)
  cursor && (cursor.start = startIdx)
  cursor && (cursor.end = endIdx)
  return _tokens.splice(startIdx, endIdx)
}

function filterTokens(tokens: Token[], type: string) {
  return tokens.filter(token => token.type === type)
}

export function ComponentContainer(
  md: MarkdownIt,
  supportTableColumn = [ 'prop', 'type', 'default', 'require', 'comment' ]
) {
  const render = (tokens: Token[]) => md.renderer.render(tokens, md.options, {})
  md.renderer.rules.component_container_block = () => ""
  // :::component container
  md.use(MarkdownItContainer, "component", {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(idx+1, tokens.findIndex(token => token.type === "container_component_close"))
        const tableTokens = sliceTokens(currentTokens, "table_open", "table_close")
        const tableCursor = {start: 0, end: 0}

        // table header
        const theadTokens = render(sliceTokens(tableTokens, "thead_open", "thead_close", tableCursor))
          .replace(HTML_OPEN_CLOSE_TAG_RE, "")
          .replace(/[ \f\r\t\v]/g, "")
          .split("\n")
          .filter(Boolean)
          .map((col) => (supportTableColumn.includes(col) ? col : ""))
        // console.log("theadTokens", theadTokens)
        // table
        const tr = sliceTokens(tableTokens,"tr_open", "tr_close", tableCursor)
        console.log("tr", render(tr))
        const tr2 = sliceTokens(tableTokens,"tr_open", "tr_close", tableCursor)
        console.log("tr2", render(tr2))
        return [
          "<div>",
        ].join("\n")
      }
      return "</div>"
    },
  })
}
