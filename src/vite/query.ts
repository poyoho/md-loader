export interface MdQuery {
  component?: string
}

export function parseRequest(
  id: string
): { filename: string; query: MdQuery } {
  let query = {} as MdQuery
  const filename = id.replace(/_(DemoComponent\d+)./, (_, s1) => {
    query.component = s1
    return "."
  })
  return {
    filename,
    query
  }
}
