import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
\`\`\`js
const test = {
  a: 10
  b: {
    c: 20
  }
}
console.log(test)
console.log(test.b.c)
\`\`\`
`

const h5 = `
<template #highlight>
  <div class="language-js line-numbers-mode">
    <pre v-pre><code>
      <span class="token keyword">const</span>
       test <span class="token operator">=</span> <span class="token punctuation">{</span>
  a<span class="token operator">:</span> <span class="token number">10</span>
  b<span class="token operator">:</span> <span class="token punctuation">{</span>
    c<span class="token operator">:</span> <span class="token number">20</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
console<span class="token punctuation">
  .</span><span class="token function">
    log</span><span class="token punctuation">(</span>test<span class="token punctuation">)</span>
console<span class="token punctuation">
  .</span><span class="token function">
    log</span><span class="token punctuation">(
    </span>test<span class="token punctuation">
      .</span>b<span class="token punctuation">.</span>c<span class="token punctuation">)</span>
</code></pre>
</div></template>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("highlight", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
