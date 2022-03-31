import ComponentBlockElement from "./src/component/component-block/component-block"
import DemoBlockElement from "./src/demo/demo-block/demo-block"

export * from "./src/component/component-block/component-block"

export default function install() {
  window.customElements.define("demo-block", DemoBlockElement)
  window.customElements.define("component-block", ComponentBlockElement)
}

export function isCustomElement(tag: string) {
  return ["demo-block", "component-block"].includes(tag)
}
