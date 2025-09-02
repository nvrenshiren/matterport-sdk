import * as s from "react"
import * as i from "react/jsx-runtime"
import * as d from "./15636"
import * as o from "./40216"
import * as c from "./84426"
import * as r from "./95941"
import * as a from "./96403"
import { ToolPanelLayout } from "../const/tools.const"
var u = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
function h(e) {
  var { active: t, nudgeDisabled: n, className: h, theme: p = "overlay", variant: m = c.Wu.TERTIARY, size: f } = e,
    g = u(e, ["active", "nudgeDisabled", "className", "theme", "variant", "size"])
  const { outOfScope: v } = (0, s.useContext)(r.H),
    y = (0, a.B)(),
    b = (0, o.T)() === ToolPanelLayout.BOTTOM_PANEL && !!y
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: h
      },
      {
        children: (0, i.jsx)(
          d.L,
          Object.assign({}, g, {
            nudgeDisabled: v || b,
            variant: m,
            theme: p,
            active: t,
            featured: !0
          })
        )
      }
    )
  )
}
export const $ = h
