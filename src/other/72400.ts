import * as s from "react"
import * as i from "react/jsx-runtime"
import * as a from "./84426"
import { AppReactContext } from "../context/app.context"
function o(e) {
  const { locale: t } = (0, s.useContext)(AppReactContext),
    { id: n, visible: o, showTooltip: l, hideTooltip: c, dimmed: d, disabled: u, tooltipOptions: h, onClick: p } = e,
    m = (0, s.useCallback)(
      e => {
        e.stopPropagation(), d || p(n)
      },
      [n, p, d]
    ),
    f = o ? "eye-show" : "eye-hide",
    g = u ? void 0 : t.t(o ? c : l)
  return (0, i.jsx)(a.zx, {
    icon: f,
    variant: a.Wu.TERTIARY,
    dimmed: d,
    disabled: u,
    tooltip: g,
    tooltipOptions: h || {
      placement: "bottom-end"
    },
    id: n,
    onClick: m
  })
}
export const Z = o
