import * as i from "react"
import { AppReactContext } from "../context/app.context"
import * as a from "./38242"
import * as o from "./40216"
import * as l from "./84426"
import { winCanTouch } from "../utils/browser.utils"
var c = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const d = winCanTouch()
function u(e) {
  const { ariaLabel: t, tooltip: n, tooltipPlacement: s = "bottom", preventOverflow: u, analytic: h, children: p, popupSize: m, onOpenPopup: f } = e,
    g = c(e, ["ariaLabel", "tooltip", "tooltipPlacement", "preventOverflow", "analytic", "children", "popupSize", "onOpenPopup"]),
    { analytics: v } = (0, i.useContext)(AppReactContext),
    [y, b] = (0, i.useState)(!1),
    E = (0, a.e)(),
    S = (0, o.T)()
  ;(0, i.useEffect)(() => {
    y && b(!1)
  }, [S])
  const O = !(!y || !p),
    T = d || O ? "static" : "hover"
  let _
  O ? (_ = p) : (d && !y) || (_ = n)
  const w = {
      placement: s,
      preventOverflow: O ? u : void 0,
      onToggle: e => {
        e || b(e)
      },
      trigger: T,
      theme: O ? "light" : "dark",
      size: O ? m : "small"
    },
    A = `button-tooltip-${n}-${T}`,
    N = t || g.label || n
  return (0, i.createElement)(
    l.zx,
    Object.assign({}, g, {
      key: A,
      ariaLabel: N,
      onClick: e => {
        e.stopPropagation(),
          y ||
            (h &&
              v.trackGuiEvent(h, {
                tool: E
              }),
            f && f()),
          b(!y)
      },
      tooltip: _,
      tooltipOptions: w
    })
  )
}
export const P = u
