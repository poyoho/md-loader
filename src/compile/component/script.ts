import { compileScript, SFCDescriptor, SFCScriptBlock } from "@vue/compiler-sfc"
import { resolveTemplateCompilerOptions } from "./template"


export function resolveScript(
  descriptor: SFCDescriptor,
  options: ResolvedOptions,
  ssr: boolean
): SFCScriptBlock | null {
  if (!descriptor.script && !descriptor.scriptSetup) {
    return null
  }
  let resolved: SFCScriptBlock | null = null
  
  resolved = compileScript(descriptor, {
    ...options.script,
    id: descriptor.id,
    isProd: options.isProduction,
    inlineTemplate: !options.devServer,
    templateOptions: resolveTemplateCompilerOptions(descriptor, options, ssr)
  })
  
  return resolved
}
  