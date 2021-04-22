import path from "path"
import fs from "fs-extra"
import { createHtml2VueRenderFn } from "../compileHtml"

const render = createHtml2VueRenderFn()

describe("html-vue-compiler", () => {
  it("html to vue render", () => {
    const input = fs.readFileSync(path.join(__dirname, "./output.html"), {encoding: "utf-8"})
    // const output = fs.readFileSync(path.join(__dirname, "./test.md"), {encoding: "utf-8"})
    render.render(input, path.resolve("test.md"))
  })
})
