import path from "path"
import fs from "fs-extra"
import { createMarkdonwRenderFn } from "../compileMd"

const render = createMarkdonwRenderFn(__dirname, {
  lineNumbers: true
})

function equal(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "")
}

describe("markdow-compiler", () => {
  it("markdown render", () => {
    const content = fs.readFileSync(path.join(__dirname, "./test.md"), {encoding: "utf-8"})
    const result = fs.readFileSync(path.join(__dirname, "./test.html"), {encoding: "utf-8"})
    const res = render.render(content)
    // fs.writeFileSync(path.join(__dirname, "./test.html"), res.html, {encoding: "utf-8"})
    expect(equal(res.html, result)).toBe(true)
  })
})
