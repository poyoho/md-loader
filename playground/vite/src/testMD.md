# 12

## 1

:::component component-test

```vue
<component-test :test-number="2">
  <p>default slot</p>
  <!-- don't change by descript -->
  <component-test :test-number="2" />
</component-test>
```

| pr op        |          ty `p` e           | def *ault* / params | req __uire__ | comm _ent_ |
|--------------|:---------------------------:|---------------------|--------------|------------|
| test-number  |           number            | 1                   | true         | `comment1` |
| test-boolean |           boolean           | false               | true         | `comment2` |
| test-string  |           string            | ggsimida            | false        | `comment3` |
| test-option  | "asd" \| "zxc" \| "qwe"\| 1 | 1                   | true         | `comment4` |
| test-object  |           object            | {a: "b", c: 1}      | true         | `comment5` |
| test-emit    |          function           | (random: number)    |              | `comment6` |
| test-emit2   |          function           | (random: number)    |              | `comment6` |

:::

::: demo

```vue
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

<!-- description -->

```js{1}
const a = "12"
```

`asdasd`

bbbb

| asd | bbb |
|-----|-----|
| asd | bbb |
| asd | bbb |
| asd | bbb |

adasd

```vue
<template>
  <div>asdasd</div>
</template>
<script>
</script>
<style>
  .hello-wrap {
    font-size: 20px;
    color: red;
  }
</style>
```
:::

:tada:

::: tip
asdasdasd
:::

[Home](/#heading)

[Home](https://www.baidu.com)

| Tables        | Are           | Cool  |
|---------------|---------------|-------|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      | $12   |
| zebra stripes | are neat      | $1    |

[[toc]]


# Heading

[[toc]]

## Sub heading 1
### Sub heading 1
#### Sub heading 1
Some nice text

## Sub heading 2
### Sub heading 2
#### Sub heading 2
Some even nicer text

