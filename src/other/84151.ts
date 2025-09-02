import r from "classnames"
import * as s from "react"
import * as a from "react-dom"
import * as n from "react/jsx-runtime"

import * as u from "./14355"
import * as c from "./38490"
import * as l from "./84426"
import { CloseModalCommand } from "../command/ui.command"
import { AppReactContext } from "../context/app.context"
function m(e) {
  const { children: t, className: i, title: o, open: m, onClose: p, fullModal: g } = e,
    { commandBinder: v, mainDiv: y } = (0, s.useContext)(AppReactContext)
  let f = !1
  const w = (0, s.useCallback)(() => {
      v.issueCommand(new CloseModalCommand()), p && p()
    }, [v, p]),
    b = (0, s.useCallback)(() => {
      ;(f = !0),
        window.setTimeout(() => {
          f = !1
        }, 500)
    }, []),
    T = (0, s.useCallback)(() => {
      f && ((f = !1), w())
    }, [w]),
    C = y.querySelector("#react-render-root") || document.body,
    E = r(i, { open: m, "full-modal": g })
  return (0, a.createPortal)(
    (0, n.jsx)(
      u.N,
      Object.assign(
        { open: m, className: r("modal-background", { open: m }), onPointerUp: T, onPointerDown: b },
        {
          children: (0, n.jsxs)(
            l.Vq,
            Object.assign(
              { className: E, onClose: w },
              {
                children: [
                  (0, n.jsxs)(
                    "header",
                    Object.assign(
                      { className: "modal-header" },
                      { children: [(0, n.jsx)("div", Object.assign({ className: "modal-title" }, { children: o })), (0, n.jsx)(c.P, { onClose: w })] }
                    )
                  ),
                  t
                ]
              }
            )
          )
        }
      )
    ),
    C
  )
}
export const H = m
