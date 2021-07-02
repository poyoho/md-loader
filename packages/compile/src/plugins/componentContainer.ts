import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

const TYPE_MAP = {
  "number": "number",
  "string": "string",
  "object": "object",
  "boolean": "boolean",
}
const OPTION_SPLITE = /\|/

interface Cursor {
  end: number
}

interface ComponentToken {
  prop: string
  type: string
  default: string
  require: string
}

type renderFn = (
  collectText: string,
  collectTextHtml: string
) => [string, boolean]

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

function renderTableCollectText(md: MarkdownIt, defineRules: Record<string, renderFn>) {
  const initRules = Object.assign({}, md.renderer.rules) as Renderer.RenderRuleRecord
  const definedRules = Object.assign({}, md.renderer.rules) as Renderer.RenderRuleRecord
  const UNEXPECT_CHAR = /[ ]/g
  let collectText = [] as string[]
  let collectTextHtml = [] as string[]

  // collect
  ;['code_inline', 'text'].forEach((tokenType: string) => {
    const _cache = initRules[tokenType]!
    definedRules[tokenType] = (token, idx, opts, env, self) => {
      const result = _cache(token, idx, opts, env, self)
      collectText.push(token[idx].content.replace(UNEXPECT_CHAR, ""))
      collectTextHtml.push(result)
      return ""
    }
  })

  // consume
  for (const tokenType in defineRules) {
    const rule = defineRules[tokenType]
    definedRules[tokenType] = () => {
      const [result, clear] = rule(collectText.join(""), collectTextHtml.join(""))
      if (clear) {
        collectText = []
        collectTextHtml = []
      }
      return result
    }
  }

  return (tokens: Token[]) => {
    md.renderer.rules = definedRules
    const html = md.renderer.render(tokens, md.options, {})
    md.renderer.rules = initRules
    return html
  }
}

function formatType (tokenType: string) {
  const maped = TYPE_MAP[tokenType]
  if (maped) {
    return maped
  } else if (OPTION_SPLITE.test(tokenType)) {
    return "option"
  }
}

function genControler (token: ComponentToken) {
  let html = ""
  let options = [] as string[]
  const type = formatType(token.type)
  switch(type) {
    case "number":
      html = `<input type="number" value="${token.default}" />`
      break
    case "string":
      html = `<input type="text" value="${token.default}"/>`
      break
    case "object":
      html = `<textarea>${token.default}</textarea>`
      break
    case "boolean":
      options = ["true", "false"]
      break
    case "option":
      options = token.type.split(OPTION_SPLITE)
      break
  }
  if (options.length) {
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

function genClassName (tokenType: string, value: string) {
  switch (tokenType) {
    case "type":
      return `class="${tokenType}-${formatType(value)}"`
    case "require":
      if (value === "true") {
        return `class="${tokenType}"`
      }
      return ""
  }
  return `class="${tokenType}"`
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
  let thKeys = [] as string[]
  const thResult = renderTableCollectText(md, {
    th_open: () => {
      return ["", false]
    },
    th_close: (collectText, collectTextHtml) => {
      thKeys.push(collectText)
      return [`<th>${collectTextHtml}</th>`, true]
    },
    th_ctrl: () => {
      thKeys = thKeys.filter((token) => (supportTableColumn.includes(token) ? token : ""))
      return ["<th>🛠</th>", true]
    },
  })(theadTokens)

  // table
  let tdKeys = [] as string[]
  let idx = -1
  // <td_open></td_close>...<td_ctrl />
  const lineRenderer = renderTableCollectText(md, {
    td_open: () => {
      return ["", false]
    },
    td_close: (collectText, collectTextHtml) => {
      idx++
      tdKeys.push(collectText)
      if (thKeys[idx]) {
        return [`<td ${genClassName(thKeys[idx], collectText)}>${collectTextHtml}</td>`, true]
      }
      return [`<td>${collectTextHtml}</td>`, true]
    },
    td_ctrl: () => {
      const token = tdKeys.reduce((prev, next, idx)=> {
        const key = thKeys[idx]
        key && (prev[key] = next)
        return prev
      }, {} as ComponentToken)
      // reset
      tdKeys = []
      idx = -1
      const result = genControler(token)
      const isRequire = token.require === "true" ? "require" : ""
      return [
        `<td class="control ${result.type}" key="${token.prop}" ${isRequire}>${result.html}</td>`,
        true
      ]
    }
  })
  const lineResult = [] as string[]
  while(tableTokens.length > tableCursor.end) {
    const trTokens = sliceTokens(tableTokens, "tr_open", "tr_close", tableCursor)
    if (trTokens.length) {
      trTokens.splice(-1, 0, new Token("td_ctrl", "", 0))
      lineResult.push(lineRenderer(trTokens))
    }
  }
  return [
    "<table>",
    thResult,
    "<tbody>",
    lineResult.join(""),
    "</tbody>",
    "</table>"
  ].join("")
}

export function ComponentContainer(
  md: MarkdownIt,
  supportTableColumn = [ 'prop', 'type', 'default', 'require' ]
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
