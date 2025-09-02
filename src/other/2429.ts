import * as n from "react"
import * as s from "./54253"
import * as ss from "./74554"
function a() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)(e ? e.dockedAnnotation : null)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        i(e ? e.dockedAnnotation : null)
      }
      const n = e.onChanged(t)
      return t(), () => n.cancel()
    }, [e]),
    t
  )
}
;(0, ss.M)("dockedAnnotation", a)
export const Y = a
