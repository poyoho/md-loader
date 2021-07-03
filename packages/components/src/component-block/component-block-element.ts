function html(...args: any) {
  return args
}

export default html`
<div class="component-block">
  <div class="component">
    <!-- component -->
    <slot name="component"></slot>
  </div>
  <p class="props"></p>
  <div class="descript">
    <!-- descript -->
    <slot name="descript"></slot>
  </div>
</div>
<style>
.component-block .descript,
.component-block .component,
.component-block .props {
  background: #ffffff;
  border: 1px solid #ebebeb;
  padding: 20px;
}
.component-block {
  border: 1px solid #ebebeb;

  background: #fafafa;
  padding: 10px;
}
</style>
`
