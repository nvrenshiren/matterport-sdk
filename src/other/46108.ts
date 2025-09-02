import * as i from "react/jsx-runtime"
import * as s from "./15258"
import * as r from "./86191"
import * as a from "./84426"
function o({ layer: e, active: t, onClick: n }) {
  const { id: o } = e,
    l = (0, s.K)(),
    c = (0, r.W)(o, l),
    d = t ? "checkmark" : void 0
  return (0, i.jsx)(a.zx, {
    className: "layer-item",
    label: c,
    icon: d,
    active: t,
    variant: a.Wu.TERTIARY,
    size: a.qE.SMALL,
    onClick: () => {
      n(o)
    }
  })
}
export const H = o
