import * as n from "react"
import * as s from "./36773"
export function h() {
  const e = (0, s.Q)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.activeNotation) || null)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onActiveNotationChanged(i)
      return () => t.cancel()
    }, [e]),
    t
  )
}
