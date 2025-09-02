import * as i from "react"
import * as s from "./27839"
function r() {
  const e = (0, s._)(),
    [t, n] = (0, i.useState)(!!(null == e ? void 0 : e.isModelLayered()))
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        n(!!(null == e ? void 0 : e.isModelLayered()))
      }
      const i = e.onModelViewsChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
export const T = r
