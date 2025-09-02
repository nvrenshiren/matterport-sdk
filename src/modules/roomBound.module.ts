import * as q from "react"
import * as G from "react/jsx-runtime"
import { DollhousePeekabooKey } from "../const/66777"
import { InputSymbol, ModelMeshSymbol, RoomBoundRendererSymbol, RoomBoundSymbol } from "../const/symbol.const"
import { ToolsList } from "../const/tools.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { ISubscription, createSubscription } from "../core/subscription"
import { AppData, AppMode, AppStatus } from "../data/app.data"
import { BtnText } from "../data/player.options.data"
import { RoomBoundViewData } from "../data/room.bound.view.data"
import { SettingsData } from "../data/settings.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { StartMoveToFloorMessage } from "../message/floor.message"
import { ApplicationLoadedMessage } from "../message/app.message"
import { AssetDockedMessage, AssetUndockedMessage } from "../message/panel.message"
import { ObservableValue } from "../observable/observable.value"
import * as Q from "../other/1358"
import * as z from "../other/2098"
import * as st from "../other/31131"
import * as at from "../other/36964"
import * as Z from "../other/37749"
import * as U from "../other/38490"
import * as rt from "../other/51978"
import * as _ from "../other/56843"
import * as ht from "../other/57370"
import * as dt from "../other/60119"
import * as Y from "../other/6521"
import * as W from "../other/65428"
import * as X from "../other/66102"
import * as $ from "../other/84426"
import * as K from "../other/84784"
import * as ct from "../other/89478"
import * as pt from "../other/91418"
import * as et from "../other/94526"
import * as nt from "../other/96403"
import * as ut from "../other/98025"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import * as M from "../webgl/87732"

