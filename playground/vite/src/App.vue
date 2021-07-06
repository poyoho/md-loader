<template>
  <div id="app">
    aaaa
    <button v-on="von">aa</button>
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
  },
  setup() {
    return {
      von:
        {
          click: () => {console.log("111"); console.log("22")}
        }
    }
  }
})
</script>
<style>
#app {
  margin: 20px;
}
</style>
