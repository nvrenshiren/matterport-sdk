import * as i from "react"
import * as s from "./75377"
function r() {
  const e = (0, s.J)(),
    [t, n] = (0, i.useState)(e ? e.selectedGroupSid : null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && n(e.selectedGroupSid)
      }
      const i = e.onSelectedGroupIndexChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
export const m = r
