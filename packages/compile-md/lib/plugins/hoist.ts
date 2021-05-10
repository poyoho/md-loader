import MarkdownIt from "markdown-it"
import { MarkdownParsedData } from "../markdown"

// 提升 <script> <style> 标签
export const hoistPlugin = (md: MarkdownIt) => {
  const RE = /^<(script|style)(?=(\s|>|$))/i

  md.renderer.rules.html_block = (tokens, idx) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const hoistedTags = data.hoistedTags || (data.hoistedTags = [])
    if (RE.test(content.trim())) {
      hoistedTags.push(content)
      return ""
    } else {
      return content
    }
  }
}
