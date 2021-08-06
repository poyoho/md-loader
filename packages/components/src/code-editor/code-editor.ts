import { setupMonaco } from "./monaco"

function validateProps (attr: NamedNodeMap) {
  const lang = attr.getNamedItem("lang")!
  if (!lang) {
    throw "the component must had attributes[lang]"
  }
  if (!["html", "js", "ts"].includes(lang.value)) {
    throw "that component only support html, js, ts"
  }
  const code = attr.getNamedItem("code")!
  return {
    lang: lang.value,
    code: code?.value || ""
  }
}

export default class CodeEditor extends HTMLElement {
  private value = ""
  constructor() {
    super()
    const container = document.createElement("div")
    container.className = "editor"
    this.appendChild(container)
  }

  get container (): HTMLDivElement {
    return this.querySelector("div.editor")!
  }

  async connectedCallback() {
    const { monaco } = await setupMonaco()

    const { lang: extension, code } = validateProps(this.attributes)
    this.value = code
    const model = monaco.editor.createModel(
      code,
      {
        "html": "html",
        "js": "javascript",
        "ts": "typescript",
      }[extension],
      monaco.Uri.parse(`file:///root/${Date.now()}.${extension}`)
    )
    const editor = monaco.editor.create(this.container, {
      model,
      tabSize: 2,
      insertSpaces: true,
      autoClosingQuotes: 'always',
      detectIndentation: false,
      folding: false,
      automaticLayout: true,
      theme: 'dark',
      minimap: {
        enabled: false,
      },
    })

    editor.getModel()?.onDidChangeContent(() => {
      const code = editor.getValue()
      this.value = code
      const event = document.createEvent("events")
      event.initEvent("change", false, false)
      this.dispatchEvent(event)
    })
  }

  disconnectedCallback() {}
}
