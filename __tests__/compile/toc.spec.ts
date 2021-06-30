import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

const md = `
# Heading

[[toc]]

## Sub heading 1
Some nice text

## Sub heading 2
Some even nicer text
`

const h5 = `
<h1 id="heading">
  <a class="header-anchor" href="#heading" aria-hidden="true">#</a> Heading
</h1>
<p>
<div class="table-of-contents">
  <ul>
    <li><a href="#sub-heading-1">Sub heading 1</a></li>
    <li><a href="#sub-heading-2">Sub heading 2</a></li>
  </ul>
</div>
</p>
<h2 id="sub-heading-1">
  <a class="header-anchor" href="#sub-heading-1" aria-hidden="true">#</a> Sub heading 1
</h2>
<p>Some nice text</p>
<h2 id="sub-heading-2">
  <a class="header-anchor" href="#sub-heading-2" aria-hidden="true">#</a> Sub heading 2
</h2>
<p>Some even nicer text</p>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("toc", () => {
    const renderH5 = renderer.render(md)
    expect(equal(renderH5.html, h5)).toBe(true)
  })
})
