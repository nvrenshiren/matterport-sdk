import W from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as x from "./13585"
import * as p from "./15501"
import { MeasurePhase } from "../const/measure.const"
import * as P from "./28587"
import * as T from "./36893"
import * as c from "./51978"
import * as l from "./56064"
import * as j from "./60770"
import * as o from "./66102"

import * as b from "./73085"
import * as ff from "../const/73536"
import * as K from "./75043"
import * as w from "./75377"
import * as d from "./7734"
import * as I from "../const/78283"
import * as M from "./84426"
import * as F from "./86495"
import * as U from "./92390"
import * as O from "./96377"
import { MeasureStopCommand } from "../command/measurement.command"
import { MeasurementDeleteSelectedCommand } from "../command/measurement.command"
import { MeasureStartCommand } from "../command/measurement.command"
import { ToggleModalCommand } from "../command/ui.command"
import { ToggleToolCommand } from "../command/tool.command"
import { PhraseKey } from "../const/phrase.const"
import { ToolsList } from "../const/tools.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { MeasureModeData } from "../data/measure.mode.data"
import { winCanTouch } from "../utils/browser.utils"
import { UnitTypeKey } from "../utils/unit.utils"

const z = "images/escape.png"
const S = (0, b.M)(MeasureModeData, "phase", MeasurePhase.CLOSED)
function _() {
  const e = (0, O.m)()
  return (0, T.l)(e || "")
}
const A = (0, b.M)(MeasureModeData, "pressProgress", -1)
const k = {
    addEnabled: {
      [MeasurePhase.CREATING]: !0,
      [MeasurePhase.CONFIRMING_POINT]: !0
    },
    deleteVisible: {
      [MeasurePhase.IDLE]: !0,
      [MeasurePhase.CREATING]: !0,
      [MeasurePhase.CREATING_NEXT_POINT]: !0
    }
  },
  L =
    (MeasurePhase.CREATING,
    MeasurePhase.CONFIRMING_POINT,
    {
      [MeasurePhase.IDLE]: !0,
      [MeasurePhase.CREATING]: !0,
      [MeasurePhase.CREATING_NEXT_POINT]: !0
    })
const H = "Measurement-Help",
  B = "measurement-mode-help"
