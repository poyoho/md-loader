import MarkdownIt from "markdown-it"

// eslint-disable-next-line @typescript-eslint/ban-types
declare let window: Object | undefined
declare module "markdown-it-anchor" {
  export default function<T>(md: MarkdownIt, options?: T): void
}


declare module "markdown-it-table-of-contents" {
  export default function<T>(md: MarkdownIt, options?: T): void
}
