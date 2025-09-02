import * as i from "react"
import * as s from "./27839"
import * as ss from "./74554"
function r() {
  const e = (0, s._)(),
    [t, n] = (0, i.useState)((null == e ? void 0 : e.getCurrentView()) || void 0)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        n((null == e ? void 0 : e.getCurrentView()) || void 0)
      }
      const i = e.onPropertyChanged("currentViewId", t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
;(0, ss.M)("activeModelView", r)
export const K = r
