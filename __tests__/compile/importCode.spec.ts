import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

const md = `
<<< @/__tests__/testImport.md`

const h5 = `
<template #highlight>
<div class="language-md line-numbers-mode">
<pre v-pre>
<code>
<span class="token title important">
<span class="token punctuation">#</span> testImport</span>
don't edit
</code></pre>
</div></template>`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(
    process.cwd(),
    {
      lineNumbers: true
    }
  )
  it("import Code", () => {
    const renderH5 = renderer.render(md)
    expect(equal(renderH5.html, h5)).toBe(true)
  })
})
