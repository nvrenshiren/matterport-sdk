import * as i from "react"
import * as s from "./76092"
function r() {
  const e = (0, s.c)(),
    [t, n] = (0, i.useState)(e ? e.pose.pitchFactor() : 1)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onChanged(() => {
        n(e.pose.pitchFactor())
      })
      return (
        n(e.pose.pitchFactor()),
        () => {
          t.cancel()
        }
      )
    }, [e]),
    t
  )
}

export const j = r
