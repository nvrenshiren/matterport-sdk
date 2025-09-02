import m from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as o from "./10664"
import * as l from "./15501"
import * as d from "./40216"
import * as c from "./51588"
const u = function (e, t) {
  const n = e.classList
  switch (t) {
    case ToolPanelLayout.NORMAL:
    case ToolPanelLayout.SIDE_PANEL:
      n.replace("narrow-layout", "standard-layout") || n.add("standard-layout")
      break
    case ToolPanelLayout.NARROW:
    case ToolPanelLayout.BOTTOM_PANEL:
      n.replace("standard-layout", "narrow-layout") || n.add("narrow-layout")
  }
}

import * as f from "./38772"

@f.A
class y extends s.Component {
  constructor(e) {
    super(e),
      (this.getInitialState = () => ({
        messagePhraseKey: "",
        active: !1,
        ctaPhraseKey: "",
        timeout: 0,
        multiline: !1,
        dismissesOnAction: !1,
        actionHandler: () => {}
      })),
      (this.triggerAction = e => {
        e.stopPropagation(), this.state.actionHandler && this.state.actionHandler(), this.state.dismissesOnAction && this.hide()
      }),
      (this.hide = async () => {
        window.clearTimeout(this.timeout),
          this.setState({
            active: !1
          })
      }),
      (this.show = async e => {
        const t = Object.assign(this.getInitialState(), e, {
          active: !0
        })
        this.setState(t),
          window.clearTimeout(this.timeout),
          t.timeout > 0 &&
            (this.timeout = window.setTimeout(() => {
              this.setState({
                active: !1
              })
            }, t.timeout))
      }),
      (this.state = this.getInitialState())
  }
  componentDidMount() {
    this.context.commandBinder.addBinding(ShowToastrCommand, this.show), this.context.commandBinder.addBinding(HideToastrCommand, this.hide)
  }
  componentWillUnmount() {
    window.clearTimeout(this.timeout),
      this.context.commandBinder.removeBinding(ShowToastrCommand, this.show),
      this.context.commandBinder.removeBinding(HideToastrCommand, this.hide)
  }
  render() {
    const { locale: e } = this.context,
      t = this.props.className || "",
      { active: n, multiline: s, messagePhraseKey: r, ctaPhraseKey: a, dismissesOnAction: o } = this.state,
      l = {
        active: n,
        multiline: s
      },
      c = r ? e.t(r) : null,
      d = a ? e.t(a) : null
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          className: "toastr-wrapper",
          onClick: o ? this.hide : void 0
        },
        {
          children: (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: m("toastr-contents", `${t}`, l)
              },
              {
                children: [
                  (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "toastr-text"
                      },
                      {
                        children: c
                      }
                    )
                  ),
                  d &&
                    (0, i.jsx)(
                      "a",
                      Object.assign(
                        {
                          className: "link",
                          onClick: this.triggerAction
                        },
                        {
                          children: d
                        }
                      )
                    )
                ]
              }
            )
          )
        }
      )
    )
  }
}
y.contextType = AppReactContext

