function html(...args: any) {
  return args
}

export default html`
<div class="component-block">
  <div class="component">
    <!-- component -->
    <slot name="component"></slot>
  </div>
  <div class="descript">
    <!-- descript -->
    <slot name="descript"></slot>
  </div>
</div>
`
