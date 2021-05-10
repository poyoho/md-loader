<template>
  <div id="app">
    aaaa
    <testMD />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import testMD from "./testMD.md"

export default defineComponent({
  name: "App",
  components: {
    testMD,
  }
})
</script>
<style>
#app {
  margin: 20px;
}
</style>
