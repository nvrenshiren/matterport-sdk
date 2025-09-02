import h from "classnames"
import * as i from "react"
import { createRoot } from "react-dom/client"
import * as o from "react/jsx-runtime"
import * as kt from "../other/10837"

import { VRCanUSE, getVRPlatform } from "../utils/vr.utils"
import * as q from "../other/14355"
import * as ii from "../other/15130"
import * as Ue from "../other/15258"
import * as re from "../other/15501"

import gg from "../../images/pause.svg"
import * as ue from "../other/17726"
import { useAnalytics } from "../other/19564"
import * as be from "../other/20524"
import * as tt from "../other/22410"
import * as He from "../other/27839"
import * as he from "../other/28250"
import * as C from "../other/28482"
import * as li from "../other/31826"
import * as H from "../32634"
import * as oi from "../other/32710"
import * as Ne from "../other/33023"
import * as Nt from "../other/38490"
import * as bi from "../other/38646"
import * as Ze from "../other/38772"
import { FeaturesNotesModeKey } from "../other/39586"
import * as Ie from "../other/39866"
import * as Oe from "../other/40216"
import * as ce from "../other/40465"
import * as ie from "../other/40541"
import * as ye from "../other/44523"
import * as nn from "../utils/vr.utils"
import * as _e from "../other/45755"
import * as je from "../other/47764"
import * as ci from "../other/48911"
import * as xe from "../other/49627"
import * as bt from "../other/50719"
import * as Se from "../other/51588"
import * as X from "../other/51723"
import * as ae from "../other/51978"
import * as Te from "../other/53407"
import * as le from "../other/56421"
import { isPitchFactorOrtho } from "../math/59370"
import * as ht from "../other/61531"
import * as Pt from "../utils/61687"
import * as b from "../other/64137"
import * as E from "../other/66102"
import * as v from "../other/69790"
import * as oe from "../other/70584"
import * as mn from "../other/71652"
import * as Re from "../other/73085"
import { DataLayersFeatureKey, ModelViewsFeatureKey } from "../other/76087"
import * as Y from "../utils/80361"
import * as nt from "../other/82566"
import * as ut from "../other/83038"
import * as S from "../other/84426"
import * as _t from "../other/86096"
import * as Ei from "../other/86495"
import * as It from "../utils/scroll.utils"
import * as me from "../other/86667"
import * as At from "../other/87170"
import { isBaseView, isInsightsView, isUserView } from "../utils/view.utils"
import * as Q from "../other/96403"
import { ObjectInsightsFeatureKey } from "../other/96776"
import * as M from "../other/97478"
import * as Tt from "../other/97501"
import * as Bn from "../other/97593"
import * as y from "../other/98455"
import { RegisterNotesToolsCommand } from "../command/notes.command"
import { ViewModeInsideCommand } from "../command/viewmode.command"
import { VIEW_SELECTOR_PARAM, VIEW_SELECTOR_STANDALONE } from "../const/23829"
import * as Ee from "../const/25071"
import * as xt from "../const/51801"
import * as x from "../const/73536"
import * as gn from "../const/86876"
import * as te from "../const/8824"
import { spacesSubscriberDownURL, subscriberDismissedKey, subscriberPromptActiveKey, subscriberPromptConfig } from "../const/96365"
import { modelRatingDialogKey } from "../const/modelRating.const"
import { PhraseKey } from "../const/phrase.const"
import { ScreenOrientationType } from "../const/screen.const"
import { brandingEnabledKey, presentationAboutKey, presentationMlsModeKey, socialSharingKey } from "../const/settings.const"
import { DeepLinksSymbol, ViewUISymbol } from "../const/symbol.const"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { TourMode } from "../const/tour.const"
import { searchModeType } from "../const/typeString.const"
import { UserPreferencesKeys } from "../const/user.const"
import * as sn from "../const/xr.const"
import { XRBrowserLockKey } from "../const/xr.const"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { AppStatus } from "../data/app.data"
import { ModelData } from "../data/model.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData as _TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { ObservableArray } from "../observable/observable.array"
import { canFullscreen, sameShowcase, sharePhone, winCanTouch } from "../utils/browser.utils"
import { getURLParams } from "../utils/urlParams.utils"
import { ViewModes } from "../utils/viewMode.utils"

declare global {
  interface SymbolModule {
    [ViewUISymbol]: ShowcaseGuiModule
  }
}

function L() {
  const e = (0, E.b)(),
    { commandBinder: t } = (0, i.useContext)(AppReactContext),
    n = (0, i.useCallback)(() => {
      t.issueCommand(new ToggleModalCommand(x.P.VR_SELECT, !0))
    }, [t]),
    s = e.t(PhraseKey.VIEW_IN_VR)
  return (0, o.jsx)(S.zx, {
    className: "view-in-vr",
    onClick: n,
    ariaLabel: s,
    ariaHasPopup: "dialog",
    tooltip: s,
    tooltipOptions: {
      placement: "top"
    },
    icon: "vr",
    theme: "overlay",
    variant: S.Wu.TERTIARY
  })
}

enum ReelState {
  flash = 0,
  expanded = 1,
  collapsed = 2
}

const pauseBtnDebug = new DebugInfo("pause-button")

class W extends i.Component {
  constructor(e) {
    super(e),
      (this.justEnded = !1),
      (this.stopTour = async e => {
        this.context.analytics.trackGuiEvent("tour_stopped")
        try {
          this.context.commandBinder.issueCommand(new TourStopCommand())
        } catch (e) {
          pauseBtnDebug.debug(e)
        }
      }),
      (this.state = {
        justPaused: !1
      })
  }

  componentDidUpdate() {
    this.state.justPaused &&
      this.setState({
        justPaused: !1
      }),
      (this.justEnded = !1)
  }

  UNSAFE_componentWillReceiveProps(e) {
    !this.props.tourPlaying ||
      e.tourPlaying ||
      this.justEnded ||
      this.setState({
        justPaused: !0
      }),
      this.props.tourEnded && (this.justEnded = !0)
  }

  render() {
    const { tourPlaying: e } = this.props,
      { justPaused: t } = this.state
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          id: "pause-button",
          onClick: this.stopTour,
          onTouchMove: this.stopTour,
          onTouchStart: this.stopTour,
          "data-cy": "pause-button"
        },
        {
          children:
            !e &&
            (0, o.jsx)("img", {
              src: gg,
              className: h({
                justPaused: t
              }),
              alt: "",
              "aria-hidden": "true"
            })
        }
      )
    )
  }
}

W.contextType = AppReactContext

function ee() {
  const { commandBinder: e, analytics: t } = (0, i.useContext)(AppReactContext),
    n = (0, E.b)(),
    s = (0, Q.B)() === ToolsList.NOTES,
    r = n.t(PhraseKey.NOTES_MODE),
    a = n.t(PhraseKey.NOTES_NUDGE_TITLE),
    l = n.t(PhraseKey.NOTES_NUDGE_MESSAGE),
    c = UserPreferencesKeys.NotesModeNudgeSeen,
    u = FeaturesNotesNudgeKey
  return (0, o.jsx)(
    X.$,
    {
      className: "notes-mode-button",
      icon: "comment-outline",
      active: s,
      onClick: () => {
        const n = !s
        n && t.trackGuiEvent("notes_mode_click_open"), e.issueCommand(new ToggleToolCommand(ToolsList.NOTES, n))
      },
      tooltip: r,
      nudgeFeatureKey: u,
      nudgeTitle: a,
      nudgeMessage: l,
      nudgeLocalStorage: c,
      onNudgeDismissed: () => {
        t.trackGuiEvent("notes_nudge_dismissed")
      },
      showTimeout: 35e3,
      dismissTimeout: 1e4
    },
    "notes-mode-button"
  )
}

function ne() {
  const { commandBinder: e, analytics: t } = (0, i.useContext)(AppReactContext),
    n = (0, E.b)(),
    s = (0, Q.B)() === ToolsList.MEASUREMENTS,
    r = n.t(PhraseKey.MEASUREMENT_MODE),
    a = n.t(PhraseKey.MEASUREMENT_NUDGE_TITLE),
    l = n.t(PhraseKey.MEASUREMENT_NUDGE_MESSAGE),
    c = UserPreferencesKeys.MeasurementUserNudgeSeen,
    u = te.b
  return (0, o.jsx)(
    X.$,
    {
      className: "measure-mode-button",
      icon: "tape-measure",
      active: s,
      onClick: () => {
        const n = !s
        n && t.trackToolGuiEvent("measurements", "measure_mode"), e.issueCommand(new ToggleToolCommand(ToolsList.MEASUREMENTS, n))
      },
      tooltip: r,
      nudgeFeatureKey: u,
      nudgeTitle: a,
      nudgeMessage: l,
      nudgeLocalStorage: c,
      onNudgeDismissed: () => {
        t.trackGuiEvent("measurement_nudge_dismissed")
      },
      showTimeout: 6e4,
      dismissTimeout: 1e4
    },
    "measure-mode-button"
  )
}

function de() {
  const e = (0, Q.B)(),
    t = (0, re.R)(),
    n = (0, ae.y)(modelRatingDialogKey, !1),
    i = (0, oe.O)(),
    s = (0, le.S)(),
    r = i && !e && s === TourMode.LEGACY,
    a = !e,
    l = !t || t === x.P.TERMS
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: h("footer-ui", {
          "footer-ui-shaded": r,
          disabled: !l
        })
      },
      {
        children:
          a &&
          (0, o.jsx)(ce.$, {
            openModal: t,
            disabled: !l,
            modelRatingEnabled: n
          })
      }
    )
  )
}

class ge extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.isUnmounting = !1),
      (this.bindings = []),
      (this.viewmodeToClass = {
        [ViewModeCommand.INSIDE]: "inside",
        [ViewModeCommand.OUTSIDE]: "outside",
        [ViewModeCommand.DOLLHOUSE]: "dollhouse",
        [ViewModeCommand.FLOORPLAN]: "floorplan",
        [ViewModeCommand.TRANSITIONING]: "transitioning"
      }),
      (this.checkShowReel = () => {
        const { tourState: e } = this.props,
          { settings: t } = this.context,
          n = t.tryGetProperty(BtnText.HighlightReel, !0)
        if (e.totalSteps > 0 && n) {
          const e = this.getHlStartupValue()
          switch (e) {
            case ReelState.expanded:
            case ReelState.flash:
              waitRun(100).then(() => this.showReel(e))
          }
        }
      }),
      (this.showReel = e => {
        this.isUnmounting ||
          (this.context.commandBinder.issueCommand(new HighlightReelToggleOpenCommand(!0)), e === ReelState.flash && waitRun(3e3).then(this.dismissReel))
      }),
      (this.dismissReel = () => {
        this.isUnmounting || this.context.commandBinder.issueCommand(new HighlightReelToggleOpenCommand(!1))
      }),
      (this.onViewingControlsToggle = ({ show: e }) => {
        this.setState({
          autohide: !e
        })
      }),
      (this.updateViewportSize = e => {
        this.isUnmounting ||
          this.setState({
            viewportHeight: e.height
          })
      }),
      (this.isReelEnabled = () => {
        if (this.props.tourMode === TourMode.STORIES) return !0
        return this.state.viewportHeight >= 400 && (0, M.ug)(this.context.settings)
      }),
      (this.isPluginSystemEnabled = () => {
        const { settings: e } = this.context
        return e.tryGetProperty(SpacesPluginsKey, !1)
      }),
      (this.isFloorsEnabled = () => {
        const { settings: e } = this.context,
          t = e.tryGetProperty(FeaturesFloorselectKey, !0),
          n = e.tryGetProperty(BtnText.FloorSelect, !0)
        return t && n
      }),
      (this.toggleShareModal = () => {
        const e = this.props.openModal === x.P.SHARE
        this.context.analytics.trackGuiEvent("click_share_button"), this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.SHARE, !e))
      }),
      (this.renderHighlightReel = () => {
        const { openTool: e, tourState: t, tourMode: n } = this.props
        if (e && e !== ToolsList.SEARCH) return null
        const { tourPlaying: i, highlights: s, activeStep: r, transition: a } = t
        return (0, o.jsx)(H.e, {
          openTool: e,
          tourMode: n,
          transition: a,
          activeStep: r,
          highlights: s,
          tourPlaying: i
        })
      }),
      (this.renderRightControls = () => {
        const e = [],
          { vrEnabled: t, shareEnabled: n } = this.props,
          i = canFullscreen()
        e.push(
          (0, o.jsx)(
            "span",
            {
              className: "divider"
            },
            "divider_1"
          )
        )
        const s = this.context.locale.t(PhraseKey.SOCIAL_SHARING),
          r = {
            placement: "top"
          }
        return (
          n &&
            e.push(
              (0, o.jsx)(
                S.zx,
                {
                  onClick: this.toggleShareModal,
                  ariaLabel: s,
                  ariaHasPopup: "dialog",
                  tooltip: s,
                  tooltipOptions: r,
                  icon: "share",
                  theme: "overlay",
                  variant: S.Wu.TERTIARY
                },
                "toggle_share_modal"
              )
            ),
          t && e.push((0, o.jsx)(L, {}, "vr_modal_controls")),
          i && e.push((0, o.jsx)(C.Z, {}, "fullscreen_controls")),
          e
        )
      }),
      (this.state = {
        viewportHeight: (0, me.O)(t).height,
        autohide: !1
      }),
      (this.onResize = (0, Y.D)(this.updateViewportSize, 250))
  }

  componentDidMount() {
    const { messageBus: e, market: t } = this.context
    t.waitForData(ContainerData).then(e => {
      this.isUnmounting || this.bindings.push(e.onPropertyChanged("size", this.onResize))
    }),
      this.bindings.push(e.subscribe(ToggleViewingControlsMessage, this.onViewingControlsToggle)),
      this.checkShowReel()
  }

  componentWillUnmount() {
    ;(this.isUnmounting = !0), this.bindings.map(e => e.cancel())
  }

  componentDidUpdate(e) {
    !(e.tourState.totalSteps > 0) && this.props.tourState.totalSteps > 0 && this.checkShowReel()
  }

  getHlStartupValue() {
    const { settings: e } = this.context
    if (e.getOverrideParam("note", "") || e.getOverrideParam("tag", "")) return ReelState.collapsed
    const t = this.props.tourState.highlights.some(e => e.snapshot.is360) ? ReelState.expanded : ReelState.flash,
      n = e.getOverrideParam("hl", t)
    return isIncludes(ReelState, n) ? n : t
  }

  render() {
    const {
        measurementsModeEnabled: e,
        notesEnabled: t,
        openModal: n,
        openTool: i,
        showStoryTour: s,
        toolPanelLayout: r,
        tourMode: a,
        tourState: l,
        unaligned: c,
        viewmode: d
      } = this.props,
      { tourPlaying: u, tourEnded: p, totalSteps: m, activeStep: f, currentStep: g, highlights: E } = l,
      { autohide: S, viewportHeight: O } = this.state,
      { settings: T } = this.context,
      _ = this.viewmodeToClass[d] || "",
      w = 0 === m,
      A = a === TourMode.STORIES,
      N = O >= 400,
      P = this.isReelEnabled() && !w,
      k = i !== ToolsList.MEASUREMENTS,
      L = this.isFloorsEnabled(),
      C = this.isPluginSystemEnabled(),
      D = t && !c,
      M = e && !c,
      U = T.tryGetProperty(modelRatingDialogKey, !1),
      F = u || s,
      H = S || (!!n && (n !== x.P.CTA || !A) && !i),
      B = {
        "modal-open": !!n,
        "tour-playing": u,
        "stories-tour-showing": s,
        autohide: H
      }
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          id: "bottom-ui",
          className: h("bottom-ui", B, _)
        },
        {
          children: [
            (0, o.jsx)(W, {
              tourPlaying: u,
              tourEnded: p
            }),
            (0, o.jsxs)(
              q.N,
              Object.assign(
                {
                  className: h("bottom-controls", {
                    "faded-out": H
                  }),
                  open: !H
                },
                {
                  children: [
                    (0, o.jsxs)(
                      ie.i,
                      Object.assign(
                        {
                          className: "controls"
                        },
                        {
                          children: [
                            (0, o.jsx)(
                              y.Z,
                              {
                                toolPanelLayout: r,
                                activeTool: i,
                                activeStep: f,
                                currentStep: g,
                                highlights: E || [],
                                tourPlaying: u,
                                tourMode: a,
                                hideReel: !N
                              },
                              "tour_controls"
                            ),
                            (0, o.jsx)(
                              q.N,
                              Object.assign(
                                {
                                  className: "mode-controls",
                                  open: !F
                                },
                                {
                                  children: (0, o.jsx)(
                                    v.V,
                                    {
                                      unaligned: c,
                                      viewmode: d,
                                      className: "JMYDCase-viewmode-controls"
                                    },
                                    "mode_controls"
                                  )
                                }
                              )
                            ),
                            L &&
                              (0, o.jsx)(
                                q.N,
                                Object.assign(
                                  {
                                    className: "mode-controls",
                                    open: !F
                                  },
                                  {
                                    children: (0, o.jsx)(
                                      b.d,
                                      {
                                        viewmode: d,
                                        iconStyle: !0,
                                        className: "JMYDCase-floor-controls"
                                      },
                                      "floor_controls"
                                    )
                                  }
                                )
                              ),
                            // C &&
                            //   (0, o.jsx)(
                            //     q.N,
                            //     Object.assign(
                            //       {
                            //         className: "mode-controls",
                            //         open: !F
                            //       },
                            //       {
                            //         children: (0, o.jsx)(
                            //           I,
                            //           {
                            //             viewmode: d,
                            //             className: "JMYDCase-plugin-controls"
                            //           },
                            //           "plugin_visibility_controls"
                            //         )
                            //       }
                            //     )
                            //   ),
                            D &&
                              (0, o.jsx)(
                                q.N,
                                Object.assign(
                                  {
                                    className: "mode-controls",
                                    open: !F
                                  },
                                  {
                                    children: (0, o.jsx)(ee, {}, "notes_mode_button")
                                  }
                                )
                              ),
                            M &&
                              (0, o.jsx)(
                                q.N,
                                Object.assign(
                                  {
                                    className: "mode-controls",
                                    open: !F
                                  },
                                  {
                                    children: (0, o.jsx)(ne, {}, "measurement_mode_button")
                                  }
                                )
                              ),
                            k && this.renderRightControls()
                          ]
                        }
                      )
                    ),
                    U && (0, o.jsx)(ue.L, {})
                  ]
                }
              )
            ),
            P && this.renderHighlightReel(),
            (0, o.jsx)(de, {})
          ]
        }
      )
    )
  }
}

