import qs from "querystring"

export interface MdQuery {
  component?: string
  vue?: boolean
}

export function parseRequest(
  id: string
): { filename: string; query: MdQuery } {
  let query = {} as MdQuery
  const realFilenam = id.replace(/_(DemoComponent\d+)./, (_, s1) => {
    query.component = s1
    return "."
  })
  // vue had ?vue&type=template...
  const [noQueryFilename, rawQuery] = realFilenam.split(`?`, 2)
  query = Object.assign(qs.parse(rawQuery) as MdQuery, query)
  if (query.vue != null) {
    query.vue = true
  }
  return {
    filename: noQueryFilename,
    query
  }
}
