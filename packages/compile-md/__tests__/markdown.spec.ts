import path = require("path")
import { createMarkdownRenderer } from "../lib/markdown"

// case
const markdownTestCase = [
  { // 0 emoji
    name: "emoji",
    markdown: ":tada:",
    html: "<p>🎉</p>"
  },
  { // 1 containers
    name: "containers",
    markdown: `::: tip
asdasdasd
:::`,
    html: `<div class="tip custom-block"><p class="custom-block-title">TIP</p>
    <p>asdasdasd</p>
    </div>`
  },
  { // 2 internal link
    name: "internal link",
    markdown: `[Home](/#heading)`,
    html: `<p><a href="/#heading">Home</a></p>`
  },
  { // 3 external link
    name: "external link",
    markdown: `[Home](https://www.baidu.com)`,
    html: `<p><a href="https://www.baidu.com" target="_blank" rel="noopener noreferrer">Home</a></p>`
  },
  { // 4 table
    name: "table",
    markdown: `
| Tables        | Are           | Cool  |
|:------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |`,
    html: `
    <table>
    <thead>
    <tr>
    <th style="text-align:left">Tables</th>
    <th style="text-align:center">Are</th>
    <th style="text-align:right">Cool</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td style="text-align:left">col 3 is</td>
    <td style="text-align:center">right-aligned</td>
    <td style="text-align:right">$1600</td>
    </tr>
    <tr>
    <td style="text-align:left">col 2 is</td>
    <td style="text-align:center">centered</td>
    <td style="text-align:right">$12</td>
    </tr>
    <tr>
    <td style="text-align:left">zebra stripes</td>
    <td style="text-align:center">are neat</td>
    <td style="text-align:right">$1</td>
    </tr>
    </tbody>
    </table>`
  },
  { // 5 toc
    name: "toc",
    markdown: `
# Heading

[[toc]]

## Sub heading 1
Some nice text

## Sub heading 2
Some even nicer text`,
    html: `
<h1 id="heading"><a class="header-anchor" href="#heading" aria-hidden="true">#</a> Heading</h1>
<p><div class="table-of-contents"><ul><li><a href="#sub-heading-1">Sub heading 1</a></li><li><a href="#sub-heading-2">Sub heading 2</a></li></ul></div></p>
<h2 id="sub-heading-1"><a class="header-anchor" href="#sub-heading-1" aria-hidden="true">#</a> Sub heading 1</h2>
<p>Some nice text</p>
<h2 id="sub-heading-2"><a class="header-anchor" href="#sub-heading-2" aria-hidden="true">#</a> Sub heading 2</h2>
<p>Some even nicer text</p>`
  },
  { // 6 highlight
    name: "highlight",
    markdown: `
\`\`\`js
const test = {
  a: 10
  b: {
    c: 20
  }
}
console.log(test)
console.log(test.b.c)
\`\`\``,
    html: `
    <template #highlight><div class="language-js line-numbers-mode"><pre v-pre><code><span class="token keyword">const</span> test <span class="token operator">=</span> <span class="token punctuation">{</span>
      a<span class="token operator">:</span> <span class="token number">10</span>
      b<span class="token operator">:</span> <span class="token punctuation">{</span>
        c<span class="token operator">:</span> <span class="token number">20</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>test<span class="token punctuation">)</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>test<span class="token punctuation">.</span>b<span class="token punctuation">.</span>c<span class="token punctuation">)</span>
    </code></pre>
    </div></template>`
  },
  { // 7 highlight line
    name: "highlight line",
    markdown: `\`\`\` js{1-3}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
\`\`\``,
    html: `<template #highlight><div class="language-js line-numbers-mode"><div class="highlight-lines"><div class="highlighted">&nbsp;</div><div class="highlighted">&nbsp;</div><div class="highlighted">&nbsp;</div><br><br><br><br><br></div><pre v-pre><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
    <span class="token function">data</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        msg<span class="token operator">:</span> <span class="token string">'Highlighted!'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  </code></pre></div></template>`
  },
  { // 8 hoist script styles
    name: "hoist",
    markdown: `
# 111

<template>
</template>

<script>
const a = 10
</script>

<script>
const b = 20
</script>

<p>asda</p>

<style>
</style>
    `,
    html: `<h1 id="_111"><a class="header-anchor" href="#_111" aria-hidden="true">#</a> 111</h1>
    <template>
    </template>
    <p>asda</p>`
  },
  { // 9 import code
    name: "import code",
    markdown: `<<< @/__tests__/testImport.md`,
    html: `<template #highlight><div class="language-md line-numbers-mode"><pre v-pre><code><span class="token title important"><span class="token punctuation">#</span> testImport</span>
    don't edit
    </code></pre>
    </div></template>`
  }
]

const start = 0
const end   = undefined

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  describe("markdown plugins", () => {
    // eslint-disable-next-line max-nested-callbacks
    markdownTestCase.slice(start, end).forEach((el) => {
      // eslint-disable-next-line max-nested-callbacks
      it(el.name, () => {
        const h5 = renderer.render(el.markdown)
        // console.log(h5.html);
        expect(equal(h5.html, el.html)).toBe(true)
      })
    })
  })
})

