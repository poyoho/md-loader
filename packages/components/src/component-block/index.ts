import ComponentBlockElement from "./component-block"


export function install() {
  window.customElements.define("component-block", ComponentBlockElement)
}

export { provideComponentInstance } from "./component-block"
