import path from "path"
import fs from "fs-extra"
import { createMarkdonw2HtmlRenderFn } from "../compileMd2Html"

const render = createMarkdonw2HtmlRenderFn(__dirname, {
  lineNumbers: true
})

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

describe("markdow-compiler", () => {
  it("markdown render", () => {
    const content = fs.readFileSync(path.join(__dirname, "./test.md"), {encoding: "utf-8"})
    const result = fs.readFileSync(path.join(__dirname, "./output.html"), {encoding: "utf-8"})
    const res = render.render(content)
    // console.log(res.html);
    expect(equal(res.html, result)).toBe(true)
  })
})
