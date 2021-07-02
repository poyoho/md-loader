function html(...args: any) {
  return args
}

export default html`
<div class="component-block">
  <!-- component -->
  <slot name="component"></slot>
  <!-- descript -->
  <slot name="descript"></slot>
</div>
`
