import * as r from "react/jsx-runtime"
import o from "classnames"

import * as l from "react"
import * as c from "./13727"
import * as d from "./97372"
enum i {
  FAB = "fab",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary"
}
enum s {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small"
}
const u = (0, l.forwardRef)(
  (
    {
      ariaLabel: e,
      ariaDescribedBy: t,
      ariaRole: n = "button",
      ariaHasPopup: i,
      ariaExpanded: s = !1,
      children: a,
      appendChildren: u = !0,
      className: h,
      dataAttribute: p,
      id: m,
      disabled: f = !1,
      dimmed: g = !1,
      active: v = !1,
      icon: y,
      iconSize: b,
      reverse: E,
      label: S,
      onClick: O,
      onPointerDown: T,
      onPointerUp: _,
      onKeyDown: w,
      size: A,
      style: N,
      theme: I = "light",
      tooltip: P,
      tooltipOptions: x = {},
      variant: k
    },
    L
  ) => {
    const [C, D] = (0, l.useState)(null),
      R = void 0 === S && void 0 === a,
      M = y && (S || a)
    ;(0, l.useImperativeHandle)(
      L,
      () => ({
        focus: () => {
          C && C.focus()
        }
      }),
      []
    )
    const j = e || S || ("string" == typeof P ? P : void 0),
      U = o(
        h,
        "mp-nova-btn",
        {
          [`mp-nova-btn-${k}`]: void 0 !== k
        },
        {
          [`mp-nova-btn-${I}`]: void 0 !== I
        },
        {
          [`mp-nova-btn-${A}`]: void 0 !== A
        },
        {
          "mp-nova-btn-icon": R
        },
        {
          "mp-nova-btn-multi": M
        },
        {
          "mp-nova-btn-reverse": E
        },
        {
          "mp-nova-disabled": f
        },
        {
          "mp-nova-btn-dimmed": g
        },
        {
          "mp-nova-active": v
        },
        {
          "mp-nova-aria-missing": !j
        }
      )
    return (0, r.jsxs)(r.Fragment, {
      children: [
        (0, r.jsxs)(
          "button",
          Object.assign(
            {
              className: U,
              onClick: O,
              onPointerDown: T,
              onPointerUp: _,
              disabled: f,
              "aria-disabled": f,
              ref: D,
              style: N,
              onKeyDown: w,
              tabIndex: f ? void 0 : 0,
              id: m,
              "data-attribute": p,
              "aria-label": j,
              "aria-expanded": s,
              "aria-haspopup": i,
              "aria-describedby": t,
              role: n
            },
            {
              children: [
                !u && a,
                y &&
                  (0, r.jsx)(c.I, {
                    name: y,
                    size: b
                  }),
                S &&
                  (0, r.jsx)(
                    "span",
                    Object.assign(
                      {
                        className: "mp-nova-btn-label"
                      },
                      {
                        children: S
                      }
                    )
                  ),
                u && a
              ]
            }
          )
        ),
        P &&
          (0, r.jsx)(
            d.u,
            Object.assign(
              {
                target: C,
                title: P,
                disabled: f
              },
              x
            )
          )
      ]
    })
  }
)
export const zx = u
export const qE = s
export const Wu = i
