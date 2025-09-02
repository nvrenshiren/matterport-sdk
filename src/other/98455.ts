import p from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as S from "./14355"
import * as g from "./23362"
import * as U from "./47764"
import * as a from "./49627"
import * as A from "./51978"
import * as z from "./56509"
import * as f from "./61531"
import * as D from "./66102"
import * as M from "./70584"
import * as $ from "./71652"
import * as H from "./74554"
import * as m from "./84426"
import * as w from "./85384"
import * as _ from "./86902"
import * as u from "./95941"
import { ToggleModalCommand } from "../command/ui.command"
import { ToggleToolCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { HighlightReelToggleOpenCommand } from "../command/tour.command"
import { TourNextStepCommand, TourPreviousStepCommand, TourStartCommand, TourStopCommand } from "../command/tour.command"
import * as B from "../const/59323"
import * as y from "../const/73536"
import { KeyboardCode } from "../const/keyboard.const"
import { PhraseKey } from "../const/phrase.const"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { TourMode } from "../const/tour.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { BtnText } from "../data/player.options.data"
import { MoveToSweepBeginMessage } from "../message/sweep.message"
import { TourSteppedMessage } from "../message/tour.message"
import { TourStoryMessage } from "../message/tour.message"
const { HLR: I } = PhraseKey.WORKSHOP
function P(e) {
  const t = !(0, A.y)(UserPreferencesKeys.TourTextNudgeDismissed, !1),
    n = (0, w.i)(),
    a = (function () {
      const [e, t] = (0, s.useState)(!1),
        n = (0, s.useRef)()
      ;(0, f.U)(TourStoryMessage, () => {
        t(!0),
          i(),
          (n.current = setTimeout(() => {
            t(!1), (n.current = void 0)
          }, 3e3))
      })
      const i = () => {
        n.current && (clearTimeout(n.current), (n.current = void 0))
      }
      return e
    })(),
    { highlights: o, currentStep: c, activeStep: d, tourPlaying: u } = e,
    { locale: h, commandBinder: m, settings: g, editMode: v } = (0, s.useContext)(AppReactContext),
    O = (0, s.useCallback)(
      (e, t = !0) => {
        g.setLocalStorageProperty(UserPreferencesKeys.TourTextNudgeDismissed, !0), t && e.stopPropagation()
      },
      [g]
    ),
    P = (0, s.useCallback)(
      async e => {
        await m.issueCommand(new ToggleToolCommand(ToolsList.HLR, !0)),
          m.issueCommand(new ToggleModalCommand(y.P.HIGHLIGHT_EDITOR, !0)),
          m.issueCommand(new ToolPanelToggleCollapseCommand(!1)),
          O(e, !1)
      },
      [m, O]
    ),
    x = o[c],
    k = (null == x ? void 0 : x.title) || (null == x ? void 0 : x.description),
    L = v && !k && t,
    C = (null == x ? void 0 : x.title) || (L ? h.t(I.HIGHLIGHT_TITLE_PLACEHOLDER) : ""),
    D = (null == x ? void 0 : x.description) || (L ? h.t(I.HIGHLIGHT_DESCRIPTION_PLACEHOLDER) : ""),
    R = (n && !(d !== c) && u) || a,
    M = p("tour-story", {
      active: R,
      prompt: L
    })
  return (0, i.jsxs)(
    S.N,
    Object.assign(
      {
        open: (n && u) || a,
        className: M,
        onClick: R ? P : void 0,
        "aria-live": "polite",
        "aria-atomic": "true"
      },
      {
        children: [
          L &&
            (0, i.jsx)(_.zx, {
              className: "tour-story-dismiss",
              theme: "dark",
              variant: _.Wu.TERTIARY,
              icon: "close",
              onClick: O
            }),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "tour-story-title"
              },
              {
                children: C
              }
            )
          ),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "tour-story-description"
              },
              {
                children: D
              }
            )
          )
        ]
      }
    )
  )
}
const { TOURS: k } = PhraseKey.SHOWCASE,
  L = [g.l.FastForwarding, g.l.Rewinding, g.l.Skipping]
