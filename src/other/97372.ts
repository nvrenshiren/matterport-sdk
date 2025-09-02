import * as i from "react/jsx-runtime"
import * as s from "react"
import * as r from "react-dom"
import * as a from "react-popper"
import l from "classnames"

import * as c from "./54484"
import * as d from "./37056"
const uu = "PointerEvent" in window,
  h = uu ? "pointerenter" : "mouseenter",
  p = uu ? "pointerleave" : "mouseleave",
  m = ({
    children: e,
    offset: t,
    preventOverflow: n,
    placement: o = "top",
    strategy: u = "fixed",
    target: m,
    title: f,
    className: g,
    trigger: v = "hover",
    size: y,
    theme: b,
    onToggle: E,
    disabled: S,
    sticky: O = !1,
    arrow: T = !0
  }) => {
    const [_, w] = (0, s.useState)(null),
      [A, N] = (0, s.useState)(null),
      [I, P] = (0, s.useState)("static" === v),
      x = t || ("small" === y ? [0, 8] : [0, 14]),
      { styles: k, attributes: L } = (0, a.usePopper)(m, _, {
        placement: o,
        strategy: u,
        modifiers: T
          ? [
              {
                name: "arrow",
                options: {
                  element: A,
                  padding: "small" === y ? 4 : 6
                }
              },
              {
                name: "flip"
              },
              {
                name: "hide"
              },
              {
                name: "offset",
                options: {
                  offset: x
                }
              },
              {
                name: "preventOverflow",
                options: n
              }
            ]
          : [
              {
                name: "flip"
              },
              {
                name: "hide"
              },
              {
                name: "offset",
                options: {
                  offset: x
                }
              },
              {
                name: "preventOverflow",
                options: n
              }
            ]
      }),
      C = (0, c.Z)(m),
      D = (0, s.useCallback)(() => {
        P(!0), E && E(!0)
      }, [E]),
      R = (0, s.useCallback)(() => {
        P(!1), E && E(!1)
      }, [E]),
      M = (0, s.useCallback)(
        e => {
          e.stopPropagation(), R()
        },
        [R]
      )
    if (
      ((0, s.useEffect)(() => {
        P("static" === v)
      }, [v]),
      (0, s.useEffect)(() => {
        if (m && "hover" === v)
          return (
            S || m.addEventListener(h, D),
            m.addEventListener(p, R),
            () => {
              S || m.removeEventListener(h, D), m.removeEventListener(p, R)
            }
          )
      }, [m, S, v, D, R]),
      (0, s.useEffect)(() => {
        if (O) return
        const e = e => {
          if (m && _) {
            const t = e.composedPath(),
              n = !t.includes(m),
              i = !t.includes(_)
            n && i && R()
          }
        }
        return (
          I && v
            ? window.addEventListener("click", e, {
                capture: !0
              })
            : window.removeEventListener("click", e, {
                capture: !0
              }),
          () => {
            window.removeEventListener("click", e, {
              capture: !0
            })
          }
        )
      }, [m, _, I, v, R, O]),
      !I)
    )
      return null
    const j = l("nova-tooltip", g, {
        [`nova-tooltip-${b}`]: void 0 !== b,
        [`nova-tooltip-${y}`]: void 0 !== y
      }),
      U = L.popper ? L.popper["data-popper-placement"] : void 0
    return (0, i.jsx)(i.Fragment, {
      children: (0, r.createPortal)(
        (0, i.jsxs)(
          "div",
          Object.assign(
            {
              className: j,
              ref: w,
              role: "tooltip",
              style: k.popper
            },
            L.popper,
            {
              onClick: "static" === v ? M : void 0
            },
            {
              children: [
                f || e,
                T &&
                  (0, i.jsx)(d.c, {
                    ref: N,
                    style: k.arrow,
                    placement: U,
                    size: y,
                    theme: b
                  })
              ]
            }
          )
        ),
        C
      )
    })
  }
export const u = m
