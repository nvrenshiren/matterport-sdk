import * as i from "react/jsx-runtime"
import r from "classnames"

import * as a from "./38490"
import * as o from "./84426"
function l({ title: e, message: t, children: n, closeButton: s = !1, className: l, onClose: c }) {
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: r("nudge", l)
      },
      {
        children: [
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: r("nudge-header", {
                  "nudge-with-title": !!e
                })
              },
              {
                children: [
                  e &&
                    (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "nudge-title"
                        },
                        {
                          children: e
                        }
                      )
                    ),
                  s &&
                    (0, i.jsx)(a.P, {
                      className: "nudge-close-button",
                      size: o.qE.SMALL,
                      onClose: c
                    })
                ]
              }
            )
          ),
          t &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: r("nudge-message", {
                    "nudge-message-with-title": e
                  })
                },
                {
                  children: t
                }
              )
            ),
          n
        ]
      }
    )
  )
}
export const p = l
