import MarkdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import emoji from "markdown-it-emoji"
import toc from "markdown-it-table-of-contents"

import { componentPlugin } from "./plugins/component"
import { containerPlugin } from "./plugins/containers"
import { DemoContainer } from "./plugins/demoContainer"
import { extractHeaderPlugin } from "./plugins/header"
import { highlight } from "./plugins/highlight"
import { highlightLinePlugin } from "./plugins/highlightLines"
import { hoistPlugin } from "./plugins/hoist"
import { lineNumberPlugin } from "./plugins/lineNumbers"
import { linkPlugin } from "./plugins/link"
import { preWrapperPlugin } from "./plugins/preWrapper"
import { slugify } from "./plugins/slugify"
import { snippetPlugin } from "./plugins/snippet"
import { parseHeader } from "./utils/parseHeader"

export interface Header {
  level: number
  title: string
  slug: string
}

declare let window: Object | undefined

export interface MarkdownOptions extends MarkdownIt.Options {
  lineNumbers?: boolean
  config?: (md: MarkdownIt) => void
  anchor?: {
    permalink?: boolean
    permalinkBefore?: boolean
    permalinkSymbol?: string
  }
  // https://github.com/Oktavilla/markdown-it-table-of-contents
  toc?: any
  externalLinks?: Record<string, string>,
  container?: {
    demo: boolean
  }
}

export interface MarkdownParsedData {
  hoistedTags?: string[]
  links?: string[]
  headers?: Header[]
}

export interface MarkdownRenderer extends Omit<MarkdownIt, "render"> {
  __data: MarkdownParsedData
  render: (src: string, env?: any) => { html: string; data: any }
}

export const createMarkdownRenderer = (
  root: string,
  options: MarkdownOptions = {}
): MarkdownRenderer => {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight,
    ...options
  })

  // custom plugins
  md.use(componentPlugin)
    .use(highlightLinePlugin)
    .use(preWrapperPlugin)
    .use(hoistPlugin)
    .use(containerPlugin)
    .use(extractHeaderPlugin)
    .use(linkPlugin, {
      target: "_blank",
      rel: "noopener noreferrer",
      ...options.externalLinks
    })

    // 3rd party plugins
    .use(emoji as any)
    .use(anchor, {
      slugify,
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#",
      permalinkAttrs: () => ({ "aria-hidden": true }),
      ...options.anchor
    })
    .use(toc, {
      slugify,
      includeLevel: [2, 3],
      format: parseHeader,
      ...options.toc
    })

  // nodejs环境
  if(typeof window === "undefined") {
    md.use(snippetPlugin, root) // 引入外部文件
  }

  // apply user config
  if (options.config) {
    options.config(md)
  }

  if (options.lineNumbers) {
    md.use(lineNumberPlugin)
  }

  if (options.container?.demo) {
    md.use(DemoContainer)
  }

  // wrap render so that we can return both the html and extracted data.
  const render = md.render
  const wrappedRender: MarkdownRenderer["render"] = (src) => {
    (md as any).__data = {}
    const html = render.call(md, src)
    return {
      html,
      data: (md as any).__data
    }
  }
  ;(md as any).render = wrappedRender

  return md as any
}