ge.contextType = AppReactContext
const ve = (0, he.j)(ge)
const Ae = useDataHook(SettingsData)
const Le = () => {
  const e = (0, ae.y)(subscriberPromptActiveKey, subscriberPromptConfig)
  return (0, i.useMemo)(() => Object.assign({}, subscriberPromptConfig, e), [e])
}
const Me = () => {
  const e = (0, Re.v)(SdkData, "applicationKeys", new ObservableArray())
  return (0, ae.y)(subscriberPromptActiveKey, !1) && 0 === e.length
}

function Be() {
  const e = (0, He._)(),
    t = (0, ae.y)(ObjectInsightsFeatureKey, !1),
    [n, s] = (0, i.useState)((null == e ? void 0 : e.getEnabledOrderedModelViews(t)) || [])
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}

      function n() {
        s((null == e ? void 0 : e.getEnabledOrderedModelViews(t)) || [])
      }

      const i = e.onModelViewsChanged(n)
      return n(), () => i.cancel()
    }, [e, t]),
    n
  )
}

function ze(e, t, n) {
  const i = n === VIEW_SELECTOR_STANDALONE
  return !(!(e && e.enabled && (isUserView(e) || isInsightsView(e) || isBaseView(e))) || i || t.length < 2)
}

function $e(e, t, n) {
  return !ze(e, t, n) && !!e && (isUserView(e) || isInsightsView(e))
}

function Ke() {
  const e = (0, ae.y)(ModelViewsFeatureKey, !1),
    t = (0, Ue.K)(),
    n = Be(),
    s = (0, je.L)(VIEW_SELECTOR_PARAM),
    [r, a] = (0, i.useState)(e && ze(t, n, s))
  return (0, i.useEffect)(() => (a(e && ze(t, n, s)), () => {}), [e, t, n, s]), r
}

function Ye() {
  const e = (0, ae.y)(ModelViewsFeatureKey, !1),
    t = (0, Ue.K)(),
    n = Be(),
    s = (0, je.L)(VIEW_SELECTOR_PARAM),
    [r, a] = (0, i.useState)(e && $e(t, n, s))
  return (0, i.useEffect)(() => (a(e && $e(t, n, s)), () => {}), [e, t, n, s]), r
}

function qe() {
  const e = (0, ae.y)(DataLayersFeatureKey, !1),
    t = (0, He._)(),
    [n, s] = (0, i.useState)((e && (null == t ? void 0 : t.getCurrentUserLayers())) || [])
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}

      function n() {
        s((e && (null == t ? void 0 : t.getCurrentUserLayers())) || [])
      }

      const i = t.onCurrentLayersChanged(n)
      return n(), () => i.cancel()
    }, [t, e]),
    n
  )
}

@Ze.Z
class Xe extends i.Component {
  constructor() {
    super(...arguments),
      (this.handleTitleClick = async e => {
        e.stopPropagation()
        const { commandBinder: t, analytics: n } = this.context
        await t.issueCommand(new ToggleToolCommand(ToolsList.SUMMARY, !0)),
          t.issueCommand(new ToolPanelToggleCollapseCommand(!1)),
          n.trackGuiEvent("click_model_title", {
            interactionSource: "gui"
          })
      })
  }

  getFilteredValue(e, t, n, i) {
    return !this.context.settings.tryGetProperty(t, n) || (i && !this.props.brandingEnabled) ? "" : e
  }

  render() {
    const { locale: e } = this.context,
      { className: t, modelDetails: n } = this.props,
      { name: i, presentedBy: s } = n,
      r = this.getFilteredValue(i, BtnText.DetailsModelName, !0, !1),
      a = this.getFilteredValue(s, BtnText.PresentedBy, !1, !0),
      l = a ? `${e.t(PhraseKey.PRESENTED_BY)}${a}` : "",
      c = `${r} ${l}`
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          id: "model-title",
          onClick: this.handleTitleClick
        },
        {
          children: (0, o.jsx)(
            S.zx,
            Object.assign(
              {
                id: "gui-name",
                variant: S.Wu.TERTIARY,
                onClick: this.handleTitleClick,
                className: h(t, {
                  "co-branded": !!l
                }),
                label: r,
                ariaLabel: c,
                theme: "dark",
                icon: "location",
                appendChildren: !1
              },
              {
                children:
                  !!l &&
                  (0, o.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "co-brand"
                      },
                      {
                        children: (0, o.jsx)(
                          "span",
                          Object.assign(
                            {
                              className: "title",
                              id: "cobrandTitle"
                            },
                            {
                              children: l
                            }
                          )
                        )
                      }
                    )
                  )
              }
            )
          )
        }
      )
    )
  }
}

Xe.contextType = AppReactContext

const Je = Xe

function rt({ id: e, name: t, visible: n }) {
  const { analytics: s, commandBinder: r } = (0, i.useContext)(AppReactContext)
  return (0, o.jsx)(S.XZ, {
    className: "data-layer-menu-item",
    id: `layer-toggle-${e}`,
    label: t || "Untitled Layer",
    defaultChecked: n,
    onChange: t => {
      const n = t.target
      if (!n) return
      const i = n.checked
      r.issueCommand(new LayerToggleCommand(e, i)), s.trackToolGuiEvent("layers", "layers_toggle_layer")
    },
    onClick: e => {
      e.stopPropagation()
    }
  })
}

const { SHOWCASE: at } = PhraseKey

function ot() {
  const e = (function () {
      const e = (0, tt.n)(),
        [t, n] = (0, i.useState)((null == e ? void 0 : e.model.details.name) || "")
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          const t = e.onChanged(e => {
            n(e.model.details.name)
          })
          return n(e.model.details.name), () => t.cancel()
        }, [e]),
        t
      )
    })(),
    t = (0, Ue.K)(),
    n = (0, nt.A)(null == t ? void 0 : t.id),
    s = qe(),
    r = Be(),
    a = Ke(),
    l = Ye(),
    { analytics: c, commandBinder: d } = (0, i.useContext)(AppReactContext),
    u = (0, E.b)(),
    [m, f] = (0, i.useState)(!1),
    g = (function () {
      const { mainDiv: e } = (0, i.useContext)(AppReactContext)
      return e.getRootNode() instanceof ShadowRoot
    })(),
    v = async () => {
      c.trackToolGuiEvent("layers", "layers_view_goto_start_location"), await d.issueCommand(new StartLocationGotoCommand())
    },
    y = e => {
      f(e)
    }
  if (
    ((0, i.useEffect)(() => {
      if (!t || g) return
      const { name: n } = t
      let i
      return (i = isUserView(t) || isInsightsView(t) ? `${e}: ${n}` : e), (document.title = i), () => {}
    }, [e, t, g]),
    !t)
  )
    return null
  const b = s.map(e => {
      const { id: t, name: n, toggled: i } = e
      return (0, o.jsx)(
        rt,
        {
          id: t,
          name: n,
          visible: i
        },
        t
      )
    }),
    O = u.t(at.VIEWS.VIEW_SELECTOR_START_LOCATION_TOOLTIP),
    T = []
  return (
    r.forEach(e => {
      const { id: n } = e,
        i = n === t.id,
        s = i && b.length > 0 ? b : void 0,
        r = s ? "parent-menu-item" : void 0
      T.push(
        (0, o.jsx)(
          lt,
          {
            view: e,
            active: i,
            className: r
          },
          n
        )
      ),
        s && T.push(...s)
    }),
    a && r.length > 1
      ? (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: h("views-layers-toggles", "model-view-selector", {
                open: m
              })
            },
            {
              children: [
                (0, o.jsx)(S.zx, {
                  className: "start-location-btn",
                  icon: "start-location",
                  variant: S.Wu.PRIMARY,
                  size: S.qE.SMALL,
                  onClick: v,
                  tooltip: O
                }),
                (0, o.jsx)(
                  S.xz,
                  Object.assign(
                    {
                      ariaLabel: n,
                      menuClassName: "views-layers-menu",
                      variant: S.Wu.PRIMARY,
                      size: S.qE.SMALL,
                      label: n,
                      onMenuToggled: y,
                      caret: !0
                    },
                    {
                      children: T
                    }
                  )
                )
              ]
            }
          )
        )
      : b.length > 0
        ? (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: h("views-layers-toggles", {
                  open: m
                })
              },
              {
                children: (0, o.jsx)(
                  S.xz,
                  Object.assign(
                    {
                      ariaLabel: u.t(at.LAYERS.TOGGLE_LAYERS),
                      menuClassName: h("views-layers-menu", "data-layers-only-menu"),
                      variant: S.Wu.PRIMARY,
                      size: S.qE.SMALL,
                      label: n,
                      onMenuToggled: y,
                      caret: !0
                    },
                    {
                      children: b
                    }
                  )
                )
              }
            )
          )
        : l
          ? (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "model-view-display"
                },
                {
                  children: n
                }
              )
            )
          : null
  )
}

function lt({ view: e, active: t, className: n }) {
  const { analytics: s, commandBinder: r } = (0, i.useContext)(AppReactContext),
    { id: a } = e,
    l = (0, nt.A)(a)
  return (0, o.jsx)(
    S.zx,
    {
      className: h("view-name", n),
      label: l,
      size: S.qE.SMALL,
      onClick: async () => {
        s.trackToolGuiEvent("layers", "layers_view_switch"),
          await r.issueCommand(new SetMoveCameraOnViewChangeCommand(!1)),
          await r.issueCommand(new ModelViewSetCommand(a)),
          await r.issueCommand(new SetMoveCameraOnViewChangeCommand(!0))
      },
      active: t,
      variant: S.Wu.TERTIARY
    },
    a
  )
}

function ct({ toolName: e, showing: t = !0, attached: n = !1 }) {
  const { commandBinder: s, analytics: r } = (0, i.useContext)(AppReactContext),
    a = (0, E.b)(),
    l = (0, Ne.Q)(e),
    c = (0, Q.B)()
  if (!l) return null
  const { id: u, namePhraseKey: m, icon: f, analytic: g } = l,
    v = c === l.id,
    y = a.t(m),
    b = f.replace("icon-", ""),
    O = n ? "dark" : "overlay"
  return (0, o.jsx)(
    q.N,
    Object.assign(
      {
        open: t,
        className: h("top-tool-button", {
          "faded-out": !t
        })
      },
      {
        children: (0, o.jsx)(S.zx, {
          onClick: () => {
            s.issueCommand(new ToggleToolCommand(u, !v)),
              r.trackToolGuiEvent(g, `click_${g}_button`, {
                interactionSource: "gui"
              })
          },
          tooltip: y,
          tooltipOptions: {
            placement: "bottom"
          },
          icon: b,
          theme: O,
          variant: S.Wu.FAB,
          active: v
        })
      }
    )
  )
}
import mt from "../images/matterport-app-icon.svg"

const { SUBSCRIBER_PROMPT: ft } = PhraseKey.SHOWCASE
const gt = e => {
  e.preventDefault()
}
const vt = () => {
  const e = useAnalytics(),
    t = (0, E.b)(),
    { popupDelay: n } = Le(),
    [s, r] = (0, i.useState)(0),
    [a, l] = (0, i.useState)(!1),
    [c, d] = (0, i.useState)(!0),
    [u, h] = (0, xe._)(subscriberDismissedKey, !1)
  ;(0, ht.U)(ActivitycMessage, e => {
    if (a) return
    const t = e.durationDollhouse + e.durationFloorplan + e.durationInside,
      i = s + t
    SubscriberPromptDebugInfo.debug(`Check Visibility: ${i}/${n}ms, User has dismissed popup: ${u.toString()}`), i >= n && !u && l(!0), r(i)
  })
  const p = (0, i.useCallback)(() => {
      h(!0)
    }, [h]),
    m = (0, i.useCallback)(
      t => {
        t.stopPropagation(), e.trackGuiEvent("subscriber_prompt_a_popup_dismissed"), p()
      },
      [p, e]
    ),
    f = (0, i.useCallback)(
      t => {
        e.trackGuiEvent("subscriber_prompt_a_popup_cta_click"), window.open(spacesSubscriberDownURL, "_blank"), p()
      },
      [p, e]
    )
  return (
    (0, i.useEffect)(() => (a && c && (e.trackGuiEvent("subscriber_prompt_a_popup_viewed"), d(!1)), () => {}), [e, a, c]),
    a
      ? (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: "subscriber-prompt-popup",
              onClick: f
            },
            {
              children: [
                (0, o.jsx)("img", {
                  className: "matterport-app-icon",
                  alt: "Matterport App Icon",
                  src: mt,
                  width: "48",
                  height: "48"
                }),
                (0, o.jsxs)(
                  "div",
                  Object.assign(
                    {
                      className: "subscriber-prompt-body"
                    },
                    {
                      children: [
                        (0, o.jsx)(
                          "div",
                          Object.assign(
                            {
                              className: "h5 subscriber-prompt-heading"
                            },
                            {
                              children: t.t(ft.POPUP_CTA_HEADING)
                            }
                          )
                        ),
                        (0, o.jsx)(
                          "a",
                          Object.assign(
                            {
                              className: "link",
                              target: "_blank",
                              onClick: gt,
                              href: spacesSubscriberDownURL
                            },
                            {
                              children: t.t(ft.POPUP_CTA_LINK_TEXT)
                            }
                          )
                        )
                      ]
                    }
                  )
                ),
                (0, o.jsx)(S.zx, {
                  icon: "close",
                  onClick: m
                })
              ]
            }
          )
        )
      : null
  )
}

