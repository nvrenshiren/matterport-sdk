import * as n from "react"
import * as s from "./31981"
export function P() {
  const e = (0, s.w)(),
    [t, i] = (0, n.useState)(e ? e.openTagView : null)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onOpenTagViewChanged(i)
      return i(e.openTagView), () => t.cancel()
    }, [e]),
    t
  )
}
