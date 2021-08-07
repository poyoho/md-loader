// web worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module 'monaco-editor-core/esm/vs/editor/editor.worker' {
  export function initialize(foreignModule: any): void;
}
