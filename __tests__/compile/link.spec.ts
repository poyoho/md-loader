import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
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
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("external link", () => {
    const renderH5 = renderer.render(md)
    expect(equal(renderH5.html, h5)).toBe(true)
  })
  it("internal link", () => {
    const renderH5 = renderer.render(md2)
    expect(equal(renderH5.html, h52)).toBe(true)
  })
})
