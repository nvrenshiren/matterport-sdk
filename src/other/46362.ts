import * as n from "react"
import * as ss from "./36676"
function a() {
  const e = (0, ss.s)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.getResults()) || [])
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && i(e.getResults())
      }
      const n = e.onSearchResultsChanged(t)
      return t(), () => n.cancel()
    }, [e]),
    t
  )
}
export const s = a
