const { createMarkdownRenderer } = require("@poyoho/md-loader-compile")

const renderer = createMarkdownRenderer(__dirname, {

})

const text = `
# h1

## h2

### h3

:100:

\`\`\`js
const a = 10
\`\`\`


::: tip
hello tip container
:::

[[toc]]

[内部](/p/a/t/h?query=string#hash)
[外部](https://www.baidu.com)

<<< @/__tests__/testImport.md
`

console.log(renderer.render(text))
