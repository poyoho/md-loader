# 12
# 1
asdsad
::: demo
```html
<template>
  <p>hello world</p>
  <button @click="() => count++">{{count}}</button>
</template>
<script>
import { defineComponent, ref } from "vue"
export default defineComponent({
  setup () {
    console.log('hello world1')
    const count = ref(0)
    return {
      count
    }
  }
})
</script>
```
:::

::: demo
```html
<template>
  <p>hello world</p>
  <button @click="() => count++">{{count}}</button>
</template>
<script>
import { defineComponent, ref } from "vue"
export default defineComponent({
  setup () {
    console.log('hello world2')
    const count = ref(0)
    return {
      count
    }
  }
})
</script>
```
:::