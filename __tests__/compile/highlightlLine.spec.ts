import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

const md = `
\`\`\` js{1-3}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
\`\`\`
`

const h5 = `
<template #highlight>
<div class="language-js line-numbers-mode">
<div class="highlight-lines">
<div class="highlighted">&nbsp;
</div>
<div class="highlighted">&nbsp;
</div>
<div class="highlighted">&nbsp;
</div><br><br><br><br><br></div>
<pre v-pre>
<code>
<span class="token keyword">export
</span>
<span class="token keyword">default
</span>
<span class="token punctuation">{
</span>
<span class="token function">data
</span>
<span class="token punctuation">(
</span>
<span class="token punctuation">)
</span> <span class="token punctuation">{</span>
<span class="token keyword">return</span>
<span class="token punctuation">{</span>
msg<span class="token operator">:</span>
<span class="token string">'Highlighted!'</span>
<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div></template>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("highlight lLine", () => {
    const renderH5 = renderer.render(md)
    expect(equal(renderH5.html, h5)).toBe(true)
  })
})
