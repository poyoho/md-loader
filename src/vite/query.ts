import qs from "querystring"

export interface MdQuery {
  component?: string
}

export function parseRequest(
  id: string
): { filename: string; query: MdQuery } {
  const [filename, rawQuery] = id.split(`?`, 2)
  const query = qs.parse(rawQuery) as MdQuery

  return {
    filename,
    query
  }
}
