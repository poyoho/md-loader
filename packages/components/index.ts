import * as CodeEditor from "./src/code-editor"
import * as ComponentBlockElement from "./src/component-block"
import * as DemoBlock from "./src/demo-block"

export default function install () {
  ComponentBlockElement.install()
  DemoBlock.install()
  CodeEditor.install()
}

export function isCustomElement(tag: string) {
  return ["demo-block", "component-block", "code-editor"].includes(tag)
}
