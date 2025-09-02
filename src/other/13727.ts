import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

const o = (0, s.forwardRef)(({ name: e, style: t, size: n, className: s, onClick: r }, o) => {
  const l = a("nova-icon", `icon-${e}`, s, {
    [`nova-icon-${n}`]: void 0 !== n
  })
  return (0, i.jsx)("span", {
    className: l,
    style: t,
    onClick: r,
    ref: o
  })
})

export enum CheckmarkSize {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small"
}
export const I = o
