import l from "classnames"
import * as a from "react"
import * as r from "react/jsx-runtime"

import { useDataHook } from "./45755"
import * as w from "./48911"
import * as b from "./51723"
import * as v from "./56509"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "./65019"
import * as g from "./66102"
import * as y from "./84426"
import * as A from "./94526"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { FeaturesDollhouseNudge, FeaturesRoomboundsFloorplanNudgekEY } from "../const/62496"
import { DollhousePeekabooKey } from "../const/66777"
import { PhraseKey } from "../const/phrase.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { DollhouseControlData } from "../data/dollhouse.control.data"
import { FloorsViewData } from "../data/floors.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { winCanTouch } from "../utils/browser.utils"
import { ViewModes } from "../utils/viewMode.utils"

enum i {
  Dollhouse = "dollhouse",
  Floorplan = "floorplan",
  Inside = "panorama",
  InsideMesh = "mesh",
  None = "none"
}

enum s {
  Dollhouse = "click_dollhouse_mode_button",
  Floorplan = "click_floorplan_mode_button",
  Inside = "click_inside_mode_button",
  InsideMesh = "click_mesh_mode_button"
}

function S(e, t) {
  const n = (0, a.useMemo)(() => !winCanTouch(), []),
    i = (0, g.b)(),
    s = i.t(e)
  return n && void 0 !== t ? `${s} ${i.t(t)}` : s
}
function O(e) {
  const { disabled: t, active: n, buttonId: i, onClick: s, analyticsName: o, tooltipPhraseKey: l, nudge: d, hotkeyPhraseKey: u } = e,
    h = (0, g.b)(),
    p = (0, v.Y)(),
    { editMode: m, analytics: f } = (0, a.useContext)(AppReactContext),
    E = S(l, u),
    O = p && m,
    T = {
      placement: O ? "bottom" : "top",
      offset: O ? [0, 10] : void 0
    },
    _ = O && n ? void 0 : y.Wu.TERTIARY,
    w = O && n ? "light" : "overlay",
    A = i,
    N = O ? y.qE.LARGE : void 0,
    I = (0, a.useCallback)(() => {
      s(i, o)
    }, [s, i, o])
  if (d) {
    const { featureKey: e, titleKey: s, messageKey: a, localStorageKey: o, dismissAnalytic: l, showTimeout: c = 5e3, dismissTimeout: u = 1e4 } = d
    return (0, r.jsx)(b.$, {
      className: `mode-button mode-${i}`,
      icon: A,
      variant: _,
      theme: w,
      size: N,
      active: n,
      disabled: t,
      onClick: I,
      tooltip: E,
      nudgeFeatureKey: e,
      nudgeTitle: h.t(s),
      nudgeMessage: h.t(a),
      nudgeLocalStorage: o,
      onNudgeDismissed: l
        ? () => {
            f.trackGuiEvent(l)
          }
        : void 0,
      showTimeout: c,
      dismissTimeout: u
    })
  }
  return (0, r.jsx)(
    "div",
    Object.assign(
      {
        className: `mode-button mode-${i}`
      },
      {
        children: (0, r.jsx)(y.zx, {
          onClick: I,
          icon: A,
          variant: _,
          theme: w,
          size: N,
          active: n,
          disabled: t,
          tooltip: E,
          tooltipOptions: T,
          ariaLabel: E
        })
      }
    )
  )
}
const x = useDataHook(DollhouseControlData),
  k = useDataHook(ViewmodeData)
