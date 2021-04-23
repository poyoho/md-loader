import path from "path"
import fs from "fs-extra"
import { createMarkdonwRenderFn } from "../compileMd"
import { createHtml2VueRenderFn } from "../compileHtml"


function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

describe("markdow-compiler", () => {
  const render = createMarkdonwRenderFn(__dirname, {
    lineNumbers: true
  })
  it("markdown render", () => {
    const content = fs.readFileSync(path.join(__dirname, "./test.md"), {encoding: "utf-8"})
    const result = fs.readFileSync(path.join(__dirname, "./test.html"), {encoding: "utf-8"})
    const res = render.render(content)
    // fs.writeFileSync(path.join(__dirname, "./test.html"), res.html, {encoding: "utf-8"})
    expect(equal(res.html, result)).toBe(true)
  })
})

describe("html-vue-compiler", () => {
  const render = createHtml2VueRenderFn()
  it("html to vue render", () => {
    const input = fs.readFileSync(path.join(__dirname, "./test.html"), {encoding: "utf-8"})
    const output = fs.readFileSync(path.join(__dirname, "./test.vue"), {encoding: "utf-8"})
    const res = render.render(input, path.resolve("test.md"))
    // fs.writeFileSync(path.join(__dirname, "./test.vue"), res, {encoding: "utf-8"})
    expect(equal(res, output)).toBe(true)
  })
})
