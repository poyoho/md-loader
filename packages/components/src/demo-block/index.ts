import teamplateElement from "./demo-block-element"

export default class DemoBlockElement extends HTMLElement {
  private expaned = false

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: "open"})
    const wrap = this.ownerDocument.createElement("div")
    wrap.innerHTML = teamplateElement
    shadowRoot.appendChild(wrap)

    const source = shadowRoot.querySelector<HTMLDivElement>(".source")!
    const high = shadowRoot.querySelector(".highlight")!
    const desc = shadowRoot.querySelector(".description")

    // hovering wrap
    const ctrlWrap = shadowRoot.querySelector(".control")!
    const tipText = shadowRoot.querySelector<HTMLSpanElement>(".control span")!
    ctrlWrap.addEventListener("click", () => {
      this.expaned = !this.expaned
      if (this.expaned) {
        const height = (desc ? desc!.clientHeight : 0) + (high ? high!.clientHeight : 0) + 40
        source.style.height = `${height}px`
        tipText.textContent = "隐藏"
      } else {
        source.style.height = "0"
        tipText.textContent = "展开"
      }
    })

  }
}