function L(e) {
  const { disabled: t, buttonId: n, onClick: o } = e,
    l = (0, v.Y)(),
    { editMode: d } = (0, a.useContext)(AppReactContext),
    u = (0, w.j)(),
    h = k(),
    p = (0, A.B)(),
    f = (function () {
      const e = x(),
        [t, n] = (0, a.useState)(null)
      return (
        (0, a.useEffect)(() => {
          if (!e) return () => {}
          const t = e.onChanged(() => {
            n(e.targetState)
          })
          return (
            n(e.targetState),
            () => {
              t.cancel()
            }
          )
        }, [e]),
        t
      )
    })(),
    g = l && d,
    b = {
      placement: g ? "bottom" : "top",
      offset: g ? [0, 10] : void 0
    },
    E = p === ViewModes.Dollhouse || p === ViewModes.Floorplan,
    O = g && E,
    T = g && O ? void 0 : y.Wu.TERTIARY
  let _ = ViewModes.Dollhouse
  ;(_ = null != f ? ("top" === f ? ViewModes.Dollhouse : ViewModes.Floorplan) : E && u > 0.5 ? ViewModes.Floorplan : ViewModes.Dollhouse),
    (null == h ? void 0 : h.isFloorplanDisabled()) && (_ = ViewModes.Dollhouse),
    (null == h ? void 0 : h.isDollhouseDisabled()) && (_ = ViewModes.Floorplan)
  const I = _ === ViewModes.Floorplan ? i.Floorplan : i.Dollhouse,
    P = _ === ViewModes.Floorplan ? s.Floorplan : s.Dollhouse
  let L = PhraseKey.VIEW_DOLLHOUSE,
    C = PhraseKey.HOTKEY_VIEW_DOLLHOUSE
  _ === ViewModes.Floorplan && ((L = PhraseKey.VIEW_FLOORPLAN), (C = PhraseKey.HOTKEY_VIEW_FLOORPLAN))
  const D = S(L, C),
    R = g ? y.qE.LARGE : void 0,
    M = (0, a.useCallback)(() => {
      o(I, P)
    }, [o, I, P])
  return (null == h ? void 0 : h.isDollhouseDisabled()) && (null == h ? void 0 : h.isFloorplanDisabled())
    ? null
    : (0, r.jsx)(
        "div",
        Object.assign(
          {
            className: `mode-button mode-${n}`
          },
          {
            children: (0, r.jsx)(y.zx, {
              onClick: M,
              icon: I,
              variant: T,
              theme: "overlay",
              size: R,
              active: O,
              disabled: t,
              tooltip: D,
              tooltipOptions: b,
              ariaLabel: D
            })
          }
        )
      )
}
function D(e, t) {
  return !!e.tryGetProperty(DollhousePeekabooKey, !1) || (!t && !e.tryGetProperty(ShowcaseDollhouseKey, !1))
}
function R(e, t, n) {
  return e.tryGetProperty(DollhousePeekabooKey, !1) ? n !== ViewModes.Panorama : !t && !e.tryGetProperty(ShowcaseFloorPlanKey, !1)
}
function M(e, t) {
  return !t && !e
}
function j(e, t, n) {
  const s = e === t
  switch (e) {
    case i.Dollhouse:
    case i.Floorplan:
      return n || !s
    case i.Inside:
      return n ? t !== i.InsideMesh : !s
    case i.InsideMesh:
      return n ? s : t === i.Inside
  }
  return !1
}
const ModeButtonsDebugInfo = new DebugInfo("mode-buttons"),
  F = {
    featureKey: FeaturesDollhouseNudge,
    titleKey: PhraseKey.DOLLHOUSE_NUDGE_TITLE,
    messageKey: PhraseKey.DOLLHOUSE_NUDGE_MESSAGE,
    localStorageKey: UserPreferencesKeys.DollhouseUserNudgeSeen,
    dismissAnalytic: "dollhouse_nudge"
  },
  H = {
    featureKey: FeaturesRoomboundsFloorplanNudgekEY,
    titleKey: PhraseKey.GENERIC.NEW_MESSAGE,
    messageKey: PhraseKey.FLOOR_PLAN_NUDGE_MESSAGE,
    localStorageKey: UserPreferencesKeys.FloorplanRoomsUserNudgeSeen,
    dismissAnalytic: "floorplan_rooms_nudge",
    showTimeout: 3e4
  }
