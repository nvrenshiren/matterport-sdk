import * as i from "react"
import * as s from "./75377"
function r(e) {
  const t = (0, s.J)(),
    [n, r] = (0, i.useState)((null == t ? void 0 : t.getGroupInfoBySid(e)) || null)
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function n() {
        r((null == t ? void 0 : t.getGroupInfoBySid(e)) || null)
      }
      const i = t.onDataChanged(n)
      return n(), () => i.cancel()
    }, [t, e]),
    n
  )
}
export const l = r