function C(e) {
  const { activeStep: t, currentStep: n, handlePlayPause: a, highlights: o, tourPlaying: d, toolPanelLayout: u } = e,
    [h, y] = (0, s.useState)(!1),
    [b, E] = (0, s.useState)(!1),
    S = (0, g.T)(),
    { commandBinder: T, locale: _, analytics: w } = (0, s.useContext)(AppReactContext),
    A = (0, s.useCallback)(() => {
      y(!0)
    }, []),
    N = (0, s.useCallback)(() => {
      t === n && y(!1)
    }, [t, n])
  ;(0, f.U)(TourSteppedMessage, A), (0, f.U)(MoveToSweepBeginMessage, N)
  const I = 0 === o.length,
    C = u === ToolPanelLayout.NARROW || u === ToolPanelLayout.BOTTOM_PANEL,
    D = d ? _.t(PhraseKey.PAUSE) : _.t(PhraseKey.PLAY),
    R = _.t(PhraseKey.PREVIOUS),
    M = _.t(PhraseKey.NEXT),
    j = I || !d ? "play-unicode" : "pause",
    U = I || L.includes(S),
    F = o[t]
  let H = (null == F ? void 0 : F.snapshot.name) || ""
  h || (H = d || b ? "" : _.t(k.TOUR_BUTTON_LABEL))
  const B = (0, s.useCallback)(() => {
      E(!0), a()
    }, [a]),
    V = (0, s.useCallback)(
      async e => {
        I || (e.stopPropagation(), E(!0), w.trackGuiEvent("skip_foward_highlights"), await T.issueCommand(new TourNextStepCommand()))
      },
      [w, I, T]
    ),
    G = (0, s.useCallback)(
      async e => {
        I || (e.stopPropagation(), E(!0), w.trackGuiEvent("skip_backward_highlights"), await T.issueCommand(new TourPreviousStepCommand()))
      },
      [w, I, T]
    )
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "tour-story-controls"
      },
      {
        children: [
          (0, i.jsx)(P, {
            tourPlaying: d,
            currentStep: n,
            activeStep: t,
            highlights: o
          }),
          (0, i.jsx)(m.zx, {
            icon: "dpad-left",
            className: "story-tour-previous-cta",
            variant: m.Wu.TERTIARY,
            size: m.qE.SMALL,
            disabled: U,
            ariaLabel: R,
            tooltip: R,
            onClick: G
          }),
          (0, i.jsx)(m.zx, {
            className: "tour-story-play-pause",
            icon: j,
            variant: m.Wu.TERTIARY,
            size: m.qE.SMALL,
            disabled: U,
            ariaLabel: D,
            tooltip: D,
            onClick: I ? void 0 : B
          }),
          (0, i.jsx)(m.zx, {
            icon: "dpad-right",
            className: "story-tour-next-cta",
            variant: m.Wu.TERTIARY,
            size: m.qE.SMALL,
            disabled: U,
            ariaLabel: M,
            tooltip: M,
            onClick: V
          }),
          H &&
            d &&
            !C &&
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  className: p("tour-control-label", {
                    active: d
                  })
                },
                {
                  children: H
                }
              )
            )
        ]
      }
    )
  )
}
function j(e) {
  const { reelEnabled: t, activeTool: n, tourMode: a } = e,
    o = (0, D.b)(),
    { analytics: c, commandBinder: u } = (0, s.useContext)(AppReactContext),
    h = (0, M.O)(),
    f = (0, s.useCallback)(() => {
      const e = h ? "hide_" : "show_"
      c.trackToolGuiEvent("hlr", e + "highlight_reel"), u.issueCommand(new HighlightReelToggleOpenCommand(!h))
    }, [h, c, u]),
    g = a === TourMode.STORIES
  if (!t || (g && n !== ToolsList.HLR)) return null
  const v = h ? o.t(PhraseKey.CLOSE_HIGHLIGHTS) : o.t(PhraseKey.OPEN_HIGHLIGHTS),
    y = h ? "dpad-down" : "dpad-up",
    b = p("highlight-button", {
      "hlr-expanded": h
    })
  return (0, i.jsx)(m.zx, {
    className: b,
    onClick: f,
    tooltip: v,
    ariaLabel: v,
    "aria-expanded": h ? "true" : "false",
    icon: y,
    theme: "overlay",
    variant: m.Wu.TERTIARY
  })
}
function V() {
  const e = (0, A.y)(BtnText.HighlightReel, !0),
    t = (0, U.L)(B.rU, B.iL)
  return e && t !== B.Nu
}
;(0, H.M)("reelEnabled", V)
function G() {
  const e = (0, A.y)(BtnText.TourButtons, !0),
    t = (0, U.L)(B.o9, B.qe),
    n = (0, U.L)(B.PR, B.l4)
  return e && t !== B.Wf && n !== B.pQ
}
;(0, H.M)("tourEnabled", G)
function W(e) {
  const { activeTool: t, handlePlayPause: n, highlights: a, hideReel: o, tourPlaying: l } = e,
    { editMode: c } = (0, s.useContext)(AppReactContext),
    u = (0, D.b)(),
    h = (V() && !o) || c,
    p = G() || c
  if (!h && !p) return null
  const f = 0 === a.length,
    g = l ? u.t(PhraseKey.PAUSE) : u.t(PhraseKey.PLAY),
    v = l ? "pause-outline" : "play"
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "highlight-tour-controls"
      },
      {
        children: [
          h &&
            (0, i.jsx)(j, {
              activeTool: t,
              reelEnabled: h,
              tourMode: TourMode.LEGACY
            }),
          p &&
            (0, i.jsx)(m.zx, {
              disabled: f,
              active: l,
              onClick: n,
              variant: m.Wu.TERTIARY,
              theme: "overlay",
              className: "tour-controls",
              ariaLabel: g,
              icon: v,
              tooltip: g
            })
        ]
      }
    )
  )
}
const PreviewTourDebugInfo = new DebugInfo("preview-tour"),
  { HLR: q } = PhraseKey.WORKSHOP
