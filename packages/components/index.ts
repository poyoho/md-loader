import DemoBlockElement from "./src/demo-block-element"

export function install() {
  window.customElements.define("demo-block", DemoBlockElement)
}
