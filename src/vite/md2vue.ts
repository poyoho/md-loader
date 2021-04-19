import { createMarkdownRenderer, MarkdownOptions } from "@poyoho/compile-md"

export function createMarkdonwToVueRenderFn (
  root: string,
  options: MarkdownOptions = {},
) {
  const md = createMarkdownRenderer(root, options)

  return (src: string, file: string) => {
    
  }
}

