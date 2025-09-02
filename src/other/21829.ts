import o from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as p from "./38242"
import * as l from "./69092"
import * as c from "./76185"
import * as m from "./84426"
import { AnnotationsCloseAllCommand } from "../command/annotation.command"
import { BatchSelectionItemToggleCommand } from "../command/layers.command"
import { ToolBottomPanelCollapseCommand } from "../command/tool.command"
import { AppReactContext } from "../context/app.context"
var f = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
function g(e) {
  const { item: t, className: n, onSelect: a } = e,
    g = f(e, ["item", "className", "onSelect"]),
    { enabled: v, id: y, typeId: b } = t,
    { analytics: E, commandBinder: S } = (0, s.useContext)(AppReactContext),
    [O, T] = (0, s.useState)(null),
    _ = (0, l.J)(),
    w = (function (e) {
      const t = (0, c.h)(),
        [n, i] = (0, s.useState)(!1)
      return (
        (0, s.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            t && i(t.isItemSelected(e))
          }
          const s = t.onSelectedItemsChanged(n)
          return n(), () => s.cancel()
        }, [t, e]),
        n
      )
    })(t),
    A = t.supportsBatchDelete() || t.supportsLayeredCopyMove(),
    N = !v || !t.isLayerVisible() || (_ && !A),
    I = !!g.active,
    P = (0, p.e)()
  ;(0, s.useEffect)(
    () => (
      O &&
        I &&
        O.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        }),
      () => {}
    ),
    [I, O]
  )
  return (0, i.jsx)(
    m.HC,
    Object.assign(
      {
        ref: T,
        id: y,
        className: o("search-result-item", n),
        disabled: N,
        selectDisabled: !A,
        selectMode: _,
        selected: w,
        onSelect: e => {
          const n = e.target
          if (!n) return
          const i = n.checked
          S.issueCommand(new BatchSelectionItemToggleCommand(t, i))
        },
        onClick: async () => {
          _ ||
            (E.trackGuiEvent(`batch_item_select_${b}`, {
              tool: P
            }),
            S.issueCommand(new ToolBottomPanelCollapseCommand(!0)),
            await S.issueCommand(new AnnotationsCloseAllCommand())),
            a ? a() : t.onSelect()
        }
      },
      g
    ),
    y
  )
}
export const F = g
