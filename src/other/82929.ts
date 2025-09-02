import * as n from "react"
import * as s from "./6493"
export function u() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)(!!e && e.canAdd)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onCanAddChanged(i)
      return i(e.canAdd), () => t.cancel()
    }, [e]),
    t
  )
}