function Zz() {
  const { commandBinder: e } = (0, s.useContext)(AppReactContext),
    t = (0, D.b)(),
    n = (0, z.Y)(),
    a = 0 === (0, $.g)(),
    o = (0, s.useCallback)(async () => {
      if (!a)
        try {
          await e.issueCommand(new TourStartCommand())
        } catch (e) {
          PreviewTourDebugInfo.debug(e)
        }
    }, [e, a]),
    l = t.t(q.PREVIEW_SETTINGS_CTA),
    d = n ? void 0 : l,
    u = n ? l : void 0
  return (0, i.jsx)(m.zx, {
    icon: "play-unicode",
    label: d,
    tooltip: u,
    disabled: a,
    size: m.qE.LARGE,
    theme: "dark",
    className: "preview-tour-button",
    variant: m.Wu.FAB,
    onClick: o
  })
}
const TourControlsDebugInfo = new DebugInfo("tour-controls")
function X(e) {
  const { activeStep: t, activeTool: n, currentStep: h, hideReel: p, toolPanelLayout: m, tourMode: f, tourPlaying: g, highlights: v } = e,
    { analytics: y, commandBinder: b, editMode: E } = (0, s.useContext)(AppReactContext),
    { outOfScope: S } = (0, s.useContext)(u.H),
    O = async () => {
      if (0 === v.length) return
      const e = g ? "pause_highlights" : "play_highlights"
      y.trackGuiEvent(e)
      try {
        g ? await b.issueCommand(new TourStopCommand()) : await b.issueCommand(new TourStartCommand())
      } catch (e) {
        TourControlsDebugInfo.debug(e)
      }
    }
  ;(0, a.OR)("keydown", e => {
    const t = e.target
    S || !I() || ("CANVAS" !== t.tagName && "BODY" !== t.tagName) || ((g || e.keyCode === KeyboardCode.SPACE) && (e.stopPropagation(), O()))
  })
  const T = n === ToolsList.HLR,
    _ = n === ToolsList.SEARCH,
    w = n === ToolsList.LAYERS
  if (T && !g) return (0, i.jsx)(Zz, {})
  const A = f === TourMode.NONE,
    N = !!n && !(T || _ || w),
    I = () => {
      if (E) {
        const e = m === ToolPanelLayout.BOTTOM_PANEL || m === ToolPanelLayout.NARROW
        if (n === ToolsList.MESH_TRIM) return !1
        if (e && N) return !1
      } else {
        if (0 === v.length || A || N) return !1
      }
      return !0
    }
  return I()
    ? f === TourMode.STORIES
      ? (0, i.jsx)(C, {
          activeStep: t,
          currentStep: h,
          highlights: v,
          toolPanelLayout: m,
          tourPlaying: g,
          handlePlayPause: O
        })
      : (0, i.jsx)(W, {
          activeTool: n,
          handlePlayPause: O,
          highlights: v,
          hideReel: p,
          tourPlaying: g
        })
    : null
}
export const Z = X
