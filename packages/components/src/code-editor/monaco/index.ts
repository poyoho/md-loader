import * as monaco from 'monaco-editor'

export async function setupMonaco () {
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
    noUnusedLocals: false,
    noUnusedParameters: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    strict: false,
    allowJs: true,
  })

  const [
    { default: EditorWorker },
    { default: TsWorker },
  ] = await Promise.all([
    // TODO 不要使用vite的功能
    import('monaco-editor/esm/vs/editor/editor.worker?worker' as any),
    import('monaco-editor/esm/vs/language/typescript/ts.worker?worker' as any),
  ])

  monaco.editor.defineTheme('dark', await import("./dark.json") as any)

  // monaco要求将worker挂载到window上
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorker(_: any, label: string) {
      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker()
      }
      return new EditorWorker()
    },
  }

  return { monaco }
}

export default setupMonaco

