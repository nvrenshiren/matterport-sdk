import * as i from "react"
import * as s from "./20334"
import * as ss from "./74554"
function r() {
  const e = (0, s.I)(),
    [t, n] = (0, i.useState)(e ? e.currentFloorId : null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = () => {
          const t = e.currentFloorId
          n(t)
        },
        i = e.makeFloorChangeSubscription(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}

;(0, ss.M)("currentFloorId", r)
export const R = r
