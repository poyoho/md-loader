import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
::: tip
asdasdasda
:::
`

const h5 = `
<div class="tip custom-block">
<p class="custom-block-title">TIP</p>
<p>asdasdasd</p>
</div>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("containers", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
