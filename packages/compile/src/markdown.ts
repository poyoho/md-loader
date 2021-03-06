import MarkdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import emoji from "markdown-it-emoji"
import toc from "markdown-it-table-of-contents"

import { containerPlugin } from "./plugins/containers"
import { highlight } from "./plugins/highlight"
import { highlightLinePlugin } from "./plugins/highlightLines"
import { lineNumberPlugin } from "./plugins/lineNumbers"
import { linkPlugin } from "./plugins/link"
import { preWrapperPlugin } from "./plugins/preWrapper"
import { slugify } from "./plugins/slugify"
import { snippetPlugin } from "./plugins/snippet"

export interface Header {
  level: number
  title: string
  slug: string
}

export interface MarkdownOptions extends MarkdownIt.Options {
  lineNumbers?: boolean
  anchor?: {
    permalink?: boolean
    permalinkBefore?: boolean
    permalinkSymbol?: string
  }
  // https://github.com/Oktavilla/markdown-it-table-of-contents
  toc?: any
  externalLinks?: Record<string, string>,
  modules?: {
    snippet?: boolean
  },
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
  md
    .use(highlightLinePlugin)
    .use(preWrapperPlugin)
    .use(containerPlugin)
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
      ...options.toc
    })

  // nodejs??????
  if(options.modules?.snippet) {
    md.use(snippetPlugin, root) // ??????????????????
  }

  if (options.lineNumbers) {
    md.use(lineNumberPlugin)
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
