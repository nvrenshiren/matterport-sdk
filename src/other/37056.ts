import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

const o = (0, s.forwardRef)(({ theme: e, style: t, size: n = "small", placement: s = "top" }, r) => {
  const o = a("nova-popper-arrow", {
    [`nova-theme-${e}`]: void 0 !== e,
    [`nova-size-${n}`]: void 0 !== n
  })
  return (0, i.jsx)("div", {
    className: o,
    style: t,
    "data-popper-placement": s,
    ref: r
  })
})
export const c = o
