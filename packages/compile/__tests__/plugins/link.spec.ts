import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
[Home](https://www.baidu.com)
`

const h5 = `
<p><a href="https://www.baidu.com" target="_blank" rel="noopener noreferrer">Home</a></p>
`

const md2 = `
[Home](/#heading)
`

const h52 = `
<p><a href="/#heading">Home</a></p>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd())
  it("external link", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
  it("internal link", () => {
    expect(replaceWhitespace((renderer.render(md2)).html)).toContain(replaceWhitespace(h52))

  })
})
