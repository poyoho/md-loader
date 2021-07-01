import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"
interface Cursor {
  start: number
  end: number
}

interface ComponentToken {
  prop: string
  type: string
  default: string
  require: string
  comment: string
}

function sliceTokens(tokens: Token[], startTokenType: string, endTokenType: string, cursor?: Cursor) {
  const _tokens = cursor ? tokens.slice(cursor.end) : tokens
  const startIdx = _tokens.findIndex(token => token.type === startTokenType)
  const endIdx = _tokens.findIndex(token => token.type === endTokenType) + 1
  if (cursor) {
    const isNotFinded = startIdx === -1 || endIdx === -1
    const lastEnd = cursor.end
    cursor.start = isNotFinded ? tokens.length : lastEnd + startIdx
    cursor.end = isNotFinded ? tokens.length : cursor.start + endIdx
  }
  return _tokens.splice(startIdx, endIdx)
}

type renderFn = (
  keys: string[],
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer
) => string

function renderTableCollectText(md: MarkdownIt, spliteType: string, appendToken: Record<string, renderFn>) {
  const _rules = md.renderer.rules

  let keys = [] as string[]
  let formatedKeys = [] as string[]
  const UNEXPECTED_WORD = /[-_ ]/g

  const collectText = (tokenType: string) => {
    const _cache = _rules[tokenType]!
    md.renderer.rules[tokenType] = (token, idx, opts, env, self) => {
      keys.push(token[idx].content.replace(UNEXPECTED_WORD, ""))
      return _cache(token, idx, opts, env, self)
    }
  }

  ;['code_inline', 'text'].forEach(tokenType => collectText(tokenType))
  md.renderer.rules["splite"] = (token, idx) => {
    keys.push(token[idx].content)
    return ""
  }
  for(const tokenType in appendToken) {
    const rule = appendToken[tokenType]
    md.renderer.rules[tokenType] = (token, idx, opts, env, self) => {
      formatedKeys = keys.join("").split("|")
      keys = [] // clear keys
      return rule(formatedKeys, token, idx, opts, env, self)
    }
  }


  return (tokens: Token[]) => {
    tokens = tokens.reduce((prev, next) => {
      if (next.type === spliteType) {
        const token = new Token("splite", "", 0)
        token.content = "|"
        token.hidden = true
        prev.push(token)
      }
      prev.push(next)
      return prev
    }, [] as Token[])

    const html = md.renderer.render(tokens, md.options, {})
    md.renderer.rules = _rules
    return {
      html,
      keys: formatedKeys
    }
  }
}

function renderHeader(md: MarkdownIt, tokens: Token[], supportTableColumn: string[]) {
  const res = renderTableCollectText(md, "th_close", {
    th_ctrl: () => {
      return "<th>🛠</th>"
    }
  })(tokens)
  return {
    ...res,
    keys: res.keys.map((key => (supportTableColumn.includes(key) ? key : "")))
  }
}

function renderControler(token: ComponentToken): string {
  switch(token.type) {
    case "number":
      return `<input type="number" />`
    case "string":
      return `<input type="text" />`
    case "boolean":
      return `<input text="boolean" />`
    case "option":
      return `<input type="option" />`
    default:
      return ""
  }
}

function renderLineser(md: MarkdownIt, thKeys: string[]) {
  return renderTableCollectText(md, "td_close", {
    td_ctrl: (formatedKeys) => {
      const token = formatedKeys.reduce((prev, next, idx)=> {
        const key = thKeys[idx]
        key && (prev[key] = next)
        return prev
      }, {} as ComponentToken)
      return `<td>${renderControler(token)}</td>`
    }
  })
}

function renderTable(
  md: MarkdownIt,
  tableTokens: Token[],
  supportTableColumn: string[]
) {
  const tableCursor = {start: 0, end: 0}
  // table header
  const threadTokens = sliceTokens(tableTokens, "thead_open", "thead_close", tableCursor)
  // <thead><tr> (insert in this) </tr></thead>
  threadTokens.splice(-3, 0, new Token("th_ctrl", "", 0))
  const thResult = renderHeader(
    md,
    threadTokens,
    supportTableColumn
  )

  // table
  const lineResult = [] as string[]
  const lineRenderer = renderLineser(md, thResult.keys)
  while(tableTokens.length > tableCursor.end) {
    const trTokens = sliceTokens(tableTokens, "tr_open", "tr_close", tableCursor)
    if (trTokens.length) {
      trTokens.splice(-1, 0, new Token("td_ctrl", "", 0))
      lineResult.push(lineRenderer(trTokens).html)
    }
  }
  return [
    "<table>",
    thResult.html,
    lineResult.join(""),
    "</table>"
  ].join("")
}

export function ComponentContainer(
  md: MarkdownIt,
  supportTableColumn = [ 'prop', 'type', 'default', 'require', 'comment' ]
) {
  md.renderer.rules.component_container_block = () => ""
  // :::component container
  md.use(MarkdownItContainer, "component", {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(
          idx,
          tokens.findIndex(token => token.type === "container_component_close")
        )
        const tableTokens = sliceTokens(currentTokens, "table_open", "table_close")
        const table = renderTable(md, tableTokens, supportTableColumn)
        tableTokens.forEach(token => token.type = 'component_container_block')
        return [
          `<div class="component-block">`,
          table,
        ].join("")
      }
      return "</div>"
    },
  })
}
