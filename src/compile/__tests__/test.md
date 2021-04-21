# h1

## h2

### h3

:100:

```js
const a = 10
console.log(a)
```


::: tip
hello tip container
:::

[[toc]]

::: demo
```html
<template>
  <div ref="listWrap" class="list-wrap">
    <h2 v-for="item in state.data" :key="item">{{ item }}</h2>
  </div>
  <div v-if="loading" class="loading">正在加载...</div>
</template>
<script>
import { defineComponent, ref, reactive} from "vue"
import { useScrollLoading } from "@ui/hooks"
export default defineComponent ({
  setup() {
    const state = reactive({
      data: [],
    })
    const fakeReq = () => {
      // 使用闭包可以有效控制请求是否生效
      let i = 0;
      return () => new Promise(resolve => {
        setTimeout(() => {
          resolve(Array(10).fill(++i));
        }, 1000);
      });
    }
    const req = fakeReq()
    const listWrap = ref(null);
    const loading = useScrollLoading(listWrap, state.data, req)
    return {
      state,
      listWrap,
      loading
    }
  }
})
</script>
<style>
.list-wrap{
  height: 300px;
  overflow-y: scroll;
}
</style>
```
:::

::: demo
```html
<template>
  <div ref="listWrap" class="list-wrap">
    <h2 v-for="item in state.data" :key="item">{{ item }}</h2>
  </div>
  <div v-if="loading" class="loading">正在加载...</div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive} from "vue"
import { useScrollLoading } from "@ui/hooks"
export default defineComponent ({
  setup() {
    const state = reactive({
      data: [],
    })
    const fakeReq = () => {
      // 使用闭包可以有效控制请求是否生效
      let i = 0;
      return () => new Promise(resolve => {
        setTimeout(() => {
          resolve(Array(10).fill(++i));
        }, 1000);
      });
    }
    const req = fakeReq()
    const listWrap = ref(null);
    const loading = useScrollLoading(listWrap, state.data, req)
    return {
      state,
      listWrap,
      loading
    }
  }
})
</script>
<style>
.list-wrap{
  height: 300px;
  overflow-y: scroll;
}
</style>
```
:::

[内部](/p/a/t/h?query=string#hash)
[外部](https://www.baidu.com)