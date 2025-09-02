import * as i from "react"
import * as s from "./31981"
import * as ss from "./74554"
function r() {
  const e = (0, s.w)(),
    [t, n] = (0, i.useState)(!!e && e.creatingTag)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onPropertyChanged("creatingTag", n)
      return n(e.creatingTag), () => t.cancel()
    }, [e]),
    t
  )
}
;(0, ss.M)("creatingTag", r)
export const v = r
