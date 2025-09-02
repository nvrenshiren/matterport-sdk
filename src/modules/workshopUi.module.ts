import { functionCommon } from "@ruler3d/common"
import B from "classnames"
import * as i from "react"
import { createRoot } from "react-dom/client"
import * as o from "react/jsx-runtime"
import * as L from "../other/66102"
import * as C from "../other/68611"
import * as F from "../other/86096"
import * as m from "../other/97501"
import { TogglePuckEditingCommand } from "../command/sweep.command"
import { HideToastrCommand, ShowToastrCommand } from "../command/ui.command"
import { ChangeViewmodeCommand, GetModeChangCommand, ViewModeCommand, ViewModeInsideCommand } from "../command/viewmode.command"
import * as v from "../const/73536"
import { PhraseKey } from "../const/phrase.const"
import { WorkShopGuiSymbol } from "../const/symbol.const"
import { ToolPalette, ToolPanelLayout, ToolsList } from "../const/tools.const"
import { TourMode } from "../const/tour.const"
import { tourModeType } from "../const/typeString.const"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { ContainerData } from "../data/container.data"
import { SnapshotsData } from "../data/snapshots.data"
import { SweepsData } from "../data/sweeps.data"
import { TagsViewData } from "../data/tags.view.data"
import { TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import * as j from "../other/31826"
import * as M from "../other/32710"
import * as U from "../other/38646"
import * as l from "../other/38772"
import { FeaturesNotesModeKey } from "../other/39586"
import * as p from "../other/53001"
import { canFullscreen, downloadFlies, isMobilePhone, replaceUrlWithHash, winCanTouch } from "../utils/browser.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
declare global {
  interface SymbolModule {
    [WorkShopGuiSymbol]: WorkshopUiModule
  }
}
function D({ tool: e, title: t, children: n }) {
  const i = (0, L.b)()
  if (!e || e.panel) return null
  const s = t || i.t(e.namePhraseKey)
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "tool-panel-bar"
      },
      {
        children: (0, o.jsx)(
          C.V,
          Object.assign(
            {
              tool: e,
              title: s,
              expandable: !1
            },
            {
              children: n
            }
          )
        )
      }
    )
  )
}

import Slider from "rc-slider"
import * as ne from "../32634"
import * as Q from "../other/69790"
import * as Ze from "../other/70584"
import * as Be from "../other/71652"
import * as He from "../other/73372"
import { DataLayersFeatureKey, ModelViewsFeatureKey } from "../other/76087"
import * as Bt from "../other/82566"
import * as an from "../other/84151"
import * as ce from "../other/84426"
import * as xt from "../other/95006"
import * as ct from "../other/95229"
import * as z from "../other/96403"
import * as ee from "../other/98455"
import { AddUserViewCommand, LayerItemsCopyCommand, LayerItemsMoveCommand, ViewDuplicateCommand, ViewRenameCommand } from "../command/layers.command"
import {
  AddPhotosToTourCommand,
  ClearTourCommand,
  CreateTourStopCommand,
  DeleteTourStopCommand,
  MoveTourStopCommand,
  TourClearAllPanningSettingsCommand,
  TourClearAllTransitionTypesCommand,
  TourStopClearAllOverridesCommand,
  TourStopClearOverridesCommand,
  TourStopOverridesCommand
} from "../command/tour.command"
import { DollhousePanSpeed, FastTransitions, PanAngle, PanDirection, PanSpeed, TransitionSpeed, TransitionTime, ZoomDuration } from "../const/14715"
import { FeaturesLabelsKey, ToolsLabelsKey } from "../const/23037"
import { MAX_VIEW_NAME_LENGTH, VIEWS_SUPPORT_PAGE_URL } from "../const/23829"
import * as hn from "../const/28361"
import { BackgroundColorDefault } from "../const/28361"
import { Features360ViewsKey } from "../const/360.const"
import { FeaturesNotesKey } from "../const/39693"
import * as on from "../const/62519"
import { TransitionTypeList } from "../const/64918"
import * as rt from "../const/73596"
import { ToolsTourEditorKey } from "../const/73596"
import { modelRatingDialogKey } from "../const/modelRating.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { UserPreferencesKeys } from "../const/user.const"
import { SettingsToggler } from "../core/settingsToggler"
import { SearchData } from "../data/search.data"
import * as W from "../other/10664"
import * as te from "../other/14355"
import * as Ht from "../other/15258"
import * as qe from "../other/15501"
import * as pt from "../other/17462"
import * as se from "../other/17726"
import * as tt from "../other/20524"
import * as Me from "../other/23043"
import * as Ft from "../other/27839"
import * as Ut from "../other/27870"
import * as K from "../other/28250"
import * as J from "../other/28482"
import * as Ge from "../other/30330"
import * as $ from "../other/33023"
import * as dt from "../other/38490"
import * as G from "../other/40216"
import * as Qe from "../other/40465"
import * as ie from "../other/40541"
import * as lt from "../other/41655"
import * as kt from "../other/50719"
import * as Pt from "../other/50875"
import * as q from "../other/51978"
import * as nt from "../other/53407"
import { isTouchEvent } from "../other/54106"
import * as Ve from "../other/55801"
import * as Y from "../other/56421"
import * as oe from "../other/56509"
import * as de from "../other/60934"
import * as Z from "../other/61531"
import * as X from "../other/64137"
const { HLR: Oe, MODAL: Te } = PhraseKey.WORKSHOP
const { HLR: _e } = PhraseKey.WORKSHOP
const we = ({ item: e }) => {
  const { commandBinder: t } = (0, i.useContext)(AppReactContext),
    n = (0, L.b)(),
    { id: s, typeId: r, index: l } = e
  if (r !== searchModeType.HIGHLIGHTREEL) return null
  return (0, o.jsx)(ce.hE, {
    children: (0, o.jsxs)(
      ce.xz,
      Object.assign(
        {
          icon: "more-vert",
          ariaLabel: n.t(PhraseKey.MORE_OPTIONS),
          menuArrow: !0,
          menuClassName: "search-result-menu"
        },
        {
          children: [
            (0, o.jsx)(ce.zx, {
              label: n.t(_e.SEARCH_ITEM_EDIT),
              onClick: () => {
                !(async function () {
                  await t.issueCommand(new TourStepCommand(l)),
                    await t.issueCommand(new ToggleToolCommand(ToolsList.HLR, !0)),
                    t.issueCommand(new ToggleModalCommand(v.P.HIGHLIGHT_EDITOR, !0)),
                    t.issueCommand(new ToolPanelToggleCollapseCommand(!1))
                })()
              },
              variant: ce.Wu.TERTIARY,
              size: ce.qE.SMALL
            }),
            (0, o.jsx)(ce.zx, {
              className: "menu-delete-btn",
              label: n.t(_e.SEARCH_ITEM_DELETE),
              onClick: () => {
                t.issueCommand(new TourStopCommand()).then(() => {
                  t.issueCommand(new DeleteTourStopCommand(s))
                })
              },
              variant: ce.Wu.TERTIARY,
              size: ce.qE.SMALL
            })
          ]
        }
      )
    )
  })
}
enum Ae {
  CLOSED = 0,
  IDLE = 1,
  SORTING = 2
}
enum Ne {
  AFTER_360 = 3,
  IS_360 = 2,
  NONE = 0,
  SAME_SWEEP = 1
}
class Ie {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.initialized = !1),
      (this.toolStateObservable = createObservableValue(Ae.CLOSED)),
      (this.disabledAssets = {
        [FeaturesLabelsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.onClearHighlightReel = async () => {
        const e = {
            message: Oe.CLEAR_HLR_MODAL_TITLE,
            title: Oe.CLEAR_HLR_MODAL_MESSAGE,
            cancellable: !0,
            cancelPhraseKey: Te.NO,
            confirmPhraseKey: Te.YES
          },
          t = await this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, e))
        return t === ConfirmBtnSelect.CONFIRM && (await this.engine.commandBinder.issueCommand(new ClearTourCommand())), t === ConfirmBtnSelect.CONFIRM
      }),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets)),
      (this.initPromise = this.init())
  }
  async init() {
    const e = this.engine.market,
      [t, n, i, s, r] = await Promise.all([
        e.waitForData(SweepsData),
        e.waitForData(ViewmodeData),
        e.waitForData(PlayerOptionsData),
        e.waitForData(ToursViewData),
        e.waitForData(SearchData)
      ])
    return (
      (this.searchData = r),
      (this.sweepData = t),
      (this.viewmodeData = n),
      (this.playerOptionsData = i),
      (this.dataMap = {
        toursViewData: s
      }),
      this.registerDebugSettings(),
      this.setSearchListActions(we),
      !0
    )
  }
  async activate() {
    this.initialized || ((this.initialized = !0), await this.initPromise), this.settingsToggler.toggle(!0), this.setToolState(Ae.IDLE)
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommand(new TourStopCommand()), this.settingsToggler.toggle(!1), this.setToolState(Ae.CLOSED)
  }
  async dispose() {
    await this.initPromise, this.setSearchListActions()
  }
  setSearchListActions(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.HIGHLIGHTREEL)
    t && (t.itemActionsFC = e)
  }
  getPhotosForTour() {
    return this.dataMap.toursViewData.getPhotosForTour()
  }
  async onAddTourHighlight() {
    await this.engine.commandBinder.issueCommand(new CreateTourStopCommand())
  }
  async addPhotosToReel(e) {
    await this.engine.commandBinder.issueCommand(new AddPhotosToTourCommand(e))
  }
  async changeTourOverrides(e, t) {
    const n = e.snapshot.sid
    await this.engine.commandBinder.issueCommand(new TourStopOverridesCommand(n, t))
  }
  async clearTourOverrides(e, t, n) {
    const i = e.snapshot.sid
    await this.engine.commandBinder.issueCommand(new TourStopClearOverridesCommand(i, t, n))
  }
  is360(e) {
    const t = e.snapshot
    return t.metadata.cameraMode === ViewModes.Panorama && t.is360
  }
  isInsideSameSweep(e, t) {
    return (
      e.snapshot.metadata.scanId === t.snapshot.metadata.scanId &&
      PanoramaOrMesh(e.snapshot.metadata.cameraMode) &&
      e.snapshot.metadata.cameraMode === t.snapshot.metadata.cameraMode
    )
  }
  isFloorPlan(e) {
    return e.snapshot.metadata.cameraMode === ViewModes.Floorplan
  }
  getTransitionType(e) {
    return void 0 !== e.transitionType ? e.transitionType : this.getDefaultTransitionType()
  }
  getTourOptionsBasedOnReel(e, t) {
    const n = this.is360(e),
      i = t && this.is360(t),
      s = this.getTransitionType(e)
    let r = s,
      a = Ne.NONE
    return (
      t && this.isInsideSameSweep(e, t)
        ? ((a = Ne.SAME_SWEEP), (r = TransitionTypeList.Interpolate))
        : n
          ? ((a = Ne.IS_360), (r = TransitionTypeList.FadeToBlack))
          : i && ((a = Ne.AFTER_360), (r = TransitionTypeList.FadeToBlack)),
      {
        transitionType: s,
        panDirection: this.getPanDirection(e),
        panAngle: this.getPanAngle(e),
        updatedTransitionType: r,
        transitionCondition: a
      }
    )
  }
  getPanDirection(e) {
    return void 0 !== e.panDirection ? e.panDirection : this.getDefaultPanDirection()
  }
  getPanAngle(e) {
    return void 0 !== e.panAngle ? e.panAngle : this.getDefaultPanAngle()
  }
  getPlayerOption(e) {
    return this.playerOptionsData.options[e]
  }
  getDefaultTransitionType() {
    return this.getPlayerOption(BtnText.InstantTransitions) ? TransitionTypeList.FadeToBlack : TransitionTypeList.Interpolate
  }
  getDefaultPanAngle() {
    return this.getPlayerOption(BtnText.PanAngle)
  }
  getDefaultPanDirection() {
    return this.getPlayerOption(BtnText.PanDirection)
  }
  async changeDefaultPanDirection(e) {
    await this.engine.commandBinder.issueCommand(
      new PlayerOptionsSetPanDirectionCommand({
        panDirection: e
      })
    )
  }
  async changeDefaultNumericPlayerOption(e, t) {
    await this.engine.commandBinder.issueCommand(
      new PlayerOptionSettingsCommand({
        [e]: t
      })
    )
  }
  async changeDefaultTransitionType(e) {
    await this.engine.commandBinder.issueCommand(
      new ToggleOptionCommand({
        key: BtnText.InstantTransitions,
        value: e === TransitionTypeList.FadeToBlack
      })
    )
  }
  async applyAllTransitionType(e) {
    const t = this.getTransitionType(e)
    this.changeDefaultTransitionType(t), await this.engine.commandBinder.issueCommand(new TourClearAllTransitionTypesCommand())
  }
  async applyAllPanSettings(e) {
    const t = this.getPanDirection(e),
      n = this.getPanAngle(e)
    this.changeDefaultPanDirection(t),
      this.changeDefaultNumericPlayerOption(BtnText.PanAngle, n),
      await this.engine.commandBinder.issueCommand(new TourClearAllPanningSettingsCommand())
  }
  async clearAllTourOverrides() {
    await this.engine.commandBinder.issueCommand(new TourStopClearAllOverridesCommand())
  }
  async onResetTourDefaults() {
    await this.engine.commandBinder.issueCommand(new PlayerOptionsResetTourDefaultsCommand())
  }
  isTourEmpty() {
    return this.dataMap.toursViewData.isTourEmpty()
  }
  inHiddenSweep() {
    if (!this.viewmodeData.isInside()) return !1
    const e = this.sweepData.currentSweep
    return !!e && !this.sweepData.getSweep(e).enabled
  }
  getScanNumber() {
    const e = this.sweepData.currentSweep
    return e ? this.sweepData.getSweep(e).index : NaN
  }
  setToolState(e) {
    this.toolStateObservable.value = e
  }
  get toolState() {
    return this.toolStateObservable.value
  }
  onToolStateChanged(e) {
    return this.toolStateObservable.onChanged(e)
  }
  async registerDebugSettings() {
    const e = await this.engine.getModuleBySymbol(SettingsSymbol),
      t = "Guided Tour Debug"
    e.registerMenuButton({
      header: t,
      buttonName: "Reset Add Title prompt",
      callback: () => {
        e.settingsData.setLocalStorageProperty(UserPreferencesKeys.TourTextNudgeDismissed, !1), window.location.reload()
      }
    }),
      e.registerMenuButton({
        header: t,
        buttonName: "Reset Mobile Nav prompt",
        callback: () => {
          e.settingsData.setLocalStorageProperty(UserPreferencesKeys.TourMobileNavigationPromptSeen, !1), window.location.reload()
        }
      })
  }
}
const ke = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Le = e => {
  var { item: t } = e,
    n = ke(e, ["item"])
  return (0, o.jsx)(
    ce.sr,
    Object.assign({}, n, {
      item: t,
      Item: Ce,
      className: "highlight-box-sortable"
    })
  )
}
const Ce = e => {
  const { item: t, index: n, active: i, editable: s, onClickHighlight: r, getRef: a } = e,
    l = ke(e, ["item", "index", "active", "editable", "onClickHighlight", "getRef"])
  return (0, o.jsx)(
    de.y,
    Object.assign({}, l, {
      highlight: t,
      index: n,
      active: i,
      editable: s,
      onClickHighlight: r,
      getRef: a
    })
  )
}
@l.Z
class De extends i.Component {
  constructor(e) {
    super(e),
      (this.highlightScrollElements = []),
      (this.updateDefaults = () => {
        this.forceUpdate()
      }),
      (this.addHighlightRef = (e, t) => {
        this.highlightScrollElements[e] = (null == t ? void 0 : t.parentElement) || null
      }),
      (this.onSortStart = () => {
        this.context.commandBinder.issueCommand(new TourStopCommand()), this.props.onSorting(!0), this.props.manager.setToolState(Ae.SORTING)
      }),
      (this.onSortEnd = (e, t, n) => {
        const i = this.props.highlights[t].id,
          s = this.props.highlights[n].id
        this.props.onHighlightMoved(i, s), this.props.onSorting(!1), this.props.manager.setToolState(Ae.IDLE)
      })
  }
  componentDidMount() {
    ;-1 !== this.props.activeStep && this.props.setActiveScrollElement(this.highlightScrollElements[this.props.activeStep]),
      this.context.messageBus.subscribe(UpdateDefaultsTransitionsMessage, this.updateDefaults),
      this.context.messageBus.subscribe(UpdateDefaultsDirectionMessage, this.updateDefaults)
  }
  componentWillUnmount() {
    this.context.messageBus.unsubscribe(UpdateDefaultsTransitionsMessage, this.updateDefaults),
      this.context.messageBus.unsubscribe(UpdateDefaultsDirectionMessage, this.updateDefaults)
  }
  componentDidUpdate(e) {
    e.activeStep !== this.props.activeStep && this.props.setActiveScrollElement(this.highlightScrollElements[this.props.activeStep])
  }
  render() {
    const { activeStep: e, tourPlaying: t, onHighlightClicked: n, onRemoveHighlight: i, manager: s, highlights: r, mobile: a } = this.props,
      l = a ? 300 : void 0,
      c = a ? void 0 : 10,
      d = a ? 10 : void 0
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "hlr-container"
        },
        {
          children: (0, o.jsx)(
            ce.cm,
            Object.assign(
              {
                items: r,
                direction: "horizontal",
                Item: Ce,
                onSortStart: this.onSortStart,
                onSortEnd: this.onSortEnd,
                delay: l,
                distance: c,
                tolerance: d,
                restrictToAxis: !0
              },
              {
                children: r.map((a, l) => {
                  const c = l > 0 ? r[l - 1] : null,
                    d = s.getTourOptionsBasedOnReel(a, c),
                    u = d.transitionCondition === Ne.IS_360 || d.transitionCondition === Ne.AFTER_360 || d.transitionCondition === Ne.SAME_SWEEP
                  return (0, o.jsx)(
                    Le,
                    {
                      item: a,
                      index: l,
                      active: l === e,
                      editable: !t,
                      transitionType: d.updatedTransitionType,
                      transitionCondition: u,
                      panDirection: d.panDirection,
                      onRemoveHighlight: i,
                      onClickHighlight: n,
                      getRef: this.addHighlightRef
                    },
                    a.id
                  )
                })
              }
            )
          )
        }
      )
    )
  }
}
De.contextType = AppReactContext
const Re = De

const Ue = new DebugInfo("highlight-reel")
@l.Z
class Fe extends i.Component {
  constructor(e) {
    super(e),
      (this.scrollContainerRef = (0, i.createRef)()),
      (this.highlightClickable = !0),
      (this.mobile = isMobilePhone()),
      (this.bindings = []),
      (this.setHighlightClickable = e => (this.highlightClickable = e)),
      (this.onCollapseStateChanged = () =>
        this.setState({
          collapsed: this.context.toolsData.toolCollapsed
        })),
      (this.onSorting = e => {
        const t = this.scrollContainerRef.current
        t && t.setSorting(e)
      }),
      (this.setActiveScrollElement = e => {
        this.setState({
          activeScrollElement: e
        })
      }),
      (this.onMoveHighlight = async (e, t) => {
        e !== t && (await this.context.commandBinder.issueCommand(new MoveTourStopCommand(e, t, this.getCurrentHighlightSid())))
      }),
      (this.onHighlightClicked = async (e, t) => {
        const { transition: n } = this.props
        if (this.highlightClickable)
          try {
            await this.context.commandBinder.issueCommand(new TourStopCommand()),
              n.active ||
                (this.setHighlightClickable(!1),
                this.context.analytics.trackGuiEvent("click_highlight", {
                  tool: "hlr"
                }),
                await this.context.commandBinder.issueCommand(new TourStepCommand(e, t)),
                this.setHighlightClickable(!0),
                t && this.context.commandBinder.issueCommand(new ToggleModalCommand(v.P.HIGHLIGHT_EDITOR, !0)))
          } catch (e) {
            Ue.debug(e)
          }
      }),
      (this.onRemoveHighlight = async e => {
        try {
          await this.context.commandBinder.issueCommand(new TourStopCommand()), await this.context.commandBinder.issueCommand(new DeleteTourStopCommand(e))
        } catch (e) {
          return void Ue.debug(e)
        }
      }),
      (this.state = {
        activeScrollElement: null,
        collapsed: !1
      })
  }
  componentDidMount() {
    this.bindings.push(this.context.toolsData.onPropertyChanged("toolCollapsed", this.onCollapseStateChanged))
  }
  componentWillUnmount() {
    this.bindings.map(e => e.cancel())
  }
  render() {
    const e = this.mobile,
      { activeScrollElement: t, collapsed: n } = this.state,
      { highlights: i } = this.props,
      s = i.length,
      r = !e
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          id: "reel-container",
          className: "reel-editable"
        },
        {
          children:
            !n &&
            (0, o.jsx)(
              Me._,
              Object.assign(
                {
                  totalSteps: s,
                  activeElement: t,
                  highlightClickable: this.setHighlightClickable,
                  thumbScrollingOnly: r,
                  mobile: this.mobile,
                  ref: this.scrollContainerRef
                },
                {
                  children: this.renderReelContents()
                }
              )
            )
        }
      )
    )
  }
  renderReelContents() {
    const { tourPlaying: e, activeStep: t, highlights: n, manager: i } = this.props
    return (0, o.jsx)(Re, {
      highlights: n,
      tourPlaying: e,
      activeStep: t,
      mobile: this.mobile,
      onSorting: this.onSorting,
      onHighlightClicked: this.onHighlightClicked,
      onHighlightMoved: this.onMoveHighlight,
      onRemoveHighlight: this.onRemoveHighlight,
      setActiveScrollElement: this.setActiveScrollElement,
      manager: i
    })
  }
  getCurrentHighlightSid() {
    const { highlights: e, activeStep: t } = this.props
    if (-1 !== t && e[t]) return e[t].id
  }
}
Fe.contextType = AppReactContext
const { HLR: We } = PhraseKey.WORKSHOP
function ze({ manager: e }) {
  const { commandBinder: t } = (0, i.useContext)(AppReactContext),
    n = (0, L.b)(),
    s = (0, oe.Y)(),
    r = (0, $.Q)(ToolsList.HLR),
    a = 0 === (0, Be.g)(),
    l = n.t(We.TOUR_SETTINGS_LABEL),
    d = n.t(We.CLEAR_REEL_CTA),
    p = (0, i.useCallback)(
      e => {
        s || e.stopPropagation()
      },
      [s]
    ),
    m = (0, i.useCallback)(
      e => {
        p(e), t.issueCommand(new ToggleModalCommand(v.P.TOUR_SETTINGS, !0))
      },
      [t, p]
    ),
    f = (0, i.useCallback)(
      t => {
        p(t), e.onClearHighlightReel()
      },
      [e, p]
    )
  if (!r) return null
  const g = s
    ? (0, o.jsx)(Ge.B, {
        tool: r
      })
    : (0, o.jsx)(Ve.w, {
        tool: r
      })
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "tour-tool-header-group"
      },
      {
        children: (0, o.jsxs)(
          ce.Wo,
          Object.assign(
            {
              icon: s ? "more-vert" : void 0,
              menuClassName: "tour-tool-header-group-menu",
              variant: ce.Wu.TERTIARY
            },
            {
              children: [
                (0, o.jsx)(ce.zx, {
                  className: "reel-tour-settings",
                  label: l,
                  icon: "settings",
                  variant: ce.Wu.TERTIARY,
                  size: ce.qE.SMALL,
                  onClick: m
                }),
                !a &&
                  (0, o.jsx)(ce.zx, {
                    className: "reel-clear-all",
                    label: d,
                    icon: "delete",
                    variant: ce.Wu.TERTIARY,
                    size: ce.qE.SMALL,
                    onClick: f
                  }),
                g
              ]
            }
          )
        )
      }
    )
  )
}
function $e({ message: e }) {
  const t = (0, oe.Y)()
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "empty-tour"
      },
      {
        children: (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: "tour-slots"
            },
            {
              children:
                t &&
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "empty-tour-message"
                    },
                    {
                      children: e
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
const { HLR: Ke } = PhraseKey.WORKSHOP
function Ye(e) {
  const t = (0, L.b)(),
    n = (0, oe.Y)(),
    { activeStep: i, tourPlaying: s, highlights: r, transition: a, manager: l } = e,
    c = r.length,
    d = 0 === c,
    h = d ? t.t(Ke.TOUR_EDITOR_EMPTY_TITLE) : t.t(Ke.NUM_TYPE, c),
    p = t.t(Ke.TOUR_EDITOR_EMPTY_MESSAGE),
    m =
      d && !n
        ? (0, o.jsx)(
            "span",
            Object.assign(
              {
                className: "empty-tour-message"
              },
              {
                children: p
              }
            )
          )
        : void 0,
    f = (0, o.jsx)(ze, {
      manager: l
    })
  return (0, o.jsx)(
    He.L,
    Object.assign(
      {
        closed: s,
        className: "tour-tool",
        toolId: ToolsList.HLR,
        title: h,
        filmstrip: !0,
        hideHelp: !0,
        hideBadge: d,
        titleNode: m,
        controls: f || void 0
      },
      {
        children: d
          ? (0, o.jsx)($e, {
              message: p
            })
          : (0, o.jsx)(Fe, {
              transition: a,
              tourPlaying: !1,
              highlights: r,
              activeStep: i,
              manager: l
            })
      }
    )
  )
}
function Xe() {
  const e = (0, z.B)(),
    t = (0, qe.R)(),
    n = (0, q.y)(modelRatingDialogKey, !1),
    i = (0, Ze.O)(),
    s = (0, Y.S)()
  if (i && e === ToolsList.HLR) return null
  const r = !e,
    a = i && s !== TourMode.STORIES
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: B("footer-ui", {
          "footer-ui-shaded": a
        })
      },
      {
        children:
          r &&
          (0, o.jsx)(Qe.$, {
            isWorkshop: !0,
            disabled: !!t,
            openModal: t,
            modelRatingEnabled: n
          })
      }
    )
  )
}
const Je = {
  [ViewModeCommand.INSIDE]: "inside",
  [ViewModeCommand.OUTSIDE]: "outside",
  [ViewModeCommand.DOLLHOUSE]: "dollhouse",
  [ViewModeCommand.FLOORPLAN]: "floorplan",
  [ViewModeCommand.TRANSITIONING]: "transitioning"
}
function et({ viewmode: e, unaligned: t, tourState: n }) {
  const [s, r] = (0, i.useState)(!1),
    { commandBinder: a } = (0, i.useContext)(AppReactContext),
    l = (0, q.y)(modelRatingDialogKey, !1),
    d = (0, K.J)(),
    h = (0, G.T)(),
    p = (0, W.x)(),
    m = (0, z.B)(),
    f = (0, Y.S)(),
    g = (0, $.Q)(ToolsList.HLR),
    v = null == g ? void 0 : g.manager,
    y = m === ToolsList.HLR,
    { activeStep: b, currentStep: E, highlights: S, transition: O, tourPlaying: T } = n,
    _ = (0, i.useCallback)(
      e => {
        a.issueCommand(new HighlightReelToggleOpenCommand(e))
      },
      [a]
    )
  if (
    ((0, Z.U)(ToggleViewingControlsMessage, ({ show: e }) => {
      y || _(!1), r(!e)
    }),
    (0, i.useEffect)(() => {
      y ? _(!0) : m && _(!1)
    }, [y, _, m]),
    m === ToolsList.SETTINGS_PANEL)
  )
    return null
  const w = S || [],
    A = Je[e] || "",
    N = canFullscreen(),
    I = N,
    P = h === ToolPanelLayout.BOTTOM_PANEL || h === ToolPanelLayout.NARROW,
    x = !p || p.showModeControls,
    L = !P && x && !T,
    C = !P && !T,
    D = !p || p.showTourControls,
    R = {
      "tour-playing": T,
      "tour-editing": m === ToolsList.HLR,
      autohide: s,
      "stories-tour-showing": d
    }
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        id: "bottom-ui",
        className: B("bottom-ui", R, A)
      },
      {
        children: [
          (0, o.jsxs)(
            te.N,
            Object.assign(
              {
                className: B("bottom-controls", {
                  "faded-out": s
                }),
                open: !s
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
                          D &&
                            (0, o.jsx)(ee.Z, {
                              activeTool: m,
                              activeStep: b,
                              currentStep: E,
                              highlights: S || [],
                              tourPlaying: T,
                              tourMode: f,
                              toolPanelLayout: h
                            }),
                          L &&
                            (0, o.jsx)(Q.V, {
                              unaligned: t,
                              viewmode: e
                            }),
                          C &&
                            (0, o.jsx)(X.d, {
                              viewmode: e,
                              iconStyle: !0
                            }),
                          I &&
                            (0, o.jsx)("span", {
                              className: "divider"
                            }),
                          N && (0, o.jsx)(J.Z, {})
                        ]
                      }
                    )
                  ),
                  l && (0, o.jsx)(se.L, {})
                ]
              }
            )
          ),
          y &&
            (0, o.jsx)(Ye, {
              transition: O,
              tourPlaying: T,
              highlights: w,
              activeStep: b,
              manager: v
            }),
          (0, o.jsx)(ne.e, {
            openTool: m,
            tourMode: f,
            transition: O,
            tourPlaying: T,
            highlights: w,
            activeStep: b
          }),
          (0, o.jsx)(Xe, {})
        ]
      }
    )
  )
}
function it({ unaligned: e, viewmode: t }) {
  const n = (0, z.B)()
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "mode-floor-control-bar"
      },
      {
        children: [
          n !== ToolsList.ROOM_BOUNDS &&
            (0, o.jsx)(Q.V, {
              unaligned: e,
              viewmode: t,
              activeStateDisplay: !0
            }),
          (0, o.jsx)(X.d, {
            viewmode: t,
            iconStyle: !1
          })
        ]
      }
    )
  )
}
function st({ tourPlaying: e, unaligned: t, viewmode: n }) {
  const [s, r] = (0, i.useState)(!1),
    a = (0, oe.Y)(),
    l = (0, z.B)(),
    c = (0, nt.d)(),
    d = (0, K.J)(),
    h = a && !e && !d && l !== ToolsList.MESH_TRIM,
    p = c && !h && !e && !d
  ;(0, Z.U)(ToggleViewingControlsMessage, ({ show: e }) => r(!e))
  const m = B("edit-top-ui", {
    "faded-out": s,
    "center-tool-btn": a
  })
  return (0, o.jsxs)(
    te.N,
    Object.assign(
      {
        open: !s,
        className: m
      },
      {
        children: [
          (0, o.jsx)(
            te.N,
            Object.assign(
              {
                open: h,
                className: B("mode-floor-control-bar-wrap", {
                  autohide: !h
                })
              },
              {
                children: (0, o.jsx)(it, {
                  unaligned: t,
                  viewmode: n
                })
              }
            )
          ),
          (0, o.jsx)(
            te.N,
            Object.assign(
              {
                open: p,
                className: B("floor-name-container", {
                  collapsed: !p
                })
              },
              {
                children: (0, o.jsx)(tt.Q, {})
              }
            )
          )
        ]
      }
    )
  )
}

function ht(e) {
  const { children: t, className: n, iconClass: i, label: s, message: r } = e
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: B("settings-item", n)
      },
      {
        children: [
          i &&
            (0, o.jsx)("div", {
              className: `settings-icon ${i}`
            }),
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "settings-description"
              },
              {
                children: [
                  s &&
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "settings-label"
                        },
                        {
                          children: s
                        }
                      )
                    ),
                  r &&
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "settings-message"
                        },
                        {
                          children: r
                        }
                      )
                    ),
                  (0, o.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "settings-content"
                      },
                      {
                        children: t
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
var mt = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}
@l.Z
class ft extends i.Component {
  constructor(e) {
    super(e),
      (this.onChange = e => {
        this.props.onChange(e)
      }),
      (this.onToggleHover = e => {
        this.setState({
          hovering: "mouseenter" === e.type
        })
      }),
      (this.state = {
        hovering: !1
      })
  }
  render() {
    const { id: e, name: t, value: n, checked: i, image: s, activeImage: r, label: a, labelBox: l, message: c } = this.props,
      d = this.state.hovering || i ? r : s
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "radio-element radio-image"
        },
        {
          children: [
            (0, o.jsx)("input", {
              type: "radio",
              id: e,
              name: t,
              value: n,
              checked: i,
              onChange: this.onChange
            }),
            (0, o.jsxs)(
              "label",
              Object.assign(
                {
                  htmlFor: e,
                  className: "radio-image-label",
                  onMouseEnter: this.onToggleHover,
                  onMouseLeave: this.onToggleHover
                },
                {
                  children: [
                    (0, o.jsx)("img", {
                      src: d
                    }),
                    (0, o.jsxs)(
                      "span",
                      Object.assign(
                        {
                          className: "radio-label-line"
                        },
                        {
                          children: [
                            (0, o.jsx)(
                              "span",
                              Object.assign(
                                {
                                  className: "radio-label"
                                },
                                {
                                  children: a
                                }
                              )
                            ),
                            l &&
                              (0, o.jsx)(
                                "span",
                                Object.assign(
                                  {
                                    className: "word-badge"
                                  },
                                  {
                                    children: l
                                  }
                                )
                              )
                          ]
                        }
                      )
                    ),
                    c &&
                      (0, o.jsx)(
                        "p",
                        Object.assign(
                          {
                            className: "radio-message"
                          },
                          {
                            children: c
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

const gt = "images/TourStories.svg",
  vt = "images/TourStories-Active.svg",
  yt = "images/LegacyTour.svg",
  bt = "images/LegacyTour-Active.svg",
  Et = "images/NoTour.svg",
  St = "images/NoTour-Active.svg",
  { SETTINGS: Ot } = PhraseKey.WORKSHOP
class Tt extends i.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.icons = {
        stories: gt,
        storiesActive: vt,
        legacy: yt,
        legacyActive: bt,
        none: Et,
        noneActive: St
      }),
      (this.bindings = []),
      (this.updateTourMode = () => {
        this.isUnmounting ||
          this.setState(
            Object.assign(Object.assign({}, this.getLegacyToggleState()), {
              tourMode: this.props.manager.dataMap.toursViewData.tourModeSetting
            })
          )
      }),
      (this.onChangeTourMode = e => {
        const t = e.target.value
        this.sendTrackingEvent(`tour_${t}`), this.props.manager.setTourModeSetting(t).then(() => this.updateTourMode())
      }),
      (this.toggleTours = () => {
        const { toursOn: e } = this.state,
          { manager: t } = this.props,
          n = !e
        this.sendTrackingEvent(`${BtnText.TourButtons}_${n ? "on" : "off"}`), t.setLegacyTourSetting(n).then(() => this.updateTourMode())
      }),
      (this.toggleHlr = () => {
        const { hlrOn: e } = this.state,
          { manager: t } = this.props,
          n = !e
        this.sendTrackingEvent(`${BtnText.HighlightReel}_${n ? "on" : "off"}`), t.setLegacyHlrSetting(n).then(() => this.updateTourMode())
      }),
      (this.state = Object.assign(Object.assign({}, this.getLegacyToggleState()), {
        tourMode: e.manager.dataMap.toursViewData.tourModeSetting
      }))
  }
  componentDidMount() {
    this.bindings.push(this.props.manager.dataMap.toursViewData.onTourModeSettingChanged(this.updateTourMode))
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0), this.bindings.forEach(e => e.cancel())
  }
  getLegacyToggleState() {
    const { playerOptionsData: e } = this.props.manager.dataMap
    return {
      toursOn: e.options[BtnText.TourButtons],
      hlrOn: e.options[BtnText.HighlightReel]
    }
  }
  sendTrackingEvent(e) {
    this.context.analytics.trackToolGuiEvent("settings", `click_settings_${e}`)
  }
  renderTourModes() {
    const { locale: e } = this.context,
      { tourMode: t } = this.state,
      { stories: n, storiesActive: i, legacy: s, legacyActive: r, none: a, noneActive: l } = this.icons,
      c = e.t(Ot.TOUR_MODE_STORY_LABEL),
      d = e.t(Ot.TOUR_MODE_STORY_MESSAGE),
      u = e.t(Ot.TOUR_MODE_LEGACY_LABEL),
      h = e.t(Ot.TOUR_MODE_LEGACY_MESSAGE),
      p = e.t(Ot.TOUR_MODE_NONE_LABEL),
      m = e.t(PhraseKey.WORKSHOP.EDIT_BAR.NEW_BADGE)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "settings-item radio-group radio-icons tour-mode-settings"
        },
        {
          children: [
            (0, o.jsx)(ft, {
              name: "tour_mode",
              value: TourMode.STORIES,
              id: "tour_mode-stories",
              checked: t === TourMode.STORIES,
              label: c,
              labelBox: m,
              message: d,
              image: n,
              activeImage: i,
              onChange: this.onChangeTourMode
            }),
            (0, o.jsx)(ft, {
              name: "tour_mode",
              value: TourMode.LEGACY,
              id: "tour_mode-legacy",
              checked: t === TourMode.LEGACY,
              label: u,
              message: h,
              image: s,
              activeImage: r,
              onChange: this.onChangeTourMode
            }),
            (0, o.jsx)(ft, {
              name: "tour_mode",
              value: TourMode.NONE,
              id: "tour_mode-none",
              checked: t === TourMode.NONE,
              label: p,
              image: a,
              activeImage: l,
              onChange: this.onChangeTourMode
            })
          ]
        }
      )
    )
  }
  render() {
    const { locale: e } = this.context,
      { toursOn: t, hlrOn: n, tourMode: i } = this.state,
      s = i === TourMode.LEGACY,
      r = e.t(Ot.TOUR_OPTION_LABEL),
      a = e.t(Ot.TOUR_OPTION_MESSAGE),
      l = e.t(Ot.HLR_OPTION_LABEL),
      c = e.t(Ot.HLR_OPTION_MESSAGE),
      d = e.t(Ot.TOUR_DEFAULT_SETTING_LOCATION),
      u = i !== TourMode.NONE
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "tab-contents active tour-hlr-tab"
        },
        {
          children: [
            this.renderTourModes(),
            (0, o.jsxs)(
              te.N,
              Object.assign(
                {
                  open: s,
                  className: B("legacy-toggles", {
                    active: s
                  })
                },
                {
                  children: [
                    (0, o.jsx)(
                      ht,
                      Object.assign(
                        {
                          label: r,
                          iconClass: "icon-play",
                          message: a
                        },
                        {
                          children: (0, o.jsx)(pt.Z, {
                            className: "tour-toggle",
                            onToggle: this.toggleTours,
                            enabled: !0,
                            onOffLabel: !1,
                            toggled: t,
                            testId: "PlayableTourSettingToggle"
                          })
                        }
                      )
                    ),
                    (0, o.jsx)(
                      ht,
                      Object.assign(
                        {
                          label: l,
                          iconClass: "icon-hlr",
                          message: c
                        },
                        {
                          children: (0, o.jsx)(pt.Z, {
                            className: "hlr-toggle",
                            onToggle: this.toggleHlr,
                            enabled: !0,
                            onOffLabel: !1,
                            toggled: n,
                            testId: "HighlightReelSettingToggle"
                          })
                        }
                      )
                    )
                  ]
                }
              )
            ),
            u &&
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: B("account-settings-label", {
                      "with-border": !s
                    })
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
}
Tt.contextType = AppReactContext
const { HLR: _t } = PhraseKey.WORKSHOP
enum wt {
  PANNING = "panning",
  PRESENTATION = "presentation",
  TRANSITIONS = "transitions"
}
class At extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.isUnmounting = !1),
      (this.onRestoreDefaults = async () => {
        await this.props.manager.onResetTourDefaults(),
          this.isUnmounting || (this.setState(this.getModelSettings(this.props)), this.sendTrackingEvent("restore_hlr_defaults"))
      }),
      (this.changeDefaultTransitionType = e => {
        const t = e.target,
          n = parseInt(t.value, 10),
          i = n === TransitionTypeList.FadeToBlack ? "slideshow" : "walkthrough"
        this.sendTrackingEvent(`transition_type_${i}`),
          this.setState({
            transitionType: n
          }),
          this.props.manager.changeDefaultTransitionType(n)
      }),
      (this.changeTransitionSpeed = e => {
        const t = rt.JU[e]
        this.setState({
          transitionSpeed: t
        }),
          this.sendTrackingEvent(`default_transition_speed_${t}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.TransitionSpeed, t)
      }),
      (this.changeTransitionTime = e => {
        const t = rt.H1[e]
        this.setState({
          transitionTime: t
        }),
          this.sendTrackingEvent(`default_transition_time_${t}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.TransitionTime, t)
      }),
      (this.changePanSpeed = e => {
        const t = rt.bQ[e]
        this.setState({
          panSpeed: t
        }),
          this.sendTrackingEvent(`default_pan_speed_${t}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.PanSpeed, t)
      }),
      (this.changeDollhousePanSpeed = e => {
        const t = rt.Cf[e]
        this.setState({
          dollhousePanSpeed: t
        }),
          this.sendTrackingEvent(`default_dollhouse_pan_speed_${t}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.DollhousePanSpeed, t)
      }),
      (this.changeZoomDuration = e => {
        const t = rt.tc[e]
        this.setState({
          zoomDuration: t
        }),
          this.sendTrackingEvent(`default_zoom_duration_${t}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.ZoomDuration, t)
      }),
      (this.changePanAngle = e => {
        this.setState({
          panAngle: e
        }),
          this.sendTrackingEvent(`default_pan_angle_${e}`),
          this.props.manager.changeDefaultNumericPlayerOption(BtnText.PanAngle, e)
      }),
      (this.changeDefaultPanDirection = e => {
        const t = e.target,
          n = parseInt(t.value, 10),
          i = n === PanDirectionList.Left ? "left" : n === PanDirectionList.Right ? "right" : "auto"
        this.sendTrackingEvent(`default_pan_direction_${i}`),
          this.setState({
            panDirection: n
          }),
          this.props.manager.changeDefaultPanDirection(n)
      }),
      (this.showPresentationSettings = () => this.setActiveTab(wt.PRESENTATION)),
      (this.showTransitionSettings = () => this.setActiveTab(wt.TRANSITIONS)),
      (this.showPanningSettings = () => this.setActiveTab(wt.PANNING)),
      (this.state = Object.assign(
        {
          activeTab: t.settings.tryGetProperty(UserPreferencesKeys.HighlightReelSettingsTab, wt.PRESENTATION)
        },
        this.getModelSettings(e)
      ))
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  getModelSettings(e) {
    const { manager: t } = e
    return {
      transitionType: t.getDefaultTransitionType(),
      transitionSpeed: t.getPlayerOption(BtnText.TransitionSpeed),
      transitionTime: t.getPlayerOption(BtnText.TransitionTime),
      panDirection: t.getPlayerOption(BtnText.PanDirection),
      panAngle: t.getPlayerOption(BtnText.PanAngle),
      panSpeed: t.getPlayerOption(BtnText.PanSpeed),
      dollhousePanSpeed: t.getPlayerOption(BtnText.DollhousePanSpeed),
      zoomDuration: t.getPlayerOption(BtnText.ZoomDuration)
    }
  }
  areSettingsDifferent() {
    const {
      transitionType: e,
      transitionSpeed: t,
      transitionTime: n,
      panDirection: i,
      panAngle: s,
      panSpeed: r,
      dollhousePanSpeed: a,
      zoomDuration: o
    } = this.state
    return (
      (e === TransitionTypeList.FadeToBlack) !== FastTransitions ||
      t !== TransitionSpeed ||
      n !== TransitionTime ||
      r !== PanSpeed ||
      a !== DollhousePanSpeed ||
      o !== ZoomDuration ||
      s !== PanAngle ||
      i !== PanDirection
    )
  }
  sendTrackingEvent(e) {
    this.context.analytics.trackToolGuiEvent("hlr", `click_settings_${e}`)
  }
  setActiveTab(e) {
    this.setState({
      activeTab: e
    }),
      this.context.settings.setLocalStorageProperty(UserPreferencesKeys.HighlightReelSettingsTab, e)
  }
  renderPanDirection() {
    const { panDirection: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.PAN_DIRECTION_SETTING_LABEL),
      i = t.t(_t.PAN_DIRECTION_SETTING_LEFT),
      s = t.t(_t.PAN_DIRECTION_SETTING_RIGHT),
      r = t.t(_t.PAN_DIRECTION_SETTING_AUTO)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "radio-options"
                },
                {
                  children: [
                    (0, o.jsx)(
                      ct.E,
                      Object.assign(
                        {
                          name: "pan_direction_setting",
                          value: PanDirectionList.Left.toString(),
                          id: "pan-direction-left",
                          enabled: !0,
                          checked: e === PanDirectionList.Left,
                          onChange: this.changeDefaultPanDirection
                        },
                        {
                          children: i
                        }
                      ),
                      "radio-pan-left"
                    ),
                    (0, o.jsx)(
                      ct.E,
                      Object.assign(
                        {
                          name: "pan_direction_setting",
                          value: PanDirectionList.Right.toString(),
                          id: "pan-direction-right",
                          enabled: !0,
                          checked: e === PanDirectionList.Right,
                          onChange: this.changeDefaultPanDirection
                        },
                        {
                          children: s
                        }
                      ),
                      "radio-pan-right"
                    ),
                    (0, o.jsx)(
                      ct.E,
                      Object.assign(
                        {
                          name: "pan_direction_setting",
                          value: PanDirectionList.Auto.toString(),
                          id: "pan-direction-auto",
                          enabled: !0,
                          checked: e === PanDirectionList.Auto,
                          onChange: this.changeDefaultPanDirection
                        },
                        {
                          children: r
                        }
                      ),
                      "radio-pan-auto"
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
  renderPanAngle() {
    const { panAngle: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.ROTATION_ANGLE_SETTING_LABEL)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsx)(lt.Y, {
              units: "°",
              value: e,
              min: 0,
              max: 360,
              step: 10,
              onDone: this.changePanAngle
            })
          ]
        }
      )
    )
  }
  renderSliderMarks() {
    const { locale: e } = this.context
    return {
      0: e.t(_t.SPEED_SETTING_SLOW),
      1: "",
      2: "",
      3: e.t(_t.SPEED_SETTING_MEDIUM),
      4: "",
      5: "",
      6: e.t(_t.SPEED_SETTING_FAST)
    }
  }
  renderPanSpeed() {
    const { panSpeed: e } = this.state,
      { locale: t } = this.context,
      n = rt.bQ.indexOf(e),
      i = t.t(_t.ROTATION_SPEED_SETTING_LABEL)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting slider-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: i
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "hlr-settings-slider"
                },
                {
                  children: (0, o.jsx)(Slider, {
                    min: 0,
                    max: 6,
                    step: 1,
                    included: !1,
                    dots: !0,
                    marks: this.renderSliderMarks(),
                    value: n,
                    onChange: this.changePanSpeed
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderDollhousePanSpeed() {
    const { dollhousePanSpeed: e } = this.state,
      { locale: t } = this.context,
      n = rt.Cf.indexOf(e),
      i = t.t(_t.DOLLHOUSE_ROTATION_SPEED_SETTING_LABEL)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting slider-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: i
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "hlr-settings-slider"
                },
                {
                  children: (0, o.jsx)(Slider, {
                    min: 0,
                    max: 6,
                    step: 1,
                    included: !1,
                    dots: !0,
                    marks: this.renderSliderMarks(),
                    value: n,
                    onChange: this.changeDollhousePanSpeed
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderZoomDuration() {
    const { zoomDuration: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.ZOOM_SPEED_SETTING_LABEL),
      i = rt.tc.indexOf(e)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting slider-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "hlr-settings-slider"
                },
                {
                  children: (0, o.jsx)(Slider, {
                    min: 0,
                    max: 6,
                    step: 1,
                    included: !1,
                    dots: !0,
                    marks: this.renderSliderMarks(),
                    value: i,
                    onChange: this.changeZoomDuration
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderTransitionSpeed() {
    const { transitionSpeed: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.WALKTHROUGH_SPEED_SETTING_LABEL),
      i = rt.JU.indexOf(e)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting slider-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "hlr-settings-slider"
                },
                {
                  children: (0, o.jsx)(Slider, {
                    min: 0,
                    max: 6,
                    step: 1,
                    included: !1,
                    dots: !0,
                    value: i,
                    onChange: this.changeTransitionSpeed,
                    marks: this.renderSliderMarks()
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderTransitionTime() {
    const { transitionTime: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.SLIDESHOW_SPEED_SETTING_LABEL),
      i = rt.H1.indexOf(e)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting slider-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "hlr-settings-slider"
                },
                {
                  children: (0, o.jsx)(Slider, {
                    min: 0,
                    max: 6,
                    step: 1,
                    included: !1,
                    dots: !0,
                    value: i,
                    onChange: this.changeTransitionTime,
                    marks: this.renderSliderMarks()
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderTransitionType() {
    const { transitionType: e } = this.state,
      { locale: t } = this.context,
      n = t.t(_t.TRANSITION_SETTING_LABEL),
      i = t.t(_t.TRANSITION_SETTING_SLIDESHOW),
      s = t.t(_t.TRANSITION_SETTING_WALKTHROUGH)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "default-setting"
        },
        {
          children: [
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "setting-label"
                },
                {
                  children: n
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "radio-options"
                },
                {
                  children: [
                    (0, o.jsx)(
                      ct.E,
                      Object.assign(
                        {
                          name: "transition_type_setting",
                          id: "transition_type_default_slideshow",
                          value: TransitionTypeList.FadeToBlack.toString(),
                          enabled: !0,
                          checked: e === TransitionTypeList.FadeToBlack,
                          onChange: this.changeDefaultTransitionType
                        },
                        {
                          children: i
                        }
                      ),
                      "radio-slideshow"
                    ),
                    (0, o.jsx)(
                      ct.E,
                      Object.assign(
                        {
                          name: "transition_type_setting",
                          id: "transition_type_default_walkthrough",
                          value: TransitionTypeList.Interpolate.toString(),
                          enabled: !0,
                          checked: e === TransitionTypeList.Interpolate,
                          onChange: this.changeDefaultTransitionType
                        },
                        {
                          children: s
                        }
                      ),
                      "radio-walkthrough"
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
  renderPanSettings() {
    const { activeTab: e } = this.state
    return e !== wt.PANNING
      ? null
      : (0, o.jsxs)("div", {
          children: [this.renderPanDirection(), this.renderPanAngle(), this.renderPanSpeed(), this.renderDollhousePanSpeed(), this.renderZoomDuration()]
        })
  }
  renderTransitionSettings() {
    const { activeTab: e } = this.state
    return e !== wt.TRANSITIONS
      ? null
      : (0, o.jsxs)("div", {
          children: [this.renderTransitionType(), this.renderTransitionSpeed(), this.renderTransitionTime()]
        })
  }
  renderPresentationSettings() {
    const { activeTab: e } = this.state
    if (e !== wt.PRESENTATION) return null
    const { toolsData: t } = this.context,
      n = t.toolsMap.get(ToolsList.SETTINGS_PANEL).manager
    return (0, o.jsx)(Tt, {
      manager: n
    })
  }
  renderTabs() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state,
      n = e.t(_t.PRESENTATION_SETTINGS_TAB_TITLE),
      i = e.t(_t.TRANSITION_SETTINGS_TAB_TITLE),
      s = e.t(_t.PANNING_SETTINGS_TAB_TITLE)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "tabs"
        },
        {
          children: (0, o.jsxs)("div", {
            children: [
              (0, o.jsx)(
                ce.zx,
                Object.assign(
                  {
                    className: B("button-inline", "tab-button"),
                    variant: ce.Wu.TERTIARY,
                    active: t === wt.PRESENTATION,
                    onClick: this.showPresentationSettings
                  },
                  {
                    children: n
                  }
                )
              ),
              (0, o.jsx)(
                ce.zx,
                Object.assign(
                  {
                    className: B("button-inline", "tab-button"),
                    variant: ce.Wu.TERTIARY,
                    active: t === wt.TRANSITIONS,
                    onClick: this.showTransitionSettings
                  },
                  {
                    children: i
                  }
                )
              ),
              (0, o.jsx)(
                ce.zx,
                Object.assign(
                  {
                    className: B("button-inline", "tab-button"),
                    variant: ce.Wu.TERTIARY,
                    active: t === wt.PANNING,
                    onClick: this.showPanningSettings
                  },
                  {
                    children: s
                  }
                )
              )
            ]
          })
        }
      )
    )
  }
  render() {
    const { onClose: e } = this.props,
      { locale: t } = this.context,
      { activeTab: n } = this.state,
      i = this.areSettingsDifferent() && n !== wt.PRESENTATION,
      s = t.t(_t.RESTORE_DEFAULTS_CTA),
      r = t.t(_t.TOUR_SETTINGS_LABEL),
      a = t.t(_t.CLOSE_SETTINGS_CTA)
    return (0, o.jsxs)(
      ce.Vq,
      Object.assign(
        {
          className: "full-modal highlight-reel-settings",
          onClose: e
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
                          children: r
                        }
                      )
                    ),
                    (0, o.jsx)(dt.P, {
                      onClose: e
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
                  children: (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: "modal-content"
                      },
                      {
                        children: [this.renderTabs(), this.renderPresentationSettings(), this.renderTransitionSettings(), this.renderPanSettings()]
                      }
                    )
                  )
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "modal-footer"
                },
                {
                  children: [
                    i &&
                      (0, o.jsx)(
                        "div",
                        Object.assign(
                          {
                            className: "restore-link"
                          },
                          {
                            children: (0, o.jsx)(
                              "span",
                              Object.assign(
                                {
                                  className: "link",
                                  onClick: this.onRestoreDefaults
                                },
                                {
                                  children: s
                                }
                              )
                            )
                          }
                        )
                      ),
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "modal-buttons"
                        },
                        {
                          children: (0, o.jsx)(ce.zx, {
                            variant: ce.Wu.PRIMARY,
                            className: "button-inline",
                            size: ce.qE.LARGE,
                            onClick: e,
                            label: a
                          })
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
At.contextType = AppReactContext
export const PhotoGridVisibleKey = "photo-grid-visible"
class Rt extends i.Component {
  constructor(e) {
    super(e),
      (this.updatePerSettings = () => {
        this.setState({
          gridVisible: this.context.settings.tryGetProperty(PhotoGridVisibleKey, !1)
        })
      }),
      (this.state = {
        gridVisible: !1
      })
  }
  componentDidMount() {
    this.updatePerSettings(), this.context.settings.onPropertyChanged(PhotoGridVisibleKey, this.updatePerSettings)
  }
  componentWillUnmount() {
    this.context.settings.removeOnPropertyChanged(PhotoGridVisibleKey, this.updatePerSettings)
  }
  render() {
    const { gridVisible: e } = this.state
    return e
      ? (0, o.jsx)("div", {
          className: "frame-sizer"
        })
      : null
  }
}
Rt.contextType = AppReactContext
const { LAYERS: Vt } = PhraseKey.WORKSHOP
function Gt() {
  const { commandBinder: e } = (0, i.useContext)(AppReactContext),
    t = (0, qe.R)(),
    n = (0, Ft._)(),
    s = () => {
      e.issueCommand(new CloseModalCommand())
    },
    r = e => (null == n ? void 0 : n.validateViewName(e.trim())) || !1
  switch (t) {
    case v.P.MODEL_VIEW_ADD:
      return (0, o.jsx)(Wt, {
        onValidate: r,
        onClose: s
      })
    case v.P.MODEL_VIEW_EDITOR:
      return (0, o.jsx)(zt, {
        onValidate: r,
        onClose: s
      })
    case v.P.MODEL_VIEW_DUPLICATE:
      return (0, o.jsx)($t, {
        onValidate: r,
        onClose: s
      })
    default:
      return null
  }
}
function Wt({ onValidate: e, onClose: t }) {
  const { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = (0, L.b)()
  return (0, o.jsx)(Ut.x, {
    title: r.t(Vt.ADD_VIEW_MODAL_TITLE),
    initialText: "",
    label: "View Name",
    placeholder: r.t(Vt.NEW_VIEW_NAME_PLACEHOLDER),
    maxLength: MAX_VIEW_NAME_LENGTH,
    onSave: async e => {
      n.trackToolGuiEvent("layers", "layers_view_add"), await s.issueCommand(new AddUserViewCommand(e.trim())), t()
    },
    onValidate: e,
    onCancel: t
  })
}
function zt({ onValidate: e, onClose: t }) {
  const { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = (0, Ht.K)(),
    a = (0, L.b)()
  return (0, o.jsx)(Ut.x, {
    title: a.t(Vt.EDIT_VIEW_MODAL_TITLE),
    initialText: (null == r ? void 0 : r.name) || "",
    label: "View Name",
    placeholder: a.t(Vt.NEW_VIEW_NAME_PLACEHOLDER),
    maxLength: MAX_VIEW_NAME_LENGTH,
    onSave: async e => {
      ;(null == r ? void 0 : r.id) &&
        (n.trackToolGuiEvent("layers", "layers_view_rename"), await s.issueCommand(new ViewRenameCommand(null == r ? void 0 : r.id, e.trim()))),
        t()
    },
    onValidate: e,
    onCancel: t
  })
}
function $t({ onValidate: e, onClose: t }) {
  const { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = (0, Ht.K)(),
    a = (0, Bt.A)(null == r ? void 0 : r.id),
    l = (0, L.b)()
  if (!r) return null
  const d = l.t(Vt.VIEW_DUPLICATE_NAME_SUFFIX),
    u = `${a.substring(0, MAX_VIEW_NAME_LENGTH - d.length - 2)} ${d}`
  return (0, o.jsx)(Ut.x, {
    title: l.t(Vt.DUPLICATE_VIEW_MODAL_TITLE),
    initialText: u,
    label: "View Name",
    placeholder: l.t(Vt.NEW_VIEW_NAME_PLACEHOLDER),
    maxLength: MAX_VIEW_NAME_LENGTH,
    onSave: async e => {
      ;(null == r ? void 0 : r.id) &&
        (n.trackToolGuiEvent("layers", "layers_view_duplicate"), await s.issueCommand(new ViewDuplicateCommand(null == r ? void 0 : r.id, e.trim()))),
        t()
    },
    onValidate: e,
    onCancel: t
  })
}
class Kt extends i.Component {
  constructor(e) {
    super(e),
      (this.propertiesToRefreshUi = [featuresMattertagsKey, FeaturesNotesKey]),
      (this.isUnmounting = !1),
      (this.onLoadSpinnerSuppressMessage = e => {
        this.setState({
          loadSpinnerSuppress: e.suppress
        })
      }),
      (this.getFeatureVisibility = () => {
        const { settings: e } = this.context
        return {
          tags: e.tryGetProperty(featuresMattertagsKey, !1),
          notes: e.tryGetProperty(FeaturesNotesKey, !1)
        }
      }),
      (this.subscribeToSettings = () =>
        this.propertiesToRefreshUi.map(e => this.context.settings.onPropertyChanged(e, () => this.setState(this.getFeatureVisibility())))),
      (this.adjustOverlayPosition = e => {
        this.isUnmounting ||
          this.setState({
            canvasX: e.x,
            canvasY: e.y
          })
      }),
      (this.adjustOverlayDimensions = e => {
        this.isUnmounting ||
          this.setState({
            canvasHeight: e.height,
            canvasWidth: e.width
          })
      }),
      (this.state = {
        canvasX: 0,
        canvasY: 0,
        canvasWidth: 0,
        canvasHeight: 0,
        tags: !1,
        notes: !1,
        loadIndicator: !1,
        loadSpinnerSuppress: !1
      })
  }
  async componentDidMount() {
    ;(this.bindings = [
      this.context.messageBus.subscribe(CanvasMessage, this.adjustOverlayPosition),
      this.context.messageBus.subscribe(SetCameraDimensionsMessage, this.adjustOverlayDimensions),
      this.context.messageBus.subscribe(LoadSpinnerMessage, e =>
        this.setState({
          loadIndicator: e.isOpen
        })
      ),
      this.context.messageBus.subscribe(TourStartedMessage, e =>
        this.setState({
          loadSpinnerSuppress: !0
        })
      ),
      this.context.messageBus.subscribe(TourStoppedMessage, e =>
        this.setState({
          loadSpinnerSuppress: !1
        })
      ),
      this.context.messageBus.subscribe(LoadSpinnerSuppressMessage, this.onLoadSpinnerSuppressMessage),
      ...this.subscribeToSettings()
    ]),
      this.setState(Object.assign({}, this.getFeatureVisibility()))
  }
  componentWillUnmount() {
    this.isUnmounting = !0
    for (const e of this.bindings) e.cancel()
  }
  render() {
    const { canvasX: e, canvasY: t, canvasWidth: n, canvasHeight: i, notes: s, loadIndicator: r, loadSpinnerSuppress: a } = this.state,
      { tools: l, activeTool: c, openModal: d, notesEnabled: h } = this.props,
      p = r && !a,
      m = l.get(ToolsList.PHOTOS) && c === ToolsList.PHOTOS,
      f = s && h,
      g = m
        ? {
            top: `${t}px`,
            left: `${e}px`,
            height: `${i}px`,
            width: `${n}px`
          }
        : {}
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "overlay-ui",
          style: g
        },
        {
          children: [
            (0, o.jsx)(xt.I, {}),
            m && (0, o.jsx)(Rt, {}),
            (0, o.jsx)(Pt.E, {
              notesEnabled: f,
              openModal: d
            }),
            (0, o.jsx)(kt.Z, {
              showing: p
            }),
            (0, o.jsx)(Gt, {})
          ]
        }
      )
    )
  }
}
Kt.contextType = AppReactContext
class Qt extends i.Component {
  constructor(e) {
    super(e)
  }
  render() {
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "blocked",
          style: this.props.style || {}
        },
        {
          children: [
            (0, o.jsx)("span", {
              className: "icon-play-unicode"
            }),
            (0, o.jsx)("span", {
              className: "icon-blocked"
            })
          ]
        }
      )
    )
  }
}
const Xt = "images/360_placement_pin.png"
enum Jt {
  IMAGE = "image",
  PIN = "pin"
}
class en extends i.Component {
  constructor(e) {
    super(e),
      (this.screenPosition = new Vector2()),
      (this.dragging = !1),
      (this.listening = !1),
      (this.touchDevice = winCanTouch()),
      (this.onDragStart = (e, t, n) => {
        this.toggleListening(!0),
          this.setState({
            left: e.x,
            top: e.y,
            url: t,
            index: n
          })
      }),
      (this.toggleListening = e => {
        e && !this.listening
          ? ((this.listening = !0),
            window.addEventListener("pointerdown", this.onPointerMove),
            window.addEventListener("pointermove", this.onPointerMove),
            window.addEventListener("pointerup", this.onPointerUp),
            window.addEventListener("touchmove", this.onPointerMove),
            window.addEventListener("touchend", this.onPointerUp))
          : !e &&
            this.listening &&
            ((this.listening = !1),
            window.removeEventListener("pointerdown", this.onPointerMove),
            window.removeEventListener("pointermove", this.onPointerMove),
            window.removeEventListener("pointerup", this.onPointerUp),
            window.removeEventListener("touchmove", this.onPointerMove),
            window.removeEventListener("touchend", this.onPointerUp))
      }),
      (this.updateDropState = e => {
        const t = (e && e === ViewModes.Dollhouse) || e === ViewModes.Floorplan
        this.setState({
          viewmode: e,
          canDrop: t
        })
      }),
      (this.onModeChange = e => {
        this.updateDropState(e.toMode)
      }),
      (this.resetToIdle = () => {
        ;(this.dragging = !1),
          this.toggleListening(!1),
          this.setState({
            index: -1,
            url: "",
            pinVisual: Jt.IMAGE
          })
      }),
      (this.onPointerUp = e => {
        if (!this.dropzone) return
        const { manager: t } = this.props
        if (this.dragging) {
          const n = this.getPosition(e),
            i = this.overTarget(n.x, n.y)
          e.stopPropagation(),
            this.screenPosition.set(n.x, n.y),
            t.dragEnd(this.state.canDrop && i, this.screenPosition).then(e => {
              i
                ? e.success ||
                  this.context.analytics.track("unaligned_place_failed", {
                    sweepId: e.sweepId
                  })
                : this.context.analytics.track("unaligned_place_cancelled", {
                    sweepId: e.sweepId
                  })
            })
        } else t.cancelPlacement()
        this.resetToIdle()
      }),
      (this.onPointerMove = e => {
        this.dragging ||
          ((this.dragging = !0),
          (this.touchDevice || this.props.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL) &&
            this.context.commandBinder.issueCommand(new ToolPanelToggleCollapseCommand(!0)))
        const t = this.getPosition(e)
        this.setState({
          left: t.x,
          top: t.y
        }),
          e.cancelable && e.preventDefault()
        const n = this.overTarget(t.x, t.y),
          i = n ? Jt.PIN : Jt.IMAGE
        this.changePinVisual(i),
          this.screenPosition.set(t.x, t.y),
          this.props.manager
            .onDragPin(this.screenPosition, n)
            .then(e => {
              this.setState({
                scale: e / 125
              }),
                this.updateDropState(this.state.viewmode)
            })
            .catch(e => {
              this.setState({
                canDrop: !1
              })
            })
      }),
      (this.state = {
        pinVisual: Jt.IMAGE,
        top: 0,
        left: 0,
        url: "",
        index: -1,
        scale: 1,
        canDrop: !0,
        allowTransition: !1,
        viewmode: ViewModes.Panorama
      })
  }
  componentDidMount() {
    this.props.manager.setDragStartCallback(this.onDragStart),
      this.context.messageBus.subscribe(EndSwitchViewmodeMessage, this.onModeChange),
      this.updateDropState(this.props.manager.dataMap.viewmodeData.currentMode)
  }
  componentWillUnmount() {
    this.context.messageBus.unsubscribe(EndSwitchViewmodeMessage, this.onModeChange), this.toggleListening(!1)
  }
  overTarget(e, t) {
    const n = this.dropzone.getBoundingClientRect()
    return e > n.left && e < n.left + n.width && t > n.top && t < n.top + n.height
  }
  changePinVisual(e) {
    e !== this.state.pinVisual &&
      (this.setState({
        pinVisual: e,
        allowTransition: !0
      }),
      clearTimeout(this.transitionTimeout),
      (this.transitionTimeout = window.setTimeout(() => {
        this.setState({
          allowTransition: !1
        })
      }, 500)))
  }
  getPosition(e) {
    return isTouchEvent(e)
      ? {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
      : {
          x: e.clientX,
          y: e.clientY
        }
  }
  getPinScale() {
    return this.state.pinVisual === Jt.IMAGE ? 0.5 : this.state.canDrop ? this.state.scale : 0
  }
  render() {
    const { left: e, top: t, url: n, allowTransition: i, canDrop: s, pinVisual: r, index: a } = this.state,
      l = {
        left: e,
        top: t
      },
      c = this.getPinScale(),
      d = Object.assign(Object.assign({}, l), {
        transform: `scale(${c})`
      }),
      u = !!n,
      h = !i || !s,
      p = this.context.settings.tryGetProperty(ModelViewsFeatureKey, !1)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "pin-container"
        },
        {
          children: [
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: B("drag-region", {
                    noDrag: !s
                  })
                },
                {
                  children: (0, o.jsx)("div", {
                    ref: e => {
                      e && (this.dropzone = e)
                    },
                    className: B("pin-drop-region", {
                      dragging: u,
                      "no-layers": !p
                    }),
                    onPointerUp: this.onPointerUp
                  })
                }
              )
            ),
            r === Jt.PIN &&
              !s &&
              (0, o.jsx)(Qt, {
                style: l
              }),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  style: d,
                  className: B(
                    "pin-360-wrapper",
                    {
                      dragging: u,
                      "no-transition": h
                    },
                    r
                  )
                },
                {
                  children: [
                    (0, o.jsx)("img", {
                      className: "pin-image",
                      src: Xt
                    }),
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "scene-wrapper"
                        },
                        {
                          children: (0, o.jsx)("img", {
                            className: "small-360-image",
                            src: n
                          })
                        }
                      )
                    ),
                    (0, o.jsx)(
                      "span",
                      Object.assign(
                        {
                          className: "pin-index"
                        },
                        {
                          children: a
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
en.contextType = AppReactContext
const { PHOTOS: tn } = PhraseKey.WORKSHOP

enum nn {
  ADDED = 2,
  ADDING = 1,
  STATIC = 0
}
class sn extends i.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.addPhotosToReel = async () => {
        this.setState({
          photosAddState: nn.ADDING
        }),
          this.context.analytics.trackToolGuiEvent("photos", "add_photos_to_reel"),
          await this.props.manager.addPhotosToReel(this.state.selectedSids)
        const e = await this.props.manager.getPhotosForTour()
        this.isUnmounting ||
          (this.setState({
            photosAddState: nn.ADDED,
            photos: e
          }),
          window.setTimeout(() => this.props.onClose(), 300))
      }),
      (this.toggleSelection = e => {
        const t = e.target.getAttribute("data-sid"),
          n = this.state.selectedSids.indexOf(t)
        ;-1 === n ? this.addSelection(t) : this.removeSelection(n)
      }),
      (this.toggleSelectAll = () => {
        const e = this.state.photos.filter(e => !e.inReel).map(e => e.sid)
        this.setState(t =>
          t.selectedSids.length === e.length
            ? {
                selectedSids: []
              }
            : {
                selectedSids: e
              }
        )
      }),
      (this.state = {
        selectedSids: [],
        photosAddState: nn.STATIC,
        photos: []
      })
  }
  componentDidMount() {
    this.props.manager.getPhotosForTour().then(e =>
      this.setState({
        photos: e
      })
    )
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  UNSAFE_componentWillReceiveProps(e) {
    this.state.photosAddState === nn.ADDED &&
      this.state.photos &&
      this.setState({
        selectedSids: [],
        photosAddState: nn.STATIC
      })
  }
  render() {
    const { locale: e } = this.context,
      { onClose: t } = this.props,
      { selectedSids: n, photosAddState: i, photos: s } = this.state,
      r = i === nn.ADDING,
      a = s.filter(e => !e.inReel).length,
      l = n.length > 0 && !r,
      c = e.t(r ? tn.ADDING_PHOTOS_CTA : tn.ADD_PHOTOS_CTA),
      d = e.t(tn.MODAL_TITLE),
      u = e.t(tn.NUM_SELECTED, n.length)
    return (0, o.jsxs)(
      ce.Vq,
      Object.assign(
        {
          className: "full-modal photos-modal",
          onClose: t
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
                          children: d
                        }
                      )
                    ),
                    (0, o.jsx)(dt.P, {
                      onClose: t
                    })
                  ]
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "photo-panel-controls"
                },
                {
                  children: [
                    (0, o.jsx)("label", {
                      children: u
                    }),
                    this.renderSelectAllToggle(a)
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
                  children: s.map((e, t) =>
                    (0, o.jsxs)(
                      "div",
                      Object.assign(
                        {
                          className: this.getSnapshotClasses(e.sid),
                          "data-sid": e.sid,
                          onClick: this.toggleSelection
                        },
                        {
                          children: [
                            (0, o.jsx)(
                              "div",
                              Object.assign(
                                {
                                  className: "image-bar"
                                },
                                {
                                  children: (0, o.jsx)("span", {
                                    className: "icon-hlr"
                                  })
                                }
                              )
                            ),
                            (0, o.jsx)("img", {
                              src: e.thumbnailUrl
                            }),
                            (0, o.jsx)(
                              "div",
                              Object.assign(
                                {
                                  className: "image-name"
                                },
                                {
                                  children: e.name
                                    ? (0, o.jsx)(
                                        "span",
                                        Object.assign(
                                          {
                                            className: "static-text"
                                          },
                                          {
                                            children: e.name
                                          }
                                        )
                                      )
                                    : null
                                }
                              )
                            )
                          ]
                        }
                      ),
                      e.sid
                    )
                  )
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
                  children: (0, o.jsx)(ce.zx, {
                    size: ce.qE.SMALL,
                    disabled: !l,
                    variant: ce.Wu.PRIMARY,
                    id: "AddPhotosBtn",
                    label: c,
                    onClick: this.addPhotosToReel
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  renderSelectAllToggle(e) {
    const { locale: t } = this.context,
      n = this.state.selectedSids.length < e,
      i = t.t(n ? tn.SELECT_ALL_CTA : tn.UNSELECT_ALL_CTA)
    return (0, o.jsx)(
      "span",
      Object.assign(
        {
          className: B("link", {
            disabled: 0 === e
          }),
          onClick: this.toggleSelectAll
        },
        {
          children: i
        }
      )
    )
  }
  getSnapshotClasses(e) {
    const t = this.state.photos.find(t => t.sid === e)
    return t
      ? B("snapshot", {
          selected: -1 !== this.state.selectedSids.indexOf(e),
          "in-reel": t.inReel
        })
      : ""
  }
  addSelection(e) {
    this.setState(t => ({
      selectedSids: [...t.selectedSids, e]
    }))
  }
  removeSelection(e) {
    this.setState(t => ({
      selectedSids: t.selectedSids.filter((t, n) => n !== e)
    }))
  }
}
sn.contextType = AppReactContext
enum rn {
  COMPACT = "space_compact",
  EVERYTHING = "space_everything",
  NONE = "space_none",
  OTHER = "space_other"
}
class un {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.initialized = !1),
      (this.bindings = []),
      (this.disabledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesLabelsKey]: !1,
        [Features360ViewsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.checkModal = e => {
        e !== v.P.SETTINGS && this.engine.commandBinder.issueCommand(new ToggleToolCommand(ToolsList.SETTINGS_PANEL, !1))
      }),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets)),
      (this.initPromise = this.init())
  }
  async init() {
    const e = this.engine.market
    return Promise.all([e.waitForData(ToursViewData), e.waitForData(PlayerOptionsData), e.waitForData(ToolsData)]).then(
      ([e, t, n]) => (
        (this.dataMap = {
          toursViewData: e,
          playerOptionsData: t,
          toolsData: n
        }),
        !0
      )
    )
  }
  async activate() {
    if (this.initialized) for (const e of this.bindings) e.renew()
    else (this.initialized = !0), await this.initPromise, this.bindings.push(this.dataMap.toolsData.onPropertyChanged("openModal", this.checkModal))
    this.settingsToggler.toggle(!0), this.engine.commandBinder.issueCommand(new ToggleModalCommand(v.P.SETTINGS, !0))
  }
  async deactivate() {
    for (const e of this.bindings) e.cancel()
    this.settingsToggler.toggle(!1), this.engine.commandBinder.issueCommand(new ToggleModalCommand(v.P.SETTINGS, !1))
  }
  async setTogglePlayerOption(e, t) {
    await this.engine.commandBinder.issueCommand(
      new ToggleOptionCommand({
        key: e,
        value: t
      })
    )
  }
  async onChangeBackgroundColor(e) {
    await this.engine.commandBinder.issueCommand(
      new SetBackgroundColorCommand({
        backgroundColor: e
      })
    )
  }
  async onChangeSpaceInformation(e) {
    const t = {}
    e === rn.EVERYTHING
      ? ((t.address = !0),
        (t.contact_email = !0),
        (t.contact_name = !0),
        (t.contact_phone = !0),
        (t.model_name = !0),
        (t.model_summary = !0),
        (t.presented_by = !0),
        (t.external_url = !0))
      : e === rn.COMPACT
        ? ((t.address = !1),
          (t.contact_email = !1),
          (t.contact_name = !1),
          (t.contact_phone = !1),
          (t.model_name = !0),
          (t.model_summary = !0),
          (t.presented_by = !1),
          (t.external_url = !0))
        : ((t.address = !1),
          (t.contact_email = !1),
          (t.contact_name = !1),
          (t.contact_phone = !1),
          (t.model_name = !1),
          (t.model_summary = !1),
          (t.presented_by = !1),
          (t.external_url = !1)),
      await this.engine.commandBinder.issueCommand(new PlayerOptionSettingsCommand(t))
  }
  getPlayerOption(e) {
    return this.dataMap.playerOptionsData.options[e]
  }
  getUnits() {
    return this.dataMap.playerOptionsData.options[BtnText.Units]
  }
  getDefaultTransitionType() {
    return this.dataMap.playerOptionsData.options[BtnText.InstantTransitions] ? TransitionTypeList.FadeToBlack : TransitionTypeList.Interpolate
  }
  getBackgroundColor() {
    return this.dataMap.playerOptionsData.options[BtnText.BackgroundColor]
  }
  async setLegacyTourSetting(e) {
    await this.engine.commandBinder.issueCommand(
      new ToggleOptionCommand({
        key: BtnText.TourButtons,
        value: e
      })
    )
  }
  async setLegacyHlrSetting(e) {
    await this.engine.commandBinder.issueCommand(
      new ToggleOptionCommand({
        key: BtnText.HighlightReel,
        value: e
      })
    )
  }
  async setTourModeSetting(e) {
    const { issueCommand: t } = this.engine.commandBinder
    await t(new TourSetTourModeCommand(e))
    const n = e !== TourMode.NONE
    await t(
      new ToggleOptionCommand({
        key: BtnText.TourButtons,
        value: n
      })
    ),
      await t(
        new ToggleOptionCommand({
          key: BtnText.HighlightReel,
          value: n
        })
      )
  }
  getSpaceInformationSetting() {
    return un.mapOptionsToSpaceInformation(this.dataMap.playerOptionsData.options)
  }
  static mapOptionsToSpaceInformation(e) {
    return e.address && e.contact_email && e.contact_name && e.contact_phone && e.model_name && e.model_summary && e.presented_by
      ? rn.EVERYTHING
      : e.address || e.contact_email || e.contact_name || e.contact_phone || !e.model_name || !e.model_summary || e.presented_by
        ? e.address || e.contact_email || e.contact_name || e.contact_phone || e.model_name || e.model_summary || e.presented_by
          ? rn.OTHER
          : rn.NONE
        : rn.COMPACT
  }
}

@l.Z
class mn extends i.Component {
  constructor(e) {
    super(e),
      (this.clickImage = e => {
        this.props.onClick && this.props.onClick(e, this.props.id)
      })
  }
  render() {
    const { className: e, onClick: t, url: n, cover: i, style: s } = this.props,
      r = {
        "image-cover": !!i
      }
    if (
      (e &&
        Object.assign(r, {
          [e]: !0
        }),
      i)
    ) {
      const e = Object.assign(Object.assign({}, s), {
        backgroundImage: n ? `url('${n}')` : "none"
      })
      return (0, o.jsx)("div", {
        className: B("image", r),
        style: e,
        onClick: t ? this.clickImage : void 0
      })
    }
    return (0, o.jsx)("img", {
      className: B("image", r),
      src: n,
      style: s,
      onClick: t ? this.clickImage : void 0
    })
  }
}

@l.Z
class gn extends i.Component {
  constructor(e) {
    super(e),
      (this.onChange = e => {
        this.props.onChange(e)
      }),
      (this.state = {
        hovering: !1
      })
  }
  render() {
    const { id: e, name: t, value: n, checked: i, icon: s, label: r, backgroundColor: a } = this.props
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "radio-element radio-icon"
        },
        {
          children: [
            (0, o.jsx)("input", {
              type: "radio",
              id: e,
              name: t,
              value: n,
              checked: i,
              onChange: this.onChange
            }),
            (0, o.jsxs)(
              "label",
              Object.assign(
                {
                  htmlFor: e,
                  className: "radio-icon-label"
                },
                {
                  children: [
                    (0, o.jsx)("div", {
                      className: `icon ${s}`,
                      style: {
                        backgroundColor: `${a}`
                      }
                    }),
                    (0, o.jsx)(
                      "span",
                      Object.assign(
                        {
                          className: "radio-label"
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
        }
      )
    )
  }
}

import * as Xn from "../other/10119"
import * as Cn from "../other/14282"
import * as Xr from "../other/1522"
import * as oa from "../other/15636"
import { IconButtonAttribute, SettingsLabel } from "../other/16507"
import * as wn from "../other/19280"
import * as ls from "../other/21829"
import * as es from "../other/27741"
import * as Gn from "../other/29113"
import { isIncludes } from "../other/29708"
import * as Cs from "../other/31981"
import * as Hi from "../other/36306"
import * as Ki from "../other/36893"
import * as Wi from "../other/38242"

import * as Ss from "../6550"
import * as ts from "../6608"
import { isPitchFactorOrtho } from "../math/59370"
import { DragAndDropObject } from "../message/event.message"
import { NoteToolManager } from "../noteToolManager"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import { createAspectRatioBasedResizeDimensions, createSimpleResizeDimensions } from "../other/38319"
import * as ss from "../other/39156"
import { getIconKey } from "../other/39689"
import * as us from "../other/43909"
import * as ns from "../other/44472"
import * as vs from "../other/44877"
import { useDataHook } from "../other/45755"
import { TextParser } from "../other/52528"
import * as bs from "../other/57623"
import * as Zi from "../other/60543"
import * as ei from "../other/6335"
import * as da from "../other/64186"
import { TagToolManger } from "../tagtoolmanger"

import * as is from "../other/67243"
import * as Es from "../other/68830"
import * as ca from "../other/69491"
import * as si from "../other/71215"
import * as Ls from "../other/71330"
import * as os from "../other/75377"
import * as qi from "../other/77230"
import * as Wn from "../other/77543"
import * as ui from "../other/85535"
import * as Nn from "../other/86667"
import * as la from "../other/86941"
import * as di from "../other/92306"
import * as fs from "../other/93001"
import * as Yi from "../other/96377"
import * as Qn from "../other/97478"
import { ResetCameraPitchCommand, SetCameraStartCommand } from "../command/camera.command"
import { DefaultErrorCommand } from "../command/error.command"
import { GetFloorIntersectCommand, MovetoFloorCommand } from "../command/floors.command"
import { ToggleRotationInteractionsCommand } from "../command/interaction.command"
import {
  LabelDeleteCommand,
  LabelEditorCreateCommand,
  LabelEditorDisableCommand,
  LabelEditorDiscardCommand,
  LabelEditorEditCommand,
  LabelEditorEnableCommand,
  LabelRenameCommand,
  LabelToggleSelectCommand,
  LabelVisibleCommand
} from "../command/label.command"
import {
  MeasureModeToggleCommand,
  MeasurementListDeletionCommand,
  MeasurementSelectCommand,
  MeasurementsSetVisibilityCommand,
  RenameMeasurementCommand
} from "../command/measurement.command"
import {
  ActivateMeshTrimEditorCommand,
  ChangeMeshTrimEditorViewCommand,
  ChangeTrimMeshGroupCommand,
  CreateMeshTrimCommand,
  DeactivateMeshTrimEditorCommand,
  DeleteMeshTrimCommand,
  SelectMeshTrimCommand,
  UnselectMeshTrimCommand
} from "../command/meshTrim.command"
import { LockNavigationCommand, MoveToSweepCommand, UnlockNavigationCommand } from "../command/navigation.command"
import { NoteDeleteCommand } from "../command/notes.command"
import { TogglePanoMarkerCommand } from "../command/pano.command"
import {
  HighlightPinCommand,
  ModuleTogglePinEditingCommand,
  PinUnselectCommand,
  TogglePinConnectionsCommand,
  TogglePinNumbersCommand
} from "../command/pin.command"
import { ResizeCanvasCommand, ScreenToCanvasPointCommand } from "../command/screen.command"
import {
  CaptureSnapshotCommand,
  DeleteSnapshotCommand,
  EquirectangularSnapshotCommand,
  RenameSnapshotCommand,
  SetCurrentSnapshotPhotoCommand
} from "../command/snapshot.command"
import { StartLocationFlyInCommand } from "../command/startLocation.command"
import {
  EndRotateSweepCommand,
  FinRotateSweepCommand,
  InitRotateSweepCommand,
  PlaceSweepCommand,
  RenameSweepCommand,
  ToggleNonPanoCurrentPuckCommand,
  ToggleSweepCommand,
  ToggleSweepNumbersCommand,
  UnplaceSweepCommand
} from "../command/sweep.command"
import {
  SetReorderingModeCommand,
  TagCancelEditsCommand,
  TagDeleteCommand,
  TagDirtyToggleCommand,
  TagEditCommand,
  TagOpenCommand,
  TagOrderBySetCommand,
  TagOrderSaveCommand,
  TagStartAddCommand,
  TagVisibilityToggleCommand,
  TagsToggleCommand
} from "../command/tag.command"
import { LockViewmodeCommand, UnlockViewmodeCommand } from "../command/viewmode.command"
import { WorldPositionChangeCommand } from "../command/webgl.command"
import { ZoomInCommand, ZoomMaxValueCommand, ZoomOutCommand, ZoomResetCommand, ZoomSetCommand } from "../command/zoom.command"
import { ToolsPhotosEditorKey, ToolsStartLocationKey } from "../const/21636"
import * as ua from "../const/21646"
import * as $s from "../const/25071"
import { Tools360ManagementKey } from "../const/360Management.const"
import { FeaturesTagIconsKey } from "../const/48945"
import { SnapshotCategory } from "../const/50090"
import * as zi from "../const/54875"
import * as Zn from "../const/59323"
import * as qs from "../const/60542"
import { PinEditorState, PinType } from "../const/62612"
import { DollhousePeekabooKey } from "../const/66777"
import * as Hr from "../const/6739"
import * as xr from "../const/71161"
import * as $i from "../const/72119"
import * as Ri from "../const/73698"
import { ToolsScanManagementKey } from "../const/76278"
import { PanoSizeAspect, PanoSizeKey } from "../const/76609"
import { ToolsMeasurementsKey } from "../const/8824"
import { AnnotationType } from "../const/annotationType.const"
import { MeasurePhase } from "../const/measure.const"
import { AttachmentsSymbol, ModelMeshSymbol, NavigationSymbol, SettingsSymbol, TransformGizmoSymbol } from "../const/symbol.const"
import { createSubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { LabelEditorData } from "../data/label.editor.data"
import { SettingsData } from "../data/settings.data"
import { StartLocationViewData } from "../data/start.location.view.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import * as Zr from "../object/label.object"
import * as Dn from "../utils/71570"
import { hasPolicySpacesElements } from "../utils/71570"
import { waitRun } from "../utils/func.utils"
import * as zn from "../utils/scroll.utils"
import { DirectionVector } from "../webgl/vector.const"
const yn = "images/Everything.svg",
  bn = "images/Everything-Active.svg",
  En = "images/Compact.svg",
  Sn = "images/Compact-Active.svg",
  On = "images/None.svg",
  Tn = "images/None-Active.svg",
  _n = "images/TourSettingsMoved.svg"
function In(e) {
  const { manager: t, iconClass: n, optionKey: s, label: r, message: a, className: l, children: d, testId: u, onToggleSetting: h } = e,
    p = (0, q.y)(s, !1),
    { analytics: m } = (0, i.useContext)(AppReactContext)
  return (0, o.jsxs)(
    ht,
    Object.assign(
      {
        label: r,
        iconClass: n,
        message: a,
        className: "player-option-setting"
      },
      {
        children: [
          d,
          (0, o.jsx)(pt.Z, {
            className: B("player-option-toggle", l),
            onToggle: (e, n) => {
              const i = n ? "on" : "off"
              m.trackToolGuiEvent("settings", `click_settings_${s}_${i}`), t.setTogglePlayerOption(s, n), h && h(s, n)
            },
            enabled: !0,
            onOffLabel: !1,
            toggled: p,
            testId: u
          })
        ]
      }
    )
  )
}
const { SETTINGS: Pn } = PhraseKey.WORKSHOP
function xn({ manager: e, onToggleSetting: t }) {
  const n = (0, L.b)(),
    i = BtnText.Labels,
    s = (0, q.y)(i, !1),
    r = BtnText.LabelsDollhouse,
    a = (0, q.y)(r, !1),
    l = n.t(Pn.ADVANCED_ROOM_LABELS_LABEL),
    c = n.t(Pn.ADVANCED_ROOM_LABELS_MESSAGE),
    d = n.t(Pn.SHOW_LABELS_IN_DOLLHOUSE_OPTION),
    u = n.t(Pn.HIDE_LABELS_IN_DOLLHOUSE_OPTION),
    h = a ? d : u,
    p = n.t(Pn.ADVANCED_ROOM_LABELS_MENU_LABEL)
  return (0, o.jsx)(
    In,
    Object.assign(
      {
        manager: e,
        optionKey: i,
        label: l,
        iconClass: "icon-toolbar-labels",
        message: c,
        testId: "RoomLabelsSettingToggle",
        onToggleSetting: (e, n) => t(i, n)
      },
      {
        children:
          s &&
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "settings-nested-setting"
              },
              {
                children: [
                  (0, o.jsx)(
                    "label",
                    Object.assign(
                      {
                        className: "settings-menu-prefix"
                      },
                      {
                        children: p
                      }
                    )
                  ),
                  (0, o.jsxs)(
                    ce.xz,
                    Object.assign(
                      {
                        className: "settings-menu",
                        variant: ce.Wu.TERTIARY,
                        label: h,
                        menuClassName: "settings-nested-menu",
                        caret: !0
                      },
                      {
                        children: [
                          (0, o.jsx)(
                            ce.zx,
                            {
                              size: ce.qE.SMALL,
                              label: d,
                              variant: ce.Wu.TERTIARY,
                              onClick: () => t(r, !0)
                            },
                            "nestedSettingOn"
                          ),
                          (0, o.jsx)(
                            ce.zx,
                            {
                              size: ce.qE.SMALL,
                              label: u,
                              variant: ce.Wu.TERTIARY,
                              onClick: () => t(r, !1)
                            },
                            "nestedSettingOff"
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
    )
  )
}
const { SETTINGS: kn } = PhraseKey.WORKSHOP
function Ln({ manager: e, onToggleSetting: t }) {
  const n = (0, L.b)(),
    i = BtnText.Measurements,
    s = (0, q.y)(i, !1),
    r = BtnText.SavedMeasurements,
    a = (0, q.y)(r, !1),
    l = () => t(r, !1),
    c = n.t(kn.ADVANCED_MEASUREMENT_MODE_LABEL),
    d = n.t(kn.ADVANCED_MEASUREMENT_MODE_MESSAGE),
    u = n.t(kn.SHOW_SAVED_MEASUREMENTS_OPTION),
    h = n.t(kn.HIDE_SAVED_MEASUREMENTS_OPTION),
    p = a ? u : h,
    m = n.t(kn.ADVANCED_MEASUREMENT_MODE_MENU_LABEL)
  return (0, o.jsx)(
    In,
    Object.assign(
      {
        manager: e,
        optionKey: i,
        label: c,
        iconClass: "icon-tape-measure",
        message: d,
        testId: "MeasurementsSettingToggle",
        onToggleSetting: (e, n) => {
          t(i, n), n || l()
        }
      },
      {
        children:
          s &&
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "settings-nested-setting"
              },
              {
                children: [
                  (0, o.jsx)(
                    "label",
                    Object.assign(
                      {
                        className: "settings-menu-prefix"
                      },
                      {
                        children: m
                      }
                    )
                  ),
                  (0, o.jsxs)(
                    ce.xz,
                    Object.assign(
                      {
                        className: "settings-menu",
                        variant: ce.Wu.TERTIARY,
                        label: p,
                        menuClassName: "settings-nested-menu",
                        caret: !0
                      },
                      {
                        children: [
                          (0, o.jsx)(
                            ce.zx,
                            {
                              size: ce.qE.SMALL,
                              label: h,
                              variant: ce.Wu.TERTIARY,
                              onClick: l
                            },
                            "nestedSettingOff"
                          ),
                          (0, o.jsx)(
                            ce.zx,
                            {
                              size: ce.qE.SMALL,
                              label: u,
                              variant: ce.Wu.TERTIARY,
                              onClick: () => t(r, !0)
                            },
                            "nestedSettingOn"
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
    )
  )
}
const { SETTINGS: Rn } = PhraseKey.WORKSHOP
function Mn({ active: e, manager: t }) {
  const n = (0, L.b)(),
    { analytics: s } = (0, i.useContext)(AppReactContext),
    r = !!(0, Cn.a)(Dn.Z1),
    a = (0, q.y)(BtnText.FloorPlan, !1),
    l = (0, q.y)(BtnText.Dollhouse, !1),
    d = r && (a || l),
    u = (e, n) => {
      const i = n ? "on" : "off"
      s.trackToolGuiEvent("settings", `click_settings_${e}_${i}`), t.setTogglePlayerOption(e, n)
    },
    h = n.t(Rn.ADVANCED_HEADER),
    p = n.t(Rn.ADVANCED_DOLLHOUSE_LABEL),
    m = n.t(Rn.ADVANCED_DOLLHOUSE_MESSAGE),
    f = n.t(Rn.ADVANCED_FLOORPLAN_LABEL),
    g = n.t(Rn.ADVANCED_FLOORPLAN_MESSAGE),
    v = n.t(Rn.ADVANCED_FLOOR_SELECTION_LABEL),
    y = n.t(Rn.ADVANCED_FLOOR_SELECTION_MESSAGE)
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: B("tab-contents", "advanced-tab", {
          active: e
        })
      },
      {
        children: [
          (0, o.jsx)(
            "header",
            Object.assign(
              {
                className: "settings-tab-header"
              },
              {
                children: h
              }
            )
          ),
          (0, o.jsx)(In, {
            manager: t,
            optionKey: BtnText.SpaceSearch,
            label: n.t(Rn.ADVANCED_SPACE_SEARCH_LABEL),
            iconClass: "icon-magnifying-glass",
            message: n.t(Rn.ADVANCED_SPACE_SEARCH_MESSAGE),
            testId: "SpaceSearchSettingToggle",
            onToggleSetting: u
          }),
          (0, o.jsx)(In, {
            manager: t,
            optionKey: BtnText.Dollhouse,
            label: p,
            iconClass: "icon-dollhouse",
            message: m,
            testId: "DollhouseSettingToggle",
            onToggleSetting: u
          }),
          (0, o.jsx)(In, {
            manager: t,
            optionKey: BtnText.FloorPlan,
            label: f,
            iconClass: "icon-floorplan",
            message: g,
            testId: "FloorPlanSettingToggle",
            onToggleSetting: u
          }),
          d
            ? (0, o.jsx)(
                In,
                Object.assign(
                  {
                    manager: t,
                    optionKey: BtnText.RoomBounds,
                    label: n.t(Rn.ROOM_BOUNDS_TOGGLE_LABEL),
                    iconClass: "icon-floorplan",
                    message: "",
                    testId: "RoomBoundSettingToggle",
                    onToggleSetting: u
                  },
                  {
                    children: (0, o.jsxs)(
                      "ul",
                      Object.assign(
                        {
                          className: B("settings-message", "settings-description-items")
                        },
                        {
                          children: [
                            (0, o.jsx)("li", {
                              children: n.t(Rn.ROOM_BOUNDS_TOGGLE_MESSAGE_INFO)
                            }),
                            (0, o.jsx)("li", {
                              children: n.t(Rn.ROOM_BOUNDS_TOGGLE_MESSAGE_DISCOVER)
                            })
                          ]
                        }
                      )
                    )
                  }
                )
              )
            : null,
          (0, o.jsx)(xn, {
            manager: t,
            onToggleSetting: u
          }),
          (0, o.jsx)(In, {
            manager: t,
            optionKey: BtnText.FloorSelect,
            label: v,
            iconClass: "icon-floor-controls-all",
            message: y,
            testId: "FloorSelectorSettingToggle",
            onToggleSetting: u
          }),
          (0, o.jsx)(Ln, {
            manager: t,
            onToggleSetting: u
          })
        ]
      }
    )
  )
}
const { SETTINGS: jn, HLR: Un } = PhraseKey.WORKSHOP
class Fn extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.isUnmounting = !1),
      (this.icons = {
        everything: yn,
        everythingActive: bn,
        compact: En,
        compactActive: Sn,
        none: On,
        noneActive: Tn
      }),
      (this.clickNav = e => {
        const t = e.target.getAttribute("id")
        isIncludes(Hn, t) && this.setActiveTab(t)
      }),
      (this.setActiveTab = e => {
        this.sendTrackingEvent(e),
          this.setState({
            activeTab: e
          })
      }),
      (this.changeSpaceInformationSetting = e => {
        const t = e.target.value
        this.sendTrackingEvent(t), this.props.manager.onChangeSpaceInformation(t).then(() => this.forceUpdate())
      }),
      (this.changeBackgroundColor = e => {
        const t = e.target.value
        this.sendTrackingEvent(`background_color_${t}`), this.props.manager.onChangeBackgroundColor(t).then(() => this.forceUpdate())
      }),
      (this.state = {
        activeTab: e.initialTab || Hn.PRESENTATION,
        leftNav: !(0, wn.p)((0, Nn.O)(t))
      })
  }
  componentDidMount() {
    this.context.market.waitForData(ContainerData).then(e => {
      this.isUnmounting ||
        (this.resizeSubscription = e.onPropertyChanged("size", e => {
          this.setState({
            leftNav: !(0, wn.p)(e)
          })
        }))
    })
  }
  componentWillUnmount() {
    var e
    ;(this.isUnmounting = !0), null === (e = this.resizeSubscription) || void 0 === e || e.cancel()
  }
  renderLeftNav() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "settings-nav"
        },
        {
          children: Bn.map(n => {
            const { value: i, namePhraseKey: s } = n,
              r = B({
                "nav-option": !0,
                active: t === i
              })
            return (0, o.jsx)(
              "div",
              Object.assign(
                {
                  id: i,
                  className: r,
                  onClick: this.clickNav
                },
                {
                  children: e.t(s)
                }
              ),
              i
            )
          })
        }
      )
    )
  }
  renderTopNav() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "settings-nav"
        },
        {
          children: Bn.map(n =>
            (0, o.jsx)(
              ce.zx,
              Object.assign(
                {
                  className: B("button-inline", "tab-button"),
                  variant: ce.Wu.TERTIARY,
                  active: t === n.value,
                  id: n.value,
                  onClick: this.clickNav
                },
                {
                  children: e.t(n.namePhraseKey)
                }
              ),
              n.value
            )
          )
        }
      )
    )
  }
  render() {
    const { manager: e } = this.props,
      { leftNav: t, activeTab: n } = this.state,
      i = t ? this.renderLeftNav() : this.renderTopNav(),
      s = B("settings-panel", "settings-container", {
        "left-nav": t,
        "top-nav": !t
      })
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: s
        },
        {
          children: [
            i,
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "panel-contents"
                },
                {
                  children: [
                    this.renderPresentationTab(),
                    this.renderTourSettingsTab(),
                    (0, o.jsx)(Mn, {
                      active: n === Hn.ADVANCED,
                      manager: e
                    }),
                    this.renderUnitsTab()
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
  renderUnitsTab() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state,
      n = e.t(jn.UNITS_HEADER),
      i = e.t(jn.UNITS_SUBHEADER)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: B({
            "tab-contents": !0,
            active: t === Hn.UNITS,
            "units-tab": !0
          })
        },
        {
          children: (0, o.jsxs)(
            "header",
            Object.assign(
              {
                className: "settings-tab-header"
              },
              {
                children: [
                  n,
                  (0, o.jsx)("p", {
                    children: i
                  })
                ]
              }
            )
          )
        }
      )
    )
  }
  renderPresentationTab() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state,
      { manager: n, backgroundColorSettingEnabled: i } = this.props,
      { everything: s, everythingActive: r, compact: a, compactActive: l, none: c, noneActive: d } = this.icons,
      u = hn.K.black.bgPrimary.substr(1),
      h = hn.K.grey.bgPrimary.substr(1),
      p = hn.K.white.bgPrimary.substr(1),
      m = e.t(jn.PRESENTATION_HEADER),
      f = e.t(jn.PRESENTATION_INFORMATION_HEADER),
      g = e.t(jn.PRESENTATION_INFORMATION_EVERYTHING_LABEL),
      v = e.t(jn.PRESENTATION_INFORMATION_EVERYTHING_MESSAGE),
      y = e.t(jn.PRESENTATION_INFORMATION_COMPACT_LABEL),
      b = e.t(jn.PRESENTATION_INFORMATION_COMPACT_MESSAGE),
      E = e.t(jn.PRESENTATION_INFORMATION_NONE_LABEL),
      S = e.t(jn.PRESENTATION_BACKGROUND_HEADER),
      O = e.t(jn.PRESENTATION_BACKGROUND_SUBHEADER),
      T = e.t(jn.PRESENTATION_BACKGROUND_BLACK_LABEL),
      _ = e.t(jn.PRESENTATION_BACKGROUND_GREY_LABEL),
      w = e.t(jn.PRESENTATION_BACKGROUND_WHITE_LABEL),
      A = n.getSpaceInformationSetting(),
      N = n.getBackgroundColor()
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: B({
            "tab-contents": !0,
            active: t === Hn.PRESENTATION
          })
        },
        {
          children: [
            (0, o.jsx)(
              "header",
              Object.assign(
                {
                  className: "settings-tab-header"
                },
                {
                  children: m
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "settings-label"
                },
                {
                  children: f
                }
              )
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "settings-item radio-group radio-icons"
                },
                {
                  children: [
                    (0, o.jsx)(ft, {
                      name: "space_information",
                      value: rn.EVERYTHING,
                      id: "space_information-everything",
                      checked: A === rn.EVERYTHING,
                      label: g,
                      message: v,
                      image: s,
                      activeImage: r,
                      onChange: this.changeSpaceInformationSetting
                    }),
                    (0, o.jsx)(ft, {
                      name: "space_information",
                      value: rn.COMPACT,
                      id: "space_information-compact",
                      checked: A === rn.COMPACT,
                      label: y,
                      message: b,
                      image: a,
                      activeImage: l,
                      onChange: this.changeSpaceInformationSetting
                    }),
                    (0, o.jsx)(ft, {
                      name: "space_information",
                      value: rn.NONE,
                      id: "space_information-none",
                      checked: A === rn.NONE,
                      label: E,
                      image: c,
                      activeImage: d,
                      onChange: this.changeSpaceInformationSetting
                    })
                  ]
                }
              )
            ),
            i &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "settings-label"
                  },
                  {
                    children: [
                      S,
                      (0, o.jsx)("p", {
                        children: O
                      })
                    ]
                  }
                )
              ),
            i &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "settings-item radio-group radio-icons"
                  },
                  {
                    children: [
                      (0, o.jsx)(gn, {
                        name: BtnText.BackgroundColor,
                        value: BackgroundColorDefault.black,
                        backgroundColor: hn.K.black.bgPrimary,
                        id: `${BtnText.BackgroundColor}_${u}`,
                        checked: N === BackgroundColorDefault.black,
                        label: T,
                        icon: "icon-dollhouse",
                        onChange: this.changeBackgroundColor
                      }),
                      (0, o.jsx)(gn, {
                        name: BtnText.BackgroundColor,
                        value: BackgroundColorDefault.grey,
                        backgroundColor: hn.K.grey.bgPrimary,
                        id: `${BtnText.BackgroundColor}_${h}`,
                        checked: N === BackgroundColorDefault.grey,
                        label: _,
                        icon: "icon-dollhouse",
                        onChange: this.changeBackgroundColor
                      }),
                      (0, o.jsx)(gn, {
                        name: BtnText.BackgroundColor,
                        value: BackgroundColorDefault.white,
                        backgroundColor: hn.K.white.bgPrimary,
                        id: `${BtnText.BackgroundColor}_${p}`,
                        checked: N === BackgroundColorDefault.white,
                        label: w,
                        icon: "icon-dollhouse",
                        onChange: this.changeBackgroundColor
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
  renderTourSettingsTab() {
    const { locale: e } = this.context,
      { activeTab: t } = this.state,
      n = e.t(Un.TOUR_SETTINGS_MOVED_HEADER),
      i = e.t(Un.TOUR_SETTINGS_MOVED_MESSAGE)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: B({
            "tab-contents": !0,
            active: t === Hn.TOUR_HLR,
            "tours-tab": !0
          })
        },
        {
          children: (0, o.jsxs)(
            "header",
            Object.assign(
              {
                className: "settings-tab-header"
              },
              {
                children: [
                  n,
                  (0, o.jsx)("p", {
                    children: i
                  }),
                  (0, o.jsx)(mn, {
                    id: "tour-settings-moved",
                    url: _n
                  })
                ]
              }
            )
          )
        }
      )
    )
  }
  sendTrackingEvent(e) {
    this.context.analytics.trackToolGuiEvent("settings", `click_settings_${e}`)
  }
}
Fn.contextType = AppReactContext
enum Hn {
  ADVANCED = "settings-advanced",
  PRESENTATION = "settings-presentation",
  TOUR_HLR = "settings-tour",
  UNITS = "settings-units"
}
const Bn = [
  {
    namePhraseKey: jn.NAV_OPTION_PRESENTATION,
    value: Hn.PRESENTATION
  },
  {
    namePhraseKey: jn.NAV_OPTION_UNITS,
    value: Hn.UNITS
  },
  {
    namePhraseKey: jn.NAV_OPTION_ADVANCED,
    value: Hn.ADVANCED
  },
  {
    namePhraseKey: jn.NAV_OPTION_TOUR_HLR,
    value: Hn.TOUR_HLR
  }
]
function Vn() {
  const e = (0, z.B)(),
    t = (0, q.y)(on.v, !1),
    n = (0, L.b)(),
    i = (0, $.Q)(ToolsList.SETTINGS_PANEL)
  if (!i || e !== ToolsList.SETTINGS_PANEL) return null
  const s = n.t(i.namePhraseKey)
  return (0, o.jsx)(
    an.H,
    Object.assign(
      {
        open: !0,
        title: s,
        fullModal: !0,
        className: "settings-modal large-modal"
      },
      {
        children: (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: "modal-body"
            },
            {
              children: (0, o.jsx)(Fn, {
                manager: i.manager,
                backgroundColorSettingEnabled: t
              })
            }
          )
        )
      }
    )
  )
}
function $n({ tool: e }) {
  const { hasUpdates: t, icon: n, namePhraseKey: s, id: r, dimmed: a } = e,
    { analytics: l, commandBinder: u, locale: h } = (0, i.useContext)(AppReactContext),
    p = (0, oe.Y)(),
    m = (0, z.B)() === r,
    f = (0, i.useCallback)(() => {
      m || l.trackGuiEvent(`click_${r.toLowerCase()}`), u.issueCommand(new ToggleToolCommand(r, !m))
    }, [r, l, u, m]),
    g = h.t(s),
    v = p ? void 0 : g,
    y = p ? g : void 0,
    b = p ? ce.Wu.TERTIARY : void 0,
    E = p ? "light" : "dark",
    S = n.replace("icon-", ""),
    O = B({
      "with-updates-dot": !!t,
      "tool-dimmed": a
    })
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "toolbar-button"
      },
      {
        children: (0, o.jsx)(ce.zx, {
          className: O,
          label: y,
          variant: b,
          theme: E,
          active: m,
          icon: S,
          tooltip: v,
          tooltipOptions: {
            placement: "left",
            offset: [0, 20]
          },
          onClick: f
        })
      }
    )
  )
}
function Kn({ tools: e }) {
  const t = []
  return (
    e.forEach(e => {
      const { id: n } = e
      t.push(
        (0, o.jsx)(
          $n,
          {
            tool: e
          },
          n
        )
      )
    }),
    t.length
      ? (0, o.jsx)(o.Fragment, {
          children: t
        })
      : null
  )
}
function Yn() {
  const e = (function () {
      const e = (0, Gn.w)(),
        [t, n] = (0, i.useState)((null == e ? void 0 : e.getToolPalettes()) || {})
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          const t = e.onChanged(() => n(e.getToolPalettes()))
          return () => t.cancel()
        }, [e]),
        t
      )
    })(),
    t = (0, oe.Y)()
  if ((0, z.B)() && t) return null
  let n = 0
  const s = []
  for (const t in e) {
    const i = e[t]
    s.push(
      (0, o.jsx)(
        Kn,
        {
          tools: i
        },
        t
      ),
      (0, o.jsx)(
        "div",
        {
          className: "divider"
        },
        `tool_divider_${n}`
      )
    ),
      (n += i.length)
  }
  s.pop()
  const r = t ? zn.Nm.horizontal : zn.Nm.vertical,
    a = B("toolbar-palettes", {
      narrow: t,
      vertical: !t
    })
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: a
      },
      {
        children: (0, o.jsx)(
          Wn.Z,
          Object.assign(
            {
              id: "toolbar-scrollbar",
              hideScrollbar: !0,
              direction: r,
              suppressDrag: !1,
              scrollButtons: !t,
              steps: n
            },
            {
              children: (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "tool-buttons"
                  },
                  {
                    children: s
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
class qn extends i.Component {
  constructor(e) {
    super(e),
      (this.downOnBackground = !1),
      (this.onPointerDown = () => {
        ;(this.downOnBackground = !0),
          window.setTimeout(() => {
            this.downOnBackground = !1
          }, 500)
      }),
      (this.onPointerUp = () => {
        this.downOnBackground && this.props.onCloseModal()
      })
  }
  render() {
    const { open: e, hidden: t, children: n } = this.props,
      i = e && !t
    return (0, o.jsx)(
      te.N,
      Object.assign(
        {
          open: e,
          className: B("modal-background", {
            open: i
          }),
          onPointerUp: this.onPointerUp,
          onPointerDown: this.onPointerDown
        },
        {
          children: n
        }
      )
    )
  }
}
qn.contextType = AppReactContext
const { HLR: ti } = PhraseKey.WORKSHOP
enum ni {
  BEHAVIORS = "behaviors",
  LABELS = "labels"
}
class ii extends i.Component {
  constructor(e) {
    super(e),
      (this.applyTransitionTypeToAll = () => {
        const { highlight: e, manager: t } = this.props
        t.applyAllTransitionType(e), this.sendTrackingEvent("apply_all_transition_type")
      }),
      (this.applyPanSettingsToAll = () => {
        const { highlight: e, manager: t } = this.props
        t.applyAllPanSettings(e), this.sendTrackingEvent("apply_all_pan_settings")
      }),
      (this.changeTransitionType = e => {
        const { highlight: t, manager: n } = this.props,
          i = e.target,
          s = Number(i.value)
        this.setState({
          transitionType: s
        }),
          n
            .changeTourOverrides(t, {
              transitionType: s
            })
            .then(() => this.forceUpdate()),
          this.sendTrackingEvent("change_transition_type")
      }),
      (this.changePanDirection = e => {
        const { highlight: t, manager: n } = this.props,
          i = e.target,
          s = Number(i.value)
        this.setState({
          panDirection: s
        }),
          n
            .changeTourOverrides(t, {
              panDirection: s
            })
            .then(() => this.forceUpdate()),
          this.sendTrackingEvent("change_pan_direction")
      }),
      (this.changePanAngle = e => {
        const { manager: t, highlight: n } = this.props
        this.setState({
          panAngle: e
        }),
          t.changeTourOverrides(n, {
            panAngle: e
          }),
          this.sendTrackingEvent("change_pan_angle")
      }),
      (this.onCaptionEdited = async e => {
        await this.context.commandBinder.issueCommand(new TourRenameCommand(this.props.highlight.id, e))
      }),
      (this.onCaptionBlur = () => {
        this.onCaptionEdited(this.state.caption)
      }),
      (this.onCaptionInput = e => {
        this.setState({
          caption: e
        })
      }),
      (this.onTitleBlur = () => {
        this.onTitleEdited(this.state.title)
      }),
      (this.onTitleInput = e => {
        this.setState({
          title: e
        })
      }),
      (this.onTitleEdited = async e => {
        await this.context.commandBinder.issueCommand(new TourChangeTitleCommand(this.props.highlight.id, e))
      }),
      (this.onDescriptionBlur = () => {
        this.onDescriptionEdited(this.state.description)
      }),
      (this.onDescriptionEdited = async e => {
        this.setState({
          description: e
        }),
          await this.context.commandBinder.issueCommand(new TourChangeDescriptionCommand(this.props.highlight.id, e))
      }),
      (this.onDescriptionInput = e => {
        this.setState({
          description: e
        })
      }),
      (this.onEditNextHighlight = () => {
        this.hasNextHighlight() && this.context.commandBinder.issueCommand(new TourRelativeCommand(!0, !0))
      }),
      (this.onEditPrevHighlight = () => {
        this.hasPrevHighlight() && this.context.commandBinder.issueCommand(new TourRelativeCommand(!1, !0))
      }),
      (this.deleteHighlight = async () => {
        const { highlight: e, totalSteps: t, currentStep: n } = this.props
        let i = -1
        t > 1 && (i = n === t - 1 ? n - 1 : n),
          await this.context.commandBinder.issueCommand(new DeleteTourStopCommand(e.id)),
          -1 !== i ? this.context.commandBinder.issueCommand(new TourStepCommand(i, !0)) : this.onClose()
      }),
      (this.previewHighlight = async () => {
        const { currentStep: e, onToggle: t, totalSteps: n } = this.props,
          i = e > 0 ? e - 1 : n - 1
        i >= 0 &&
          (this.setState({
            previewing: !0
          }),
          await this.context.commandBinder.issueCommand(new TourStepCommand(i, !0)),
          t(!1, !0),
          window.setTimeout(() => {
            this.context.commandBinder.issueCommand(
              new TourStartCommand({
                index: e,
                loop: !0,
                steps: 1
              })
            )
          }, ii.pauseBeforePreview))
      }),
      (this.onClose = () => {
        this.props.onToggle(!1, !1)
      }),
      (this.tourStopped = () => {
        this.state.previewing &&
          window.setTimeout(() => {
            this.setState({
              previewing: !1
            }),
              this.props.onToggle(!0, !0)
          }, ii.pauseAfterPreview)
      }),
      (this.showHelp = () => {
        window.open("https://support.matterport.com/s/article/Highlight-Reel-und-gefhrte-Tour-in-Workshop60272?language=en_US#override-tour-settings", "_blank")
      }),
      (this.showLabelsTab = () => this.setActiveTab(ni.LABELS)),
      (this.showBehaviorsTab = () => this.setActiveTab(ni.BEHAVIORS))
    const { activeReelMode: t } = this.props,
      n = t === tourModeType.REEL
    this.state = Object.assign(
      {
        activeTab: n ? ni.BEHAVIORS : ni.LABELS,
        previewing: !1,
        title: e.highlight.title || "",
        description: e.highlight.description || "",
        caption: e.highlight.snapshot.name || ""
      },
      this.getBehaviorState()
    )
  }
  componentDidMount() {
    this.context.messageBus.subscribe(TourStoppedMessage, this.tourStopped)
  }
  componentWillUnmount() {
    this.context.messageBus.unsubscribe(TourStoppedMessage, this.tourStopped)
  }
  componentDidUpdate(e) {
    const { highlight: t } = this.props
    e.highlight !== t &&
      this.setState(
        Object.assign(Object.assign({}, this.getBehaviorState()), {
          title: t.title || "",
          description: t.description || "",
          caption: t.snapshot.name || ""
        })
      )
  }
  getBehaviorState() {
    const { highlight: e, manager: t } = this.props
    return {
      transitionType: t.getTransitionType(e),
      panDirection: t.getPanDirection(e),
      panAngle: t.getPanAngle(e)
    }
  }
  sendTrackingEvent(e) {
    this.context.analytics.trackToolGuiEvent("hlr", e)
  }
  hasNextHighlight() {
    const { totalSteps: e, currentStep: t } = this.props
    return t + 1 < e
  }
  hasPrevHighlight() {
    return this.props.currentStep > 0
  }
  setActiveTab(e) {
    this.setState({
      activeTab: e
    })
  }
  renderTransitionType(e) {
    const { locale: t } = this.context,
      { transitionType: n, transitionCondition: i } = e
    let s = null
    i === Ne.IS_360
      ? (s = t.t(ti.TRANSITION_IS_360_DISABLED_MESSAGE))
      : i === Ne.AFTER_360
        ? (s = t.t(ti.TRANSITION_AFTER_360_DISABLED_MESSAGE))
        : i === Ne.SAME_SWEEP && (s = t.t(ti.TRANSITION_SAME_SWEEP_DISABLED_MESSAGE))
    const r = t.t(ti.INDIVIDUAL_TRANSITION_SETTING_LABEL),
      a = t.t(ti.APPLY_TO_ALL_CTA),
      l = t.t(ti.TRANSITION_SETTING_SLIDESHOW),
      c = t.t(ti.TRANSITION_SETTING_WALKTHROUGH)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "highlight-setting transition-setting"
        },
        {
          children: [
            (0, o.jsxs)(
              "label",
              Object.assign(
                {
                  className: "settings-label"
                },
                {
                  children: [
                    (0, o.jsxs)("div", {
                      children: [
                        r,
                        (0, o.jsx)(
                          SettingsLabel,
                          Object.assign(
                            {
                              buttonStyle: IconButtonAttribute.PLAIN,
                              onClick: this.showHelp
                            },
                            {
                              children: (0, o.jsxs)(
                                "span",
                                Object.assign(
                                  {
                                    className: "icon icon-info"
                                  },
                                  {
                                    children: [
                                      (0, o.jsx)("span", {
                                        className: "path1"
                                      }),
                                      (0, o.jsx)("span", {
                                        className: "path2"
                                      })
                                    ]
                                  }
                                )
                              )
                            }
                          )
                        )
                      ]
                    }),
                    !s &&
                      (0, o.jsx)(
                        "a",
                        Object.assign(
                          {
                            className: "link apply-link",
                            onClick: this.applyTransitionTypeToAll
                          },
                          {
                            children: a
                          }
                        )
                      )
                  ]
                }
              )
            ),
            !s &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "setting-options"
                  },
                  {
                    children: [
                      (0, o.jsx)(
                        ct.E,
                        Object.assign(
                          {
                            name: "transition_type",
                            value: TransitionTypeList.FadeToBlack.toString(),
                            enabled: !0,
                            id: "hlr-transition-fade",
                            checked: n === TransitionTypeList.FadeToBlack,
                            onChange: this.changeTransitionType
                          },
                          {
                            children: l
                          }
                        )
                      ),
                      (0, o.jsx)(
                        ct.E,
                        Object.assign(
                          {
                            name: "transition_type",
                            value: TransitionTypeList.Interpolate.toString(),
                            enabled: !0,
                            id: "hlr-transition-fly",
                            checked: n === TransitionTypeList.Interpolate,
                            onChange: this.changeTransitionType
                          },
                          {
                            children: c
                          }
                        )
                      )
                    ]
                  }
                )
              ),
            s &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "tour-setting-note"
                  },
                  {
                    children: [
                      (0, o.jsx)("span", {
                        className: "icon icon-error"
                      }),
                      s
                    ]
                  }
                )
              )
          ]
        }
      )
    )
  }
  renderPanRotation(e) {
    const { locale: t } = this.context,
      { highlight: n, manager: i } = this.props,
      { panDirection: s, panAngle: r } = e
    let a = null
    i.isFloorPlan(n) && (a = t.t(ti.TRANSITION_NO_ROTATION_DISABLED_MESSAGE))
    const l = t.t(ti.APPLY_TO_ALL_CTA),
      c = t.t(ti.INDIVIDUAL_PAN_DIRECTION_SETTING_LABEL),
      d = t.t(ti.PAN_DIRECTION_SETTING_LEFT),
      u = t.t(ti.PAN_DIRECTION_SETTING_RIGHT),
      h = t.t(ti.PAN_DIRECTION_SETTING_AUTO)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "highlight-setting pan-setting"
        },
        {
          children: [
            (0, o.jsxs)(
              "label",
              Object.assign(
                {
                  className: "settings-label"
                },
                {
                  children: [
                    c,
                    !a &&
                      (0, o.jsx)(
                        "a",
                        Object.assign(
                          {
                            className: "link apply-link",
                            onClick: this.applyPanSettingsToAll
                          },
                          {
                            children: l
                          }
                        )
                      )
                  ]
                }
              )
            ),
            !a &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "setting-options"
                  },
                  {
                    children: [
                      (0, o.jsx)(
                        ct.E,
                        Object.assign(
                          {
                            name: "pan_direction",
                            value: PanDirectionList.Left.toString(),
                            id: "pan-direction-left",
                            enabled: !0,
                            checked: s === PanDirectionList.Left,
                            onChange: this.changePanDirection
                          },
                          {
                            children: d
                          }
                        )
                      ),
                      (0, o.jsx)(
                        ct.E,
                        Object.assign(
                          {
                            name: "pan_direction",
                            value: PanDirectionList.Right.toString(),
                            id: "pan-direction-right",
                            enabled: !0,
                            checked: s === PanDirectionList.Right,
                            onChange: this.changePanDirection
                          },
                          {
                            children: u
                          }
                        )
                      ),
                      (0, o.jsx)(
                        ct.E,
                        Object.assign(
                          {
                            name: "pan_direction",
                            value: PanDirectionList.Auto.toString(),
                            id: "pan-direction-auto",
                            enabled: !0,
                            checked: s === PanDirectionList.Auto,
                            onChange: this.changePanDirection
                          },
                          {
                            children: h
                          }
                        )
                      ),
                      (0, o.jsx)(lt.Y, {
                        className: "pan-angle-setting",
                        units: "°",
                        value: r,
                        min: 0,
                        max: 360,
                        step: 10,
                        onDone: this.changePanAngle
                      })
                    ]
                  }
                )
              ),
            a &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "tour-setting-note"
                  },
                  {
                    children: [
                      (0, o.jsx)("span", {
                        className: "icon icon-error"
                      }),
                      a
                    ]
                  }
                )
              )
          ]
        }
      )
    )
  }
  renderBehaviors() {
    const { manager: e, highlight: t, previousHighlight: n } = this.props,
      { activeTab: i } = this.state
    if (i !== ni.BEHAVIORS) return null
    const s = e.getTourOptionsBasedOnReel(t, n)
    return (0, o.jsxs)("div", {
      children: [this.renderTransitionType(s), this.renderPanRotation(s)]
    })
  }
  renderLabels() {
    const { activeTab: e } = this.state
    return e !== ni.LABELS
      ? null
      : (0, o.jsxs)("div", {
          children: [this.renderTitle(), this.renderDescription(), this.renderCaption()]
        })
  }
  renderDescription() {
    const { locale: e } = this.context,
      { highlight: t } = this.props,
      { description: n } = this.state,
      { id: i } = t,
      s = e.t(ti.HIGHLIGHT_DESCRIPTION_HINT),
      r = e.t(ti.HIGHLIGHT_DESCRIPTION_PLACEHOLDER),
      a = e.t(ti.TOUR_EDITOR_TITLE_DESCRIPTION_TIP),
      l = e.t(ti.TOUR_EDITOR_TITLE_DESCRIPTION_TIP_LINK)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "highlight-setting tour-stop-text-setting"
        },
        {
          children: [
            (0, o.jsx)(
              Xn.Z,
              {
                text: n,
                label: n ? s : "",
                inputStyle: Xn.P.OUTLINED,
                placeholder: r,
                onInput: this.onDescriptionInput,
                onDone: this.onDescriptionEdited,
                onBlur: this.onDescriptionBlur,
                maxLength: Zn.xP,
                rows: 3,
                tabIndex: 2
              },
              `description-${i}`
            ),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "tour-description-tip"
                },
                {
                  children: [
                    `${a} `,
                    (0, o.jsx)(
                      "a",
                      Object.assign(
                        {
                          href: "https://support.matterport.com/s/article/Invite-a-New-Collaborator-to-your-Organization",
                          target: "_blank"
                        },
                        {
                          children: l
                        }
                      )
                    ),
                    ` ${n.length} / ${Zn.xP}`
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
  renderTitle() {
    const { locale: e, settings: t } = this.context,
      { highlight: n, activeReelMode: i } = this.props,
      { id: s } = n,
      { title: r } = this.state,
      a = e.t(ti.HIGHLIGHT_TITLE_HINT),
      l = e.t(ti.HIGHLIGHT_TITLE_PLACEHOLDER),
      c = e.t(ti.TOUR_EDITOR_TITLE_DESCRIPTION_HELPER),
      d = (0, Qn.w7)(t, i) !== TourMode.STORIES
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "highlight-setting tour-stop-text-setting"
        },
        {
          children: [
            d &&
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "tour-stop-helper"
                  },
                  {
                    children: [
                      (0, o.jsx)("span", {
                        className: "icon icon-info"
                      }),
                      c
                    ]
                  }
                )
              ),
            (0, o.jsx)(
              Xn.Z,
              {
                text: r,
                label: r ? a : "",
                placeholder: l,
                inputStyle: Xn.P.OUTLINED,
                maxLength: Zn.hA,
                onInput: this.onTitleInput,
                onDone: this.onTitleEdited,
                onBlur: this.onTitleBlur,
                rows: 1,
                tabIndex: 1
              },
              `title-${s}`
            )
          ]
        }
      )
    )
  }
  renderCaption() {
    const { locale: e } = this.context,
      { highlight: t } = this.props,
      { id: n } = t,
      { caption: i } = this.state,
      s = e.t(ti.HIGHLIGHT_SCENE_HINT),
      r = e.t(ti.HIGHLIGHT_SCENE_PLACEHOLDER)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "highlight-setting tour-stop-text-setting"
        },
        {
          children: (0, o.jsx)(
            Xn.Z,
            {
              text: i,
              label: i ? s : "",
              placeholder: r,
              inputStyle: Xn.P.OUTLINED,
              maxLength: Zn.K5,
              onInput: this.onCaptionInput,
              onDone: this.onCaptionEdited,
              onBlur: this.onCaptionBlur,
              tabIndex: 3,
              rows: 1
            },
            `caption-${n}`
          )
        }
      )
    )
  }
  renderHighlightHeader() {
    const { title: e, description: t, caption: n } = this.state,
      { highlight: i } = this.props,
      s = this.hasNextHighlight(),
      r = this.hasPrevHighlight(),
      l = !!n && n.length > 0,
      { activeReelMode: c } = this.props,
      d = c === tourModeType.STORY
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "highlight-header"
        },
        {
          children: [
            (0, o.jsx)(ei.X, {
              resource: i.snapshot.imageUrl,
              className: "highlight-image"
            }),
            (0, o.jsxs)(
              "div",
              Object.assign(
                {
                  className: "highlight-header-controls"
                },
                {
                  children: [
                    (0, o.jsx)(ce.zx, {
                      className: B("modal-nav", "modal-prev"),
                      icon: "dpad-left",
                      theme: "overlay",
                      variant: ce.Wu.TERTIARY,
                      disabled: !r,
                      onClick: this.onEditPrevHighlight
                    }),
                    (0, o.jsx)(ce.zx, {
                      className: B("modal-nav", "modal-next"),
                      icon: "dpad-right",
                      theme: "overlay",
                      variant: ce.Wu.TERTIARY,
                      disabled: !s,
                      onClick: this.onEditNextHighlight
                    }),
                    d &&
                      (0, o.jsxs)(
                        "div",
                        Object.assign(
                          {
                            className: "highlight-header-labels"
                          },
                          {
                            children: [
                              (0, o.jsx)(
                                "div",
                                Object.assign(
                                  {
                                    className: B("tour-story-title")
                                  },
                                  {
                                    children: e
                                  }
                                )
                              ),
                              (0, o.jsx)(
                                "div",
                                Object.assign(
                                  {
                                    className: B("tour-story-description")
                                  },
                                  {
                                    children: t
                                  }
                                )
                              ),
                              l &&
                                (0, o.jsx)(
                                  "div",
                                  Object.assign(
                                    {
                                      className: B("tour-story-controls")
                                    },
                                    {
                                      children: (0, o.jsx)(
                                        "div",
                                        Object.assign(
                                          {
                                            className: "tour-control-label"
                                          },
                                          {
                                            children: n
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
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
  renderTabs() {
    const { activeTab: e } = this.state,
      { locale: t } = this.context,
      n = t.t(ti.TOUR_EDITOR_LABELS_TAB),
      i = t.t(ti.TOUR_EDITOR_BEHAVIORS_TAB)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "tabs"
        },
        {
          children: [
            (0, o.jsx)(ce.zx, {
              className: B("button-inline", "tab-button"),
              active: e === ni.LABELS,
              onClick: this.showLabelsTab,
              variant: ce.Wu.TERTIARY,
              label: n
            }),
            (0, o.jsx)(ce.zx, {
              className: B("button-inline", "tab-button"),
              active: e === ni.BEHAVIORS,
              onClick: this.showBehaviorsTab,
              variant: ce.Wu.TERTIARY,
              label: i
            })
          ]
        }
      )
    )
  }
  render() {
    const { locale: e } = this.context,
      { manager: t, currentStep: n, totalSteps: i } = this.props,
      { previewing: s } = this.state,
      r = e.t(ti.TRANSITION_EDITOR_TITLE, {
        currentNumber: n + 1,
        totalNumber: i
      }),
      a = e.t(ti.DELETE_HIGHLIGHT_TOOLTIP_MESSAGE),
      l = e.t(ti.PREVIEW_SETTINGS_CTA),
      c = e.t(ti.CLOSE_SETTINGS_CTA)
    return (0, o.jsxs)(
      ce.Vq,
      Object.assign(
        {
          className: B("full-modal", "transition-editor", {
            previewing: s
          }),
          onClose: this.onClose
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
                          children: r
                        }
                      )
                    ),
                    (0, o.jsx)(ce.zx, {
                      icon: "delete",
                      disabled: t.isTourEmpty(),
                      tooltip: a,
                      onClick: this.deleteHighlight
                    }),
                    (0, o.jsx)(dt.P, {
                      onClose: this.onClose
                    })
                  ]
                }
              )
            ),
            this.renderHighlightHeader(),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: "modal-content"
                      },
                      {
                        children: [this.renderTabs(), this.renderLabels(), this.renderBehaviors()]
                      }
                    )
                  )
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
                  children: (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: "modal-buttons"
                      },
                      {
                        children: [
                          (0, o.jsx)(ce.zx, {
                            className: "button-inline",
                            variant: ce.Wu.SECONDARY,
                            size: ce.qE.LARGE,
                            onClick: this.previewHighlight,
                            label: l
                          }),
                          (0, o.jsx)(ce.zx, {
                            className: "button-inline",
                            variant: ce.Wu.PRIMARY,
                            size: ce.qE.LARGE,
                            onClick: this.onClose,
                            label: c
                          })
                        ]
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
ii.contextType = AppReactContext
ii.pauseBeforePreview = 800
ii.pauseAfterPreview = 500
const { WORKSHOP: ri, CLOSE: ai } = PhraseKey,
  { LAYERS: oi } = ri
function li() {
  const e = (0, qe.R)(),
    t = (0, L.b)(),
    { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = e === v.P.VIEWS_INFO,
    a = (0, i.useCallback)(() => {
      n.trackToolGuiEvent("layers", "views_dismiss_info_modal")
    }, [n]),
    l = (0, i.useCallback)(() => {
      s.issueCommand(new ToggleModalCommand(v.P.VIEWS_INFO, !1)), a()
    }, [s, a]),
    d = t.t(oi.SWITCH_TO_VIEWS_TITLE),
    u = t.t(oi.SWITCH_TO_VIEWS_LEARN_MORE)
  return (0, o.jsxs)(
    an.H,
    Object.assign(
      {
        open: r,
        title: d,
        fullModal: !0,
        onClose: a,
        className: "info-modal large-modal"
      },
      {
        children: [
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "modal-body"
              },
              {
                children: [
                  (0, o.jsx)("p", {
                    children: t.t(oi.SWITCH_TO_VIEWS_LIST_HEADER)
                  }),
                  (0, o.jsxs)("ul", {
                    children: [
                      (0, o.jsx)("li", {
                        children: t.t(oi.SWITCH_TO_VIEWS_LIST_ITEM_1)
                      }),
                      (0, o.jsx)("li", {
                        children: t.t(oi.SWITCH_TO_VIEWS_LIST_ITEM_2)
                      }),
                      (0, o.jsx)("li", {
                        children: t.t(oi.SWITCH_TO_VIEWS_LIST_ITEM_3)
                      }),
                      (0, o.jsx)("li", {
                        children: t.t(oi.SWITCH_TO_VIEWS_LIST_ITEM_4)
                      })
                    ]
                  })
                ]
              }
            )
          ),
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "modal-footer"
              },
              {
                children: [
                  (0, o.jsx)(
                    si.r,
                    Object.assign(
                      {
                        href: VIEWS_SUPPORT_PAGE_URL
                      },
                      {
                        children: u
                      }
                    )
                  ),
                  (0, o.jsx)(
                    ce.hE,
                    Object.assign(
                      {
                        spacing: "small"
                      },
                      {
                        children: (0, o.jsx)(ce.zx, {
                          variant: ce.Wu.PRIMARY,
                          size: ce.qE.LARGE,
                          onClick: l,
                          label: t.t(ai)
                        })
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
const mi = useDataHook(CamStartData)
const gi = useDataHook(StartLocationViewData)
function vi() {
  const e = mi(),
    t = gi(),
    [n, s] = (0, i.useState)(null == e ? void 0 : e.icon)
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function n() {
        e && s(null == e ? void 0 : e.icon)
      }
      const i = t.onStartLocationSweepsChanged(n)
      return n(), () => i.cancel()
    }, [e, t]),
    n
  )
}
function yi(e) {
  const { selectedIndex: t, selected: n, numPhotos: i, isNavKeyDisabled: s, onNavigate: r, onClose: a, onDelete: l } = e,
    c = (0, L.b)(),
    d = vi(),
    u = c.t(PhraseKey.WORKSHOP.PHOTOS.PHOTO_VIEWER)
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsx)(
        "h3",
        Object.assign(
          {
            className: "modal-title"
          },
          {
            children: !n && u
          }
        )
      ),
      (0, o.jsx)("div", {
        children:
          n &&
          (0, o.jsx)(ui.$, {
            index: t,
            total: i,
            disabled: s,
            wrapAround: !0,
            onNavigate: r
          })
      }),
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "photo-header-right"
          },
          {
            children: [
              n &&
                (0, o.jsxs)(
                  ce.xz,
                  Object.assign(
                    {
                      ariaLabel: c.t(PhraseKey.MORE_OPTIONS),
                      className: "photo-selected-action-btn",
                      icon: "more-vert",
                      variant: ce.Wu.TERTIARY,
                      size: ce.qE.MEDIUM,
                      menuTheme: "light",
                      menuPlacement: "bottom-end",
                      menuYOffset: 8,
                      analytic: "photo_selected_actions_click",
                      tooltipClassName: "photo-selected-actions-tooltip"
                    },
                    {
                      children: [
                        (0, o.jsx)(ce.zx, {
                          label: "Download",
                          variant: ce.Wu.TERTIARY,
                          size: ce.qE.SMALL,
                          onClick: async function () {
                            if (!(null == n ? void 0 : n.downloadUrl)) throw new Error("Unable to download image")
                            const e = await fetch(n.downloadUrl),
                              t = await e.blob(),
                              i = `${(0, di.Ox)(n)}.${(0, di.AR)(n.downloadUrl)}`
                            downloadFlies(t, i)
                          }
                        }),
                        (0, o.jsx)(ce.zx, {
                          label: "Delete",
                          variant: ce.Wu.TERTIARY,
                          size: ce.qE.SMALL,
                          onClick: l,
                          disabled: d === n.sid
                        })
                      ]
                    }
                  )
                ),
              (0, o.jsx)(dt.P, {
                onClose: a
              })
            ]
          }
        )
      )
    ]
  })
}
function bi(e) {
  const { photo: t } = e,
    { commandBinder: n } = (0, i.useContext)(AppReactContext),
    s = (0, di.EC)(t)
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "photo-grid-img-container"
      },
      {
        children: [
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "photo-grid-img"
              },
              {
                children: [
                  (0, o.jsx)("img", {
                    className: "photo-grid-img-thumb",
                    onClick: function () {
                      n.issueCommand(new SetCurrentSnapshotPhotoCommand(t.sid))
                    },
                    src: t.thumbUrl
                  }),
                  s &&
                    (0, o.jsx)(ce.zx, {
                      className: "photo-grid-img-icon",
                      icon: s,
                      variant: ce.Wu.FAB,
                      theme: "overlay"
                    })
                ]
              }
            )
          ),
          (0, o.jsx)(
            "span",
            Object.assign(
              {
                className: "photo-label"
              },
              {
                children: (0, di.Ox)(t)
              }
            )
          )
        ]
      }
    )
  )
}
const Ei = useDataHook(SnapshotsData)
function Si(e) {
  const t = Ei(),
    [n, s] = (0, i.useState)(),
    [r, a] = (0, i.useState)(!0)
  return (
    (0, i.useEffect)(() => {
      !(async function () {
        if (!t) return
        const n = t.getSortedCollection(e),
          i = []
        for (const e of n) {
          const t = await e.thumbnailUrl.get(),
            { sid: n, created: s, category: r, imageUrl: a } = e,
            o = (0, di.Ox)(e)
          i.push({
            sid: n,
            name: o,
            created: s,
            category: r,
            imageUrl: a,
            thumbUrl: t
          })
        }
        s(i), a(!1)
      })()
    }, []),
    {
      photos: n,
      isLoading: r,
      deletePhoto: function (e) {
        const t = null == n ? void 0 : n.filter(t => t.sid !== e)
        s(t)
      },
      updatePhoto: function (e, t) {
        if (null == n ? void 0 : n.length) {
          const i = [...n]
          for (let s = 0; s < n.length; s++) {
            const r = n[s]
            if (r.sid === e) {
              i[s] = Object.assign(Object.assign({}, r), t)
              break
            }
          }
          i.sort(di.IA), s(i)
        }
      }
    }
  )
}
function Oi(e) {
  const { photo: t, isUpdating: n, updateName: s, onFocus: r, onBlur: a } = e,
    l = (0, L.b)(),
    c = vi(),
    d = (0, di.Ox)(t),
    [u, h] = (0, i.useState)(d)
  if (
    ((0, i.useEffect)(() => {
      const e = (0, di.Ox)(t)
      h(e)
    }, [t]),
    !t)
  )
    return null
  const p = l.t(PhraseKey.WORKSHOP.PHOTOS.UPDATE_NAME),
    m = l.t(PhraseKey.WORKSHOP.PHOTOS.PHOTO_NAME),
    f = u === d || n
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "photo-footer"
      },
      {
        children: [
          c === t.sid &&
            (0, o.jsx)(ce.JO, {
              name: "start-location",
              size: ce.Jh.MEDIUM,
              className: "footer-start-icon"
            }),
          (0, o.jsx)(ce.oi, {
            text: u,
            label: m,
            maxLength: 30,
            onInput: h,
            onFocus: r,
            onBlur: a
          }),
          (0, o.jsx)(ce.zx, {
            className: "update-photo-name-btn",
            label: p,
            size: ce.qE.LARGE,
            disabled: f,
            variant: ce.Wu.PRIMARY,
            onClick: async function () {
              s(t.sid, u)
            }
          })
        ]
      }
    )
  )
}
const _i = e => {
  const { onClose: t, initialSelected: n } = e,
    { commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = (0, L.b)(),
    {
      photos: a,
      isLoading: l,
      deletePhoto: d,
      updatePhoto: u
    } = Si({
      filterFn: e => e.category !== SnapshotCategory.TOUR
    }),
    [h, p] = (0, i.useState)(!1),
    [m, f] = (0, i.useState)(!1),
    g = (function (e, t) {
      const n = Ei(),
        s = null == n ? void 0 : n.selectedPhotoId,
        [r, a] = (0, i.useState)()
      async function o(e) {
        let i = null
        if (n && s) {
          const t = n.get(s),
            a = (null == r ? void 0 : r.sid) !== s ? await n.getImageUrl(s) : null == r ? void 0 : r.displayUrl,
            o = null == e ? void 0 : e.find(e => e.sid === s),
            l = new URL(a),
            c = new URL(a)
          c.searchParams.delete("width"),
            c.searchParams.delete("height"),
            c.searchParams.delete("fit"),
            c.searchParams.delete("disable"),
            (i = Object.assign(Object.assign({}, o || t), {
              sid: s,
              displayUrl: l.toString(),
              downloadUrl: c.toString()
            }))
        }
        a(i), null == t || t()
      }
      return (
        (0, i.useEffect)(() => {
          if (n) {
            if (!s) return void o()
            const t = n.get(s)
            ;((null == r ? void 0 : r.sid) === t.sid && (null == r ? void 0 : r.name) === (0, di.Ox)(t)) || o(e)
          }
          return () => {}
        }, [r, e, n, s]),
        r
      )
    })(a, y),
    v = (0, i.useMemo)(() => {
      const e = (null == g ? void 0 : g.sid) || n
      return e && a ? (0, di.C2)(a, e) : -1
    }, [g, a])
  function y() {
    f(!1)
  }
  function b(e) {
    s.issueCommand(new SetCurrentSnapshotPhotoCommand(e))
  }
  function E() {
    s.issueCommand(new SetCurrentSnapshotPhotoCommand(""))
  }
  ;(0, i.useEffect)(() => {
    n && a && b(n)
  }, [a, n]),
    (0, i.useEffect)(() => () => E(), [])
  const S = r.t(PhraseKey.WORKSHOP.PHOTOS.NO_PHOTOS),
    O = r.t(PhraseKey.LOADING),
    T = r.t(PhraseKey.WORKSHOP.PHOTOS.BACK_TO_PHOTOS),
    _ = !!g,
    w = _ && !!((null == a ? void 0 : a.length) && a.length > 1)
  return (0, o.jsxs)(
    ce.Vq,
    Object.assign(
      {
        className: B("full-modal", "photo-viewer-modal", {
          "photo-selected": _
        }),
        onClose: t
      },
      {
        children: [
          (0, o.jsx)(
            "header",
            Object.assign(
              {
                className: B("modal-header", {
                  "show-nav": w
                })
              },
              {
                children: (0, o.jsx)(yi, {
                  selected: g,
                  selectedIndex: v,
                  numPhotos: (null == a ? void 0 : a.length) || 0,
                  isNavKeyDisabled: h,
                  onNavigate: function (e) {
                    !(function (e) {
                      if (null == a ? void 0 : a.length) {
                        const { sid: t } = a[e]
                        b(t)
                      }
                    })(e)
                  },
                  onClose: function () {
                    ;(null == g ? void 0 : g.sid) && E(), t()
                  },
                  onDelete: async function () {
                    if ((null == a ? void 0 : a.length) && g) {
                      const e = v === a.length - 1,
                        t = g.sid
                      await s.issueCommand(new DeleteSnapshotCommand(t)), d(t)
                      const n = e ? v - 1 : v + 1,
                        { sid: i } = a[n]
                      b(i)
                    }
                  }
                })
              }
            )
          ),
          (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: "modal-body photos-container"
              },
              {
                children: [
                  (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: B("photo-grid", {
                          empty: !(null == a ? void 0 : a.length),
                          loading: l
                        })
                      },
                      {
                        children: [
                          l
                            ? (0, o.jsx)("h2", {
                                children: O
                              })
                            : a
                              ? a.map((e, t) =>
                                  (0, o.jsx)(
                                    bi,
                                    {
                                      photo: e
                                    },
                                    e.sid
                                  )
                                )
                              : (0, o.jsx)("h2", {
                                  children: S
                                }),
                          g &&
                            (0, o.jsx)(ce.zx, {
                              className: "photo-back-btn",
                              icon: "back",
                              iconSize: ce.Jh.SMALL,
                              label: T,
                              variant: ce.Wu.FAB,
                              theme: "overlay",
                              onClick: E
                            })
                        ]
                      }
                    )
                  ),
                  g &&
                    (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "modal-body photo-container"
                        },
                        {
                          children: (0, o.jsx)("img", {
                            className: "photo-img",
                            src: null == g ? void 0 : g.displayUrl,
                            onLoad: y
                          })
                        }
                      )
                    ),
                  (l || m) &&
                    (0, o.jsx)("div", {
                      className: B("loader-container")
                    })
                ]
              }
            )
          ),
          g &&
            (0, o.jsx)(Oi, {
              photo: g,
              isUpdating: m,
              updateName: async function (e, t) {
                f(!0),
                  await s.issueCommand(new RenameSnapshotCommand(e, t)),
                  u(e, {
                    name: t
                  })
              },
              onFocus: function () {
                p(!0)
              },
              onBlur: function () {
                p(!1)
              }
            })
        ]
      }
    )
  )
}
var wi = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}
const { PHOTOS: Ai } = PhraseKey.WORKSHOP
const Ni = new DebugInfo("workshop-ui")
@l.Z
class Ii extends i.Component {
  constructor(e, t) {
    super(e, t),
      (this.bindings = []),
      (this.isUnmounting = !1),
      (this.updateTools = () => {
        const { mainDiv: e, toolsData: t } = this.context,
          { toolsLoaded: n } = this.state
        t.toolsMap.length > 0 &&
          !n &&
          (this.setState({
            toolsLoaded: !0
          }),
          e.classList.add("with-toolbar"),
          this.context.commandBinder.issueCommand(new OpenInitialToolCommand()))
      }),
      (this.updatePerSettings = () => {
        this.setState({
          notesEnabled: this.context.settings.tryGetProperty(FeaturesNotesModeKey, !1)
        })
      }),
      (this.updateTourMode = () => {
        this.toursViewData &&
          this.setState({
            tourMode: this.toursViewData.currentTourMode
          })
      }),
      (this.updateTourState = () => {
        this.tourData &&
          this.setState({
            tourState: this.tourData.getCurrentTourState()
          })
      }),
      (this.updateToolPanelLayout = () => {
        const { toolsData: e } = this.context,
          t = e.toolPanelLayout
        this.setState({
          toolPanelLayout: t
        })
      }),
      (this.updateActiveTool = () => {
        const { tourState: e } = this.state,
          { toolsData: t, commandBinder: n } = this.context,
          i = t.activeToolName
        i === ToolsList.SETTINGS_PANEL && e.tourPlaying && n.issueCommand(new TourStopCommand(), !1),
          this.setState({
            activeToolName: i
          })
      }),
      (this.getModeChange = e => ({
        viewmode: (0, GetModeChangCommand)(e.toMode)
      })),
      (this.onSnapshotError = () => {
        const e = {
          messagePhraseKey: Ai.SNAPSHOT_ERROR_TOAST_MESSAGE,
          timeout: 0,
          ctaPhraseKey: Ai.SNAPSHOT_ERROR_TOAST_CTA,
          multiline: !0,
          dismissesOnAction: !0,
          actionHandler: () => {}
        }
        this.context.commandBinder.issueCommand(new ShowToastrCommand(e))
      }),
      (this.openModalChanged = () => {
        const { toolsData: e } = this.context,
          t = e.openModal
        this.setState({
          openModal: t,
          modalHidden: !1
        })
      }),
      (this.toggleTransitionEditor = (e, t) => {
        if (t) {
          if (this.state.openModal !== v.P.HIGHLIGHT_EDITOR) return
          this.setState({
            modalHidden: !e
          })
        } else this.context.commandBinder.issueCommand(new ToggleModalCommand(v.P.HIGHLIGHT_EDITOR, e))
      }),
      (this.closeModal = () => {
        this.context.commandBinder.issueCommand(new CloseModalCommand())
      }),
      (this.state = {
        toolsLoaded: !1,
        activeToolName: null,
        openModal: null,
        modalHidden: !1,
        toolPanelLayout: t.toolsData.toolPanelLayout,
        unaligned: !0,
        viewmode: ViewModeInsideCommand,
        tourState: {},
        tourMode: TourMode.NONE,
        notesEnabled: !1
      })
  }
  async componentDidMount() {
    const { messageBus: e, market: t, toolsData: n, settings: i } = this.context
    try {
      const [s, r, a, o, l] = await Promise.all([
        t.waitForData(TourData),
        t.waitForData(ToursViewData),
        t.waitForData(ViewmodeData),
        t.waitForData(SnapshotsData),
        t.waitForData(SweepsData)
      ])
      if (this.isUnmounting) return
      ;(this.tourData = s),
        (this.toursViewData = r),
        (this.sweepData = l),
        (this.viewmodeData = a),
        this.props.onAppReadyChanged(!0, !0),
        this.setState({
          viewmode: (0, GetModeChangCommand)(a.currentMode || ViewModes.Panorama)
        }),
        this.bindings.push(
          i.onPropertyChanged(FeaturesNotesModeKey, this.updatePerSettings),
          e.subscribe(EndSwitchViewmodeMessage, e => this.setState(Object.assign(Object.assign({}, this.getModeChange(e)), this.getUnalignedSweepState()))),
          e.subscribe(TourStoppedMessage, this.updateTourState),
          e.subscribe(TourStartedMessage, this.updateTourState),
          e.subscribe(TourSteppedMessage, this.updateTourState),
          e.subscribe(TourEndedMessage, this.updateTourState),
          e.subscribe(ReelIndexMessage, this.updateTourState),
          e.subscribe(SnapshotErrorMessage, this.onSnapshotError),
          n.toolsMap.onChanged(this.updateTools),
          n.onPropertyChanged("activeToolName", this.updateActiveTool),
          n.onPropertyChanged("openModal", this.openModalChanged),
          n.onPropertyChanged("toolPanelLayout", this.updateToolPanelLayout),
          s.getReel().onChanged(this.updateTourState),
          r.onPropertyChanged("currentTourMode", this.updateTourMode),
          o.onChanged(this.updateTourState),
          l.makeSweepChangeSubscription(() => this.setState(this.getUnalignedSweepState()))
        ),
        this.updatePerSettings(),
        this.updateActiveTool(),
        this.updateTools(),
        this.updateToolPanelLayout(),
        this.updateTourState(),
        this.updateTourMode(),
        this.updateFocusHash(),
        this.setState(this.getUnalignedSweepState())
    } catch (e) {
      Ni.debug(e)
    }
  }
  componentDidUpdate(e, t) {
    this.state.activeToolName !== t.activeToolName && this.updateFocusHash()
  }
  componentWillUnmount() {
    this.isUnmounting = !0
    try {
      for (const e of this.bindings) e.cancel()
    } catch (e) {}
    ;(this.bindings = []), replaceUrlWithHash()
  }
  updateFocusHash() {
    const { activeToolName: e } = this.state
    let t = "edit"
    e && (t = `${e.toLowerCase()}-tool`), replaceUrlWithHash(t)
  }
  renderToolPanelBar() {
    var e
    const { toolsData: t } = this.context,
      { activeToolName: n } = this.state
    if (!n) return null
    const i = t.getTool(n)
    if (!i || !i.panelBar) return null
    const s = (null === (e = i.ui) || void 0 === e ? void 0 : e.renderBar) ? i.ui.renderBar() : null
    return (0, o.jsx)(
      D,
      Object.assign(
        {
          tool: i
        },
        {
          children: s
        }
      )
    )
  }
  renderToolModal() {
    const { activeToolName: e, tourState: t, openModal: n, modalHidden: i } = this.state
    if (0 === Object.keys(t).length) return null
    const { toolsData: s } = this.context,
      r = s.toolsMap,
      { highlights: a, currentStep: l, totalSteps: c } = t,
      d = -1 !== l ? a[l] : null,
      h = l > 0 ? a[l - 1] : null,
      p = e === ToolsList.HLR && n === v.P.HIGHLIGHT_EDITOR,
      m = e === ToolsList.HLR && n === v.P.TOUR_SETTINGS,
      f = e === ToolsList.HLR && n === v.P.ADD_FROM_PHOTOS,
      g = e === ToolsList.PHOTOS && n === v.P.PHOTO_VIEWER,
      y = n === v.P.RATING_THANK_YOU,
      b = p || m || f || g || y,
      E = r.get(ToolsList.HLR),
      S = this.tourData.getActiveReelTourMode()
    return (0, o.jsxs)(
      qn,
      Object.assign(
        {
          open: b,
          hidden: i,
          onCloseModal: this.closeModal
        },
        {
          children: [
            p &&
              !!d &&
              (0, o.jsx)(
                ii,
                {
                  highlight: d,
                  previousHighlight: h,
                  currentStep: l,
                  totalSteps: c,
                  manager: E.manager,
                  activeReelMode: S,
                  onToggle: this.toggleTransitionEditor
                },
                v.P.HIGHLIGHT_EDITOR
              ),
            m &&
              (0, o.jsx)(
                At,
                {
                  totalSteps: c,
                  manager: E.manager,
                  onClose: this.closeModal
                },
                v.P.TOUR_SETTINGS
              ),
            f &&
              (0, o.jsx)(
                sn,
                {
                  manager: E.manager,
                  onClose: this.closeModal
                },
                v.P.ADD_FROM_PHOTOS
              ),
            g &&
              (0, o.jsx)(
                _i,
                {
                  onClose: this.closeModal
                },
                v.P.PHOTO_VIEWER
              ),
            y && (0, o.jsx)(M.B, {}, v.P.RATING_THANK_YOU)
          ]
        }
      )
    )
  }
  renderToolOverlay() {
    var e
    const { toolsData: t } = this.context,
      { activeToolName: n } = this.state,
      i = t.toolsMap,
      s = n && (null === (e = i.get(n)) || void 0 === e ? void 0 : e.ui),
      r = (null == s ? void 0 : s.renderOverlay) ? s.renderOverlay() : null
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "tool-overlay"
        },
        {
          children: [r, (0, o.jsx)(p.r, {})]
        }
      )
    )
  }
  render() {
    const {
        toolsLoaded: e,
        activeToolName: t,
        viewmode: n,
        openModal: i,
        tourState: s,
        unaligned: r,
        toolPanelLayout: a,
        tourMode: l,
        notesEnabled: c
      } = this.state,
      { engine: d, toolsData: h } = this.context,
      { activeStep: p, currentStep: f, highlights: g, tourPlaying: v } = s,
      y = h.getTool(ToolsList.HLR),
      b = h.getTool(ToolsList.VIEW_360),
      E = t === ToolsList.SETTINGS_PANEL,
      O = a === ToolPanelLayout.NARROW || a === ToolPanelLayout.BOTTOM_PANEL,
      T = l === TourMode.STORIES,
      _ = this.renderToolPanelBar()

    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "edit-ui"
        },
        {
          children: [
            (0, o.jsx)(
              U.R,
              Object.assign(
                {
                  className: "workshop-ui-overlay"
                },
                {
                  children:
                    !E &&
                    (0, o.jsxs)(o.Fragment, {
                      children: [
                        !O && _,
                        (0, o.jsx)(st, {
                          tourPlaying: v,
                          unaligned: r,
                          viewmode: n
                        }),
                        (0, o.jsx)(F.y, {}),
                        e && this.renderToolOverlay(),
                        y &&
                          (0, o.jsx)(et, {
                            tourState: s,
                            viewmode: n,
                            unaligned: r
                          }),
                        T &&
                          (0, o.jsx)(m.G, {
                            currentStep: f,
                            activeStep: p,
                            highlights: g
                          }),
                        e &&
                          (0, o.jsx)(Kt, {
                            activeTool: t,
                            tools: h.toolsMap,
                            openModal: i,
                            notesEnabled: c
                          })
                      ]
                    })
                }
              )
            ),
            O && _,
            e &&
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "ws-tool-ui"
                  },
                  {
                    children: (0, o.jsx)(Yn, {})
                  }
                )
              ),
            t === ToolsList.VIEW_360 &&
              b &&
              b.manager &&
              (0, o.jsx)(en, {
                manager: b.manager,
                toolPanelLayout: a
              }),
            this.renderToolModal(),
            (0, o.jsx)(j.s, {
              commandBinder: d.commandBinder
            }),
            (0, o.jsx)(Vn, {}),
            (0, o.jsx)(li, {})
          ]
        }
      )
    )
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
}
Ii.contextType = AppReactContext
const Pi = Ii
const { LAYERS: rs } = PhraseKey.WORKSHOP
function as({ item: e, action: t, parentMenu: n }) {
  const { analytics: s, commandBinder: r } = (0, i.useContext)(AppReactContext),
    a = (0, L.b)(),
    l = e.supportsLayeredCopyMove(),
    d = (0, Wi.e)()
  if (!l) return null
  const u = "copy" === t ? a.t(rs.COPY_LAYER_ITEM) : a.t(rs.MOVE_LAYER_ITEM)
  return (0, o.jsx)(ss.u, {
    label: u,
    onClick: i => {
      n.current && n.current.closeMenu(),
        "copy" === t
          ? (r.issueCommand(new LayerItemsCopyCommand(i, [e])),
            s.trackGuiEvent("layers_copy_item_to", {
              tool: d
            }))
          : (r.issueCommand(new LayerItemsMoveCommand(i, [e])),
            s.trackGuiEvent("layers_move_item_to", {
              tool: d
            }))
    }
  })
}
const { MEASUREMENTS: cs } = PhraseKey.WORKSHOP,
  ds = ({ item: e }) => {
    const t = (0, i.useRef)(null),
      [n, s] = (0, i.useState)(!1),
      { commandBinder: r, analytics: a } = (0, i.useContext)(AppReactContext),
      l = (0, Ki.l)(e.id),
      d = (0, qi.A)(),
      u = (0, Yi.m)(),
      h = (function () {
        const e = (0, os.J)()
        return !!(null == e ? void 0 : e.isEditingOrCreating())
      })(),
      p = (0, L.b)(),
      m = (0, q.y)(DataLayersFeatureKey, !1),
      f = (0, Wi.e)()
    if (!l) return null
    const { id: g, textParser: v, label: y, title: b, description: E, icon: S } = e,
      O = g === u,
      T = p.t(cs.RENAME_LIST_ITEM_OPTION_CTA),
      _ = p.t(cs.DELETE_LIST_ITEM_OPTION_CTA),
      w =
        h && O
          ? void 0
          : (0, o.jsxs)(ce.hE, {
              children: [
                (0, o.jsx)(es.q, {
                  item: e,
                  onToggle: e => {
                    a.trackGuiEvent("drawer_measurement_visibility_modified", {
                      tool: f
                    }),
                      r.issueCommand(new MeasurementsSetVisibilityCommand(e, g))
                  }
                }),
                (0, o.jsxs)(
                  ce.xz,
                  Object.assign(
                    {
                      ref: t,
                      icon: "more-vert",
                      ariaLabel: p.t(PhraseKey.MORE_OPTIONS),
                      variant: ce.Wu.TERTIARY,
                      menuArrow: !0,
                      menuClassName: "search-result-menu"
                    },
                    {
                      children: [
                        (0, o.jsx)(ce.zx, {
                          label: T,
                          size: ce.qE.SMALL,
                          variant: ce.Wu.TERTIARY,
                          onClick: () => {
                            s(!0)
                          }
                        }),
                        m &&
                          (0, o.jsx)(as, {
                            item: e,
                            parentMenu: t,
                            action: "copy"
                          }),
                        m &&
                          (0, o.jsx)(as, {
                            item: e,
                            parentMenu: t,
                            action: "move"
                          }),
                        (0, o.jsx)(ce.zx, {
                          className: "menu-delete-btn",
                          label: _,
                          size: ce.qE.SMALL,
                          variant: ce.Wu.TERTIARY,
                          onClick: () => {
                            l &&
                              (a.trackGuiEvent("measurements_delete", {
                                tool: f
                              }),
                              r.issueCommand(new MeasurementListDeletionCommand(g)))
                          }
                        })
                      ]
                    }
                  )
                )
              ]
            }),
      A = l.info.type === zi.T.FloorplanOnly ? "floorplan" : "dollhouse",
      N = d ? (0, Zi.vr)(b, d) : b,
      I = d ? (0, Zi.vr)(E, d) : E,
      P = p.t(cs.LIST_ITEM_INPUT_PLACEHOLDER),
      x = (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "item-details"
          },
          {
            children: [
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "item-header"
                  },
                  {
                    children: n
                      ? (0, o.jsx)(is.Z, {
                          isDisabled: !1,
                          editing: !0,
                          className: "inline-text-input",
                          text: y,
                          closeOnFocusOut: !0,
                          placeholder: P,
                          defaultText: y,
                          onEdited: e => {
                            n && (r.issueCommand(new RenameMeasurementCommand(g, e)), s(!1))
                          },
                          maxLength: $i.Nz,
                          showUnderline: !0,
                          readOnlyMode: !1,
                          propagateMouseEvent: !1,
                          onCancelEditing: () => {
                            s(!1)
                          }
                        })
                      : (0, o.jsxs)(o.Fragment, {
                          children: [
                            (0, o.jsx)(ns.S, {
                              text: N || "",
                              textParser: v,
                              markers: Zi.PP
                            }),
                            (0, o.jsx)(
                              "div",
                              Object.assign(
                                {
                                  className: "list-item-decal"
                                },
                                {
                                  children: (0, o.jsx)(ce.JO, {
                                    name: A
                                  })
                                }
                              )
                            )
                          ]
                        })
                  }
                )
              ),
              E &&
                !n &&
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "item-description"
                    },
                    {
                      children: (0, o.jsx)(ns.S, {
                        text: I,
                        textParser: v,
                        markers: Zi.PP
                      })
                    }
                  )
                )
            ]
          }
        )
      )

    return (0, o.jsx)(
      ls.F,
      {
        item: e,
        active: O,
        title: x,
        actions: w,
        badge: (0, o.jsx)(ts.C, {
          iconClass: S
        })
      },
      g
    )
  }
const hs = new DebugInfo("MeasurementsManager")
class ps extends Hi.S {
  async init() {
    await super.init(), this.setSearchItemFC(!0)
  }
  async dispose() {
    await this.initPromise, this.setSearchItemFC(!1)
  }
  async activate() {
    this.settingsToggler.toggle(!0), await this.initPromise, await this.engine.commandBinder.issueCommandWhenBound(new MeasureModeToggleCommand(!0, !0))
  }
  async deactivate() {
    this.settingsToggler.toggle(!1),
      this.engine.commandBinder.issueCommand(new MeasurementSelectCommand(-1)),
      await this.engine.commandBinder.issueCommand(new MeasureModeToggleCommand(!1))
  }
  setSearchItemFC(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.MEASUREMENTPATH)
    t ? (t.itemFC = e ? ds : us.V) : hs.debug("No measurements search group")
  }
  async hasPendingEdits() {
    switch (this.measurementModeData.phase) {
      case MeasurePhase.CLOSED:
      case MeasurePhase.IDLE:
        return !1
      default:
        return !0
    }
  }
}

const { NOTES: Os } = PhraseKey.SHOWCASE,
  Ts = ({ item: e }) => {
    const t = (0, i.useRef)(null),
      { commandBinder: n, analytics: s, editMode: r } = (0, i.useContext)(AppReactContext),
      a = (0, L.b)(),
      l = (0, oe.Y)(),
      d = (0, z.B)(),
      u = (0, bs.M)(),
      h = (0, qi.A)(),
      p = (0, fs.v)(),
      m = (0, q.y)(DataLayersFeatureKey, !1),
      f = (0, Wi.e)()
    if (!p) return null
    const { id: g, title: v, description: y, user: b, numAttachments: E, numComments: S } = e,
      O = g,
      T = e.parentId
    if (!T || !O) return null
    const _ = T === (null == u ? void 0 : u.id),
      w = (0, vs.CM)(p, AnnotationType.NOTE, b),
      A = (0, vs.Kd)(p, AnnotationType.NOTE, b),
      N = m && (0, vs.aP)(p, b),
      I = a.t(Os.EDIT_LIST_ITEM_OPTION_CTA),
      P = a.t(Os.DELETE_LIST_ITEM_OPTION_CTA),
      x =
        w || A
          ? (0, o.jsx)(ce.hE, {
              children: (0, o.jsxs)(
                ce.xz,
                Object.assign(
                  {
                    ref: t,
                    icon: "more-vert",
                    ariaLabel: a.t(PhraseKey.MORE_OPTIONS),
                    variant: ce.Wu.TERTIARY,
                    menuArrow: !0,
                    menuClassName: "search-result-menu"
                  },
                  {
                    children: [
                      (0, o.jsx)(ce.zx, {
                        label: I,
                        size: ce.qE.SMALL,
                        disabled: !w,
                        variant: ce.Wu.TERTIARY,
                        onClick: () => {
                          s.trackGuiEvent("notes_list_edit_note", {
                            tool: f
                          }),
                            n.issueCommand(new NotesOpenNoteComment(T, !0, !0, O))
                        }
                      }),
                      N &&
                        (0, o.jsx)(as, {
                          item: e,
                          parentMenu: t,
                          action: "copy"
                        }),
                      N &&
                        (0, o.jsx)(as, {
                          item: e,
                          parentMenu: t,
                          action: "move"
                        }),
                      (0, o.jsx)(ce.zx, {
                        className: "menu-delete-btn",
                        label: P,
                        size: ce.qE.SMALL,
                        disabled: !A,
                        variant: ce.Wu.TERTIARY,
                        onClick: () => {
                          s.trackGuiEvent("notes_list_delete_note", {
                            tool: f
                          }),
                            n.issueCommand(new NoteDeleteCommand(T))
                        }
                      })
                    ]
                  }
                )
              )
            })
          : void 0,
      k = (0, o.jsx)(Es.j, {
        description: y,
        userName: v,
        numAttachments: E,
        numComments: S,
        searchText: h
      }),
      C = (0, o.jsx)(Ss.A, {
        item: e
      })
    return (0, o.jsx)(
      ls.F,
      {
        item: e,
        className: "notes-list-item",
        title: k,
        active: _,
        actions: x,
        badge: C,
        onSelect: async () => {
          s.trackGuiEvent("notes_list_open_note", {
            tool: f
          }),
            e.onSelect(r, d, l)
        }
      },
      g
    )
  },
  _s = ({ item: e }) =>
    e
      ? (0, o.jsx)(
          Ts,
          {
            item: e
          },
          e.id
        )
      : null
class ws extends NoteToolManager {
  setSearchItemFC(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.NOTE)
    t && (t.itemFC = e ? Ts : void 0)
  }
}
const { MATTERTAGS: xs, MODAL: ks } = PhraseKey.WORKSHOP
function Ds(e) {
  return e ? e.getTextParser() : null
}
const { MATTERTAGS: Rs } = PhraseKey.WORKSHOP
function Ms({ label: e, description: t, searchText: n }) {
  const s = (function () {
      const e = (0, Cs.w)(),
        [t, n] = (0, i.useState)(Ds(e))
      return (0, i.useEffect)(() => (t || n(Ds(e)), () => {}), [e]), t
    })(),
    r = (0, L.b)(),
    a = (n ? (0, Zi.vr)(e, n) : e).trim(),
    l = (n ? (0, Zi.vr)(t, n) : t).trim(),
    c = a || l || r.t(Rs.DEFAULT_TAG_TITLE),
    d = a ? l : ""
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "item-details"
      },
      {
        children: [
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "item-header"
              },
              {
                children:
                  s &&
                  (0, o.jsx)(ns.S, {
                    text: c,
                    textParser: s,
                    markers: Zi.PP
                  })
              }
            )
          ),
          d &&
            s &&
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "item-description"
                },
                {
                  children: (0, o.jsx)(ns.S, {
                    text: d,
                    textParser: s,
                    markers: Zi.PP,
                    linksActive: !1
                  })
                }
              )
            )
        ]
      }
    )
  )
}
function Hs({ color: e, icon: t }) {
  const n = (0, q.y)(FeaturesTagIconsKey, !1),
    i = {
      background: e,
      borderColor: e
    }
  return (0, o.jsx)(ts.C, {
    badgeStyle: i,
    iconClass: `icon-${getIconKey(PinType.MATTERTAG, t, n)}`
  })
}
const { MATTERTAGS: Bs } = PhraseKey.WORKSHOP,
  Vs = ({ item: e }) => {
    const t = (0, i.useRef)(null),
      n = (0, qi.A)(),
      s = (0, $.Q)(ToolsList.TAGS),
      r = (0, Wi.e)(),
      { analytics: a, commandBinder: l } = (0, i.useContext)(AppReactContext),
      d = (0, oe.Y)(),
      h = (0, Ls.P)(),
      p = (0, L.b)(),
      m = (0, q.y)(DataLayersFeatureKey, !1),
      f = e.tag
    if (!f || !s) return null
    const { id: g, label: v, description: y, color: b, icon: E } = f,
      S = s ? s.manager : void 0,
      O = (null == h ? void 0 : h.id) === e.id,
      T = (0, o.jsx)(Ms, {
        label: v,
        description: y,
        searchText: n
      }),
      _ = p.t(Bs.EDIT_LIST_ITEM_OPTION_CTA),
      w = p.t(Bs.DELETE_LIST_ITEM_OPTION_CTA),
      A = (0, o.jsxs)(ce.hE, {
        children: [
          (0, o.jsx)(es.q, {
            item: e,
            onToggle: e => {
              a.trackGuiEvent(e ? "tags_list_show_tag" : "tags_list_hide_tag", {
                tool: r
              }),
                l.issueCommand(new TagVisibilityToggleCommand(g, e))
            }
          }),
          (0, o.jsxs)(
            ce.xz,
            Object.assign(
              {
                ref: t,
                icon: "more-vert",
                ariaLabel: p.t(PhraseKey.MORE_OPTIONS),
                variant: ce.Wu.TERTIARY,
                menuArrow: !0,
                menuClassName: "search-result-menu"
              },
              {
                children: [
                  (0, o.jsx)(ce.zx, {
                    label: _,
                    size: ce.qE.SMALL,
                    variant: ce.Wu.TERTIARY,
                    onClick: () => {
                      a.trackGuiEvent("tags_list_edit_tag", {
                        tool: r
                      }),
                        l.issueCommand(new TagEditCommand(g))
                    }
                  }),
                  m &&
                    (0, o.jsx)(as, {
                      item: e,
                      parentMenu: t,
                      action: "copy"
                    }),
                  m &&
                    (0, o.jsx)(as, {
                      item: e,
                      parentMenu: t,
                      action: "move"
                    }),
                  (0, o.jsx)(ce.zx, {
                    className: "menu-delete-btn",
                    label: w,
                    size: ce.qE.SMALL,
                    variant: ce.Wu.TERTIARY,
                    onClick: () => {
                      a.trackGuiEvent("tags_list_delete_tag", {
                        tool: r
                      }),
                        S && S.confirmAndDeleteTag(g, "tags_list_item_options_menu")
                    }
                  })
                ]
              }
            )
          )
        ]
      })

    return (0, o.jsx)(
      ls.F,
      {
        item: e,
        title: T,
        active: O,
        actions: A,
        badge: (0, o.jsx)(Hs, {
          color: b,
          icon: E
        }),
        onSelect: () => {
          a.trackGuiEvent("tags_list_select_tag", {
            tool: r
          })
          const e = d ? TransitionTypeList.Instant : TransitionTypeList.FadeToBlack,
            t = d
          l.issueCommand(
            new TagOpenCommand(g, {
              transition: e,
              dock: t
            })
          )
        }
      },
      g
    )
  }
class Gs extends TagToolManger {
  constructor(e, t) {
    super(e, t),
      (this.textParser = new TextParser({
        links: !0
      })),
      (this.disabledEditorAssets = {
        [FeaturesSweepPucksKey]: !1,
        [FeaturesLabelsKey]: !1,
        [Features360ViewsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.settingsToggler = new SettingsToggler(t, this.disabledEditorAssets)),
      (this.initPromise = this.init())
  }
  async init() {
    const { market: e } = this.engine,
      [t, n, i] = await Promise.all([e.waitForData(TagsViewData), e.waitForData(AttachmentsData), e.waitForData(SearchData)])
    ;(this.dataMap = {
      tagsViewData: t,
      attachmentsData: n
    }),
      (this.searchData = i),
      this.setSearchItemFC(Vs)
  }
  async activate() {
    const e = this.engine
    this.settingsToggler.toggle(!0), await this.initPromise, await e.commandBinder.issueCommand(new TagsToggleCommand(!0))
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommand(new TagsToggleCommand(!1)), this.settingsToggler.toggle(!1)
  }
  async dispose() {
    await this.initPromise, this.setSearchItemFC()
  }
  setSearchItemFC(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.MATTERTAG)
    t && (t.itemFC = e)
  }
  async hasPendingEdits() {
    const { openTagIsDirty: e, creatingTag: t } = this.dataMap.tagsViewData
    return e || t
  }
  setDirtyTagState(e) {
    return this.engine.commandBinder.issueCommand(new TagDirtyToggleCommand(e))
  }
  getAvailableKeywords() {
    var e, t
    return null === (t = null === (e = this.dataMap) || void 0 === e ? void 0 : e.tagsViewData) || void 0 === t ? void 0 : t.getAvailableKeywords()
  }
  async confirmAndDeleteTag(e, t) {
    const n = ((e = 1) => ({
      title: xs.DELETE_TAGS_MODAL_TITLE,
      titleLocalizationOptions: e,
      message: xs.DELETE_TAGS_MODAL_MESSAGE,
      messageLocalizationOptions: e,
      cancellable: !0,
      cancelPhraseKey: ks.NO,
      confirmPhraseKey: ks.YES
    }))()
    if ((await this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, n))) !== ConfirmBtnSelect.CLOSE)
      return this.deleteTag(e, t)
  }
  deleteTag(e, t) {
    return this.engine.commandBinder.issueCommand(new TagDeleteCommand(e, t))
  }
}
enum Ws {
  BUSY = 1,
  HIDDEN_SWEEP = 3,
  OK = 0,
  UNPLACED_360 = 2
}
const ir = new DebugInfo("StartLocationManager")
class sr {
  constructor(e, t, n) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.tagsViewData = n),
      (this.onThumbnailUpdateCallbacks = new Set()),
      (this.initialized = !1),
      (this.bindings = []),
      (this.toolStateObservable = createObservableValue(Ws.OK)),
      (this.disabledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [Features360ViewsKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesLabelsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.unlockNavigation = () => {
        this.engine.commandBinder.issueCommand(new UnlockViewmodeCommand()), this.engine.commandBinder.issueCommand(new UnlockNavigationCommand())
      }),
      (this.updateStartLocationToolState = () => {
        this.toolStateObservable.value !== Ws.BUSY &&
          (this.inHiddenSweep()
            ? (this.toolStateObservable.value = Ws.HIDDEN_SWEEP)
            : this.inInvalid360()
              ? (this.toolStateObservable.value = Ws.UNPLACED_360)
              : (this.toolStateObservable.value = Ws.OK))
      }),
      (this.resizeCanvas = async e => {
        this.engine.commandBinder.issueCommand(new ResizeCanvasCommand(e))
      }),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets))
  }
  async activate() {
    if (this.initialized) for (const e of this.bindings) e.renew()
    else {
      this.initialized = !0
      const e = this.engine,
        [t, n, i, s] = await Promise.all([
          e.market.waitForData(SweepsData),
          e.market.waitForData(ViewmodeData),
          e.market.waitForData(CamStartData),
          e.market.waitForData(StartLocationViewData)
        ])
      ;(this.sweepData = t),
        (this.viewmodeData = n),
        (this.cameraStartData = i),
        this.bindings.push(
          n.makeModeChangeSubscription(this.updateStartLocationToolState),
          t.makeSweepChangeSubscription(this.updateStartLocationToolState),
          s.onStartLocationSweepsChanged(this.updateStartLocationToolState)
        )
    }
    this.updateStartLocationToolState(), this.settingsToggler.toggle(!0), this.resizeCanvas(createAspectRatioBasedResizeDimensions(PanoSizeAspect))
  }
  async deactivate() {
    this.settingsToggler.toggle(!1), this.resizeCanvas(createSimpleResizeDimensions($s.O8))
    for (const e of this.bindings) e.cancel()
  }
  gotoStartLocation() {
    this.engine.commandBinder.issueCommand(new StartLocationFlyInCommand(this.cameraStartData.pose))
  }
  onThumbnailUpdate(e) {
    return createSubscription(
      () => this.onThumbnailUpdateCallbacks.add(e),
      () => this.onThumbnailUpdateCallbacks.delete(e),
      !0
    )
  }
  get startLocationToolState() {
    return this.toolStateObservable.value
  }
  onStartLocToolStateChanged(e) {
    return this.toolStateObservable.onChanged(e)
  }
  async updateStartLocation(e) {
    const { tagsViewData: t } = this
    if (-1 === this.viewmodeData.currentMode) throw Error("Cannot set start location in transition mode")
    if (t.getTagCount() > 0) {
      if (
        await this.engine.commandBinder.issueCommand(
          new ConfirmModalCommand(ConfirmModalState.DISPLAY, {
            title: PhraseKey.WORKSHOP.START_LOCATION.TAG_ORDER_RESET_TITLE,
            message: e,
            confirmPhraseKey: PhraseKey.WORKSHOP.START_LOCATION.TAG_ORDER_RESET_CONFIRM,
            cancelPhraseKey: PhraseKey.WORKSHOP.START_LOCATION.TAG_ORDER_RESET_CANCEL
          })
        )
      )
        return
    }
    this.toolStateObservable.value = Ws.BUSY
    const n = () => {
      this.unlockNavigation()
      this.toolStateObservable.atomic(() => {
        this.toolStateObservable.value = Ws.OK
        this.updateStartLocationToolState()
      })
    }
    this.viewmodeData.isMesh() && (await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE)))
    this.engine.commandBinder.issueCommand(new LockNavigationCommand())
    this.engine.commandBinder.issueCommand(new LockViewmodeCommand())
    try {
      const e = await this.engine.commandBinder.issueCommand(
        new CaptureSnapshotCommand({
          waitForUpload: !0,
          maxSize: PanoSizeKey.HIGH
        })
      )
      e ? await this.engine.commandBinder.issueCommand(new SetCameraStartCommand(e)) : ir.error("Failed to upload thumbnail, cannot set start location")
    } catch (e) {
      throw (n(), e)
    }
    n()
  }
  inHiddenSweep() {
    if (!this.viewmodeData.isInside()) return !1
    const e = this.sweepData.currentSweep
    return !!e && !this.sweepData.getSweep(e).enabled
  }
  inInvalid360() {
    if (!this.viewmodeData.isInside()) return !1
    const e = this.sweepData.currentSweep
    if (!e) return !1
    const t = this.sweepData.getSweep(e)
    if (!t) return !1
    const n = t.alignmentType === AlignmentType.UNALIGNED,
      i = t.placementType === PlacementType.UNPLACED
    return n && i
  }
}
const { MODAL: pr } = PhraseKey.WORKSHOP
enum mr {
  SAVING = 0
}
const fr = {
    [mr.SAVING]: pr.SAVING_ERROR_TITLE
  },
  gr = {
    [mr.SAVING]: pr.SAVING_ERROR_MESSAGE
  },
  { SCANS: vr, MODAL: yr } = PhraseKey.WORKSHOP,
  br = {
    modalClass: "full-modal",
    cancellable: !0,
    cancelPhraseKey: yr.CANCEL,
    confirmPhraseKey: yr.OK
  }
function Er(e) {
  const t = (0, L.b)(),
    { index: n } = e,
    i = t.t(vr.REMOVE_SCAN_FROM_HLR_MODAL_MESSAGE, {
      number: n + 1
    })
  return (0, o.jsx)("div", {
    children: (0, o.jsx)("div", {
      dangerouslySetInnerHTML: {
        __html: i
      }
    })
  })
}
const Sr = new DebugInfo("scan-manager")
class Or {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.bindings = []),
      (this.initialized = !1),
      (this.disabledAssets = {
        [Features360ViewsKey]: !1
      }),
      (this.handleViewmodeChange = () => {
        this.dataMap.viewmodeData.isInside() && this.dataMap.sweepViewData.selectCurrentSweep()
      }),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets))
  }
  async activate() {
    const e = this.engine
    if (this.initialized) for (const e of this.bindings) e.renew()
    else {
      this.initialized = !0
      const [t, n, i, s, r, a] = await Promise.all([
        e.market.waitForData(SweepsData),
        e.market.waitForData(SweepsViewData),
        e.market.waitForData(TourData),
        e.market.waitForData(FloorsViewData),
        e.market.waitForData(CameraData),
        e.market.waitForData(ViewmodeData)
      ])
      ;([this.layersData, this.toursViewData, this.startLocationViewData, this.navigation] = await Promise.all([
        e.market.waitForData(LayersData),
        e.market.waitForData(ToursViewData),
        e.market.waitForData(StartLocationViewData),
        e.getModuleBySymbol(NavigationSymbol)
      ])),
        (this.dataMap = {
          viewmodeData: a,
          sweepData: t,
          sweepViewData: n,
          floorsViewData: s,
          cameraData: r,
          tourData: i,
          settingsData: this.settingsData
        }),
        this.bindings.push(this.dataMap.viewmodeData.makeModeChangeSubscription(this.handleViewmodeChange))
    }
    this.settingsToggler.toggle(!0),
      this.dataMap.sweepViewData.selectCurrentSweep(),
      await Promise.all([
        e.commandBinder.issueCommandWhenBound(new ToggleNonPanoCurrentPuckCommand(!0)),
        e.commandBinder.issueCommandWhenBound(new TogglePanoMarkerCommand(!1)),
        e.commandBinder.issueCommandWhenBound(new ToggleSweepNumbersCommand(!0)),
        e.commandBinder.issueCommandWhenBound(new TogglePuckEditingCommand(!0))
      ])
  }
  async deactivate() {
    this.settingsToggler.toggle(!1),
      this.engine.commandBinder.issueCommand(new ToggleNonPanoCurrentPuckCommand(!1)),
      this.engine.commandBinder.issueCommand(new TogglePanoMarkerCommand(!0)),
      this.engine.commandBinder.issueCommand(new ToggleSweepNumbersCommand(!1)),
      this.engine.commandBinder.issueCommand(new TogglePuckEditingCommand(!1))
    for (const e of this.bindings) e.cancel()
  }
  isStartLocation(e) {
    return this.startLocationViewData.isStartLocation(e)
  }
  isStartLocationForCurrentView(e) {
    return this.startLocationViewData.isStartLocationForView(e, this.layersData.currentViewId)
  }
  async toggleSweepVisibility(e, t) {
    var n
    if (!this.isStartLocation(e) && (t || (await this.checkHighlightReelConstraints(e)) !== ConfirmBtnSelect.CLOSE))
      try {
        this.engine.commandBinder.issueCommand(new ToggleSweepCommand(t, e))
        const n = this.dataMap.viewmodeData.currentMode
        ;(n !== ViewModes.Dollhouse && n !== ViewModes.Floorplan) || this.dataMap.sweepViewData.setSelectedSweep(e)
      } catch (e) {
        Sr.error(e),
          this.engine.commandBinder.issueCommand(
            new ConfirmModalCommand(
              ConfirmModalState.DISPLAY,
              ((n = mr.SAVING),
              {
                modalClass: "compact-modal",
                title: fr[n] || pr.ERROR_TITLE,
                message: gr[n],
                cancellable: !1,
                confirmPhraseKey: pr.OK
              })
            )
          )
      }
  }
  isSweepInAnyTour(e) {
    return this.toursViewData.isSweepInAnyTour(e)
  }
  checkHighlightReelConstraints(e) {
    const t = this.toursViewData.isSweepInAnyTour(e)
    if (0 === this.dataMap.tourData.getTourSnapshotsWithSweepId(e).length && !t) return Promise.resolve(ConfirmBtnSelect.CONFIRM)
    const n = this.dataMap.sweepViewData.getViewData(e),
      i =
        ((s = n.dataIndex),
        Object.assign(
          {
            message: (0, o.jsx)(Er, {
              index: s
            }),
            title: vr.REMOVE_SCANS_FROM_HLR_MODAL_TITLE,
            titleLocalizationOptions: 1
          },
          br
        ))
    var s
    return this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, i))
  }
  selectScan(e) {
    const t = this.dataMap.viewmodeData.currentMode
    if (e && this.dataMap.sweepViewData.selectedSweep !== e)
      if (t === ViewModes.Dollhouse || t === ViewModes.Floorplan) {
        this.dataMap.sweepViewData.setSelectedSweep(e)
        const t = this.dataMap.sweepData.getSweep(e)
        ;(!t.isAligned() && t.isUnplaced()) || this.navigation.focus(t.position)
      } else
        this.dataMap.sweepViewData.setSelectedSweep(e),
          this.engine.commandBinder.issueCommand(
            new MoveToSweepCommand({
              sweep: e,
              transition: TransitionTypeList.Interpolate,
              transitionSpeedMultiplier: 1.5
            })
          )
  }
}
const jr = new DebugInfo("placement-360-manager")
class Ur {
  constructor(e) {
    ;(this.engine = e),
      (this.bindings = []),
      (this.initialized = !1),
      (this.originalCameraRotation = new Quaternion()),
      (this.boundsCenter = new Vector3()),
      (this.distanceFromCenter = new Vector3()),
      (this.maxDistanceFromCenter = 0),
      (this.upVector = new Vector3()),
      (this.worldPosition = new Vector3()),
      (this.isToolActive = !1),
      (this.peekabooActive = !1),
      (this.updateSelectedSweep = () => {
        const e = this.dataMap.sweepViewData.selectedSweep
        this.lastSelected && e !== this.lastSelected && this.engine.commandBinder.issueCommand(new PinUnselectCommand(this.lastSelected)),
          (this.lastSelected = e)
      })
  }
  async activate() {
    if (this.initialized) for (const e of this.bindings) e.renew()
    else {
      this.initialized = !0
      const e = this.engine,
        [t, n, i, s, r, a, o, l] = await Promise.all([
          e.market.waitForData(SweepsData),
          e.market.waitForData(SweepsViewData),
          e.market.waitForData(CameraData),
          e.market.waitForData(ViewmodeData),
          e.market.waitForData(FloorsViewData),
          e.market.waitForData(MeshData),
          e.market.waitForData(ContainerData),
          e.market.waitForData(SettingsData)
        ])
      ;(this.cameraData = i),
        (this.peekabooActive = l.tryGetProperty(DollhousePeekabooKey, !1)),
        ([this.layersData, this.startLocationViewData] = await Promise.all([e.market.waitForData(LayersData), e.market.waitForData(StartLocationViewData)])),
        (this.dataMap = {
          sweepData: t,
          sweepViewData: n,
          viewmodeData: s,
          floorsViewData: r,
          cameraData: i,
          containerData: o
        }),
        (this.boundsCenter = a.meshCenter),
        (this.maxDistanceFromCenter = a.maxPlacementRadius),
        this.bindings.push(this.dataMap.sweepViewData.onSelectedSweepChanged(this.updateSelectedSweep))
    }
    ;(this.isToolActive = !0),
      this.dataMap.sweepViewData.setSelectedSweep(null),
      this.dataMap.sweepViewData.setToolState(xr._.IDLE),
      await Promise.all([
        this.engine.commandBinder.issueCommandWhenBound(new ModuleTogglePinEditingCommand(!0)),
        this.engine.commandBinder.issueCommandWhenBound(new TogglePinNumbersCommand(!0)),
        this.engine.commandBinder.issueCommandWhenBound(new TogglePinConnectionsCommand(!0)),
        this.engine.commandBinder.issueCommandWhenBound(new ToggleRotationInteractionsCommand(!0))
      ])
  }
  async deactivate() {
    ;(this.isToolActive = !1),
      this.dataMap.sweepViewData.setToolState(xr._.CLOSED),
      this.dataMap.sweepViewData.setSelectedSweep(null),
      this.engine.commandBinder.issueCommand(new ModuleTogglePinEditingCommand(!1)),
      this.engine.commandBinder.issueCommand(new TogglePinNumbersCommand(!1)),
      this.engine.commandBinder.issueCommand(new TogglePinConnectionsCommand(!1)),
      this.engine.commandBinder.issueCommand(new ToggleRotationInteractionsCommand(!1))
    for (const e of this.bindings) e.cancel()
  }
  getViewing360() {
    const { viewmodeData: e, sweepData: t } = this.dataMap
    return PanoramaOrMesh(e.closestMode) && t.currentSweep && t.isSweepUnaligned(t.currentSweep) ? t.getSweep(t.currentSweep) : null
  }
  async select360(e, t) {
    const { viewmodeData: n, sweepViewData: i, sweepData: s, floorsViewData: r } = this.dataMap
    if (
      (t &&
        n.currentMode !== ViewModes.Floorplan &&
        n.currentMode !== ViewModes.Dollhouse &&
        (await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.FLOORPLAN, TransitionTypeList.FadeToBlack))),
      r.currentFloorId)
    ) {
      const t = s.getSweep(e)
      t && t.placementType !== PlacementType.UNPLACED && this.showFloor(t.floorId)
    }
    i.setSelectedSweep(e)
  }
  rename360(e, t) {
    this.engine.commandBinder.issueCommand(new RenameSweepCommand(e, t))
  }
  highlight360Pin(e, t) {
    if (!this.isToolActive) return
    this.dataMap.sweepViewData.selectedSweep !== e && this.engine.commandBinder.issueCommand(new HighlightPinCommand(e, t))
  }
  isStartLocation(e) {
    return this.startLocationViewData.isStartLocation(e)
  }
  isStartLocationForCurrentView(e) {
    const t = this.layersData.currentViewId
    return this.startLocationViewData.isStartLocationForView(e, t)
  }
  preview360(e) {
    this.engine.commandBinder.issueCommand(
      new MoveToSweepCommand({
        sweep: e,
        transition: TransitionTypeList.FadeToBlack
      })
    )
  }
  startPressingToPlace360(e) {
    const { sweepViewData: t } = this.dataMap
    t.setSelectedSweep(e), t.setToolState(xr._.PRESSING)
  }
  cancelPlacing360() {
    this.dataMap.sweepViewData.setToolState(xr._.IDLE)
  }
  async placing360(e, t, n) {
    const { viewmodeData: i, sweepViewData: s, floorsViewData: r, cameraData: a } = this.dataMap
    if (!i.currentMode) throw Error("Cannot start placing pin when there is no active view mode")
    const o = this.dataMap.sweepViewData.getIndexByAlignment(!1, e)
    if (
      (this.dragStartCallback(n, t, o + 1),
      s.setToolState(xr._.PLACING),
      s.setSelectedSweep(e),
      (this.originalFloorId = r.currentFloorId),
      (this.originalViewmode = i.currentMode),
      i.isInside())
    ) {
      this.originalCameraRotation.copy(a.pose.rotation),
        await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.FLOORPLAN, TransitionTypeList.FadeToBlack))
      const e = this.originalFloorId ? this.originalFloorId : r.bottomFloorId
      this.showFloor(e)
    }
  }
  unplace360(e) {
    this.isStartLocation(e)
      ? jr.warn("Cannot unplace the 360 because it is the start location.")
      : this.engine.commandBinder.issueCommand(new UnplaceSweepCommand(e))
  }
  rotate360(e) {
    this.engine.commandBinder.issueCommand(new InitRotateSweepCommand(e))
  }
  saveRotate360(e) {
    this.engine.commandBinder.issueCommand(new FinRotateSweepCommand(e))
  }
  cancelRotate360(e) {
    this.engine.commandBinder.issueCommand(new EndRotateSweepCommand(e))
  }
  setDragStartCallback(e) {
    this.dragStartCallback = e
  }
  async onDragPin(e, t) {
    const { floorsViewData: n, viewmodeData: i } = this.dataMap
    let s
    if (i.currentMode === ViewModes.Transition) throw new Error("Cannot place pin if not in Dollhouse or Floorplan")
    const r = n.currentFloorId || this.lastIntersectedFloorId || n.bottomFloorId
    let a = n.floors.getFloor(r)
    return (
      (this.currentHeight = a.medianSweepHeight()),
      (this.lastIntersectedFloorId = r),
      this.engine.commandBinder
        .issueCommand(new ScreenToCanvasPointCommand(e))
        .then(
          e => (
            (s = e),
            this.engine.commandBinder.issueCommand(
              new GetFloorIntersectCommand({
                screenPosition: s,
                height: this.currentHeight,
                includeHiddenFloors: !0
              })
            )
          )
        )
        .then(e => {
          const { position: i, floorIndex: r } = e,
            o = this.dataMap.floorsViewData.floors.getFloorAtIndex(r),
            l = o && o.id
          if (!i) return Promise.reject("cannot place pin")
          this.checkBounds(i)
          const c = !(!l || l === this.lastIntersectedFloorId),
            d = !n.currentFloorId && t,
            u = !(!n.currentFloorId || t)
          let h = this.originalViewmode
          if (
            (this.peekabooActive &&
              !PanoramaOrMesh(h) &&
              (h = isPitchFactorOrtho(this.cameraData.pose.pitchFactor()) ? ViewModes.Floorplan : ViewModes.Dollhouse),
            h === ViewModes.Dollhouse && !this.originalFloorId && (c || d || u))
          ) {
            l && (this.lastIntersectedFloorId = l)
            const e = t ? this.lastIntersectedFloorId || n.bottomFloorId : null
            return this.showFloor(e)
              .then(() => {
                const e = l || this.lastIntersectedFloorId || n.bottomFloorId
                return (
                  (a = n.floors.getFloor(e)),
                  (this.currentHeight = a ? a.medianSweepHeight() : 0),
                  this.engine.commandBinder.issueCommand(
                    new GetFloorIntersectCommand({
                      screenPosition: s,
                      height: this.currentHeight
                    })
                  )
                )
              })
              .then(e => {
                e.position &&
                  this.engine.commandBinder.issueCommand(
                    new WorldPositionChangeCommand({
                      worldPosition: this.offsetPinSize(e.position)
                    })
                  )
              })
          }
          if (h === ViewModes.Floorplan && !this.originalFloorId) {
            n.transition.progress.active || l === n.currentFloorId || this.showFloor(l)
          }
          return this.engine.commandBinder.issueCommand(
            new WorldPositionChangeCommand({
              worldPosition: this.offsetPinSize(i)
            })
          )
        })
        .then(e => e.sub(s).length())
        .then(e => {
          if (e > this.dataMap.containerData.size.height / 8) throw new Error("Pin height cannot be too large")
          return e
        })
    )
  }
  async dragEnd(e, t) {
    const { floorsViewData: n, sweepViewData: i } = this.dataMap,
      s = i.selectedSweep
    return (
      n.transition.promise.then(() => {
        this.engine.commandBinder.issueCommand(new MovetoFloorCommand(this.originalFloorId, !1))
      }),
      e && s
        ? this.engine.commandBinder
            .issueCommand(new ScreenToCanvasPointCommand(t))
            .then(e =>
              this.engine.commandBinder.issueCommand(
                new GetFloorIntersectCommand({
                  screenPosition: e,
                  height: this.currentHeight
                })
              )
            )
            .then(e => !!e.position && (this.place360(s, e.position), !0))
            .catch(e => (jr.error(e), this.cancelPlacement(), !1))
            .then(e => this.createPlacementPayload(e))
        : (this.cancelPlacement(), this.createPlacementPayload(!1))
    )
  }
  cancelPlacement() {
    this.dataMap.sweepViewData.setToolState(xr._.IDLE)
  }
  place360(e, t) {
    const { floorsViewData: n, sweepViewData: i } = this.dataMap,
      s = n.currentFloorId || this.lastIntersectedFloorId || n.bottomFloorId || "",
      r = this.offsetPinSize(t)
    this.engine.commandBinder.issueCommand(new PlaceSweepCommand(e, r, s)),
      this.engine.commandBinder.issueCommand(new ToggleSweepCommand(!0, e)),
      i.setToolState(xr._.IDLE)
  }
  createPlacementPayload(e) {
    return {
      success: e,
      sweepId: this.dataMap.sweepViewData.selectedSweep
    }
  }
  async showFloor(e = null) {
    const t = this.dataMap.floorsViewData
    if (t.currentFloorId !== e && !t.transition.progress.active) return this.engine.commandBinder.issueCommand(new MovetoFloorCommand(e, !0))
  }
  offsetPinSize(e) {
    const t = this.dataMap.cameraData
    return (
      this.upVector.copy(DirectionVector.UP).applyQuaternion(t.pose.rotation),
      this.worldPosition.set(e.x, e.y, e.z),
      this.worldPosition.add(this.upVector.normalize().multiplyScalar(0.75)),
      this.worldPosition
    )
  }
  checkBounds(e) {
    if (!e) throw new Error("Cannot place pin with no position")
    if ((this.distanceFromCenter.copy(e).sub(this.boundsCenter).setY(0), this.distanceFromCenter.length() > this.maxDistanceFromCenter))
      throw new Error("Cannot place pin beyond model bounds")
  }
}
const { PHOTOS: Gr, MODAL: Wr } = PhraseKey.WORKSHOP,
  zr = new DebugInfo("photos-manager")

enum $r {
  DISABLED = "disabled",
  ENABLED = "enabled",
  ENABLED_2D_ONLY = "enabled_2d_only",
  SWEEP_HIDDEN = "sweep_hidden"
}
class Kr {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.initialized = !1),
      (this.capturing = !1),
      (this.bindings = []),
      (this.disabledAssets = {
        [featuresMattertagsKey]: !1,
        [FeaturesLabelsKey]: !1,
        [Features360ViewsKey]: !1,
        [FeaturesSweepPucksKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.toggledAssets = {
        [featuresMattertagsKey]: !0,
        [FeaturesLabelsKey]: !0,
        [Features360ViewsKey]: !0
      }),
      (this.toggleAssets = async e => {
        const t = null != e ? e : this.assetObservable.value && this.photo2DModeObservable.value
        this.assetToggler.toggle(t), await this.engine.commandBinder.issueCommand(new MeasureModeToggleCommand(t, !1, !1))
      }),
      (this.resizeCanvas = async e => {
        this.engine.commandBinder.issueCommand(new ResizeCanvasCommand(e))
      }),
      (this.updatePhotoAbility = () => {
        this.captureAvailabilityObservable.value = this.getCaptureAvailabilityState()
      }),
      (this.openPhotoViewer = e => {
        this.engine.commandBinder.issueCommand(new ToggleModalCommand(v.P.PHOTO_VIEWER, !0)),
          e && this.engine.commandBinder.issueCommand(new SetCurrentSnapshotPhotoCommand(e))
      }),
      (this.onZoomAbilityChange = e => this.viewmodeData.onChanged(() => e(this.canZoom()))),
      (this.canZoom = () => this.viewmodeData.isInside()),
      (this.onZoomLevelChange = e => this.cameraData.onChanged(() => e(this.getZoomLevel()))),
      (this.onZoomMaxCheck = e =>
        this.sweepData.onChanged(() => {
          this.engine.commandBinder.issueCommand(new ZoomMaxValueCommand()).then(e)
        })),
      (this.getZoomLevel = () => this.cameraData.zoom()),
      (this.zoomOut = () => this.engine.commandBinder.issueCommand(new ZoomOutCommand(Hr.X.zoomStep))),
      (this.zoomIn = () => this.engine.commandBinder.issueCommand(new ZoomInCommand(Hr.X.zoomStep))),
      (this.setZoom = e => {
        this.engine.commandBinder.issueCommand(new ZoomSetCommand(0.01 * e))
      }),
      (this.resetZoom = () => this.engine.commandBinder.issueCommand(new ZoomResetCommand())),
      (this.resetCameraPitch = () => this.engine.commandBinder.issueCommand(new ResetCameraPitchCommand())),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets)),
      (this.assetToggler = new SettingsToggler(this.settingsData, this.toggledAssets))
  }
  async activate() {
    if (this.initialized) for (const e of this.bindings) e.renew()
    else {
      ;(this.initialized = !0),
        (this.captureAvailabilityObservable = createObservableValue($r.ENABLED)),
        (this.gridObservable = createObservableValue(!0)),
        (this.assetObservable = createObservableValue(!1)),
        (this.photo2DModeObservable = createObservableValue(!0)),
        (this.captureProgressObservable = createObservableValue(0))
      const e = this.engine
      ;([this.viewmodeData, this.cameraData, this.sweepData, this.meshData, this.tourData] = await Promise.all([
        e.market.waitForData(ViewmodeData),
        e.market.waitForData(CameraData),
        e.market.waitForData(SweepsData),
        e.market.waitForData(MeshData),
        e.market.waitForData(TourData)
      ])),
        this.bindings.push(
          this.sweepData.onChanged(this.updatePhotoAbility),
          this.viewmodeData.onChanged(this.updatePhotoAbility),
          this.meshData.onChanged(this.updatePhotoAbility),
          this.assetObservable.onChanged(this.toggleAssets),
          this.photo2DModeObservable.onChanged(this.toggleAssets)
        )
    }
    this.settingsToggler.toggle(!0), this.adjustCanvasForPhotoMode(), this.toggleAssets()
  }
  async deactivate() {
    this.resizeCanvas(createSimpleResizeDimensions()), await this.toggleAssets(!1), this.settingsToggler.toggle(!1)
    for (const e of this.bindings) e.cancel()
  }
  adjustCanvasForPhotoMode() {
    this.photo2DModeObservable.value
      ? this.resizeCanvas(createAspectRatioBasedResizeDimensions(PanoSizeAspect))
      : this.resizeCanvas(createSimpleResizeDimensions($s.O8))
  }
  onCaptureProgress(e) {
    return this.captureProgressObservable.onChanged(e)
  }
  async captureSnapshot() {
    if (this.capturing || !this.canCapture()) return
    this.tourData.getCurrentTourState().tourPlaying && (await this.engine.commandBinder.issueCommand(new TourStopCommand())),
      (this.capturing = !0),
      (this.captureProgressObservable.value = 0),
      await waitRun(10)
    const e = this.photo2DModeObservable.value
      ? new CaptureSnapshotCommand({
          onProgress: this.captureProgressObservable,
          waitForUpload: !1
        })
      : new EquirectangularSnapshotCommand({
          onProgress: this.captureProgressObservable,
          waitForUpload: !1
        })
    try {
      await this.engine.commandBinder.issueCommand(e)
    } catch (e) {
      zr.error(e),
        this.engine.commandBinder.issueCommand(new UnlockNavigationCommand()),
        this.engine.commandBinder.issueCommand(
          new ConfirmModalCommand(ConfirmModalState.DISPLAY, {
            modalClass: "compact-modal",
            title: Gr.ERROR_MODAL_TITLE,
            message: Gr.ERROR_MODAL_MESSAGE,
            cancellable: !0,
            confirmPhraseKey: Wr.OK
          })
        )
    }
    ;(this.captureProgressObservable.value = 100), (this.capturing = !1)
  }
  onCaptureAvailabilityChanged(e) {
    return this.captureAvailabilityObservable.onChanged(() => e(this.captureAvailabilityObservable.value))
  }
  getCaptureAvailabilityState() {
    const e = this.sweepData
    if (e.transition.active) return $r.DISABLED
    const t = e.currentSweep
    return this.viewmodeData.isInside() && t && !e.getSweep(t).enabled ? $r.SWEEP_HIDDEN : this.canTakeEquirect() ? $r.ENABLED : $r.ENABLED_2D_ONLY
  }
  canCapture() {
    const e = this.getCaptureAvailabilityState()
    return e === $r.ENABLED || e === $r.ENABLED_2D_ONLY
  }
  getScanNumber() {
    const e = this.sweepData,
      t = e.currentSweep
    return t ? e.getSweep(t).index : NaN
  }
  canTakeEquirect() {
    return this.viewmodeData.currentMode === ViewModes.Panorama
  }
  toggleSetting(e, t) {
    ;(this.getSetting(e).value = t), e === Kr.Setting.TWOD_PHOTO && this.adjustCanvasForPhotoMode()
  }
  settingValue(e) {
    return this.getSetting(e).value
  }
  onSettingToggled(e, t) {
    return this.getSetting(e).onChanged(t)
  }
  getSetting(e) {
    switch (e) {
      case Kr.Setting.GRID_OVERLAY:
        return this.gridObservable
      case Kr.Setting.ASSET_CAPTURE:
        return this.assetObservable
      case Kr.Setting.TWOD_PHOTO:
        return this.photo2DModeObservable
    }
  }
}

enum PhotoMode {
  EQUIRECT = 1,
  TWOD = 0
}
enum Setting {
  ASSET_CAPTURE = 2,
  GRID_OVERLAY = 1,
  TWOD_PHOTO = 3
}
Kr.PhotoMode = PhotoMode
Kr.Setting = Setting
// Kr = {
//   PhotoMode,
//   Setting
// }

const Jr = useDataHook(LabelEditorData)
function ea() {
  const e = Jr(),
    [t, n] = (0, i.useState)(e ? e.currentId : null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onCurrentIdChanged(n)
      return () => t.cancel()
    }, [e]),
    t
  )
}
const { LABELS: ta } = PhraseKey.WORKSHOP,
  na = ({ item: e }) => {
    const t = (0, i.useRef)(null),
      [n, s] = (0, i.useState)(!1),
      { commandBinder: r, analytics: a } = (0, i.useContext)(AppReactContext),
      l = (function (e) {
        const t = (0, Xr.r)(),
          [n, s] = (0, i.useState)((null == t ? void 0 : t.getLabel(e)) || null)
        return (
          (0, i.useEffect)(() => {
            if (!t) return () => {}
            function n() {
              s((null == t ? void 0 : t.getLabel(e)) || null)
            }
            const i = t.getCollection().onElementChanged({
              onAdded: n,
              onRemoved: n
            })
            return n(), () => i.cancel()
          }, [t, e]),
          n
        )
      })(e.id),
      d = (0, qi.A)(),
      h = ea(),
      p = (0, $.Q)(ToolsList.LABELS),
      m = (0, L.b)(),
      f = (0, q.y)(DataLayersFeatureKey, !1),
      g = (0, Wi.e)()
    if (!l || !p) return null
    const v = p.manager,
      { id: y, title: b } = e,
      E = y === h
    let S
    S = d && b ? (0, Zi.vr)(b, d) : l.text
    const O = m.t(ta.RENAME_LIST_ITEM_OPTION_CTA),
      T = m.t(ta.DELETE_LIST_ITEM_OPTION_CTA),
      _ = (0, o.jsxs)(ce.hE, {
        children: [
          (0, o.jsx)(es.q, {
            item: e,
            onToggle: e => {
              a.trackGuiEvent("drawer_label_visibility_modified", {
                tool: g
              }),
                v.toggleVisibility([y], e)
            }
          }),
          (0, o.jsxs)(
            ce.xz,
            Object.assign(
              {
                ref: t,
                icon: "more-vert",
                ariaLabel: m.t(PhraseKey.MORE_OPTIONS),
                variant: ce.Wu.TERTIARY,
                menuArrow: !0,
                menuClassName: "search-result-menu"
              },
              {
                children: [
                  (0, o.jsx)(ce.zx, {
                    label: O,
                    size: ce.qE.SMALL,
                    variant: ce.Wu.TERTIARY,
                    onClick: () => {
                      s(!0)
                    }
                  }),
                  f &&
                    (0, o.jsx)(as, {
                      item: e,
                      parentMenu: t,
                      action: "copy"
                    }),
                  f &&
                    (0, o.jsx)(as, {
                      item: e,
                      parentMenu: t,
                      action: "move"
                    }),
                  (0, o.jsx)(ce.zx, {
                    className: "menu-delete-btn",
                    label: T,
                    size: ce.qE.SMALL,
                    variant: ce.Wu.TERTIARY,
                    onClick: () => {
                      l &&
                        (r.issueCommand(
                          new LabelDeleteCommand({
                            sids: [y]
                          })
                        ),
                        a.trackGuiEvent("label_delete", {
                          tool: g
                        }))
                    }
                  })
                ]
              }
            )
          )
        ]
      }),
      w = (0, o.jsx)(
        "div",
        Object.assign(
          {
            className: "item-details"
          },
          {
            children: (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "item-header"
                },
                {
                  children: n
                    ? (0, o.jsx)(is.Z, {
                        isDisabled: !1,
                        editing: !0,
                        className: "inline-text-input",
                        text: S,
                        closeOnFocusOut: !0,
                        defaultText: S,
                        onInput: e => {
                          if (n) {
                            const t = v.editorData.getLabel(y)
                            t && ((t.text = e), t.commit())
                          }
                        },
                        onEdited: e => {
                          n && (v.rename(y, e), s(!1))
                        },
                        maxLength: Zr.ZF,
                        showUnderline: !0,
                        readOnlyMode: !1,
                        propagateMouseEvent: !1,
                        onCancelEditing: () => {
                          s(!1)
                        },
                        validator: e => v.validContent(e)
                      })
                    : (0, o.jsx)(ns.S, {
                        text: S || "",
                        textParser: e.textParser,
                        markers: Zi.PP
                      })
                }
              )
            )
          }
        )
      ),
      A = (0, o.jsx)(Ss.A, {
        item: e
      })

    return (0, o.jsx)(
      ls.F,
      {
        item: e,
        title: w,
        active: E,
        actions: _,
        badge: A,
        onSelect: async () => {
          await r.issueCommand(
            new LabelToggleSelectCommand({
              sid: y
            })
          ),
            e.onSelect()
        }
      },
      y
    )
  }
class ia {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.disabledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [Features360ViewsKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.toggleSelectedImpl = e =>
        this.engine.commandBinder.issueCommand(
          new LabelToggleSelectCommand({
            sid: e
          })
        )),
      (this.toggleSelected = (function (e) {
        let t = null,
          n = null
        return async (...i) => {
          if (null === t) return (t = i), await n, (n = e(...t)), (t = null), n
          t = i
        }
      })(this.toggleSelectedImpl)),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.disabledAssets)),
      (this.initPromise = this.init())
  }
  async init() {
    const { market: e } = this.engine
    ;([this.editorData, this.searchData] = await Promise.all([e.waitForData(LabelEditorData), e.waitForData(SearchData)])), this.setSearchItemFC(na)
  }
  async activate() {
    const e = this.engine
    this.settingsToggler.toggle(!0), await this.initPromise, await e.commandBinder.issueCommand(new LabelEditorEnableCommand())
  }
  async deactivate() {
    this.settingsToggler.toggle(!1), await this.engine.commandBinder.issueCommand(new LabelEditorDisableCommand())
  }
  async dispose() {
    await this.initPromise, this.setSearchItemFC()
  }
  setSearchItemFC(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.LABEL)
    t && (t.itemFC = e)
  }
  async hasPendingEdits() {
    switch (this.editorData.toolState) {
      case DragAndDropObject.ToolState.ADDING:
      case DragAndDropObject.ToolState.EDITING:
      case DragAndDropObject.ToolState.PLACING:
        return !0
      default:
        return !1
    }
  }
  startAddingLabel() {
    this.engine.commandBinder.issueCommand(new LabelEditorCreateCommand())
  }
  openEditModal(e) {
    this.engine.commandBinder.issueCommand(
      new LabelEditorEditCommand({
        sid: e
      })
    )
  }
  editCommitText(e) {
    const t = this.editorData.getLabel(this.editorData.currentId)
    t && (this.validContent(e) ? this.rename(t.sid, e) : this.editDiscardChanges())
  }
  validContent(e) {
    return void 0 !== e && e.length >= Zr.yx && e.length <= Zr.ZF
  }
  editDiscardChanges() {
    return this.engine.commandBinder.issueCommand(new LabelEditorDiscardCommand())
  }
  delete(...e) {
    return this.engine.commandBinder.issueCommand(
      new LabelDeleteCommand({
        sids: e
      })
    )
  }
  toggleVisibility(e, t) {
    return this.engine.commandBinder.issueCommand(
      new LabelVisibleCommand({
        sids: e,
        visible: t
      })
    )
  }
  rename(e, t) {
    return this.engine.commandBinder.issueCommand(
      new LabelRenameCommand({
        sid: e,
        text: t
      })
    )
  }
}
class ra {
  constructor(e, t) {
    ;(this.engine = e),
      (this.toggledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesNotesKey]: !1,
        [FeaturesLabelsKey]: !1,
        [Features360ViewsKey]: !1
      }),
      (this.settingsToggler = new SettingsToggler(t, this.toggledAssets))
  }
  async activate() {
    const { commandBinder: e } = this.engine
    this.settingsToggler.toggle(!0), e.issueCommandWhenBound(new ActivateMeshTrimEditorCommand())
  }
  async deactivate() {
    return this.settingsToggler.toggle(!1), this.engine.commandBinder.issueCommandWhenBound(new DeactivateMeshTrimEditorCommand())
  }
}
const { PHOTOS: ha } = PhraseKey.WORKSHOP
class pa extends i.Component {
  constructor() {
    super(...arguments),
      (this.sliderRef = (0, i.createRef)()),
      (this.zoomStepThreshold = 0.01 - ua.Z.epsilon),
      (this.onCameraPitchReset = async () => {
        await this.props.onCameraPitchReset()
      }),
      (this.onReset = async () => {
        await this.props.onResetClick()
      }),
      (this.onZoomOut = async () => {
        await this.props.onZoomOutClick()
      }),
      (this.onZoomIn = async () => {
        await this.props.onZoomInClick()
      }),
      (this.formatZoom = e => e.toFixed(0))
  }
  UNSAFE_componentWillReceiveProps(e) {
    if (!(0, da.r6)(this.props.zoomLevel, e.zoomLevel, this.zoomStepThreshold)) {
      const t = this.sliderRef.current
      if (t) {
        const n = Number(this.formatZoom(100 * e.zoomLevel))
        t.setValue(n)
      }
    }
  }
  render() {
    const { locale: e } = this.context,
      t = e.t(ha.CAMERA_PITCH_RESET_MESSAGE),
      n = e.t(ha.ZOOM_RESET_MESSAGE),
      i = e.t(ha.ZOOM_IN_MESSAGE),
      s = e.t(ha.ZOOM_OUT_MESSAGE),
      { zoomLevel: r, maxZoomLevel: a, onSliderInput: l, onSliderChange: c, toolPanelLayout: d } = this.props,
      h = d === ToolPanelLayout.NARROW ? ca.h.UP : ca.h.DOWN
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "photos-zoom overlay-slider"
        },
        {
          children: [
            (0, o.jsx)(ce.zx, {
              icon: "snap",
              variant: ce.Wu.FAB,
              theme: "overlay",
              className: B("reset-pitch", "zoom-button"),
              tooltip: t,
              tooltipOptions: {
                placement: "bottom"
              },
              onClick: this.onCameraPitchReset
            }),
            (0, o.jsxs)(
              ce.hE,
              Object.assign(
                {
                  className: "slider-wrapper"
                },
                {
                  children: [
                    (0, o.jsx)(ce.zx, {
                      icon: "minus",
                      variant: ce.Wu.FAB,
                      theme: "overlay",
                      className: B("minus", "zoom-button"),
                      tooltip: s,
                      tooltipOptions: {
                        placement: "bottom"
                      },
                      onClick: this.onZoomOut
                    }),
                    (0, o.jsx)(ca.S, {
                      ref: this.sliderRef,
                      discrete: !1,
                      min: 70,
                      max: 100 * a,
                      initialValue: 100 * r,
                      onInput: l,
                      onChange: c,
                      displayBounds: !1,
                      width: 100,
                      units: "%",
                      tooltipPosition: h,
                      formatNumbers: this.formatZoom
                    }),
                    (0, o.jsx)(ce.zx, {
                      icon: "plus",
                      variant: ce.Wu.FAB,
                      theme: "overlay",
                      className: B("plus", "zoom-button"),
                      tooltip: i,
                      tooltipOptions: {
                        placement: "bottom"
                      },
                      onClick: this.onZoomIn
                    })
                  ]
                }
              )
            ),
            !(0, da.r6)(r, 1, this.zoomStepThreshold) &&
              (0, o.jsx)(ce.zx, {
                icon: "zoom-reset",
                variant: ce.Wu.FAB,
                theme: "overlay",
                className: B("reset", "zoom-button"),
                tooltip: n,
                tooltipOptions: {
                  placement: "bottom"
                },
                onClick: this.onReset
              })
          ]
        }
      )
    )
  }
}
pa.contextType = AppReactContext

import * as Da from "../other/73085"
import * as Ra from "../other/74554"
import * as fa from "../other/86495"
import * as Sa from "../other/89478"
import * as Ta from "../other/91418"
import * as Ja from "../other/92390"
import * as Oa from "../other/98025"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { KeyboardCode } from "../const/keyboard.const"
import { EndMoveToSweepMessage } from "../message/sweep.message"
import * as Ba from "../other/20487"
import * as Ka from "../other/22804"
import * as Ha from "../other/28587"
import * as Xa from "../other/60770"
const { PHOTOS: va } = PhraseKey.WORKSHOP,
  ya = new DebugInfo("overlay")
@l.Z
class ba extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.isUnmounting = !1),
      (this.capture = async () => {
        if (!this.state.validSweep)
          return void this.setState({
            showingTooltip: !0
          })
        await this.context.commandBinder.issueCommand(new HideToastrCommand())
        try {
          await this.props.manager.captureSnapshot()
        } catch (e) {
          return void ya.error(e)
        }
        const e = {
          messagePhraseKey: va.SAVING_TOAST_MESSAGE,
          timeout: 3e3,
          dismissesOnAction: !1
        }
        this.context.commandBinder.issueCommand(new ShowToastrCommand(e))
      }),
      (this.onSnapshotCreated = ({ snapshot: e }) => {
        if (this.isUnmounting) return
        const t = {
          messagePhraseKey: va.SAVED_TOAST_MESSAGE,
          timeout: 1e4,
          ctaPhraseKey: va.SAVED_TOAST_CTA,
          dismissesOnAction: !0,
          actionHandler: async () => {
            this.props.manager.openPhotoViewer(e.sid)
          }
        }
        this.context.commandBinder.issueCommand(new ShowToastrCommand(t))
      }),
      (this.openPhotoViewer = () => {
        this.props.manager.openPhotoViewer()
      }),
      (this.updateCaptureProgress = e => {
        this.isUnmounting ||
          this.setState({
            captureProgress: e,
            capturing: 100 !== e
          })
      }),
      (this.onCaptureAbilityChanged = e => {
        this.isUnmounting ||
          this.setState({
            validSweep: e === $r.ENABLED || e === $r.ENABLED_2D_ONLY,
            showingTooltip: e === $r.SWEEP_HIDDEN
          })
      }),
      (this.syncManagerSettings = () => {
        if (this.isUnmounting) return
        const { manager: e } = this.props,
          t = e.settingValue(Kr.Setting.GRID_OVERLAY),
          n = e.settingValue(Kr.Setting.TWOD_PHOTO),
          i = n && t
        this.setState({
          gridEnabled: i,
          in2D: n
        }),
          this.context.settings.setProperty(PhotoGridVisibleKey, i)
      }),
      (this.dismissTooltip = () => {
        this.setState({
          showingTooltip: !1
        })
      }),
      (this.getTooltipMessage = () => {
        const { locale: e } = this.context,
          t = this.props.manager.getScanNumber()
        return Number.isNaN(t)
          ? e.t(va.CANNOT_SAVE_TOOLTIP_MESSAGE)
          : e.t(va.CANNOT_SAVE_SCAN_NUMBER_TOOLTIP_MESSAGE, {
              scanNumber: t + 1
            })
      }),
      (this.renderViewPhotosButton = () => {
        const { locale: e } = this.context,
          t = e.t(va.VIEW_PHOTOS)
        return (0, o.jsx)(ce.zx, {
          className: "action-button-outer",
          icon: "public_symbols_image",
          variant: ce.Wu.FAB,
          disabled: this.state.capturing,
          theme: "overlay",
          tooltip: t,
          onClick: this.openPhotoViewer
        })
      }),
      (this.onZoomReset = async () => {
        const e = await this.props.manager.resetZoom()
        return this.context.analytics.trackToolGuiEvent("photos", "click_zoom_reset_button"), e
      }),
      (this.onZoomIn = async () => {
        const e = await this.props.manager.zoomIn()
        return this.context.analytics.trackToolGuiEvent("photos", "click_zoom_in_button"), e
      }),
      (this.onZoomOut = async () => {
        const e = await this.props.manager.zoomOut()
        return this.context.analytics.trackToolGuiEvent("photos", "click_zoom_out_button"), e
      }),
      (this.onSliderchange = () => {
        this.context.analytics.trackToolGuiEvent("photos", "zoom_slider_changed")
      }),
      (this.updateZoomLevel = e => {
        e !== this.state.zoomLevel &&
          this.setState({
            zoomLevel: e
          })
      }),
      (this.updateMaxZoom = e => {
        e !== this.state.maxZoomLevel &&
          this.setState({
            maxZoomLevel: e
          })
      }),
      (this.enableZoomBar = e => {
        this.setState({
          canZoom: e
        })
      }),
      (this.onCameraPitchReset = () => {
        this.context.analytics.trackToolGuiEvent("photos", "click_pitch_reset_button"), this.props.manager.resetCameraPitch()
      })
    const t = e.manager
    this.state = {
      in2D: !1,
      gridEnabled: !1,
      showingTooltip: !1,
      validSweep: !1,
      captureProgress: 0,
      capturing: !1,
      canZoom: t.canZoom(),
      zoomLevel: 1,
      maxZoomLevel: 3
    }
  }
  async componentDidMount() {
    const { manager: e } = this.props
    this.bindings.push(
      e.onCaptureAvailabilityChanged(this.onCaptureAbilityChanged),
      e.onSettingToggled(Kr.Setting.GRID_OVERLAY, this.syncManagerSettings),
      e.onSettingToggled(Kr.Setting.TWOD_PHOTO, this.syncManagerSettings),
      e.onCaptureProgress(this.updateCaptureProgress),
      e.onZoomAbilityChange(this.enableZoomBar),
      e.onZoomLevelChange(this.updateZoomLevel),
      e.onZoomMaxCheck(this.updateMaxZoom),
      this.context.messageBus.subscribe(GalleryImageAddMessage, this.onSnapshotCreated)
    ),
      this.bindings.forEach(e => {
        e.renew()
      }),
      this.onCaptureAbilityChanged(e.getCaptureAvailabilityState()),
      this.syncManagerSettings()
    const t = await this.context.commandBinder.issueCommand(new ZoomMaxValueCommand())
    this.updateMaxZoom(t), this.enableZoomBar(e.canZoom())
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0),
      this.context.settings.setProperty(PhotoGridVisibleKey, !1),
      this.bindings.forEach(e => {
        e.cancel()
      })
  }
  render() {
    const { locale: e } = this.context,
      { manager: t, toolPanelLayout: n } = this.props,
      { capturing: i, captureProgress: s, canZoom: r, zoomLevel: a, maxZoomLevel: l, showingTooltip: c, validSweep: d, in2D: h } = this.state,
      p = n === ToolPanelLayout.NARROW,
      m = !d,
      f = i,
      g = e.t(va.CANNOT_SAVE_TOOLTIP_TITLE),
      v = e.t(va.CATURE_PHOTO)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "overlay grid-overlay photos-overlay"
        },
        {
          children: [
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: B({
                    "overlay-top-center": !p
                  })
                },
                {
                  children:
                    h &&
                    r &&
                    (0, o.jsx)(pa, {
                      zoomLevel: a,
                      maxZoomLevel: l,
                      onResetClick: this.onZoomReset,
                      onZoomInClick: this.onZoomIn,
                      onZoomOutClick: this.onZoomOut,
                      onSliderInput: t.setZoom,
                      onSliderChange: this.onSliderchange,
                      onCameraPitchReset: this.onCameraPitchReset,
                      toolPanelLayout: n
                    })
                }
              )
            ),
            (0, o.jsx)(
              fa.o,
              Object.assign(
                {
                  outerRight: this.renderViewPhotosButton()
                },
                {
                  children: (0, o.jsx)(
                    oa.L,
                    Object.assign(
                      {
                        icon: "toolbar-photos",
                        ariaLabel: v,
                        active: f,
                        theme: "dark",
                        dimmed: m,
                        variant: ce.Wu.FAB,
                        onClick: this.capture,
                        nudgeDisabled: !c,
                        nudgeMessage: this.getTooltipMessage(),
                        nudgeTitle: g,
                        onNudgeDismissed: this.dismissTooltip
                      },
                      {
                        children: (0, o.jsx)(la.$, {
                          className: B({
                            complete: 100 === s,
                            reset: 0 === s
                          }),
                          progress: s,
                          innerRadius: ba.captureButtonRadius,
                          barWidth: ba.progressBarThickness
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
ba.contextType = AppReactContext
ba.captureButtonRadius = 28
ba.progressBarThickness = 4
const Ea = (0, G.f)(ba)
const { PHOTOS: _a } = PhraseKey.WORKSHOP
function wa(e) {
  const { manager: t, in2D: n, gridEnabled: s, captureAssets: r } = e,
    a = (0, L.b)(),
    l = (0, i.useCallback)(() => {
      t.toggleSetting(Kr.Setting.ASSET_CAPTURE, !r)
    }, [t, r]),
    c = (0, i.useCallback)(() => {
      t.toggleSetting(Kr.Setting.GRID_OVERLAY, !s)
    }, [t, s]),
    d = a.t(_a.ASSETS_SETTING_LABEL),
    u = a.t(_a.SHOW_GRID_SETTING_LABEL)
  return (0, o.jsxs)(
    Oa.J,
    Object.assign(
      {
        className: "photo-settings"
      },
      {
        children: [
          (0, o.jsx)(Ta.w, {
            label: d,
            onToggle: l,
            enabled: n,
            toggled: r,
            onOffLabel: !1
          }),
          (0, o.jsx)(Ta.w, {
            label: u,
            onToggle: c,
            enabled: n,
            toggled: s,
            onOffLabel: !1
          })
        ]
      }
    )
  )
}
class Aa extends i.Component {
  render() {
    const { children: e, className: t } = this.props
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: B("button-group", t)
        },
        {
          children: e
        }
      )
    )
  }
}
const { PHOTOS: Na } = PhraseKey.WORKSHOP
function Ia(e) {
  const { manager: t, in2D: n, panoPhotoEnabled: s } = e,
    r = (0, L.b)(),
    a = (0, oe.Y)(),
    l = (0, i.useCallback)(() => {
      n || t.toggleSetting(Kr.Setting.TWOD_PHOTO, !0)
    }, [t, n]),
    c = (0, i.useCallback)(() => {
      n && s && t.toggleSetting(Kr.Setting.TWOD_PHOTO, !1)
    }, [t, n, s]),
    d = !a,
    u = r.t(Na.CAN_TAKE_2D_PHOTO_TOOLTIP_MESSAGE),
    h = s ? r.t(Na.CAN_TAKE_360_PHOTO_TOOLTIP_MESSAGE) : r.t(Na.CANNOT_TAKE_360_PHOTO_TOOLTIP_MESSAGE),
    p = r.t(Na.PANO_CTA),
    m = {
      placement: a ? "top" : "bottom"
    }
  return (0, o.jsxs)(
    Aa,
    Object.assign(
      {
        className: "photo-modes"
      },
      {
        children: [
          d &&
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: "photo-mode-label"
                },
                {
                  children: "2D"
                }
              )
            ),
          (0, o.jsx)(ce.zx, {
            className: "button-group-button-left",
            icon: "photo-2d",
            variant: ce.Wu.FAB,
            theme: "overlay",
            onClick: l,
            tooltip: u,
            tooltipOptions: m,
            active: n
          }),
          (0, o.jsx)(ce.zx, {
            className: "button-group-button-right",
            icon: "photo-360",
            variant: ce.Wu.FAB,
            theme: "overlay",
            onClick: c,
            tooltip: h,
            tooltipOptions: m,
            active: !n,
            dimmed: !s
          }),
          d &&
            (0, o.jsx)(
              "label",
              Object.assign(
                {
                  className: B("photo-mode-label", {
                    disabled: !s
                  })
                },
                {
                  children: p
                }
              )
            )
        ]
      }
    )
  )
}

const { PHOTOS: xa } = PhraseKey.WORKSHOP
@l.Z
class ka extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.onPhoto2DModeChanged = e => {
        this.setState({
          in2D: e
        })
      }),
      (this.onAssetCaptureToggled = e => {
        this.setState({
          captureAssets: e
        })
      }),
      (this.onGridToggled = e => {
        this.setState({
          gridEnabled: e
        })
      }),
      (this.onCaptureAbilityChanged = e => {
        const t = e !== $r.ENABLED_2D_ONLY
        this.setState({
          panoPhotoEnabled: t
        }),
          this.state.in2D || t || this.props.manager.toggleSetting(Kr.Setting.TWOD_PHOTO, !0)
      })
    const t = e.manager
    ;(this.state = {
      in2D: t.settingValue(Kr.Setting.TWOD_PHOTO),
      gridEnabled: t.settingValue(Kr.Setting.GRID_OVERLAY),
      captureAssets: t.settingValue(Kr.Setting.ASSET_CAPTURE),
      panoPhotoEnabled: t.canTakeEquirect()
    }),
      this.bindings.push(
        this.props.manager.onCaptureAvailabilityChanged(this.onCaptureAbilityChanged),
        this.props.manager.onSettingToggled(Kr.Setting.GRID_OVERLAY, this.onGridToggled),
        this.props.manager.onSettingToggled(Kr.Setting.ASSET_CAPTURE, this.onAssetCaptureToggled),
        this.props.manager.onSettingToggled(Kr.Setting.TWOD_PHOTO, this.onPhoto2DModeChanged)
      )
  }
  componentDidMount() {
    for (const e of this.bindings) e.renew()
  }
  componentWillUnmount() {
    for (const e of this.bindings) e.cancel()
  }
  render() {
    const { locale: e } = this.context,
      { manager: t } = this.props,
      { panoPhotoEnabled: n, in2D: i, gridEnabled: s, captureAssets: r } = this.state,
      a = e.t(xa.SETTINGS_TOOLTIP_MESSAGE)
    return (0, o.jsxs)(o.Fragment, {
      children: [
        (0, o.jsx)(Ia, {
          manager: t,
          in2D: i,
          panoPhotoEnabled: n
        }),
        (0, o.jsx)(
          Sa.P,
          Object.assign(
            {
              icon: "settings",
              tooltip: a,
              analytic: "photo_settings_click",
              className: "photo-settings-button",
              popupSize: "large"
            },
            {
              children: (0, o.jsx)(wa, {
                manager: t,
                in2D: i,
                gridEnabled: s,
                captureAssets: r
              })
            }
          )
        )
      ]
    })
  }
}
ka.contextType = AppReactContext

class La {
  constructor(e) {
    ;(this.manager = e),
      (this.renderBar = () =>
        (0, o.jsx)(ka, {
          manager: this.manager
        })),
      (this.renderOverlay = () =>
        (0, o.jsx)(Ea, {
          manager: this.manager
        }))
  }
}
const Ma = (0, Da.M)(TourData, "tourPlaying", !1),
  { HLR: ja } = ((0, Ra.M)("tourPlaying", Ma), PhraseKey.WORKSHOP)
function Ua({ manager: e }) {
  const { commandBinder: t, analytics: n } = (0, i.useContext)(AppReactContext),
    s = (0, L.b)(),
    r = 0 === (0, Be.g)(),
    [a, l] = (0, i.useState)(e.getScanNumber()),
    [d, u] = (0, i.useState)(e.inHiddenSweep()),
    [p, m] = (0, i.useState)(r || d || Number.isNaN(a)),
    [f, y] = (0, i.useState)(!1),
    b = (0, qe.R)(),
    E = Ma()
  if (
    ((0, Z.U)(EndMoveToSweepMessage, () => {
      u(e.inHiddenSweep()), l(e.getScanNumber())
    }),
    b || E)
  )
    return null
  const S = s.t(ja.ADD_FROM_PHOTOS_TOOLTIP_MESSAGE),
    O = (0, o.jsx)(ce.zx, {
      className: "action-button-outer",
      icon: "photo-add",
      tooltip: S,
      disabled: d,
      size: ce.qE.MEDIUM,
      theme: "dark",
      variant: ce.Wu.FAB,
      onClick: async () => {
        t.issueCommand(new ToggleModalCommand(v.P.ADD_FROM_PHOTOS, !0))
      }
    })
  let T, _
  !d || r
    ? ((T = s.t(ja.SCAN_NOT_HIDDEN_TOOLTIP_TITLE)), (_ = "hlr-feature-nudge"))
    : (T = Number.isNaN(a)
        ? s.t(ja.SCAN_GENERIC_HIDDEN_TOOLTIP_TITLE)
        : s.t(ja.SCAN_NUMBER_HIDDEN_TOOLTIP_TITLE, {
            number: a + 1
          }))
  const w = s.t(ja.ADD_HIGHLIGHT_INSTRUCTIONS),
    A = s.t(f ? ja.ADD_HIGHLIGHT_DISABLED_CTA : ja.ADD_HIGHLIGHT_CTA),
    N = f ? void 0 : "plus"
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "overlay grid-overlay hlr-overlay"
      },
      {
        children: (0, o.jsx)(
          fa.o,
          Object.assign(
            {
              outerRight: O,
              small: !0
            },
            {
              children: (0, o.jsx)(oa.L, {
                size: ce.qE.SMALL,
                variant: ce.Wu.FAB,
                icon: N,
                label: A,
                theme: "dark",
                id: "add-hlr-button",
                dimmed: d,
                onClick: () => {
                  f ||
                    (d
                      ? m(!p)
                      : (y(!0),
                        m(!1),
                        e
                          .onAddTourHighlight()
                          .catch(e => {
                            t.issueCommand(
                              new ShowToastrCommand({
                                messagePhraseKey: ja.TOAST_ERROR_MESSAGE,
                                timeout: 0,
                                ctaPhraseKey: ja.TOAST_ERROR_CTA,
                                dismissesOnAction: !0
                              })
                            )
                          })
                          .finally(() => {
                            y(!1)
                          })))
                },
                nudgeMessage: w,
                nudgeTitle: T,
                nudgeDisabled: !p,
                onNudgeDismissed: () => {
                  r && n.trackGuiEvent("highlight_reel_nudge_seen"), m(!1)
                },
                nudgeSessionKey: _,
                showTimeout: 500,
                dismissTimeout: 5e3,
                featured: r
              })
            }
          )
        )
      }
    )
  )
}
class Fa {
  constructor(e) {
    ;(this.manager = e),
      (this.renderOverlay = () =>
        (0, o.jsx)(Ua, {
          manager: this.manager
        }))
  }
}
const { LABEL_SUGGESTIONS: za } = PhraseKey.WORKSHOP,
  $a = [
    za.KITCHEN,
    za.PRIMARY_BEDROOM,
    za.BEDROOM,
    za.PRIMARY_BATHROOM,
    za.BATHROOM,
    za.LIVING_ROOM,
    za.FAMILY_ROOM,
    za.DINING_ROOM,
    za.PATIO,
    za.BALCONY,
    za.BACKYARD,
    za.FRONT_YARD,
    za.HALLWAY,
    za.LAUNDRY,
    za.PANTRY,
    za.CLOSET,
    za.GARAGE,
    za.DRIVEWAY,
    za.BASEMENT,
    za.FACADE,
    za.GARDEN,
    za.LOBBY,
    za.OFFICE,
    za.POOL,
    za.UNFURNISHED,
    za.STAIRWAY,
    za.ELEVATOR,
    za.ESCALATOR,
    za.STUDY,
    za.SPA,
    za.RECEPTION,
    za.MEETING_ROOM,
    za.STORAGE,
    za.BREAK_ROOM,
    za.LUNCH_ROOM,
    za.CONFERENCE_ROOM
  ]
class Ya extends i.Component {
  constructor(e) {
    super(e),
      (this.onInput = e => {
        this.props.onInput && this.props.onInput(e)
        const t = e ? this.allSuggestions.filter(t => 0 === t.toLowerCase().indexOf(e.toLowerCase())) : []
        this.setState({
          suggestions: t,
          selected: -1
        })
      }),
      (this.onSuggestionChosen = e => t => {
        t.stopPropagation(),
          this.props.enterStopsEditing ? this.textInput.setCurrentText(e) : this.textInput.stopEditing(e),
          this.setState({
            suggestions: [],
            selected: -1
          })
      }),
      (this.getSuggestions = () => {
        const e = []
        let t = 0
        for (const n of this.state.suggestions) {
          const i = t === this.state.selected
          e.push(
            (0, o.jsx)(
              ce.zx,
              {
                size: ce.qE.SMALL,
                label: n,
                active: i,
                variant: ce.Wu.TERTIARY,
                onClick: this.onSuggestionChosen(n)
              },
              n
            )
          ),
            t++
        }
        return e
      }),
      (this.onKeyPress = e => {
        if ((e.stopPropagation(), this.props.onKeyPress && this.props.onKeyPress(e))) return !0
        const t = e.which || e.keyCode
        switch (t) {
          case KeyboardCode.DOWNARROW:
            this.setState(e => ({
              selected: Math.min(e.selected + 1, this.state.suggestions.length - 1)
            }))
            break
          case KeyboardCode.UPARROW:
            this.setState(e => ({
              selected: Math.max(e.selected - 1, -1)
            }))
            break
          case KeyboardCode.TAB:
          case KeyboardCode.RETURN:
            if ("keydown" === e.type && t !== KeyboardCode.TAB) return !0
            const { selected: n, suggestions: i } = this.state
            return (
              n > -1
                ? (this.props.enterStopsEditing ? this.textInput.stopEditing(i[n]) : this.textInput.setCurrentText(i[n]),
                  t === KeyboardCode.TAB && e.preventDefault())
                : this.props.enterStopsEditing && this.textInput.stopEditing(this.textInput.getCurrentText() || this.props.defaultText || ""),
              this.clearSuggestions(),
              !0
            )
          case KeyboardCode.ESCAPE:
            if ("keydown" !== e.type) return
            if (this.state.selected > -1) return this.clearSuggestions(), !0
            this.props.onCancel && this.props.onCancel()
            break
          default:
            return !1
        }
        return !1
      }),
      (this.saveRef = e => {
        this.textInput = e
      }),
      (this.closeMenu = () => {
        this.setState({
          showSuggestions: !1
        })
      }),
      (this.state = {
        currentText: "",
        selected: -1,
        showSuggestions: !0,
        suggestions: []
      }),
      (this.allSuggestions = this.props.suggestions.sort())
  }
  clearSuggestions() {
    this.setState({
      suggestions: [],
      selected: -1
    })
  }
  hasSuggestions() {
    return this.state.suggestions.length > 0
  }
  getTextInput() {
    return this.textInput
  }
  render() {
    var e
    const {
        text: t,
        ghosted: n,
        closeOnFocusOut: i,
        onEdited: s,
        editing: r,
        placeholder: a,
        defaultText: l,
        maxLength: c,
        className: d,
        autoSelect: u
      } = this.props,
      { currentText: h, showSuggestions: p } = this.state,
      m = h || t,
      f = void 0 === i || i,
      g = {
        ghosted: !!n
      },
      v = r ? this.getSuggestions() : []
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: B("autocomplete-text", g, d)
        },
        {
          children: [
            (0, o.jsx)(is.Z, {
              ref: this.saveRef,
              text: m,
              defaultText: l,
              placeholder: a,
              autoSelect: u,
              editing: r,
              onEdited: s,
              maxLength: c,
              closeOnFocusOut: f,
              onInput: this.onInput,
              onKeyPress: this.onKeyPress
            }),
            r &&
              v.length > 0 &&
              (0, o.jsx)(
                ce.v2,
                Object.assign(
                  {
                    className: "suggestion-container",
                    target: (null === (e = this.textInput) || void 0 === e ? void 0 : e.getElement()) || null,
                    isOpen: p,
                    onClose: this.closeMenu,
                    focus: !1
                  },
                  {
                    children: v
                  }
                )
              )
          ]
        }
      )
    )
  }
}
const { LABELS: qa } = PhraseKey.WORKSHOP
class Za extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.originalText = ""),
      (this.focusLabel = () => {
        this.textBox && this.textBox.getTextInput().focusInput()
      }),
      (this.onToolStateUpdated = () => {
        const e = this.props.manager.editorData.toolState
        if (e !== this.state.toolState) {
          this.setState({
            toolState: e
          })
          let t = !0
          switch (e) {
            case DragAndDropObject.ToolState.ADDING:
            case DragAndDropObject.ToolState.EDITING:
            case DragAndDropObject.ToolState.PLACING:
              ;(t = !1), this.context.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand())
              break
            default:
              this.context.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand())
          }
          this.context.engine.broadcast(new ToggleViewingControlsMessage(t))
        }
      }),
      (this.onSelectionUpdated = () => {
        const { editorData: e } = this.props.manager,
          t = e.getLabel(e.currentId),
          n = t ? t.text : ""
        ;(this.originalText = n), this.setText(n)
      }),
      (this.onDone = () => {
        this.onEditFinished(this.state.text)
      }),
      (this.onCancel = () => {
        this.setText(this.originalText), this.props.manager.editDiscardChanges()
      }),
      (this.setText = e => {
        const { editorData: t } = this.props.manager,
          n = t.getLabel(t.currentId)
        n && ((n.text = e), n.commit()),
          this.setState({
            text: e
          })
      }),
      (this.onAutoComplete = e => {
        this.setText(e), this.textBox && this.textBox.clearSuggestions(), this.focusLabel()
      }),
      (this.onEditFinished = e => {
        const t = e || this.state.text,
          { manager: n } = this.props
        this.textBox && this.textBox.clearSuggestions(), n.validContent(t) ? this.props.manager.editCommitText(t) : this.onCancel()
      }),
      (this.onKeyPress = e => {
        if (this.textBox && this.textBox.hasSuggestions()) return !1
        switch (e.which || e.keyCode) {
          case KeyboardCode.RETURN:
            if ("keydown" === e.type) return
            return this.onEditFinished(), !0
          case KeyboardCode.TAB:
            return e.preventDefault(), !0
          default:
            return !1
        }
      }),
      (this.stopPropagation = e => {
        e.stopPropagation()
      }),
      (this.setAutocompleteRef = e => {
        this.textBox = e
      })
    const t = e.manager.editorData
    ;(this.translate = this.translate.bind(this)),
      (this.state = {
        toolState: t.toolState,
        text: ""
      })
  }
  componentDidMount() {
    const { manager: e } = this.props,
      { editorData: t } = e,
      { messageBus: n } = this.context
    this.bindings.push(
      t.onToolStateChanged(this.onToolStateUpdated),
      t.onCurrentIdChanged(this.onSelectionUpdated),
      n.subscribe(FocusLabelEditorMessage, this.focusLabel)
    ),
      this.onSelectionUpdated(),
      this.onToolStateUpdated()
  }
  componentWillUnmount() {
    this.bindings.forEach(e => e.cancel())
  }
  translate(e) {
    return this.context.locale.t(e)
  }
  renderEditor(e) {
    const { text: t, toolState: n } = this.state,
      { locale: i } = this.context,
      { manager: s } = this.props,
      r = null !== s.editorData.currentId && n === DragAndDropObject.ToolState.EDITING,
      a = i.t(qa.INPUT_PLACEHOLDER)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "label-text-field"
        },
        {
          children: [
            (0, o.jsx)(Ya, {
              ref: this.setAutocompleteRef,
              text: t,
              defaultText: "",
              placeholder: a,
              editing: r,
              ghosted: !1,
              autoSelect: !0,
              closeOnFocusOut: !1,
              onEdited: this.onAutoComplete,
              onCancel: this.onCancel,
              onInput: this.setText,
              onKeyPress: this.onKeyPress,
              suggestions: $a.map(this.translate),
              className: B("text-input-box", {
                error: !e
              })
            }),
            (0, o.jsx)(Ka.R, {
              current: t.length,
              min: Zr.yx,
              max: Zr.ZF
            })
          ]
        }
      )
    )
  }
  render() {
    const { popup: e, manager: t } = this.props,
      { text: n, toolState: i } = this.state,
      { locale: s } = this.context,
      r = t.validContent(n),
      a = null !== t.editorData.currentId && i === DragAndDropObject.ToolState.EDITING,
      l = s.t(qa.EDIT_LABEL),
      c = s.t(qa.EDIT_TEXT_DONE_CTA),
      d = s.t(qa.EDIT_TEXT_CANCEL_CTA),
      u = this.renderEditor(r),
      h = (0, o.jsxs)(
        ce.hE,
        Object.assign(
          {
            className: "modal-footer",
            spacing: "small"
          },
          {
            children: [
              (0, o.jsx)(ce.zx, {
                label: d,
                variant: ce.Wu.TERTIARY,
                onClick: this.onCancel
              }),
              (0, o.jsx)(ce.zx, {
                label: c,
                variant: ce.Wu.TERTIARY,
                onClick: this.onDone,
                disabled: !r
              })
            ]
          }
        )
      )
    return e
      ? (0, o.jsx)(
          an.H,
          Object.assign(
            {
              open: a,
              title: l,
              fullModal: !1,
              className: "label-editor",
              onClose: this.onCancel
            },
            {
              children: (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "modal-contents"
                  },
                  {
                    children: [
                      (0, o.jsx)(
                        "div",
                        Object.assign(
                          {
                            className: "modal-body"
                          },
                          {
                            children: u
                          }
                        )
                      ),
                      h
                    ]
                  }
                )
              )
            }
          )
        )
      : (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: B("label-editor", "label-editor-inline", {
                open: a
              }),
              onClick: this.stopPropagation,
              onPointerDown: this.stopPropagation,
              onPointerUp: this.stopPropagation
            },
            {
              children: [
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "h5"
                    },
                    {
                      children: l
                    }
                  )
                ),
                u,
                h
              ]
            }
          )
        )
  }
}
function Qa() {
  const e = Jr(),
    [t, n] = (0, i.useState)((null == e ? void 0 : e.toolState) || DragAndDropObject.ToolState.CLOSED)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onToolStateChanged(n)
      return n(e.toolState), () => t.cancel()
    }, [e]),
    t
  )
}
Za.contextType = AppReactContext
const { LABELS: eo } = PhraseKey.WORKSHOP
function to({ manager: e }) {
  const t = (0, i.useRef)(null),
    n = (0, G.T)() === ToolPanelLayout.SIDE_PANEL,
    s = Qa(),
    r = ea(),
    a = (0, L.b)(),
    l = s === DragAndDropObject.ToolState.SELECTED,
    c = s === DragAndDropObject.ToolState.ADDING
  if (s === DragAndDropObject.ToolState.EDITING) return null
  function d() {
    t.current && t.current.dismissNudge()
  }
  const h = !!r,
    p = h && l,
    m = l && h,
    f = a.t(eo.ADD_LABEL_TOOLTIP_MESSAGE),
    g = !n || c,
    v = c ? Xa.d.CANCEL : Xa.d.ADD,
    y = c,
    b = !c
      ? (0, o.jsx)(ce.zx, {
          className: "action-button-outer",
          icon: "toggle-pencil",
          variant: ce.Wu.FAB,
          theme: "overlay",
          disabled: !m,
          onClick: t => {
            d(), r && e.openEditModal(r)
          }
        })
      : void 0,
    E = !c
      ? (0, o.jsx)(ce.zx, {
          className: "action-button-outer",
          icon: "delete",
          variant: ce.Wu.FAB,
          theme: "overlay",
          disabled: !p,
          onClick: () => {
            d(), r ? e.delete(r) : c && e.editDiscardChanges()
          }
        })
      : void 0
  return (0, o.jsx)(
    fa.o,
    Object.assign(
      {
        outerLeft: b,
        outerRight: E
      },
      {
        children: (0, o.jsx)(Ja.W, {
          ref: t,
          allowLayerChange: y,
          onChangeLayer: e => {
            d()
          },
          disabled: s === DragAndDropObject.ToolState.DISABLED,
          addIcon: v,
          nudgeDisabled: g,
          nudgeMessage: f,
          onClick: t => {
            d(), t.stopPropagation(), c ? e.editDiscardChanges() : e.startAddingLabel()
          }
        })
      }
    )
  )
}

const { LABELS: io } = PhraseKey.WORKSHOP
@l.Z
class so extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.touchDevice = winCanTouch()),
      (this.onProgressUpdated = () => {
        this.setState({
          creationProgress: this.props.manager.editorData.progress
        })
      }),
      (this.onScreenPositionUpdated = () => {
        this.setState({
          screenPosition: this.props.manager.editorData.screenPosition
        })
      }),
      (this.onToolStateUpdated = () => {
        this.setState({
          toolState: this.props.manager.editorData.toolState
        })
      })
    const { editorData: t } = e.manager
    this.state = {
      toolState: t.toolState,
      screenPosition: t.screenPosition,
      creationProgress: 0
    }
  }
  componentDidMount() {
    const { editorData: e } = this.props.manager
    this.bindings.push(
      e.onToolStateChanged(this.onToolStateUpdated),
      e.onScreenPositionChanged(this.onScreenPositionUpdated),
      e.onProgressChanged(this.onProgressUpdated)
    )
  }
  componentWillUnmount() {
    for (const e of this.bindings) e.cancel()
  }
  renderOverlayMessage() {
    const { locale: e } = this.context,
      { toolState: t } = this.state,
      n = e.t(io.MOBILE_OVERLAY_MESSAGE)
    return this.touchDevice && t === DragAndDropObject.ToolState.ADDING
      ? (0, o.jsxs)(Ba.C, {
          children: [
            (0, o.jsx)("div", {
              className: "icon icon-press-hold"
            }),
            (0, o.jsx)(
              "span",
              Object.assign(
                {
                  className: "message"
                },
                {
                  children: n
                }
              )
            )
          ]
        })
      : null
  }
  render() {
    const { manager: e, popupEditor: t } = this.props,
      { toolState: n, creationProgress: i, screenPosition: s } = this.state,
      r = n === DragAndDropObject.ToolState.ADDING
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "overlay grid-overlay labels-overlay"
        },
        {
          children: [
            this.renderOverlayMessage(),
            (0, o.jsx)(to, {
              manager: e
            }),
            r &&
              (0, o.jsx)(Ha.B, {
                progress: i,
                screenPosition: s
              }),
            t &&
              (0, o.jsx)(Za, {
                manager: e,
                popup: !0
              })
          ]
        }
      )
    )
  }
}
so.contextType = AppReactContext

import * as Io from "../other/65428"
import * as Po from "../other/65596"
import * as co from "../other/66543"
import * as Ro from "../other/69092"
import * as Ko from "../7096"
import * as bl from "../other/74349"
import * as ql from "../other/75043"
import * as ao from "../other/76185"
import * as tl from "../other/80709"
import * as el from "../other/82419"
import * as Cl from "../other/82513"
import * as ll from "../other/82929"
import * as ho from "../other/85351"
import * as Co from "../other/89337"
import * as go from "../other/94859"
import * as nl from "../other/96766"
import * as po from "../other/97273"
import { TagOrderBy, TagsMode } from "../const/12150"
import { AnnotationGrouping } from "../const/63319"
import * as sl from "../other/12347"
import * as To from "../other/13585"
import * as mo from "../other/14874"
import * as vo from "../other/19048"
import * as Tl from "../other/25770"
import * as El from "../other/28121"
import * as Xo from "../other/30160"
import * as il from "../other/31457"
import * as Ol from "../other/32924"
import * as Ao from "../other/366"
import * as vl from "../other/43072"
import * as pl from "../other/44145"
import * as zo from "../other/44158"
import * as Do from "../other/46362"
import * as fo from "../other/54549"
import * as Mo from "../other/54963"
import * as uo from "../other/56843"
import * as ml from "../other/60440"
function oo(e, t, n) {
  let i = n || AnnotationGrouping.LAYER
  if ((t || i !== AnnotationGrouping.LAYER || (i = AnnotationGrouping.FLOOR), !e)) return i
  const { grouping: s } = e
  return s !== AnnotationGrouping.TYPE ? s : i
}
function lo(e) {
  const t = (0, ao.h)(),
    n = (0, q.y)(DataLayersFeatureKey, !1),
    [s, r] = (0, i.useState)(oo(t, n, e))
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        t && r(oo(t, n, e))
      }
      const s = t.onPropertyChanged("grouping", i)
      return i(), () => s.cancel()
    }, [t, n]),
    s
  )
}
const { LABELS: yo } = PhraseKey.WORKSHOP
function bo({ detailPanel: e, manager: t }) {
  const { commandBinder: n } = (0, i.useContext)(AppReactContext),
    s = lo(),
    r = Jr(),
    a = Qa(),
    l = ea(),
    d = (0, co.b)(yo.NUM_TYPE, yo.SELECTED_LABELS),
    h = !!(null == r ? void 0 : r.currentId) && a === DragAndDropObject.ToolState.EDITING
  return (0, o.jsxs)(o.Fragment, {
    children: [
      e
        ? (0, o.jsx)(
            uo.J,
            Object.assign(
              {
                open: h,
                scrollingDisabled: h,
                onClose: () => {
                  l &&
                    n.issueCommand(
                      new LabelToggleSelectCommand({
                        sid: l
                      })
                    )
                }
              },
              {
                children: (0, o.jsx)(Za, {
                  manager: t
                })
              }
            )
          )
        : (0, o.jsx)(Za, {
            manager: t,
            popup: !0
          }),
      (0, o.jsxs)(
        He.L,
        Object.assign(
          {
            toolId: ToolsList.LABELS,
            className: "labels-tool-panel",
            subheader: (0, o.jsx)(Eo, {}),
            title: d
          },
          {
            children: [
              (0, o.jsx)(fo.V, {
                grouping: s
              }),
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "panel-list"
                  },
                  {
                    children: (0, o.jsx)(ho.D, {
                      renderItem: na,
                      renderGroup: mo.s,
                      activeItemId: l,
                      grouping: s
                    })
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
function Eo() {
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsxs)("header", {
        children: [(0, o.jsx)(So, {}), (0, o.jsx)(vo.b, {})]
      }),
      (0, o.jsx)(po.B, {})
    ]
  })
}
function So() {
  const { commandBinder: e } = (0, i.useContext)(AppReactContext),
    t = (0, L.b)(),
    n = (0, go.O)()
  if (!n || !hasPolicySpacesElements(n)) return null
  const s = t.t(PhraseKey.WORKSHOP.LABELS.DEPRECATION_WARNING),
    r = t.t(PhraseKey.WORKSHOP.LABELS.OPEN_PROPERTY_TOOL_LABEL),
    a = (0, o.jsx)(
      si.r,
      Object.assign(
        {
          onClick: async () => {
            await e.issueCommand(new OpenToolCommand(ToolsList.ROOM_BOUNDS, !1))
          }
        },
        {
          children: r
        }
      )
    )
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "views-banner"
      },
      {
        children: (0, o.jsx)(ce.jL, {
          title: s,
          layout: "vertical",
          actions: a
        })
      }
    )
  )
}
class Oo {
  constructor(e, t) {
    ;(this.manager = e),
      (this.containerData = t),
      (this.renderPanel = () => {
        const e = this.isEditingInPopup()
        return (0, o.jsx)(bo, {
          detailPanel: !e,
          manager: this.manager
        })
      }),
      (this.renderOverlay = () => {
        const e = this.isEditingInPopup()
        return (0, o.jsx)(so, {
          manager: this.manager,
          popupEditor: e
        })
      })
  }
  isEditingInPopup() {
    return this.containerData.size.width > 700
  }
}
const { MEASUREMENTS: _o } = PhraseKey.WORKSHOP
function wo() {
  const e = lo(),
    t = (0, Yi.m)(),
    n = (0, co.b)(_o.NUM_TYPE, _o.SELECTED_MEASUREMENTS)
  return (0, o.jsxs)(
    He.L,
    Object.assign(
      {
        toolId: ToolsList.MEASUREMENTS,
        className: "measurements-panel",
        subheader: (0, o.jsx)(po.B, {}),
        controls: (0, o.jsx)(To.B, {}),
        title: n
      },
      {
        children: [
          (0, o.jsx)(fo.V, {
            grouping: e
          }),
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "panel-list"
              },
              {
                children: (0, o.jsx)(ho.D, {
                  renderItem: ds,
                  renderGroup: mo.s,
                  activeItemId: t,
                  grouping: e
                })
              }
            )
          )
        ]
      }
    )
  )
}
class No {
  constructor() {
    ;(this.renderPanel = () => (0, o.jsx)(wo, {})), (this.renderOverlay = () => (0, o.jsx)(Ao.f, {}))
  }
}
function ko() {
  const e = (0, Cs.w)(),
    [t, n] = (0, i.useState)(e ? e.tagsMode : null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onPropertyChanged("tagsMode", n)
      return () => t.cancel()
    }, [e]),
    t
  )
}
;(0, Ra.M)("tagsMode", ko)
function Lo() {
  return ko() === TagsMode.REORDERING
}
const jo = (0, Da.M)(TagsViewData, "tagOrder", TagOrderBy.FLOOR_ORDERED),
  { MATTERTAGS: Uo } = PhraseKey.WORKSHOP
function Fo() {
  const e = (0, L.b)(),
    t = jo(),
    { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext)
  function r(e) {
    n.trackToolGuiEvent("tags", `tags_view_${e}`), s.issueCommand(new TagOrderBySetCommand(e))
  }
  const a = t === TagOrderBy.ALPHABETICAL ? e.t(Uo.LIST_IN_TAG_TITLE_ORDER_LABEL) : e.t(Uo.LIST_IN_TAG_ORDER_LABEL),
    l = e.t(Uo.LIST_SORT_TAG_TITLE),
    d = e.t(Uo.LIST_SORT_TAG_ORDER)
  return (0, o.jsxs)(
    ce.xz,
    Object.assign(
      {
        className: "grouping-sort-menu-button",
        variant: ce.Wu.TERTIARY,
        label: a,
        ariaLabel: a,
        caret: !0
      },
      {
        children: [
          (0, o.jsx)(ce.zx, {
            label: l,
            size: ce.qE.SMALL,
            variant: ce.Wu.TERTIARY,
            onClick: () => {
              r(TagOrderBy.ALPHABETICAL)
            }
          }),
          (0, o.jsx)(ce.zx, {
            label: d,
            size: ce.qE.SMALL,
            variant: ce.Wu.TERTIARY,
            onClick: () => {
              r(TagOrderBy.ORDERED)
            }
          })
        ]
      }
    )
  )
}
const { MATTERTAGS: Ho } = PhraseKey.WORKSHOP
function Bo({ emptyList: e }) {
  const t = (0, L.b)(),
    { analytics: n, commandBinder: s } = (0, i.useContext)(AppReactContext),
    r = lo(),
    a = (0, Mo.v)(),
    l = (0, Ro.J)(),
    d = !e && !a && !l
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsx)(fo.V, {
        grouping: r
      }),
      (0, o.jsxs)(
        ce.w0,
        Object.assign(
          {
            className: "list-panel-controls"
          },
          {
            children: [
              (0, o.jsx)(Fo, {}),
              (0, o.jsx)(ce.zx, {
                size: ce.qE.SMALL,
                variant: ce.Wu.FAB,
                disabled: !d,
                onClick: () => {
                  n.trackToolGuiEvent("tags", "tags_click_reorder"), s.issueCommand(new SetReorderingModeCommand(TagsMode.REORDERING))
                },
                label: t.t(Ho.TAG_REORDER_ENTER_LABEL),
                theme: "dark"
              })
            ]
          }
        )
      )
    ]
  })
}
const { MATTERTAGS: Vo } = PhraseKey.WORKSHOP,
  Go = ({ item: e }) =>
    e
      ? (0, o.jsx)(
          Vs,
          {
            item: e
          },
          e.id
        )
      : null
function Wo() {
  const e = lo(),
    t = 0 === (0, Do.s)().length,
    n = (0, Ls.P)(),
    i = (0, co.b)(Vo.TAG_NUM_TYPE, Vo.SELECTED_TAGS),
    s = (0, o.jsx)(po.B, {})
  return (0, o.jsxs)(
    He.L,
    Object.assign(
      {
        toolId: ToolsList.TAGS,
        className: "tags-list-panel",
        title: i,
        subheader: s
      },
      {
        children: [
          (0, o.jsx)(Bo, {
            emptyList: t
          }),
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "panel-list"
              },
              {
                children: (0, o.jsx)(ho.D, {
                  renderItem: Go,
                  renderGroup: mo.s,
                  activeItemId: null == n ? void 0 : n.id,
                  grouping: e
                })
              }
            )
          )
        ]
      }
    )
  )
}
const $o = ({ item: e, isDragging: t, isDragOverlay: n }) => {
  const { id: s, label: r, description: a, color: l, icon: d } = e,
    { analytics: u, commandBinder: h } = (0, i.useContext)(AppReactContext),
    p = (0, oe.Y)(),
    m = (0, Ls.P)(),
    f = (0, o.jsx)(Ms, {
      label: r,
      description: a
    }),
    g = (0, o.jsx)(ce.hE, {
      children: (0, o.jsx)(ce.JO, {
        name: "reorder",
        className: "reorder-badge",
        size: ce.Jh.SMALL
      })
    }),
    v = B("search-result-item", "drag-mode", {
      "drag-overlay": n,
      "drag-selected": t
    })
  return (0, o.jsx)(ce.HC, {
    id: s,
    className: v,
    active: (null == m ? void 0 : m.id) === s,
    actions: g,
    title: f,
    badge: (0, o.jsx)(Hs, {
      color: l,
      icon: d
    }),
    onClick: () => {
      u.trackToolGuiEvent("tags", "tags_list_select_tag")
      const e = p ? TransitionTypeList.Instant : TransitionTypeList.FadeToBlack,
        t = p
      h.issueCommand(
        new TagOpenCommand(s, {
          transition: e,
          dock: t
        })
      )
    }
  })
}
const { MATTERTAGS: Yo, MODAL: qo } = PhraseKey.WORKSHOP,
  Zo = ({ item: e }) =>
    (0, o.jsx)(ce.sr, {
      item: e,
      Item: $o,
      className: "sortable-tag-list-item"
    })
function Qo() {
  const { commandBinder: e, analytics: t } = (0, i.useContext)(AppReactContext),
    n = (0, L.b)(),
    s = (0, zo.k)(!0),
    r = (function () {
      const e = (0, Cs.w)(),
        [t, n] = (0, i.useState)((null == e ? void 0 : e.hasCustomSortOrder()) || !1)
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          function t() {
            n((null == e ? void 0 : e.hasCustomSortOrder()) || !1)
          }
          const i = e.onChanged(t)
          return t(), () => i.cancel()
        }, [e]),
        t
      )
    })(),
    a = (0, Ls.P)(),
    [l, d] = (0, i.useState)(s),
    [h, p] = (0, i.useState)(null),
    m = (0, i.useCallback)(e => {
      null !== e && p(e)
    }, [])
  ;(0, i.useEffect)(() => (d(s), () => {}), [s]),
    (0, i.useEffect)(() => {
      if (a && h) {
        const e = l.findIndex(e => e.id === (null == a ? void 0 : a.id))
        if (-1 !== e) {
          const t = Ko.T6 * e
          ;((e, t, n) => {
            if (!(t > e.scrollTop && t + n < e.scrollTop + e.offsetHeight)) {
              const i = t - e.offsetHeight / 2 + n / 2
              e.scrollTo({
                top: i,
                behavior: "smooth"
              })
            }
          })(h, t, Ko.T6)
        }
      }
      return () => {}
    }, [a, h])
  const f = n.t(Yo.TAG_NUM_TYPE, l.length),
    g = r ? n.t(Yo.TAGS_ORDERED_BY_CUSTOM_LABEL) : n.t(Yo.TAGS_ORDERED_BY_LOCATION_LABEL),
    v = (0, o.jsxs)(
      ce.w0,
      Object.assign(
        {
          className: "list-panel-controls"
        },
        {
          children: [
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "ordered-by-label"
                },
                {
                  children: g
                }
              )
            ),
            (0, o.jsxs)(
              ce.hE,
              Object.assign(
                {
                  spacing: "small"
                },
                {
                  children: [
                    (0, o.jsx)(ce.zx, {
                      size: ce.qE.SMALL,
                      variant: ce.Wu.FAB,
                      label: n.t(Yo.TAG_RESET_ORDER),
                      onClick: async () => {
                        const n = {
                          title: Yo.TAGS_RESET_MODAL_TITLE,
                          message: Yo.TAGS_RESET_MODAL_BODY,
                          cancellable: !0,
                          cancelPhraseKey: qo.NO,
                          confirmPhraseKey: qo.YES
                        }
                        ;(await e.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, n))) !== ConfirmBtnSelect.CLOSE &&
                          (async () => {
                            t.trackToolGuiEvent("tags", "tags_reset_order"), await e.issueCommand(new TagOrderSaveCommand([]))
                          })()
                      },
                      disabled: !r,
                      theme: "dark"
                    }),
                    (0, o.jsx)(ce.zx, {
                      className: "tag-reorder-done",
                      size: ce.qE.SMALL,
                      variant: ce.Wu.FAB,
                      onClick: () => {
                        t.trackToolGuiEvent("tags", "tags_click_reorder_done"), e.issueCommand(new SetReorderingModeCommand(TagsMode.DEFAULT))
                      },
                      icon: "checkmark",
                      label: n.t(Yo.TAG_REORDER_EXIT_LABEL),
                      theme: "dark"
                    })
                  ]
                }
              )
            )
          ]
        }
      )
    )
  return (0, o.jsx)(
    He.L,
    Object.assign(
      {
        toolId: ToolsList.TAGS,
        className: "tags-list-panel reorder-mode",
        title: f,
        subheader: v
      },
      {
        children: (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: "tags-list tags-ordered-list list-contents",
              ref: m
            },
            {
              children: (0, o.jsx)(
                ce.cm,
                Object.assign(
                  {
                    items: l,
                    direction: "vertical",
                    Item: $o,
                    onSortEnd: n => {
                      const i = n.map(e => e.id)
                      t.trackToolGuiEvent("tags", "tags_reorder_saved"), e.issueCommand(new TagOrderSaveCommand(i)), d(n)
                    },
                    distance: 10
                  },
                  {
                    children: (0, o.jsx)(ce.CP, {
                      items: l,
                      itemHeight: Ko.T6,
                      renderItem: Zo,
                      intersectionRef: h
                    })
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
function Jo() {
  const e = Lo(),
    t = (0, Io.A)(),
    n = (0, Co.e)(),
    s = (0, Po.v)(),
    [r, a] = (0, i.useState)(n),
    l = s && t && t === ToolsList.LAYERS
  ;(0, i.useEffect)(() => {
    n && (null == n ? void 0 : n.id) !== (null == r ? void 0 : r.id) && a(n)
  }, [null == n ? void 0 : n.id])
  const c = n || r
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsx)(Xo.J, {
        closing: !n,
        tag: c
      }),
      e && (0, o.jsx)(Qo, {}),
      !e && !l && (0, o.jsx)(Wo, {})
    ]
  })
}
const { TAGS: rl } = PhraseKey.SHOWCASE,
  al = (0, i.memo)(() => {
    const e = winCanTouch(),
      t = (0, tl.P)(),
      n = (0, sl.z)(),
      i = (0, L.b)(),
      s = t === PinEditorState.CREATING,
      r = t === PinEditorState.PLACING
    let a = null
    if (s || !n || (!e && r)) {
      const t = i.t(e ? rl.OVERLAY_ADD_TOUCH : rl.OVERLAY_ADD_CLICK),
        s = i.t(e ? rl.OVERLAY_PLACE_TOUCH : rl.OVERLAY_PLACE_CLICK)
      a = n ? t : s
    }
    return a
      ? (0, o.jsxs)(Ba.C, {
          children: [
            (0, o.jsx)("div", {
              className: "icon icon-tags"
            }),
            (0, o.jsx)(
              "span",
              Object.assign(
                {
                  className: "message"
                },
                {
                  children: a
                }
              )
            )
          ]
        })
      : null
  })
function ol() {
  const e = (0, G.T)(),
    t = (0, tl.P)(),
    n = (0, qe.R)(),
    i = (0, Co.e)(),
    s = t === PinEditorState.CREATING,
    r = t === PinEditorState.PLACING,
    a = e === ToolPanelLayout.BOTTOM_PANEL
  if (n) return null
  const l = !(s || r) && !a && !i
  return (0, o.jsxs)(o.Fragment, {
    children: [
      l &&
        (0, o.jsx)(il.O, {
          overlay: !0,
          analyticAction: "tags_navigate_in_canvas"
        }),
      (0, o.jsx)(al, {})
    ]
  })
}
const { MATTERTAGS: cl } = PhraseKey.WORKSHOP
function dl({ manager: e }) {
  const t = (0, i.useRef)(null),
    n = (0, L.b)(),
    { commandBinder: s, analytics: r } = (0, i.useContext)(AppReactContext),
    a = (0, G.T)() === ToolPanelLayout.SIDE_PANEL,
    l = Lo(),
    d = (0, Mo.v)(),
    h = (0, Co.e)(),
    p = (0, Ls.P)(),
    m = (0, ll.u)(),
    f = (0, tl.P)() !== PinEditorState.IDLE
  function g() {
    t.current && t.current.dismissNudge()
  }
  const v = n.t(cl.ADD_TAG_TOOLTIP),
    y = n.t(cl.CANCEL_TAG_TOOLTIP),
    b = f ? y : v,
    E = n.t(cl.EDIT_TAG_TOOLTIP),
    S = n.t(cl.DELETE_TAG_TOOLTIP),
    O = n.t(cl.ADD_TAG_NUDGE),
    T = !a || f,
    _ = f ? Xa.d.CANCEL : Xa.d.ADD,
    w = f,
    A =
      a && !!p && !f && !l && !d && !h
        ? (0, o.jsx)(ce.zx, {
            className: "action-button-outer",
            icon: "toggle-pencil",
            variant: ce.Wu.FAB,
            theme: "overlay",
            tooltip: E,
            onClick: () => {
              g(),
                p &&
                  (r.trackToolGuiEvent("tags", "tags_overlay_edit_tag"),
                  s.issueCommand(
                    new TagOpenCommand(p.id, {
                      transition: TransitionTypeList.Interpolate,
                      dock: !0
                    })
                  ))
            }
          })
        : void 0,
    N =
      a && !!p && !f && !l
        ? (0, o.jsx)(ce.zx, {
            className: "action-button-outer",
            variant: ce.Wu.FAB,
            theme: "overlay",
            icon: "delete",
            tooltip: S,
            onClick: () => {
              g(),
                p &&
                  (d
                    ? s.issueCommand(new TagCancelEditsCommand())
                    : (r.trackToolGuiEvent("tags", "tags_overlay_click_delete"), e.confirmAndDeleteTag(p.id, "tags_tool_overlay_cta")))
            }
          })
        : void 0
  return (0, o.jsx)(
    fa.o,
    Object.assign(
      {
        outerLeft: A,
        outerRight: N
      },
      {
        children: (0, o.jsx)(Ja.W, {
          ref: t,
          allowLayerChange: w,
          addIcon: _,
          disabled: !m,
          onClick: () => {
            g(),
              f
                ? d && s.issueCommand(new TagCancelEditsCommand())
                : (r.trackToolGuiEvent("tags", "tags_overlay_click_add"), s.issueCommand(new TagStartAddCommand()))
          },
          tooltip: b,
          nudgeDisabled: T,
          nudgeMessage: O,
          nudgeLocalStorage: UserPreferencesKeys.TagsAddNudgeSeen
        })
      }
    )
  )
}

function ul({ manager: e }) {
  const { commandBinder: t } = (0, i.useContext)(AppReactContext),
    n = (0, qe.R)(),
    s = (0, el.A)(),
    r = (0, tl.P)(),
    a = (0, nl.v)(),
    l = r === PinEditorState.PRESSING
  return (
    (0, i.useEffect)(() => (r === PinEditorState.PLACED && t.issueCommand(new ToolPanelToggleCollapseCommand(!1)), () => {}), [r, t]),
    n
      ? null
      : (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: "overlay grid-overlay tags-overlay tags-tool-overlay"
            },
            {
              children: [
                (0, o.jsx)(ol, {}),
                (0, o.jsx)(dl, {
                  manager: e
                }),
                l &&
                  (0, o.jsx)(Ha.B, {
                    progress: s,
                    screenPosition: a
                  })
              ]
            }
          )
        )
  )
}
class hl {
  constructor(e) {
    ;(this.manager = e),
      (this.renderOverlay = () =>
        (0, o.jsx)(ul, {
          manager: this.manager
        })),
      (this.renderPanel = () => (0, o.jsx)(Jo, {}))
  }
}
const { NOTES: fl } = PhraseKey.SHOWCASE
function gl() {
  const e = (0, bs.M)(),
    t = lo(),
    n = (function () {
      const e = (0, Do.s)(),
        t = (0, qi.A)(),
        n = (0, ml.M)(),
        i = (0, Ro.J)(),
        s = (0, L.b)()
      return i ? s.t(t ? fl.SELECTED_COMMENTS : fl.SELECTED_NOTES, n.length) : s.t(t ? fl.COMMENTS : fl.NOTES, e.length)
    })(),
    i = (0, Ro.J)()
  return (0, o.jsxs)(
    pl.s,
    Object.assign(
      {
        title: n,
        hideBadge: i
      },
      {
        children: [
          (0, o.jsx)(fo.V, {
            grouping: t
          }),
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "panel-list"
              },
              {
                children: (0, o.jsx)(ho.D, {
                  renderItem: _s,
                  renderGroup: mo.s,
                  activeItemId: null == e ? void 0 : e.id,
                  grouping: t
                })
              }
            )
          )
        ]
      }
    )
  )
}
class yl {
  constructor() {
    ;(this.renderPanel = () => (0, o.jsx)(gl, {})), (this.renderOverlay = () => (0, o.jsx)(vl.R, {}))
  }
}
function Sl() {
  const e = (0, El.P)(),
    [t, n] = (0, i.useState)((null == e ? void 0 : e.getAlignedSweeps()) || [])
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && n(e.getAlignedSweeps())
      }
      const i = e.onSweepsChanged(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
const _l = useDataHook(ToursViewData),
  wl = (0, Da.M)(LayersData, "currentViewId", "")
function Al(e) {
  const t = gi(),
    [n, s] = (0, i.useState)(!!(null == t ? void 0 : t.isStartLocation(e)))
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function n() {
        s(!!(null == t ? void 0 : t.isStartLocation(e)))
      }
      const i = t.onStartLocationSweepsChanged(n)
      return n(), () => i.cancel()
    }, [t, e]),
    n
  )
}
function Nl(e) {
  const t = gi(),
    n = wl(),
    [s, r] = (0, i.useState)(!!(null == t ? void 0 : t.isStartLocationForView(e, n)))
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        r(!!(null == t ? void 0 : t.isStartLocationForView(e, n)))
      }
      const s = t.onStartLocationSweepsChanged(i)
      return i(), () => s.cancel()
    }, [t, e, n]),
    s
  )
}
const Il = useDataHook(SweepsViewData)
function Pl() {
  const e = Il(),
    [t, n] = (0, i.useState)((null == e ? void 0 : e.selectedSweep) || null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onSelectedSweepChanged(n)
      return n(e.selectedSweep), () => t.cancel()
    }, [e]),
    t
  )
}
const { SCANS: xl } = PhraseKey.WORKSHOP,
  kl = ({ item: e }) =>
    e
      ? (0, o.jsx)(Ll, {
          item: e
        })
      : null
function Ll({ item: e }) {
  const { id: t, index: n, enabled: s } = e,
    { analytics: r, commandBinder: a } = (0, i.useContext)(AppReactContext),
    l = (0, q.y)(ModelViewsFeatureKey, !1),
    h = (0, $.Q)(ToolsList.SCANS_3D),
    p = (0, G.T)(),
    m = (0, L.b)(),
    f = Pl(),
    g = (function (e) {
      const t = _l(),
        [n, s] = (0, i.useState)(!!(null == t ? void 0 : t.isSweepInAnyTour(e)))
      return (
        (0, i.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            s(!!(null == t ? void 0 : t.isSweepInAnyTour(e)))
          }
          const i = t.onSweepsInToursChanged(n)
          return n(), () => i.cancel()
        }, [t, e]),
        n
      )
    })(t),
    v = (function (e) {
      const t = _l(),
        n = wl(),
        [s, r] = (0, i.useState)(!!(null == t ? void 0 : t.isSweepInTourForView(e, n)))
      return (
        (0, i.useEffect)(() => {
          if (!t) return () => {}
          function i() {
            r(!!(null == t ? void 0 : t.isSweepInTourForView(e, n)))
          }
          const s = t.onSweepsInToursChanged(i)
          return i(), () => s.cancel()
        }, [t, e, n]),
        s
      )
    })(t),
    y = Al(t),
    b = Nl(t)
  if (!h) return null
  const E = h.manager,
    S = t === f,
    O = !s,
    T = l && !v ? m.t(xl.HLR_IN_OTHER_VIEWS) : m.t(xl.HLR_LIST_ITEM_TOOLTIP_MESSAGE),
    _ = l && !b ? m.t(xl.START_LOCATION_SCAN_IN_OTHER_VIEWS) : m.t(xl.START_LOCATION_LIST_ITEM_TOOLTIP_MESSAGE),
    w = m.t(xl.LIST_ITEM_TEXT, n + 1),
    A = m.t(xl.SHOW_LIST_ITEM_TOOLTIP_MESSAGE),
    N = y ? m.t(xl.NO_HIDE_LIST_ITEM_TOOLTIP_MESSAGE) : m.t(xl.HIDE_LIST_ITEM_TOOLTIP_MESSAGE),
    I = s ? "eye-show" : "eye-hide",
    P = s ? N : A,
    x = (0, o.jsx)(ce.zx, {
      icon: I,
      dimmed: y,
      variant: ce.Wu.TERTIARY,
      onClick: e => {
        e.stopPropagation(), y || (r.trackToolGuiEvent("3d_scans", "drawer_scan_visibility_modified"), E.toggleSweepVisibility(t, !s))
      },
      tooltip: P,
      tooltipOptions: {
        placement: "bottom-end",
        size: "small"
      }
    }),
    k = (0, o.jsx)(ts.C, {
      iconClass: "icon-toolbar-scan-mgmt"
    }),
    C = g && s,
    D =
      y || C
        ? (0, o.jsxs)(ce.hE, {
            children: [
              y &&
                (0, o.jsx)(Sa.P, {
                  icon: "start-location",
                  tooltip: _,
                  size: ce.qE.SMALL,
                  popupSize: "medium",
                  variant: ce.Wu.FAB,
                  theme: "dark"
                }),
              C &&
                (0, o.jsx)(Sa.P, {
                  icon: "hlr",
                  tooltip: T,
                  size: ce.qE.SMALL,
                  popupSize: "medium",
                  variant: ce.Wu.FAB,
                  theme: "dark"
                })
            ]
          })
        : void 0
  return (0, o.jsx)(
    ce.HC,
    {
      id: t,
      className: "search-result-item scan-list-item",
      title: w,
      actions: x,
      badge: k,
      decals: D,
      active: S,
      disabled: O,
      onClick: async () => {
        E.selectScan(t), p === ToolPanelLayout.BOTTOM_PANEL && a.issueCommand(new ToolPanelToggleCollapseCommand(!0))
      }
    },
    t
  )
}
const { SCANS: Dl } = PhraseKey.WORKSHOP,
  Rl = ({ group: e }) => {
    const { id: t, items: n } = e,
      i = n.length
    return (0, o.jsx)(Cl.J, {
      id: t,
      numItems: i
    })
  }
function Ml() {
  const e = (0, L.b)(),
    t = Sl(),
    n = (function (e) {
      const t = (0, Ol.W)(),
        [n, s] = (0, i.useState)([])
      return (
        (0, i.useEffect)(() => {
          const n = t.reduce(
            (e, t, n) =>
              Object.assign(Object.assign({}, e), {
                [t.id]: {
                  id: t.id,
                  items: []
                }
              }),
            {}
          )
          return (
            e.forEach(e => {
              const t = e.floorId || ""
              n[t] && n[t].items.push(e)
            }),
            s(Object.values(n)),
            () => {}
          )
        }, [t, e]),
        n
      )
    })(t),
    s = t.length,
    r = e.t(Dl.NUM_TYPE, s),
    [a, l] = (0, bl.s)(),
    c = (0, o.jsx)("header", {
      children: (0, o.jsx)(Tl.z, {
        toolId: ToolsList.SCANS_3D
      })
    })
  return (0, o.jsx)(
    He.L,
    Object.assign(
      {
        toolId: ToolsList.SCANS_3D,
        className: "scans-panel",
        title: r,
        subheader: c
      },
      {
        children: (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: "panel-list"
            },
            {
              children: (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "list-contents"
                  },
                  {
                    children: (0, o.jsx)(ce.UQ, {
                      ariaExpandLabel: e.t(PhraseKey.ACCORDIONS.EXPAND),
                      ariaCollapseLabel: e.t(PhraseKey.ACCORDIONS.COLLAPSE),
                      data: n,
                      itemHeight: 60,
                      renderItem: kl,
                      renderGroup: Rl,
                      onToggleCollapse: l,
                      collapsedIds: a
                    })
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
const { SCANS: Ul } = PhraseKey.WORKSHOP
function Fl(e, t) {
  return !(!t || !e) && t.isStartLocation(e)
}
function Hl() {
  const e = (0, $.Q)(ToolsList.SCANS_3D),
    t = e ? e.manager : void 0,
    n = (0, L.b)(),
    s = Pl(),
    r = (function (e) {
      const t = (0, El.P)(),
        [n, s] = (0, i.useState)(e && t ? t.getSweep(e) : null)
      return (
        (0, i.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            s(e && t ? t.getSweep(e) : null)
          }
          const i = t.onSweepsChanged(n)
          return n(), () => i.cancel()
        }, [t, e]),
        n
      )
    })(s),
    a = Sl().filter(e => e.enabled),
    [l, c] = (0, i.useState)(!1),
    [d, h] = (0, i.useState)(Fl(s, t)),
    p = () => h(Fl(s, t)),
    m = !d && r && (a.length > 1 || !r.enabled)
  if (
    ((0, Z.U)(ModelViewChangeCompleteMessage, p),
    (0, i.useEffect)(() => {
      m || c(!1)
    }, [m]),
    (0, i.useEffect)(() => {
      p()
    }, [s]),
    !r || r.alignmentType !== AlignmentType.ALIGNED || !t)
  )
    return null
  const f = n.t(Ul.START_LOCATION_TOOLTIP_TITLE),
    g = n.t(Ul.START_LOCATION_TOOLTIP_MESSAGE),
    v = r.index + 1,
    y = n.t(r.enabled ? Ul.OVERLAY_HIDE_SCAN_CTA : Ul.OVERLAY_SHOW_SCAN_CTA, v),
    b = d && !l
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "overlay grid-overlay scans-overlay"
      },
      {
        children: (0, o.jsx)(fa.o, {
          children: (0, o.jsx)(oa.L, {
            size: ce.qE.SMALL,
            variant: ce.Wu.FAB,
            theme: "dark",
            label: y,
            dimmed: !m,
            onClick: () => {
              m ? r && (a.length > 1 || !r.enabled) && t.toggleSweepVisibility(r.id, !r.enabled) : c(!l)
            },
            nudgeMessage: g,
            nudgeTitle: f,
            nudgeDisabled: !b,
            onNudgeDismissed: () => c(!0),
            showTimeout: 500,
            dismissTimeout: 5e3,
            nudgeSize: "medium"
          })
        })
      }
    )
  )
}
class Bl {
  constructor() {
    ;(this.renderOverlay = () => (0, o.jsx)(Hl, {})), (this.renderPanel = () => (0, o.jsx)(Ml, {}))
  }
}
function Vl() {
  const e = (0, L.b)(),
    t = e.t(PhraseKey.WORKSHOP.START_LOCATION.TAG_ORDER_RESET_MESSAGE),
    n = e.t(PhraseKey.WORKSHOP.START_LOCATION.TAG_ORDER_RESET_HELP_LINK)
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsx)(
        "p",
        Object.assign(
          {
            className: "modal-message"
          },
          {
            children: t
          }
        )
      ),
      (0, o.jsx)(
        si.r,
        Object.assign(
          {
            href: ""
          },
          {
            children: n
          }
        )
      )
    ]
  })
}
const { START_LOCATION: Gl } = PhraseKey.WORKSHOP,
  Wl = new DebugInfo("start-location-bar"),
  zl = {
    [Ws.OK]: Gl.ENABLED_MESSAGE,
    [Ws.BUSY]: "",
    [Ws.HIDDEN_SWEEP]: Gl.HIDDEN_SWEEP_MESSAGE,
    [Ws.UNPLACED_360]: Gl.UNPLACED_360_MESSAGE
  },
  $l = {
    [Ws.OK]: Gl.ENABLED_TOOLTIP_TITLE,
    [Ws.BUSY]: "",
    [Ws.HIDDEN_SWEEP]: Gl.DISABLED_TOOLTIP_TITLE,
    [Ws.UNPLACED_360]: Gl.DISABLED_TOOLTIP_TITLE
  }
function Kl({ manager: e }) {
  const t = (0, L.b)(),
    { analytics: n } = (0, i.useContext)(AppReactContext),
    s = (0, oe.Y)(),
    [r, a] = (0, i.useState)(!1),
    [l, d] = (0, i.useState)(e.startLocationToolState),
    u = (function () {
      const e = mi(),
        t = gi(),
        [n, s] = (0, i.useState)((null == e ? void 0 : e.thumb) || null)
      return (
        (0, i.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            e && s((null == e ? void 0 : e.thumb) || null)
          }
          const i = t.onStartLocationSweepsChanged(n)
          return n(), () => i.cancel()
        }, [e, t]),
        n
      )
    })(),
    h = l === Ws.BUSY,
    p = l === Ws.OK
  ;(0, i.useEffect)(() => {
    const t = e.onStartLocToolStateChanged(d)
    return d(e.startLocationToolState), () => t.cancel()
  }, [e])
  const m = !h && !p,
    f = t.t(h ? Gl.SETTING_NEW_LOCATION_CTA : Gl.SET_NEW_LOCATION_CTA),
    g = $l[l],
    v = g ? t.t(g) : g,
    y = zl[l],
    b = y ? t.t(y) : y,
    E = (0, o.jsx)(
      "span",
      Object.assign(
        {
          className: "thumbnail-label"
        },
        {
          children: t.t(Gl.THUMBNAIL_PREVIEW_CTA)
        }
      )
    )
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "overlay grid-overlay start-location-overlay"
      },
      {
        children: [
          (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: B({
                  "overlay-top-center": !s
                })
              },
              {
                children:
                  h || !u
                    ? (0, o.jsx)(
                        "div",
                        Object.assign(
                          {
                            className: B("thumbnail", "start-location-thumbnail", "loading")
                          },
                          {
                            children: E
                          }
                        )
                      )
                    : (0, o.jsx)(
                        ei.X,
                        Object.assign(
                          {
                            resource: u,
                            className: B("thumbnail", "start-location-thumbnail"),
                            onClick: () => {
                              l !== Ws.BUSY && e.gotoStartLocation()
                            }
                          },
                          {
                            children: E
                          }
                        )
                      )
              }
            )
          ),
          (0, o.jsx)(fa.o, {
            children: (0, o.jsx)(oa.L, {
              size: ce.qE.SMALL,
              variant: ce.Wu.FAB,
              theme: "dark",
              label: f,
              dimmed: m,
              active: h,
              onClick: () => {
                l === Ws.OK
                  ? e.updateStartLocation((0, o.jsx)(Vl, {})).catch(e => {
                      Wl.error(e)
                    })
                  : a(!r)
              },
              nudgeMessage: b,
              nudgeTitle: v,
              nudgeDisabled: r,
              onNudgeDismissed: () => {
                p && n.trackGuiEvent("start_location_nudge_seen"), a(!0)
              },
              showTimeout: 500,
              dismissTimeout: 5e3,
              nudgeSize: "medium",
              featured: p
            })
          })
        ]
      }
    )
  )
}
class Yl {
  constructor(e) {
    ;(this.manager = e),
      (this.renderOverlay = () =>
        (0, o.jsx)(Kl, {
          manager: this.manager
        }))
  }
}
const Ql = "View-360-Help",
  Xl = new DebugInfo("360 Views Overlay"),
  { VIEWS_360: Jl } = PhraseKey.WORKSHOP
class ec extends i.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.viewMap = {}),
      (this.updateSelectedSweep = () => {
        const e = this.props.manager.dataMap.sweepViewData.selectedSweep
        this.close360ListIfNeeded(e),
          this.setState({
            selected360: e
          })
      }),
      (this.onViewModeChange = () => {
        this.setState({
          viewmode: this.props.manager.dataMap.viewmodeData.currentMode
        })
      }),
      (this.update360Views = () => {
        const e = this.props.manager.dataMap.sweepViewData,
          t = e.getAlignedSweeps(!1)
        let n = null
        const i = {}
        t.map((t, s) => {
          ;(i[t.id] = {
            index: s + 1,
            placed: t.placed
          }),
            t.placed && e.selectedSweep === t.id && (n = t.id)
        }),
          (this.viewMap = i),
          this.setState({
            selected360: n
          })
      }),
      (this.onToolStateUpdated = () => {
        this.setState({
          toolState: this.props.manager.dataMap.sweepViewData.toolState
        })
      }),
      (this.remove = () => {
        const { manager: e } = this.props,
          { selected360: t } = this.state,
          n = !(!t || !e.isStartLocation(t))
        t && !n && (e.unplace360(t), this.sendTrackingEvent("click_360_menu_remove"))
      }),
      (this.clickCTAButton = e => {
        const { selected360: t, toolState: n } = this.state,
          { manager: i } = this.props
        t &&
          (e.stopPropagation(),
          n === xr._.ROTATING
            ? (i.cancelRotate360(t), this.sendTrackingEvent("click_360_menu_rotate_cancel"))
            : n === xr._.ROTATED
              ? (i.saveRotate360(t), this.sendTrackingEvent("click_360_menu_rotate_done"))
              : (i.rotate360(t), this.sendTrackingEvent("click_360_menu_rotate")))
      }),
      (this.preview = () => {
        const { selected360: e } = this.state
        e && (this.props.manager.preview360(e), this.sendTrackingEvent("click_360_menu_preview"))
      }),
      (this.nudgeDismissed = () => {
        this.sendTrackingEvent("rotate_nudge_seen")
      })
    const { sweepViewData: t, viewmodeData: n } = e.manager.dataMap,
      i = t.selectedSweep
    this.state = {
      toolState: t.toolState,
      selected360: i,
      viewmode: n.currentMode
    }
  }
  componentDidMount() {
    const { sweepViewData: e } = this.props.manager.dataMap,
      { messageBus: t } = this.context
    this.update360Views(),
      this.bindings.push(
        e.onSelectedSweepChanged(this.updateSelectedSweep),
        e.onToolStateChanged(this.onToolStateUpdated),
        t.subscribe(EndSwitchViewmodeMessage, this.onViewModeChange),
        t.subscribe(UnalignedPlacedMessage, this.update360Views),
        t.subscribe(UnalignedUnplacedMessage, this.update360Views)
      )
  }
  componentWillUnmount() {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
  close360ListIfNeeded(e) {
    const { toolPanelLayout: t } = this.props,
      { selected360: n, viewmode: i } = this.state,
      { commandBinder: s } = this.context
    if (e && e !== n && t === ToolPanelLayout.BOTTOM_PANEL && (i === ViewModes.Floorplan || i === ViewModes.Dollhouse)) {
      const t = e ? this.viewMap[e] : null
      t && t.placed && s.issueCommand(new ToolPanelToggleCollapseCommand(!0))
    }
  }
  hasPlacedViews() {
    for (const e in this.viewMap) if (this.viewMap[e].placed) return !0
    return !1
  }
  getOverlayInfo() {
    const { locale: e } = this.context,
      t = this.props.manager.getViewing360()
    if (t) {
      const n = this.viewMap[t.id]
      if (!n) return Xl.debug(`Sweep missing from viewmap - ${t.id}`), e.t(Jl.OVERLAY_INFO_MISSING_SWEEP)
      const i =
        t.name ||
        e.t(Jl.DEFAULT_NAME, {
          index: n.index
        })
      return e.t(Jl.OVERLAY_INFO_CURRENT_SWEEP, {
        name: i
      })
    }
    const { selected360: n, viewmode: i } = this.state,
      s = n ? this.viewMap[n] : null
    return !!s && s.placed && s && (i === ViewModes.Floorplan || i === ViewModes.Dollhouse)
      ? e.t(Jl.OVERLAY_INFO_SELECTED_SWEEP, {
          index: s.index
        })
      : null
  }
  renderOverlayMessage() {
    if (this.hasPlacedViews()) return null
    const e = this.context.locale.t(Jl.OVERLAY_MESSAGE)
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "overlay-message"
        },
        {
          children: (0, o.jsx)(
            "span",
            Object.assign(
              {
                id: Ql,
                className: "message"
              },
              {
                children: e
              }
            )
          )
        }
      )
    )
  }
  render() {
    const { manager: e } = this.props
    if (0 === e.dataMap.sweepViewData.getAlignedSweeps(!1).length) return null
    const { locale: t } = this.context,
      { selected360: n, viewmode: i, toolState: s } = this.state,
      r = n ? this.viewMap[n] : null,
      a = !(!n || !r) && r.placed,
      l = s === xr._.ROTATED,
      c = s === xr._.ROTATING,
      d = !(!n || !e.isStartLocation(n)),
      u = a && (i === ViewModes.Floorplan || i === ViewModes.Dollhouse),
      h = u && !d,
      p = this.getOverlayInfo(),
      m = t.t(Jl.ROTATE_TOOLTIP_TITLE),
      f = t.t(Jl.ROTATE_TOOLTIP_MESSAGE),
      g = u && d,
      v = t.t(Jl.START_LOCATION_REMOVAL_MESSAGE),
      y = g ? v : void 0,
      b = l ? Xa.d.CONFIRM : c ? Xa.d.CANCEL : "rotate",
      E = (0, o.jsx)(ce.zx, {
        className: "action-button-outer",
        icon: "fullscreen2",
        variant: ce.Wu.FAB,
        theme: "overlay",
        disabled: !u,
        onClick: this.preview
      }),
      S = (0, o.jsx)(ce.zx, {
        className: "action-button-outer",
        icon: "delete",
        variant: ce.Wu.FAB,
        theme: "overlay",
        disabled: !u,
        dimmed: g,
        onClick: this.remove,
        tooltip: y,
        tooltipOptions: {
          theme: "light"
        }
      })
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "overlay grid-overlay views360-overlay"
        },
        {
          children: [
            p &&
              (0, o.jsx)(ql.u, {
                children: p
              }),
            this.renderOverlayMessage(),
            (0, o.jsx)(
              fa.o,
              Object.assign(
                {
                  outerLeft: E,
                  outerRight: S
                },
                {
                  children: (0, o.jsx)(Xa.H, {
                    addIcon: b,
                    onClick: this.clickCTAButton,
                    disabled: !u,
                    ariaDescribedBy: Ql,
                    nudgeDisabled: !h,
                    nudgeMessage: f,
                    nudgeTitle: m,
                    nudgeSessionKey: "rotate-nudge-seen",
                    showTimeout: 1e3,
                    dismissTimeout: 5e3,
                    onNudgeDismissed: this.nudgeDismissed
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
  sendTrackingEvent(e) {
    var t
    this.context.analytics.trackToolGuiEvent("360_views", e, {
      panoId: null !== (t = this.state.selected360) && void 0 !== t ? t : void 0
    })
  }
}
ec.contextType = AppReactContext
const tc = (0, G.f)(ec)

import * as Sd from "semver"
import * as xc from "../other/20334"
import { tryGetModuleBySymbolSync } from "../other/24085"
import * as Ac from "../other/38613"
import * as _c from "../other/48787"

import * as Dc from "../other/72400"
import * as $c from "../other/76092"
import { MaxTrimsPerFloor } from "../const/97178"
import * as zc from "../other/59084"
import { MeshTrimViewState, ViewChangeState, isValidViewChange } from "../webgl/49123"

import { SetGizmoControlModeCommand } from "../command/attachment.command"
import {
  AttachmentAssociateWithPluginCommand,
  PluginConfigFetchDataCommand,
  PluginLoadCommand,
  PluginReloadCommand,
  PluginResetAllCommand,
  PluginUnloadCommand
} from "../command/plugin.command"
import * as Pc from "../const/17881"
import { EditorState } from "../const/24730"
import * as ac from "../const/41602"
import * as ed from "../const/49623"
import { defaultMeshGroup } from "../const/52498"
import { FeaturesMeshtrimKey } from "../const/meshtrim.const"
import { AvailablePluginData } from "../data/available.plugin.data"
import { MeshTrimViewData } from "../data/meshTrimView.data"
import { ToolObject } from "../object/tool.object"
import { ObservableArray } from "../observable/observable.array"

enum nc {
  DRAGGING = 3,
  IDLE = 0,
  PRESSED = 2,
  PRESSING = 1
}
enum ic {
  NONE = "",
  X = "x",
  Y = "y"
}
class oc extends i.Component {
  constructor(e) {
    super(e),
      (this.listening = !1),
      (this.longPressTimer = 0),
      (this.element = null),
      (this.mobile = isMobilePhone()),
      (this.onPressStart = e => {
        const t = this.getPosition(e)
        this.state.interactionState !== nc.IDLE && this.resetState(),
          this.mobile
            ? (this.setState({
                startPosition: t,
                interactionState: nc.PRESSING
              }),
              this.props.onLongPressing && this.props.onLongPressing(e),
              this.toggleMobileEvents(!0),
              (this.longPressTimer = window.setTimeout(() => this.onPressFired(e), oc.longPressDuration)))
            : this.onPressFired(e)
      }),
      (this.onPressFired = e => {
        ;(this.mobile && this.state.interactionState !== nc.PRESSING) ||
          (this.setState({
            interactionState: nc.PRESSED
          }),
          this.props.onPressed && this.props.onPressed(this.getPosition(e)))
      }),
      (this.handleMove = e => {
        const { interactionState: t } = this.state,
          n = this.getPosition(e)
        t === nc.PRESSING
          ? this.hasQuickDragged(e)
            ? this.onPressFired(e)
            : this.isValidPressMovement(e) || (this.props.onCancelPressing && this.props.onCancelPressing(), this.resetState())
          : t === nc.PRESSED &&
            this.hasMovedEnough(n) &&
            this.setState({
              interactionState: nc.DRAGGING
            }),
          t === nc.DRAGGING && this.props.onDragging && this.props.onDragging(n)
      }),
      (this.handleRelease = e => {
        switch (this.state.interactionState) {
          case nc.PRESSED:
            this.props.onClickAndRelease && this.props.onClickAndRelease(this.getPosition(e))
            break
          case nc.PRESSING:
            this.props.onCancelPressing && this.props.onCancelPressing()
            break
          case nc.DRAGGING:
            this.props.onDragAndRelease && this.props.onDragAndRelease(this.getPosition(e))
        }
        this.resetState()
      }),
      (this.resetState = () => {
        window.clearTimeout(this.longPressTimer),
          this.setState({
            interactionState: nc.IDLE
          }),
          this.toggleMobileEvents(!1)
      }),
      (this.setElement = e => {
        e && !this.element && ((this.element = e), this.props.enabled && this.toggleDownEventListening(!0))
      }),
      (this.state = {
        interactionState: nc.IDLE,
        startPosition: {
          x: 0,
          y: 0
        }
      })
  }
  componentDidUpdate(e) {
    this.element &&
      (!e.enabled && this.props.enabled ? this.toggleDownEventListening(!0) : e.enabled && !this.props.enabled && this.toggleDownEventListening(!1))
  }
  componentWillUnmount() {
    this.element && this.props.enabled && this.toggleDownEventListening(!1), this.toggleMobileEvents(!1)
  }
  toggleDownEventListening(e) {
    if (!this.element) return
    const t = this.onPressStart
    e
      ? window.PointerEvent
        ? this.element.addEventListener("pointerdown", t)
        : (this.element.addEventListener("mousedown", t), this.element.addEventListener("touchstart", t))
      : window.PointerEvent
        ? this.element.removeEventListener("pointerdown", t)
        : (this.element.removeEventListener("mousedown", t), this.element.removeEventListener("touchstart", t))
  }
  toggleMobileEvents(e) {
    !this.listening && e
      ? ((this.listening = !0), window.addEventListener("pointerup", this.handleRelease), window.addEventListener("pointermove", this.handleMove))
      : this.listening &&
        !e &&
        ((this.listening = !1), window.removeEventListener("pointerup", this.handleRelease), window.removeEventListener("pointermove", this.handleMove))
  }
  getPosition(e) {
    return isTouchEvent(e)
      ? {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
      : {
          x: e.clientX,
          y: e.clientY
        }
  }
  hasQuickDragged(e) {
    const { quickDrag: t } = this.props
    if (t === ic.NONE) return !1
    const { startPosition: n } = this.state,
      i = this.getPosition(e),
      s = t === ic.X ? ic.Y : ic.X
    return Math.abs(n[t] - i[t]) > oc.quickDragAxisThreshold && Math.abs(n[s] - i[s]) < oc.quickDragCrossAxisThreshold
  }
  isValidPressMovement(e) {
    const { startPosition: t } = this.state,
      n = this.getPosition(e)
    return !(Math.abs(t.x - n.x) >= oc.longPressMoveThreshold || Math.abs(t.y - n.y) >= oc.longPressMoveThreshold)
  }
  hasMovedEnough(e) {
    return Math.sqrt(Math.pow(e.x - this.state.startPosition.x, 2) + Math.pow(e.y - this.state.startPosition.y, 2)) > ac.JU
  }
  getElement() {
    return this.element
  }
  render() {
    const { children: e, className: t } = this.props
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: t,
          ref: this.setElement
        },
        {
          children: e
        }
      )
    )
  }
}
oc.longPressDuration = 300
oc.longPressMoveThreshold = 5
oc.quickDragAxisThreshold = 5
oc.quickDragCrossAxisThreshold = 10
var lc = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}
const { VIEWS_360: cc } = PhraseKey.WORKSHOP
@l.Z
class dc extends i.Component {
  constructor(e) {
    super(e),
      (this.onImageLoadingError = () => {
        this.context.analytics.track("unaligned_image_failed", {
          sweepId: this.props.sweepId
        })
      }),
      (this.select360 = () => {
        this.props.manager.select360(this.props.sweepId, this.props.placed)
      }),
      (this.onLongPressing = () => {
        this.props.manager.startPressingToPlace360(this.props.sweepId)
      }),
      (this.onPlacing360 = e => {
        this.props.manager.placing360(this.props.sweepId, this.props.url, e)
      }),
      (this.onCancelPressing = () => {
        this.props.manager.cancelPlacing360()
      }),
      (this.goToPreview = e => {
        e.stopPropagation(),
          this.props.manager.preview360(this.props.sweepId),
          this.context.analytics.trackToolGuiEvent("360_views", "click_360_card_preview", {
            panoId: this.props.sweepId
          })
      })
  }
  render() {
    const { locale: e } = this.context,
      { placed: t, selected: n, url: i, horizontal: s, dataIndex: r, loaded: a, onImageLoaded: l } = this.props,
      c = !a,
      d = s ? ic.Y : ic.X,
      u = e.t(cc.UNPLACED_CARD_MESSAGE)
    return (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: B("card", {
            loading: c,
            placed: t,
            selected: n
          }),
          onClick: this.select360
        },
        {
          children: [
            (0, o.jsxs)(
              oc,
              Object.assign(
                {
                  className: "thumbnail card-image",
                  quickDrag: d,
                  enabled: !t,
                  onLongPressing: this.onLongPressing,
                  onPressed: this.onPlacing360,
                  onCancelPressing: this.onCancelPressing
                },
                {
                  children: [
                    i &&
                      (0, o.jsx)("img", {
                        src: i,
                        onLoad: l,
                        onError: this.onImageLoadingError
                      }),
                    !t &&
                      (0, o.jsx)(
                        "div",
                        Object.assign(
                          {
                            className: "thumbnail-label"
                          },
                          {
                            children: u
                          }
                        )
                      )
                  ]
                }
              )
            ),
            t &&
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "placed-number"
                  },
                  {
                    children: (0, o.jsx)("span", {
                      children: r + 1
                    })
                  }
                )
              ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "menu-icons"
                },
                {
                  children: (0, o.jsx)("span", {
                    className: "icon icon-fullscreen2",
                    onClick: this.goToPreview
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
dc.contextType = AppReactContext

const uc = dc,
  { VIEWS_360: hc } = PhraseKey.WORKSHOP
function pc({ sweepId: e, placed: t, manager: n, onToggleEditing: s }) {
  const r = (0, L.b)(),
    { analytics: a } = (0, i.useContext)(AppReactContext),
    l = Al(e),
    d = Nl(e),
    u = d ? r.t(hc.START_LOCATION_MARKER_MESSAGE) : r.t(hc.START_LOCATION_IN_OTHER_VIEWS),
    h = r.t(hc.RENAME_ITEM_OPTION_CTA),
    p = r.t(hc.REMOVE_ITEM_OPTION_CTA),
    m = !t || l
  return (0, o.jsxs)(ce.hE, {
    children: [
      l &&
        (0, o.jsx)(Sa.P, {
          className: "start-location-decal",
          icon: "start-location",
          tooltip: u,
          size: ce.qE.SMALL,
          variant: ce.Wu.FAB,
          theme: "dark",
          dimmed: !d,
          popupSize: "medium"
        }),
      (0, o.jsxs)(
        ce.xz,
        Object.assign(
          {
            icon: "more-vert",
            ariaLabel: r.t(PhraseKey.MORE_OPTIONS),
            variant: ce.Wu.TERTIARY,
            menuArrow: !0,
            menuClassName: "search-result-menu",
            menuPlacement: "bottom-end"
          },
          {
            children: [
              (0, o.jsx)(ce.zx, {
                label: h,
                size: ce.qE.SMALL,
                variant: ce.Wu.TERTIARY,
                onClick: t => {
                  t.stopPropagation(), s(e, !0)
                }
              }),
              (0, o.jsx)(ce.zx, {
                label: p,
                size: ce.qE.SMALL,
                variant: ce.Wu.TERTIARY,
                onClick: () => {
                  n.unplace360(e), a.trackToolGuiEvent("360_views", "click_360_card_remove")
                },
                disabled: m
              })
            ]
          }
        )
      )
    ]
  })
}

const { VIEWS_360: gc } = PhraseKey.WORKSHOP
@l.Z
class vc extends i.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.containerRef = (0, i.createRef)()),
      (this.textInputRef = (0, i.createRef)()),
      (this.startDownload = 0),
      (this.onImageLoaded = () => {
        this.setState({
          loaded: !0
        })
        const e = {
          sweepId: this.props.sweepId,
          duration: Date.now() - this.startDownload
        }
        this.context.analytics.track("unaligned_image_loaded", e)
      }),
      (this.stopEditing = () => {
        const e = this.textInputRef.current
        e && e.stopEditing(e.getCurrentText())
      }),
      (this.onTitleEdited = e => {
        this.props.manager.rename360(this.props.sweepId, e), this.onDoneEditing()
      }),
      (this.onDoneEditing = () => {
        this.props.onToggleEditing(this.props.sweepId, !1)
      }),
      (this.highlightPin = () => {
        this.props.manager.highlight360Pin(this.props.sweepId, !0)
      }),
      (this.unhighlightPin = () => {
        this.props.manager.highlight360Pin(this.props.sweepId, !1)
      }),
      (this.state = {
        shouldLoad: !1,
        loaded: !1,
        url: ""
      })
  }
  componentDidMount() {
    this.loadIfNeeded()
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  componentDidUpdate(e, t) {
    this.state.shouldLoad && !this.state.loaded && this.downloadImageUrl(), e.lastScroll !== this.props.lastScroll && this.loadIfNeeded()
  }
  loadIfNeeded() {
    if (this.props.selected)
      this.setState({
        shouldLoad: !0
      })
    else {
      const e = this.props.getScrollableContainer(),
        t = this.containerRef.current
      if (e && t) {
        const n = t.offsetTop + t.offsetHeight + 300 > e.scrollTop,
          i = t.offsetTop < e.scrollTop + e.offsetHeight
        n &&
          i &&
          this.setState({
            shouldLoad: !0
          })
      }
    }
  }
  async downloadImageUrl() {
    this.startDownload = Date.now()
    const e = this.props.manager.dataMap.sweepData.getSweep(this.props.sweepId),
      t = await e.getFaceUrl(PanoSizeKey.STANDARD, 1)
    this.isUnmounting ||
      this.setState({
        url: t
      })
  }
  render() {
    const { locale: e } = this.context,
      { sweepId: t, toolState: n, placed: i, title: s, dataIndex: r, onToggleEditing: a, selected: l, editing: c, manager: d, horizontal: u } = this.props,
      { loaded: h, url: p } = this.state,
      m = n === xr._.PLACING && l,
      f = c,
      g = e.t(gc.DEFAULT_NAME, {
        index: r + 1
      })
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: B("each-360", {
            focused: f
          }),
          ref: this.containerRef
        },
        {
          children: (0, o.jsxs)(
            "div",
            Object.assign(
              {
                className: B("card-wrapper", {
                  dragging: m
                }),
                onClick: this.stopEditing,
                onMouseEnter: this.highlightPin,
                onMouseLeave: this.unhighlightPin
              },
              {
                children: [
                  (0, o.jsx)(uc, {
                    sweepId: t,
                    dataIndex: r,
                    placed: i,
                    selected: l,
                    url: p,
                    manager: d,
                    loaded: h,
                    horizontal: u,
                    onImageLoaded: this.onImageLoaded
                  }),
                  (0, o.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: B("card-edit", {
                          editing: c
                        })
                      },
                      {
                        children: [
                          (0, o.jsx)(is.Z, {
                            ref: this.textInputRef,
                            text: s,
                            placeholder: g,
                            autoSelect: !0,
                            showUnderline: c,
                            readOnlyMode: !c,
                            editing: c,
                            clickToEdit: !1,
                            isDisabled: !1,
                            closeOnFocusOut: !0,
                            maxLength: vc.maxCharacterTitle,
                            className: "card-edit-name",
                            onEdited: this.onTitleEdited,
                            propagateMouseEvent: !c
                          }),
                          !c &&
                            (0, o.jsx)(pc, {
                              sweepId: t,
                              placed: i,
                              manager: d,
                              onToggleEditing: a
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
vc.contextType = AppReactContext
vc.maxCharacterTitle = 128
const yc = vc
var bc = function (e, t, n, i) {
  var s,
    r = arguments.length,
    a = r < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, n)) : i
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i)
  else for (var o = e.length - 1; o >= 0; o--) (s = e[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(t, n, a) : s(t, n)) || a)
  return r > 3 && a && Object.defineProperty(t, n, a), a
}
const { VIEWS_360: Ec } = PhraseKey.WORKSHOP
@l.Z
class Sc extends i.Component {
  constructor(e) {
    super(e),
      (this.scrollbarRef = (0, i.createRef)()),
      (this.bindings = []),
      (this.onToggleEditing = (e, t) => {
        const n = this.props.manager.dataMap.sweepViewData
        t
          ? (n.setSelectedSweep(e),
            this.setState({
              editingSweepId: e
            }))
          : e === this.state.editingSweepId &&
            this.setState({
              editingSweepId: null
            })
      }),
      (this.focusOnCard = e => {
        const { editingSweepId: t } = this.state
        t && e !== t && this.onToggleEditing(t, !1)
      }),
      (this.getScrollableContainer = () => {
        const e = this.scrollbarRef.current
        return (null == e ? void 0 : e.getScrollableContainer()) || void 0
      }),
      (this.updateSweeps = () => {
        const e = this.props.manager.dataMap.sweepViewData.getAlignedSweeps(!1)
        ;(this.sweepIndexMap = {}),
          e.map((e, t) => {
            this.sweepIndexMap[e.id] = t
          }),
          this.setState({
            sweeps: e
          })
      }),
      (this.updateToolState = () => {
        this.setState({
          toolState: this.props.manager.dataMap.sweepViewData.toolState
        })
      }),
      (this.updateSelectedSweep = () => {
        const e = this.props.manager.dataMap.sweepViewData.selectedSweep
        this.setState({
          selectedSweepId: e
        }),
          e && this.focusOnCard(e)
      }),
      (this.onPinSelect = e => {
        if (!this.sweepIndexMap) return
        const t = this.props.manager.dataMap.sweepViewData.toolState
        if (e.selected && t !== xr._.PLACING) {
          const t = this.sweepIndexMap[e.sweepId],
            n = Object.keys(this.sweepIndexMap).length,
            i = t / n,
            s = 50 * n,
            r = this.scrollbarRef.current
          r && r.scrollToPercentage(i, s), this.throttleLastScroll(s)
        }
      }),
      (this.throttleLastScroll = (e = 500) => {
        clearTimeout(this.scrollTimeout),
          (this.scrollTimeout = window.setTimeout(() => {
            this.setState({
              lastScroll: Date.now()
            })
          }, e))
      }),
      (this.onListRef = e => {
        this.resizeObserver.disconnect(), e && this.resizeObserver.observe(e)
      }),
      (this.state = {
        lastScroll: 0,
        editingSweepId: null,
        selectedSweepId: null,
        toolState: xr._.IDLE,
        sweeps: []
      }),
      (this.updateLastScroll = this.throttleLastScroll),
      (this.resizeObserver = new ResizeObserver(this.updateLastScroll))
  }
  componentDidMount() {
    const { messageBus: e } = this.context,
      { sweepViewData: t } = this.props.manager.dataMap
    this.bindings.push(
      t.onSelectedSweepChanged(this.updateSelectedSweep),
      t.onToolStateChanged(this.updateToolState),
      e.subscribe(UnalignedPlacedMessage, this.updateSweeps),
      e.subscribe(UnalignedUnplacedMessage, this.updateSweeps),
      e.subscribe(SelectSweepViewDataMessage, this.onPinSelect)
    ),
      this.updateSweeps()
  }
  componentWillUnmount() {
    this.bindings.forEach(e => e.cancel()), (this.bindings.length = 0), this.resizeObserver.disconnect()
  }
  renderImages() {
    const { locale: e } = this.context,
      { sweeps: t, toolState: n, lastScroll: i, editingSweepId: s, selectedSweepId: r } = this.state
    if (!t || t.length < 1) {
      const t = e.t(Ec.NO_VIEWS_MESSAGE)
      return (0, o.jsx)(
        "div",
        Object.assign(
          {
            className: "placeholder-360"
          },
          {
            children: (0, o.jsx)("span", {
              children: t
            })
          }
        )
      )
    }
    const { manager: a, toolPanelLayout: l } = this.props,
      c = l === ToolPanelLayout.BOTTOM_PANEL,
      d = t.map((e, t) => {
        const l = r === e.id,
          d = s === e.id
        return (0, o.jsx)(
          yc,
          {
            dataIndex: t,
            placed: e.placed,
            selected: l,
            editing: d,
            toolState: n,
            lastScroll: i,
            title: e.name,
            sweepId: e.id,
            horizontal: c,
            manager: a,
            onToggleEditing: this.onToggleEditing,
            getScrollableContainer: this.getScrollableContainer,
            onFocus: this.focusOnCard
          },
          e.id
        )
      })
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "scrolling-cards"
        },
        {
          children: d
        }
      )
    )
  }
  render() {
    const { toolPanelLayout: e } = this.props,
      { toolState: t } = this.state,
      n = t === xr._.PLACING,
      i = e === ToolPanelLayout.BOTTOM_PANEL ? zn.Nm.horizontal : zn.Nm.vertical
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "list-contents placement-360",
          ref: this.onListRef
        },
        {
          children: (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "images-360"
              },
              {
                children: (0, o.jsx)(
                  Wn.Z,
                  Object.assign(
                    {
                      ref: this.scrollbarRef,
                      suppressDrag: n,
                      onScrolled: this.updateLastScroll,
                      direction: i
                    },
                    {
                      children: this.renderImages()
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
function Oc({ manager: e }) {
  const t = (0, L.b)(),
    n = (0, G.T)(),
    i = (0, q.y)(ModelViewsFeatureKey, !1),
    s = e.dataMap.sweepViewData.getAlignedSweeps(!1),
    r = n === ToolPanelLayout.BOTTOM_PANEL,
    a = (0, o.jsx)(Sc, {
      manager: e,
      toolPanelLayout: n
    }),
    l = t.t(PhraseKey.WORKSHOP.VIEWS_360.NUM_TYPE, s.length)
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: B("tool-panel", "views360-panel", {
          "no-layers": !i
        })
      },
      {
        children: (0, o.jsx)(
          He.L,
          Object.assign(
            {
              toolId: ToolsList.VIEW_360,
              title: l,
              filmstrip: r,
              subheader: (0, o.jsx)(Tl.z, {
                toolId: ToolsList.VIEW_360
              })
            },
            {
              children: a
            }
          )
        )
      }
    )
  )
}
Sc.contextType = AppReactContext

class Tc {
  constructor(e) {
    ;(this.manager = e),
      (this.renderPanel = () =>
        (0, o.jsx)(Oc, {
          manager: this.manager
        })),
      (this.renderOverlay = () =>
        (0, o.jsx)(tc, {
          manager: this.manager
        }))
  }
}
function Nc() {
  const e = tryGetModuleBySymbolSync(ModelMeshSymbol)
  return null == e ? void 0 : e.meshTrimData
}
const Lc = useDataHook(MeshTrimViewData)
function Cc() {
  const e = Nc(),
    t = Lc(),
    [n, s] = (0, i.useState)((null == t ? void 0 : t.selectedMeshTrim) || null)
  return (
    (0, i.useEffect)(() => {
      if (!t || !e) return () => {}
      function n() {
        t && s(t.selectedMeshTrim)
      }
      const i = t.onSelectedMeshTrimChanged(n)
      return n(), () => i.cancel()
    }, [e, t]),
    n
  )
}
const { TRIM: Rc } = PhraseKey.WORKSHOP,
  Mc = ({ item: e }) =>
    e
      ? (0, o.jsx)(
          jc,
          {
            item: e
          },
          e.id
        )
      : null
function jc({ item: e }) {
  const { id: t, enabled: n, activeInPanoMode: s, discardContents: r } = e,
    [a, l] = (0, i.useState)(!1),
    d = Cc(),
    u = (null == d ? void 0 : d.id) === t,
    { commandBinder: h } = (0, i.useContext)(AppReactContext),
    p = (0, L.b)(),
    m = (function () {
      const e = (0, xc.I)(),
        [t, n] = (0, i.useState)(e ? e.floors.getFloorCount() : 1)
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          const t = () => n(e.floors.getFloorCount()),
            i = e.floors.getCollection().onChanged(t)
          return t(), () => i.cancel()
        }, [e]),
        t
      )
    })(),
    f = e.name || "",
    g = p.t(Rc.DEFAULT_NAME),
    v = a ? p.t(Rc.LIST_ITEM_INPUT_PLACEHOLDER) : "",
    y = e.activeInPanoMode ? p.t(Rc.HIDE_PANO_LIST_ITEM_TOOLTIP) : p.t(Rc.SHOW_PANO_LIST_ITEM_TOOLTIP),
    b = e.activeInPanoMode ? "panorama" : "panorama-disable",
    E = e.discardContents ? "trim-remove" : "trim-keep",
    S = e.discardContents ? p.t(Rc.KEEP_TOGGLE) : p.t(Rc.REMOVE_TOGGLE),
    O = p.t(Rc.RENAME_LIST_ITEM_OPTION_CTA),
    T = p.t(Rc.DELETE_LIST_ITEM_OPTION_CTA),
    _ = p.t(Rc.MOVE_TRIM_ALL_FLOORS),
    w = e.meshGroup !== defaultMeshGroup && m > 1,
    A = (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "item-details"
        },
        {
          children: (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: "item-header"
              },
              {
                children: a
                  ? (0, o.jsx)(is.Z, {
                      isDisabled: !1,
                      editing: !0,
                      className: "inline-text-input",
                      text: f,
                      closeOnFocusOut: !0,
                      placeholder: v,
                      onEdited: t => {
                        ;(e.name = t), e.commit(), l(!1)
                      },
                      maxLength: Pc.R6,
                      showUnderline: !0,
                      readOnlyMode: !1,
                      propagateMouseEvent: !1,
                      onCancelEditing: () => {
                        l(!1)
                      },
                      validator: e => void 0 !== e && e.length >= 1 && e.length <= Pc.R6
                    })
                  : (0, o.jsx)(o.Fragment, {
                      children: f || g
                    })
              }
            )
          )
        }
      )
    ),
    N = a
      ? void 0
      : (0, o.jsxs)(ce.hE, {
          children: [
            (0, o.jsx)(ce.zx, {
              tooltip: S,
              icon: E,
              variant: ce.Wu.TERTIARY,
              onClick: t => {
                t.stopPropagation(), (e.discardContents = !r), e.commit()
              }
            }),
            (0, o.jsx)(ce.zx, {
              tooltip: y,
              icon: b,
              variant: ce.Wu.TERTIARY,
              onClick: t => {
                t.stopPropagation(), (e.activeInPanoMode = !s), e.commit()
              }
            }),
            (0, o.jsx)(Dc.Z, {
              id: t,
              visible: n,
              showTooltip: Rc.SHOW_LIST_ITEM_TOOLTIP_MESSAGE,
              hideTooltip: Rc.HIDE_LIST_ITEM_TOOLTIP_MESSAGE,
              onClick: () => {
                ;(e.enabled = !e.enabled), e.commit()
              },
              tooltipOptions: {
                placement: "bottom"
              }
            }),
            (0, o.jsxs)(
              ce.xz,
              Object.assign(
                {
                  icon: "more-vert",
                  ariaLabel: p.t(PhraseKey.MORE_OPTIONS),
                  variant: ce.Wu.TERTIARY,
                  menuArrow: !0,
                  menuClassName: "search-result-menu"
                },
                {
                  children: [
                    (0, o.jsx)(ce.zx, {
                      label: O,
                      size: ce.qE.SMALL,
                      variant: ce.Wu.TERTIARY,
                      onClick: () => {
                        l(!0)
                      }
                    }),
                    (0, o.jsx)(ce.zx, {
                      className: "menu-delete-btn",
                      label: T,
                      size: ce.qE.SMALL,
                      variant: ce.Wu.TERTIARY,
                      onClick: () => {
                        h.issueCommand(
                          new DeleteMeshTrimCommand({
                            meshTrimId: t
                          })
                        )
                      }
                    }),
                    w &&
                      (0, o.jsx)(ce.zx, {
                        label: _,
                        size: ce.qE.SMALL,
                        variant: ce.Wu.TERTIARY,
                        onClick: () => {
                          h.issueCommand(new ChangeTrimMeshGroupCommand(e))
                        }
                      })
                  ]
                }
              )
            )
          ]
        })
  return (0, o.jsx)(
    ce.HC,
    {
      id: t,
      className: "search-result-item",
      title: A,
      actions: N,
      active: u,
      onClick: () => {
        u
          ? h.issueCommand(new UnselectMeshTrimCommand())
          : h.issueCommand(
              new SelectMeshTrimCommand({
                meshTrimId: t
              })
            )
      }
    },
    t
  )
}
const Fc = () => {
    const e = tryGetModuleBySymbolSync(ModelMeshSymbol)
    return (0, Ac.h)((null == e ? void 0 : e.meshTrimData) || null, "maxTrimsPerFloor", MaxTrimsPerFloor)
  },
  { TRIM: Hc } = PhraseKey.WORKSHOP,
  Bc = ({ group: e }) => {
    const { id: t, items: n } = e,
      i = t === Pc.DL,
      s = n.length,
      r = (0, L.b)(),
      a = Fc()
    if (i)
      return (0, o.jsx)(ce._m, {
        id: t,
        title: r.t(Hc.ALL_FLOORS),
        decals: (0, o.jsx)(
          "span",
          Object.assign(
            {
              className: "mp-list-item-text"
            },
            {
              children: s
            }
          )
        )
      })
    const l = `${s}/${a}`
    return (0, o.jsx)(Cl.J, {
      id: t,
      numItems: l
    })
  },
  Vc = ({ group: e }) => {
    const t = (0, L.b)().t(Hc.EMPTY_FLOOR_MESSAGE)
    return (0, o.jsx)(ce.gQ, {
      message: t
    })
  },
  { TRIM: Gc } = PhraseKey.WORKSHOP
function Wc() {
  const e = (() => {
      const e = tryGetModuleBySymbolSync(ModelMeshSymbol)
      return (0, Ac.h)((null == e ? void 0 : e.meshTrimData) || null, "numberOfTrims", 0)
    })(),
    t = (function () {
      const e = Nc(),
        t = (0, Ol.W)(),
        [n, s] = (0, i.useState)([])
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          function n() {
            if (!e) return
            const n = t.reduce(
                (t, n, i) =>
                  Object.assign(Object.assign({}, t), {
                    [n.id]: {
                      id: n.id,
                      items: e.getTrimsForMeshGroup(n.meshGroup)
                    }
                  }),
                {}
              ),
              i = Object.values(n)
            t.length > 1 &&
              i.unshift({
                id: Pc.DL,
                items: e.getTrimsForMeshGroup(defaultMeshGroup)
              }),
              s(i)
          }
          const i = e.onMeshGroupChanged(n),
            r = e.onMeshTrimChanged(n)
          return (
            n(),
            () => {
              i.cancel(), r.cancel()
            }
          )
        }, [t, e]),
        n
      )
    })(),
    n = (0, _c.R)(),
    s = (0, L.b)(),
    [r, a] = (0, bl.s)()
  ;(0, i.useEffect)(() => (a(null != n ? n : Pc.DL, !1), () => {}), [n])
  const l = s.t(Gc.NUM_TYPE, e),
    c = (0, o.jsx)("header", {
      children: (0, o.jsx)(Tl.z, {
        toolId: ToolsList.MESH_TRIM
      })
    })
  return (0, o.jsx)(
    He.L,
    Object.assign(
      {
        toolId: ToolsList.MESH_TRIM,
        title: l,
        subheader: c
      },
      {
        children: (0, o.jsx)(
          "div",
          Object.assign(
            {
              className: "panel-list"
            },
            {
              children: (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "list-contents"
                  },
                  {
                    children: (0, o.jsx)(ce.UQ, {
                      ariaExpandLabel: s.t(PhraseKey.ACCORDIONS.EXPAND),
                      ariaCollapseLabel: s.t(PhraseKey.ACCORDIONS.COLLAPSE),
                      data: t,
                      itemHeight: 60,
                      renderItem: Mc,
                      renderGroup: Bc,
                      renderEmpty: Vc,
                      onToggleCollapse: a,
                      collapsedIds: r
                    })
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
function Yc(e) {
  const { engine: t } = (0, i.useContext)(AppReactContext),
    n = (0, L.b)(),
    { viewState: s, viewChange: r, phraseKey: a, tooltipPhraseKey: l, className: d, currentViewState: u, transitioning: h } = e,
    p = u === s,
    m = isValidViewChange(u, r),
    f = !p && (h || !m),
    g = p ? "light" : "dark"
  return (0, o.jsx)(ce.zx, {
    className: B("mesh-trim-pose-button", d, {
      active: p
    }),
    theme: g,
    variant: ce.Wu.TERTIARY,
    disabled: f,
    onClick: () => {
      p ||
        t.commandBinder.issueCommand(
          new ChangeMeshTrimEditorViewCommand({
            viewChange: r
          })
        )
    },
    tooltip: n.t(l),
    tooltipOptions: {
      placement: "bottom"
    },
    label: n.t(a)
  })
}
function qc(e) {
  const { engine: t } = (0, i.useContext)(AppReactContext),
    n = (0, L.b)(),
    { viewState: s, viewChange: r, icon: a, tooltipPhraseKey: l, className: d, currentViewState: u, transitioning: h } = e,
    p = u === s,
    m = isValidViewChange(u, r),
    f = h || !m
  return (0, o.jsx)(ce.zx, {
    className: B(d, {
      "mesh-icon-button-hidden": !p
    }),
    icon: a,
    variant: ce.Wu.TERTIARY,
    disabled: f,
    onClick: () => {
      h ||
        t.commandBinder.issueCommand(
          new ChangeMeshTrimEditorViewCommand({
            viewChange: r
          })
        )
    },
    tooltip: n.t(l),
    tooltipOptions: {
      placement: "bottom"
    }
  })
}
const Zc = (0, Da.M)(MeshTrimViewData, "viewState", MeshTrimViewState.PERSPECTIVE),
  { TRIM: Qc } = PhraseKey.WORKSHOP
function Xc() {
  const e = (0, oe.Y)(),
    t = (function () {
      const e = (0, $c.c)(),
        [t, n] = (0, i.useState)((null == e ? void 0 : e.transition.active) || !1)
      return (
        (0, i.useEffect)(() => {
          if (!e) return () => {}
          const t = e.transition.onPropertyChanged("active", n)
          return n(e.transition.active), () => t.cancel()
        }, [e]),
        t
      )
    })(),
    n = Zc(),
    s = n === MeshTrimViewState.SIDE
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "overlay-top-center mesh-trim-overlay-view-bar"
      },
      {
        children: [
          (0, o.jsx)(Yc, {
            currentViewState: n,
            transitioning: t,
            viewState: MeshTrimViewState.TOP,
            viewChange: ViewChangeState.TOP,
            phraseKey: Qc.TOP_POSE_CTA,
            tooltipPhraseKey: Qc.TOP_POSE_TOOLTIP,
            className: "mesh-trim-pose-button-top"
          }),
          (0, o.jsxs)(
            ce.hE,
            Object.assign(
              {
                className: B("mesh-trim-side-view", {
                  active: s
                })
              },
              {
                children: [
                  (0, o.jsx)(qc, {
                    currentViewState: n,
                    transitioning: t,
                    viewState: MeshTrimViewState.SIDE,
                    viewChange: ViewChangeState.LEFT,
                    icon: "dpad-left",
                    tooltipPhraseKey: Qc.LEFT_SIDE_POSE_TOOLTIP,
                    className: "mesh-trim-side-view-left"
                  }),
                  (0, o.jsx)(Yc, {
                    currentViewState: n,
                    transitioning: t,
                    viewState: MeshTrimViewState.SIDE,
                    viewChange: ViewChangeState.SIDE,
                    phraseKey: Qc.SIDE_POSE_CTA,
                    tooltipPhraseKey: Qc.SIDE_POSE_TOOLTIP,
                    className: "mesh-trim-pose-button-side"
                  }),
                  (0, o.jsx)(qc, {
                    currentViewState: n,
                    transitioning: t,
                    viewState: MeshTrimViewState.SIDE,
                    viewChange: ViewChangeState.RIGHT,
                    icon: "dpad-right",
                    tooltipPhraseKey: Qc.RIGHT_SIDE_POSE_TOOLTIP,
                    className: "mesh-trim-side-view-right"
                  })
                ]
              }
            )
          ),
          (0, o.jsx)(Yc, {
            currentViewState: n,
            transitioning: t,
            viewState: MeshTrimViewState.PERSPECTIVE,
            viewChange: ViewChangeState.PERSPECTIVE,
            phraseKey: Qc.PERSPECTIVE_POSE_CTA,
            tooltipPhraseKey: Qc.PERSPECTIVE_POSE_TOOLTIP,
            className: "mesh-trim-pose-button-perspective"
          }),
          e &&
            (0, o.jsx)(zc.O, {
              className: "mesh-trim-floor-menu"
            })
        ]
      }
    )
  )
}
const { TRIM: nd } = PhraseKey.WORKSHOP,
  id = new Quaternion(0, 0, 0, 1)
function sd(e) {
  const { selectedMeshTrim: t } = e,
    { commandBinder: n } = (0, i.useContext)(AppReactContext),
    s = (0, L.b)(),
    [r, a] = (0, i.useState)(!1),
    l = (0, oe.Y)(),
    d = (function () {
      const { engine: e } = (0, i.useContext)(AppReactContext),
        [t, n] = (0, i.useState)(ed.g.Translate)
      return (
        (0, i.useEffect)(() => {
          let t,
            i = !1
          return (
            e.getModuleBySymbol(TransformGizmoSymbol).then(e => {
              const { gizmo: s } = e
              i || ((t = s.onChanged(n)), n(s.getMode()))
            }),
            () => {
              ;(i = !0), t && t.cancel()
            }
          )
        }, []),
        t
      )
    })()
  ;(0, i.useEffect)(() => {
    let e = !1
    function n() {
      e || a(!t.rotation.equals(id))
    }
    const i = t.onChanged(functionCommon.debounce(n, 100))
    return (
      n(),
      () => {
        ;(e = !0), i.cancel()
      }
    )
  }, [t])
  const u = e => () => {
      const t = new SetGizmoControlModeCommand(e)
      n.issueCommand(t)
    },
    h = s.t(nd.TOOL_POSITION_CTA),
    p = s.t(nd.TOOL_POSITION_TOOLTIP),
    m = s.t(nd.TOOL_SCALE_CTA),
    f = s.t(nd.TOOL_SCALE_TOOLTIP),
    g = s.t(nd.TOOL_ROTATION_CTA),
    v = s.t(nd.TOOL_ROTATION_TOOLTIP),
    y = s.t(nd.RESET_ROTATION),
    b = l ? "medium" : "small"
  return (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "overlay-left-center"
      },
      {
        children: (0, o.jsxs)(
          "div",
          Object.assign(
            {
              className: "mesh-trim-transform-controls"
            },
            {
              children: [
                (0, o.jsx)(ce.zx, {
                  className: "mesh-trim-transform-button",
                  variant: ce.Wu.FAB,
                  size: b,
                  active: d === ed.g.Translate,
                  onClick: u(ed.g.Translate),
                  tooltip: p,
                  tooltipOptions: {
                    placement: "right"
                  },
                  icon: "position-3d",
                  label: l ? void 0 : h,
                  ariaLabel: h
                }),
                (0, o.jsx)(ce.zx, {
                  className: "mesh-trim-transform-button",
                  variant: ce.Wu.FAB,
                  size: b,
                  active: d === ed.g.Scale,
                  onClick: u(ed.g.Scale),
                  tooltip: f,
                  tooltipOptions: {
                    placement: "right"
                  },
                  icon: "scale-3d",
                  label: l ? void 0 : m,
                  ariaLabel: m
                }),
                (0, o.jsxs)(
                  ce.hE,
                  Object.assign(
                    {
                      className: "transform-control-row"
                    },
                    {
                      children: [
                        (0, o.jsx)(ce.zx, {
                          className: "mesh-trim-transform-button",
                          variant: ce.Wu.FAB,
                          size: b,
                          active: d === ed.g.Rotate,
                          onClick: u(ed.g.Rotate),
                          tooltip: v,
                          tooltipOptions: {
                            placement: r ? "bottom" : "right"
                          },
                          icon: "rotation-3d",
                          label: l ? void 0 : g,
                          ariaLabel: g
                        }),
                        r &&
                          (0, o.jsx)(ce.zx, {
                            className: "rotation-reset-button",
                            icon: "revert",
                            size: "medium",
                            variant: ce.Wu.FAB,
                            onClick: e => {
                              t.rotation.identity(), t.commit()
                            },
                            tooltip: y,
                            tooltipOptions: {
                              placement: "right"
                            }
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
function ad() {
  const e = (0, xc.I)(),
    [t, n] = (0, i.useState)(e ? e.currentFloorMeshGroup : defaultMeshGroup)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        e && n(e.currentFloorMeshGroup)
      }
      const i = e.makeFloorChangeSubscription(t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}
function od(e, t) {
  return !!e && t === defaultMeshGroup && e.isMultifloor()
}
function ld() {
  const e = (0, xc.I)(),
    t = ad(),
    [n, s] = (0, i.useState)(od(e, t))
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      function n() {
        e && s(od(e, t))
      }
      const i = e.makeFloorChangeSubscription(n)
      return n(), () => i.cancel()
    }, [e, t]),
    n
  )
}
const cd = (0, Da.M)(MeshTrimViewData, "editorState", EditorState.IDLE),
  { TRIM: dd } = PhraseKey.WORKSHOP
function ud({ selectedMeshTrim: e }) {
  const t = (0, i.useRef)(null),
    n = (0, L.b)(),
    { commandBinder: s } = (0, i.useContext)(AppReactContext),
    [r, a] = (0, i.useState)(g()),
    l = Fc(),
    d = (() => {
      const e = tryGetModuleBySymbolSync(ModelMeshSymbol)
      return (0, Ac.h)((null == e ? void 0 : e.meshTrimData) || null, "maxAllFloorsTrims", MaxTrimsPerFloor)
    })(),
    u = (function () {
      const e = ad(),
        t = Nc(),
        [n, s] = (0, i.useState)((null == t ? void 0 : t.getTrimsForMeshGroup(e)) || [])
      return (
        (0, i.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            t && s(t.getTrimsForMeshGroup(e) || [])
          }
          const i = t.meshTrimsByMeshGroup.get(`${e}`)
          if (!i) return () => {}
          const r = i.onElementChanged({
            onAdded: n,
            onRemoved: n
          })
          return n(), () => r.cancel()
        }, [e, t]),
        n
      )
    })(),
    h = ld(),
    p = cd(),
    m = p === EditorState.EDITING,
    f = p === EditorState.CREATING
  function g() {
    return !e || e.discardContents
  }
  function v() {
    t.current && t.current.dismissNudge()
  }
  ;(0, i.useEffect)(() => {
    if (!e) return () => {}
    const t = e.onChanged(() => {
      a(g())
    })
    return a(g()), () => t.cancel()
  }, [e])
  const y = h ? d : l,
    b = u.length < y,
    E = r ? n.t(dd.KEEP_TOGGLE) : n.t(dd.REMOVE_TOGGLE),
    S = r ? "trim-remove" : "trim-keep",
    O = n.t(dd.DELETE_TRIM),
    T = h ? n.t(dd.ADD_ALL_FLOORS_TRIM_TOOLTIP) : n.t(dd.ADD_INDIVIDUAL_FLOOR_TRIM_TOOLTIP),
    _ = h
      ? n.t(dd.MAX_ALL_FLOORS_TRIMS_TOOLTIP)
      : n.t(dd.MAX_INDIVIDUAL_FLOOR_TRIMS_TOOLTIP, {
          max: l
        })
  let w,
    A = Xa.d.ADD,
    N = !b,
    I = n.t(dd.ADD_TRIM)
  m || f ? ((A = Xa.d.CONFIRM), (N = !1), (I = n.t(dd.COMPLETE_TRIM))) : (w = b ? T : _)
  const P = (0, o.jsx)(ce.zx, {
      className: "action-button-outer",
      variant: ce.Wu.FAB,
      theme: "overlay",
      icon: S,
      disabled: !m,
      tooltip: E,
      onClick: t => {
        t.stopPropagation(), v(), null !== e && ((e.discardContents = !e.discardContents), e.commit())
      }
    }),
    x = (0, o.jsx)(ce.zx, {
      className: "action-button-outer",
      variant: ce.Wu.FAB,
      theme: "overlay",
      icon: "delete",
      disabled: !m,
      tooltip: O,
      onClick: () => {
        v(),
          e &&
            s.issueCommand(
              new DeleteMeshTrimCommand({
                meshTrimId: e.sid
              })
            )
      }
    })
  return (0, o.jsx)(
    fa.o,
    Object.assign(
      {
        outerLeft: P,
        outerRight: x
      },
      {
        children: (0, o.jsx)(Xa.H, {
          ref: t,
          addIcon: A,
          disabled: N,
          onClick: e => {
            v(), m || f ? s.issueCommand(new UnselectMeshTrimCommand()) : s.issueCommand(new CreateMeshTrimCommand())
          },
          tooltip: I,
          nudgeSize: "medium",
          nudgeSessionKey: w,
          nudgeMessage: w
        })
      }
    )
  )
}
function hd() {
  const e = Cc()
  return (0, o.jsxs)(
    "div",
    Object.assign(
      {
        className: "overlay grid-overlay mesh-trims-overlay"
      },
      {
        children: [
          (0, o.jsx)(Xc, {}),
          e &&
            (0, o.jsx)(sd, {
              selectedMeshTrim: e
            }),
          (0, o.jsx)(ud, {
            selectedMeshTrim: e
          })
        ]
      }
    )
  )
}
class pd {
  constructor() {
    ;(this.renderPanel = () => (0, o.jsx)(Wc, {})), (this.renderOverlay = () => (0, o.jsx)(hd, {}))
  }
}
const yd = "plugin-prevent-live-edit",
  bd = ["pluginConfigToggles"]
class Ed {
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.initialized = !1),
      (this.toggledAssets = {}),
      (this.openPluginObservable = createObservableValue(null)),
      (this._overrideParams = {}),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.toggledAssets)),
      (this.log = new DebugInfo("plugin-config-manager"))
    for (const e of bd) this._overrideParams[e] = t.getOverrideParam(e)
  }
  get overrideParams() {
    return this._overrideParams
  }
  async activate() {
    if (!this.initialized) {
      this.initialized = !0
      const { market: e } = this.engine,
        [t, n, i] = await Promise.all([e.waitForData(AvailablePluginData), e.waitForData(ViewmodeData), e.waitForData(AttachmentsData)])
      this.settingsData.setProperty(yd, t.preventLiveEdit),
        (this.dataMap = {
          settings: this.settingsData,
          viewmodeData: n,
          availablePlugins: t.availablePlugins,
          lastSavedConfiguration: t.lastSavedConfiguration,
          pluginList: await this.getPluginList(t),
          attachmentsData: i,
          pluginEvents: t.eventTarget
        })
    }
  }
  async deactivate() {
    this.settingsToggler.toggle(!1), this.setOpenPlugin(null)
  }
  async getPluginList(e) {
    const t = new ObservableArray(),
      n = new Set()
    for (const i of e.lastSavedConfiguration) {
      const s = e.availablePlugins.get(i.id)
      let r
      if (!s) continue
      const a = JSON.parse(JSON.stringify((null == s ? void 0 : s.config) || {}))
      if (i.enabled) {
        if (!s) {
          const e = `Configured plugin data for ${i.id} doesn't match registry data for ${i.id}!`
          if (!i.meta) {
            this.log.error(`${e}. No metadata URL, cannot load ${i.id}!`)
            continue
          }
          this.log.warn(e)
        }
        r = {
          name: i.id,
          version: (null == s ? void 0 : s.version) || "0.0.0",
          src: i.src,
          meta: i.meta || s.meta,
          icon: s.icon,
          applicationKey: (null == s ? void 0 : s.applicationKey) || "FAKE_APP_KEY",
          config: a,
          enabled: !0,
          description: null == s ? void 0 : s.description,
          strict: (null == s ? void 0 : s.strict) || !1,
          fetchLevel: (null == s ? void 0 : s.fetchLevel) || 0
        }
      } else {
        if (!s) continue
        r = Object.assign(Object.assign({}, s), {
          config: a
        })
      }
      t.push(r), n.add(i.id)
    }
    for (const i of e.availablePlugins) n.has(i.name) || t.push(i)
    return t
  }
  setOpenPlugin(e) {
    this.openPluginObservable.value = e
  }
  get openPlugin() {
    return this.openPluginObservable.value
  }
  onOpenPluginChanged(e) {
    return this.openPluginObservable.onChanged(() => e(this.openPlugin))
  }
}

import Form from "@rjsf/core"

import * as ey from "../other/74795"
import * as Jv from "../other/93958"
import * as ty from "../other/96238"
import * as iy from "../const/22931"
import { SpacesPluginsConfigKey } from "../const/spaces.const"
import * as ly from "../other/11889"
import * as ny from "../other/58776"

import { AttachmentDeleteCommand } from "../command/attachment.command"
import {
  PlayerOptionSettingsCommand,
  PlayerOptionsResetTourDefaultsCommand,
  PlayerOptionsSetPanDirectionCommand,
  SetBackgroundColorCommand,
  ToggleOptionCommand
} from "../command/player.command"
import { CloseModalCommand, ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState, ToggleModalCommand } from "../command/ui.command"

import { Quaternion, Vector2, Vector3 } from "three"
import { OpenInitialToolCommand, OpenToolCommand, RegisterToolsCommand, ToggleToolCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import {
  HighlightReelToggleOpenCommand,
  TourChangeDescriptionCommand,
  TourChangeTitleCommand,
  TourRelativeCommand,
  TourRenameCommand,
  TourSetTourModeCommand,
  TourStartCommand,
  TourStepCommand,
  TourStopCommand
} from "../command/tour.command"
import { PanDirectionList } from "../const/transition.const"
import { searchModeType } from "../const/typeString.const"
import { AttachmentsData } from "../data/attachments.data"
import { CamStartData } from "../data/camstart.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LayersData } from "../data/layers.data"
import { MeshData } from "../data/mesh.data"
import { BtnText, PlayerOptionsData } from "../data/player.options.data"
import { ToolsData } from "../data/tools.data"
import { ToursViewData } from "../data/tours.view.data"
import { GalleryImageAddMessage } from "../message//snapshot.message"
import { FocusLabelEditorMessage } from "../message/annotation.message"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { CanvasMessage } from "../message/canvas.message"
import { ForbiddenErrorMessage, SaveErrorMessage } from "../message/error.message"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { ModelViewChangeCompleteMessage } from "../message/layer.message"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { UpdateDefaultsDirectionMessage, UpdateDefaultsTransitionsMessage } from "../message/player.message"
import { PluginDetailPanelCloseMessage } from "../message/plugin.message"
import { SnapshotErrorMessage } from "../message/snapshot.message"
import { SelectSweepViewDataMessage, UnalignedPlacedMessage, UnalignedUnplacedMessage } from "../message/sweep.message"
import { ReelIndexMessage, TourStartedMessage, TourEndedMessage, TourSteppedMessage, TourStoppedMessage } from "../message/tour.message"
import { LoadSpinnerMessage, LoadSpinnerSuppressMessage } from "../message/ui.message"
import { createObservableValue } from "../observable/observable.value"
const { PLUGINS: sy, MATTERTAGS: ry } = PhraseKey.WORKSHOP
const ay = new DebugInfo("plugin-config-ui")
function oy(e) {
  var t, n, s
  const { plugin: r, manager: a, onClose: l } = e,
    [d, u] = (0, i.useState)(r.enabled),
    [h, p] = (0, i.useState)(!1),
    { commandBinder: m, engine: f } = (0, i.useContext)(AppReactContext),
    g = (0, L.b)(),
    v = !!(null === (t = e.manager.overrideParams) || void 0 === t ? void 0 : t.pluginConfigToggles),
    y = a.dataMap.lastSavedConfiguration,
    b = y.findIndex(e => e.id === r.name),
    E = JSON.parse(JSON.stringify(y.get(b) || {})),
    [S, O] = (0, i.useState)(JSON.parse(JSON.stringify(null !== (n = null == E ? void 0 : E.config) && void 0 !== n ? n : {})))
  ;(0, i.useEffect)(() => {
    d && m.issueCommand(new PluginReloadCommand(r.name, S, r.config))
  }, [S])
  const T = !a.dataMap.settings.getProperty(yd),
    _ = g.t(sy.BACK_TO_ALL),
    w = (0, i.useCallback)(
      e => {
        const t = y.findIndex(e => e.id === r.name),
          n = y.get(t)
        let i
        ;(i =
          d && !r.enabled
            ? {
                id: r.name,
                src: r.src,
                meta: r.meta,
                config: Object.assign({}, null == n ? void 0 : n.config, null == e ? void 0 : e.formData),
                enabled: d
              }
            : {
                id: (null == n ? void 0 : n.id) || r.name,
                src: (null == n ? void 0 : n.src) || r.src,
                meta: (null == n ? void 0 : n.meta) || r.meta,
                config: Object.assign({}, null == e ? void 0 : e.formData),
                enabled: d
              }),
          n ? (ay.devInfo(`updating existing config for ${n.id}`), y.update(t, i)) : (ay.devInfo(`adding new config entry for ${r.name}`), y.push(i)),
          (r.enabled = d),
          p(!1),
          l()
      },
      [y, d, l, r]
    ),
    [A, N, I] = (0, i.useMemo)(() => {
      const e = r.src.match(new RegExp("tester/(.*)/js")),
        t = r.src.match(new RegExp(`published/${r.name}/(.*)/${r.name}`)),
        n = !r.src.match("static.matterport.com"),
        i = !!t
      return [t ? t[1] : e ? e[1] : n ? "local version" : r.version, i, n]
    }, [r])
  let P = ""
  I
    ? (P = "local")
    : N
      ? (Sd.major(r.version) > Sd.major(A) || (Sd.major(r.version) === Sd.major(A) && Sd.minor(r.version) > Sd.minor(A))) && (P = "outdated")
      : (P = "unpublished")
  const x = (0, i.useMemo)(() => {
    const e = Sd.satisfies(r.version, "~" + A)
    let t = ""
    if (I) t = "Configured version is locally hosted and will only load during development."
    else if (N) {
      if (!e) {
        const e = N ? Sd.compare(r.version, A) : 0
        t = `Configured version ${1 === e ? "is older:" : -1 === e ? "is newer:" : ":"} ${A}`
      }
    } else t = 'Configured version is in "alpha" and may not work as expected.'
    return t
  }, [A, N, I, r])
  function k() {
    var e
    r.enabled
      ? m.issueCommand(new PluginReloadCommand(r.name, null !== (e = null == E ? void 0 : E.config) && void 0 !== e ? e : {}, r.config))
      : m.issueCommand(new PluginUnloadCommand(r.name)),
      l()
  }
  const C = (0, i.forwardRef)((e, t) => {
    const { attachmentId: n, setValue: s, title: r, updateFile: a, uploading: l } = e
    const [c, d] = (0, i.useState)()
    const u = async () => {
      const e = await f.getModuleBySymbol(AttachmentsSymbol),
        t = (await e.getAllAttachments()).find(e => e.id === n)
      t ? d(t) : (ay.warn(`Attachment with ID ${n} missing. Removing from preview.`), s(""))
    }
    return (
      (0, i.useEffect)(() => {
        u()
      }, []),
      (0, i.useEffect)(() => {
        u()
      }, [n]),
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "file-attachments-container",
            ref: t
          },
          {
            children: [
              r &&
                (0, o.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "options-label"
                    },
                    {
                      children: r
                    }
                  )
                ),
              (0, o.jsx)(
                Jv.Z,
                Object.assign(
                  {
                    disabled: !1,
                    onDropped: a,
                    className: B("plugin-attachments", {
                      empty: !n && !l
                    })
                  },
                  {
                    children: (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "file-attachments"
                        },
                        {
                          children:
                            l || (n && !c)
                              ? (0, o.jsx)(ey.G, {
                                  id: n,
                                  fileName: "",
                                  progress: 0,
                                  error: null,
                                  className: "inline"
                                })
                              : c
                                ? (0, o.jsx)(ty.P, {
                                    inline: !0,
                                    canDelete: !0,
                                    attachment: c,
                                    onDelete: () => {
                                      const e = !Object.entries(E.config).find(([, e]) => e === n)
                                      n && e && m.issueCommand(new AttachmentDeleteCommand(n)), s("")
                                    }
                                  })
                                : (0, o.jsxs)(o.Fragment, {
                                    children: [
                                      (0, o.jsx)(ny.p, {
                                        addFileLabel: g.t(ry.UPLOAD_FILE),
                                        enabled: !0,
                                        id: `upload-button-${r}`,
                                        onUpload: a,
                                        showAddFileLable: !0,
                                        tooltip: void 0,
                                        multi: !1
                                      }),
                                      (0, o.jsx)(
                                        "div",
                                        Object.assign(
                                          {
                                            className: "upload-msg"
                                          },
                                          {
                                            children: (0, o.jsx)("div", {
                                              children: g.t(ry.DROP_FILES_MESSAGE)
                                            })
                                          }
                                        )
                                      )
                                    ]
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
    )
  })
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "detail-panel-header"
          },
          {
            children: [
              (0, o.jsx)(dt.P, {
                label: _,
                className: "return-btn",
                size: ce.qE.SMALL,
                icon: "back",
                onClose: k
              }),
              (0, o.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "plugin-header"
                  },
                  {
                    children: [
                      (0, o.jsxs)(
                        "div",
                        Object.assign(
                          {
                            className: "plugin-label"
                          },
                          {
                            children: [
                              (0, o.jsx)(
                                "div",
                                Object.assign(
                                  {
                                    className: "plugin-title"
                                  },
                                  {
                                    children: g.T(iy.o._COMMON_.TITLE, r.name)
                                  }
                                )
                              ),
                              (0, o.jsxs)(
                                "div",
                                Object.assign(
                                  {
                                    className: B("plugin-description", P)
                                  },
                                  {
                                    children: [
                                      x && "Update available:",
                                      " ",
                                      r.version,
                                      x &&
                                        (0, o.jsx)(ce.zx, {
                                          tooltip: x,
                                          tooltipOptions: {
                                            placement: "bottom"
                                          },
                                          icon: "info",
                                          variant: ce.Wu.TERTIARY
                                        })
                                    ]
                                  }
                                )
                              )
                            ]
                          }
                        )
                      ),
                      (0, o.jsx)(pt.Z, {
                        toggled: d,
                        onToggle: () => {
                          const e = !d
                          u(e),
                            e
                              ? m.issueCommand(
                                  new PluginLoadCommand(r.name, S, r.config, {
                                    strict: r.strict,
                                    fetchLevel: r.fetchLevel
                                  })
                                )
                              : m.issueCommand(new PluginUnloadCommand(r.name)),
                            p(!0)
                        },
                        enabled: !0,
                        onOffLabel: !1,
                        testId: "PluginEnabledToggle"
                      })
                    ]
                  }
                )
              )
            ]
          }
        )
      ),
      (0, o.jsxs)(
        "div",
        Object.assign(
          {
            className: "plugin-config-form-container",
            onKeyDown: e => {
              "Escape" === e.key && k(), "Tab" !== e.key && e.stopPropagation()
            }
          },
          {
            children: [
              "0.0.0" === r.version &&
                (0, o.jsx)("em", {
                  children: "Details not available"
                }),
              (!v || d) &&
                (0, o.jsx)(Form, {
                  schema: r,
                  submitDisabled: !h,
                  handleChange: e => {
                    if (!(null == r ? void 0 : r.config)) return
                    p(!0)
                    const t = Object.keys(e.formData),
                      n = e.schema.properties || {}
                    t.every(e => !!Object(n[e])["ui:subscribeTo"]) || O(JSON.parse(JSON.stringify(e.formData)))
                  },
                  handleSubmit: w,
                  onRequestSdkData: (e, t) => {
                    if ("Camera.getPose" === e) {
                      const n = e => {
                        const n = (e.rotation.y - 90 + 360) % 360
                        t(n.toFixed(3))
                      }
                      m.issueCommand(new PluginConfigFetchDataCommand(e, n))
                    } else {
                      if ("Camera.pose" !== e) throw new Error('No transform handler for operation: "' + e + '"')
                      {
                        const n = e => {
                          t(JSON.stringify(e))
                        }
                        m.issueCommand(new PluginConfigFetchDataCommand(e, n))
                      }
                    }
                  },
                  propertyObservable: a.dataMap.pluginEvents,
                  autoValidate: d && T,
                  onImageUpload: async ({ files: e, fieldName: t, onChange: n, originalValue: i }) => {
                    const s = e[e.length - 1]
                    if (!s) return
                    const o = `${r.name}.${t}`,
                      l = a.dataMap.attachmentsData.pendings.onChanged(() => {
                        var e
                        const s = a.dataMap.attachmentsData.pendings.values.find(e => e.parentId === o)
                        if (!s) return
                        a.dataMap.attachmentsData.removePendingAttachment(s.id)
                        const c = y.findIndex(e => e.id === r.name),
                          d = y.get(c)
                        if (i) {
                          ;(null === (e = null == d ? void 0 : d.config) || void 0 === e ? void 0 : e[t]) === i ||
                            m.issueCommand(new AttachmentDeleteCommand(i))
                        }
                        m.issueCommand(new AttachmentAssociateWithPluginCommand(s.id, r.name)), n(s.id), l.cancel()
                      })
                    m.issueCommand(new Xv.It(o, "plugin", [s]))
                  },
                  initialConfig: null !== (s = null == E ? void 0 : E.config) && void 0 !== s ? s : {},
                  imageUploadComponent: C
                })
            ]
          }
        )
      )
    ]
  })
}
const { PLUGINS: cy } = PhraseKey.WORKSHOP
function dy({ onSelect: e, plugin: t }) {
  const { name: n } = t,
    i = (0, L.b)()
  let s
  s = t.icon
    ? t.icon.startsWith("http")
      ? (0, o.jsx)(ts.C, {
          className: B({
            invert: t.icon.endsWith("#invert")
          }),
          imageUrl: t.icon
        })
      : (0, o.jsx)(ts.C, {
          label: t.icon
        })
    : (0, o.jsx)(ts.C, {
        iconClass: "icon-toolbar-plugin-config"
      })
  const r = t.enabled
      ? (0, o.jsxs)(o.Fragment, {
          children: [
            (0, o.jsx)("span", {
              className: "icon-checkmark"
            }),
            (0, o.jsx)(
              "span",
              Object.assign(
                {
                  className: "enabled-text"
                },
                {
                  children: i.t(cy.ENABLED)
                }
              )
            )
          ]
        })
      : void 0,
    a = (0, o.jsxs)(
      "div",
      Object.assign(
        {
          className: "item-details"
        },
        {
          children: [
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "item-header"
                },
                {
                  children: (0, o.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "text-box-text"
                      },
                      {
                        children: i.T(iy.o._COMMON_.TITLE, n)
                      }
                    )
                  )
                }
              )
            ),
            (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "item-description"
                },
                {
                  children: (0, o.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "text-box-text"
                      },
                      {
                        children: "By Matterport"
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
  return (0, o.jsx)(
    ce.HC,
    {
      id: n,
      className: "search-result-item plugin-list-item",
      title: a,
      badge: s,
      actions: r,
      onClick: () => {
        e(n)
      }
    },
    n
  )
}
const { TOOLS: hy } = PhraseKey
function py({ manager: e }) {
  const t = (0, L.b)(),
    n =
      (function () {
        var e
        const t = (0, $.Q)(ToolsList.PLUGIN_CONFIG),
          n = t ? t.manager : null
        return (0, ly.m)(null !== (e = null == n ? void 0 : n.dataMap.pluginList) && void 0 !== e ? e : null)
      })() || [],
    { commandBinder: s, messageBus: r } = (0, i.useContext)(AppReactContext),
    a = t.t(hy.PLUGIN_CONFIG),
    l = (function (e) {
      const t = (0, $.Q)(ToolsList.PLUGIN_CONFIG),
        n = t ? t.manager : null,
        [s, r] = (0, i.useState)((null == n ? void 0 : n.openPlugin) || null)
      return (
        (0, i.useEffect)(() => {
          if (!n) return () => {}
          const t = n.onOpenPluginChanged(r)
          return (
            r(n.openPlugin),
            () => {
              e(), t && t.cancel()
            }
          )
        }, [n]),
        s
      )
    })(() => {
      s.issueCommand(new PluginResetAllCommand())
    }),
    [d, h] = (0, i.useState)(!!l),
    p = t => {
      const i = n.find(e => e.name === t) || null
      e.setOpenPlugin(i), h(!0)
    },
    m = () => {
      h(!1), e.setOpenPlugin(null), r.broadcast(new PluginDetailPanelCloseMessage())
    },
    f = (0, o.jsx)("header", {
      children: (0, o.jsx)(Tl.z, {
        toolId: ToolsList.PLUGIN_CONFIG
      })
    }),
    g = n.map(e =>
      (0, o.jsx)(
        dy,
        {
          plugin: e,
          onSelect: p
        },
        e.name
      )
    )
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsx)(
        uo.J,
        Object.assign(
          {
            className: "plugin-detail-panel",
            open: d,
            scrollingDisabled: !1,
            onClose: m
          },
          {
            children:
              l &&
              (0, o.jsx)(oy, {
                plugin: l,
                onClose: m,
                manager: e
              })
          }
        )
      ),
      (0, o.jsx)(
        He.L,
        Object.assign(
          {
            toolId: ToolsList.PLUGIN_CONFIG,
            className: B("plugin-config-panel", {
              disabled: l
            }),
            title: a,
            subheader: f,
            hideBadge: !0
          },
          {
            children: (0, o.jsx)(
              "div",
              Object.assign(
                {
                  className: "panel-list plugin-config-panel-body"
                },
                {
                  children: (0, o.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "list-contents plugin-list"
                      },
                      {
                        children: g
                      }
                    )
                  )
                }
              )
            )
          }
        )
      )
    ]
  })
}
class my {
  constructor(e) {
    ;(this.manager = e),
      (this.renderPanel = () =>
        (0, o.jsx)(py, {
          manager: this.manager
        }))
  }
}
const { TOOLS: gy, WORKSHOP: vy, ERRORS: yy } = PhraseKey
export default class WorkshopUiModule extends Module {
  loadUi: Function
  constructor() {
    super(...arguments),
      (this.name = "workshop-ui-module"),
      (this.loadUi = async (e, t, n, r, a, o, l, d, u, h, p, m) => {
        const f = {
          editMode: !0,
          locale: e,
          analytics: t,
          settings: n,
          toolsData: this.toolsData,
          userData: r,
          mainDiv: a,
          engine: l,
          messageBus: d,
          market: u,
          commandBinder: h,
          queue: m
        }
        ;(this.reactRoot = createRoot(o)),
          this.reactRoot.render(
            (0, i.createElement)(
              AppReactContext.Provider,
              {
                value: f
              },
              [
                (0, i.createElement)(Pi, {
                  key: "workshop-ui",
                  onAppReadyChanged: p
                })
              ]
            )
          ),
          this.initializeTools()
      }),
      (this.onSaveError = e => {
        const { error: t } = e
        this.engine.commandBinder.issueCommand(
          new DefaultErrorCommand(yy.UNABLE_TO_SAVE_CHANGES_ERROR_MESSAGE, {
            throttle: 30,
            timeout: 10,
            type: Ri.N.ERROR,
            error: t
          })
        )
      }),
      (this.onForbiddenError = e => {
        const { error: t } = e
        this.engine.commandBinder.issueCommand(
          new DefaultErrorCommand(yy.UNAUTHORIZED_ERROR_MESSAGE, {
            throttle: 0,
            timeout: 0,
            type: Ri.N.ERROR,
            error: t
          })
        )
      })
  }
  async init(e, t) {
    ;(this.engine = t),
      ([this.settingsData, this.toolsData, this.sweepViewData, this.containerData, this.tagsViewData] = await Promise.all([
        t.market.waitForData(SettingsData),
        t.market.waitForData(ToolsData),
        t.market.waitForData(SweepsViewData),
        t.market.waitForData(ContainerData),
        t.market.waitForData(TagsViewData)
      ])),
      this.bindings.push(t.subscribe(SaveErrorMessage, this.onSaveError), t.subscribe(ForbiddenErrorMessage, this.onForbiddenError))
  }
  async unloadUi() {
    return !!this.reactRoot && (this.reactRoot.unmount(), !0)
  }
  initializeTools() {
    const e = new sr(this.engine, this.settingsData, this.tagsViewData),
      t = new Ur(this.engine),
      n = new Ie(this.engine, this.settingsData),
      i = new Kr(this.engine, this.settingsData),
      s = [
        new ToolObject({
          id: ToolsList.START_LOCATION,
          namePhraseKey: gy.START_LOCATION,
          panel: !1,
          panelBar: !0,
          icon: "icon-toolbar-start-location",
          analytic: "start_location",
          palette: ToolPalette.VIEW_BASED,
          order: 10,
          dimmed: !1,
          enabled: this.settingsData.tryGetProperty(ToolsStartLocationKey, !1),
          ui: new Yl(e),
          manager: e,
          helpMessagePhraseKey: gy.START_LOCATION_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/hc/en-us/articles/209012357-4-Set-the-Start-Position"
        }),
        new ToolObject({
          id: ToolsList.SCANS_3D,
          namePhraseKey: gy.SCANS_3D,
          panel: !0,
          icon: "icon-toolbar-scan-mgmt",
          analytic: "3d_scans",
          palette: ToolPalette.MODEL_BASED,
          allViewsPhraseKey: PhraseKey.WORKSHOP.LAYERS.APPLY_TO_ALL_VIEWS_SCANS_3D,
          order: 20,
          dimmed: this.sweepViewData.getAlignedSweeps(!0).length < 2,
          enabled: this.settingsData.tryGetProperty(ToolsScanManagementKey, !1),
          ui: new Bl(),
          manager: new Or(this.engine, this.settingsData),
          helpMessagePhraseKey: gy.SCANS_3D_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/hc/en-us/articles/209012367-5-Hide-Extra-Scans-Video-"
        }),
        new ToolObject({
          id: ToolsList.VIEW_360,
          namePhraseKey: gy.VIEW_360,
          panel: !0,
          icon: "icon-toolbar-360-view",
          analytic: "360_views",
          palette: ToolPalette.MODEL_BASED,
          allViewsPhraseKey: PhraseKey.WORKSHOP.LAYERS.APPLY_TO_ALL_VIEWS_VIEW_360,
          order: 30,
          dimmed: 0 === this.sweepViewData.getAlignedSweeps(!1).length,
          enabled: this.settingsData.tryGetProperty(Tools360ManagementKey, !1),
          manager: t,
          ui: new Tc(t),
          helpMessagePhraseKey: gy.VIEW_360_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/s/article/Include-360-Views-in-your-Space"
        }),
        new ToolObject({
          id: ToolsList.PHOTOS,
          namePhraseKey: gy.PHOTOS,
          panel: !1,
          panelBar: !0,
          icon: "icon-toolbar-photos",
          analytic: "photos",
          palette: ToolPalette.MODEL_BASED,
          order: 40,
          dimmed: !1,
          enabled: this.settingsData.tryGetProperty(ToolsPhotosEditorKey, !1),
          manager: i,
          ui: new La(i),
          helpMessagePhraseKey: gy.PHOTOS_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/hc/en-us/articles/213282727-How-do-I-take-a-Photo-or-Snapshot-#take-a-2d-snapshot-0-0"
        }),
        this.getLabelTool(),
        this.getMeasurementTool(),
        this.getTagTool(),
        new ToolObject({
          id: ToolsList.HLR,
          namePhraseKey: gy.TOURS,
          panel: !1,
          icon: "icon-toolbar-hlr",
          analytic: "hlr",
          palette: ToolPalette.VIEW_BASED,
          order: 60,
          dimmed: !1,
          enabled: this.settingsData.tryGetProperty(ToolsTourEditorKey, !1),
          manager: n,
          ui: new Fa(n),
          helpMessagePhraseKey: gy.TOURS_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/hc/en-us/articles/360019401733-Highlight-Reel-Guided-Tour-in-Workshop-3-0-"
        }),
        new ToolObject({
          id: ToolsList.SETTINGS_PANEL,
          namePhraseKey: gy.SETTINGS_PANEL,
          panel: !1,
          icon: "icon-settings",
          analytic: "settings",
          dimmed: !1,
          enabled: !0,
          manager: new un(this.engine, this.settingsData)
        }),
        new ToolObject({
          id: ToolsList.NOTES,
          deepLinkParam: "note",
          searchModeType: searchModeType.NOTE,
          namePhraseKey: gy.NOTES,
          panel: !0,
          icon: "icon-comment-outline",
          analytic: "notes",
          palette: ToolPalette.VIEW_BASED,
          order: 80,
          dimmed: !1,
          enabled: this.settingsData.tryGetProperty(FeaturesNotesModeKey, !1),
          ui: new yl(),
          manager: new ws(this.engine, this.settingsData),
          helpMessagePhraseKey: gy.NOTES_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/s/article/Matterport-Notes"
        }),
        new ToolObject({
          id: ToolsList.MESH_TRIM,
          namePhraseKey: gy.MESH_TRIM,
          panel: !0,
          icon: "icon-mesh-trim",
          analytic: "trim",
          palette: ToolPalette.MODEL_BASED,
          allViewsPhraseKey: PhraseKey.WORKSHOP.LAYERS.APPLY_TO_ALL_VIEWS_TRIM,
          order: 100,
          dimmed: !1,
          enabled: this.settingsData.tryGetProperty(FeaturesMeshtrimKey, !1),
          manager: new ra(this.engine, this.settingsData),
          ui: new pd(),
          featureFlag: FeaturesMeshtrimKey,
          helpMessagePhraseKey: gy.MESH_TRIM_HELP_MESSAGE,
          helpHref: "https://support.matterport.com/s/article/How-To-Use-Dollhouse-Trim",
          showModeControls: !1,
          showTourControls: !1
        })
        // this.getPluginTool()
      ]
    this.engine.commandBinder.issueCommand(new RegisterToolsCommand(s))
  }
  getPluginTool() {
    const e = new Ed(this.engine, this.settingsData)
    return new ToolObject({
      id: ToolsList.PLUGIN_CONFIG,
      namePhraseKey: gy.PLUGIN_CONFIG,
      panel: !0,
      icon: "icon-toolbar-plugin-config",
      analytic: "plugins",
      palette: ToolPalette.MODEL_BASED,
      allViewsPhraseKey: PhraseKey.WORKSHOP.PLUGINS.SAVE_CONFIG,
      order: 40,
      dimmed: !1,
      enabled: this.settingsData.tryGetProperty(SpacesPluginsConfigKey, !1),
      manager: e,
      badgePhraseKey: vy.EDIT_BAR.BETA_TAG,
      ui: new my(e),
      helpMessagePhraseKey: gy.PLUGIN_CONFIG_HELP_MESSAGE,
      helpHref: "https://support.matterport.com/s/article/Enhance-the-Showcase-Experience-with-Plug-Ins"
    })
  }
  getLabelTool() {
    const e = new ia(this.engine, this.settingsData)
    return new ToolObject({
      id: ToolsList.LABELS,
      searchModeType: searchModeType.LABEL,
      namePhraseKey: gy.LABELS,
      panel: !0,
      icon: "icon-toolbar-labels",
      analytic: "labels",
      palette: ToolPalette.VIEW_BASED,
      order: 50,
      dimmed: !1,
      enabled: this.settingsData.tryGetProperty(ToolsLabelsKey, !1),
      manager: e,
      ui: new Oo(e, this.containerData),
      helpMessagePhraseKey: gy.LABELS_HELP_MESSAGE,
      helpHref: "https://support.matterport.com/hc/en-us/articles/233085288-Add-Labels-to-your-Space"
    })
  }
  getMeasurementTool() {
    const e = new ps(this.engine, this.settingsData)
    return new ToolObject({
      id: ToolsList.MEASUREMENTS,
      searchModeType: searchModeType.MEASUREMENTPATH,
      namePhraseKey: gy.MEASUREMENTS,
      panel: !0,
      icon: "icon-tape-measure",
      analytic: "measurements",
      palette: ToolPalette.VIEW_BASED,
      order: 60,
      dimmed: !1,
      enabled: this.settingsData.tryGetProperty(ToolsMeasurementsKey, !1),
      manager: e,
      ui: new No(),
      helpMessagePhraseKey: gy.MEASUREMENTS_HELP_MESSAGE,
      helpHref: "https://support.matterport.com/hc/en-us/articles/360039698314-Introducing-Measurement-Mode-Now-Everyone-Can-Measure-"
    })
  }
  getTagTool() {
    const e = new Gs(this.engine, this.settingsData)
    return new ToolObject({
      id: ToolsList.TAGS,
      deepLinkParam: "tag",
      searchModeType: searchModeType.MATTERTAG,
      namePhraseKey: gy.TAGS,
      panel: !0,
      icon: "icon-toolbar-mattertags",
      analytic: "tags",
      palette: ToolPalette.VIEW_BASED,
      order: 70,
      dimmed: !1,
      enabled: !0,
      ui: new hl(e),
      manager: e,
      helpMessagePhraseKey: gy.TAGS_HELP_MESSAGE,
      helpHref: "https://support.matterport.com/hc/en-us/articles/360021585133-Create-a-Mattertag-Post"
    })
  }
}