function yt(e) {
  const { brandingEnabled: t, modelDetails: n, tourPlaying: s, toolElements: r } = e,
    a = (0, ye.O)(),
    l = (0, Q.B)(),
    c = (0, re.R)(),
    d = (0, he.J)(),
    u = (function () {
      const e = (0, Ne.Q)(ToolsList.SEARCH),
        t = Ae()
      return !!t && (0, Ie.J)(t) && !!e
    })(),
    p = (0, Te.d)(),
    m = (function () {
      const e = Ke(),
        t = Ye(),
        [n, s] = (0, i.useState)(e || t)
      return (0, i.useEffect)(() => (s(e || t), () => {}), [e, t]), n
    })(),
    f = (function () {
      const e = qe(),
        [t, n] = (0, i.useState)(e.length > 0)
      return (0, i.useEffect)(() => (n(e.length > 0), () => {}), [e.length]), t
    })(),
    g = m || f,
    v =
      (function () {
        const e = (0, ae.y)(presentationAboutKey, !0),
          t = (0, ae.y)(BtnText.DetailsModelName, !0)
        return e && t
      })() && n,
    y = !!v && !p && (!g || a.width > Ee.Eb),
    b = (() => {
      const e = Me(),
        t = Le(),
        n = (0, xe.Fx)(subscriberDismissedKey)
      return t.popupEnabled && e && !n
    })(),
    E = (0, Se.E)(),
    S = (0, Oe.T)()
  if (!E && S === ToolPanelLayout.BOTTOM_PANEL) return null
  if (!(u || v || p || g)) return null
  const O = s || d,
    T = l || c || O,
    _ = !y || O || l,
    w = !!v,
    A = !w || O || l
  return (0, o.jsxs)(o.Fragment, {
    children: [
      b && !l && (0, o.jsx)(vt, {}),
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "top-ui"
          },
          {
            children: [
              u &&
                (0, o.jsx)(
                  q.N,
                  Object.assign(
                    {
                      open: !T,
                      className: h("top-ui-button", {
                        "faded-out": T
                      })
                    },
                    {
                      children: (0, o.jsx)(ct, {
                        toolName: ToolsList.SEARCH
                      })
                    }
                  )
                ),
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "child-container"
                  },
                  {
                    children: [
                      (0, o.jsx)(
                        q.N,
                        Object.assign(
                          {
                            open: p && !O,
                            className: h("floor-name-container", {
                              collapsed: !p || T
                            })
                          },
                          {
                            children: (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(be.Q, {}),
                                u &&
                                  (0, o.jsx)("div", {
                                    className: "search-button-spacer"
                                  })
                              ]
                            })
                          }
                        )
                      ),
                      v &&
                        (0, o.jsx)(
                          q.N,
                          Object.assign(
                            {
                              open: y && !O && !l,
                              className: h("title-bar-container", {
                                collapsed: _
                              })
                            },
                            {
                              children: (0, o.jsx)(Je, {
                                modelDetails: n,
                                brandingEnabled: !!t
                              })
                            }
                          )
                        ),
                      g &&
                        (0, o.jsx)(
                          q.N,
                          Object.assign(
                            {
                              open: g && !T,
                              className: h("model-view-container", {
                                collapsed: !g || T
                              })
                            },
                            {
                              children: (0, o.jsx)(ot, {})
                            }
                          )
                        )
                    ]
                  }
                )
              ),
              v &&
                (0, o.jsx)(
                  q.N,
                  Object.assign(
                    {
                      open: w && !T,
                      className: h("top-ui-tool-container", {
                        collapsed: A
                      })
                    },
                    {
                      children: r
                    }
                  )
                )
            ]
          }
        )
      )
    ]
  })
}

class Ot extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.onLoadSpinnerMessage = e => {
        this.setState({
          loadSpinnerOn: e.isOpen
        })
      }),
      (this.onLoadSpinnerSuppressMessage = e => {
        this.setState({
          loadSpinnerSuppress: e.suppress
        })
      }),
      (this.state = {
        loadSpinnerOn: !1,
        loadSpinnerSuppress: !1
      })
  }

  componentDidMount() {
    this.bindings.push(
      this.context.messageBus.subscribe(LoadSpinnerMessage, this.onLoadSpinnerMessage),
      this.context.messageBus.subscribe(LoadSpinnerSuppressMessage, this.onLoadSpinnerSuppressMessage),
      this.context.messageBus.subscribe(TourStartedMessage, () =>
        this.setState({
          loadSpinnerSuppress: !0
        })
      ),
      this.context.messageBus.subscribe(TourStoppedMessage, () =>
        this.setState({
          loadSpinnerSuppress: !1
        })
      )
    )
  }

  componentWillUnmount() {
    this.bindings.forEach(e => e.cancel()), (this.bindings.length = 0)
  }

  render() {
    const { loadSpinnerOn: e, loadSpinnerSuppress: t } = this.state,
      n = e && !t
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "overlay-ui"
        },
        {
          children: (0, o.jsx)(bt.Z, {
            showing: n
          })
        }
      )
    )
  }
}

Ot.contextType = AppReactContext

function wt() {
  const e = (0, tt.n)(),
    [t, n] = (0, i.useState)((null == e ? void 0 : e.model.details) || null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}

      function t() {
        e && n(e.model.details)
      }

      const i = e.onChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}

const Lt = {
  "en-US": "./terms/terms-en-US.html",
  es: "./terms/terms-es-MX.html",
  fr: "./terms/terms-fr-FR.html",
  de: "./terms/terms-de-DE.html",
  ru: "./terms/terms-ru-RU.html",
  ja: "./terms/terms-ja-JP.html",
  "zh-CN": "./terms/terms-zh-CN.html",
  "zh-TW": "./terms/terms-zh-TW.html",
  ko: "./terms/terms-ko-KR.html",
  nl: "./terms/terms-nl-NL.html",
  it: "./terms/terms-it-IT.html",
  pt: "./terms/terms-pt-BR.html"
}

class Ct extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.isUnmounting = !1),
      (this.onScrollPositionChange = () => {
        this.scrollbars &&
          this.setState({
            scrollClass: this.scrollbars.scrollPosition.vertical
          })
      }),
      (this.onClose = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.TERMS, !1))
      }),
      (this.state = {
        termsText: "",
        hideScrollbar: isSmallScreen((0, me.O)(t)),
        scrollClass: It.Ij.None
      })
  }

  async componentDidMount() {
    const e = (function (e) {
      if ((0, kt.y)(e) && e in Lt) return Lt[e]
    })(this.context.locale ? this.context.locale.languageCode : xt.k$)
    let t = ""
    if (e)
      try {
        t = await this.context.queue.get(e)
      } catch (e) {
        t = this.context.locale.t(PhraseKey.TERMS_FAIL)
      }
    else t = this.context.locale.t(PhraseKey.TERMS_FAIL)
    this.context.market.waitForData(ContainerData).then(e => {
      this.isUnmounting ||
        (this.resizeSubscription = e.onPropertyChanged("size", e => {
          this.setState({
            hideScrollbar: isSmallScreen(e)
          })
        }))
    }),
      window.requestAnimationFrame(() => {
        this.isUnmounting ||
          this.setState({
            termsText: t
          })
      })
  }

  componentWillUnmount() {
    var e
    ;(this.isUnmounting = !0), null === (e = this.resizeSubscription) || void 0 === e || e.cancel()
  }

  componentDidUpdate(e, t) {
    this.state.termsText !== t.termsText &&
      ((this.termsTextDiv.innerHTML = this.state.termsText),
      [].slice.call(this.termsTextDiv.querySelectorAll("a")).forEach(e => {
        e.setAttribute("target", "_blank"), e.classList.add("link")
      }))
  }

  render() {
    const { hideScrollbar: e, scrollClass: t } = this.state
    return (0, o.jsxs)(
      S.Vq,
      Object.assign(
        {
          className: h("terms-modal", "full-modal", t),
          theme: "dark",
          onClose: this.onClose
        },
        {
          children: [
            (0, o.jsx)(Nt.P, {
              theme: "dark",
              onClose: this.onClose
            }),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  id: "terms-wrapper"
                },
                {
                  children: (0, o.jsx)(
                    At.Z,
                    Object.assign(
                      {
                        name: "terms",
                        ref: e => (this.scrollbars = e),
                        onScrollPositionChange: this.onScrollPositionChange,
                        forceHidden: e
                      },
                      {
                        children: (0, o.jsx)("div", {
                          ref: e => (this.termsTextDiv = e),
                          id: "terms-text"
                        })
                      }
                    )
                  )
                }
              )
            )
          ]
        }
      )
    )
  }
}

Ct.contextType = AppReactContext
const ShareText = {
  COPYLINK: "copylink",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
  MAIL: "mail",
  META: "meta",
  NATIVE: "native",
  PINTEREST: "pinterest",
  TWITTER: "twitter"
}
const { FACEBOOK: jt, TWITTER: Ut, MAIL: Ft, META: Ht, PINTEREST: Bt, LINKEDIN: Vt, COPYLINK: Gt, NATIVE: Wt } = ShareText
const zt = {
  [Ft]: "em",
  [Ht]: "mt",
  [Bt]: "pn",
  [Vt]: "ln",
  [Ut]: "tw",
  [jt]: "fb",
  [Gt]: "cp",
  [Wt]: "os"
}
const $t = {
  [jt]: {
    width: 626,
    height: 436
  },
  [Ut]: {
    width: 550,
    height: 440
  },
  [Bt]: {
    width: 750,
    height: 749
  },
  [Vt]: {
    width: 550,
    height: 453
  },
  [Gt]: {},
  [Ft]: {},
  [Ht]: {},
  [Wt]: {}
}
const Kt = async (e, t = !0) => {
  let n
  const i = await e.engine.getModuleBySymbol(DeepLinksSymbol),
    s = ["ref", "gclid", "fbclid", "cloudEdit", "back", "note", "comment", "apiHost", "applicationKey", "host", "sdkKey", "tag"],
    r = e => !s.includes(e)
  n = t
    ? i.creator.createDeepLink({
        paramFilter: r
      })
    : i.creator.createLink({
        paramFilter: r
      })
  n.searchParams.forEach((e, t) => {
    if (s.includes(t) || 0 === t.indexOf("utm_")) {
      n.searchParams.delete(t)
    }
  })
  return decodeURIComponent(n.href)
}
const Yt = e => new URLSearchParams(e).toString()
const qt = (e: string) => {
  const i = e.replace("?", `?ref=${zt[jt]}&`)
  return `http://www.facebook.com/sharer.php?${Yt({
    display: "popup",
    u: i
  })}`
}
const Zt = (e, t, n) => {
  const i = e.replace("?", `?ref=${zt[Ut]}&`),
    s = {
      text: n.t(PhraseKey.SHARED_MESSAGE_HASHTAG, {
        title: t,
        url: i,
        hashtag: "#Matterport"
      })
    }
  return `http://twitter.com/intent/tweet?${Yt(s)}`
}
const Qt = (e, t, n) => {
  const i = e.replace("?", `?ref=${zt[Ft]}&`),
    s = {
      subject: n.t(PhraseKey.SHARED_TITLE, {
        title: t
      }),
      body: n.t(PhraseKey.SHARED_MESSAGE, {
        title: t,
        url: i
      })
    }
  return `mailto:?${Yt(s)}`
}
const Xt = e => {
  const t = e.replace("?", `?ref=${zt[Ht]}&qs=1&`)
  return `https://www.oculus.com/open_url/?${Yt({
    url: t
  })}`
}
const Jt = (e, t, n, i) => {
  const s = {
    url: e.replace("?", `?ref=${zt[Bt]}&`),
    media: n,
    description: i.t(PhraseKey.SHARED_TITLE, {
      title: t
    })
  }
  return `http://pinterest.com/pin/create/link/?${Yt(s)}`
}
const en = (e: string) => {
  const i = e.replace("?", `?ref=${zt[Vt]}&`)
  return `https://www.linkedin.com/shareArticle?${Yt({
    mini: "true",
    url: i
  })}`
}
const tn = (e, t, n, i) => ({
  [jt]: qt(e),
  [Ut]: Zt(e, t, i),
  [Ft]: Qt(e, t, i),
  [Bt]: Jt(e, t, n, i),
  [Vt]: en(e),
  [Ht]: Xt(e),
  [Gt]: e,
  [Wt]: e
})
const vrSelectDebug = new DebugInfo("vr-select")

class on extends i.Component {
  constructor() {
    super(...arguments),
      (this.isUnmounting = !1),
      (this.startWebXR = () => {
        const { analytics: e, commandBinder: t } = this.context
        t.issueCommand(
          new XrPresentCommand({
            type: "immersive-vr",
            features: ["local-floor"]
          })
        )
          .then(t => {
            if (t) {
              e.trackGuiEvent("vr_enter_app")
              const n = () => {
                e.trackGuiEvent("vr_exit_app"), t.removeEventListener("end", n)
              }
              t.addEventListener("end", n)
            } else vrSelectDebug.error("requestPresent Failed"), e.trackGuiEvent("vr_present_error"), this.updatePlatformState()
          })
          .catch(t => {
            vrSelectDebug.error("requestPresent Failed:", t), e.trackGuiEvent("vr_present_error")
          })
      })
  }

  async componentDidMount() {
    var e
    VRSessionSupported.apiExists() && (null === (e = navigator.xr) || void 0 === e || e.addEventListener("ondevicechange", this.updatePlatformState)),
      await this.updatePlatformState()
  }

  componentWillUnmount() {
    var e
    ;(this.isUnmounting = !0),
      VRSessionSupported.apiExists() && (null === (e = navigator.xr) || void 0 === e || e.removeEventListener("ondevicechange", this.updatePlatformState))
  }

  async updatePlatformState() {
    const { settings: e } = this.context,
      t = e.tryGetProperty(XRBrowserLockKey, sn.xK),
      n = await getVRPlatform(t)
    this.isUnmounting ||
      (this.setState({
        vrPlatform: n
      }),
      vrSelectDebug.debug(this.state))
  }
}

on.contextType = AppReactContext
var ln = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}
const cn = new DebugInfo("vr-select")

