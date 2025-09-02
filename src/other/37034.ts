import * as n from "react"
import * as s from "./36676"
function a() {
  const e = (0, s.s)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.getKeywordFilters()) || [])
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && i(e.getKeywordFilters())
      }
      const n = e.keywordFilters.onChanged(t)
      return t(), () => n.cancel()
    }, [e]),
    t
  )
}
export const f = a
