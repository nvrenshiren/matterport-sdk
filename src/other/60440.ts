import * as i from "react"
import * as s from "./76185"
function r() {
  const e = (0, s.h)(),
    [t, n] = (0, i.useState)([])
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && n(e.getSelectedItems())
      }
      const i = e.onSelectedItemsChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
export const M = r
