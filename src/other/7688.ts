import * as n from "react"
import * as s from "./7439"
function a() {
  return c("pendings")
}
function o() {
  return c("removals")
}
function r() {
  return c("uploads")
}
function d() {
  return c("failures")
}
function c(e) {
  const t = (0, s.g)(),
    [i, a] = (0, n.useState)(l(t, e))
  return (
    (0, n.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        a(l(t, e))
      }
      const n = t[e].onChanged(i)
      return i(), () => n.cancel()
    }, [t, e]),
    i
  )
}
function l(e, t) {
  return e ? e[t].values : []
}

export const a_ = a
export const eB = d
export const fo = r
export const rc = o
