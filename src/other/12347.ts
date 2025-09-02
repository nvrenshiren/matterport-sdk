import * as n from "react"
import * as s from "./6493"
export function z() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)(!!e && e.canPlace)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onCanPlaceChanged(i)
      return i(e.canPlace), () => t.cancel()
    }, [e]),
    t
  )
}
