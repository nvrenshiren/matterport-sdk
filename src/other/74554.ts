import * as i from "react/jsx-runtime"
import * as s from "react"
function r(e, t) {
  return n =>
    (0, s.forwardRef)((s, r) => {
      const a = t(),
        o = Object.assign(Object.assign({}, s), {
          [e]: a
        })
      return (0, i.jsx)(
        n,
        Object.assign({}, o, {
          ref: r
        })
      )
    })
}
export const M = r
