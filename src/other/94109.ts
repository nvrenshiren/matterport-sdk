import a from "classnames"
import * as s from "react/jsx-runtime"

import * as n from "./56064"
import * as d from "./62944"
import * as h from "./66102"
import * as r from "./84426"
import * as c from "../const/78283"
import { UnitTypeKey } from "../utils/unit.utils"
function u({ children: t, containerClass: e, titleKey: i, measurementsInMetric: o, measurementType: u, isHideable: m, visible: g, onToggle: y }) {
  const b = (0, n.O)(),
    x = (0, h.b)()
  let S = []
  if (u === d.RV.AREA) {
    const t = b === UnitTypeKey.IMPERIAL ? d.QK : d.G8
    S = o
      .filter(t => !isNaN(t))
      .map((e, i) => {
        const o = b === UnitTypeKey.IMPERIAL ? Math.round((0, c.Nv)(e)) : Math.round(10 * e) / 10
        return (0, s.jsx)(f, { measure: o, unit: t }, i)
      })
  } else
    u === d.RV.DISTANCE &&
      (S = o
        .filter(t => !isNaN(t))
        .map((t, e) => {
          const i = []
          if ((e > 0 && i.push((0, s.jsx)(v, {}, `${e}_sep`)), b === UnitTypeKey.IMPERIAL)) {
            const { feet: o, inches: a } = (0, c.XJ)(t)
            o > 0
              ? i.push((0, s.jsx)(f, { measure: o, unit: d.B5 }, e), (0, s.jsx)(f, { measure: a, unit: d.FP }, `${e}_minor`))
              : i.push((0, s.jsx)(f, { measure: a, unit: d.FP }, e))
          } else i.push((0, s.jsx)(f, { measure: t.toFixed(2), unit: d.Ep }, e))
          return i
        })
        .flat())
  const E = g ? "eye-show" : "eye-hide",
    M = x.t(i)
  return (0, s.jsxs)(
    "div",
    Object.assign(
      { className: a("room-detail", e) },
      {
        children: [
          (0, s.jsx)("div", Object.assign({ className: "p5" }, { children: M })),
          (0, s.jsxs)(
            "div",
            Object.assign(
              { className: "room-detail-info" },
              { children: [(0, s.jsx)(p, { measures: S, dimmed: !g }), m && (0, s.jsx)(r.zx, { icon: E, active: !0, onClick: y })] }
            )
          ),
          t
        ]
      }
    )
  )
}
function p({ measures: t, dimmed: e }) {
  return 0 === t.length
    ? (0, s.jsx)(m, {})
    : (0, s.jsx)("div", Object.assign({ className: ("multi-pretty-measure-container " + (e ? "dimmed" : "")).trim() }, { children: t }))
}
function m() {
  return (0, s.jsx)(
    "div",
    Object.assign({ className: "pretty-measure-container" }, { children: (0, s.jsx)("div", Object.assign({ className: "p5" }, { children: "n/a" })) })
  )
}
function f({ measure: t, unit: e }) {
  return (0, s.jsxs)(
    "div",
    Object.assign(
      { className: "pretty-measure-container" },
      {
        children: [
          (0, s.jsx)("div", Object.assign({ className: "h5 measure" }, { children: t })),
          (0, s.jsx)("div", Object.assign({ className: "p5 unit" }, { children: e }))
        ]
      }
    )
  )
}
function v() {
  return (0, s.jsx)("div", Object.assign({ className: "p5 separator" }, { children: d.RQ }))
}
export const d0 = u
