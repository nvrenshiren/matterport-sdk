import * as i from "react"
import { useData } from "./45755"
function r(e, t, n) {
  return () => a(e, t, n)
}
function a(e, t, n) {
  const r = useData(e),
    [a, o] = (0, i.useState)(r ? r[t] : n)
  return (
    (0, i.useEffect)(() => {
      if (!r) return () => {}
      const e = r.onPropertyChanged(t, o)
      return o(r[t]), () => e.cancel()
    }, [r, t]),
    a
  )
}
export const M = r
export const v = a
