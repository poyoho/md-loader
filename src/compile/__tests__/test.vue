<template>
  <div>
    <h1 id="asdadsad">
      <a
        class="header-anchor"
        href="#asdadsad"
        aria-hidden="true"
      >#</a> asdadsad
    </h1>
    <h2 id="aaa">
      <a
        class="header-anchor"
        href="#aaa"
        aria-hidden="true"
      >#</a> aaa
    </h2>
    <h1 id="_1">
      <a
        class="header-anchor"
        href="#_1"
        aria-hidden="true"
      >#</a> 1
    </h1>
    <demo-block>
      <DemoComponent1 />
      <template #highlight>
        <div class="language-html line-numbers-mode">
          <pre v-pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>hello world<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>() => count++<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{count}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"vue"</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      count
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre>
        </div>
      </template>
    </demo-block><h1 id="_2">
      <a
        class="header-anchor"
        href="#_2"
        aria-hidden="true"
      >#</a> 2
    </h1>
    <demo-block>
      <DemoComponent2 />
      <template #highlight>
        <div class="language-html line-numbers-mode">
          <pre v-pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>hello world<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>() => count++<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{count}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"vue"</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      count
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre>
        </div>
      </template>
    </demo-block><h1 id="_3">
      <a
        class="header-anchor"
        href="#_3"
        aria-hidden="true"
      >#</a> 3
    </h1>
    <demo-block>
      <DemoComponent3 />
      <template #highlight>
        <div class="language-html line-numbers-mode">
          <pre v-pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>hello world<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>() => count++<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{count}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"vue"</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      count
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre>
        </div>
      </template>
    </demo-block><p>asdasdsd</p>
    <table>
      <thead>
        <tr>
          <th>asdasda</th>
          <th>asdadad</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
        <tr>
          <td>3</td>
          <td>43</td>
        </tr>
      </tbody>
    </table>
    <blockquote>
      <p>hello world</p>
    </blockquote>
    <blockquote>
      <blockquote>
        <p>aasdasda</p>
      </blockquote>
    </blockquote>
    <blockquote>
      <blockquote>
        <blockquote>
          <p>3333</p>
        </blockquote>
      </blockquote>
    </blockquote>
    <p><code>hello</code></p>
    <p><em>hello</em></p>
    <p><strong>hello</strong></p>
    <p>
      <a
        href="https://www.baidu.com/"
        target="_blank"
        rel="noopener noreferrer"
      >aaaa</a>
    </p>
    <p>ASDASD</p>
    <h3 id="自定义显示内容">
      <a
        class="header-anchor"
        href="#自定义显示内容"
        aria-hidden="true"
      >#</a> 自定义显示内容
    </h3>
    <div class="tip custom-block">
      <p class="custom-block-title">
        TIP
      </p>
      <p>aaaaa</p>
    </div>
  </div>
</template>
<script>
import DemoComponent1 from "D:\self\loader-md\test_DemoComponent1.md";
import DemoComponent2 from "D:\self\loader-md\test_DemoComponent2.md";
import DemoComponent3 from "D:\self\loader-md\test_DemoComponent3.md";
export default {
  components: { DemoComponent1, DemoComponent2, DemoComponent3 }
}
</script>