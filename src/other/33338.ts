import * as n from "react"
import * as s from "./31981"
function a(e) {
  return e ? e.getLinkHandler() : null
}
function o() {
  const e = (0, s.w)(),
    [t, i] = (0, n.useState)(a(e))
  return (0, n.useEffect)(() => (t || i(a(e)), () => {}), [e]), t
}

export const L = o
