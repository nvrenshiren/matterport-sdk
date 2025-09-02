import * as n from "react"
import * as s from "./36773"
import { NotesPhase } from "../const/38965"
export function Y() {
  const e = (0, s.Q)(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.notesPhase) || NotesPhase.CLOSED)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onNotesPhaseChanged(i)
      return i(e.notesPhase), () => t.cancel()
    }, [e]),
    t
  )
}
