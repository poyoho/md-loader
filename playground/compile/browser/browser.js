import { createMarkdownRenderer } from "@poyoho/compile-md"


const renderer = createMarkdownRenderer("", {

})

const text = `
# h1

## h2

### h3

:100:

\`\`\`js
const a = 10
console.log(a)
\`\`\`


::: tip
hello tip container
:::

[[toc]]

[内部](/p/a/t/h?query=string#hash)
[外部](https://www.baidu.com)
`

const el = document.createElement("div")
document.body.appendChild(el)
el.innerHTML = text.replace(/\n/g, "<br>") + "<hr>" + renderer.render(text).html

