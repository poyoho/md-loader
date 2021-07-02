import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"
interface Cursor {
  end: number
}

interface ComponentToken {
  prop: string
  type: string
  default: string
  require: string
}

function sliceTokens(tokens: Token[], startTokenType: string, endTokenType: string, cursor?: Cursor) {
  const _tokens = cursor ? tokens.slice(cursor.end + 1) : tokens
  const startIdx = _tokens.findIndex(token => token.type === startTokenType)
  const endIdx = _tokens.findIndex(token => token.type === endTokenType)
  if (cursor) {
    const isNotFinded = startIdx === -1 || endIdx === -1
    cursor.end = isNotFinded ? tokens.length : cursor.end + 1 + endIdx
  }
  return _tokens.slice(startIdx, endIdx + 1) // startTokenType ~ endTokenType
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
  md.renderer.rules["splite"] = () => {
    formatedKeys.push(keys.join(""))
    keys = []
    return ""
  }
  for(const tokenType in appendToken) {
    const rule = appendToken[tokenType]
    md.renderer.rules[tokenType] = (token, idx, opts, env, self) => {
      const result = rule(formatedKeys, token, idx, opts, env, self)
      keys = [] // clear keys
      formatedKeys = []
      return result
    }
  }


  return (tokens: Token[]) => {
    tokens = tokens.reduce((prev, next) => {
      if (next.type === spliteType) {
        prev.push(new Token("splite", "", 0))
      }
      prev.push(next)
      return prev
    }, [] as Token[])

    const html = md.renderer.render(tokens, md.options, {})
    md.renderer.rules = _rules
    return html
  }
}

function renderHeader(md: MarkdownIt, tokens: Token[], supportTableColumn: string[]) {
  let _thKeys = [] as string[]
  const res = renderTableCollectText(md, "th_close", {
    th_ctrl: (thKeys) => {
      _thKeys = thKeys
      return "<th>🛠</th>"
    }
  })(tokens)
  return {
    html: res,
    keys: _thKeys.map(key => (supportTableColumn.includes(key) ? key : ""))
  }
}

function renderControler(token: ComponentToken) {
  let html = ""
  let type = ""
  switch(token.type) {
    case "number":
      html = `<input type="number" value="${token.default}" />`
      type = "number"
      break
    case "string":
      html = `<input type="text" value="${token.default}"/>`
      type = "string"
      break
    case "object":
      html = `<textarea>${token.default}</textarea>`
      type = "object"
      break
  }
  // a|b|c => option
  if (/\|/.test(token.type) || token.type === "boolean") {
    let options = ["true", "false"]
    type = "boolean"
    if (token.type !== "boolean") {
      type = "option"
      options = token.type.split("|", -1)
    }
    html = `<select>${options.map(key => {
      if (token.default === key) {
        return `<option value="${key}" selected="selected">${key}</option>`
      }
      return `<option value="${key}">${key}</option>`
    }).join("")}</select>`
  }
  return {
    html,
    type
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
      const result = renderControler(token)
      return `<td class="control ${result.type}" key="${token.prop}" require="${token.require}">${result.html}</td>`
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
  const theadTokens = sliceTokens(tableTokens, "thead_open", "thead_close", tableCursor)
  // <thead><tr> (insert in this) </tr></thead>
  theadTokens.splice(-2, 0, new Token("th_ctrl", "", 0))
  const thResult = renderHeader(
    md,
    theadTokens,
    supportTableColumn
  )


  // table
  const lineResult = [] as string[]
  const lineRenderer = renderLineser(md, thResult.keys)
  while(tableTokens.length > tableCursor.end) {
    const trTokens = sliceTokens(tableTokens, "tr_open", "tr_close", tableCursor)
    if (trTokens.length) {
      trTokens.splice(-1, 0, new Token("td_ctrl", "", 0))
      lineResult.push(lineRenderer(trTokens))
    }
  }
  return [
    "<table>",
    thResult.html,
    "<tbody>",
    lineResult.join(""),
    "</tbody>",
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
