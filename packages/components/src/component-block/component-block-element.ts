function html(...args: any) {
  return args
}

export default html`
<div class="component-block">
  <!-- component -->
  <div class="component">
    <slot name="component"></slot>
  </div>

  <!-- define block -->
  <ul class="define-block">
    <li>props</li>
    <li class="active">descript</li>
    <li>define</li>
  </ul>
  <p class="props"></p>
  <div class="descript">
    <!-- descript -->
    <slot name="descript"></slot>
  </div>
  <!-- define -->
  <div class="define">
    <slot name="define"></slot>
  </div>
</div>
<style>
.descript,
.component,
.props {
  background: #ffffff;
  border: 1px solid #ebebeb;
  padding: 20px;
  border-top: 0;
}
.component-block {
  border: 1px solid #ebebeb;
  background: #fafafa;
  padding: 10px;
}

.define-block {
  padding: 0;
  margin-top: 10px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebebeb;
  display: flex;
}
.define-block li {
  padding: 10px;
  list-style-type: none;
  background: #fff;
  border: 1px solid #ebebeb;
  cursor: pointer;
  margin: 0 -1px -1px 0;
}
.define-block li:last-child {
  border-top-right-radius: 8px;
}
.define-block li:first-child {
  border-top-left-radius: 8px;
}

.define-block li:hover {
  z-index: 10;
  box-shadow: 0 0 3px 3px #ebebeb;
}
.define-block li:active {
  z-index: 10;
  box-shadow: inset -2px -2px 8px rgba(255, 255, 255, 1),
              inset -2px -2px 12px rgba(255, 255, 255, 0.5),
              inset 2px 2px 4px rgba(255, 255, 255, 0.1),
              inset 2px 2px 8px rgba(0, 0, 0, 0.15);
}
.define-block li.active {
  background: #0088ff;
}
.define-block li.active:active {
  box-shadow: inset -2px -2px 8px #0088ff,
              inset -2px -2px 12px rgba(#0088ff, .5),
              inset 2px 2px 4px rgba(#0088ff, .1),
              inset 2px 2px 8px rgba(#0088ff, .15);
}
.define,
.descript,
.props {
  display: none;
}
.descript {
  display: block;
}
</style>
`
