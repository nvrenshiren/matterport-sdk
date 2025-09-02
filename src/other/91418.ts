import * as i from "react/jsx-runtime"
import r from "classnames"

import * as a from "./17462"
var o = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
function l(e) {
  var { onToggle: t, className: n, label: s } = e,
    l = o(e, ["onToggle", "className", "label"])
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: r("settings-toggle", n)
      },
      {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "settings-label"
              },
              {
                children: s
              }
            )
          ),
          (0, i.jsx)(
            a.Z,
            Object.assign({}, l, {
              onToggle: () => {
                t(!l.toggled)
              }
            })
          )
        ]
      }
    )
  )
}
export const w = l
