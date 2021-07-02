import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:::component

| pr op | ty \`p\` e      | def *ault*     | req __uire__ | comm _ent_   | asd |
|-------|-----------------|----------------|--------------|--------------|-----|
| abcd  | number          | 1              | true         | \`comment1\` | asd |
| efgh  | boolean         | false          | true         | \`comment2\` | zxc |
| jklm  | string          | ggsimida       | false        | \`comment3\` | qwe |
| nopq  | qwe\\|Asd\\|zxc | qwe            | true         | \`comment4\` | fgh |
| rstu  | object          | {a: "b", c: 1} | true         | \`comment5\` | rty |

:::
`

const h5 = `
<div class="component-block"><table><thead>
<tr>
<th>pr op</th>
<th>ty <code>p</code> e</th><em></em>
<th>def ault</th><strong></strong>
<th>req uire</th><em></em>
<th>comm ent</th>
<th>asd</th>
<th>🛠</th></tr>
</thead>
<tbody><tr>

<td class="prop">abcd</td>
<td class="type-number">number</td>
<td class="default">1</td>
<td class="require">true</td><td><code>comment1</code></td><td>asd</td>
<td class="control number" key="abcd" require><input type="number" value="1" /></td></tr>
<tr>

<td class="prop">efgh</td>
<td class="type-boolean">boolean</td>
<td class="default">false</td>
<td class="require">true</td><td><code>comment2</code></td><td>zxc</td>
<td class="control boolean" key="efgh" require><select>
<option value="true">true</option><option value="false" selected="selected">false</option></select></td></tr>
<tr>

<td class="prop">jklm</td>
<td class="type-string">string</td>
<td class="default">ggsimida</td><td >false</td><td><code>comment3</code></td><td>qwe</td>
<td class="control string" key="jklm" ><input type="text" value="ggsimida"/></td></tr>
<tr>

<td class="prop">nopq</td>
<td class="type-option">qwe|Asd|zxc</td>
<td class="default">qwe</td>
<td class="require">true</td><td><code>comment4</code></td><td>fgh</td>
<td class="control option" key="nopq" require><select>
<option value="qwe" selected="selected">qwe</option>
<option value="Asd">Asd</option><option value="zxc">zxc</option></select></td></tr>
<tr>

<td class="prop">rstu</td>
<td class="type-object">object</td>
<td class="default">{a: &quot;b&quot;, c: 1}</td>
<td class="require">true</td><td><code>comment5</code></td><td>rty</td>
<td class="control object" key="rstu" require><textarea>{a:"b",c:1}</textarea></td></tr>
</tbody></table></div>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd(),{
    modules:{component:true}
  })
  it("markdown container", () => {
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
