import * as n from "react"
import * as s from "./36773"
import * as a from "../const/notes.const"
function o() {
  const e = (0, s.Q)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.notesFilter) || a.$.OPEN)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onNotesFilterChanged(i)
      return () => t.cancel()
    }, [e]),
    t
  )
}
export const g = o
