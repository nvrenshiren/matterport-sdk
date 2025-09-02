import r from "classnames"
import * as i from "react/jsx-runtime"

import * as o from "./66102"
import * as l from "./84426"
import { PhraseKey } from "../const/phrase.const"
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
const { CLOSE_BUTTON_TOOLTIP_MESSAGE: d } = PhraseKey.REUSABLES
function u(e) {
  var { variant: t = l.Wu.TERTIARY, tooltip: n, onClose: s, className: a } = e,
    u = c(e, ["variant", "tooltip", "onClose", "className"])
  const h = (0, o.b)(),
    p = u.label || h.t(d),
    m = u.label ? void 0 : p,
    f = u.icon || "close"
  return (0, i.jsx)(
    l.zx,
    Object.assign(
      {
        className: r("close-button", a),
        icon: f,
        ariaLabel: p,
        tooltip: m,
        variant: t,
        onKeyDown: function (e) {
          s && "Escape" === e.code && (e.stopPropagation(), s())
        },
        onClick: s
      },
      u
    )
  )
}
export const P = u
