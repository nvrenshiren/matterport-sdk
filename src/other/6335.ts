import * as i from "react/jsx-runtime"
import r from "classnames"

import * as a from "react"
function o({ resource: e, className: t, children: n, onClick: s }) {
  const [o] = (function (e) {
      var t
      const [n, i] = (0, a.useState)(e.getCurrentValue()),
        [s, r] = (0, a.useState)(null === (t = e.validUntil) || void 0 === t ? void 0 : t.getTime()),
        o = !!s && s - Date.now() <= 0
      return (
        (0, a.useEffect)(() => {
          if (void 0 === s) return () => {}
          let t = !1
          const n = s - Date.now(),
            a = () => {
              e.get().then(n => {
                var s
                t || (i(n), r(null === (s = e.validUntil) || void 0 === s ? void 0 : s.getTime()))
              })
            }
          if (n <= 0) return a(), () => (t = !0)
          const o = window.setTimeout(a, n)
          return () => {
            ;(t = !0), window.clearTimeout(o)
          }
        }, [e, s]),
        (0, a.useEffect)(() => {
          i(e.getCurrentValue())
        }, [e]),
        [n, o]
      )
    })(e),
    l = o
      ? {
          backgroundImage: `url('${o}')`
        }
      : {}
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: r(t),
        style: l,
        onClick: s
      },
      {
        children: n
      }
    )
  )
}
export const X = o
