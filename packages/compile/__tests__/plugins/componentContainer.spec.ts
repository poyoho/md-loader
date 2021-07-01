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
<tbody>
<tr>
<td>abcd</td>
<td>number</td>
<td>1</td>
<td>true</td>
<td><code>comment1</code></td>
<td>asd</td>
<td><input type="number" /></td></tr>
<tr>
<td>efgh</td>
<td>boolean</td>
<td>false</td>
<td>true</td>
<td><code>comment2</code></td>
<td>zxc</td>
<td><select><option value="true">true</option><option value="false">false</option></select></td></tr>
<tr>
<td>jklm</td>
<td>string</td>
<td>ggsimida</td>
<td>true</td>
<td><code>comment3</code></td>
<td>qwe</td>
<td><input type="text" /></td></tr>
<tr>
<td>nopq</td>
<td>qwe|Asd|zxc</td>
<td>qwe</td>
<td>true</td>
<td><code>comment4</code></td>
<td>fgh</td>
<td>
<select><option value="qwe">qwe</option>
<option value="Asd">Asd</option>
<option value="zxc">zxc</option></select></td></tr>
<tr>
<td>rstu</td>
<td>object</td>
<td>{a: &quot;b&quot;, c: 1}</td>
<td>true</td>
<td><code>comment5</code></td>
<td>rty</td>
<td><textarea></textarea></td></tr>
</table></div>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd(),{
    modules:{component:true}
  })
  it("markdown container", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
