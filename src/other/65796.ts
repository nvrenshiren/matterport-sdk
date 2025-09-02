import * as n from "react"
import * as s from "./66102"
import * as a from "./1358"
import * as o from "./84784"
function r(e) {
  const t = (0, a.S)(),
    i = (0, s.b)(),
    [r, d] = (0, n.useState)((0, o.LN)(e, i, t))
  return (
    (0, n.useEffect)(() => {
      if (!t) return () => {}
      function n() {
        d((0, o.LN)(e, i, t))
      }
      const s = t.onRoomsChanged({ onUpdated: n })
      return n(), () => s.cancel()
    }, [i, t, e]),
    r
  )
}
export const g = r
