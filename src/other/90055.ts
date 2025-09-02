import * as i from "./73085"
import * as s from "react"
import * as r from "./27839"
import { LayersData } from "../data/layers.data"
;(0, i.M)(LayersData, "activeLayerId", "")
function o() {
  const e = (0, r._)(),
    [t, n] = (0, s.useState)(null == e ? void 0 : e.getActiveLayer())
  return (
    (0, s.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        n(null == e ? void 0 : e.getActiveLayer())
      }
      const i = e.onPropertyChanged("activeLayerId", t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
export const LP = o
