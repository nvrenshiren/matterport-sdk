import * as i from "react"
import * as a from "./27839"
import * as s from "./51978"
import { ObjectInsightsFeatureKey } from "./96776"
function o() {
  const e = (0, a._)(),
    t = (0, s.y)(ObjectInsightsFeatureKey, !1),
    [n, o] = (0, i.useState)((null == e ? void 0 : e.getOrderedModelViews(t)) || [])
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function n() {
        o((null == e ? void 0 : e.getOrderedModelViews(t)) || [])
      }
      const i = e.onModelViewsChanged(n)
      return n(), () => i.cancel()
    }, [e, t]),
    n
  )
}
export const X = o
