import * as n from "react"
import * as s from "./6493"
import { PinEditorState } from "../const/62612"
export function P() {
  const e = (0, s.P)(),
    [t, i] = (0, n.useState)(e ? e.pinEditorState : PinEditorState.IDLE)
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onPinEditorStateChanged(i)
      return () => t.cancel()
    }, [e]),
    t
  )
}
