// 关键字高亮
// eslint-disable-next-line simple-import-sort/imports
import escapeHtml from "escape-html"
import prism from "prismjs"

import "prismjs/components/prism-markup"
import "prismjs/components/prism-css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-java"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-python"

const map = {
  "vue": "markup",
  "html": "markup",
  "md": "markdown",
  "ts": "typescript",
  "js": "javascript",
  "py": "python"
}

// required to make embedded highlighting work...
// loadLanguages(['markup', 'css', 'javascript'])

function wrap(code: string, lang: string): string {
  if (lang === "text") {
    code = escapeHtml(code)
  }
  return `<pre v-pre><code>${code}</code></pre>`
}

export const highlight = (str: string, lang: string) => {
  if (!lang) {
    return wrap(str, "text")
  }
  const rawlang = lang.toLowerCase()
  lang = map[rawlang] || rawlang
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang)
    return wrap(code, rawlang)
  }
  return wrap(str, "text")
}
