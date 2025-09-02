import { Color } from "three"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { MoveToSweepCommand } from "../command/navigation.command"
import { TogglePuckEditingCommand } from "../command/sweep.command"
import { SweepTransition } from "../const/66777"
import { CursorStyle } from "../const/cursor.const"
import { MouseKeyIndex } from "../const/mouse.const"
import { PuckImageryDefaultConfig } from "../const/puckImagery.const"
import { CursorControllerSymbol, InputSymbol, PucksSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { createSubscription, ISubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { InteractionData } from "../data/interaction.data"
import { SettingsData } from "../data/settings.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import sweepBg from "../images/sweep_bg.png"
import sweepDisableBg from "../images/sweep_disable.png"
import { HandlePuckClickedMessage, HandlePuckHoverMessage } from "../message//sweep.message"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { Comparator } from "../utils/comparator"
import { LoadTexture } from "../utils/loadTexture"
import { ViewModes } from "../utils/viewMode.utils"
import { NearSweep } from "../webgl/nearsweep"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { ColliderMesh, SweepPuckRender } from "../webgl/sweepPuck.render"
import { FilteredHandler } from "./inputIni.module"
const sweepBgTexture = LoadTexture(sweepBg)
const sweepDisableBgTexture = LoadTexture(sweepDisableBg)
// const puckImageryConfig = { enabled: PuckImageryDefaultConfig, enabledHover: PuckImageryDefaultConfig }
const puckImageryConfig = { enabled: sweepBgTexture, enabledHover: sweepBgTexture, disabled: sweepDisableBgTexture, disabledHover: sweepDisableBgTexture }

declare global {
  interface SymbolModule {
    [PucksSymbol]: SweepPucksModule
  }
}
//pw
//定位模块
export default class SweepPucksModule extends Module {
  IDLE_OPACITY: number
  EDITING_OPACITY: number
  IDLE_COLOR: Color
  SELECTION_COLOR: Color
  defaultCheckRenderModes: () => boolean
  unselectingSweep: null | string
  editingEnabled: boolean
  selectionBindings: FilteredHandler[]
  unselectionBindings: FilteredHandler[]
  isHoveringPuck: boolean
  selectionHandled: boolean
  unselectionHandled: boolean
  handlePuckClickedMessage: (t: string) => void
  sweepViewData: SweepsViewData
  cameraData: CameraData
  engine: EngineContext
  interactionmodeData: InteractionData
  handlePuckHoverMessage: (e: { hovered: boolean }) => void
  cursorVisibilityRule: () => boolean
  handleSweepSelectionChange: () => void
  selectedSweep: string | null
  updateViewmode: () => void
  viewmode: ViewModes | null
  viewmodeData: ViewmodeData
  unselectPuck: () => void
  updateHandlers: () => void
  onUnselectPuck: (t: any) => boolean
  onPointerOnPuck: (t: OnMouseDownEvent, e: any) => void
  renderer: SweepPuckRender
  selectionSub: ISubscription
  constructor() {
    super(...arguments)
    this.name = "sweep-pucks"
    this.IDLE_OPACITY = 0.3
    this.EDITING_OPACITY = 0.9
    this.IDLE_COLOR = new Color("white")
    this.SELECTION_COLOR = new Color("#0baedc")
    this.defaultCheckRenderModes = () => !0
    this.unselectingSweep = null
    this.editingEnabled = !1
    this.selectionBindings = []
    this.unselectionBindings = []
    this.isHoveringPuck = !1
    this.selectionHandled = !0
    this.unselectionHandled = !0
    this.handlePuckClickedMessage = t => {
      if (!t) throw new Error("SweepPucks -> on PuckClickedMessage: Tried to move to invalid sweep id.")
      this.canSelectPuck() ||
        (this.sweepViewData.data.canTransition() &&
          this.cameraData.canTransition() &&
          this.engine.commandBinder.issueCommand(new MoveToSweepCommand({ transition: SweepTransition[this.interactionmodeData.mode], sweep: t })))
    }
    this.handlePuckHoverMessage = (e: { hovered: boolean }) => {
      this.isHoveringPuck = e.hovered
      this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(e.hovered ? CursorStyle.FINGER : null))
    }
    this.cursorVisibilityRule = () => !this.isHoveringPuck
    this.handleSweepSelectionChange = () => {
      this.updateHighlightOnSelectedPuck(!1)
      this.selectedSweep = this.sweepViewData.selectedSweep
      this.updateHighlightOnSelectedPuck(!0)
      this.updateHandlers()
    }
    this.updateViewmode = () => {
      this.viewmode = this.viewmodeData.currentMode
      this.updateHighlightOnSelectedPuck(this.editingEnabled)
      this.updateHandlers()
    }
    this.updateHandlers = () => {
      this.selectionHandled = this.toggleHandlers(this.canSelectPuck(), this.selectionBindings, this.selectionHandled)
      this.unselectionHandled = this.toggleHandlers(this.canUnselectPuck(), this.unselectionBindings, this.unselectionHandled)
    }
    this.unselectPuck = () => {
      this.unselectingSweep = null
      this.sweepViewData.setSelectedSweep(null)
    }
    this.onUnselectPuck = t => {
      const e = this.sweepViewData.selectedSweep
      e && (t.down ? (this.unselectingSweep = e) : this.unselectingSweep && this.unselectPuck())
      return !0
    }
    this.onPointerOnPuck = (t, e) => {
      if (t.button !== MouseKeyIndex.PRIMARY) return
      const i = this.renderer.getSweepId(e.id)
      i &&
        (t.down
          ? i === this.selectedSweep
            ? (this.unselectingSweep = i)
            : ((this.unselectingSweep = null), this.sweepViewData.setSelectedSweep(i))
          : (i === this.unselectingSweep && this.unselectPuck(), (this.unselectingSweep = null)))
    }
  }
  nearSweep: NearSweep
  async init(t, e: EngineContext) {
    this.engine = e
    void 0 !== t.checkRenderModes && (this.defaultCheckRenderModes = t.checkRenderModes)
    const i = (await e.getModuleBySymbol(WebglRendererSymbol)).getScene()
    const s = await e.getModuleBySymbol(InputSymbol)
    const n = await e.getModuleBySymbol(CursorControllerSymbol)
    const [c, u, y, b, S] = await Promise.all([
      e.market.waitForData(SettingsData),
      e.market.waitForData(CameraData),
      e.market.waitForData(SweepsViewData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(InteractionData)
    ])

    this.viewmodeData = b
    this.viewmode = b.currentMode
    this.sweepViewData = y
    this.cameraData = u
    this.interactionmodeData = S
    this.renderer = new SweepPuckRender(
      i.scene,
      s,
      c,
      y,
      puckImageryConfig,
      !0,
      this.defaultCheckRenderModes,
      this.IDLE_COLOR,
      this.SELECTION_COLOR,
      this.IDLE_OPACITY,
      this.EDITING_OPACITY,
      void 0,
      void 0,
      e.claimRenderLayer(this.name)
    )
    e.addComponent(this, this.renderer)
    this.nearSweep = new NearSweep(i, s, y, this.viewmodeData)
    e.addComponent(this, this.nearSweep)
    this.bindings.push(
      e.commandBinder.addBinding(TogglePuckEditingCommand, async t => this.togglePuckEditing(t.enabled)),
      e.subscribe(HandlePuckClickedMessage, t => this.handlePuckClickedMessage(t.sweepId)),
      e.subscribe(HandlePuckHoverMessage, this.handlePuckHoverMessage),
      createSubscription(
        () => n.addVisibilityRule(this.cursorVisibilityRule),
        () => n.removeVisibilityRule(this.cursorVisibilityRule)
      )
    )
    this.selectionBindings.push(
      s.registerMeshHandler(OnMouseDownEvent, Comparator.isType(ColliderMesh), this.onPointerOnPuck),
      s.registerHandler(OnMoveEvent, () => {
        this.unselectingSweep = null
      })
    )
    this.selectionHandled = this.toggleHandlers(!1, this.selectionBindings, this.selectionHandled)
    this.selectionSub = this.sweepViewData.onSelectedSweepChanged(this.handleSweepSelectionChange)
    this.selectionSub.cancel()
    this.unselectionBindings.push(
      s.registerPriorityHandler(InputClickerEndEvent, ShowcaseMesh, () => !0),
      s.registerPriorityHandler(OnMouseDownEvent, ShowcaseMesh, this.onUnselectPuck),
      s.registerPriorityHandler(OnMouseDownEvent, SkySphereMesh, this.onUnselectPuck)
    )
    this.unselectionHandled = this.toggleHandlers(!1, this.unselectionBindings, this.unselectionHandled)
  }
  toggleNearSweep(enable: boolean) {
    this.nearSweep.toggle(enable)
  }
  dispose(t) {
    for (const t of this.bindings) t.cancel()
    this.bindings = []
    this.togglePuckEditing(!1)
    super.dispose(t)
  }
  updatePuckImagery(t: Record<string, typeof PuckImageryDefaultConfig> = {}) {
    const e = Object.assign(Object.assign({}, puckImageryConfig), t)
    e.disabled && !e.disabledHover && (e.disabledHover = e.disabled)
    this.renderer.updatePuckImagery(e)
  }
  updateCheckRenderModes(t?: () => boolean) {
    this.renderer.updateCheckRenderModes(t || this.defaultCheckRenderModes)
  }
  updateHighlightOnSelectedPuck(t: boolean) {
    const e = this.selectedSweep
    if (e) {
      if (!this.sweepViewData.isSweepAligned(e)) return
      const i = this.viewmode === ViewModes.Dollhouse || this.viewmode === ViewModes.Floorplan
      this.renderer.renderPuckHighlight(e, this.editingEnabled && i && t)
    }
  }
  togglePuckEditing(t: boolean) {
    this.editingEnabled = t
    this.selectedSweep = this.sweepViewData.selectedSweep
    this.updateViewmode()
    this.renderer.toggleEditingEnabled(t)
    t
      ? (this.engine.subscribe(EndSwitchViewmodeMessage, this.updateViewmode), this.selectionSub.renew())
      : (this.engine.unsubscribe(EndSwitchViewmodeMessage, this.updateViewmode), this.selectionSub.cancel())
  }
  canUnselectPuck() {
    const t = this.viewmode === ViewModes.Dollhouse || this.viewmode === ViewModes.Floorplan
    return this.editingEnabled && !!this.selectedSweep && t
  }
  canSelectPuck() {
    const t = this.viewmode === ViewModes.Dollhouse || this.viewmode === ViewModes.Floorplan
    return this.editingEnabled && t
  }
  toggleHandlers(t: boolean, e: FilteredHandler[], i: boolean) {
    if (t !== i) for (const i of e) t ? i.renew() : i.cancel()
    return t
  }
}
