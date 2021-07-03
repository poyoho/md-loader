import teamplateElement from "./component-block-element"

interface InstanceObject {
  props: Record<string, any>
  emits: Record<string, any>
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

    const state = states.get(this)
    console.log(state)
  }

  disconnectedCallback() {

  }

  get descript() {
    return this.querySelector<HTMLSlotElement>(".descript")
  }
}

export function provideComponentInstance(el: ComponentBlockElement, instance: InstanceObject) {
  const state = states.get(el) || { instance: {} as InstanceObject }
  state.instance = instance
  states.set(el, state)
}
