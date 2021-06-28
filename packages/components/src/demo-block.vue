<template>
  <div
    class="demo-block"
    @mouseenter="state.hovering = true"
    @mouseleave="state.hovering = false"
  >
    <!-- 代码执行ui -->
    <div class="source">
      <slot></slot>
    </div>
    <!-- 源码区 -->
    <div ref="meta" class="expaned-block">
      <div v-if="$slots.description" ref="desc" class="description">
        <slot name="description"></slot>
      </div>
      <div ref="high" class="highlight">
        <slot name="highlight"></slot>
      </div>
    </div>
    <div class="control" @click="state.expaned = !state.expaned">
      <transition name="slide-fade">
        <i :class="[iconClass, { 'hovering': state.hovering }]"></i>
      </transition>
      <transition name="slide-fade">
        <span v-show="state.hovering" :class="{ 'hovering': state.hovering }">{{ controlText }}</span>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watchEffect, ref } from "vue"

export default defineComponent({
  name: "DemoBlock",
  components: {
  },
  setup() {
    const desc = ref()
    const high = ref()
    const meta = ref()

    const state = reactive({
      expaned: false,
      hovering: false,
    })

    const codeAreaHeight = computed(() => {
      if (state.expaned) {
        const height = (desc ? desc.value!.clientHeight : 0) + (high ? high.value!.clientHeight : 0) + 40
        return `${height}px`
      } else {
        return "0"
      }
    })

    const iconClass = computed(() => {
      return state.expaned ? "el-icon-caret-top" : "el-icon-caret-bottom"
    })

    const controlText = computed(() => {
      return state.expaned ? "隐藏代码" : "显示代码"
    })

    watchEffect(() => {
      if (meta) {
        meta.value!.style.height = codeAreaHeight.value
      }
    })

    return {
      desc,
      high,
      meta,

      state,

      controlText,
      iconClass,
    }
  },
})
</script>
<style lang="less" scoped>
.demo-block{
  border: 1px solid #ebebeb;
  background: #fafafa;
  margin: 20px 0;
  transition: .2s;
}
.source {
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #ebebeb;
}
.expaned-block {
  overflow: hidden;
  height: 0;
  transition: height .5s;

  .description {
    margin: 0 10px;
    background: #fff;
    border: 1px solid #ebebeb;
    padding: 0 10px;
    border-radius: 5px;
  }

  .highlight {
    padding: 0 10px;
  }
}
.control {
  height: 30px;
  line-height: 30px;
  border-top: 1px solid #ebebeb;
  background: #fff;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #e5e7eb;

  &:hover {
    color: #409eff
  }

  span {
    display: inline-block;
    padding-left: 20px;
  }
}

.slide-fade-enter-active {
  transition: all .2s ease-out;
}

.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