import { RoomBoundSetAllowRenderingCommand, RoomboundUnselectCommand, SetRoomboundVisibilityCommand } from "../command/room.command"
import { OpenPreviousToolCommand, RegisterToolsCommand, ToggleToolCommand, ToolBottomPanelCollapseCommand } from "../command/tool.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import EngineContext from "../core/engineContext"
import { MessageBus } from "../core/messageBus"
import { RoomBoundData } from "../data/room.bound.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { DragAndDropObject } from "../message/event.message"
import { TourStartedMessage, TourStoppedMessage } from "../message/tour.message"
import { ToolObject } from "../object/tool.object"
import { tryGetModuleBySymbolSync } from "../other/24085"
import { ShowcaseRoomBoundsKey } from "../other/47309"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { isMobilePhone, winCanTouch } from "../utils/browser.utils"
import { Comparator } from "../utils/comparator"
import { doubleClickLimit } from "../utils/doubleClicker"
import { InputState } from "../webgl/input.state"
import { InputManager } from "../webgl/inputManager"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import InputIniModule from "./inputIni.module"
import RoomBoundRendererModule from "./roomBoundRenderer.module"
declare global {
  interface SymbolModule {
    [RoomBoundSymbol]: RoomBoundModule
  }
}
const L = new DebugInfo("room-bounds-editor")
export class RoomBoundsEditor extends DragAndDropObject.DragAndDrop {
  messageBus: MessageBus
  input: InputIniModule
  settingsData: SettingsData
  allViewsComparator: Comparator
  inputStates: InputState
  constructor(t, e, i) {
    super(new DragAndDropObject.State())
    this.messageBus = t
    this.input = e
    this.settingsData = i
    this.allViewsComparator = Comparator.is(t => t instanceof M.c)
    this.subscribe(DragAndDropObject.Events.StateChange, async ({ target: t }) => {
      this.inputStates = this.inputStates || this.bindInputToEditorStates()
      this.inputStates.cancel()
      this.inputStates.renew(t)
    })
  }
  bindInputToEditorStates() {
    const t = () => this.setEnabled(!1)
    const e = () => this.setEnabled(!0)
    const i = new AggregateSubscription(
      createSubscription(
        () => this.messageBus.subscribe(TourStartedMessage, t),
        () => this.messageBus.unsubscribe(TourStartedMessage, t),
        !1
      ),
      createSubscription(
        () => this.messageBus.subscribe(TourStoppedMessage, e),
        () => this.messageBus.unsubscribe(TourStoppedMessage, e),
        !1
      )
    )
    const s = winCanTouch()
      ? new AggregateSubscription()
      : new AggregateSubscription(
          this.input.registerMeshHandler(HoverMeshEvent, this.allViewsComparator, (t, e) => this.hover(e["roomBoundsId"])),
          this.input.registerMeshHandler(UnhoverMeshEvent, this.allViewsComparator, () => this.unhover())
        )
    s.cancel()
    const n = new AggregateSubscription(this.input.registerMeshHandler(InputClickerEndEvent, this.allViewsComparator, this.onToggleSelectInput.bind(this)))
    n.cancel()
    const o = t => !!this.state.selected && (this.discard(), t.preventDefault(), !0),
      a = [this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(SkySphereMesh), o)]
    this.settingsData.tryGetProperty(DollhousePeekabooKey, !1) ||
      a.push(this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(ShowcaseMesh), o))
    const r = new AggregateSubscription(...a)
    r.cancel()
    const h = this.messageBus.subscribe(StartMoveToFloorMessage, () => this.discard()),
      d = new AggregateSubscription(
        i,
        s,
        n,
        r,
        h,
        (t => {
          const e = L.debug
          return createSubscription(
            () => e(`${t}.renew()`),
            () => e(`${t}.cancel()`),
            !1
          )
        })("ToolState.SELECTED || ToolState.IDLE -> bindings")
      )
    return new InputState([
      { state: DragAndDropObject.ToolState.DISABLED, subs: [i] },
      { state: DragAndDropObject.ToolState.SELECTED, subs: [d] },
      { state: DragAndDropObject.ToolState.IDLE, subs: [d] }
    ])
  }
  onToggleSelectInput(t, e) {
    const i = e.roomBoundsId,
      s = this.state.selected === i
    return (
      i &&
        setTimeout(() => {
          e.parent && (s ? t instanceof InputClickerEndEvent && (this.discard(), this.deselect()) : (this.select(i), this.hover(i)))
        }, 0),
      !s
    )
  }
}
class ToolManger {
  engine: EngineContext
  toolsData: ToolsData
  viewData: RoomBoundViewData
  bindings: ISubscription[]
  selectionChanged: (t: any) => Promise<void>
  selectionBinding: null | ISubscription
  constructor(t, e, i) {
    this.engine = t
    this.toolsData = e
    this.viewData = i
    this.bindings = []
    this.selectionChanged = async t => {
      if (this.toolsData.activeToolName === ToolsList.ROOM_BOUNDS) return
      const e = this.viewData.editorState
      if (null != e) {
        const i = this.viewData.getSelectedRoom(t)
        if ((this.toolsData.activeToolName === ToolsList.ROOM_VIEW) !== !!i) {
          const s = async () => {
            t === e.selected &&
              (this.engine.commandBinder.issueCommand(new ToggleToolCommand(ToolsList.ROOM_VIEW, !!i)),
              this.engine.broadcast(i ? new AssetDockedMessage() : new AssetUndockedMessage()))
          }
          i ? setTimeout(s, doubleClickLimit + 25) : s()
        }
      }
    }
    this.bindings.push(
      this.viewData.onChanged(() => {
        null != this.viewData.editorState
          ? null == this.selectionBinding && (this.selectionBinding = this.viewData.editorState.onPropertyChanged("selected", this.selectionChanged))
          : (this.selectionBinding?.cancel(), (this.selectionBinding = null))
      })
    )
  }
  async activate() {}
  async deactivate() {}
  async dispose() {
    this.bindings.forEach(t => t.cancel()), this.selectionBinding?.cancel()
  }
}
function J({ room: t }) {
  const e = (0, Q.S)(),
    i = (0, X.b)(),
    s = (0, K.LN)(t.id, i, e)
  return (0, G.jsx)("div", Object.assign({ className: "room-title" }, { children: s }))
}
function tt() {
  const { locale: t, commandBinder: e } = (0, q.useContext)(AppReactContext),
    i = (0, W.A)(),
    s = (0, z.n)(),
    n = i && (i === ToolsList.SEARCH || i === ToolsList.LAYERS)
  async function o() {
    n
      ? (await e.issueCommand(new OpenPreviousToolCommand()), await e.issueCommand(new ToolBottomPanelCollapseCommand(!1)))
      : s && e.issueCommand(new RoomboundUnselectCommand(s.id))
  }
  const a = t.t(n ? PhraseKey.SHOWCASE.ROOMS.BACK : PhraseKey.SHOWCASE.ROOMS.CLOSE),
    r = n ? "back" : "close"
  return (0, G.jsxs)(
    _.J,
    Object.assign(
      { open: !!s, onClose: o },
      {
        children: [
          (0, G.jsx)(
            "div",
            Object.assign(
              { className: "detail-panel-header" },
              { children: (0, G.jsx)(U.P, { label: a, className: "return-btn", icon: r, size: $.qE.SMALL, onClose: o }) }
            )
          ),
          (0, G.jsx)(
            "div",
            Object.assign(
              { className: "room-view" },
              {
                children: s && (0, G.jsxs)(G.Fragment, { children: [(0, G.jsx)(J, { room: s }), (0, G.jsx)(Z.M, { room: s }), (0, G.jsx)(Y.X, { room: s })] })
              }
            )
          )
        ]
      }
    )
  )
}
const lt = (t?) => {
  return {
    roomDimensionsVisible: t?.roomDimensionsVisible,
    roomNamesVisible: t?.roomNamesVisible,
    roomWallsVisible: t?.roomWallsVisible
  }
}
const { ROOMS: gt } = PhraseKey.SHOWCASE
const ft = new ObservableValue(!0)
function vt() {
  const t = (0, et.B)(),
    e = (0, nt.B)(),
    i = (0, X.b)(),
    { analytics: s, commandBinder: n } = (0, q.useContext)(AppReactContext),
    o = (0, rt.y)(ShowcaseRoomBoundsKey, !1),
    a = (0, ht.q)(),
    h = (0, dt.d)(),
    d = tryGetModuleBySymbolSync(ModelMeshSymbol),
    u = (function () {
      var t
      const e = tryGetModuleBySymbolSync(ModelMeshSymbol)
      return (0, at.y)(null !== (t = null == e ? void 0 : e.meshGroupVisuals.allFloorsVisibleInOrtho) && void 0 !== t ? t : ft)
    })(),
    {
      roomNamesVisible: p,
      roomDimensionsVisible: m,
      roomWallsVisible: g
    } = (() => {
      const t = (0, dt.d)(),
        [e, i] = (0, q.useState)(lt(t))
      return (
        (0, q.useEffect)(() => {
          if (!t) return () => {}
          const e = () => i(lt(t)),
            s = t.onChanged(e)
          return (
            e(),
            () => {
              s.cancel()
            }
          )
        }, [t]),
        e
      )
    })(),
    f = t === ViewModes.Floorplan || t === ViewModes.Dollhouse
  if (
    ((0, q.useEffect)(() => {
      const t = p || m || g
      n.issueCommand(new SetRoomboundVisibilityCommand(t))
    }, [p, m, g, n]),
    !o || 0 === a.length || !f || !h || !d || (e && [ToolsList.MEASUREMENTS, ToolsList.NOTES].includes(e)))
  )
    return null
  const v = i.t(gt.SETTINGS),
    w = i.t(gt.ROOM_BOUNDS_TOGGLES_TITLE),
    y = i.t(gt.ROOM_BOUNDS_WALL_TOGGLE_LABEL),
    b = i.t(gt.ROOM_BOUNDS_ROOM_TOGGLE_LABEL),
    D = i.t(gt.ROOM_BOUNDS_DIMENSION_TOGGLE_LABEL),
    S = i.t(gt.ROOM_BOUNDS_MODEL_TOGGLE_LABEL),
    I = u
  return (0, G.jsxs)(
    ct.P,
    Object.assign(
      {
        icon: "settings",
        tooltip: v,
        theme: "overlay",
        variant: $.Wu.FAB,
        tooltipPlacement: "bottom",
        analytic: "JMYDCase_settings_click",
        className: "JMYDCase-settings",
        preventOverflow: { padding: 20 }
      },
      {
        children: [
          (0, G.jsx)("div", Object.assign({ className: "floorplan-overlay-title" }, { children: w })),
          (0, G.jsxs)(
            ut.J,
            Object.assign(
              { className: "floorplan-overlay-tooltip" },
              {
                children: [
                  (0, G.jsx)(pt.w, {
                    onToggle: () => {
                      h.setRoomWallsVisible(!g), s.trackToolGuiEvent("rooms", "room_walls_showcase_toggle_" + (g ? "off" : "on"))
                    },
                    toggled: g,
                    label: y,
                    enabled: I
                  }),
                  (0, G.jsx)(pt.w, {
                    onToggle: () => {
                      h.setRoomNamesVisible(!p), s.trackToolGuiEvent("rooms", "room_names_showcase_toggle_" + (p ? "off" : "on"))
                    },
                    toggled: p,
                    label: b,
                    enabled: !0
                  }),
                  (0, G.jsx)(pt.w, {
                    onToggle: () => {
                      h.setRoomDimensionsVisible(!m), s.trackToolGuiEvent("rooms", "room_dimensions_showcase_toggle_" + (m ? "off" : "on"))
                    },
                    toggled: m,
                    label: D,
                    enabled: !0
                  }),
                  (0, G.jsx)(pt.w, {
                    onToggle: () => {
                      const t = !u
                      ;(d.meshGroupVisuals.allFloorsVisibleInOrtho.value = t),
                        t || h.setRoomWallsVisible(!0),
                        s.trackToolGuiEvent("rooms", "room_imagery_showcase_toggle_" + (u ? "off" : "on"))
                    },
                    toggled: u,
                    label: S,
                    enabled: !0
                  }),
                  (0, G.jsx)(st.Q, {})
                ]
              }
            )
          )
        ]
      }
    )
  )
}
class ToolUI {
  constructor() {}
  renderPanel() {
    return (0, G.jsx)(tt, {})
  }
  renderTopUI() {
    return (0, G.jsx)(vt, {}, "room-bound")
  }
}
const yt = [ToolsList.SEARCH, ToolsList.LAYERS, ToolsList.ROOM_VIEW]
export default class RoomBoundModule extends Module {
  active: boolean
  allowRendering: boolean
  isActivatingOrDeactivating: boolean
  viewListener: { addView: (t: any, e: any) => any; removeView: (t: any) => any }
  inputManager: InputManager
  activate: () => Promise<void>
  editor: RoomBoundsEditor
  renderer: RoomBoundRendererModule
  viewData: RoomBoundViewData
  deactivate: () => Promise<void>
  unselect: (t: any) => Promise<void>
  engine: EngineContext
  data: RoomBoundData
  applicationData: AppData
  viewmodeData: ViewmodeData
  toolsData: ToolsData
  settingsData: SettingsData
  constructor() {
    super(...arguments)
    this.name = "room_bound"
    this.active = !1
    this.allowRendering = !0
    this.isActivatingOrDeactivating = !1
    this.viewListener = { addView: (t, e) => this.inputManager.addEditableEntity(t, e), removeView: t => this.inputManager.removeEditableEntity(t) }
    this.activate = async () => {
      ;(this.isActivatingOrDeactivating = !0),
        this.active ||
          ((this.active = !0),
          this.editor.start(),
          this.renderer.startRendering(!0, this.viewListener, () => !1),
          this.viewData.setRoomBoundVisible(!0),
          this.inputManager.activate()),
        (this.isActivatingOrDeactivating = !1)
    }
    this.deactivate = async () => {
      ;(this.isActivatingOrDeactivating = !0),
        this.active &&
          ((this.active = !1), this.editor.exit(), this.renderer.stopRendering(), this.viewData.setRoomBoundVisible(!1), this.inputManager.deactivate()),
        (this.isActivatingOrDeactivating = !1)
    }
    this.unselect = async t => {
      t && (await this.updateShowcaseVisibility(), this.active && this.editor.deselect())
    }
  }
  async init(t, e: EngineContext) {
    this.engine = e
    const [i, s, l, c, p, m, g, v] = await Promise.all([
      e.getModuleBySymbol(InputSymbol),
      e.market.waitForData(RoomBoundData),
      e.market.waitForData(SettingsData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(AppData),
      e.market.waitForData(ToolsData),
      e.getModuleBySymbol(RoomBoundRendererSymbol),
      e.market.waitForData(RoomBoundViewData)
    ])

    this.data = s as RoomBoundData
    this.data.onActionError = t => {
      this.applicationData.error = t
      this.applicationData.commit()
    }
    this.viewmodeData = c
    this.applicationData = p
    this.toolsData = m
    this.settingsData = l
    this.renderer = g
    this.viewData = v
    this.editor = new RoomBoundsEditor(e.msgBus, i, this.settingsData)
    this.viewData.setEditorState(this.editor.state)
    this.addToolPanel()
    this.inputManager = new InputManager(this.editor, s)
    this.bindings.push(
      e.commandBinder.addBinding(RoomboundUnselectCommand, async t => this.unselect(t.id)),
      e.commandBinder.addBinding(SetRoomboundVisibilityCommand, async t => this.toggleVisibilityForViewer(t.visible)),
      e.commandBinder.addBinding(RoomBoundSetAllowRenderingCommand, async t => await this.setAllowRendering(t.allowRendering)),
      c.currentModeObservable.onChanged(() => this.updateShowcaseVisibility()),
      c.transitionActiveObservable.onChanged(() => this.updateShowcaseVisibility()),
      this.applicationData.onChanged(() => this.updateShowcaseVisibility()),
      this.toolsData.onPropertyChanged("activeToolName", () => this.updateShowcaseVisibility()),
      this.settingsData.onPropertyChanged(BtnText.RoomBounds, () => this.updateShowcaseAvailability()),
      e.subscribe(ApplicationLoadedMessage, t => {
        this.updateShowcaseVisibility(), t.application === AppMode.SHOWCASE && this.addToolPanel()
      })
    )
    this.updateShowcaseAvailability()
  }
  dispose(t) {
    super.dispose(t)
    t.market.unregister(this, RoomBoundViewData)
  }
  toggleVisibilityForViewer(t) {
    this.viewData.visibleInShowcase = t
    this.viewData.commit()
    this.updateShowcaseVisibility()
  }
  async updateShowcaseAvailability() {
    const t = this.settingsData.tryGetProperty(BtnText.RoomBounds, !1),
      e = this.settingsData.tryGetProperty(ShowcaseFloorPlanKey, !1) || this.settingsData.tryGetProperty(ShowcaseDollhouseKey, !1),
      i = t && e
    this.settingsData.setProperty(ShowcaseRoomBoundsKey, i),
      i && !this.viewData.visibleInShowcase ? this.toggleVisibilityForViewer(!0) : this.updateShowcaseVisibility()
  }
  async updateShowcaseVisibility() {
    const t = this.toolsData.activeToolName === ToolsList.ROOM_BOUNDS
    if (this.isActivatingOrDeactivating || t) return
    const { application: e } = this.applicationData,
      i = e === AppMode.SHOWCASE,
      s = e === AppMode.WORKSHOP,
      o = this.settingsData.tryGetProperty(ShowcaseRoomBoundsKey, !1),
      a = (i && this.viewData.visibleInShowcase && o) || s,
      r = null == this.toolsData.activeToolName || yt.includes(this.toolsData.activeToolName),
      h = this.viewmodeData.transition.active
        ? !PanoramaOrMesh(this.viewmodeData.transition.from!) && !PanoramaOrMesh(this.viewmodeData.transition.to!)
        : !PanoramaOrMesh(this.viewmodeData.currentMode!),
      d = this.data.rooms.size > 0,
      u = this.applicationData.phase === AppStatus.PLAYING
    a && h && r && d && u && this.allowRendering ? await this.activate() : await this.deactivate()
  }
  async addToolPanel() {
    if (!this.toolsData.getTool(ToolsList.ROOM_VIEW)) {
      const t = new ToolManger(this.engine, this.toolsData, this.viewData),
        e = new ToolObject({ id: ToolsList.ROOM_VIEW, panel: !isMobilePhone(), enabled: !0, dimmed: !1, manager: t, ui: new ToolUI(), analytic: "rooms_view" })
      await this.engine.commandBinder.issueCommand(new RegisterToolsCommand([e]))
    }
  }
  async setAllowRendering(t) {
    ;(this.allowRendering = t), this.updateShowcaseVisibility()
  }
}
