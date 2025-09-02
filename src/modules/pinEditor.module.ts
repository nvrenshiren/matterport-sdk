import { Vector3 } from "three"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { MovetoFloorCommand } from "../command/floors.command"
import { HighlightPinCommand, ModuleTogglePinEditingCommand } from "../command/pin.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { EndPinConnectionCommand, InitPinConnectionCommand, MovePinConnectionCommand, PlaceSweepCommand } from "../command/sweep.command"
import * as A from "../const/71161"
import { CursorStyle } from "../const/cursor.const"
import { MouseKeyIndex } from "../const/mouse.const"
import { InputSymbol, SweepPinMeshSymbol, WorkShopSweepPinEditSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Message } from "../core/message"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStopEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { OnMouseDownEvent } from "../events/mouse.event"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { Comparator } from "../utils/comparator"
import { MatrixBase } from "../webgl/matrix.base"
import { PinMesh } from "../webgl/pin.mesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import InputIniModule, { FilteredHandler } from "./inputIni.module"
import SweepPinMeshModule from "./sweepPinMesh.module"
declare global {
  interface SymbolModule {
    [WorkShopSweepPinEditSymbol]: PinEditorModule
  }
}
class x extends Message {
  sweep: number
  constructor(e) {
    super(), (this.sweep = e)
  }
}
class k extends Message {
  sweep: number
  constructor(e) {
    super(), (this.sweep = e)
  }
}
export default class PinEditorModule extends Module {
  previouslyActiveFloorId: string
  dragging: boolean
  unselectingSweep: null | number
  draggingSubs: FilteredHandler[]
  draggingHandled: boolean
  activated: boolean
  registered: boolean
  togglePinEditing: (e: any) => Promise<void>
  onToolStateChanged: () => void
  sweepViewData: SweepsViewData
  engine: EngineContext
  onPinHover: (e: any, t: any) => void
  sweepPinMesh: SweepPinMeshModule
  onPinUnhover: () => void
  onUnselectPin: () => void
  onPointerButton: (e: any, t: any) => void
  floorsViewData: FloorsViewData
  onDragPin: (e: any, t: any) => boolean | undefined
  cameraData: CameraData
  invViewMatrix: MatrixBase
  projMatrix: MatrixBase
  projectedMouse: Vector3
  newSweepPosition: Vector3
  meshData: MeshData
  distFromBoundsCenter: Vector3
  clampedSweepPosition: Vector3
  onDragEnd: (e: any, t: any) => boolean | undefined
  newPinPosition: Vector3
  highlightPin: (e: any) => Promise<void>
  inputModule: InputIniModule
  sweepData: SweepsData
  constructor() {
    super(...arguments), (this.name = "pin-editor")
    this.previouslyActiveFloorId = ""
    this.dragging = !1
    this.unselectingSweep = null
    this.draggingSubs = []
    this.draggingHandled = !0
    this.activated = !1
    this.registered = !1
    this.togglePinEditing = async e => {
      e.enabled ? this.activate() : this.deactivate()
    }
    this.onToolStateChanged = () => {
      switch (this.sweepViewData.toolState) {
        case A._.CLOSED:
        case A._.IDLE:
        case A._.ROTATED:
          this.engine.broadcast(new ToggleViewingControlsMessage(!0)), this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand())
          break
        case A._.PRESSING:
        case A._.PLACING:
        case A._.MOVING:
        case A._.ROTATING:
          this.engine.broadcast(new ToggleViewingControlsMessage(!1)), this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand())
      }
    }
    this.onPinHover = (e, t) => {
      const n = this.sweepPinMesh.mapColliderToSweep(t)
      n &&
        (n.id === this.sweepViewData.selectedSweep
          ? this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRAB))
          : this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER)))
    }
    this.onPinUnhover = () => {
      this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(""))
    }
    this.onUnselectPin = () => {
      const e = this.getSelectedSweep()
      e && this.unselectPin(e)
    }
    this.onPointerButton = (e, t) => {
      if (this.floorsViewData.transition.progress.active) return
      const n = this.sweepPinMesh.mapColliderToSweep(t),
        i = this.sweepViewData.selectedSweep
      if (n)
        if (e.down) {
          if (e.button !== MouseKeyIndex.PRIMARY) return
          n.id === i
            ? (this.unselectingSweep = n.id)
            : (this.selectPin(n, t), this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRAB))),
            this.engine.commandBinder.issueCommand(new InitPinConnectionCommand(t)),
            (this.draggingHandled = this.toggleHandlers(!0, this.draggingSubs, this.draggingHandled))
        } else
          n.id === this.unselectingSweep && (this.sweepPinMesh.highlightPinMesh(n.id, !1), this.unselectPin(n)),
            (this.unselectingSweep = null),
            this.engine.commandBinder.issueCommand(new EndPinConnectionCommand())
    }
    this.onDragPin = (e, t) => {
      const n = this.sweepPinMesh.mapColliderToSweep(t)
      if (!n || this.sweepViewData.selectedSweep !== n.id) return !1
      this.unselectingSweep = null
      const i = this.sweepPinMesh.mapSweepToMesh(n.id)
      this.floorsViewData.currentFloorId !== n.floorId &&
        this.floorsViewData.transition.promise.then(() => {
          const e = this.getSelectedSweep()
          e && this.engine.commandBinder.issueCommand(new MovetoFloorCommand(e.floorId, !1))
        }),
        this.dragging ||
          (this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRABBING)),
          this.engine.broadcast(new x(n)),
          this.sweepViewData.setToolState(A._.MOVING),
          (this.dragging = !0)),
        this.engine.commandBinder.issueCommand(new MovePinConnectionCommand(t))
      const s = this.cameraData.pose
      if (
        (this.invViewMatrix.makeRotationFromQuaternion(s.rotation),
        this.invViewMatrix.setPosition(s.position),
        this.projMatrix.multiplyMatrices(this.invViewMatrix, this.projMatrix.getInverse(s.projection)),
        this.projectedMouse.set(e.position.x, e.position.y, 1),
        this.projectedMouse.applyMatrix4(this.projMatrix.asThreeMatrix4()),
        this.cameraData.isOrtho())
      )
        this.newSweepPosition.copy(this.projectedMouse).setY(i.position.y)
      else {
        this.newSweepPosition.copy(this.projectedMouse).sub(s.position).normalize()
        const e = i.position.y - s.position.y
        if (0 === e) return
        this.newSweepPosition.multiplyScalar(e / this.newSweepPosition.y), this.newSweepPosition.add(s.position)
      }
      const r = this.meshData.meshCenter,
        a = this.meshData.maxPlacementRadius
      return (
        this.distFromBoundsCenter.copy(this.newSweepPosition).sub(r).setY(0).clampLength(0, a),
        this.clampedSweepPosition.copy(r).setY(this.newSweepPosition.y),
        this.projectedMouse.y <= r.y ? this.clampedSweepPosition.add(this.distFromBoundsCenter) : this.clampedSweepPosition.sub(this.distFromBoundsCenter),
        this.sweepPinMesh.updatePosition(n.id, this.clampedSweepPosition),
        !0
      )
    }
    this.onDragEnd = (e, t) => {
      this.draggingHandled = this.toggleHandlers(!1, this.draggingSubs, this.draggingHandled)
      const n = this.sweepPinMesh.mapColliderToSweep(t)
      if (n) {
        if (this.dragging) {
          this.floorsViewData.transition.promise.then(() => {
            this.engine.commandBinder.issueCommand(new MovetoFloorCommand(this.previouslyActiveFloorId, !1))
          })
          const e = this.sweepPinMesh.mapSweepToMesh(n.id)
          return (
            this.newPinPosition.copy(e.position).setY(n.position.y),
            this.engine.commandBinder.issueCommand(new PlaceSweepCommand(n.id, this.newPinPosition, n.floorId)),
            this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRAB)),
            this.sweepViewData.setToolState(A._.IDLE),
            this.sweepViewData.selectCurrentSweep(),
            (this.dragging = !1),
            this.engine.broadcast(new k(n)),
            !0
          )
        }
        return !1
      }
    }
    this.highlightPin = async e => {
      this.sweepPinMesh.highlightPinMesh(e.sweepId, e.highlight)
    }
  }
  async init(_e, t: EngineContext) {
    const [n, i, s, a, o, l, c] = await Promise.all([
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(SweepPinMeshSymbol),
      t.market.waitForData(SweepsViewData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(CameraData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(MeshData)
    ])
    this.inputModule = n
    this.engine = t
    this.sweepPinMesh = i
    this.sweepData = a
    this.cameraData = o
    this.sweepViewData = s
    this.floorsViewData = l
    this.meshData = c
    this.engine.commandBinder.addBinding(ModuleTogglePinEditingCommand, this.togglePinEditing)
  }
  dispose(e) {
    this.activated && this.deactivate()
    this.engine.commandBinder.removeBinding(ModuleTogglePinEditingCommand, this.togglePinEditing)
    this.registered = !1
    this.bindings = []
    super.dispose(e)
  }
  activate() {
    if (!this.activated) {
      if (this.registered) {
        this.bindings.forEach(e => {
          e.renew()
        })
      } else {
        this.registerHandlers()
        this.registered = !0
      }
      this.activated = !0
    }
  }
  deactivate() {
    if (this.activated) {
      if (this.registered) {
        this.bindings.forEach(e => {
          e.cancel()
        })
        this.draggingHandled = this.toggleHandlers(!1, this.draggingSubs, this.draggingHandled)
        this.activated = false
      }
    }
  }
  registerHandlers() {
    this.newSweepPosition = new Vector3()
    this.newPinPosition = new Vector3()
    this.clampedSweepPosition = new Vector3()
    this.projectedMouse = new Vector3()
    this.distFromBoundsCenter = new Vector3()
    this.invViewMatrix = new MatrixBase()
    this.projMatrix = new MatrixBase()
    this.bindings.push(
      this.sweepViewData.onToolStateChanged(this.onToolStateChanged),
      this.engine.commandBinder.addBinding(HighlightPinCommand, this.highlightPin),
      this.inputModule.registerPriorityHandler(InputClickerEndEvent, PinMesh, () => !0),
      this.inputModule.registerMeshHandler(OnMouseDownEvent, Comparator.isType(PinMesh), this.onPointerButton),
      this.inputModule.registerMeshHandler(HoverMeshEvent, Comparator.isType(PinMesh), this.onPinHover),
      this.inputModule.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PinMesh), this.onPinUnhover),
      this.inputModule.registerMeshHandler(OnMouseDownEvent, Comparator.isType(SkySphereMesh), this.onUnselectPin)
    )
    this.draggingSubs.push(
      this.inputModule.registerPriorityHandler(DraggerMoveEvent, PinMesh, this.onDragPin),
      this.inputModule.registerMeshHandler(DraggerStopEvent, Comparator.isType(PinMesh), this.onDragEnd)
    )
    this.draggingHandled = this.toggleHandlers(!1, this.draggingSubs, this.draggingHandled)
  }
  toggleHandlers(e, t, n) {
    if (e !== n) for (const n of t) e ? n.renew() : n.cancel()
    return e
  }
  getSweep(e) {
    const t = this.sweepData.getSweep(e)
    if (!t) throw Error(`${e} isn't a valid sweep id`)
    return t
  }
  getSelectedSweep() {
    const e = this.sweepViewData.selectedSweep
    return e ? this.getSweep(e) : null
  }
  selectPin(e, _t) {
    this.sweepViewData.setSelectedSweep(e.id)
    this.sweepPinMesh.selectPinMesh(e, !0)
    this.previouslyActiveFloorId = this.floorsViewData.currentFloorId
  }
  unselectPin(e) {
    this.unselectingSweep = null
    this.sweepViewData.setSelectedSweep(null)
    this.sweepPinMesh.selectPinMesh(e, !1)
  }
}
