import * as i from "react"
import * as s from "./43771"
function r() {
  const e = (0, s.s)(),
    [t, n] = (0, i.useState)(null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.currentModeObservable.onChanged(n)
      return n(e.currentMode), () => t.cancel()
    }, [e]),
    t
  )
}
export const B = r
