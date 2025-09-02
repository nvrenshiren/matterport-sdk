import * as i from "react"
import * as s from "./27839"
function r(e) {
  if (!e) return []
  const t = e.viewLayers()
  return t.length > 1 && t.unshift(t.splice(t.length - 1, 1)[0]), t
}
function a() {
  const e = (0, s._)(),
    [t, n] = (0, i.useState)(r(e))
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        n(r(e))
      }
      const i = e.onCurrentLayersChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
export const Y = a
