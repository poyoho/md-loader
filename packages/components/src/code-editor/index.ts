import CodeEditor from "./code-editor"

export function install() {
  window.customElements.define("code-editor", CodeEditor)
}
