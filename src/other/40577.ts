import * as i from "react"
import * as s from "./20334"
function r(e) {
  const t = (0, s.I)(),
    [n, r] = (0, i.useState)(t && null !== e ? t.getViewData(e) : null)
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      if (e) {
        const n = t.getViewData(e)
        r(n)
      } else r(null)
      return () => {}
    }, [t, e]),
    n
  )
}
export const q = r