@Ze.Z
class dn extends on {
  constructor(e) {
    super(e),
      (this.renderHeadsetHeader = () => {
        const { locale: e } = this.context,
          { vrPlatform: t } = this.state
        switch (t) {
          case XrBrowsers.unsupported:
          case XrBrowsers.webxr:
            return (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "headset-header dark"
                },
                {
                  children: [
                    (0, o.jsxs)(
                      "span",
                      Object.assign(
                        {
                          className: "headset-titles"
                        },
                        {
                          children: [
                            (0, o.jsx)("p", {
                              children: e.t(PhraseKey.VR_RECOMMENDED)
                            }),
                            (0, o.jsx)("p", {
                              children: e.t(PhraseKey.VR_QUEST)
                            })
                          ]
                        }
                      )
                    ),
                    (0, o.jsx)("img", {
                      className: "headset-quest",
                      src: "images/headset-quest-2.png",
                      height: 200,
                      width: 342
                    })
                  ]
                }
              )
            )
          default:
            return null
        }
      }),
      (this.renderBodyText = () => {
        const { locale: e } = this.context,
          { vrPlatform: t } = this.state
        switch (t) {
          case XrBrowsers.unsupported:
          case XrBrowsers.webxr:
            return (0, o.jsx)("div", {
              children: (0, o.jsx)("p", {
                children: e.t(PhraseKey.VR_SUPPORTS)
              })
            })
          default:
            return null
        }
      }),
      (this.getFooterButtons = () => {
        const { locale: e } = this.context,
          { vrPlatform: t, metaLink: n } = this.state,
          i = []
        i.push(
          (0, o.jsx)(
            S.zx,
            {
              variant: S.Wu.SECONDARY,
              className: h("button-inline", "cancel"),
              onClick: this.onLearnMoreClicked,
              label: e.t(PhraseKey.VR_LEARN_MORE_CAPS),
              size: "small"
            },
            "learn-more"
          )
        )
        return (
          t === XrBrowsers.webxr
            ? i.push(
                (0, o.jsx)(
                  S.zx,
                  {
                    variant: S.Wu.PRIMARY,
                    onClick: this.onActionClicked,
                    label: e.t(PhraseKey.VR_ENTER),
                    size: "small"
                  },
                  "enter-vr"
                )
              )
            : i.push(
                (0, o.jsx)(
                  S.zx,
                  {
                    variant: S.Wu.PRIMARY,
                    disabled: !n,
                    onClick: this.onMetaDeepLinkClicked,
                    label: e.t(PhraseKey.VR_META_LINK),
                    size: "small"
                  },
                  "enter-vr"
                )
              ),
          (0, o.jsx)(
            S.hE,
            Object.assign(
              {
                spacing: "small"
              },
              {
                children: i
              }
            )
          )
        )
      }),
      (this.closeModal = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.VR_SELECT, !1))
      }),
      (this.onCloseClicked = () => {
        this.context.analytics.trackGuiEvent("vr_modal_close"), this.closeModal()
      }),
      (this.onActionClicked = () => {
        switch (this.state.vrPlatform) {
          case XrBrowsers.webxr:
            this.startWebXR(), this.closeModal()
        }
      }),
      (this.onMetaDeepLinkClicked = () => {
        this.state.metaLink && (window.open(this.state.metaLink, "_blank"), this.context.analytics.trackGuiEvent("vr_meta_link"))
      }),
      (this.onLearnMoreClicked = () => {
        window.open("https://support.matterport.com/hc/en-us/articles/360050098973-Exploring-Matterport-Spaces-in-VR-", "_blank"),
          this.context.analytics.trackGuiEvent("vr_learn_more")
      }),
      (this.state = {
        vrPlatform: null,
        metaLink: null
      })
  }

  async componentDidMount() {
    await super.componentDidMount(), this.updateUrls(), this.context.analytics.trackGuiEvent("click_vr_button")
  }

  render() {
    const { isMobile: e } = this.props,
      { locale: t } = this.context,
      n = h("vr-modal", "full-modal", {
        mobile: e,
        desktop: !e
      })
    return (0, o.jsxs)(
      S.Vq,
      Object.assign(
        {
          className: n,
          onClose: this.onCloseClicked
        },
        {
          children: [
            (0, o.jsxs)(
              "header",
              Object.assign(
                {
                  className: "modal-header"
                },
                {
                  children: [
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "modal-title"
                        },
                        {
                          children: t.t(PhraseKey.VR_VIEW_SPACE)
                        }
                      )
                    ),
                    (0, o.jsx)(Nt.P, {
                      onClose: this.onCloseClicked
                    })
                  ]
                }
              )
            ),
            this.renderHeadsetHeader(),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: this.renderBodyText()
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "modal-footer"
                },
                {
                  children: this.getFooterButtons()
                }
              )
            )
          ]
        }
      )
    )
  }

  async updateUrls() {
    const [e] = await Promise.all([Kt(this.context, !0)]),
      t = tn(e, "", "", this.context.locale)
    cn.debug("Social Share URLs, with current location", t),
      this.isUnmounting ||
        this.setState({
          metaLink: t.meta
        })
  }
}

const un = dn
const pn = useDataHook(CanvasData)

class fn extends i.Component {
  render() {
    const { isMobile: e } = this.props,
      { locale: t } = this.context
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "cta"
        },
        {
          children: (0, o.jsx)(
            "header",
            Object.assign(
              {
                className: h({
                  mobile: e
                })
              },
              {
                children: t.t(e ? PhraseKey.MOBILE_SHORT_CTA : PhraseKey.DESKTOP_SHORT_CTA)
              }
            )
          )
        }
      )
    )
  }
}

fn.contextType = AppReactContext
const { HELP: yn } = PhraseKey.SHOWCASE

class bn extends i.Component {
  constructor() {
    super(...arguments),
      (this.keys = {
        header: PhraseKey.DESKTOP_SHORT_CTA,
        tourHeader: PhraseKey.CTA_TOUR_COMPLETE,
        tourSubhead: PhraseKey.CTA_EXPLORE_SPACE,
        restartTour: PhraseKey.CTA_RESTART_TOUR,
        share: PhraseKey.CTA_SHARE,
        move: PhraseKey.MOVE,
        inside: PhraseKey.INSIDE,
        rotate: PhraseKey.ROTATE,
        play: PhraseKey.PLAY,
        zoom: PhraseKey.ZOOM
      }),
      (this.clickInside = {
        Icon: gn.W.mouse.clickInside,
        Label: this.keys.inside,
        FooterIcon: gn.W.keyboard.inside,
        Alt: yn.ALT_MOUSE_CLICKINSIDE,
        FooterAlt: yn.ALT_KEYBOARD_INSIDE
      }),
      (this.clickMove = {
        Icon: gn.W.mouse.positionRight,
        Label: this.keys.move,
        FooterIcon: "",
        Alt: yn.ALT_MOUSE_POSITIONRIGHT
      }),
      (this.moveUpDown = {
        Icon: gn.W.mouse.click_old,
        Label: this.keys.move,
        FooterIcon: gn.W.keyboard.upDown,
        Alt: yn.ALT_MOUSE_CLICK,
        FooterAlt: yn.ALT_KEYBOARD_UPDOWN
      }),
      (this.play = {
        Icon: gn.W.mouse.play,
        Label: this.keys.play,
        FooterIcon: null,
        Alt: yn.ALT_MOUSE_PLAY
      }),
      (this.zoom = {
        Icon: gn.W.mouse.zoom_old,
        Label: this.keys.zoom,
        FooterIcon: gn.W.keyboard.zoom,
        Alt: yn.ALT_MOUSE_ZOOM,
        FooterAlt: yn.ALT_KEYBOARD_ZOOM
      }),
      (this.dragMove = {
        Icon: gn.W.mouse.positionLeft_old,
        Label: this.keys.move,
        FooterIcon: null,
        Alt: yn.ALT_MOUSE_POSITIONLEFT
      }),
      (this.dragRotateLeft = {
        Icon: gn.W.mouse.dragLeft,
        Label: this.keys.rotate,
        FooterIcon: gn.W.keyboard.leftRight,
        Alt: yn.ALT_MOUSE_DRAGLEFT,
        FooterAlt: yn.ALT_KEYBOARD_LEFTRIGHT
      }),
      (this.dragRotateRight = {
        Icon: gn.W.mouse.dragRight,
        Label: this.keys.rotate,
        FooterIcon: gn.W.keyboard.leftRight,
        Alt: yn.ALT_MOUSE_DRAGRIGHT,
        FooterAlt: yn.ALT_KEYBOARD_LEFTRIGHT
      }),
      (this.left = this.clickInside),
      (this.center = this.clickMove),
      (this.right = this.play),
      (this.close = async () => {
        const { commandBinder: e } = this.context
        await e.issueCommand(new ToggleModalCommand(x.P.CTA, !1))
      }),
      (this.restartTour = async () => {
        const { commandBinder: e } = this.context
        this.context.analytics.trackGuiEvent("restart_highlights_from_cta"),
          this.close(),
          await e.issueCommand(new TourStepCommand(0, !0)),
          e.issueCommand(new TourStartCommand())
      }),
      (this.share = async () => {
        const { commandBinder: e } = this.context
        this.context.analytics.trackGuiEvent("click_share_button_from_cta"), this.close(), e.issueCommand(new ToggleModalCommand(x.P.SHARE, !0))
      })
  }

  render() {
    const { viewmode: e, isHelpCta: t, shareEnabled: n } = this.props,
      { locale: i } = this.context
    this.configureViewmodeSpecifics(e)
    const s = i.t(t ? this.keys.header : this.keys.tourHeader),
      r = t ? "" : i.t(this.keys.tourSubhead),
      a = i.t(PhraseKey.CTA_SHARE),
      l = i.t(PhraseKey.CTA_RESTART_TOUR)
    return (0, o.jsxs)(o.Fragment, {
      children: [
        (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: h({
                cta: !0
              })
            },
            {
              children: [
                (0, o.jsxs)("header", {
                  children: [
                    s,
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "subhead"
                        },
                        {
                          children: r
                        }
                      )
                    )
                  ]
                }),
                (0, o.jsx)("img", {
                  src: this.left.Icon,
                  alt: this.left.Alt
                }),
                (0, o.jsx)("h2", {
                  children: i.t(this.left.Label)
                }),
                this.left.FooterIcon
                  ? (0, o.jsx)("img", {
                      className: "footer-icon",
                      src: this.left.FooterIcon,
                      alt: this.left.FooterAlt
                    })
                  : (0, o.jsx)("span", {}),
                (0, o.jsx)("img", {
                  src: this.center.Icon,
                  alt: this.center.Alt
                }),
                (0, o.jsx)("h2", {
                  children: i.t(this.center.Label)
                }),
                this.center.FooterIcon
                  ? (0, o.jsx)("img", {
                      className: "footer-icon",
                      src: this.center.FooterIcon,
                      alt: this.center.FooterAlt
                    })
                  : (0, o.jsx)("span", {}),
                (0, o.jsx)("img", {
                  src: this.right.Icon,
                  alt: this.right.Alt
                }),
                (0, o.jsx)("h2", {
                  children: i.t(this.right.Label)
                }),
                this.right.FooterIcon
                  ? (0, o.jsx)("img", {
                      className: "footer-icon",
                      src: this.right.FooterIcon,
                      alt: this.right.FooterAlt
                    })
                  : (0, o.jsx)("span", {})
              ]
            }
          )
        ),
        (0, o.jsx)(S.zx, {
          className: "close-button",
          theme: "dark",
          icon: "close",
          variant: S.Wu.TERTIARY,
          onClick: this.close
        }),
        !t &&
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "footer"
              },
              {
                children: [
                  (0, o.jsx)(S.zx, {
                    onClick: this.restartTour,
                    theme: "dark",
                    label: l,
                    icon: "restart",
                    variant: S.Wu.TERTIARY
                  }),
                  n &&
                    (0, o.jsx)(S.zx, {
                      className: "share",
                      theme: "dark",
                      label: a,
                      icon: "share2",
                      variant: S.Wu.SECONDARY,
                      onClick: this.share
                    })
                ]
              }
            )
          )
      ]
    })
  }

  configureViewmodeSpecifics(e) {
    switch (e) {
      case ViewModeCommand.INSIDE:
        ;(this.left = this.dragRotateLeft), (this.center = this.moveUpDown), (this.right = this.props.isHelpCta ? this.play : this.zoom)
        break
      case ViewModeCommand.OUTSIDE:
        ;(this.left = this.dragRotateLeft), (this.center = this.clickMove), (this.right = this.clickInside)
        break
      case ViewModeCommand.DOLLHOUSE:
        if (!this.isPeekaboo()) {
          ;(this.left = this.dragRotateLeft), (this.center = this.clickMove), (this.right = this.clickInside)
          break
        }
      case ViewModeCommand.FLOORPLAN:
        ;(this.left = this.dragMove), (this.center = this.dragRotateRight), (this.right = this.clickInside)
    }
  }

  isPeekaboo() {
    return this.context.settings.tryGetProperty(DollhousePeekabooKey, !1)
  }
}

bn.contextType = AppReactContext
const { HELP: En } = PhraseKey.SHOWCASE

class Sn extends i.Component {
  constructor() {
    super(...arguments),
      (this.keys = {
        shortCta: PhraseKey.MOBILE_SHORT_CTA,
        tourHeader: PhraseKey.CTA_TOUR_COMPLETE,
        tourSubhead: PhraseKey.CTA_EXPLORE_SPACE,
        move: PhraseKey.MOVE,
        inside: PhraseKey.INSIDE,
        rotate: PhraseKey.ROTATE,
        play: PhraseKey.PLAY,
        zoom: PhraseKey.ZOOM
      }),
      (this.clickInside = {
        Icon: gn.W.gesture.tapInside,
        Label: this.keys.inside,
        Alt: En.ALT_GESTURE_TAPINSIDE
      }),
      (this.clickMove = {
        Icon: gn.W.gesture.tap_old,
        Label: this.keys.move,
        Alt: En.ALT_GESTURE_TAP
      }),
      (this.dragRotate = {
        Icon: gn.W.gesture.drag_old,
        Label: this.keys.rotate,
        Alt: En.ALT_GESTURE_DRAG
      }),
      (this.dragMove = {
        Icon: gn.W.gesture.position,
        Label: this.keys.move,
        Alt: En.ALT_GESTURE_POSITION
      }),
      (this.play = {
        Icon: gn.W.gesture.play,
        Label: this.keys.play,
        Alt: En.ALT_GESTURE_PLAY
      }),
      (this.zoom = {
        Icon: gn.W.gesture.pinch_old,
        Label: this.keys.zoom,
        Alt: En.ALT_GESTURE_PINCH
      }),
      (this.left = this.dragRotate),
      (this.center = this.clickInside),
      (this.right = this.play)
  }

  render() {
    const e = h({
        mobile: !0
      }),
      { viewmode: t, isHelpCta: n } = this.props,
      { locale: i } = this.context
    this.configureViewmodeSpecifics(t)
    const s = i.t(n ? this.keys.shortCta : this.keys.tourHeader),
      r = n ? "" : i.t(this.keys.tourSubhead)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: h({
            cta: !0,
            mobile: !0
          })
        },
        {
          children: [
            (0, o.jsxs)(
              "header",
              Object.assign(
                {
                  className: e
                },
                {
                  children: [
                    s,
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "subhead"
                        },
                        {
                          children: r
                        }
                      )
                    )
                  ]
                }
              )
            ),
            (0, o.jsx)(
              "h2",
              Object.assign(
                {
                  className: e
                },
                {
                  children: i.t(this.left.Label)
                }
              )
            ),
            (0, o.jsx)("img", {
              src: this.left.Icon
            }),
            (0, o.jsx)(
              "h2",
              Object.assign(
                {
                  className: e
                },
                {
                  children: i.t(this.center.Label)
                }
              )
            ),
            (0, o.jsx)("img", {
              src: this.center.Icon
            }),
            (0, o.jsx)(
              "h2",
              Object.assign(
                {
                  className: e
                },
                {
                  children: i.t(this.right.Label)
                }
              )
            ),
            (0, o.jsx)("img", {
              src: this.right.Icon
            })
          ]
        }
      )
    )
  }

  configureViewmodeSpecifics(e) {
    switch (e) {
      case ViewModeCommand.INSIDE:
        ;(this.left = this.dragRotate), (this.center = this.clickMove), (this.right = this.props.isHelpCta ? this.zoom : this.play)
        break
      case ViewModeCommand.DOLLHOUSE:
      case ViewModeCommand.OUTSIDE:
        ;(this.left = this.dragRotate), (this.center = this.clickInside), (this.right = this.props.isHelpCta ? this.zoom : this.play)
        break
      case ViewModeCommand.FLOORPLAN:
        ;(this.left = this.dragMove), (this.center = this.clickInside), (this.right = this.props.isHelpCta ? this.zoom : this.play)
    }
  }
}

Sn.contextType = AppReactContext

enum OnEnum {
  NONE = 0,
  LARGE = 1,
  SMALL = 2
}

const Tn = "cta-seen"

function _n(e) {
  const { commandBinder: t, settings: n } = (0, i.useContext)(AppReactContext),
    { touchDevice: s, viewmode: r, shareEnabled: a } = e,
    l = (0, mn.g)(),
    c = -1 !== (0, je.L)("ts", -1),
    d = (0, je.L)("tourcta", 1),
    u = isIncludes(OnEnum, d) ? d : OnEnum.LARGE,
    m = !!u && l > 0,
    [f, v] = (0, i.useState)(m && c),
    y = (0, je.L)("help", 0),
    b = isIncludes(OnEnum, y) ? y : OnEnum.NONE,
    E = (0, ae.y)(Tn, !1),
    S = E ? OnEnum.NONE : f ? u : b,
    [O, T] = (0, i.useState)(S),
    _ = (0, re.R)(),
    [w, A] = (0, i.useState)(_ === x.P.CTA),
    N = () => {
      t.issueCommand(new ToggleModalCommand(x.P.CTA, !1)), A(!1)
    },
    I = (function () {
      const e = pn()
      return (null == e ? void 0 : e.canvas) || null
    })()
  if (
    ((0, i.useEffect)(
      () => (
        I && (I.addEventListener("mousedown", N), I.addEventListener("pointerdown", N), I.addEventListener("touchstart", N)),
        () => {
          I && (I.removeEventListener("mousedown", N), I.removeEventListener("pointerdown", N), I.removeEventListener("touchstart", N))
        }
      ),
      []
    ),
    (0, ht.U)(TourEndedMessage, () => {
      !E && m && (v(!0), T(u), t.issueCommand(new ToggleModalCommand(x.P.CTA, !0)))
    }),
    (0, i.useEffect)(() => {
      const e = _ === x.P.CTA
      A(e), e && n.setProperty(Tn, !0)
    }, [_]),
    O === OnEnum.NONE)
  )
    return null
  const P = O === OnEnum.SMALL,
    L = !P && !s,
    C = !P && s,
    D = {
      mobile: s,
      small: P,
      helpCta: !f
    }
  return (0, o.jsx)(
    q.N,
    Object.assign(
      {
        open: w,
        className: h("modal-background", "dark-modal-background", {
          open: w
        })
      },
      {
        children: (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: h("modal", "ctaContainer", D)
            },
            {
              children: [
                P &&
                  (0, o.jsx)(fn, {
                    isMobile: s
                  }),
                L &&
                  (0, o.jsx)(bn, {
                    viewmode: r,
                    isHelpCta: !f,
                    shareEnabled: a
                  }),
                C &&
                  (0, o.jsx)(Sn, {
                    viewmode: r,
                    isHelpCta: !f,
                    shareEnabled: a
                  })
              ]
            }
          )
        )
      }
    )
  )
}

