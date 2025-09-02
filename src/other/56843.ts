import a from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as c from "./40216"
import * as f from "./44523"
import * as l from "./61531"
import * as h from "./97593"
import { ToolPanelLayout } from "../const/tools.const"
import { HandleTextBoxFocusMessage } from "../message/ui.message"
import { winCanTouch } from "../utils/browser.utils"
const p = (0, s.forwardRef)(({ children: e, open: t, className: i, onClose: r, scrollingDisabled: p = !1 }, m) => {
  const v = (0, s.useRef)(null),
    g = (0, s.useRef)(null),
    S = (0, s.useMemo)(() => winCanTouch(), []),
    x = (0, c.T)(),
    [y, E] = (0, s.useState)(!1),
    k = (0, f.O)()
  ;(0, l.U)(HandleTextBoxFocusMessage, e => {
    E(e.focused)
  }),
    (0, s.useImperativeHandle)(
      m,
      () => ({
        resetScrollTop: () => {
          g.current && g.current.resetScrollTop()
        },
        scrollToSelector: e => {
          g.current && g.current.scrollToSelector(e)
        }
      }),
      [g]
    )
  const b = x === ToolPanelLayout.BOTTOM_PANEL,
    T = S && y && b,
    A =
      T &&
      !(function () {
        var e
        if (!g.current) return !1
        const t = g.current.getScrollHeight(),
          i = (null === (e = g.current.getScroller()) || void 0 === e ? void 0 : e.getBoundingClientRect().top) || 0
        return t <= k.height - i
      })(),
    D = b,
    R = { open: t, "sticky-header": !T, "detail-panel-align-top": A }
  return (0, n.jsx)(
    "div",
    Object.assign(
      {
        className: a("detail-panel", R, i),
        onKeyDown: function (e) {
          r && "Escape" === e.code && (e.stopPropagation(), r())
        },
        ref: v,
        tabIndex: t ? 0 : void 0,
        onTransitionEnd: e => {
          v.current && e.target === v.current && t && v.current.focus()
        }
      },
      { children: (0, n.jsx)(h.T, Object.assign({ ref: g, hideThumb: D, disabled: p }, { children: e })) }
    )
  )
})
export const J = p