class B extends a.Component {
  constructor(e) {
    super(e),
      (this.onClick = async (e, t) => {
        const { transitioning: n } = this.props
        if (n) return
        const s = (function (e) {
            switch (e) {
              case i.Dollhouse:
                return ViewModeCommand.DOLLHOUSE
              case i.Floorplan:
                return ViewModeCommand.FLOORPLAN
              case i.Inside:
                return ViewModeCommand.INSIDE
              case i.InsideMesh:
                return ViewModeCommand.MESH
              default:
                throw new Error(`cannot get viewmode for mode buttonId ${e}`)
            }
          })(e),
          { analytics: r, commandBinder: a } = this.context
        r.trackGuiEvent(t)
        try {
          await a.issueCommand(new ChangeViewmodeCommand(s))
        } catch (e) {
          ModeButtonsDebugInfo.warn(e)
        }
      })
  }
  render() {
    const {
        activeButtonId: e,
        activeStateDisplay: t,
        className: n,
        dollhousePrevented: a,
        floorplanPrevented: o,
        insidePrevented: c,
        meshPrevented: d,
        transitioning: u,
        viewmodeChangeEnabled: h,
        peekabooEnabled: p
      } = this.props,
      f = !h || u,
      g = !d && j(i.InsideMesh, e, !!t),
      v = !c && j(i.Inside, e, !!t),
      y = !a && j(i.Dollhouse, e, !!t),
      b = !o && j(i.Floorplan, e, !!t),
      E = p
    return (0, r.jsxs)(
      "div",
      Object.assign(
        {
          className: l("mode-buttons", n)
        },
        {
          children: [
            g &&
              (0, r.jsx)(O, {
                tooltipPhraseKey: PhraseKey.VIEW_INSIDE_MESH,
                analyticsName: s.InsideMesh,
                buttonId: i.InsideMesh,
                active: e === i.InsideMesh,
                onClick: this.onClick,
                disabled: f
              }),
            v &&
              (0, r.jsx)(O, {
                tooltipPhraseKey: PhraseKey.VIEW_INSIDE,
                hotkeyPhraseKey: PhraseKey.HOTKEY_VIEW_INSIDE,
                analyticsName: s.Inside,
                buttonId: i.Inside,
                active: e === i.Inside,
                onClick: this.onClick,
                disabled: f
              }),
            y &&
              (0, r.jsx)(O, {
                tooltipPhraseKey: PhraseKey.VIEW_DOLLHOUSE,
                hotkeyPhraseKey: PhraseKey.HOTKEY_VIEW_DOLLHOUSE,
                analyticsName: s.Dollhouse,
                buttonId: i.Dollhouse,
                active: e === i.Dollhouse,
                onClick: this.onClick,
                disabled: f,
                nudge: F
              }),
            E &&
              (0, r.jsx)(L, {
                buttonId: i.Dollhouse,
                onClick: this.onClick,
                disabled: f
              }),
            b &&
              (0, r.jsx)(O, {
                tooltipPhraseKey: PhraseKey.VIEW_FLOORPLAN,
                hotkeyPhraseKey: PhraseKey.HOTKEY_VIEW_FLOORPLAN,
                analyticsName: s.Floorplan,
                buttonId: i.Floorplan,
                active: e === i.Floorplan,
                onClick: this.onClick,
                disabled: f,
                nudge: H
              })
          ]
        }
      )
    )
  }
}
B.contextType = AppReactContext
export class V extends a.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.isUnmounting = !1),
      (this.updateDollhouseState = () => {
        const { editMode: e, settings: t } = this.context
        this.setState({
          dollhousePrevented: D(t, e)
        })
      }),
      (this.updateFloorplanState = () => {
        const { editMode: e, settings: t } = this.context,
          n = this.viewmodeData.currentMode
        this.setState({
          floorplanPrevented: R(t, e, n)
        })
      }),
      (this.onCurrentFloorChanged = () => {
        const { editMode: e } = this.context,
          t = this.floorsViewData.currentFloor,
          n = this.floorsViewData.hasEnabledAlignedSweeps(t && t.id)
        this.setState({
          insidePrevented: M(n, e)
        })
      }),
      (this.onViewmodeChangeLockUpdate = () => {
        const { market: e } = this.context,
          t = e.tryGetData(ViewmodeData)
        if (!t) return
        const n = t.viewmodeChangeEnabled
        this.setState({
          viewmodeChangeEnabled: n
        })
      }),
      (this.state = {
        dollhousePrevented: !1,
        floorplanPrevented: !1,
        insidePrevented: !1,
        viewmodeChangeEnabled: !0
      })
  }
  componentDidMount() {
    const { market: e, settings: t } = this.context
    Promise.all([e.waitForData(ViewmodeData), e.waitForData(FloorsViewData)]).then(([e, n]) => {
      this.isUnmounting ||
        ((this.viewmodeData = e),
        (this.floorsViewData = n),
        this.bindings.push(
          e.onPropertyChanged("viewmodeChangeEnabled", this.onViewmodeChangeLockUpdate),
          e.makeModeChangeSubscription(this.updateFloorplanState),
          n.makeFloorChangeSubscription(this.onCurrentFloorChanged),
          t.onPropertyChanged(ShowcaseDollhouseKey, this.updateDollhouseState),
          t.onPropertyChanged(ShowcaseFloorPlanKey, this.updateFloorplanState)
        ),
        this.onCurrentFloorChanged(),
        this.updateDollhouseState(),
        this.updateFloorplanState(),
        this.onViewmodeChangeLockUpdate())
    })
  }
  componentWillUnmount() {
    this.isUnmounting = !0
    for (const e of this.bindings) e.cancel()
    this.bindings = []
  }
  render() {
    const { editMode: e, settings: t } = this.context,
      { className: n, unaligned: s, viewmode: a, activeStateDisplay: o } = this.props,
      { viewmodeChangeEnabled: c, dollhousePrevented: d, floorplanPrevented: u, insidePrevented: p } = this.state,
      m = a === ViewModeCommand.TRANSITIONING,
      f = t.tryGetProperty(DollhousePeekabooKey, !1)
    m ||
      (this.activeButtonId = (function (e, t) {
        if (e) return i.None
        switch (t) {
          case ViewModeCommand.DOLLHOUSE:
            return i.Dollhouse
          case ViewModeCommand.FLOORPLAN:
            return i.Floorplan
          case ViewModeCommand.INSIDE:
            return i.Inside
          case ViewModeCommand.MESH:
            return i.InsideMesh
        }
        return i.None
      })(s, a))
    const g = (function (e) {
      return !e
    })(e)
    return (0, r.jsx)(B, {
      className: l("viewmode-controls", n),
      activeStateDisplay: o,
      activeButtonId: this.activeButtonId,
      transitioning: m,
      dollhousePrevented: d,
      floorplanPrevented: u,
      insidePrevented: p,
      meshPrevented: g,
      viewmodeChangeEnabled: c,
      peekabooEnabled: f
    })
  }
}
V.contextType = AppReactContext
