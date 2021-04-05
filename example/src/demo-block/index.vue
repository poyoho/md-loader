<template>
  <div
    class="demo-block"
    :class="[{ hover: hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- 代码生成的ui -->
    <div class="source">
      <slot name="source"></slot>
    </div>
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
    <!-- demo块控制区 -->
    <div
      ref="control"
      class="demo-block-control"
      :class="{ 'is-fixed': fixedControl }"
      @click="isExpanded = !isExpanded"
    >
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  watchEffect,
  onMounted,
  nextTick,
} from "vue";
import hljs from "highlight.js";
import useRefTemplate from "./useRefTemplate";

import "./demo-block.less"


export default defineComponent({
  name: "DemoBlock",
  setup() {
    const meta = ref(null);
    const description = ref(null);
    const highlight = ref(null);
    const state = reactive({
      /**
       * 是否悬浮
       */
      hovering: false,
      /**
       * 控制器是否展开
       */
      isExpanded: false,
      fixedControl: false,
      isMounted: false,
    });
    /**
     * 控制器文本
     */
    const controlText = computed(() => {
      return state.isExpanded ? "隐藏代码" : "显示代码";
    });
    const codeAreaHeight = computed(() => {
      if (state.isMounted && state.isExpanded) {
        const descEl = useRefTemplate<HTMLElement>(description, true);
        const hlEl = useRefTemplate<HTMLElement>(highlight);
        const height = (descEl ? descEl.clientHeight + 20 : 0) + hlEl.clientHeight + 20;
        return height + "px";
      } else {
        return "1px";
      }
    });
    onMounted(() => {
      state.isMounted = true;
      nextTick(() => {
        try {
          const hlEl = useRefTemplate<HTMLElement>(highlight) as HTMLElement;
          const code = hlEl.querySelector("code") as HTMLElement;
          hljs.highlightBlock(code);
        } catch (error) {
          console.log(error);
        }
      });
    });
    watchEffect(() => {
      if (state.isMounted) {
        if (state.isExpanded) {
          const el = useRefTemplate<HTMLElement>(meta);
          el.style.height = codeAreaHeight.value;
        } else {
          const el = useRefTemplate<HTMLElement>(meta);
          el.style.height = "1px";
        }
      }
    });
    return { ...toRefs(state), controlText, meta, description, highlight };
  },
});
</script>
