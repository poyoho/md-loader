import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"

type renderFn = (
  getDefaultResult: () => string,
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer
) => string

interface Cursor {
  end: number
}

export function sliceTokens(tokens: Token[], startTokenType: string, endTokenType: string, cursor?: Cursor) {
  const _tokens = cursor ? tokens.slice(cursor.end + 1) : tokens
  const startIdx = _tokens.findIndex(token => token.type === startTokenType)
  const endIdx = _tokens.findIndex(token => token.type === endTokenType)
  if (cursor) {
    const isNotFinded = startIdx === -1 || endIdx === -1
    cursor.end = isNotFinded ? tokens.length : cursor.end + 1 + endIdx
  }
  return _tokens.slice(startIdx, endIdx + 1) // startTokenType ~ endTokenType
}

export function customRenderer(md: MarkdownIt, defineRules: Record<string, renderFn>) {
  let collectedResult: string[] = []
  let cacheRules: Renderer.RenderRuleRecord = {}
  let collectFlag = false
  const cacheRenderer = {}
  const defaultRules = Object.assign({}, md.renderer.rules) as Renderer.RenderRuleRecord
  const definedRules = Object.assign({}, md.renderer.rules) as Renderer.RenderRuleRecord
  const RENDERER_FUNCTION = ["renderToken", "renderInline", "renderAttrs", "renderInlineAsText"]

  for (const tokenType in defineRules) {
    const defineRule = defineRules[tokenType]
    const defaultRule = defaultRules[tokenType]
    definedRules[tokenType] = (token, idx, opts, env, self) => {
      function getDefaultResult() {
        let initResult = defaultRule && defaultRule(token, idx, opts, env, self)
        if (initResult === undefined) { // no default rule
          initResult = self.renderToken(token, idx, opts)
        }
        return initResult
      }
      return defineRule(getDefaultResult, token, idx, opts, env, self)
    }
  }
  // cache renderer function
  RENDERER_FUNCTION.forEach((renderFn) => {
    cacheRenderer[renderFn] = md.renderer[renderFn]
  })

  return {
    render(tokens: Token[]) {
      md.renderer.rules = definedRules
      const html = md.renderer.render(tokens, md.options, {})
      md.renderer.rules = defaultRules
      return html
    },
    stop() {
      RENDERER_FUNCTION.forEach((renderFn) => {
        md.renderer[renderFn] = () => ""
      })
    },
    reset() {
      RENDERER_FUNCTION.forEach((renderFn) => {
        md.renderer[renderFn] = cacheRenderer[renderFn]
      })
    },
    collectStart() {
      // mock render function
      collectFlag = true
      RENDERER_FUNCTION.forEach((renderFn) => {
        md.renderer[renderFn] = (...args: any[]) => {
          const result = cacheRenderer[renderFn].apply(md.renderer, args)
          if (collectFlag) {
            collectedResult.push(result)
            return ""
          }
          return result
        }
      })
      // mock render rules
      cacheRules = Object.assign({}, md.renderer.rules) as Renderer.RenderRuleRecord
      Object.keys(md.renderer.rules).forEach((rule) => {
        const handle = <any>cacheRules[rule]!
        md.renderer.rules[rule] = (...args: any[]) => {
          const result = handle.apply(md.renderer.rules, args)
          if (collectFlag) {
            collectedResult.push(result)
            return ""
          }
          return result
        }
      })
    },
    collectEnd() {
      collectFlag = false
      this.reset()
      md.renderer.rules = cacheRules
      const collected = collectedResult.join("")
      cacheRules = {}
      collectedResult = []
      return collected
    }
  }
}
