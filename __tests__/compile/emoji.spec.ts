import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:tada:
`

const h5 = `
<p>🎉</p>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("emoji", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
