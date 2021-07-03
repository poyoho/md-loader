import teamplateElement from "./component-block-element"

interface InstanceObject {
  props: Record<string, any>
}

interface State {
  instance: InstanceObject
}

const states = new WeakMap<ComponentBlockElement, State>()

export default class ComponentBlockElement extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })
    const wrap = this.ownerDocument.createElement("div")
    wrap.innerHTML = teamplateElement
    shadowRoot.appendChild(wrap)
  }

  connectedCallback() {
    const descript = this.descript!

    const state = states.get(this)!
    state.instance.props.testNumber = 2
    console.log("state", state.instance.props.testNumber)
  }

  disconnectedCallback() {

  }

  get descript() {
    return this.querySelector<HTMLSlotElement>(".descript")
  }
}

export function provideComponentInstance(el: ComponentBlockElement, instance: InstanceObject) {
  console.log("instance", instance)
  const state = states.get(el) || { instance: {} as InstanceObject }
  state.instance = instance
  states.set(el, state)
}
