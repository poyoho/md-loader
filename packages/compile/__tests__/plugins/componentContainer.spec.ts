import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:::component

| pr op | ty\`p\`e        | def *ault*     | req __uire__ | comm _ent_   | asd |
|-------|-----------------|----------------|--------------|--------------|-----|
| abcd  | number          | 1              | true         | \`comment1\` | asd |
| efgh  | boolean         | false          | true         | \`comment2\` | zxc |
| jklm  | string          | ggsimida       | true         | \`comment3\` | qwe |
| nopq  | qwe\\|Asd\\|zxc | qwe            | true         | \`comment4\` | fgh |
| rstu  | object          | {a: "b", c: 1} | true         | \`comment5\` | rty |

:::
`

const h5 = `
<div class="component-block"><table><thead>
<tr>
<th>pr op</th>
<th>ty<code>p</code>e</th>
<th>def <em>ault</em></th>
<th>req <strong>uire</strong></th>
<th>comm <em>ent</em></th>
<th>asd</th>
<th>🛠</th></tr>
</thead>
<tbody><tr>
<td>abcd</td>
<td>number</td>
<td>1</td>
<td>true</td>
<td><code>comment1</code></td>
<td>asd</td>
<td class="control" key="abcd" require="true"><input type="number" value="1" /></td></tr>
<tr>
<td>efgh</td>
<td>boolean</td>
<td>false</td>
<td>true</td>
<td><code>comment2</code></td>
<td>zxc</td>
<td class="control" key="efgh" require="true">
<select><option value="boolean">boolean</option></select></td></tr>
<tr>
<td>jklm</td>
<td>string</td>
<td>ggsimida</td>
<td>true</td>
<td><code>comment3</code></td>
<td>qwe</td>
<td class="control" key="jklm" require="true"><input type="text" value="ggsimida"/></td></tr>
<tr>
<td>nopq</td>
<td>qwe|Asd|zxc</td>
<td>qwe</td>
<td>true</td>
<td><code>comment4</code></td>
<td>fgh</td>
<td class="control" key="nopq" require="true"><select>
<option value="true">true</option><option value="false">false</option></select></td></tr>
<tr>
<td>rstu</td>
<td>object</td>
<td>{a: &quot;b&quot;, c: 1}</td>
<td>true</td>
<td><code>comment5</code></td>
<td>rty</td>
<td class="control" key="rstu" require="true"><textarea>{a:"b",c:1}</textarea></td></tr>
</tbody></table></div>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd(),{
    modules:{component:true}
  })
  it("markdown container", () => {
    // console.log(renderer.render(md).html)
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
