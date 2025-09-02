import * as n from "react"
import * as s from "./6493"
export function v() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.screenPosition) || null)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onScreenPositionChanged(i)
      return i(e.screenPosition), () => t.cancel()
    }, [e]),
    t
  )
}
