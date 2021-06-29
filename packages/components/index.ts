import DemoBlockElement from "./src/demo-block"

function install() {
  window.customElements.define("demo-block", DemoBlockElement)
}

export default {
  install
}
