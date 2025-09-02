import * as n from "react"
import * as s from "./20334"
function a(e) {
  return e ? e.floors.getOrderedValues() : []
}
function o() {
  const e = (0, s.I)(),
    [t, i] = (0, n.useState)(a(e))
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = () => i(a(e)),
        n = e.floors.getCollection().onChanged(t)
      return t(), () => n.cancel()
    }, [e]),
    t
  )
}
export const W = o
