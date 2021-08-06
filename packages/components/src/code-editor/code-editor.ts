import teamplateElement from "./code-editor-element"
import { setupMonaco } from "./monaco"

export default class CodeEditor extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })
    const wrap = this.ownerDocument.createElement("div")
    wrap.innerHTML = teamplateElement
    shadowRoot.appendChild(wrap)
  }

  async connectedCallback() {
    const { monaco } = await setupMonaco()

  }

  disconnectedCallback() {}
}
