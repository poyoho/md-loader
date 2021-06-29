# 12
# 1

::: demo

`asdasd`

bbbb

| asd | bbb |
|-----|-----|
| asd | bbb |
| asd | bbb |
| asd | bbb |

```html
<template>
  <p class="hello-wrap">hello world</p>
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
<style>
  .hello-wrap {
    font-size: 20px;
    color: red;
  }
</style>
```
:::
