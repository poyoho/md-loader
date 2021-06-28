import MarkdownIt from "markdown-it"
// 替换默认的htmlBlock规则以允许在以下位置使用自定义组件根级别
import blockNames from"markdown-it/lib/common/html_blocks"
import { HTML_OPEN_CLOSE_TAG_RE } from "markdown-it/lib/common/html_re"
import { RuleBlock } from "markdown-it/lib/parser_block"

// html标签的打开和相应关闭序列的数组，最后一个参数定义是否可以终止段落
const HTML_SEQUENCES: [RegExp, RegExp, boolean][] = [
  [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  // PascalCase Components
  [/^<[A-Z]/, />/, true],
  // custom elements with hyphens
  // eslint-disable-next-line no-useless-escape
  [/^<\w+\-/, />/, true],
  [
    new RegExp("^</?(" + blockNames.join("|") + ")(?=(\\s|/?>|$))", "i"),
    /^$/,
    true
  ],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
]

export const componentPlugin = (md: MarkdownIt) => {
  md.block.ruler.at("html_block", htmlBlock)
}

// eslint-disable-next-line complexity,
const htmlBlock: RuleBlock = (state, startLine, endLine, silent): boolean => {
  let i, nextLine, lineText
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  // 如果缩进超过3个空格，则应为代码块
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false
  }

  if (!state.md.options.html) {
    return false
  }

  if (state.src.charCodeAt(pos) !== 0x3c /* < */) {
    return false
  }

  lineText = state.src.slice(pos, max)

  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    if (HTML_SEQUENCES[i][0].test(lineText)) {
      break
    }
  }

  if (i === HTML_SEQUENCES.length) {
    return false
  }

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2]
  }

  nextLine = startLine + 1

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  if (!HTML_SEQUENCES[i][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]
      lineText = state.src.slice(pos, max)

      if (HTML_SEQUENCES[i][1].test(lineText)) {
        // eslint-disable-next-line max-depth
        if (lineText.length !== 0) {
          nextLine++
        }
        break
      }
    }
  }

  state.line = nextLine

  const token = state.push("html_block", "", 0)
  token.map = [startLine, nextLine]
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true)

  return true
}
