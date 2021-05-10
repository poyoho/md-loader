<template>
  <div
    class="demo-block"
  >
    <!-- 源码区 -->
    <div
      ref="meta"
      class="meta"
    >
      <div
        v-if="$slots.default"
        ref="description"
        class="description"
      >
        <slot></slot>
      </div>
      <div
        ref="highlight"
        class="highlight"
      >
        <slot name="highlight"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "DemoBlock",
  setup() {

  },
})
</script>
<style scoped>
.description {
  border-radius: 5px;
  padding: 20px;
  background: var(--c-divider-dark);
}
</style>
