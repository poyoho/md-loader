const elementContent = html`
<div
class="demo-block"
>
<!-- 代码执行ui -->
<div class="source">
<slot name="source"></slot>
</div>
<!-- 源码区 -->
<div class="expaned-block">
<slot name="description"></slot>
<div class="highlight">
  <slot name="highlight"></slot>
</div>
</div>
<div class="control">
<i :class="[iconClass, { 'hovering': state.hovering }]"></i>
<span v-show="state.hovering" :class="{ 'hovering': state.hovering }">{{ controlText }}</span>
</div>
</div>`

export default class DemoBlockElement extends HTMLElement {

}
