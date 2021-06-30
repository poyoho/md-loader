import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
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
<div slot="highlight">
<div class="language-js line-numbers-mode">
<div class="highlight-lines">
<div class="highlighted">&nbsp;</div>
<div class="highlighted">&nbsp;</div>
<div class="highlighted">&nbsp;</div>
<br><br><br><br><br>
</div>

<pre v-pre><code>
<span class="token keyword">export</span> <span class="token keyword">default</span>
<span class="token punctuation">{</span>
<span class="token function">data</span> <span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token keyword">return</span> <span class="token punctuation">{</span>
msg<span class="token operator">:</span> <span class="token string">'Highlighted!'</span>
<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div>

<div class="line-numbers-wrapper">
<span class="line-number">1</span>
<br><span class="line-number">2</span>
<br><span class="line-number">3</span>
<br><span class="line-number">4</span>
<br><span class="line-number">5</span>
<br><span class="line-number">6</span>
<br><span class="line-number">7</span>
<br></div></div>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("highlight lLine", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