import * as T from "./14355"
import { AppReactContext } from "../context/app.context"
import * as b from "../const/phrase.const"
import * as S from "./56509"
import * as O from "./66102"
import { HideToastrCommand, ShowToastrCommand } from "../command/ui.command"
import { ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { TourStopCommand } from "../command/tour.command"
import { ToolPanelLayout } from "../const/tools.const"
import { PhraseKey } from "../const/phrase.const"
const { PANELS: _ } = PhraseKey
function w({ children: e, className: t, sidePanelCollapsible: n }) {
  const { commandBinder: a, analytics: l } = (0, s.useContext)(AppReactContext),
    d = (0, c.E)(),
    u = (0, o.x)(),
    h = (0, O.b)(),
    p = (0, S.Y)(),
    f = u && u.panel
  let g = null
  f && e && Array.isArray(e) && (g = e.find(e => e && e.key === (null == u ? void 0 : u.id)) || !1)
  const v = (0, s.useCallback)(() => {
    g &&
      !p &&
      (l.track("JMYDCase_gui", {
        gui_action: "toggle_side_panel"
      }),
      a.issueCommand(new ToolPanelToggleCollapseCommand(!d)))
  }, [g, p, l, a, d])
  ;(0, s.useEffect)(() => {
    g && !p && d && !n && a.issueCommand(new ToolPanelToggleCollapseCommand(!1))
  }, [g, p, d, n, a])
  const y = d ? h.t(_.EXPAND_PANEL) : h.t(_.COLLAPSE_PANEL),
    b = d ? "icon-dpad-left" : "icon-dpad-right",
    w = !!(u && g && u.panel),
    A = g && !!(null == u ? void 0 : u.panelLeft) && !p,
    N = g && !A && !p,
    I = {
      "panel-open": w && !d,
      "panel-collapsed": w && d,
      "panel-bottom": p,
      "panel-side": !p,
      "panel-left": A,
      "panel-right": N
    }
  return (0, i.jsxs)(i.Fragment, {
    children: [
      w &&
        N &&
        n &&
        (0, i.jsx)(
          "div",
          Object.assign(
            {
              className: "panel-track"
            },
            {
              children: (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "panel-track-thumb",
                    "data-balloon": y,
                    "data-balloon-pos": "left",
                    onClick: v
                  },
                  {
                    children: (0, i.jsx)("span", {
                      className: `icon ${b}`
                    })
                  }
                )
              )
            }
          )
        ),
      (0, i.jsx)(
        T.N,
        Object.assign(
          {
            className: m("panels", I, t),
            open: w,
            selectChild: !0,
            childKey: null == u ? void 0 : u.id
          },
          {
            children: e
          }
        )
      )
    ]
  })
}
const A = e => {
  var t
  return !!(null === (t = e.ui) || void 0 === t ? void 0 : t.renderPanel) && !e.panelLeft
}
const N = e => {
  var t
  return !!(null === (t = e.ui) || void 0 === t ? void 0 : t.renderPanel) && !!e.panelLeft
}
function I({ children: e, className: t }) {
  const { mainDiv: n, commandBinder: p, toolsData: m, editMode: f } = (0, s.useContext)(AppReactContext),
    g = (0, o.x)(),
    v = (0, l.R)(),
    b = (0, c.E)(),
    E = (0, d.T)(),
    S = E === ToolPanelLayout.BOTTOM_PANEL
  return (
    (0, s.useEffect)(() => {
      u(n, E)
    }, [n, E]),
    (0, s.useEffect)(() => {
      b ? n.classList.add("tool-collapsed") : n.classList.remove("tool-collapsed"), x(n, g, S)
    }, [n, b, g, S]),
    (0, s.useEffect)(() => {
      n.classList.remove("bottom-panel", "left-panel", "right-panel"),
        g && g.panel && n.classList.add(S ? "bottom-panel" : g.panelLeft ? "left-panel" : "right-panel"),
        x(n, g, S)
    }, [n, g, S]),
    (0, s.useEffect)(() => {
      v ? n.classList.add("modal-open") : n.classList.remove("modal-open"), v && p.issueCommand(new TourStopCommand(), !1)
    }, [n, v]),
    (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: t
        },
        {
          children: [
            (0, i.jsx)(
              w,
              Object.assign(
                {
                  sidePanelCollapsible: !1
                },
                {
                  children: m.toolsMap.values.filter(N).map(e =>
                    (0, i.jsx)(
                      P,
                      {
                        tool: e
                      },
                      e.id
                    )
                  )
                }
              )
            ),
            (0, i.jsxs)(
              "div",
              Object.assign(
                {
                  className: "scene-overlay"
                },
                {
                  children: [e, (0, i.jsx)(y, {})]
                }
              )
            ),
            (0, i.jsx)(
              w,
              Object.assign(
                {
                  sidePanelCollapsible: f
                },
                {
                  children: m.toolsMap.values.filter(A).map(e =>
                    (0, i.jsx)(
                      P,
                      {
                        tool: e
                      },
                      e.id
                    )
                  )
                }
              )
            )
          ]
        }
      )
    )
  )
}
function P({ tool: e }) {
  var t
  return (null === (t = e.ui) || void 0 === t ? void 0 : t.renderPanel)
    ? (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "tool-panel"
          },
          {
            children: e.ui.renderPanel()
          }
        )
      )
    : null
}
function x(e, t, n) {
  n && !0 === (null == t ? void 0 : t.searchModeType) ? e.classList.add("with-search-bar") : e.classList.remove("with-search-bar")
}

export const R = I
