import teamplateElement from "./component-block-element"

interface InstanceObject {
  props: Record<string, any>
}

interface State {
  instance: InstanceObject
}

const states = new WeakMap<ComponentBlockElement, State>()

function tableInput(e: Event) {
  const state = states.get(<ComponentBlockElement>(<HTMLElement>e.currentTarget).parentNode)!
  const instance = state.instance
  const target = e.target as HTMLInputElement
  const value = target.value
  const prop = (<HTMLElement>target).getAttribute("prop")!
  console.log(prop)
  instance.props[prop] = value
}

export default class ComponentBlockElement extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })
    const wrap = this.ownerDocument.createElement("div")
    wrap.innerHTML = teamplateElement
    shadowRoot.appendChild(wrap)
  }

  connectedCallback() {
    const table = this.table
    table.addEventListener("input", tableInput)
  }

  disconnectedCallback() {
    const table = this.table!
    table.removeEventListener("input", tableInput)
  }

  get table() {
    return this.querySelector("table")!
  }
}

export function provideComponentInstance(el: ComponentBlockElement, instance: InstanceObject) {
  console.log("instance", instance)
  const state = states.get(el) || { instance: {} as InstanceObject }
  state.instance = instance
  states.set(el, state)
}
