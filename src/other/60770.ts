import * as s from "react/jsx-runtime"
import * as r from "react"
import o from "classnames"

import * as l from "./84426"
import * as c from "./15636"
var i,
  dd = function (e, t) {
    var n = {}
    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var s = 0
      for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
        t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
    }
    return n
  }
i = {
  ADD: "plus",
  CANCEL: "cancel",
  CONFIRM: "checkmark"
}
const u = (0, r.forwardRef)((e, t) => {
  var { addIcon: n, className: a } = e,
    u = dd(e, ["addIcon", "className"])
  const h = (0, r.useRef)(null)
  ;(0, r.useImperativeHandle)(
    t,
    () => ({
      dismissNudge: () => {
        h.current && h.current.dismissNudge()
      }
    }),
    []
  )
  const p = n === i.CANCEL,
    m = p ? i.ADD : n,
    f = o("add-button", a, {
      "add-cancel": p
    })
  return (0, s.jsx)(
    c.L,
    Object.assign({}, u, {
      ref: h,
      className: f,
      variant: l.Wu.FAB,
      icon: m,
      theme: "dark",
      featured: !0
    })
  )
})

export const H = u
export const d = i
