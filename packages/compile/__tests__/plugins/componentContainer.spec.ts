import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:::component    component-hello-world   

| pr op | ty \`p\` e      | def *ault*     | req __uire__ | comm _ent_   | as __d__ |
|-------|-----------------|----------------|--------------|--------------|----------|
| abcd  | number          | 1              | true         | \`comment1\` | asd      |
| efgh  | boolean         | false          | true         | \`comment2\` | zxc      |
| jklm  | string          | ggsimida       | false        | \`comment3\` | qwe      |
| nopq  | qwe\\|Asd\\|zxc | qwe            | true         | \`comment4\` | fgh      |
| rstu  | object          | {a: "b", c: 1} | true         | \`comment5\` | rty      |

:::
`

const h5 = `
<component-block class="component-block"><component-hello-world slot="component" /><table slot="descript"><thead>
<tr>
<th>pr op</th>
<th>ty <code>p</code> e</th>
<th>def <em>ault</em></th>
<th>req <strong>uire</strong></th>
<th>comm <em>ent</em></th>
<th>as <strong>d</strong></th>
<th>🛠</th></tr>
</thead>
<tbody><tr>
<td><div class="prop">abcd</div></td>
<td><div class="type-number">number</div></td>
<td><div >1</div></td><td><div class="require">true</div></td>

<td><code>comment1</code></td>
<td>asd</td><td class="control number" key="abcd" require><input type="number" value="1" /></td></tr>
<tr>

<td><div class="prop">efgh</div></td>
<td><div class="type-boolean">boolean</div></td>
<td><div class="no-require">false</div></td>
<td><div class="require">true</div></td>
<td><code>comment2</code></td>
<td>zxc</td><td class="control boolean" key="efgh" require>
<select><option value="true">true</option><option value="false" selected="selected">false</option></select></td></tr>
<tr>

<td><div class="prop">jklm</div></td>
<td><div class="type-string">string</div></td>
<td><div >ggsimida</div></td>
<td><div class="no-require">false</div></td>
<td><code>comment3</code></td>
<td>qwe</td><td class="control string" key="jklm" ><input type="text" value="ggsimida"/></td></tr>
<tr>

<td><div class="prop">nopq</div></td>
<td><div class="type-option">qwe|Asd|zxc</div></td>
<td><div >qwe</div></td>
<td><div class="require">true</div></td>
<td><code>comment4</code></td>
<td>fgh</td><td class="control option" key="nopq" require><select>
<option value="qwe" selected="selected">qwe</option>
<option value="Asd">Asd</option><option value="zxc">zxc</option></select></td></tr>
<tr>

<td><div class="prop">rstu</div></td>
<td><div class="type-object">object</div></td>
<td><div >{a: &quot;b&quot;, c: 1}</div></td>
<td><div class="require">true</div></td>
<td><code>comment5</code></td>
<td>rty</td><td class="control object" key="rstu" require><textarea>{a:"b",c:1}</textarea></td></tr>
</tbody></table></component-block>
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
