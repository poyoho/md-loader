<template>
  <div id="app">
    aaaa
    <test />
    <testMD />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import test from "./test.vue"
import testMD from "./testMD.md"

export default defineComponent({
  name: "App",
  components: {
    test,
    testMD,
  }
})
</script>
<style lang="less">
#app {
  margin: 20px;
}
</style>