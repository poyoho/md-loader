import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
<<<@/packages/compile/__tests__/plugins/testImport.md
`

const h5 = `
<div slot="highlight"><div class="language-md"><pre v-pre>
<code>
<span class="token title important"><span class="token punctuation">#</span> testImport</span>
don't edit
</code></pre>
</div></div>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      modules: {
        snippet: true
      }
    }
  )
  it("import Code", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