enum navigationTab {
  navigation = 0,
  moreHelp = 1
}

const directionText = {
  left: "left",
  middle: "middle",
  right: "right"
}

const panoramaInfo = {
  topInfo: "topInfo",
  bigImage: "bigImage",
  bottomInfo: "bottomInfo",
  keyboard: "keyboard"
}
const Platform = {
  desktop: "desktop",
  mobile: "mobile"
}

const PageState = {
  hlr: "hlr",
  dollhouse: "dollhouse",
  floors: "floors",
  mattertag: "mattertag",
  floorplan: "floorplan",
  tour: "tour",
  inside: "inside",
  vr: "vr",
  view360: "view360",
  fullscreen: "fullscreen"
}

const xn = {
  landscape: "landscape",
  portrait: "portrait"
}

const { HELP: kn } = PhraseKey.SHOWCASE
const Ln = {
  [Platform.desktop]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_PANORAMA_1A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_PANORAMA_1B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.dragLeft,
        alt: kn.ALT_MOUSE_DRAGLEFT
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.leftRight,
        alt: kn.ALT_KEYBOARD_LEFTRIGHT
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_PANORAMA_2A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_PANORAMA_2B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.click_old,
        alt: kn.ALT_MOUSE_CLICK
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.upDown,
        alt: kn.ALT_KEYBOARD_UPDOWN
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_PANORAMA_3A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_PANORAMA_3B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.zoom_old,
        alt: kn.ALT_MOUSE_ZOOM
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.zoom,
        alt: kn.ALT_KEYBOARD_ZOOM
      }
    }
  },
  [Platform.mobile]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_PANORAMA_1",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.drag_old,
        alt: kn.ALT_GESTURE_DRAG
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_PANORAMA_2",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.tap_old,
        alt: kn.ALT_GESTURE_TAP
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_3",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.pinch_old,
        alt: kn.ALT_GESTURE_PINCH
      }
    }
  }
}
const Cn = {
  [Platform.desktop]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_DOLLHOUSE_1A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_DOLLHOUSE_1B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.dragLeft,
        alt: kn.ALT_MOUSE_DRAGLEFT
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.all,
        alt: kn.ALT_KEYBOARD_ALL
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_DOLLHOUSE_2A",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.positionRight,
        alt: kn.ALT_MOUSE_POSITIONRIGHT
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_DOLLHOUSE_3A",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.zoom_old,
        alt: kn.ALT_MOUSE_ZOOM
      }
    }
  },
  [Platform.mobile]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_DOLLHOUSE_1",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.drag_old,
        alt: kn.ALT_GESTURE_DRAG
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_DOLLHOUSE_2",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.positionTwoFinger,
        alt: kn.ALT_GESTURE_POSITIONTWOFINGER
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_3",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.pinch_old,
        alt: kn.ALT_GESTURE_PINCH
      }
    }
  }
}
const Dn = {
  [Platform.desktop]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_FLOORPLAN_1A",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.positionLeft_old,
        alt: kn.ALT_MOUSE_POSITIONLEFT
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_FLOORPLAN_2A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_FLOORPLAN_2B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.dragRight,
        alt: kn.ALT_MOUSE_DRAGRIGHT
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.leftRight,
        alt: kn.ALT_KEYBOARD_LEFTRIGHT
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_DESKTOP_FLOORPLAN_3A",
      [panoramaInfo.bottomInfo]: "HELP_DESKTOP_FLOORPLAN_3B",
      [panoramaInfo.bigImage]: {
        img: gn.W.mouse.zoom_old,
        alt: kn.ALT_MOUSE_ZOOM
      },
      [panoramaInfo.keyboard]: {
        img: gn.W.keyboard.upDown,
        alt: kn.ALT_KEYBOARD_UPDOWN
      }
    }
  },
  [Platform.mobile]: {
    [directionText.left]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_FLOORPLAN_1",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.position,
        alt: kn.ALT_GESTURE_POSITION
      }
    },
    [directionText.middle]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_FLOORPLAN_2",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.dragTwoFinger,
        alt: kn.ALT_GESTURE_DRAGTWOFINGER
      }
    },
    [directionText.right]: {
      [panoramaInfo.topInfo]: "HELP_MOBILE_3",
      [panoramaInfo.bigImage]: {
        img: gn.W.gesture.pinch_old,
        alt: kn.ALT_GESTURE_PINCH
      }
    }
  }
}
const Rn = JSON.parse(JSON.stringify(Ln))
Rn.desktop.middle = {
  [panoramaInfo.topInfo]: "HELP_DESKTOP_360_2A",
  [panoramaInfo.bottomInfo]: "HELP_DESKTOP_360_2B",
  [panoramaInfo.bigImage]: {
    img: gn.W.mouse.clickInside,
    alt: kn.ALT_MOUSE_CLICKINSIDE
  },
  [panoramaInfo.keyboard]: {
    img: gn.W.keyboard.inside,
    alt: kn.ALT_KEYBOARD_INSIDE
  }
}
Rn.mobile.middle = {
  [panoramaInfo.topInfo]: "HELP_MOBILE_360_2",
  [panoramaInfo.bigImage]: {
    img: gn.W.gesture.tapInside,
    alt: kn.ALT_GESTURE_TAPINSIDE
  }
}
const Mn = {
  INSIDE: Ln,
  OUTSIDE: Rn,
  FLOORPLAN: Dn,
  DOLLHOUSE: Cn
}

@Ze.Z
class Fn extends i.Component {
  constructor(e) {
    super(e),
      (this.state = {
        overflow: !1
      })
  }

  UNSAFE_componentWillReceiveProps(e) {
    ;((this.navigationDiv && this.navigationDiv.clientHeight) || 0) /
      ((this.navigationDiv.parentElement && this.navigationDiv.parentElement.clientHeight) || 1) >
      0.7 &&
      this.setState({
        overflow: !0
      })
  }

  getAssetObj(e) {
    switch (e) {
      case this.props.Modes.DOLLHOUSE:
        return Mn.DOLLHOUSE[this.props.device]
      case this.props.Modes.FLOORPLAN:
        return Mn.FLOORPLAN[this.props.device]
      case this.props.Modes.OUTSIDE:
        return Mn.OUTSIDE[this.props.device]
      case this.props.Modes.INSIDE:
      default:
        return Mn.INSIDE[this.props.device]
    }
  }

  buildRows() {
    const e = this.getAssetObj(this.props.viewmode),
      t = []
    for (const n in panoramaInfo) {
      const i = [],
        s = []
      for (const t in directionText)
        if ((i.push(this.wrapAsset(e, t, n, !1)), n === panoramaInfo.bigImage)) {
          const i = !e[t][panoramaInfo.bottomInfo]
          s.push(
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: h(t, "column", {
                    noDivider: i
                  })
                },
                {
                  children: (0, o.jsx)("hr", {})
                }
              ),
              `${n}_${t}_divider_row`
            )
          )
        }
      t.push(
        (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: h(n, "row")
            },
            {
              children: i
            }
          ),
          `${n}_vertical_row`
        )
      )
    }
    return t
  }

  buildMobilePortrait() {
    const e = this.getAssetObj(this.props.viewmode),
      t = []
    for (const n in e) for (const i in e[n]) t.push(this.wrapAsset(e, n, i, !0))
    return t
  }

  wrapAsset(e, t, n, i) {
    const s = e[t][n],
      r = n === panoramaInfo.bigImage || n === panoramaInfo.keyboard,
      a = s ? s.img : void 0,
      l = s && s.alt ? this.context.locale.t(s.alt) : void 0,
      c = (0, o.jsx)("img", {
        src: a,
        alt: l
      })
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: i ? h(n, "row") : h(t, "column")
        },
        {
          children: s && r ? c : s && this.context.locale.t(s)
        }
      ),
      `wrapped_asset_${t}_${n}`
    )
  }

  render() {
    const e = this.props.device === Platform.mobile && this.props.orientation === ScreenOrientationType.PORTRAIT,
      t = h("navigation_old", this.props.viewmode, {
        small: this.state.overflow
      })
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: t,
          ref: e => {
            this.navigationDiv = e
          }
        },
        {
          children: e
            ? (0, o.jsx)(
                At.Z,
                Object.assign(
                  {
                    name: "navigation",
                    forceHidden: !1
                  },
                  {
                    children: (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "nav-wrapper"
                        },
                        {
                          children: this.buildMobilePortrait()
                        }
                      )
                    )
                  }
                )
              )
            : this.buildRows()
        }
      )
    )
  }
}

Fn.contextType = AppReactContext
const Hn = Fn
const Vn = PhraseKey.SHOWCASE.HELP
const Gn = {
  [Platform.desktop]: {
    title: Vn.NAV_DOLLHOUSE_TITLE,
    items: [
      {
        iconSrc: gn.W.mouse.positionLeft,
        iconAlt: Vn.ALT_MOUSE_POSITIONLEFT,
        header: Vn.DESKTOP_DOLLHOUSE_PAN_HEADER,
        text: Vn.DESKTOP_DOLLHOUSE_PAN
      },
      {
        iconSrc: gn.W.mouse.zoom,
        iconAlt: Vn.ALT_MOUSE_ZOOM,
        header: Vn.DESKTOP_DOLLHOUSE_ZOOM_HEADER,
        text: Vn.DESKTOP_DOLLHOUSE_ZOOM
      },
      {
        iconSrc: gn.W.mouse.dragRightHoriz,
        iconAlt: Vn.ALT_MOUSE_DRAGRIGHT_HORIZ,
        header: Vn.DESKTOP_DOLLHOUSE_ROTATE_HEADER,
        text: Vn.DESKTOP_DOLLHOUSE_ROTATE
      },
      {
        iconSrc: gn.W.mouse.dragRightVert,
        iconAlt: Vn.ALT_MOUSE_DRAGRIGHT_VERT,
        header: Vn.DESKTOP_DOLLHOUSE_2D3D_HEADER,
        text: Vn.DESKTOP_DOLLHOUSE_2D3D,
        badge: PhraseKey.GENERIC.NEW_MESSAGE
      }
    ]
  },
  [Platform.mobile]: {
    title: Vn.NAV_DOLLHOUSE_TITLE,
    items: [
      {
        iconSrc: gn.W.gesture.position,
        iconAlt: Vn.ALT_GESTURE_POSITION,
        text: Vn.TOUCH_DOLLHOUSE_PAN
      },
      {
        iconSrc: gn.W.gesture.dragTwoFingerVert,
        iconAlt: Vn.ALT_GESTURE_DRAGTWOFINGER_VERT,
        text: Vn.TOUCH_DOLLHOUSE_2D3D,
        badge: PhraseKey.GENERIC.NEW_MESSAGE
      },
      {
        iconSrc: gn.W.gesture.dragTwoFingerRotate,
        iconAlt: Vn.ALT_GESTURE_TOUCH_ROTATE,
        text: Vn.TOUCH_DOLLHOUSE_ROTATE,
        badge: PhraseKey.GENERIC.NEW_MESSAGE
      },
      {
        iconSrc: gn.W.gesture.pinch,
        iconAlt: Vn.ALT_GESTURE_PINCH,
        text: Vn.TOUCH_DOLLHOUSE_ZOOM
      }
    ]
  }
}
const Wn = {
  [Platform.desktop]: Object.assign(Object.assign({}, Gn[Platform.desktop]), {
    title: Vn.NAV_FLOORPLAN_TITLE
  }),
  [Platform.mobile]: Object.assign(Object.assign({}, Gn[Platform.mobile]), {
    title: Vn.NAV_FLOORPLAN_TITLE
  })
}
const zn = {
  [Platform.desktop]: {
    title: Vn.NAV_INSIDE_TITLE,
    items: [
      {
        iconSrc: gn.W.mouse.positionLeft,
        iconAlt: Vn.ALT_MOUSE_POSITIONLEFT,
        header: Vn.DESKTOP_INSIDE_LOOK_HEADER,
        text: Vn.DESKTOP_INSIDE_LOOK
      },
      {
        iconSrc: gn.W.mouse.zoom,
        iconAlt: Vn.ALT_MOUSE_ZOOM,
        header: Vn.DESKTOP_INSIDE_ZOOM_HEADER,
        text: Vn.DESKTOP_INSIDE_ZOOM
      },
      {
        iconSrc: gn.W.mouse.click,
        iconAlt: Vn.ALT_MOUSE_CLICK,
        header: Vn.DESKTOP_INSIDE_MOVE_HEADER,
        text: Vn.DESKTOP_INSIDE_MOVE
      }
    ]
  },
  [Platform.mobile]: {
    title: Vn.NAV_INSIDE_TITLE,
    items: [
      {
        iconSrc: gn.W.gesture.position,
        iconAlt: Vn.ALT_GESTURE_POSITION,
        text: Vn.TOUCH_INSIDE_LOOK
      },
      {
        iconSrc: gn.W.gesture.tap,
        iconAlt: Vn.ALT_GESTURE_TAP,
        text: Vn.TOUCH_INSIDE_MOVE
      },
      {
        iconSrc: gn.W.gesture.pinch,
        iconAlt: Vn.ALT_GESTURE_PINCH,
        text: Vn.TOUCH_INSIDE_ZOOM
      }
    ]
  }
}
const $n = (0, i.memo)(({ viewmode: e, device: t }) => {
  const n = (0, E.b)(),
    i = (e === ViewModeCommand.FLOORPLAN ? Wn : e === ViewModeCommand.DOLLHOUSE ? Gn : zn)[t]
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: h("navigation", t)
      },
      {
        children: (0, o.jsx)(
          Bn.T,
          Object.assign(
            {
              disabled: !1,
              hideThumb: !1
            },
            {
              children: (0, o.jsxs)("section", {
                children: [
                  i.title &&
                    (0, o.jsx)("h2", {
                      children: n.t(i.title)
                    }),
                  (0, o.jsxs)("ul", {
                    children: [
                      i.items.map(({ iconSrc: e, iconAlt: t, header: i, text: s, badge: r }, a) =>
                        (0, o.jsxs)(
                          "li",
                          {
                            children: [
                              (0, o.jsx)("img", {
                                src: e,
                                alt: n.t(t)
                              }),
                              (i || r) &&
                                (0, o.jsxs)("h3", {
                                  children: [
                                    i && n.t(i) + " ",
                                    r &&
                                      (0, o.jsx)(
                                        "span",
                                        Object.assign(
                                          {
                                            className: "help_badge"
                                          },
                                          {
                                            children: n.t(r)
                                          }
                                        )
                                      )
                                  ]
                                }),
                              (0, o.jsx)("div", {
                                children: n.t(s)
                              })
                            ]
                          },
                          a
                        )
                      ),
                      i.items.length % 2
                        ? (0, o.jsx)("li", {
                            children: (0, o.jsx)("div", {
                              style: {
                                width: 440
                              }
                            })
                          })
                        : null
                    ]
                  })
                ]
              })
            }
          )
        )
      }
    )
  )
})
const Kn = {
  [PageState.hlr]: {
    [panoramaInfo.topInfo]: "HELP_MORE_HLR_A",
    [panoramaInfo.bigImage]: "icon-hlr",
    [panoramaInfo.bottomInfo]: "HELP_DESKTOP_MORE_HLR_B"
  },
  [PageState.dollhouse]: {
    [panoramaInfo.topInfo]: "HELP_MORE_DOLLHOUSE_A",
    [panoramaInfo.bigImage]: "icon-dollhouse",
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_MORE_DOLLHOUSE_B"
  },
  [PageState.floors]: {
    [panoramaInfo.topInfo]: "HELP_MORE_FLOORS_A",
    [panoramaInfo.bigImage]: "icon-floor-controls",
    [panoramaInfo.bottomInfo]: "HELP_DESKTOP_MORE_FLOORS_B"
  },
  [PageState.mattertag]: {
    [panoramaInfo.topInfo]: "HELP_MORE_MATTERTAG_A",
    [panoramaInfo.bigImage]: gn.W.moreHelp.mattertag,
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_MORE_MATTERTAG_B"
  },
  [PageState.tour]: {
    [panoramaInfo.topInfo]: "HELP_MORE_TOUR_A",
    [panoramaInfo.bigImage]: "icon-play",
    [panoramaInfo.bottomInfo]: "HELP_DESKTOP_MORE_TOUR_B"
  },
  [PageState.inside]: {
    [panoramaInfo.topInfo]: "HELP_MORE_INSIDE_A",
    [panoramaInfo.bigImage]: "icon-panorama",
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_MORE_INSIDE_B"
  },
  [PageState.vr]: {
    [panoramaInfo.topInfo]: "HELP_MORE_VR_A",
    [panoramaInfo.bigImage]: "icon-vr",
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_MORE_VR_B"
  },
  [PageState.view360]: {
    [panoramaInfo.topInfo]: "HELP_MORE_360_A",
    [panoramaInfo.bigImage]: gn.W.moreHelp.view360,
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_MORE_360_B"
  },
  [PageState.floorplan]: {
    [panoramaInfo.topInfo]: "HELP_MORE_FLOORPLAN_A",
    [panoramaInfo.bigImage]: "icon-floorplan",
    [panoramaInfo.bottomInfo]: "HELP_MOBILE_FLOORPLAN_B"
  }
}
const Yn = JSON.parse(JSON.stringify(Kn))
Yn[PageState.fullscreen] = {
  [panoramaInfo.topInfo]: "HELP_MORE_FULLSCREEN_A",
  [panoramaInfo.bigImage]: "icon-fullscreen",
  [panoramaInfo.bottomInfo]: "HELP_DESKTOP_MORE_FULLSCREEN_B"
}
Yn[PageState.dollhouse][panoramaInfo.bottomInfo] = "HELP_DESKTOP_MORE_DOLLHOUSE_B"
Yn[PageState.mattertag][panoramaInfo.bottomInfo] = "HELP_DESKTOP_MORE_MATTERTAG_B"
Yn[PageState.inside][panoramaInfo.bottomInfo] = "HELP_DESKTOP_MORE_INSIDE_B"
Yn[PageState.vr][panoramaInfo.bottomInfo] = "HELP_DESKTOP_MORE_VR_B"
Yn[PageState.view360][panoramaInfo.bottomInfo] = "HELP_DESKTOP_MORE_360_B"
Yn[PageState.floorplan][panoramaInfo.bottomInfo] = "HELP_DESKTOP_FLOORPLAN_B"
const qn = {
  [Platform.desktop]: Yn,
  [Platform.mobile]: Kn
}
const Zn = [panoramaInfo.topInfo, panoramaInfo.bigImage, panoramaInfo.bottomInfo]

