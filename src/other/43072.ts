import * as s from "react"
import * as n from "react/jsx-runtime"
import * as I from "./12347"
import * as r from "./15501"
import * as k from "./20487"
import * as C from "./2478"
import * as T from "./26314"
import * as A from "./28587"
import { NotesPhase } from "../const/38965"
import * as E from "../const/39693"
import { FeaturesNotesNudgeKey } from "../const/39693"
import * as d from "./40216"
import * as h from "./44877"
import * as b from "./54473"
import * as w from "./57623"
import * as L from "./60770"
import * as m from "../const/62612"
import { PinEditorState, PinType } from "../const/62612"
import * as O from "./66102"
import * as x from "./68549"
import * as c from "./7734"
import * as p from "./80709"
import * as g from "./82419"
import * as Rr from "./82929"
import * as D from "./84426"
import * as l from "../const/annotationType.const"
import * as B from "./86495"
import * as V from "./92390"
import * as u from "./93001"
import * as v from "./96766"
import { NoteAppearanceSaveCommand, NoteCancelAddCommand, NoteDeleteCommand, NotePopupEditorToggleCommand, NoteStartAddCommand } from "../command/notes.command"
import { PhraseKey } from "../const/phrase.const"
import { ToolPanelLayout } from "../const/tools.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { winCanTouch } from "../utils/browser.utils"
import { AnnotationType } from "../const/annotationType.const"
const { NOTES: N } = PhraseKey.SHOWCASE
function M() {
  const e = (0, s.useMemo)(() => winCanTouch(), []),
    t = (0, p.P)(),
    i = (0, I.z)(),
    a = (0, O.b)(),
    o = t === PinEditorState.CREATING,
    r = t === PinEditorState.PLACING
  let d = null
  if (o || !i || (!e && r)) {
    const t = a.t(e ? N.OVERLAY_ADD_TOUCH : N.OVERLAY_ADD_CLICK),
      n = a.t(e ? N.OVERLAY_PLACE_TOUCH : N.OVERLAY_PLACE_CLICK)
    d = i ? t : n
  }
  return d
    ? (0, n.jsxs)(k.C, {
        children: [(0, n.jsx)("div", { className: "icon icon-notes" }), (0, n.jsx)("span", Object.assign({ className: "message" }, { children: d }))]
      })
    : null
}
const { NOTES: F } = PhraseKey.SHOWCASE
function _({ canEdit: e, canDelete: t }) {
  const i = (0, s.useRef)(null),
    { commandBinder: r, analytics: c } = (0, s.useContext)(AppReactContext),
    l = (0, b.Y)(),
    h = (0, w.M)(),
    u = (0, C.H)(),
    g = (0, d.T)(),
    v = (0, p.P)(),
    T = (0, Rr.u)(),
    x = (0, O.b)(),
    A = v !== PinEditorState.IDLE,
    S = l === NotesPhase.EDITING
  function P() {
    i.current && i.current.dismissNudge()
  }
  const I = x.t(F.COLOR_STEM_TOOLTIP),
    k = x.t(F.DELETE_TOOLTIP),
    N = x.t(F.ADD_TOOLTIP),
    M = x.t(F.CANCEL_TOOLTIP),
    _ = A ? M : N,
    H = g === ToolPanelLayout.SIDE_PANEL,
    U = !H || A,
    G = x.t(F.ADD_CTA_TOOLTIP),
    z = UserPreferencesKeys.NotesAddNudgeSeen,
    W = A ? L.d.CANCEL : L.d.ADD,
    $ = A,
    K =
      H && e && !A
        ? (0, n.jsx)(D.zx, {
            className: "action-button-outer",
            icon: "stem-height",
            variant: D.Wu.FAB,
            theme: "overlay",
            active: S,
            tooltip: I,
            onClick: () => {
              P(), r.issueCommand(new NotePopupEditorToggleCommand(!S))
            }
          })
        : void 0,
    Z =
      H && t && !A
        ? (0, n.jsx)(D.zx, {
            className: "action-button-outer",
            variant: D.Wu.FAB,
            theme: "overlay",
            icon: "delete",
            tooltip: k,
            onClick: () => {
              P(), h && (c.trackToolGuiEvent("notes", "notes_overlay_click_delete"), r.issueCommand(new NoteDeleteCommand(h.id)))
            }
          })
        : void 0
  return (0, n.jsx)(
    B.o,
    Object.assign(
      { outerLeft: K, outerRight: Z },
      {
        children: (0, n.jsx)(V.W, {
          ref: i,
          addIcon: W,
          allowLayerChange: $,
          disabled: !T,
          onClick: () => {
            P(),
              A
                ? u && r.issueCommand(new NoteCancelAddCommand())
                : (c.trackToolGuiEvent("notes", "notes_overlay_click_add"), r.issueCommand(new NoteStartAddCommand()))
          },
          tooltip: _,
          nudgeFeatureKey: FeaturesNotesNudgeKey,
          nudgeDisabled: U,
          nudgeMessage: G,
          nudgeLocalStorage: z
        })
      }
    )
  )
}
function H() {
  const { commandBinder: e } = (0, s.useContext)(AppReactContext),
    t = (0, r.R)(),
    i = (0, d.T)(),
    S = (0, w.M)(),
    P = (0, b.Y)(),
    O = (0, p.P)(),
    I = (0, g.A)(),
    k = (0, v.v)(),
    N = (0, u.v)(),
    j = (0, T.h)(),
    R = (0, C.H)(),
    L = P === NotesPhase.CLOSED,
    V = (0, c.q)()
  if (t || !N || L) return null
  const B = P === NotesPhase.OPENING,
    F = P === NotesPhase.EDITING,
    H = N.isCommenter() && !V && !j,
    U = !!S && (0, h.CM)(N, AnnotationType.NOTE, S.user),
    G = !!S && (0, h.Kd)(N, AnnotationType.NOTE, S.user),
    z = i === ToolPanelLayout.SIDE_PANEL,
    W = O === PinEditorState.PRESSING,
    $ = !!S && !B,
    K = !z && !R && S && U
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "overlay grid-overlay notes-overlay" },
      {
        children: [
          K &&
            (0, n.jsx)(
              "div",
              Object.assign(
                { className: "overlay-top-right" },
                {
                  children: (0, n.jsx)(D.zx, {
                    icon: "stem-height",
                    variant: D.Wu.FAB,
                    theme: "overlay",
                    disabled: !$,
                    active: F,
                    onClick: t => {
                      t.stopPropagation(), e.issueCommand(new NotePopupEditorToggleCommand(!F))
                    }
                  })
                }
              )
            ),
          (0, n.jsx)(M, {}),
          H && (0, n.jsx)(_, { canEdit: U, canDelete: G }),
          S &&
            z &&
            U &&
            (0, n.jsx)(x.q, {
              pin: S,
              id: S.id,
              pinType: PinType.NOTE,
              onSave: t => {
                S && e.issueCommand(new NoteAppearanceSaveCommand(S.id, t))
              },
              onClose: () => {
                e.issueCommand(new NotePopupEditorToggleCommand(!1))
              },
              open: F,
              colors: E.ZP.colors,
              toolPanelLayout: i
            }),
          W && (0, n.jsx)(A.B, { progress: I, screenPosition: k })
        ]
      }
    )
  )
}
export const R = H
