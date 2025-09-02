import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import { SettingsLabel } from "./16507"
import { useAnalytics } from "./19564"
import * as l from "./38242"
import * as r from "./49627"
import * as c from "./84426"
import * as d from "./86388"
import * as p from "./94639"
import * as h from "./96238"
const g = ({ attachments: e, onClick: t, onNavigate: i, startIndex: a = 0, onError: c }) => {
  const g = useAnalytics(),
    [y, { width: f }] = (0, r.h4)(),
    w = (0, p.n)(),
    { ref: b, height: T } = (0, d.Z)({ box: "border-box" }),
    [C, E] = (0, s.useState)(a),
    [D, x] = (0, s.useState)(),
    A = e.length,
    S = (0, l.e)()
  ;(0, s.useEffect)(() => {
    a !== C && E(a)
  }, [a, e]),
    (0, s.useEffect)(() => {
      x(w ? 0 : T)
    }, [T, w])
  const P = (0, s.useCallback)(
      e => {
        e.stopPropagation()
        const t = C + 1 < A ? C + 1 : 0
        g.trackGuiEvent("attachments_viewer_next", { tool: S }), E(t), i && i(t)
      },
      [i, C, g, A]
    ),
    O = (0, s.useCallback)(
      e => {
        e.stopPropagation()
        const t = C > 0 ? C - 1 : A - 1
        g.trackGuiEvent("attachments_viewer_prev", { tool: S }), E(t), i && i(t)
      },
      [i, C, g, A]
    ),
    I = (0, s.useCallback)(
      (e, t) => {
        e.stopPropagation()
        const n = t
        g.trackGuiEvent("attachments_viewer_dot_clicked", { tool: S }), E(n), i && i(n)
      },
      [i, g]
    ),
    k = e[C]
  if (!k) return null
  const N = A > 1
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "attachment-carousel", ref: y },
      {
        children: [
          (0, n.jsx)(
            "div",
            Object.assign(
              { className: "attachment-carousel-view", style: { height: D } },
              {
                children: (0, n.jsx)(
                  "div",
                  Object.assign(
                    { className: "attachment-container", ref: b },
                    { children: (0, n.jsx)(h.P, { attachment: k, onClick: t, thumbnail: !1, containerWidth: f || 318, onError: c }) }
                  )
                )
              }
            )
          ),
          N && (0, n.jsx)(SettingsLabel, { className: o("modal-nav", "modal-prev"), iconClass: "icon-dpad-left", onClick: O }),
          N && (0, n.jsx)(SettingsLabel, { className: o("modal-nav", "modal-next"), iconClass: "icon-dpad-right", onClick: P }),
          N &&
            (0, n.jsx)(
              "div",
              Object.assign({ className: "carousel-bullets" }, { children: e.map((e, t) => (0, n.jsx)(v, { index: t, active: t === C, onSelect: I }, t)) })
            )
        ]
      }
    )
  )
}
function v({ index: e, active: t, onSelect: i }) {
  return (0, n.jsx)(c.zx, { icon: "simple-tag", onClick: t => i(t, e), className: o()("carousel-bullet", { "carousel-bullet-active": t }) })
}
export const T = g
