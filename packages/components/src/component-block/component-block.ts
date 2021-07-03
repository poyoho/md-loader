import teamplateElement from "./component-block-element"

interface InstanceObject {
  props: Record<string, any>
}

interface State {
  instance: InstanceObject

  propsNode: HTMLElement
}

const states = new WeakMap<ComponentBlockElement, State>()

function tableInput(e: Event) {
  const state = states.get(<ComponentBlockElement>(<HTMLElement>e.currentTarget).parentNode)!
  const instance = state.instance
  const target = e.target as HTMLInputElement
  const type = (<HTMLElement>target).getAttribute("ftype")!
  const prop = (<HTMLElement>target).getAttribute("prop")!
  let value: any = target.value

  switch (type) {
    case "boolean":
      value = value === "true" ? true : false
      break
    case "number":
      value = Number(value)
      break
    case "object":
      try {
        value = eval(`(${value})`)
      } catch (e) {
        // pass
      }
      break
    case "option":
      {
        const defineType = (<HTMLElement>target).getAttribute("dtype")!
        value = (defineType.match(new RegExp(`'*${value}'*`)) as any)[0]
        value[0] !== "'" && (value = eval(value))
      }
      break
  }
  instance.props[prop] = value
  state.propsNode.textContent = JSON.stringify(instance.props)
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
    const propsNode = this.props

    const state = states.get(this)!
    states.set(this, <any>Object.assign(state, { propsNode: propsNode }))
    propsNode.textContent = JSON.stringify(state.instance.props)
    table.addEventListener("input", tableInput)
  }

  disconnectedCallback() {
    const table = this.table!
    table.removeEventListener("input", tableInput)
  }

  get table() {
    return this.querySelector("table")!
  }

  get props() {
    return this.shadowRoot!.querySelector<HTMLElement>(".props")!
  }
}

export function provideComponentInstance(el: ComponentBlockElement, instance: InstanceObject) {
  const state = states.get(el) || {}
  states.set(el, <any>Object.assign(state, { instance: instance }))
}
