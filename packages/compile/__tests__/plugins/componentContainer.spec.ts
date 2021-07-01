import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:::component

| pr op | ty\`p\`e | def *ault* | req __uire__ | comm _ent_  | asd |
|-------|----------|------------|--------------|-------------|-----|
| abcd  | number   | 1          | true         | \`comment\` | asd |
| efgh  | number   | 2          | true         | \`comment\` | zxc |

:::
`

const h5 = `
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd(),{
    modules:{component:true}
  })
  it("markdown container", () => {
    console.log(renderer.render(md).html)
    // expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
