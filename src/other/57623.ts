import * as n from "react"
import * as s from "./36773"
import * as ss from "./74554"
function a() {
  const e = (0, s.Q)(),
    [t, i] = (0, n.useState)(e ? e.openNoteView : null)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onOpenNoteViewChanged(i)
      return i(e.openNoteView), () => t.cancel()
    }, [e]),
    t
  )
}
;(0, ss.M)("openNoteView", a)
export const M = a
