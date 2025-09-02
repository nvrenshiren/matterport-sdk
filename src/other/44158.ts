import * as n from "react"
import * as s from "./31981"
function a(e) {
  const t = (0, s.w)(),
    [i, a] = (0, n.useState)((null == t ? void 0 : t.getOrderedTags(e)) || [])
  return (
    (0, n.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        t && a(t.getOrderedTags(e))
      }
      const n = t.getOrderedTagViewMapFilter().onChanged(i)
      return i(), () => n.cancel()
    }, [t, e]),
    i
  )
}
export const k = a
