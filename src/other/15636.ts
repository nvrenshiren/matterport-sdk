import a from "classnames"
import * as i from "react"
import * as s from "react/jsx-runtime"

import * as o from "./49627"
import * as c from "./51978"
import * as u from "./69041"
import * as d from "./84426"
import { AppReactContext } from "../context/app.context"
var h = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const p = (0, i.forwardRef)((e, t) => {
  var {
      className: n,
      tooltip: r,
      children: p,
      onClick: m,
      closeButton: f,
      nudgeTitle: g,
      nudgeMessage: v,
      nudgeSize: y = "medium",
      nudgeDisabled: b = !1,
      showTimeout: E = 5e3,
      dismissTimeout: S = 5e3,
      nudgeFeatureKey: O = "",
      nudgeLocalStorage: T = "",
      nudgeSessionKey: _ = "",
      onNudgeDismissed: w,
      featured: A = !1
    } = e,
    N = h(e, [
      "className",
      "tooltip",
      "children",
      "onClick",
      "closeButton",
      "nudgeTitle",
      "nudgeMessage",
      "nudgeSize",
      "nudgeDisabled",
      "showTimeout",
      "dismissTimeout",
      "nudgeFeatureKey",
      "nudgeLocalStorage",
      "nudgeSessionKey",
      "onNudgeDismissed",
      "featured"
    ])
  const { settings: I } = (0, i.useContext)(AppReactContext),
    [P, x] = (0, i.useState)(!1),
    [k, L] = (0, o._)(T, !1),
    C = (0, c.y)(_, !1),
    D = (0, c.y)(O, !1),
    R = (0, i.useRef)(0),
    M = (0, i.useRef)(0),
    j = !(!g && !v)
  function U() {
    if (!j || P || b) return !1
    return (!O || D) && !(!!T && k) && !(!!_ && C)
  }
  const F = () => {
    j &&
      (window.clearTimeout(R.current),
      (R.current = 0),
      window.clearTimeout(M.current),
      (M.current = 0),
      P && (T && L(!0), _ && I.setProperty(_, !0), w && w(), x(!1)))
  }
  function H() {
    if (!j) return
    const e = R.current || M.current
    U() &&
      !e &&
      (R.current = window.setTimeout(() => {
        ;(R.current = 0), U() && x(!0)
      }, E))
  }
  ;(0, i.useImperativeHandle)(
    t,
    () => ({
      dismissNudge: () => {
        F()
      }
    }),
    []
  ),
    (0, i.useEffect)(() => {
      b ? F() : H()
    }, [b]),
    (0, i.useEffect)(() => {
      P && (M.current = window.setTimeout(F, S))
    }, [P]),
    (0, i.useEffect)(
      () => (
        H(),
        () => {
          F()
        }
      ),
      []
    )
  let B
  if (j) {
    const e = void 0 !== f ? f : !!g
    B = (0, s.jsx)(u.p, {
      title: g,
      message: v,
      closeButton: e,
      className: A ? "nudge-featured" : void 0
    })
  }
  const V = P ? B : r,
    G = {
      trigger: P ? "static" : "hover",
      onToggle: e => {
        j && (e || F())
      },
      theme: P ? "light" : "dark",
      size: P ? y : "small",
      className: "nudge-button-tooltip"
    },
    W = a("nudge-button", n)
  return (0, i.createElement)(
    d.zx,
    Object.assign({}, N, {
      key: `nudge-button-${r}`,
      onClick: e => {
        F(), m && m(e)
      },
      className: W,
      tooltip: V,
      tooltipOptions: G
    }),
    p
  )
})
export const L = p
