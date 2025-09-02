import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

import * as or from "./86388"
function l({ className: e, outerLeft: t, children: n, outerRight: r, small: l = !1 }) {
  const c = (0, s.useRef)(null)
  ;(0, or.Z)({
    ref: c
  })
  let d = !!t != !!r
  if (d && c.current) {
    const e = c.current.offsetWidth,
      t = l ? 40 : 55
    c.current.children[1].offsetWidth + 2 * t + 12 > e && (d = !1)
  }
  const u = a("action-bar", e, {
      "fill-outer-space": d
    }),
    h = a("action-bar-outer", "action-bar-outer-left", {
      "action-bar-outer-large": !l
    }),
    p = a("action-bar-outer", "action-bar-outer-right", {
      "action-bar-outer-large": !l
    })
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "overlay-action-bar"
      },
      {
        children: (0, i.jsxs)(
          "div",
          Object.assign(
            {
              ref: c,
              className: u
            },
            {
              children: [
                (0, i.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: h
                    },
                    {
                      children: t
                    }
                  )
                ),
                (0, i.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "action-bar-cta"
                    },
                    {
                      children: n
                    }
                  )
                ),
                (0, i.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: p
                    },
                    {
                      children: r
                    }
                  )
                )
              ]
            }
          )
        )
      }
    )
  )
}
export const o = l