function V({ touchDevice: e, unaligned: t, phase: n, confirming: l, selectedGroup: c }) {
  const { editMode: d, commandBinder: u } = (0, s.useContext)(AppReactContext),
    h = (0, s.useRef)(null),
    p = (0, o.b)()
  function m() {
    h.current && h.current.dismissNudge()
  }
  const f = n === MeasurePhase.CREATING && (!c || 0 === c.count),
    g = n === MeasurePhase.CREATING_NEXT_POINT && !!c && 2 === c.count,
    v = !l && (f || g),
    b = n === MeasurePhase.EDITING,
    E = v || l,
    S = t || b
  let O = j.d.ADD,
    T = p.t(PhraseKey.MEASUREMENT_ADD_LABEL)
  l ? ((O = j.d.CONFIRM), (T = p.t(PhraseKey.MEASUREMENT_SAVE_LABEL))) : v && ((O = j.d.CANCEL), (T = p.t(PhraseKey.MEASUREMENT_CANCEL_LABEL)))
  const _ = c && O !== j.d.CANCEL && (e ? !!k.deleteVisible[n] : !!L[n]),
    w = p.t(PhraseKey.MEASUREMENT_START_ADDING),
    A = d,
    N = _
      ? (0, i.jsx)(M.zx, {
          className: "action-button-outer",
          icon: "delete",
          variant: M.Wu.FAB,
          theme: "overlay",
          onClick: e => {
            m(), e.stopPropagation(), u.issueCommand(new MeasurementDeleteSelectedCommand())
          }
        })
      : void 0
  return (0, i.jsx)(
    F.o,
    Object.assign(
      {
        outerRight: N
      },
      {
        children: (0, i.jsx)(U.W, {
          ref: h,
          disabled: S,
          addIcon: O,
          ariaLabel: T,
          ariaDescribedBy: H,
          allowLayerChange: E,
          onChangeLayer: () => {
            m()
          },
          nudgeDisabled: A,
          nudgeMessage: w,
          nudgeSessionKey: "measurement-mode-add-tooltip",
          onClick: e => {
            m(), e.stopPropagation(), n === MeasurePhase.IDLE ? u.issueCommand(new MeasureStartCommand()) : u.issueCommand(new MeasureStopCommand())
          }
        })
      }
    )
  )
}
function $(e) {
  const { touchDevice: t, phase: n, groupCount: l } = e,
    { settings: d } = (0, s.useContext)(AppReactContext),
    u = (0, o.b)(),
    h = (0, c.y)(B, !1),
    [p, m] = (0, s.useState)(!1)
  if (
    ((0, s.useEffect)(
      () => () => {
        p && d.setProperty(B, !0)
      },
      [p, d]
    ),
    h)
  )
    return null
  const f = u.t(PhraseKey.MEASUREMENT_HELP_CLICK_ANYWHERE),
    g = u.t(PhraseKey.MEASUREMENT_HELP_ESCAPE),
    v = u.t(PhraseKey.MEASUREMENT_HELP_PRESS_START),
    b = u.t(PhraseKey.MEASUREMENT_HELP_DRAG_EDIT),
    E = u.t(PhraseKey.MEASUREMENT_HELP_PRESS_END)
  let S, O, T
  if (t)
    switch (n) {
      case MeasurePhase.CREATING:
        ;(S = (0, i.jsx)("div", {
          className: "icon icon-press-hold"
        })),
          (O = v)
        break
      case MeasurePhase.CREATING_NEXT_POINT:
        ;(S = (0, i.jsx)("div", {
          className: "icon icon-drag-edit"
        })),
          (O = E),
          p || m(!0)
        break
      case MeasurePhase.EDITING:
      case MeasurePhase.POINT_PLACED:
        ;(S = (0, i.jsx)("div", {
          className: "icon icon-finger-drag"
        })),
          (O = b)
        break
      default:
        return null
    }
  else
    switch (n) {
      case MeasurePhase.CREATING:
        ;(S = (0, i.jsx)("div", {
          className: "icon icon-draw-lines"
        })),
          (O = f)
        break
      case MeasurePhase.CREATING_NEXT_POINT:
        l >= 3 &&
          ((S = (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "escape-key"
              },
              {
                children: (0, i.jsx)("img", {
                  src: z
                })
              }
            )
          )),
          (O = g),
          (T = "escape-message"),
          p || m(!0))
        break
      default:
        return null
    }
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "overlay-message"
      },
      {
        children: [
          S,
          O &&
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  id: H,
                  className: W("message", T)
                },
                {
                  children: O
                }
              )
            )
        ]
      }
    )
  )
}
function Y() {
  var e
  const { editMode: t, analytics: n, commandBinder: b } = (0, s.useContext)(AppReactContext),
    E = (0, o.b)(),
    O = (0, p.R)(),
    T = (0, l.O)(),
    L = (0, c.y)(UserPreferencesKeys.MeasurementContinuousLines, !1),
    C = S(),
    D = O === ff.P.MEASUREMENT_HELP,
    R = _(),
    j = (0, s.useMemo)(() => winCanTouch(), []),
    U = (function () {
      var e
      const t = (0, w.J)(),
        [n, i] = (0, s.useState)(null !== (e = null == t ? void 0 : t.pointPosition) && void 0 !== e ? e : null)
      return (
        (0, s.useEffect)(() => {
          if (!t) return () => {}
          function e() {
            t && i(t.pointPosition)
          }
          const n = t.onPointPositionChanged(e)
          return e(), () => n.cancel()
        }, [t]),
        n
      )
    })(),
    F = A(),
    H = (function () {
      const e = _(),
        t = (0, c.y)(UserPreferencesKeys.MeasurementContinuousLines, !1),
        n = (null == e ? void 0 : e.count) || 0
      return t ? n > 2 : 2 === n
    })(),
    B = (0, d.q)(),
    G = !!R && H && (L ? C === MeasurePhase.CREATING_NEXT_POINT : C === MeasurePhase.CREATING)
  function W() {
    b.issueCommand(new ToggleModalCommand(ff.P.MEASUREMENT_HELP, !1))
  }
  ;(0, s.useEffect)(() => (C === MeasurePhase.CLOSED && W(), () => {}), [C])
  const z = k.addEnabled[C],
    Y = (null == R ? void 0 : R.info.text) ? ` ${R.info.text}` : "",
    q = R
      ? `${((e, t) => {
          if (t === UnitTypeKey.METRIC) return `${e.toFixed(2)}m`
          const { feet: n, inches: i } = (0, I.XJ)(e)
          return n > 0 ? `${n}' ${i}"` : `${i}"`
        })(R.length, T)} ${Y}`
      : void 0,
    Z = E.t(PhraseKey.HELP),
    Q = E.t(PhraseKey.CLOSE)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "overlay grid-overlay measurements-overlay"
      },
      {
        children: [
          R &&
            (0, i.jsx)(K.u, {
              children: q
            }),
          !t &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "overlay-top-right"
                },
                {
                  children: (0, i.jsxs)(
                    M.hE,
                    Object.assign(
                      {
                        spacing: "small"
                      },
                      {
                        children: [
                          (0, i.jsx)(x.B, {
                            onOpenPopup: () => {
                              W()
                            },
                            overlay: !0
                          }),
                          (0, i.jsx)(M.zx, {
                            className: "measurement-help-btn",
                            variant: M.Wu.FAB,
                            theme: "overlay",
                            icon: "help",
                            active: D,
                            onClick: e => {
                              e.stopPropagation(),
                                D || n.trackToolGuiEvent("measurements", "measure_mode_help_clicked"),
                                b.issueCommand(new ToggleModalCommand(ff.P.MEASUREMENT_HELP, !D))
                            },
                            ariaLabel: Z,
                            tooltip: (!D && Z) || void 0,
                            tooltipOptions: {
                              placement: "bottom"
                            }
                          }),
                          (0, i.jsx)(M.zx, {
                            icon: "close",
                            variant: M.Wu.FAB,
                            theme: "overlay",
                            tooltip: Q,
                            tooltipOptions: {
                              placement: "bottom"
                            },
                            onClick: async e => {
                              e && e.stopPropagation(), W(), await b.issueCommand(new ToggleToolCommand(ToolsList.MEASUREMENTS, !1))
                            }
                          })
                        ]
                      }
                    )
                  )
                }
              )
            ),
          (0, i.jsx)($, {
            phase: C,
            touchDevice: j,
            groupCount: null !== (e = null == R ? void 0 : R.count) && void 0 !== e ? e : 0
          }),
          z &&
            (0, i.jsx)(P.B, {
              progress: F,
              screenPosition: U
            }),
          (0, i.jsx)(V, {
            unaligned: B,
            phase: C,
            touchDevice: j,
            selectedGroup: R,
            confirming: G
          })
        ]
      }
    )
  )
}

export const f = Y
