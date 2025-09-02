import * as i from "react"
import * as s from "./20334"
function r() {
  const e = (0, s.I)(),
    [t, n] = (0, i.useState)(!!e && e.showFloorSelection)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onShowFloorSelectionChanged(n)
      return n(e.showFloorSelection), () => t.cancel()
    }, [e]),
    t
  )
}

export const d = r
