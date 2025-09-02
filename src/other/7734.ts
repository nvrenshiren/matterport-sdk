import * as i from "react"
import * as s from "./28121"
import * as r from "./43771"
import * as a from "./61531"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
function l(e, t) {
  return !(!e || !t) && e.isInside() && t.isSweepUnaligned(t.currentSweep)
}
function c() {
  const e = (0, s.P)(),
    t = (0, r.s)(),
    [n, c] = (0, i.useState)(l(t || void 0, e || void 0))
  function d() {
    e && t && c(l(t, e))
  }
  return (
    (0, a.U)(EndSwitchViewmodeMessage, d),
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.makeSweepChangeSubscription(d)
      return d(), () => t.cancel()
    }, [e]),
    n
  )
}
export const q = c
