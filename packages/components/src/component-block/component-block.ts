import { getShadowHost } from "../utils/shadow"
import teamplateElement from "./component-block-element"

interface InstanceObject {
  props: Record<string, any>
}

interface State {
  instance: InstanceObject

  activeNode: HTMLElement

  propsBlock: HTMLElement
  defineBlock: HTMLElement
  descriptBlock: HTMLElement
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
  state.propsBlock.textContent = JSON.stringify(instance.props)
}

function changeActive(e: Event) {
  const state = states.get(<ComponentBlockElement>getShadowHost(<HTMLElement>e.currentTarget))!
  const target = e.target as HTMLInputElement

  state[state.activeNode.getAttribute("for")! + "Block"].style.display = "none"
  state[target.getAttribute("for")! + "Block"].style.display = "block"

  state.activeNode.className = ""
  target.className = "active"
  state.activeNode = target
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
    const nav = this.nav
    const activeNode = this.defaultNavActive
    const propsBlock = this.propsBlock
    const defineBlock = this.defineBlock
    const descriptBlock = this.descriptBlock

    const state = <any>Object.assign(states.get(this)!, {
      propsBlock,
      defineBlock,
      descriptBlock,
      activeNode: activeNode,
    })
    propsBlock.textContent = JSON.stringify(state.instance.props)

    activeNode.className = "active"
    state[activeNode.getAttribute("for")! + "Block"].style.display = "block"

    states.set(this, state)
    table.addEventListener("input", tableInput)
    nav.addEventListener("click", changeActive)
  }

  disconnectedCallback() {
    const table = this.table!
    const nav = this.nav!

    table.removeEventListener("input", tableInput)
    nav.removeEventListener("click", changeActive)
  }

  get table() {
    return this.querySelector("table")!
  }

  get nav() {
    return this.shadowRoot!.querySelector<HTMLUListElement>(".define-block")!
  }

  get defaultNavActive() {
    return this.shadowRoot!.querySelector(".define-block .default")!
  }

  get propsBlock() {
    return this.shadowRoot!.querySelector<HTMLUListElement>(".props")!
  }

  get defineBlock() {
    return this.shadowRoot!.querySelector<HTMLUListElement>(".define")!
  }

  get descriptBlock() {
    return this.shadowRoot!.querySelector<HTMLUListElement>(".descript")!
  }
}

export function provideComponentInstance(el: ComponentBlockElement, instance: InstanceObject) {
  const state = states.get(el) || {}
  states.set(el, <any>Object.assign(state, { instance: instance }))
}
