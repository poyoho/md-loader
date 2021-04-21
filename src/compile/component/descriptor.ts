import path from "path"
import hash from "hash-sum"
import { parse, SFCDescriptor, CompilerError } from "@vue/compiler-sfc"

declare module "@vue/compiler-sfc" {
  interface SFCDescriptor {
    id: string
  }
}

export function slash(p: string): string {
  return p.replace(/\\/g, "/")
}

export interface SFCParseResult {
  descriptor: SFCDescriptor
  errors: Array<CompilerError | SyntaxError>
}

export function createDescriptor(
  filename: string,
  source: string,
  root: string,
  isProduction: boolean | undefined
): SFCParseResult {
  const { descriptor, errors } = parse(source, {
    filename,
    sourceMap: true
  })
  
  // ensure the path is normalized in a way that is consistent inside
  // project (relative to root) and on different systems.
  const normalizedPath = slash(path.normalize(path.relative(root, filename)))
  descriptor.id = hash(normalizedPath + (isProduction ? source : ""))

  return { descriptor, errors }
}
