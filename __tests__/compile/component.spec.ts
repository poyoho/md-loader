import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

const md = `
:::component
asd
:::
`

const h5 = `
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("emoji", () => {
    const renderH5 = renderer.render(md)
    expect(equal(renderH5.html, h5)).toBe(true)
  })
})
