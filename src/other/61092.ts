import * as n from "react"
import * as s from "./36773"
function a(e) {
  return e ? e.getTextParser() : null
}
function o() {
  const e = (0, s.Q)(),
    [t, i] = (0, n.useState)(a(e))
  return (0, n.useEffect)(() => (t || i(a(e)), () => {}), [e]), t
}

export const l = o
