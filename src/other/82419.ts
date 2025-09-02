import * as n from "react"
import * as s from "./6493"
export function A() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.progress) || 0)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onProgressChanged(i)
      return i(e.progress), () => t.cancel()
    }, [e]),
    t
  )
}
