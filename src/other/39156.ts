import * as i from "react/jsx-runtime"
import * as s from "./16326"
import * as r from "./84426"
import * as a from "./46108"
function o({ label: e, icon: t, onClick: n, children: o, disabled: l = !1 }) {
  const c = (0, s.Y)()
  return (0, i.jsxs)(
    r.xz,
    Object.assign(
      {
        ariaLabel: e,
        label: e,
        icon: t,
        disabled: l,
        variant: r.Wu.TERTIARY,
        size: r.qE.SMALL,
        menuXOffset: 50
      },
      {
        children: [
          c.map(e =>
            (0, i.jsx)(
              a.H,
              {
                layer: e,
                onClick: n
              },
              e.id
            )
          ),
          o
        ]
      }
    )
  )
}
export const u = o
