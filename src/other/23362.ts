import * as s from "react"
import * as a from "./68473"
import * as ll from "./71652"
import * as o from "./71802"
import { TourTransitionTypes, TransitionType } from "../const/transition.const"

enum i {
  FastForwarding = "fast-forwarding",
  Idle = "idle",
  Completed = "completed",
  Paused = "paused",
  Playing = "playing",
  Rewinding = "rewinding",
  Skipping = "skipping"
}
const c = [i.FastForwarding, i.Playing, i.Rewinding]
function d() {
  var e
  const t = (0, s.useRef)(null),
    n = (0, ll.g)(),
    d = (0, a.j)(),
    u = (0, o.l)(),
    h = u.toIndex,
    p = -1 !== h && h !== d
  let m = i.Idle
  p
    ? (m = 0 === h && d === n - 1 ? i.FastForwarding : Math.abs(h - d) > 1 ? i.Skipping : h < d ? i.Rewinding : i.FastForwarding)
    : TourTransitionTypes.includes(u.type)
      ? (m = u.active ? i.Playing : i.Paused)
      : u.type === TransitionType.Move && u.active && (m = i.Rewinding)
  let f = !1
  if (((null === (e = t.current) || void 0 === e ? void 0 : e.index) !== d && (t.current = null), (m === i.Rewinding || m === i.FastForwarding) && t.current)) {
    const { animation: e, transition: n } = t.current
    if (n !== u) {
      const { started: t, stopped: s, duration: r } = n
      ;(s - t) / r >= 0.99 && ((f = !0), e === i.Rewinding && (m = i.Idle), (e !== i.Playing && e !== i.FastForwarding) || (m = i.Completed))
    }
  }
  return (
    c.includes(m)
      ? (t.current = {
          transition: u,
          animation: m,
          index: d
        })
      : f || (t.current = null),
    m
  )
}
export const T = d
export const l = i