class Qn extends i.Component {
  constructor(e) {
    super(e), (this.scrollbarsRef = (0, i.createRef)())
  }

  componentDidMount() {
    const e = this.scrollbarsRef.current
    e &&
      e.scrollTo({
        x: 0,
        y: 0
      })
  }

  buildInstructions() {
    const e = [],
      t = this.props.device === Platform.desktop ? 5 : this.props.orientation === ScreenOrientationType.LANDSCAPE ? 3 : 2,
      n = Object.keys(qn[this.props.device])
    for (let i = 0; i < n.length; i += t) {
      for (const s of Zn) {
        const r = []
        for (let e = 0; e < t; e++) {
          if (i + e >= n.length) continue
          const t = qn[this.props.device][n[i + e]][s],
            a = h(s, n[i + e], {
              noAsset: !t
            }),
            l = `${i}_${s}_${e}`
          switch (s) {
            case panoramaInfo.topInfo:
              r.push(
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: a
                    },
                    {
                      children: this.context.locale.t(t)
                    }
                  ),
                  `${l}_top_info`
                )
              )
              break
            case panoramaInfo.bigImage:
              r.push(
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: a
                    },
                    {
                      children:
                        t.indexOf(".png") > -1
                          ? (0, o.jsx)("img", {
                              src: t
                            })
                          : (0, o.jsx)(
                              "span",
                              Object.assign(
                                {
                                  className: t
                                },
                                {
                                  children:
                                    "floors" === n[i + e]
                                      ? (0, o.jsx)("span", {
                                          children: "2"
                                        })
                                      : null
                                }
                              )
                            )
                    }
                  ),
                  `${l}_big_img`
                )
              )
              break
            case panoramaInfo.bottomInfo:
              r.push(
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: a
                    },
                    {
                      children: this.context.locale.t(t)
                    }
                  ),
                  `${l}_bottom_info`
                )
              )
          }
        }
        e.push(
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: h("innerRow", s)
              },
              {
                children: r
              }
            ),
            `${i}_${s}_top_info`
          )
        )
      }
      e.push(
        (0, o.jsx)(
          "div",
          {
            className: "rowPadding"
          },
          `${i}_row_padding`
        )
      )
    }
    return e.pop(), e
  }

  render() {
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: h("more-help-wrapper", this.props.device)
        },
        {
          children: (0, o.jsx)(
            At.Z,
            Object.assign(
              {
                name: "more-help-wrapper",
                ref: this.scrollbarsRef,
                forceHidden: !1
              },
              {
                children: (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: h("more-help")
                    },
                    {
                      children: this.buildInstructions()
                    }
                  )
                )
              }
            )
          )
        }
      )
    )
  }
}

Qn.contextType = AppReactContext
var Xn = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}

@Ze.Z
class Jn extends i.Component {
  constructor(e, t) {
    var n, i
    super(e, t),
      (this.isUnmounting = !1),
      (this.handleTabClick = e => () => {
        this.setState({
          tab: e
        })
      }),
      (this.closeHelp = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.HELP, !1))
      }),
      (this.device = this.props.isMobile ? Platform.mobile : Platform.desktop),
      (this.state = {
        tab: navigationTab.navigation,
        orientation:
          null !== (i = null === (n = t.market.tryGetData(ContainerData)) || void 0 === n ? void 0 : n.orientation) && void 0 !== i
            ? i
            : ScreenOrientationType.LANDSCAPE
      })
  }

  componentDidMount() {
    this.context.market.waitForData(ContainerData).then(e => {
      this.isUnmounting ||
        (this.orientationSubscription = e.onPropertyChanged("orientation", e => {
          this.setState({
            orientation: e
          })
        }))
    })
  }

  componentWillUnmount() {
    var e
    ;(this.isUnmounting = !0), null === (e = this.orientationSubscription) || void 0 === e || e.cancel()
  }

  render() {
    const { tab: e, orientation: t } = this.state
    return (0, o.jsxs)(
      S.Vq,
      Object.assign(
        {
          className: h("full-modal", "help-modal", this.device),
          theme: "dark",
          onClose: this.closeHelp
        },
        {
          children: [
            (0, o.jsx)(Nt.P, {
              theme: "dark",
              onClose: this.closeHelp
            }),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: h("tabs", e)
                },
                {
                  children: [
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: h("navigation-tab", {
                            active: e === navigationTab.navigation
                          }),
                          onClick: this.handleTabClick(navigationTab.navigation)
                        },
                        {
                          children: (0, o.jsx)("span", {
                            children: this.context.locale.t(PhraseKey.HELP_NAVIGATION_TAB)
                          })
                        }
                      )
                    ),
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: h("more-help-tab", {
                            active: e === navigationTab.moreHelp
                          }),
                          onClick: this.handleTabClick(navigationTab.moreHelp)
                        },
                        {
                          children: (0, o.jsx)("span", {
                            children: this.context.locale.t(PhraseKey.HELP_MORE_HELP_TAB)
                          })
                        }
                      )
                    )
                  ]
                }
              )
            ),
            e === navigationTab.navigation &&
              (this.context.settings.tryGetProperty(DollhousePeekabooKey, !1)
                ? (0, o.jsx)($n, {
                    device: this.device,
                    viewmode: this.props.viewmode
                  })
                : (0, o.jsx)(Hn, {
                    device: this.device,
                    Modes: this.props.allModes,
                    viewmode: this.props.viewmode,
                    orientation: t
                  })),
            e === navigationTab.moreHelp &&
              (0, o.jsx)(Qn, {
                device: this.device,
                orientation: t
              })
          ]
        }
      )
    )
  }
}

Jn.contextType = AppReactContext

const ei = Jn
const si = new DebugInfo("share-modal")

class ri extends i.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.copyURL = () => {
        const { deeplink: e } = this.state,
          t = this.urlInputRef
        if (t) {
          const n = new URL(t.value)
          ;(n.hash = ""),
            (0, ii.v)(n.toString()),
            this.setState({
              copied: !0
            }),
            this.context.analytics.track("JMYDCase_share_action", {
              channel: ShareText.COPYLINK,
              pano_id: this.sweepData.currentSweep,
              deeplink: e
            }),
            window.setTimeout(() => {
              this.setState({
                copied: !1
              })
            }, 2500)
        }
      }),
      (this.toggleDeeplinks = () => {
        const { deeplink: e } = this.state
        this.setState({
          deeplink: !e
        })
      }),
      (this.close = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.SHARE, !1))
      }),
      (this.openShareWindow = e => {
        const { urls: t, deeplink: n, deeplinkUrls: i } = this.state,
          { width: s, height: r } = $t[e],
          a = n ? i[e] : t[e]
        let o
        if (s && r) {
          o =
            "top=" +
            (window.screenY + (window.innerHeight - r) / 2) +
            ",left=" +
            (window.screenX + (window.innerWidth - s) / 2) +
            ",width=" +
            s +
            ",height=" +
            r
        }
        this.context.analytics.track("JMYDCase_share_action", {
          channel: e,
          pano_id: this.sweepData.currentSweep,
          deeplink: n
        }),
          window.open(a, "", o)
      }),
      (this.openWebShareApi = e => {
        if (!navigator.share) return
        const { excerpt: t, title: n, urls: i, deeplinkUrls: s } = this.state,
          r = {
            url: e ? s[ShareText.COPYLINK] : i[ShareText.COPYLINK],
            text: t,
            title: n
          }
        si.debug("Launching Web Share API", r),
          navigator.share(r),
          this.context.analytics.track("JMYDCase_share_action", {
            channel: ShareText.NATIVE,
            pano_id: this.sweepData.currentSweep,
            deeplink: e
          })
      }),
      (this.onWebShareClick = () => {
        this.openWebShareApi(!1)
      }),
      (this.onWebShareDeeplinkClick = () => {
        this.openWebShareApi(!0)
      }),
      (this.setUrlInputRef = e => {
        this.urlInputRef = e
      }),
      (this.state = {
        urls: {},
        deeplinkUrls: {},
        title: "",
        excerpt: "",
        image: "",
        copied: !1,
        deeplink: !1,
        webShareEnabled: sharePhone()
      }),
      (this.openFacebook = this.openShareWindow.bind(this, ShareText.FACEBOOK)),
      (this.openTwitter = this.openShareWindow.bind(this, ShareText.TWITTER)),
      (this.openPinterest = this.openShareWindow.bind(this, ShareText.PINTEREST)),
      (this.openLinkedIn = this.openShareWindow.bind(this, ShareText.LINKEDIN)),
      (this.openEmail = this.openShareWindow.bind(this, ShareText.MAIL))
  }

  async componentDidMount() {
    const { market: e } = this.context,
      [t, n] = await Promise.all([e.waitForData(ModelData), e.waitForData(SweepsData)])
    this.sweepData = n
    const i = t.model,
      s = `${window.location.origin}/api/v1/player/models/${i.sid}/thumb`,
      r = i.details.name
    this.isUnmounting ||
      this.setState(
        {
          title: r,
          image: s
        },
        this.updateUrls
      )
  }

  componentWillUnmount() {
    this.isUnmounting = !0
  }

  async updateUrls() {
    const { title: e, image: t } = this.state,
      [n, i] = await Promise.all([Kt(this.context, !1), Kt(this.context, !0)]),
      s = tn(n, e, t, this.context.locale),
      r = tn(i, e, t, this.context.locale)
    si.debug("Social Share URLs:", s),
      si.debug("Social Share URLs, with current location", r),
      this.isUnmounting ||
        this.setState({
          urls: s,
          deeplinkUrls: r
        })
  }

  renderWebShareDialog() {
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "share-controls"
        },
        {
          children: [
            (0, o.jsx)(S.zx, {
              className: "share-modal-button",
              variant: S.Wu.PRIMARY,
              size: S.qE.LARGE,
              onClick: this.onWebShareDeeplinkClick,
              label: this.context.locale.t(PhraseKey.SHARE_CURRENT_LOCATION)
            }),
            (0, o.jsx)(S.zx, {
              className: "share-modal-button",
              variant: S.Wu.SECONDARY,
              size: S.qE.LARGE,
              onClick: this.onWebShareClick,
              label: this.context.locale.t(PhraseKey.SHARE_DEFAULT_LOCATION)
            })
          ]
        }
      )
    )
  }

  renderShareDialog() {
    const { copied: e, deeplink: t, urls: n, deeplinkUrls: i } = this.state,
      { locale: s } = this.context,
      r = t ? i[ShareText.COPYLINK] : n[ShareText.COPYLINK],
      a = this.sweepData && this.sweepData.isSweepDisabled(),
      l = a ? s.t(PhraseKey.SHARE_ERROR_SWEEP_DISABLED) : void 0
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "share-controls"
        },
        {
          children: [
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "social-icons"
                },
                {
                  children: [
                    (0, o.jsx)(S.zx, {
                      onClick: this.openFacebook,
                      icon: "facebook",
                      variant: S.Wu.FAB,
                      size: "large",
                      theme: "dark",
                      ariaLabel: s.t(PhraseKey.SHARE_FACEBOOK)
                    }),
                    (0, o.jsx)(S.zx, {
                      onClick: this.openTwitter,
                      icon: "twitter",
                      variant: S.Wu.FAB,
                      size: "large",
                      theme: "dark",
                      ariaLabel: s.t(PhraseKey.SHARE_TWITTER)
                    }),
                    (0, o.jsx)(S.zx, {
                      onClick: this.openLinkedIn,
                      icon: "linkedin",
                      variant: S.Wu.FAB,
                      size: "large",
                      theme: "dark",
                      ariaLabel: s.t(PhraseKey.SHARE_LINKEDIN)
                    }),
                    (0, o.jsx)(S.zx, {
                      onClick: this.openPinterest,
                      icon: "pinterest",
                      variant: S.Wu.FAB,
                      size: "large",
                      theme: "dark",
                      ariaLabel: s.t(PhraseKey.SHARE_PINTEREST)
                    }),
                    (0, o.jsx)(S.zx, {
                      onClick: this.openEmail,
                      icon: "email",
                      variant: S.Wu.FAB,
                      size: "large",
                      theme: "dark",
                      ariaLabel: s.t(PhraseKey.SHARE_MAIL)
                    })
                  ]
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "input-group"
                },
                {
                  children: [
                    (0, o.jsx)("input", {
                      className: "input",
                      type: "text",
                      value: r || "",
                      ref: this.setUrlInputRef,
                      readOnly: !0
                    }),
                    (0, o.jsx)(S.zx, {
                      className: "input-addon",
                      variant: S.Wu.SECONDARY,
                      onClick: this.copyURL,
                      label: this.context.locale.t(PhraseKey.COPY),
                      tooltip: e ? this.context.locale.t(PhraseKey.SHARE_COPIED) : this.context.locale.t(PhraseKey.COPY_URL)
                    })
                  ]
                }
              )
            ),
            (0, o.jsx)(S.XZ, {
              defaultChecked: t,
              disabled: a,
              label: this.context.locale.t(PhraseKey.SHARE_LINK_TO_LOCATION),
              onChange: this.toggleDeeplinks
            }),
            a &&
              (0, o.jsx)(
                "p",
                Object.assign(
                  {
                    className: "error-message"
                  },
                  {
                    children: l
                  }
                )
              )
          ]
        }
      )
    )
  }

  render() {
    const { webShareEnabled: e } = this.state,
      t = h("share-modal", "modal-dialog", {
        "share-dialog": !e,
        "web-share-dialog": e
      }),
      n = e ? this.renderWebShareDialog() : this.renderShareDialog()
    return (0, o.jsxs)(
      S.Vq,
      Object.assign(
        {
          className: t,
          onClose: this.close
        },
        {
          children: [
            (0, o.jsxs)(
              "header",
              Object.assign(
                {
                  className: "modal-header"
                },
                {
                  children: [
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "modal-title"
                        },
                        {
                          children: this.context.locale.t(PhraseKey.SHARE_MODAL_TITLE)
                        }
                      )
                    ),
                    (0, o.jsx)(Nt.P, {
                      onClose: this.close
                    })
                  ]
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: n
                }
              )
            )
          ]
        }
      )
    )
  }
}

