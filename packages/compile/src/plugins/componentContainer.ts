import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import MarkdownItContainer from "markdown-it-container"

import { customRenderer, sliceTokens } from "../utils/mockRender"

const TYPE_MAP = {
  "number": "number",
  "string": "string",
  "object": "object",
  "boolean": "boolean",
  "function": "function"
}
const OPTION_SPLITE = /\|/

interface ComponentToken {
  prop: string
  type: string
  default: string
  require: string
}

function formatType(tokenType: string) {
  const maped = TYPE_MAP[tokenType]
  if (maped) {
    return maped
  } else if (OPTION_SPLITE.test(tokenType)) {
    return "option"
  }
}

function genControler(token: ComponentToken) {
  // console.log(token)
  let html = ""
  let options = [] as string[]
  const requireAttr = token.require === "true" ? "required" : ""
  const type = formatType(token.type)
  switch (type) {
    case "number":
      html = `<input ftype="${type}" prop="${token.prop}" type="number" value="${token.default}" ${requireAttr}/>`
      break
    case "string":
      html = `<input ftype="${type}" prop="${token.prop}" type="text" value="${token.default}" ${requireAttr}/>`
      break
    case "object":
      html = `<textarea ftype="${type}" prop="${token.prop}" ${requireAttr}>${token.default}</textarea>`
      break
    case "boolean":
      options = ["true", "false"]
      break
    case "option":
      options = token.type.replace(/['"]/g, "").split(OPTION_SPLITE)
      break
    case "function":
      html = `<div ftype="${type}" prop="${token.prop}"></div>`
      break
  }
  if (options.length) {
    const dtype = type === "option" ? `dtype="${token.type.replace(/"/g, "'")}"` : ""
    html = `<select ftype="${type}" ${dtype} prop="${token.prop}" ${requireAttr}>${options.map(key => {
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

function genClassName(tokenType: string, value: string) {
  switch (tokenType) {
    case "type":
      return `class="${tokenType}-${formatType(value)}"`
    case "require":
      if (value === "true") {
        return `class="${tokenType}"`
      }
      return `class="no-require"`
    case "default":
      if (value === "true") {
        return `class="require"`
      } else if (value === "false") {
        return `class="no-require"`
      }
      return ""
  }
  return `class="${tokenType}"`
}

function genPropsDefaultValue(token: ComponentToken) {
  let val = `"${token.default}"`
  if (["number", "boolean", "object"].includes(token.type)) {
    val = token.default
  } else if (OPTION_SPLITE.test(token.type)) {
    val = token.type
      .replace("'", "\"")
      .match(new RegExp(`"*${token.default}"*`)) as any || '""'
  }
  return `"${token.prop}"` + ":" + val + ","
}

function genEmitDefaultValue(token: ComponentToken) {
  return `"${token.prop}"` + ":" + `(...args) => {console.log("${token.prop}", ...args); _cb("${token.prop}")}` + ","
}

function renderTable(
  md: MarkdownIt,
  tableTokens: Token[],
  supportTableColumn: string[]
) {
  let thKeys: string[] = []
  let tdKeys: string[] = []
  let collectText: string[] = []
  let defaultValueStr = ""
  let defaultEmitStr = ""
  const UNEXPECT_CHAR = /[ ]/g
  let idx = 0
  const renderer = customRenderer(md, {
    // collect text
    code_inline: (defaultResult, token, idx) => {
      collectText.push(token[idx].content.replace(UNEXPECT_CHAR, ""))
      return defaultResult()
    },
    text: (defaultResult, token, idx) => {
      collectText.push(token[idx].content.replace(UNEXPECT_CHAR, ""))
      return defaultResult()
    },
    // thead
    th_close: (defaultResult) => {
      const key = collectText.join("")
      if (key === "default/params") {
        thKeys.push("default")
      } else {
        thKeys.push(key)
      }
      collectText = []
      return defaultResult()
    },
    th_ctrl: () => {
      thKeys = thKeys.filter((token) => (supportTableColumn.includes(token) ? token : ""))
      return "<th>🛠</th>"
    },
    // td
    td_open: () => {
      renderer.collectStart()
      return ""
    },
    td_close: () => {
      const sliceResult = renderer.collectEnd()
      const text = collectText.join("")
      tdKeys.push(text)
      collectText = []
      if (thKeys[idx]) {
        return `<td><div ${genClassName(thKeys[idx++], text)}>${sliceResult}</div></td>`
      }
      return "<td>" + sliceResult + "</td>"
    },
    td_ctrl: () => {
      const token = tdKeys.reduce((prev, next, idx) => {
        const key = thKeys[idx]
        key && (prev[key] = next)
        return prev
      }, {} as ComponentToken)
      // reset
      tdKeys = []
      idx = 0
      const result = genControler(token)
      if (token.require === "true") {
        defaultValueStr += genPropsDefaultValue(token)
      } else if ( token.type === "function") {
        defaultEmitStr += genEmitDefaultValue(token)
      }
      return `<td class="control">${result.html}</td>`
    }
  })

  const tableCursor = { end: 0 }
  // table header
  const theadTokens = sliceTokens(tableTokens, "thead_open", "thead_close", tableCursor)
  // <thead><tr> (insert in this) </tr></thead>
  theadTokens.splice(-2, 0, new Token("th_ctrl", "", 0))
  const thResult = renderer.render(theadTokens)

  const lineResult = [] as string[]
  while (tableTokens.length > tableCursor.end) {
    const trTokens = sliceTokens(tableTokens, "tr_open", "tr_close", tableCursor)
    if (trTokens.length) {
      // <td_open></td_close>...<td_ctrl />
      trTokens.splice(-1, 0, new Token("td_ctrl", "", 0))
      lineResult.push(renderer.render(trTokens))
    }
  }
  return {
    html: [
      `<table slot="descript" class="descript">`,
      thResult,
      "<tbody>",
      lineResult.join(""),
      "</tbody>",
      "</table>"
    ].join(""),
    defaultValueStr: `{${defaultValueStr.slice(0, defaultValueStr.length - 1)}}`,
    defaultEmitStr: `{${defaultEmitStr.slice(0, defaultEmitStr.length - 1)}}`
  }
}

function renderComponent(
  md: MarkdownIt,
  componentName: string,
  bindProps: string,
  bindEmits: string,
  defineToken?: Token
) {
  let component = ""
  let define: Token
  // eslint-disable-next-line max-len
  const tag = `<${componentName} `
    + `v-bind='<!--prop: ${bindProps} :prop-->' `
    + `v-on='<!--emit: ${bindEmits} :emit-->'`
  if (defineToken) {
    defineToken.content = defineToken.content.replace(new RegExp(`<${componentName}.*>`), `<${componentName}>`)
    define = defineToken
    component = defineToken.content.replace( `<${componentName}`, tag)
  } else {
    define = new Token("fence", "", 0)
    define.info = "html"
    define.content = `<${componentName} />`
    component = tag + '/>'
  }
  return {
    define: md.renderer.render([define], md.options, {}),
    component,
  }
}

export function ComponentContainer(
  md: MarkdownIt,
  supportTableColumn = ['prop', 'type', 'default', 'require']
) {
  let componentName = "component-block"
  md.renderer.rules.component_container_block = () => ""
  // :::component container
  md.use(MarkdownItContainer, "component", {
    validate(params: string) {
      componentName = params.replace(/\bcomponent\b\s+/, "").trim()
      return true
    },
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const currentTokens = tokens.slice(
          idx,
          tokens.findIndex(token => token.type === "container_component_close")
        )
        const tableTokens = sliceTokens(currentTokens, "table_open", "table_close")
        const table = renderTable(md, tableTokens, supportTableColumn)
        // console.log("defaultValueStr", table.defaultValueStr)
        const component = renderComponent(
          md,
          componentName,
          table.defaultValueStr,
          table.defaultEmitStr,
          currentTokens.find(token => token.type === "fence")
        )

        tableTokens.forEach(token => token.type = 'component_container_block')
        return [
          `<component-block class="component-block" ref="componentBlock">`,
          `<div slot="component" class="component">`,
          component.component,
          `</div>`,
          `<div slot="define">${component.define}</div>`,
          table.html,
        ].join("")
      }
      return "</component-block>"
    },
  })
}
