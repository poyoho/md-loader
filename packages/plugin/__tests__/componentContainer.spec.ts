import { createMarkdownRenderer } from "@poyoho/md-loader-compile"

function replaceWhitespace(a: string) {
  return a.replace(/\s/g, "")
}

const md = `
:::component component-test

\`\`\`
<component-test :test-number="2">
  <p>default slot</p>
  <component-test :test-number="2" />
</component-test>
\`\`\`

| pr op        | ty \`p\` e               | def *ault*/params     | req __uire__ | comm _ent_ | asd |
| ------------ | ---------------------- | -------------- | ------------ | ---------- | --- |
| test-number  | number                 | 1              | true         | \`comment1\` | asd |
| test-boolean | boolean                | false          | true         | \`comment2\` | zxc |
| test-string  | string                 | ggsimida       | false        | \`comment3\` | qwe |
| test-option  | "asd" \\| "zxc" \\| "qwe" \\| 1 | 1              | true         | \`comment4\` | fgh |
| test-object  | object                 | {a: "b", c: 1} | true         | \`comment5\` | rty |
| test-emit    |          function           | (event: Event)      |              | \`comment6\` |asd|

:::

`

const h5 = `
<component-block class="component-block" ref="componentBlock"><div slot="component" class="component">
<component-test v-bind='
<!--prop: {"test-number":1,"test-boolean":false,"test-option":1,"test-object":{a:"b",c:1}} :prop-->'
v-on='<!--emit: {"test-emit":(...args) => {console.log("test-emit", ...args); _cb("test-emit")}} :emit-->'>
<p>default slot</p>
<component-test :test-number="2" />
</component-test>
</div><div slot="define"><div slot="highlight"><div class="language-"><pre v-pre><code>&lt;component-test&gt;
&lt;p&gt;default slot&lt;/p&gt;
&lt;component-test :test-number=&quot;2&quot; /&gt;
&lt;/component-test&gt;
</code></pre>
</div></div></div><table slot="descript" class="descript"><thead>
<tr>
<th>pr op</th>
<th>ty <code>p</code> e</th>
<th>def <em>ault</em>/params</th>
<th>req <strong>uire</strong></th>
<th>comm <em>ent</em></th>
<th>asd</th>
<th>🛠</th></tr>
</thead>
<tbody><tr>

<td><div class="prop">test-number</div></td>
<td><div class="type-number">number</div></td>
<td><div >1</div></td>
<td><div class="require">true</div></td>
<td><code>comment1</code></td>
<td>asd</td><td class="control"><input ftype="number" prop="test-number" type="number" value="1" required/></td></tr>
<tr>

<td><div class="prop">test-boolean</div></td>
<td><div class="type-boolean">boolean</div></td>
<td><div class="no-require">false</div></td>
<td><div class="require">true</div></td>
<td><code>comment2</code></td>
<td>zxc</td><td class="control">
<select ftype="boolean"  prop="test-boolean" required>
<option value="true">true</option><option value="false" selected="selected">false</option></select></td></tr>
<tr>

<td><div class="prop">test-string</div></td>
<td><div class="type-string">string</div></td>
<td><div >ggsimida</div></td>
<td><div class="no-require">false</div></td>
<td><code>comment3</code></td>
<td>qwe</td><td class="control"><input ftype="string" prop="test-string" type="text" value="ggsimida" /></td></tr>
<tr>

<td><div class="prop">test-option</div></td>
<td><div class="type-option">&quot;asd&quot; | &quot;zxc&quot; | &quot;qwe&quot; | 1</div></td>
<td><div >1</div></td>
<td><div class="require">true</div></td>
<td><code>comment4</code></td>
<td>fgh</td><td class="control"><select ftype="option" dtype="'asd'|'zxc'|'qwe'|1" prop="test-option" required>
<option value="asd">asd</option><option value="zxc">zxc</option>
<option value="qwe">qwe</option><option value="1" selected="selected">1</option></select></td></tr>
<tr>

<td><div class="prop">test-object</div></td>
<td><div class="type-object">object</div></td>
<td><div >{a: &quot;b&quot;, c: 1}</div></td>
<td><div class="require">true</div></td>
<td><code>comment5</code></td>
<td>rty</td><td class="control"><textarea ftype="object" prop="test-object" required>{a:"b",c:1}</textarea></td></tr>
<tr>

<td><div class="prop">test-emit</div></td>
<td><div class="type-function">function</div></td>
<td><div >(event: Event)</div></td>
<td><div class="no-require"></div></td>
<td><code>comment6</code></td>
<td>asd</td><td class="control"><div ftype="function" prop="test-emit"></div></td></tr>
</tbody></table><div slot="highlight"><div class="language-"><pre v-pre><code>&lt;component-test&gt;
&lt;p&gt;default slot&lt;/p&gt;
&lt;component-test :test-number=&quot;2&quot; /&gt;
&lt;/component-test&gt;
</code></pre>
</div></div></component-block>
`

describe("markdown render", () => {
  const renderer = createMarkdownRenderer(process.cwd(), {
    modules: { component: true }
  })
  it("markdown container", () => {
    // console.log(renderer.render(md).html)
    expect(replaceWhitespace((renderer.render(md)).html)).toContain(replaceWhitespace(h5))
  })
})