ri.contextType = AppReactContext

class ai extends i.Component {
  constructor(e, t) {
    super(e),
      (this.closeModal = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.MEASUREMENT_HELP, !1))
      }),
      (this.locale = {
        headerString: t.locale.t(PhraseKey.MEASUREMENT_MODE),
        subHeaderString: t.locale.t(PhraseKey.MEASUREMENT_HELP_MODAL_SUB_HEADER),
        body1String: t.locale.t(PhraseKey.MEASUREMENT_HELP_MODAL_BODY_1),
        body2String: t.locale.t(PhraseKey.MEASUREMENT_HELP_MODAL_BODY_2)
      })
  }

  render() {
    const { headerString: e, subHeaderString: t, body1String: n, body2String: i } = this.locale,
      { mobile: s } = this.props
    return (0, o.jsxs)(
      S.Vq,
      Object.assign(
        {
          className: h("full-modal", "measurement-mode-help-modal", {
            mobile: s
          }),
          onClose: this.closeModal
        },
        {
          children: [
            (0, o.jsxs)(
              "header",
              Object.assign(
                {
                  className: "modal-header"
                },
                {
                  children: [
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "modal-title"
                        },
                        {
                          children: e
                        }
                      )
                    ),
                    (0, o.jsx)(Nt.P, {
                      onClose: this.closeModal
                    })
                  ]
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "modal-subheader"
                },
                {
                  children: t
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: [
                    (0, o.jsx)(
                      "p",
                      Object.assign(
                        {
                          className: "modal-paragraph"
                        },
                        {
                          children: n
                        }
                      )
                    ),
                    (0, o.jsx)(
                      "p",
                      Object.assign(
                        {
                          className: "modal-paragraph"
                        },
                        {
                          children: i
                        }
                      )
                    )
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
}

ai.contextType = AppReactContext

function ui(e) {
  const { viewmode: t, shareEnabled: n } = e,
    { commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = wt(),
    a = (0, re.R)(),
    l = (0, ci.j)(),
    c = (0, i.useMemo)(() => winCanTouch(), [])
  if (!r) return null
  const d = t === ViewModeCommand.DOLLHOUSE && isPitchFactorOrtho(l) ? ViewModeCommand.FLOORPLAN : t,
    u = a === x.P.SHARE,
    m = a === x.P.TERMS,
    f = a === x.P.HELP,
    g = a === x.P.MEASUREMENT_HELP,
    v = a === x.P.VR_SELECT,
    y = a === x.P.RATING_THANK_YOU,
    b = m || f,
    E = u || b || g || y || (v && !!r)
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        id: "JMYDCase-modals"
      },
      {
        children: [
          (0, o.jsx)(li.s, {
            commandBinder: s
          }),
          (0, o.jsx)(_n, {
            touchDevice: c,
            viewmode: d,
            shareEnabled: n
          }),
          (0, o.jsxs)(
            q.N,
            Object.assign(
              {
                className: h("modal-background", {
                  "dark-modal-background": b,
                  open: E
                }),
                open: E,
                selectChild: !0,
                childKey: a || void 0,
                onClick: () => {
                  s.issueCommand(new CloseModalCommand())
                }
              },
              {
                children: [
                  (0, o.jsx)(ri, {}, x.P.SHARE),
                  (0, o.jsx)(
                    ai,
                    {
                      mobile: c
                    },
                    x.P.MEASUREMENT_HELP
                  ),
                  (0, o.jsx)(
                    un,
                    {
                      isMobile: c,
                      modelDetails: r
                    },
                    x.P.VR_SELECT
                  ),
                  m && (0, o.jsx)(Ct, {}, x.P.TERMS),
                  f &&
                    (0, o.jsx)(
                      ei,
                      {
                        isMobile: c,
                        viewmode: d,
                        allModes: ViewModeCommand
                      },
                      x.P.HELP
                    ),
                  y && (0, o.jsx)(oi.B, {}, x.P.RATING_THANK_YOU)
                ]
              }
            )
          )
        ]
      }
    )
  )
}

@Ze.Z
class Oi extends on {
  constructor(e) {
    super(e),
      (this.state = {
        vrPlatform: null
      })
  }

  render() {
    return this.state.vrPlatform === XrBrowsers.webxr ? this.renderOverlayCta() : null
  }

  renderOverlayCta() {
    const { locale: e } = this.context
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          id: "vr-overlay-layer",
          className: "overlay grid-overlay"
        },
        {
          children: (0, o.jsx)(
            Ei.o,
            Object.assign(
              {
                small: !0
              },
              {
                children: (0, o.jsx)(S.zx, {
                  size: S.qE.SMALL,
                  variant: S.Wu.FAB,
                  theme: "dark",
                  label: e.t(PhraseKey.VR_ENTER),
                  onClick: this.startWebXR
                })
              }
            )
          )
        }
      )
    )
  }
}

Oi.contextType = AppReactContext

import { Root } from "react-dom/client"
import { isIncludes } from "../other/29708"
import * as ki from "../other/36306"
import * as Ki from "../other/366"
import * as Ti from "../other/56509"
import * as Gi from "../other/73372"
import * as nh from "../other/74554"
import * as Ci from "../other/77543"
import { SetMoveCameraOnViewChangeCommand } from "../command/camera.command"
import { DefaultErrorCommand } from "../command/error.command"
import { LayerToggleCommand, ModelViewSetCommand } from "../command/layers.command"
import { CloseModalCommand, ToggleModalCommand } from "../command/ui.command"
import { StartLocationGotoCommand } from "../command/startLocation.command"
import { RegisterTagsToolCommand } from "../command/tag.command"
import { OpenInitialToolCommand, RegisterToolsCommand, ToggleToolCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { HighlightReelToggleOpenCommand } from "../command/tour.command"
import { TourNextStepCommand, TourPreviousStepCommand, TourStartCommand, TourStepCommand, TourStopCommand } from "../command/tour.command"
import { GetModeChangCommand, ViewModeCommand } from "../command/viewmode.command"
import { XrPresentCommand } from "../command/xr.command"
import { FeaturesNotesNudgeKey } from "../const/39693"
import { DollhousePeekabooKey } from "../const/66777"
import * as Qi from "../const/73698"
import { FeaturesFloorselectKey } from "../const/floor.const"
import { SpacesPluginsKey } from "../const/spaces.const"
import EngineContext from "../core/engineContext"
import { CamStartData } from "../data/camstart.data"
import { CanvasData } from "../data/canvas.data"
import { ContainerData } from "../data/container.data"
import { BtnText } from "../data/player.options.data"
import { SdkData } from "../data/sdk.data"
import { ToolsData } from "../data/tools.data"
import { ToursViewData } from "../data/tours.view.data"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { ActivitycMessage } from "../message/activity.ping.message"
import { AppPhaseChangeMessage } from "../message/app.message"
import { ForbiddenErrorMessage, SaveErrorMessage } from "../message/error.message"
import { LoadSpinnerMessage, LoadSpinnerSuppressMessage } from "../message/ui.message"
import { ReelIndexMessage, TourStartedMessage, TourEndedMessage, TourSteppedMessage, TourStoppedMessage } from "../message/tour.message"
import { ToolObject } from "../object/tool.object"
import { waitRun } from "../utils/func.utils"
import { XrBrowsers } from "../utils/vr.utils"
import { SubscriberPromptDebugInfo } from "../other/83038"
import { VRSessionSupported } from "../utils/vr.utils"
import { useDataHook } from "../other/45755"
import { isSmallScreen } from "../utils/61687"

const { TOURS: _i } = PhraseKey.SHOWCASE

function wi(e) {
  const { locale: t, messageBus: n, settings: s, commandBinder: r } = (0, i.useContext)(AppReactContext),
    { highlights: a, tourPlaying: l } = e,
    c = (0, Ti.Y)(),
    d = t.t(_i.TOUR_CONTROLS_TITLE),
    u = t.t(_i.TOUR_CONTROLS_CTA),
    m = 0 === a.length,
    [f, g] = (0, i.useState)(!1),
    v = (0, i.useCallback)(
      async e => {
        m || (e.stopPropagation(), await r.issueCommand(new TourNextStepCommand()))
      },
      [m, r]
    ),
    y = (0, i.useCallback)(
      async e => {
        m || (e.stopPropagation(), await r.issueCommand(new TourPreviousStepCommand()))
      },
      [m, r]
    )
  return (
    (0, i.useEffect)(() => {
      const e = []
      let t = 0
      const i = () => {
        g(!1)
      }
      return (
        e.push(
          n.subscribe(TourStartedMessage, () => {}),
          n.subscribe(TourStoppedMessage, i)
        ),
        () => {
          e.forEach(e => e.cancel()), clearInterval(t)
        }
      )
    }, [n, s, c]),
    (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: h("tour-story-controls-mobile", {
            prompt: f,
            tourPlaying: l
          })
        },
        {
          children: [
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "tour-story-help-title"
                },
                {
                  children: d
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "tour-story-help-cta"
                },
                {
                  children: u
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "tour-story-prev",
                  onClick: y
                },
                {
                  children: (0, o.jsx)("div", {
                    className: "icon icon-dpad-left"
                  })
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "tour-story-next",
                  onClick: v
                },
                {
                  children: (0, o.jsx)("div", {
                    className: "icon icon-dpad-right"
                  })
                }
              )
            )
          ]
        }
      )
    )
  )
}

const Ai = new DebugInfo("JMYDCase-ui"),
  Ni = getURLParams()

