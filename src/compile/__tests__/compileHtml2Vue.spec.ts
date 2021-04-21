import path from "path"
import fs from "fs-extra"
import { createHtml2VueRenderFn } from "../compileHtml2Vue"

describe("html-vue-compiler", () => {
  it("html to vue render", () => {
    const render = createHtml2VueRenderFn()
    const input = fs.readFileSync(path.join(__dirname, "./output.html"), {encoding: "utf-8"})
    // const output = fs.readFileSync(path.join(__dirname, "./test.md"), {encoding: "utf-8"})
    render(input, "asdasd")
  })
})
