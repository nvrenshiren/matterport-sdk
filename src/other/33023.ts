import * as i from "react"
import * as s from "./29113"
function r(e) {
  const t = (0, s.w)(),
    [n, r] = (0, i.useState)((null == t ? void 0 : t.getTool(e)) || null)
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      const n = t.onChanged(() => r((null == t ? void 0 : t.getTool(e)) || null))
      return () => n.cancel()
    }, [t]),
    n
  )
}

export const Q = r
