import { Object3D, Scene, Vector3 } from "three"
import { TogglePanoMarkerCommand } from "../command/pano.command"
import { HighlightPinCommand } from "../command/pin.command"
import {
  EndPinConnectionCommand,
  EndRotateSweepCommand,
  PlaceSweepCommand,
  RenameSweepCommand,
  ToggleNonPanoCurrentPuckCommand,
  TogglePuckEditingCommand,
  ToggleSweepCommand,
  ToggleSweepNumbersCommand,
  UnplaceSweepCommand
} from "../command/sweep.command"
import { PickingPriorityType } from "../const/12529"
import * as l from "../const/71161"
import { PucksSymbol, WebglRendererSymbol, WorkShopSweepEditSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { BaseExceptionError } from "../error/baseException.error"
import sweepBg from "../images/sweep_bg.png"
import sweepDisableBg from "../images/sweep_disable.png"
import { lerp } from "../math/2569"
import { ScanVisibilityModifiedMessage, UnalignedMovedMessage, UnalignedPlacedMessage, UnalignedUnplacedMessage } from "../message/sweep.message"
import { AlignmentType, PlacementType, SweepObject } from "../object/sweep.object"
import { LoadTexture } from "../utils/loadTexture"
import { TextRenderer } from "../webgl/67971"
import SweepPucksModule from "./sweepPucks.module"

declare global {
  interface SymbolModule {
    [WorkShopSweepEditSymbol]: SweepEditorModule
  }
}
class SweepplacementBaseExceptionError extends BaseExceptionError {
  constructor(t = "Error placing sweep") {
    super(t)
    this.name = "SweepPlacement"
  }
}

class PuckNumberer {
  scene: Scene
  sweepViewData: SweepsViewData
  cameraData: CameraData
  numberOffset: Vector3
  options: { color: string; background: boolean; scaleMin: number; scaleMax: number; opacityBase: number }
  puckDecorationMap: {}
  enabled: boolean
  labelCreator: TextRenderer
  constructor(t, e, i, s) {
    this.scene = t
    this.sweepViewData = e
    this.cameraData = i
    this.numberOffset = new Vector3(0, 0.05, 0)
    this.options = { color: "white", background: !1, scaleMin: 0.135, scaleMax: 0.2, opacityBase: 0.5 }
    this.puckDecorationMap = {}
    this.enabled = !1
    const { color, background, scaleMax } = this.options
    this.labelCreator = new TextRenderer({
      assetBasePath: s.getProperty("assetBasePath") || "",
      color,
      background,
      scale: scaleMax
    })
  }
  init() {
    this.sweepViewData.iterate(t => {
      t.alignmentType === AlignmentType.ALIGNED && (this.puckDecorationMap[t.id] = this.createPuckDecoration(t))
    })
  }
  dispose() {}
  activate() {
    this.enabled && this.addPuckNumbers()
  }
  deactivate() {
    this.enabled && this.removePuckNumbers()
  }
  toggleEnabled(t) {
    this.enabled !== t && ((this.enabled = t), t ? this.addPuckNumbers() : this.removePuckNumbers())
  }
  addPuckNumbers() {
    for (const t in this.puckDecorationMap) {
      const e = this.puckDecorationMap[t]
      this.scene.add(e.container)
    }
  }
  removePuckNumbers() {
    for (const t in this.puckDecorationMap) {
      const e = this.puckDecorationMap[t]
      this.scene.remove(e.container), e.label.dispose()
    }
  }
  createPuckDecoration(t: SweepObject) {
    const text = (t.index + 1).toString(10)
    const i = Math.max(text.length, 1)
    const scale = lerp(i, 1, 3, this.options.scaleMax, this.options.scaleMin)
    const label = this.labelCreator.createLabel({ text, scale })
    label.renderOrder = PickingPriorityType.panoMarker
    label.rotateX(-Math.PI / 2)
    const container = new Object3D()
    container.add(label)
    container.rotation.reorder("YXZ")
    container.position.copy(t.floorPosition).add(this.numberOffset)
    container.rotation.setFromQuaternion(this.cameraData.pose.rotation)
    container.rotation.x = 0
    container.visible = !0
    return { container, label }
  }
  render() {
    const e = this.cameraData.pose.rotation
    for (const i in this.puckDecorationMap) {
      const s = this.puckDecorationMap[i]
      const n = this.sweepViewData.getState(i)
      const a = !!n?.visible
      s.container.visible !== a && (s.container.visible = a)
      if (a) {
        const t = n.animation.endValue
        s.label.opacity = Math.max(this.options.opacityBase, t)
        s.container.rotation.setFromQuaternion(e)
        s.container.rotation.x = 0
      }
    }
  }
}
let PuckImageryConfig
const C = () => (
  PuckImageryConfig ||
    (PuckImageryConfig = {
      enabled: LoadTexture(sweepBg),
      disabled: LoadTexture(sweepDisableBg),
      enabledHover: LoadTexture(sweepBg),
      disabledHover: LoadTexture(sweepDisableBg)
    }),
  PuckImageryConfig
)
export default class SweepEditorModule extends Module {
  engine: EngineContext
  sweepData: SweepsData
  sweepPucks: SweepPucksModule
  sweepViewData: SweepsViewData
  puckNumberer: PuckNumberer
  constructor() {
    super(...arguments)
    this.name = "sweep-editor"
  }
  async init(t, e: EngineContext) {
    this.engine = e
    this.sweepData = await this.engine.market.waitForData(SweepsData)
    this.sweepPucks = await this.engine.getModuleBySymbol(PucksSymbol)
    const [i, s, a] = await Promise.all([e.getModuleBySymbol(WebglRendererSymbol), e.market.waitForData(CameraData), e.market.waitForData(SettingsData)])
    const o = i.getScene()
    const d = await e.market.waitForData(SweepsViewData)
    this.sweepViewData = d
    this.sweepPucks.updatePuckImagery(C())
    this.sweepPucks.updateCheckRenderModes(() => !0)
    this.sweepViewData.updateSweepVisibilityRule(() => !0)
    this.puckNumberer = new PuckNumberer(o.scene, d, s, a)
    this.bindings.push(this.engine.commandBinder.addBinding(PlaceSweepCommand, async t => this.repositionSweep(t.sweepId, t.pos, t.floorId)))
    this.bindings.push(this.engine.commandBinder.addBinding(UnplaceSweepCommand, async t => this.removeSweep(t.sweepId)))
    this.bindings.push(this.engine.commandBinder.addBinding(RenameSweepCommand, async t => this.renameSweep(t.sweepId, t.name)))
    this.bindings.push(this.engine.commandBinder.addBinding(ToggleSweepCommand, async t => this.toggleSweepVisible(t.enabled, ...t.sweepIds)))
    this.bindings.push(this.engine.commandBinder.addBinding(ToggleSweepNumbersCommand, async t => this.togglePuckNumbers(t.enabled)))
    e.addComponent(this, this.puckNumberer)
  }
  dispose(t) {
    super.dispose(t)
    this.sweepPucks.updatePuckImagery()
    this.sweepPucks.updateCheckRenderModes()
    this.sweepViewData.updateSweepVisibilityRule()
  }
  getSweep(t) {
    const e = this.sweepData.getSweep(t)
    if (!e) throw Error(`${t} isn't a valid sweep id`)
    return e
  }
  repositionSweep(t, e, i) {
    const s = this.getSweep(t)
    if (s.alignmentType === AlignmentType.ALIGNED) throw new SweepplacementBaseExceptionError(`Cannot reposition aligned sweep ${s.index}`)
    const n = new Vector3(s.position.x, s.position.y, s.position.z)
    if (e.equals(n) && s.placementType === PlacementType.MANUAL && i === s.floorId) return
    const r = s.placementType
    s.position.copy(e)
    s.placementType === PlacementType.UNPLACED && (s.placementType = PlacementType.MANUAL)
    s.floorId = i
    s.commit()
    r === PlacementType.UNPLACED
      ? (this.engine.broadcast(new UnalignedPlacedMessage(t, e)), this.engine.commandBinder.issueCommand(new HighlightPinCommand(s.id, !0)))
      : this.engine.broadcast(new UnalignedMovedMessage(s.id, e, n))
  }
  removeSweep(t) {
    const e = this.getSweep(t)
    if (!e) throw new Error(`Cannot unplace sweep "${t}" that doesn't exist`)
    if (e.alignmentType !== AlignmentType.UNALIGNED || e.placementType !== PlacementType.MANUAL)
      throw Error(`Cannot unplace a sweep of alignment type: ${e.alignmentType}`)
    e.placementType = PlacementType.UNPLACED
    e.position.set(0, 0, 0)
    e.roomId = null
    e.floorId = null
    e.commit()
    this.engine.commandBinder.issueCommand(new EndPinConnectionCommand())
    this.engine.broadcast(new UnalignedUnplacedMessage(t))
    this.sweepViewData.toolState === l._.ROTATING && this.engine.commandBinder.issueCommand(new EndRotateSweepCommand(t))
  }
  renameSweep(t, e) {
    const i = this.getSweep(t)
    i.name = e
    i.commit()
  }
  toggleSweepVisible(t, ...e) {
    const i = e.length > 1
    const s = this.sweepData.getSweepList().filter(t => t.alignmentType === AlignmentType.ALIGNED)
    const n = s.filter(t => !t.enabled).length
    for (const a of e) {
      const e = this.getSweep(a)
      e.enabled = t
      e.commit()
      this.engine.broadcast(new ScanVisibilityModifiedMessage(a, s.length, n, t, i))
    }
    i && e.length > 0 && this.engine.broadcast(new ScanVisibilityModifiedMessage(e[0], s.length, n, t, !1))
  }
  togglePuckNumbers(t) {
    this.puckNumberer.toggleEnabled(t)
  }
  activate(activate: boolean) {
    activate && this.sweepViewData.selectCurrentSweep()
    //激活就所有的显示,不激活就跟着enable走
    if (!activate) {
      this.sweepViewData.updateSweepVisibilityRule(t => t.enabled)
    } else {
      this.sweepViewData.updateSweepVisibilityRule(t => !0)
    }

    this.engine.commandBinder.issueCommandWhenBound(new ToggleNonPanoCurrentPuckCommand(activate))
    this.engine.commandBinder.issueCommandWhenBound(new TogglePanoMarkerCommand(!activate))
    this.engine.commandBinder.issueCommandWhenBound(new ToggleSweepNumbersCommand(activate))
    this.engine.commandBinder.issueCommandWhenBound(new TogglePuckEditingCommand(activate))
  }
}