class Ii extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.bindings = []),
      (this.propertiesToRefreshUi = [BtnText.Measurements, BtnText.DetailsModelName, FeaturesFloorselectKey, BtnText.FloorSelect, FeaturesNotesModeKey]),
      (this.isUnmounting = !1),
      (this.getModeChange = e => ({
        viewmode: (0, GetModeChangCommand)(e.toMode)
      })),
      (this.updateToolPanelLayout = () => {
        const { toolsData: e } = this.context,
          t = e.toolPanelLayout
        this.setState({
          toolPanelLayout: t
        })
      }),
      (this.showHelpOnPlaying = e => {
        e.phase === AppStatus.PLAYING &&
          (this.context.commandBinder.issueCommand(new ToggleModalCommand(x.P.CTA, !0)),
          this.context.messageBus.unsubscribe(AppPhaseChangeMessage, this.showHelpOnPlaying))
      }),
      (this.updateTools = () => {
        const { toolsData: e } = this.context,
          { toolsLoaded: t } = this.state,
          n = e.toolsMap
        this.setState({
          toolsCount: n.length
        }),
          n.length > 0 &&
            !t &&
            (this.setState({
              toolsLoaded: !0
            }),
            window.setTimeout(() => {
              this.context.commandBinder.issueCommand(new OpenInitialToolCommand())
            }, 750))
      }),
      (this.updatePerSettings = () => {
        const { settings: e } = this.context
        this.setState({
          measurementsModeEnabled: e.tryGetProperty(BtnText.Measurements, !0),
          notesEnabled: e.tryGetProperty(FeaturesNotesModeKey, !1)
        })
      }),
      (this.updateTourState = () => {
        this.tourData &&
          this.setState({
            tourState: this.tourData.getCurrentTourState()
          })
      }),
      (this.updateTourMode = () => {
        this.toursViewData &&
          this.setState({
            tourMode: this.toursViewData.currentTourMode
          })
      }),
      (this.isVrButtonEnabled = () => VRCanUSE(this.context.settings)),
      (this.updateActiveTool = () => {
        const { tourState: e } = this.state,
          { toolsData: t, commandBinder: n } = this.context,
          i = t.activeToolName
        i && e.tourPlaying && n.issueCommand(new TourStopCommand(), !1),
          this.setState({
            activeToolName: i
          })
      }),
      (this.openModalChanged = () => {
        const { toolsData: e } = this.context,
          t = e.openModal
        this.setState({
          openModal: t
        })
      }),
      (this.state = {
        viewmode: ViewModeInsideCommand,
        activeToolName: null,
        openModal: null,
        toolsLoaded: !1,
        toolsCount: 0,
        toolPanelLayout: t.toolsData.toolPanelLayout,
        tourState: {},
        tourMode: TourMode.NONE,
        modelDetails: null,
        measurementsModeEnabled: !1,
        notesEnabled: !1,
        vrEnabled: !1,
        brandingEnabled: !1,
        shareEnabled: !1,
        unaligned: !0,
        showExternalUrl: !1
      })
  }

  async componentDidMount() {
    const { settings: e, messageBus: t, market: n, toolsData: i, mainDiv: s } = this.context
    s.classList.remove("with-toolbar")
    for (const t of this.propertiesToRefreshUi) e.onPropertyChanged(t, this.updatePerSettings)
    try {
      this.cancelBindings(),
        (this.bindings = [
          i.onPropertyChanged("activeToolName", this.updateActiveTool),
          i.onPropertyChanged("openModal", this.openModalChanged),
          i.onPropertyChanged("toolPanelLayout", this.updateToolPanelLayout),
          i.toolsMap.onChanged(this.updateTools)
        ]),
        this.handleStartUpHelp()
      const [e, s, r, a, o] = await Promise.all([
        n.waitForData(ModelData),
        n.waitForData(ViewmodeData),
        n.waitForData(SweepsData),
        n.waitForData(_TourData),
        n.waitForData(ToursViewData)
      ])
      if (this.isUnmounting) return
      this.bindings.push(
        t.subscribe(EndSwitchViewmodeMessage, e => this.setState(Object.assign(Object.assign({}, this.getModeChange(e)), this.getUnalignedSweepState()))),
        t.subscribe(TourStoppedMessage, this.updateTourState),
        t.subscribe(TourStartedMessage, this.updateTourState),
        t.subscribe(TourSteppedMessage, this.updateTourState),
        t.subscribe(TourEndedMessage, this.updateTourState),
        t.subscribe(ReelIndexMessage, this.updateTourState),
        a.getReel().onChanged(this.updateTourState),
        o.onPropertyChanged("currentTourMode", this.updateTourMode),
        r.makeSweepChangeSubscription(() => this.setState(this.getUnalignedSweepState()))
      )
      const l = (0, GetModeChangCommand)(s.currentMode || ViewModes.Panorama)
      ;(this.tourData = a),
        (this.toursViewData = o),
        (this.sweepData = r),
        (this.viewmodeData = s),
        this.setState(
          Object.assign(
            {
              viewmode: l,
              modelDetails: e.model.details,
              brandingEnabled: this.isBrandingEnabled() && !this.isMlsEnabled(),
              shareEnabled: this.isShareEnabled() && !this.isMlsEnabled(),
              showExternalUrl: this.isBrandingEnabled() && !this.isMlsEnabled(),
              vrEnabled: this.isVrButtonEnabled()
            },
            this.getUnalignedSweepState()
          )
        ),
        this.props.onAppReadyChanged(!0, !1)
    } catch (e) {
      Ai.debug(e)
    }
    this.updateTourState(), this.updateTourMode(), this.updateActiveTool(), this.updateToolPanelLayout(), this.updateTools(), this.updatePerSettings()
  }

  async componentWillUnmount() {
    this.isUnmounting = !0
    for (const e of this.propertiesToRefreshUi) this.context.settings.removeOnPropertyChanged(e, this.updatePerSettings)
    this.cancelBindings(), this.props.onAppReadyChanged(!1, !1)
  }

  handleStartUpHelp() {
    const { settings: e, messageBus: t, commandBinder: n } = this.context,
      i = e.getOverrideParam("help", 0)
    if (1 === i || 2 === i) {
      const i = 1 === e.getOverrideParam("ts", 0),
        s = !0 === e.tryGetProperty("quickstart", !1)
      i || (s ? n.issueCommand(new ToggleModalCommand(x.P.CTA, !0)) : t.subscribe(AppPhaseChangeMessage, this.showHelpOnPlaying))
    }
  }

  getUnalignedSweepState() {
    if (!this.sweepData || !this.viewmodeData)
      return {
        unaligned: this.state.unaligned
      }
    return {
      unaligned: this.viewmodeData.isInside() && this.sweepData.isSweepUnaligned(this.sweepData.currentSweep)
    }
  }

  cancelBindings() {
    for (const e of this.bindings) e.cancel()
  }

  isShareEnabled() {
    const { settings: e } = this.context,
      t = e.tryGetProperty(socialSharingKey, !1) && e.tryGetProperty("is_public", !1),
      n = sameShowcase() && "0" === Ni.share
    return t && !n
  }

  isMlsEnabled() {
    return this.context.settings.tryGetProperty(presentationMlsModeKey, !1)
  }

  isBrandingEnabled() {
    const { settings: e } = this.context
    return e.tryGetProperty(brandingEnabledKey, !0)
  }

  renderActiveToolOverlay() {
    var e
    const { toolsData: t } = this.context,
      n = t.toolsMap,
      { activeToolName: i } = this.state,
      s = i && (null === (e = n.get(i)) || void 0 === e ? void 0 : e.ui),
      r = (null == s ? void 0 : s.renderOverlay) ? s.renderOverlay() : null
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "tool-overlay"
        },
        {
          children: [r, !i && (0, o.jsx)(Oi, {})]
        }
      )
    )
  }

  renderPersistentToolOverlay() {
    const { toolsData: e } = this.context,
      t = e.toolsMap.values.map(e => e.ui.renderPersistentOverlay && e.ui.renderPersistentOverlay()).filter(e => !!e)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "overlay-ui"
        },
        {
          children: t
        }
      )
    )
  }

  renderToolTopUI() {
    const { toolsData: e } = this.context,
      t = e.toolsMap.values.map(e => e.ui.renderTopUI && e.ui.renderTopUI()).filter(e => !!e)
    return t || void 0
  }

  render() {
    const {
        viewmode: e,
        unaligned: t,
        tourState: n,
        modelDetails: i,
        measurementsModeEnabled: s,
        notesEnabled: r,
        shareEnabled: a,
        brandingEnabled: l,
        vrEnabled: c,
        openModal: d,
        toolsLoaded: u,
        toolPanelLayout: h,
        activeToolName: p,
        tourMode: m
      } = this.state,
      { tourPlaying: f, activeStep: g, currentStep: v, highlights: y } = n,
      b = m === TourMode.STORIES,
      E = this.renderToolTopUI()
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          id: "gui",
          className: "JMYDCase-ui"
        },
        {
          children: [
            !!i &&
              (0, o.jsx)(yt, {
                modelDetails: i,
                tourPlaying: f,
                brandingEnabled: l,
                toolElements: E
              }),
            (0, o.jsx)(ui, {
              viewmode: e,
              shareEnabled: a
            }),
            (0, o.jsx)(
              bi.R,
              Object.assign(
                {
                  className: "JMYDCase-ui-overlay"
                },
                {
                  children: (0, o.jsxs)(o.Fragment, {
                    children: [
                      b &&
                        (0, o.jsx)(Tt.G, {
                          currentStep: v,
                          activeStep: g,
                          highlights: y
                        }),
                      b &&
                        (0, o.jsx)(wi, {
                          highlights: y,
                          tourPlaying: f
                        }),
                      (0, o.jsx)(Ot, {}),
                      (0, o.jsx)(_t.y, {}),
                      u && this.renderActiveToolOverlay(),
                      u && this.renderPersistentToolOverlay(),
                      (0, o.jsx)(ve, {
                        openModal: d,
                        openTool: p,
                        unaligned: t,
                        viewmode: e,
                        tourState: n,
                        tourMode: m,
                        measurementsModeEnabled: s,
                        notesEnabled: r,
                        shareEnabled: a,
                        vrEnabled: c,
                        toolPanelLayout: h
                      })
                    ]
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
}

Ii.contextType = AppReactContext
const Di = "images/MP-logo_H_lock-RGB_color-black.svg",
  { SUBSCRIBER_PROMPT: Ri } = PhraseKey.SHOWCASE,
  Mi = e => {
    e.preventDefault()
  },
  ji = () => {
    const e = useAnalytics(),
      t = (0, E.b)(),
      [n, s] = (0, i.useState)(!0),
      r = (0, i.useCallback)(
        t => {
          e.trackGuiEvent("subscriber_prompt_b_banner_click"), window.open(spacesSubscriberDownURL, "_blank")
        },
        [e]
      )
    return (
      (0, i.useEffect)(() => (n && (e.trackGuiEvent("subscriber_prompt_b_banner_viewed"), s(!1)), () => {}), [e, n]),
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "subscriber-prompt-banner",
            onClick: r
          },
          {
            children: [
              (0, o.jsx)("img", {
                className: "matterport-logo",
                alt: "Matterport",
                src: Di
              }),
              (0, o.jsx)(
                "a",
                Object.assign(
                  {
                    className: "link",
                    target: "_blank",
                    onClick: Mi,
                    href: spacesSubscriberDownURL
                  },
                  {
                    children: t.t(Ri.BANNER_CTA_LINK_TEXT)
                  }
                )
              )
            ]
          }
        )
      )
    )
  }
const Ui = (0, nh.M)("isSubscriberBannerVisible", () => {
    const e = Me()
    return Le().bannerEnabled && e
  }),
  { SUMMARY: Fi } = PhraseKey.SHOWCASE,
  Hi = Ee.MN / 1.6

class Bi extends i.Component {
  constructor(e) {
    super(e),
      (this.getImageURL = e => {
        const t = new URL(e)
        return (
          t.searchParams.set("width", String(Ee.MN)),
          t.searchParams.delete("height"),
          t.searchParams.delete("fit"),
          t.searchParams.set("crop", "16:10"),
          t.searchParams.set("dpr", String(window.devicePixelRatio)),
          t.href
        )
      }),
      (this.onExternalLinkClicked = e => {
        this.context.analytics.track("JMYDCase_share_origin_link_clicked")
      }),
      (this.state = {
        thumbnail: void 0
      })
  }

  componentDidMount() {
    const { market: e } = this.context.engine
    e.waitForData(CamStartData).then(e => {
      e.thumb &&
        e.thumb.get().then(e => {
          try {
            this.setState({
              thumbnail: this.getImageURL(e)
            })
          } catch (e) {
            this.setState({
              thumbnail: void 0
            })
          }
        })
    })
  }

  getFilteredValue(e, t, n, i) {
    return !this.context.settings.tryGetProperty(t, n) || (i && !this.props.brandingEnabled) ? "" : e
  }

  render() {
    const { modelDetails: e, showExternalUrl: t, isSubscriberBannerVisible: n } = this.props,
      { thumbnail: i } = this.state,
      { locale: s } = this.context,
      { name: r, presentedBy: a, summary: l, formattedAddress: c, contact: d, externalUrl: u } = e,
      h = t ? u : "",
      p = this.getFilteredValue(r, BtnText.DetailsModelName, !0, !1),
      f = this.getFilteredValue(l, BtnText.DetailsSummary, !1, !1),
      g = this.getFilteredValue(c, BtnText.DetailsAddress, !1, !1),
      v = this.getFilteredValue(a, BtnText.PresentedBy, !1, !0),
      y = this.getFilteredValue(d.name, BtnText.DetailsName, !1, !0),
      b = this.getFilteredValue(d.email, BtnText.DetailsEmail, !1, !0),
      E = this.getFilteredValue(d.phone, BtnText.DetailsPhone, !1, !0),
      S = this.getFilteredValue(d.formattedPhone, BtnText.DetailsPhone, !1, !0),
      O = S || E
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "summary-content"
        },
        {
          children: (0, o.jsxs)(
            Ci.Z,
            Object.assign(
              {
                direction: It.Nm.vertical
              },
              {
                children: [
                  i
                    ? (0, o.jsx)("img", {
                        className: "summary-image",
                        width: Ee.MN,
                        height: Hi,
                        src: i,
                        alt: `Photo of "${p}"`
                      })
                    : null,
                  n && (0, o.jsx)(ji, {}),
                  (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: "summary-text-content"
                      },
                      {
                        children: [
                          p &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: s.t(Fi.LABEL_LOCATION)
                                    }
                                  )
                                ),
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "location"
                                    },
                                    {
                                      children: p
                                    }
                                  )
                                )
                              ]
                            }),
                          g &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: s.t(Fi.LABEL_ADDRESS)
                                    }
                                  )
                                ),
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-body"
                                    },
                                    {
                                      children: g
                                    }
                                  )
                                )
                              ]
                            }),
                          v &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: this.context.locale.t(PhraseKey.PRESENTED_BY)
                                    }
                                  )
                                ),
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-body"
                                    },
                                    {
                                      children: v
                                    }
                                  )
                                )
                              ]
                            }),
                          (y || E || b) &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: s.t(Fi.LABEL_CONTACT)
                                    }
                                  )
                                ),
                                (0, o.jsxs)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-body"
                                    },
                                    {
                                      children: [
                                        y &&
                                          (0, o.jsx)("div", {
                                            children: y
                                          }),
                                        b &&
                                          (0, o.jsx)("div", {
                                            children: (0, o.jsx)(
                                              "a",
                                              Object.assign(
                                                {
                                                  className: "link",
                                                  href: "mailto:" + b
                                                },
                                                {
                                                  children: b
                                                }
                                              )
                                            )
                                          }),
                                        O &&
                                          (0, o.jsx)("div", {
                                            children: O
                                          })
                                      ]
                                    }
                                  )
                                )
                              ]
                            }),
                          f &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: s.t(Fi.LABEL_INFORMATION)
                                    }
                                  )
                                ),
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-body"
                                    },
                                    {
                                      children: f
                                    }
                                  )
                                )
                              ]
                            }),
                          h &&
                            (0, o.jsxs)("div", {
                              children: [
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "section-header"
                                    },
                                    {
                                      children: s.t(Fi.LABEL_LEARN_MORE)
                                    }
                                  )
                                ),
                                (0, o.jsxs)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: "external-link-wrapper"
                                    },
                                    {
                                      children: [
                                        (0, o.jsx)(
                                          "i",
                                          Object.assign(
                                            {
                                              className: "icon-ext-link"
                                            },
                                            {
                                              children: " "
                                            }
                                          )
                                        ),
                                        (0, o.jsx)(
                                          "a",
                                          Object.assign(
                                            {
                                              className: "section-body link",
                                              onClick: this.onExternalLinkClicked,
                                              href: h,
                                              target: "_blank",
                                              rel: "noopener"
                                            },
                                            {
                                              children: h
                                            }
                                          )
                                        )
                                      ]
                                    }
                                  )
                                )
                              ]
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
      )
    )
  }
}

Bi.contextType = AppReactContext
const Vi = Ui(Bi)
const { SUMMARY: Wi } = PhraseKey.SHOWCASE

function zi() {
  const e = (0, E.b)(),
    t = wt(),
    n = (0, ae.y)(brandingEnabledKey, !0),
    i = (0, ae.y)(presentationMlsModeKey, !1),
    s = n && !i,
    r = n && !i
  return t
    ? (0, o.jsx)(
        Gi.L,
        Object.assign(
          {
            toolId: ToolsList.SUMMARY,
            title: e.t(Wi.HEADING)
          },
          {
            children: (0, o.jsx)(Vi, {
              modelDetails: t,
              brandingEnabled: s,
              showExternalUrl: r
            })
          }
        )
      )
    : null
}

class $i {
  constructor() {
    this.renderPanel = () => (0, o.jsx)(zi, {})
  }
}

class Yi {
  constructor() {
    this.renderOverlay = () => (0, o.jsx)(Ki.f, {})
  }
}

const { TOOLS: es } = PhraseKey

export default class ShowcaseGuiModule extends Module {
  engine: EngineContext
  toolsData: ToolsData
  settingsData: SettingsData
  reactRoot: Root
  onSaveError: (e) => void
  onForbiddenError: (e) => void

  constructor() {
    super()
    this.name = "JMYDCase-gui-module"
    this.onSaveError = e => {
      const { error } = e
      this.engine.commandBinder.issueCommand(
        new DefaultErrorCommand(PhraseKey.ERRORS.UNABLE_TO_SAVE_CHANGES_ERROR_MESSAGE, {
          throttle: 30,
          timeout: 10,
          type: Qi.N.ERROR,
          error
        })
      )
    }
    this.onForbiddenError = e => {
      const { error } = e
      this.engine.commandBinder.issueCommand(
        new DefaultErrorCommand(PhraseKey.ERRORS.UNAUTHORIZED_ERROR_MESSAGE, {
          throttle: 0,
          timeout: 0,
          type: Qi.N.ERROR,
          error
        })
      )
    }
    this.loadUi = this.loadUi.bind(this)
  }

  async init(e, t: EngineContext) {
    this.engine = t
    ;[this.settingsData, this.toolsData] = await Promise.all([t.market.waitForData(SettingsData), t.market.waitForData(ToolsData)])
    this.bindings.push(t.subscribe(SaveErrorMessage, this.onSaveError), t.subscribe(ForbiddenErrorMessage, this.onForbiddenError))
  }

  async loadUi(e, t, n, r, a, o, l, c, d, u, h, m) {
    const f = {
      editMode: !1,
      locale: e,
      analytics: t,
      settings: n,
      toolsData: this.toolsData,
      userData: r,
      mainDiv: a,
      engine: l,
      messageBus: c,
      market: d,
      commandBinder: u,
      queue: m
    }
    this.reactRoot = createRoot(o)
    this.reactRoot.render(
      (0, i.createElement)(
        AppReactContext.Provider,
        {
          value: f
        },
        [
          (0, i.createElement)(Ii, {
            key: "JMYDCase-ui",
            onAppReadyChanged: h
          })
        ]
      )
    )
    this.initializeTools()
  }

  async unloadUi() {
    return !!this.reactRoot && (this.reactRoot.unmount(), !0)
  }

  initializeTools() {
    const e = [
      new ToolObject({
        id: ToolsList.MEASUREMENTS,
        searchModeType: searchModeType.MEASUREMENTPATH,
        namePhraseKey: es.MEASUREMENTS,
        panel: !1,
        icon: "icon-tape-measure",
        analytic: "measurements",
        dimmed: !1,
        enabled: this.settingsData.tryGetProperty(BtnText.Measurements, !0),
        ui: new Yi(),
        manager: new ki.S(this.engine, this.settingsData)
      }),
      new ToolObject({
        id: ToolsList.SUMMARY,
        namePhraseKey: es.SUMMARY,
        panel: !0,
        panelLeft: !0,
        analytic: "summary",
        dimmed: !1,
        enabled: !0,
        hidesAppBar: !0,
        ui: new $i()
      })
    ]
    this.engine.commandBinder.issueCommand(new RegisterToolsCommand(e))
    this.engine.commandBinder.issueCommandWhenBound(new RegisterTagsToolCommand())
    this.engine.commandBinder.issueCommandWhenBound(new RegisterNotesToolsCommand())
  }
}
