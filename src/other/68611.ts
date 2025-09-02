import p from "classnames"
import * as r from "react"
import * as i from "react/jsx-runtime"
import * as f from "./38490"
import * as d from "./51588"
import * as s from "./55801"
import * as l from "./66102"
import * as u from "./84426"
import { CloseToolCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"

const m = ({ children: e, className: t }) => {
  if (!e) return null
  const n = p("panel-title", t)
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: n
      },
      {
        children: e
      }
    )
  )
}
const { COLLAPSE_PANEL: g, EXPAND_PANEL: v } = PhraseKey.PANELS
function y(e) {
  const { tool: t, title: n, titleNode: o, children: h, expandable: p, hideHelp: y, hideBadge: b, onTogglePanel: E } = e,
    S = (0, l.b)(),
    O = (0, d.E)(),
    { commandBinder: T } = (0, r.useContext)(AppReactContext),
    _ = !y,
    w = (0, r.useCallback)(() => {
      T.issueCommand(new CloseToolCommand(t.id))
    }, [T, t]),
    A = (0, r.useCallback)(
      e => {
        e && e.stopPropagation()
        const t = !O
        E && E(t), T.issueCommand(new ToolPanelToggleCollapseCommand(t))
      },
      [T, O, E]
    ),
    N = O ? "dpad-up" : "dpad-down",
    I = O ? S.t(v) : S.t(g)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "panel-header",
        onClick: p ? A : void 0
      },
      {
        children: [
          (0, i.jsxs)(m, {
            children: [
              (0, i.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "panel-name"
                  },
                  {
                    children: [
                      p &&
                        (0, i.jsx)(u.zx, {
                          icon: N,
                          label: n,
                          tooltip: I,
                          tooltipOptions: {
                            placement: "bottom-start"
                          },
                          variant: u.Wu.TERTIARY,
                          onClick: A
                        }),
                      !p && n
                    ]
                  }
                )
              ),
              t.badgePhraseKey &&
                !b &&
                (0, i.jsx)(
                  "span",
                  Object.assign(
                    {
                      className: "word-badge"
                    },
                    {
                      children: S.t(t.badgePhraseKey)
                    }
                  )
                ),
              o || null
            ]
          }),
          (0, i.jsxs)(
            u.hE,
            Object.assign(
              {
                className: "panel-header-controls"
              },
              {
                children: [
                  h,
                  _ &&
                    (0, i.jsx)(s.w, {
                      tool: t
                    }),
                  (0, i.jsx)(f.P, {
                    tooltipOptions: {
                      placement: "bottom"
                    },
                    onClose: w
                  })
                ]
              }
            )
          )
        ]
      }
    )
  )
}
export const V = y
