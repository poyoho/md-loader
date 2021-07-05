<template>
  <p>
    <strong>props:</strong>
  </p>
  <p>
    <strong>props.testNumber:</strong>
    {{ props.testNumber }}
  </p>
  <p>
    <strong>props.testBoolean:</strong>
    {{ props.testBoolean }}
  </p>
  <p>
    <strong>props.testString:</strong>
    {{ props.testString }}
  </p>
  <p>
    <strong>props.testOption:</strong>
    {{ props.testOption }}
    {{ typeof props.testOption }}
  </p>
  <p>
    <strong>props.testObject:</strong>
    {{ props.testObject }}
  </p>
  <button @click="click">test-emit{{ data.count }}</button>
  <div class="test-slot">
    <p>slot:</p>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from "vue"

export default defineComponent({
  name: "component-test",
  emits: ["test-emit"],
  props: {
    testNumber: {
      type: Number,
      default: 1,
      required: true
    },
    testBoolean: {
      type: Boolean,
      required: true,
      default: false
    },
    testString: {
      type: String,
      default: "ggsimida"
    },
    testOption: {
      type: [String, Number] as PropType<String | Number>,
      required: true,
      default: "asd"
    },
    testObject: {
      type: Object,
      required: true,
      default: () => {
        return { a: "b", c: 1 }
      }
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      count: 1
    })

    function click() {
      emit("test-emit")
      data.count++
    }

    return {
      props,
      data,

      click
    }
  }
})
</script>
