import * as i from "react"
import * as s from "./94859"
function r(e) {
  const t = (0, s.O)(),
    [n, r] = (0, i.useState)((null == t ? void 0 : t.getPolicy(e)) || null)
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function n() {
        r((null == t ? void 0 : t.getPolicy(e)) || null)
      }
      const i = t.onChanged(n)
      return n(), () => i.cancel()
    }, [t]),
    n
  )
}
export const a = r
