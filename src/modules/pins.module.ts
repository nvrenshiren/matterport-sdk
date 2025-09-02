import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Line,
  LinearFilter,
  LinearMipMapLinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Texture,
  Vector3
} from "three"
import { DisableCursorMeshCommand, SetMouseCursorCommand } from "../command/cursor.command"
import { LockNavigationCommand, UnlockNavigationCommand } from "../command/navigation.command"
import {
  ChangePinOpacityCommand,
  ChangePinOpacityScaleCommand,
  ChangePinTypeOpacityCommand,
  ChangePinTypeVisibilityCommand,
  ChangePinVisibilityCommand,
  CreatePinCommand,
  EnablePinCreationCommand,
  MovePinCommand,
  PinClickElsewhereCommand,
  PinCreationCancelCommand,
  PinSelectionClearCommand,
  PlacePinCommand,
  RemovePinCommand,
  RemovePinTypeCommand,
  SelectPinCommand,
  TogglePinEditingCommand,
  UnselectPinCommand,
  UpdatePinCommand,
  UpdatePinViewsCommand
} from "../command/pin.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { DisableSweepSelectionCommand, EnableSweepSelectionCommand } from "../command/sweep.command"
import { PickingPriorityType } from "../const/12529"
import { IconType, PinColorVariant, PinEditorState, PinType } from "../const/62612"
import { PinConfig, PinDefaultSize } from "../const/84958"
import { CursorStyle } from "../const/cursor.const"
import { IconCodeMap } from "../const/iconMap.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import { InputSymbol, MeshQuerySymbol, PinsSymbol, RaycastFatSymbol, RaycasterSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { RenderLayer } from "../core/layers"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { AppData } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { FloorsData } from "../data/floors.data"
import { FloorsViewData } from "../data/floors.view.data"
import { InteractionData } from "../data/interaction.data"
import { LayersData } from "../data/layers.data"
import { PinsViewData } from "../data/pins.view.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { LongPressEndEvent, LongPressStartEvent } from "../events/longPress.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import G from "../images/pinAnchor.png"
import { getPointerScreenPosition, getScreenAndNDCPosition } from "../math/59370"
import { calculateCameraCollisionResponse } from "../math/81729"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import {
  NewPinReadyMessage,
  PinAddCancelledMessage,
  PinClickedMessage,
  PinHoverChangeMessage,
  PinMovedMessage,
  PinPlacedMessage,
  PinPlacementCancelledMessage
} from "../message/pin.message"
import { SweepDataMessage } from "../message/sweep.message"
import { ViewModeChangeMessage } from "../message/viewmode.message"
import { ObserverManager } from "../observable/observer.manager"
import { getIconKey, isCommentLargeIcon } from "../other/39689"
import * as D from "../other/53058"
import { PinHeadMesh } from "../pinHeadMesh"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { Animating } from "../utils/animating.utils"
import { winCanTouch } from "../utils/browser.utils"
import { Comparator } from "../utils/comparator"
import { createEaseFunction } from "../utils/ease.utils"
import { LoadTexture } from "../utils/loadTexture"
import { ViewModes } from "../utils/viewMode.utils"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import { InstancedPinHeadCustomMaterial, PinSelectedMaterial, PinStemMaterial } from "../webgl/55763"
import { AnimationProgress } from "../webgl/animation.progress"
import { RoomMesh } from "../webgl/roomMesh"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { TextBaseMap } from "../webgl/TextBaseMap"
import FatCasterModule from "./fatCaster.module"
import InputIniModule from "./inputIni.module"
import MeshQueryModule from "./meshQuery.module"
import RaycasterModule from "./raycaster.module"
import TagsModule from "./tags.module"
import { TagsSymbol } from "../const/symbol.const"
import { deepCopy } from "../utils/commo.utils"

const TEXTSPRITESCALE = 8
const ICON = "https://obs.3dyunzhan.com/pictures/202204241618499612613.png"

declare global {
  interface SymbolModule {
    [PinsSymbol]: PinsModule
  }
}

class PinAnchorMesh extends Mesh<PlaneGeometry, MeshBasicMaterial> {
  worldPosition: Vector3
  static anchorTexture: any
  constructor(e) {
    super(
      new PlaneGeometry(PinConfig.anchor.size, PinConfig.anchor.size),
      new MeshBasicMaterial({ depthTest: !1, depthWrite: !1, transparent: !0, map: PinAnchorMesh.getTexture(), side: DoubleSide })
    )
    this.visible = !1
    this.layers.mask = e.mask
    this.renderOrder = PickingPriorityType.pins
    this.worldPosition = new Vector3()
  }
  update(e, t, i) {
    const n = PinConfig.pinHeadMesh.scale
    this.getWorldPosition(this.worldPosition)
    const s = calculateCameraCollisionResponse(this.worldPosition, e, t, i, n)
    this.scale.set(s, s, s)
  }
  static getTexture() {
    return PinAnchorMesh.anchorTexture || (PinAnchorMesh.anchorTexture = LoadTexture(G)), PinAnchorMesh.anchorTexture
  }
}
class PinEditor {
  viewData: PinsViewData
  engine: EngineContext
  input: InputIniModule
  pinRenderer: PinMeshRenderer
  editEnabled: boolean
  handlersRegistered: boolean
  bindings: ISubscription[]
  externalBehaviorsBlocked: boolean
  touchDevice: boolean
  longPressCreateThreshold: number
  ndcPoint: Vector3
  movingPin: boolean
  anchored: boolean
  inAnchorClick: boolean
  startingPinData: undefined
  log: DebugInfo
  stopEventPropagation: () => boolean
  updateMeshPreviewSphere: (e: boolean, t?: Vector3) => Promise<void>
  startPinCreation: () => void
  addingHandlers: any
  endPinCreation: () => void
  draggingHandlers: any
  onSelectedPinChanged: () => void
  selectedHandlers: any
  onPinStateUpdated: () => void
  editableSelectedHandlers: any
  longPressStart: number
  longPressTimeout: number
  placePin: () => void
  onDragEvent: (e: any) => void
  onDragEnd: (e: any) => void
  dragInterceptor: any
  fatcaster: FatCasterModule
  viewmodeData: ViewmodeData
  floorsViewData: FloorsViewData
  onPointerButton: (e: any) => void
  onAnchorDragBegin: (e: any) => void
  onClickElsewhere: (e: any) => true | undefined
  onLongPressStart: (e: any) => Promise<void>
  onLongPressEnd: () => void
  onPointerEvent: (e: any) => void
  onClickToPlacePin: () => void
  onKeyEvent: (e: any) => void
  cameraData: CameraData
  creationHandlers: any
  floorsData: FloorsData
  meshQuery: MeshQueryModule
  clearLongPressTimeout: any
  allowExternalBehaviors: any
  updateAnchorMesh: any
  doneMovingPin: any
  positionPin: (t: any) => Promise<boolean>
  getModelIntersection: () => any
  hoverPinHeadId:string
  pointDown:boolean
  constructor(e, t: EngineContext, i, s) {
    this.viewData = e
    this.engine = t
    this.input = i
    this.pinRenderer = s
    this.editEnabled = !1
    this.handlersRegistered = !1
    this.bindings = []
    this.externalBehaviorsBlocked = !1
    this.touchDevice = winCanTouch()
    this.longPressCreateThreshold = 500
    this.ndcPoint = new Vector3()
    this.movingPin = !1
    this.anchored = !1
    this.inAnchorClick = !1
    this.startingPinData = void 0
    this.log = new DebugInfo("pin-editor")
    // this.viewData.selectedPinId()
    this.pointDown = false
    t.subscribe(PinHoverChangeMessage, e => {
      const id = e.id
      const hovering = e.hovering
      if(hovering){
        this.hoverPinHeadId = id
      }else{
        this.hoverPinHeadId = ""
      }
    })
    this.stopEventPropagation = () => {
      const tagsModule = this.engine?.getModuleBySymbolSync(TagsSymbol)
      const tag = tagsModule?.getSelectedTag()
      if(tag){
        //只有选择了某一个才能拖动
        if(this.hoverPinHeadId){
          this.pointDown = !this.pointDown
          if(this.pointDown){
            if(this.dragInterceptor)this.dragInterceptor.renew()
            if(this.viewData){
              this.viewData.setSelectedPinId(this.hoverPinHeadId)
              this.viewData.setPinEditorState(PinEditorState.PLACING)
            }
          }else{
            if(this.dragInterceptor)this.dragInterceptor.cancel()
            this.viewData.setPinEditorState(PinEditorState.IDLE)
          }
        }
      }
      return !0
    }
    this.updateMeshPreviewSphere = async (e, t) => {
      //pw
      // this.engine.commandBinder.issueCommand(new MeshPreviewPositionCommand(e, t))
    }
    this.startPinCreation = () => {
      this.editEnabled &&
        (this.addingHandlers.renew(),
        this.touchDevice || this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.XHAIR)),
        this.engine.commandBinder.issueCommand(new DisableSweepSelectionCommand()))
    }
    this.endPinCreation = () => {
      this.editEnabled &&
        (this.draggingHandlers.cancel(),
        this.addingHandlers.cancel(),
        this.clearLongPressTimeout(),
        this.allowExternalBehaviors(!0),
        this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)),
        this.engine.commandBinder.issueCommand(new EnableSweepSelectionCommand()))
    }
    this.onSelectedPinChanged = () => {
      const { selectedPinId: e } = this.viewData
      e ? this.selectedHandlers.renew() : this.selectedHandlers.cancel(), this.updateAnchorMesh()
    }
    this.onPinStateUpdated = () => {
      const e = this.viewData.pinEditorState
      switch ((this.updateAnchorMesh(), e)) {
        case PinEditorState.PLACING:
          this.draggingHandlers.renew()
          break
        case PinEditorState.IDLE:
          this.allowExternalBehaviors(!0)
      }
    }
    this.updateAnchorMesh = () => {
      if (!this.editEnabled) return
      const { pinEditorState: e, isPinEditable: t, selectedPinId: i } = this.viewData,
        n = i ? this.viewData.getPin(i) : null
      n && e !== PinEditorState.CREATING
        ? ([PinEditorState.PLACING, PinEditorState.PLACED].includes(e) || t
            ? (this.pinRenderer.showAnchorMesh(n.pinType, n.id, n), (this.anchored = !0))
            : this.removePinAnchorMesh(),
          this.editableSelectedHandlers.renew())
        : (this.editableSelectedHandlers.cancel(), this.anchored && this.removePinAnchorMesh(), this.updateMeshPreviewSphere(!1))
    }
    this.clearLongPressTimeout = () => {
      ;(this.longPressStart = 0), -1 !== this.longPressTimeout && window.clearTimeout(this.longPressTimeout), (this.longPressTimeout = -1)
    }
    this.placePin = () => {
      this.viewData.pinEditorState === PinEditorState.PLACING &&
        (this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)),
        this.engine.commandBinder.issueCommand(new PlacePinCommand()),
        this.engine.broadcast(new NewPinReadyMessage()),
        this.updateMeshPreviewSphere(!1))
    }
    this.onDragEvent = e => {
      ;(e.buttons !== MouseKeyCode.PRIMARY && (this.touchDevice || this.viewData.selectedPinId)) || this.positionPin(e)
    }
    this.onDragEnd = e => {
      const { creatingNewPin: t, pinEditorState: i, selectedPinId: n } = this.viewData,
        s = n ? this.viewData.getPin(n) : null
      ;(t && !this.touchDevice && i === PinEditorState.PLACING) ||
        (s &&
          !t &&
          (this.engine.commandBinder.issueCommand(new MovePinCommand(s.id, this.copyPinData(s), this.startingPinData)), this.updateMeshPreviewSphere(!1)),
        this.doneMovingPin(),
        (this.inAnchorClick = !1))
    }
    this.positionPin = (() => {
      const e = new Vector3()
      return async t => {
        if (this.touchDevice && t.buttons !== MouseKeyCode.PRIMARY) return !1
        const i = this.viewData
        const { pinEditorState: n, selectedPinId: s } = i
        if (n === PinEditorState.CREATING) {
          this.engine.commandBinder.issueCommand(new DisableCursorMeshCommand(!0))
        } else if (n !== PinEditorState.PLACING && !this.movingPin) return !1
        const a = s ? i.getPin(s) : null
        if (!a) return !1
        this.saveScreenPosition(t.position.x, t.position.y)
        const o = this.getModelIntersection()
        if (o && o.face) {
          this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.XHAIR))
          i.setCanPlace(!0)
          const t = ((e, t, i) => {
            return t.floorIdFromObject(i.object) || e.getClosestFloorAtHeight(i.point.y).id
          })(this.floorsData, this.meshQuery, o)
          if (null === t) return !1
          const s = this.meshQuery.mdsRoomIdFromObject(o.object)
          e.copy(a.stemNormal).setLength(a.stemLength)
          this.updateMeshPreviewSphere(!0, a.anchorPosition)
          const r = { anchorPosition: a.anchorPosition.copy(o.point), stemNormal: a.stemNormal.copy(o.face.normal).normalize(), floorId: t, roomId: s }
          this.engine.commandBinder.issueCommand(new UpdatePinCommand(a.id, a.pinType, r))
          n === PinEditorState.CREATING && i.setPinEditorState(PinEditorState.PLACING)
          return !0
        }
        this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.NOPE))
        i.setCanPlace(!1)
        return !1
      }
    })()
    this.allowExternalBehaviors = async e => {
      e || this.externalBehaviorsBlocked
        ? e &&
          this.externalBehaviorsBlocked &&
          (this.dragInterceptor.cancel(),
          this.engine.commandBinder.issueCommand(new UnlockNavigationCommand()),
          this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand()),
          (this.externalBehaviorsBlocked = !1))
        : (this.dragInterceptor.renew(),
          this.engine.commandBinder.issueCommand(new LockNavigationCommand()),
          this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand()),
          (this.externalBehaviorsBlocked = !0))
    }
    this.getModelIntersection = () => {
      const e = 0.5 * PinConfig.anchor.size
      return this.fatcaster.cast(
        e,
        e =>
          !!isVisibleShowcaseMesh(e) &&
          ((!this.viewmodeData.isDollhouse() && !this.viewmodeData.isFloorplan()) || this.floorsViewData.isCurrentMeshGroupOrAllFloors(e.meshGroup)),
        D.a.Filter.CENTER_GROUP(e)
      )
    }
    this.onPointerButton = e => {
      e.down ||
        this.viewData.pinEditorState !== PinEditorState.PLACED ||
        (this.allowExternalBehaviors(!0), this.engine.commandBinder.issueCommand(new DisableCursorMeshCommand(!1)))
    }
    this.onAnchorDragBegin = e => {
      const { isPinEditable: t, pinEditorState: i, selectedPinId: n } = this.viewData,
        s = n ? this.viewData.getPin(n) : null
      !s ||
        e.buttons !== MouseKeyCode.PRIMARY ||
        (i !== PinEditorState.PLACED && i !== PinEditorState.IDLE) ||
        (t
          ? ((this.movingPin = !0),
            (this.startingPinData = this.copyPinData(s)),
            this.allowExternalBehaviors(!1),
            this.draggingHandlers.renew(),
            this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRABBING)),
            this.engine.commandBinder.issueCommand(new DisableCursorMeshCommand(!0)),
            this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand()),
            (this.inAnchorClick = !0))
          : this.log.debug("onAnchorSelect called on a non-editable pin"))
    }
    this.doneMovingPin = () => {
      this.viewData.selectedPinId &&
        this.movingPin &&
        (this.draggingHandlers.cancel(),
        this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(null)),
        this.engine.commandBinder.issueCommand(new DisableCursorMeshCommand(!1)),
        this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand()),
        (this.movingPin = !1),
        (this.startingPinData = void 0),
        this.allowExternalBehaviors(!0),
        this.updateMeshPreviewSphere(!1))
    }
    this.onClickElsewhere = e => {
      const { selectedPinId: t, pinEditorState: i } = this.viewData
      if (!((i === PinEditorState.CREATING && t) || this.inAnchorClick))
        return t && (this.movingPin ? this.doneMovingPin() : this.engine.commandBinder.issueCommand(new PinClickElsewhereCommand())), !0
    }
    this.onLongPressStart = async e => {
      if (e.buttons !== MouseKeyCode.PRIMARY) return
      const t = this.viewData
      t.pinEditorState === PinEditorState.CREATING &&
        ((this.longPressStart = Date.now()),
        t.setPinEditorState(PinEditorState.PRESSING),
        this.allowExternalBehaviors(!1),
        this.saveScreenPosition(e.position.x, e.position.y),
        (this.longPressTimeout = window.setTimeout(async () => {
          t.setPinEditorState(PinEditorState.PLACING)
          ;(await this.positionPin(e)) || (t.setPinEditorState(PinEditorState.CREATING), t.setCanPlace(!1)), (this.longPressTimeout = -1)
        }, this.longPressCreateThreshold)))
    }
    this.onLongPressEnd = () => {
      const e = this.viewData.pinEditorState
      e === PinEditorState.PRESSING ? (this.log.debug("Did not press long enough"), this.endPinCreation()) : e === PinEditorState.PLACING && this.placePin()
    }
    this.onPointerEvent = e => {
      const t = this.viewData.pinEditorState
      ;(t !== PinEditorState.PLACING && t !== PinEditorState.CREATING) || this.positionPin(e)
    }
    this.onClickToPlacePin = () => {
      this.placePin()
    }
    this.onKeyEvent = e => {
      if (e.state === KeyboardStateList.PRESSED)
        switch (e.key) {
          case KeyboardCode.ESCAPE:
            this.viewData.creatingNewPin && this.engine.broadcast(new PinPlacementCancelledMessage())
        }
    }
    Promise.all([
      t.market.waitForData(CameraData),
      t.market.waitForData(FloorsData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(ViewmodeData),
      t.getModuleBySymbol(RaycastFatSymbol),
      t.getModuleBySymbol(MeshQuerySymbol)
    ]).then(([t, n, s, a, o, r]) => {
      this.cameraData = t
      this.floorsData = n
      this.floorsViewData = s
      this.viewmodeData = a
      this.fatcaster = o
      this.meshQuery = r
      this.bindings.push(i.registerPriorityHandler(OnMouseDownEvent, PinHeadMesh, this.stopEventPropagation), e.onSelectedPinChanged(this.onSelectedPinChanged))
      this.selectedHandlers = new AggregateSubscription(
        i.registerPriorityHandler(InputClickerEndEvent, ShowcaseMesh, this.onClickElsewhere),
        i.registerPriorityHandler(InputClickerEndEvent, SkySphereMesh, this.onClickElsewhere)
      )

      this.selectedHandlers.cancel()
    })
  }

  dispose() {
    var e, t, i, n, s
    this.removePinAnchorMesh(),
      this.updateMeshPreviewSphere(!1),
      null === (e = this.dragInterceptor) || void 0 === e || e.cancel(),
      null === (t = this.addingHandlers) || void 0 === t || t.cancel(),
      null === (i = this.draggingHandlers) || void 0 === i || i.cancel(),
      null === (n = this.selectedHandlers) || void 0 === n || n.cancel(),
      null === (s = this.editableSelectedHandlers) || void 0 === s || s.cancel(),
      this.bindings.forEach(e => {
        e.cancel()
      })
  }
  update() {
    if (!this.editEnabled) return
    const e = this.viewData
    if (this.touchDevice && e.pinEditorState === PinEditorState.PRESSING) {
      const t = Math.min(1, (Date.now() - this.longPressStart) / this.longPressCreateThreshold)
      e.setProgress(t)
    }
  }
  toggleEditing(e) {
    e !== this.editEnabled &&
      ((this.editEnabled = e),
      e
        ? (this.handlersRegistered ? this.creationHandlers.renew() : this.registerHandlers(), this.updateAnchorMesh())
        : ((this.inAnchorClick = !1),
          (this.anchored = !1),
          (this.movingPin = !1),
          this.creationHandlers.cancel(),
          this.allowExternalBehaviors(!0),
          this.removePinAnchorMesh(),
          this.updateMeshPreviewSphere(!1)),
      this.dragInterceptor.cancel(),
      this.draggingHandlers.cancel(),
      this.addingHandlers.cancel(),
      this.editableSelectedHandlers.cancel())
  }
  registerHandlers() {
    const e = this.input,
      t = this.viewData
    ;(this.creationHandlers = new AggregateSubscription(t.onPinEditorStateChanged(this.onPinStateUpdated))),
      (this.dragInterceptor = new AggregateSubscription(
        e.registerPriorityHandler(DraggerMoveEvent, ShowcaseMesh, () => !0),
        e.registerPriorityHandler(DraggerMoveEvent, SkySphereMesh, () => !0)
      )),
      (this.draggingHandlers = new AggregateSubscription(
        e.registerUnfilteredHandler(DraggerMoveEvent, this.onDragEvent),
        e.registerUnfilteredHandler(DraggerStopEvent, this.onDragEnd)
      )),
      (this.editableSelectedHandlers = new AggregateSubscription(
        e.registerMeshHandler(DraggerStartEvent, Comparator.isType(PinHeadMesh), this.onAnchorDragBegin)
      )),
      this.touchDevice
        ? (this.addingHandlers = new AggregateSubscription(
            e.registerHandler(OnMouseDownEvent, this.onPointerButton),
            e.registerUnfilteredHandler(LongPressStartEvent, this.onLongPressStart),
            e.registerUnfilteredHandler(LongPressEndEvent, this.onLongPressEnd)
          ))
        : (this.addingHandlers = new AggregateSubscription(
            e.registerHandler(KeyboardCallbackEvent, this.onKeyEvent),
            e.registerHandler(OnMouseDownEvent, this.onPointerButton),
            e.registerUnfilteredHandler(InputClickerEndEvent, this.onClickToPlacePin),
            e.registerHandler(OnMoveEvent, this.onPointerEvent)
          ))
  }
  removePinAnchorMesh() {
    this.pinRenderer.hideAnchorMesh(), (this.anchored = !1)
  }
  copyPinData(e) {
    return {
      anchorPosition: e.anchorPosition.clone(),
      stemNormal: e.stemNormal.clone(),
      floorId: e.floorId,
      roomId: e.roomId,
      stemLength: e.stemLength,
      stemEnabled: e.stemEnabled,
      color: e.color
    }
  }
  saveScreenPosition(e, t) {
    this.ndcPoint.set(e, t, 0)
    const i = getPointerScreenPosition(this.cameraData.width, this.cameraData.height, this.ndcPoint)
    this.viewData.setScreenPosition(i)
  }
}
class PinSelectedMesh extends Mesh {
  constructor(e) {
    super(new PlaneGeometry(PinConfig.selection.size, PinConfig.selection.size), new PinSelectedMaterial())
    this.visible = !1
    this.layers.mask = e.mask
    this.renderOrder = PickingPriorityType.pinSelectedHalo
  }
}
class IconAtlas {
  atlasMaxSize: any
  iconSize: any
  padding: number
  uvRects: Map<string, { minU: number; minV: number; maxU: number; maxV: number }>
  iconCount: number
  onResize: ObserverManager
  canvas: HTMLCanvasElement
  texture: CanvasTexture
  constructor(e, t, i = 1) {
    this.atlasMaxSize = e
    this.iconSize = t
    this.padding = i
    this.uvRects = new Map()
    this.iconCount = 0
    this.onResize = new ObserverManager()
    const s = (this.canvas = document.createElement("canvas"))
    s.width = e
    s.height = t
    this.texture = new CanvasTexture(s)
  }
  addIcon(e: string, t: { type: string; family: string; codePoint: number; offset?: { x: number; y: number }; image?: CanvasImageSource | OffscreenCanvas }) {
    const { atlasMaxSize, iconSize, padding, canvas, uvRects } = this
    const c = canvas.getContext("2d")!
    let l = !1
    let h = uvRects.get(e)
    if (!h) {
      const t = this.iconCount++
      const i = atlasMaxSize / iconSize
      const n = Math.floor(t / i)
      const o = t % i
      if ((n + 1) * iconSize > canvas.height) {
        const e = c.getImageData(0, 0, canvas.width, canvas.height)
        canvas.height *= 2
        c.putImageData(e, 0, canvas.height / 2)
        this.texture.dispose()
        uvRects.forEach(e => {
          e.minV /= 2
          e.maxV /= 2
        })
        l = !0
      }

      h = { minU: o / i, minV: n / (canvas.height / iconSize), maxU: (o + 1) / i, maxV: (n + 1) / (canvas.height / iconSize) }
      uvRects.set(e, h)
    }
    const u = h.minU * atlasMaxSize
    const m = (1 - h.maxV) * canvas.height
    c.clearRect(u, m, iconSize, iconSize)
    if ("font" === t.type) {
      c.font = `${iconSize - 2 * padding}px ${t.family}`
      c.textAlign = "center"
      c.textBaseline = "top"
      c.fillStyle = "#fff"
      c.fillText(String.fromCodePoint(t.codePoint), u + iconSize / 2 + (t.offset?.x || 0), m + padding + (t.offset?.y || 0))
    } else {
      c.drawImage(t.image!, u + padding, m + padding, iconSize - 2 * padding, iconSize - 2 * padding)
    }
    this.texture.needsUpdate = !0
    l && this.onResize.notify()
    return h
  }
}
class PinRenderer {
  input: InputIniModule
  camera: PerspectiveCamera
  canvasData: CanvasData
  layer: RenderLayer
  commandBinder: EngineContext["commandBinder"]
  raycaster: RaycasterModule
  iconsEnabled: boolean
  container: Object3D
  floorIdToContainer: Map<string, Object3D>
  hexColorToColor: Map<string, { baseColor: Color; hoverColor: Color; dimmedColor: Color }>
  bindings: ISubscription[]
  anchor: null | { pinType: PinType; id: string }
  selected: null | { pinType: PinType; id: string; hideWhenDoneAnimating: boolean; animation: Animating }
  haloEasing: (e: any, t: any, n: any, i: any) => any
  pinViews: Map<string, ReturnType<TagsModule["getPinUpdate"]>>
  pinsWithOverrideTexture: Set<unknown>
  refreshPins: () => void
  updateAnchorPosition: (n: ReturnType<TagsModule["getPinUpdate"]>) => void
  anchorMesh: PinAnchorMesh
  onAnchorHover: () => void
  onAnchorUnhover: () => void
  iconAtlas: IconAtlas
  selectedMesh: PinSelectedMesh

  constructor(e, t, i, s, a, o, r = !1) {
    this.input = e
    this.camera = t
    this.canvasData = i
    this.layer = s
    this.commandBinder = a
    this.raycaster = o
    this.iconsEnabled = r
    this.container = new Object3D()
    this.floorIdToContainer = new Map()
    this.hexColorToColor = new Map()
    this.bindings = []
    this.anchor = null
    this.selected = null
    this.haloEasing = createEaseFunction(0.5, 0.52, 0, 1.98)
    this.pinViews = new Map()
    this.pinsWithOverrideTexture = new Set()
    this.refreshPins = () => {
      this.pinViews.forEach((e, t) => {
        this.updatePin(t, e.pinType, e, e.backgroundTexture)
      })
    }
    this.updateAnchorPosition = (() => {
      const e = new Vector3()
      const t = new Vector3()
      const i = new Vector3()
      return n => {
        const s = this.anchorMesh
        if (!s) return
        const a = this.raycaster.picking
        e.copy(n.stemNormal).normalize()
        t.copy(e).multiplyScalar(0.2).add(n.anchorPosition)
        i.copy(e).multiplyScalar(-1)
        const o = a.pick(t, i, e => e instanceof RoomMesh)
        if (o) {
          const e = Math.min(0.2, o.distance)
          s.position.copy(t).add(i.multiplyScalar(0.999 * e))
        } else s.position.copy(t).add(i.multiplyScalar(0.999 * n.stemLength))
        s.lookAt(t)
      }
    })()
    this.onAnchorHover = () => {
      this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.GRAB)), this.commandBinder.issueCommand(new DisableCursorMeshCommand(!0))
    }
    this.onAnchorUnhover = () => {
      this.commandBinder.issueCommand(new SetMouseCursorCommand(null)), this.commandBinder.issueCommand(new DisableCursorMeshCommand(!1))
    }
    this.iconAtlas = new IconAtlas(4096, 128, 4)
    this.iconAtlas.onResize.observe({ notify: this.refreshPins })
  }
  init() {
    this.container.name = "PinContainer"
    this.container.layers.mask = this.layer.mask
    this.anchorMesh = new PinAnchorMesh(this.layer)
    this.anchorMesh.name = "Anchor Mesh"
    // this.container.add(this.anchorMesh)
    this.selectedMesh = new PinSelectedMesh(this.layer)
    this.selectedMesh.name = "Selected Mesh"
    this.container.add(this.selectedMesh)
    for (const e of Object.values(IconType)) {
      this.iconAtlas.addIcon(e, { type: "font", family: "iconfont", codePoint: +IconCodeMap[e], offset: isCommentLargeIcon(e) })
    }
  }
  dispose() {
    this.container.parent && this.container.parent.remove(this.container)
    for (const e of [this.anchorMesh, this.selectedMesh]) e && e.parent && e.parent.remove(e)
  }
  activate(e) {
    !!this.bindings.length ||
      this.bindings.push(
        this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(PinAnchorMesh), this.onAnchorHover),
        this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PinAnchorMesh), this.onAnchorUnhover)
      )
  }
  deactivate(e) {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
  render(e) {
    if (this.selected) {
      const { animation: e, hideWhenDoneAnimating: t } = this.selected,
        i = this.selectedMesh
      if (i && i.visible && e) {
        const s = this.pinHeadTransform(this.selected.id)
        const a = new Vector3()
        const o = new Quaternion()
        const r = new Vector3()
        s.decompose(a, o, r)
        r.multiplyScalar(e.getUpdatedValue())
        t && !e.isAnimating ? ((i.visible = !1), (this.selected = null)) : (i.position.copy(a), i.quaternion.copy(o), i.scale.copy(r))
      }
    }
    if (this.anchorMesh && this.anchorMesh.visible) {
      const e = this.getViewportScale(this.canvasData)
      this.anchorMesh.update(this.camera, e, this.canvasData)
    }
  }
  pinHeadTransform(e: string) {
    return new Matrix4()
  }
  updatePin(e: string, t: PinType, i: ReturnType<TagsModule["getPinUpdate"]>, n: Texture, s?: boolean) {
    this.anchorMesh && this.anchorMesh.visible && this.anchor && this.anchor.pinType === t && this.anchor.id === e && this.updateAnchorPosition(i)
    this.pinViews.set(e, Object.assign(Object.assign({}, i), { id: e, pinType: t, backgroundTexture: n }))
  }
  removePin(e: string) {
    this.selected && this.selected.id === e && this.clearSelected(), this.pinViews.delete(e)
  }
  removePinsByType(e) {
    this.removePinsByPredicate(t => t === e)
  }
  removePinsByPredicate(e) {}
  setPinVisible(e, t) {}
  setPinColorVariant(e, t) {}
  setPinColorVariants(e, t) {}
  setPinColorVariantByType(e, t, i) {}
  setPinOpacity(e, t) {}
  setPinOpacityByType(e, t, i) {}
  fadePinOpacity(e, t) {}
  fadePinOpacityByType(e, t, i = []) {}
  setPinRenderOverrides(e, t, i) {
    t ? (this.pinsWithOverrideTexture.add(e), this.selected && this.selected.id === e && this.clearSelected()) : this.pinsWithOverrideTexture.delete(e)
  }
  setFloorsHidden(e: (e?: any) => boolean) {
    this.floorIdToContainer.forEach((t, i) => {
      t.visible = !e(i)
    })
  }
  setPinTypeVisible(e, t) {
    this.floorIdToContainer.forEach(i => {
      i.userData.typeContainers[e].visible = t
    })
  }
  showAnchorMesh(e, t, i) {
    this.anchor = { pinType: e, id: t }
    this.anchorMesh && !this.anchorMesh.visible && ((this.anchorMesh.visible = !0), this.input.registerMesh(this.anchorMesh, !1)), this.updateAnchorPosition(i)
  }
  hideAnchorMesh() {
    this.anchorMesh && this.anchorMesh.visible && ((this.anchorMesh.visible = !1), this.input.unregisterMesh(this.anchorMesh))
  }
  showSelectedMesh(e, t) {
    const i = this.selected && this.selected.pinType === e && this.selected.id === t
    if (!this.selected || !i) {
      if (!this.pinsWithOverrideTexture.has(t)) {
        this.selected = {
          pinType: e,
          id: t,
          hideWhenDoneAnimating: !1,
          animation: new Animating({ startValue: 1, endValue: 1.4, duration: 300, easingFunction: this.haloEasing })
        }
        // this.selectedMesh.visible = !0
        this.selectedMesh.visible = false
      }
    }
  }
  hideSelectedMesh() {
    this.selected && ((this.selected.animation = new Animating({ startValue: 1.4, endValue: 1, duration: 300 })), (this.selected.hideWhenDoneAnimating = !0))
  }
  getFloorContainer(e: string) {
    let t = this.floorIdToContainer.get(e)
    if (t) return t
    t = new Object3D()
    t.name = "Floor " + e
    t.userData.typeContainers = {}
    t.layers.mask = this.layer.mask
    for (const e of Object.values(PinType)) {
      const i = new Object3D()
      i.name = e
      i.layers.mask = this.layer.mask
      t.add(i)
      t.userData.typeContainers[e] = i
    }
    this.container.add(t)
    this.floorIdToContainer.set(e, t)
    t.userData.floorId = e
    return t
  }
  getColor(e) {
    let t = this.hexColorToColor.get(e)
    if (t) return t
    const i = new Color(e)
    const s = { h: 0, s: 0, l: 0 }
    i.getHSL(s)
    return (
      (t = { baseColor: i, hoverColor: new Color().setHSL(s.h, s.s, 0.8 * s.l), dimmedColor: new Color().setHSL(s.h, 0.5 * s.s, s.l) }),
      this.hexColorToColor.set(e, t),
      t
    )
  }
  getViewportScale(e) {
    return Math.sqrt(Math.min(e.width, e.height) / PinConfig.pinHeadMesh.scale.baseViewportSize)
  }
  clearSelected() {
    this.selectedMesh.visible = !1
    this.selected = null
  }
}
class StemMesh extends Line {
  vector: any
  pinStemMaterial: PinStemMaterial
  constructor(e, t, i, s, a) {
    const o = new BufferGeometry()
    const r = new Float32Array(6)
    r[0] = r[1] = r[2] = 0
    r[3] = e.x
    r[4] = e.y
    r[5] = e.z
    o.setAttribute("position", new BufferAttribute(r, 3))
    const d = new PinStemMaterial()
    super(o, d)
    this.geometry = o
    this.layers.mask = i.mask
    this.visible = t
    this.vector = e.clone()
    this.onBeforeRender = (e, t, i, n, o) => {
      const r = o
      r.uniforms.pinHeadMatrix.value.copy(s.matrixWorld), r.uniforms.resolution.value.set(a.width, a.height), (r.uniformsNeedUpdate = !0)
    }
    this.pinStemMaterial = d
  }
  dispose() {
    this.geometry.dispose()
  }
  updatePosition(e) {
    this.vector.copy(e.stemNormal).setLength(Math.max(e.stemLength, 0.01))
    const t = this.geometry.getAttribute("position")
    t.setXYZ(1, this.vector.x, this.vector.y, this.vector.z)
    t.needsUpdate = !0
  }
  update(parent) {
    //是否显示隐藏
    this.visible = parent.stemEnabled
    this.updatePosition(parent)
  }
}

class PinHeadTextMesh extends Mesh {
  constructor(t, n) {
    super(t, n)
  }
  dispose() {
    this.material.dispose()
    this.geometry.dispose()
  }
}
class me extends Object3D {
  pinId: any
  pinType: any
  pinColor: any
  color: Color
  stemVector: Vector3
  stemEnabled: boolean
  currentColorVariant: string
  baseOpacity: number
  opacityScale: number
  pinHeadGeometryInst: PlaneGeometry
  static pinHeadGeometry: PlaneGeometry
  pinHeadMeshMaterial: MeshBasicMaterial
  pinHeadMesh: PinHeadMesh
  pinHeadTextMesh: Mesh
  stemMesh: StemMesh
  opacityAnimation: AnimationProgress
  geomBaseScale: Vector3
  textWidthScale: number
  textHeightScale: number

  //拓展字段
  // extdata: IExtdata
  iconSize: number
  iconUrl: string
  showTitle: string
  stemLength: number
  stemNormal: Vector3
  label: string

  //后期热点可能要改成其他的type
  assseType: string

  constructor(e, t, i, s, a, o, r, d, c, l) {
    super(), (this.pinId = e)
    this.pinType = t
    this.color = i.color
    this.label = i.label
    this.iconSize = i.iconSize
    this.stemVector = new Vector3()
    //后期如果不传1:1的图 要用上 并且文字 不能放在图标里面了
    this.geomBaseScale = new Vector3(1, 1, 1)
    this.stemEnabled = !0
    this.currentColorVariant = PinColorVariant.DEFAULT
    this.baseOpacity = 1
    this.opacityScale = 1
    this.pinHeadGeometryInst = new PlaneGeometry(PinDefaultSize, PinDefaultSize)
    this.pinHeadGeometryInst.setAttribute("instanceMaskRect", new BufferAttribute(a, 4))
    this.pinHeadGeometryInst.setAttribute("instanceStrokeWidth", new BufferAttribute(l, 1))
    me.pinHeadGeometry || (me.pinHeadGeometry = new PlaneGeometry(PinDefaultSize, PinDefaultSize))

    // const map = LoadTexture(i.iconUrl,()=>{
    //   const {width,height} = map.source.data
    //   this.geomBaseScale.set(1, height/width , 1)
    // })
    this.pinHeadMeshMaterial = new MeshBasicMaterial({
      color: new Color(this.color),
      map: LoadTexture(i.iconUrl || ICON),
      transparent: true
    })
    this.pinHeadMesh = new PinHeadMesh(e, this.pinHeadGeometryInst, this.pinHeadMeshMaterial, o)
    this.add(this.pinHeadMesh)
    this.stemMesh = new StemMesh(i.stemNormal, i.stemEnabled, o, this.pinHeadMesh, r)
    this.add(this.stemMesh)
    this.updateMeshPosition(i)
    this.opacityAnimation = new AnimationProgress(1)

    //加入顶部的文字面皮
    const textGeo = new PlaneGeometry(PinDefaultSize, PinDefaultSize)
    const textMat = new MeshBasicMaterial({ color: "#fff", transparent: true })
    this.pinHeadTextMesh = new PinHeadTextMesh(textGeo, textMat)
    this.pinHeadMesh.add(this.pinHeadTextMesh)
    this.pinHeadTextMesh.position.y = 1.2

    const texture = this.createTextTexture(this.label)
    textMat.map = texture
    this.pinHeadTextMesh.scale.set(this.textWidthScale * TEXTSPRITESCALE, this.textHeightScale * TEXTSPRITESCALE, 1)
    //更新
    ;(this.pinHeadTextMesh as any).update = () => {
      this.pinHeadTextMesh.visible = this.showTitle
    }
  }

  createTextTexture(text) {
    const w = new TextBaseMap(this.pinId, {
      text,
      autoWidth: true,
      // maxWidth: 1420,
      fontSize: 36,
      textAlign: "left",
      fillStyle: "#fff",
      canvasPaddingTB: 10,
      canvasPaddingLR: 20,
      lineSpacing: 1.3,
      needBg: true,
      bgColor: "rgba(0,0,0,0.6)"
    }).canvas

    // console.log(w,'获取到的canvas')

    //计算scale比列
    this.textWidthScale = w.width / 512
    this.textHeightScale = w.height / 512

    let texture: any = new Texture(w)
    texture.width = w.width
    texture.height = w.height
    texture.hasAlpha = true
    texture.magFilter = LinearFilter
    texture.minFilter = LinearMipMapLinearFilter
    texture.loaded = !0
    texture.needsUpdate = !0
    return texture
  }

  changeText(text) {
    this.label = text
    const texture = this.createTextTexture(text)
    if (this.pinHeadTextMesh.material.map) this.pinHeadTextMesh.material.map.dispose()
    this.pinHeadTextMesh.material.map = texture
    this.pinHeadTextMesh.scale.set(this.textWidthScale * TEXTSPRITESCALE, this.textHeightScale * TEXTSPRITESCALE, 1)
  }

  changeIcon(url) {
    this.iconUrl = url
    const texture = LoadTexture(url)
    if (this.pinHeadMesh.material.map) this.pinHeadMesh.material.map.dispose()
    this.pinHeadMesh.material.map = texture
  }

  dispose() {
    this.remove(this.pinHeadMesh)
    this.pinHeadMesh.material.dispose()
    this.pinHeadMesh.dispose()
    // this.pinHeadTextMesh.material.dispose()
    this.pinHeadTextMesh.dispose()
    this.remove(this.stemMesh)
    this.stemMesh.dispose()
  }
  static disposeAll() {
    me.pinHeadGeometry.dispose()
  }
  updateFromPin(e, t, i, s, a, o) {
    this.position.copy(e.anchorPosition)
    this.pinHeadMesh.updatePosition(e)
    this.stemVector.copy(e.stemNormal).setLength(e.stemLength)
    this.stemEnabled = e.stemEnabled
    this.stemMesh.updatePosition(e)
    this.stemMesh.visible = e.stemEnabled
    //拓展字段
    // this.extdata = JSON.parse(JSON.stringify(e.extdata))
    // this.iconSize = e.iconSize
    this.iconUrl = e.iconUrl
    this.showTitle = e.showTitle
    //已经有 但是没有挂载到mesh上

    this.stemLength = e.stemLength
    this.stemNormal = e.stemNormal

    //后期热点可能要改成其他的模块 此处加上
    this.assseType = e.assetType

    this.pinHeadGeometryInst.setAttribute("instanceMaskRect", new BufferAttribute(i, 4))
    this.pinHeadGeometryInst.setAttribute("instanceStrokeWidth", new BufferAttribute(o, 1))
    this.pinHeadMesh.geomScale.set(e.iconSize || 1, e.iconSize || 1, e.iconSize || 1)
    // t !== this.pinColor && ((this.pinColor = t), this.setColorVariant(this.currentColorVariant))
    // const r = this.pinHeadMeshMaterial.uniforms
    // ;(r.bg.value === s && r.mask.value === a) || ((r.bg.value = s), (r.mask.value = a), (this.pinHeadMeshMaterial.uniformsNeedUpdate = !0))
  }
  setColorVariant(e) {
    // const t = getIconColor(this.pinColor, e)
    // this.pinHeadMeshMaterial.uniforms.color.value.copy(t), (this.currentColorVariant = e)
  }
  setOpacity(e) {
    ;(this.baseOpacity = e), this.updateOpacity()
  }
  setOpacityScale(e) {
    ;(this.opacityScale = e), this.updateOpacity()
  }
  fadeOpacity(e) {
    e > 0 && (this.visible = !0),
      this.opacityAnimation.modifyAnimation(this.opacityAnimation.value, e, 300).onComplete(() => {
        e <= 0 && (this.visible = !1)
      })
  }
  setVisibility(e, t) {
    this.visible = e
    this.pinHeadMesh.visible = e
    this.stemMesh.visible = e && t
  }
  setStemEnabled(e) {
    this.stemMesh.visible = this.visible && e
  }
  updateMeshPosition(e) {
    this.position.copy(e.anchorPosition)
    this.pinHeadMesh.updatePosition(e)
    this.stemMesh.updatePosition(e)
  }
  update(e, t, i, n) {
    this.pinHeadMesh.update(t, i, n, this)
    this.stemMesh.update(this)
    ;(this.pinHeadTextMesh as any).update(this)
    const s = this.opacityAnimation.active
    this.opacityAnimation.tick(e), s && this.updateOpacity()
  }
  setRenderOverrides(e, t) {
    this.pinHeadMesh.material = e ? new InstancedPinHeadCustomMaterial(e, !1) : this.pinHeadMeshMaterial
    t ? this.pinHeadMesh.geomScale.copy(t) : this.pinHeadMesh.geomScale.set(1, 1, 1)
    this.setOpacity(this.pinHeadMeshMaterial.opacity)
  }
  updateOpacity() {
    const e = this.opacityAnimation.value * this.baseOpacity * this.opacityScale
    if (((this.pinHeadMeshMaterial.opacity = e), this.pinHeadMesh.material !== this.pinHeadMeshMaterial)) {
      this.pinHeadMesh.material.opacity = e
      // const t = this.pinHeadMesh.material
      // t && t.uniforms && t.uniforms.alpha && (t.uniforms.alpha.value = e)
    }
    this.stemMesh.pinStemMaterial.uniforms.alpha.value = e
  }
}
class PinMeshRenderer extends PinRenderer {
  idToMesh: Map<any, any>
  inputCallbacks: {
    onClick: Function
    onHover: Function
    onUnhover: Function
  }
  constructor(e, t, i, n, s, a, o, r = !1) {
    super(e, t, i, n, s, a, r), (this.idToMesh = new Map()), (this.inputCallbacks = o)
  }
  dispose() {
    super.dispose()
    this.removePinsByPredicate(() => !0)
    me.disposeAll()
  }
  activate(e) {
    this.bindings.length > 0 ||
      (super.activate(e),
      this.bindings.push(
        this.input.registerPriorityHandler(InputClickerEndEvent, PinHeadMesh, (e, t) => {
          const i = t.parent
          return this.inputCallbacks.onClick(i.pinId, i.pinType), !0
        })
      ),
      this.bindings.push(
        this.input.registerPriorityHandler(InputClickerEndEvent, PinHeadTextMesh, (e, t) => {
          const i = t.parent.parent
          return this.inputCallbacks.onClick(i.pinId, i.pinType), !0
        })
      ),
      winCanTouch() ||
        (this.bindings.push(
          this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(PinHeadMesh), (e, t) => {
            const i = t.parent
            this.inputCallbacks.onHover(i.pinId, i.pinType)
          })
        ),
        this.bindings.push(
          this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PinHeadMesh), (e, t) => {
            const i = t.parent
            this.inputCallbacks.onUnhover(i.pinId, i.pinType)
          })
        )))
  }
  render(e) {
    const t = this.getViewportScale(this.canvasData)
    this.idToMesh.forEach(i => {
      // const viewInfo = this.pinViews.get(i.pinId)
      i.update(e, this.camera, t, this.canvasData)
    }),
      super.render(e)
  }
  updatePin(e: string, t: PinType, i: ReturnType<TagsModule["getPinUpdate"]>, n: Texture, s?) {
    super.updatePin(e, t, i, n, s)
    const r = this.getColor(i.color)
    const d = getIconKey(t, i.icon, this.iconsEnabled)
    let c = this.iconAtlas.uvRects.get(d)

    c || (c = this.iconAtlas.addIcon(d, { type: "font", family: "iconfont", codePoint: +IconCodeMap[d], offset: isCommentLargeIcon(d) }))
    const l = new Float32Array(16)
    const h = new Float32Array(4)
    const u = this.iconAtlas.texture
    for (let e = 0; e < l.length; e += 4) {
      l[e] = c.minU
      l[e + 1] = c.minV
      l[e + 2] = c.maxU
      l[e + 3] = c.maxV
    }
    const m = t === PinType.OBJECT ? 0 : 0.06
    h[0] = h[1] = h[2] = h[3] = m
    let p = this.idToMesh.get(e)

    p || ((p = new me(e, t, i, r, l, this.layer, this.canvasData, n, u, h)), this.idToMesh.set(e, p), this.input.registerMesh(p.pinHeadMesh, !1))
    void 0 !== s && (p.visible = s)
    p.updateFromPin(i, r, l, n, u, h)
    const g = i.floorId
    ;(p.parent && p.parent?.userData.floorId === g) || (p.parent && p.parent?.remove(p), this.getFloorContainer(g).userData.typeContainers[t].add(p))
  }
  removePin(e) {
    super.removePin(e)
    const i = this.idToMesh.get(e)
    i && (this.idToMesh.delete(e), i.parent?.remove(i), this.input.unregisterMesh(i.pinHeadMesh), i.dispose())
  }
  removePinsByPredicate(e: (e?: PinType) => boolean) {
    this.idToMesh.forEach((t, i) => {
      e(t.pinType) && this.removePin(i)
    })
  }
  setPinVisible(e, t) {
    const i = this.idToMesh.get(e)
    i && (i.visible = t)
  }
  setPinColorVariant(e, t) {
    const i = this.idToMesh.get(e)
    i && i.setColorVariant(t)
  }
  setPinColorVariants(e, t?) {
    this.idToMesh.forEach(i => {
      i.pinId !== t && i.setColorVariant(e)
    })
  }
  setPinColorVariantByType(e, t, i) {
    this.idToMesh.forEach(n => {
      n.pinType === e && n.pinId !== i && n.setColorVariant(t)
    })
  }
  setPinOpacity(e, t) {
    const i = this.idToMesh.get(e)
    i && i.setOpacity(t)
  }
  setPinOpacityScale(e, t) {
    const i = this.idToMesh.get(e)
    i && i.setOpacityScale(t)
  }
  fadePinOpacity(e, t) {
    const i = this.idToMesh.get(e)
    i && i.fadeOpacity(t)
  }
  setPinOpacityByType(e, t, i) {
    this.idToMesh.forEach(n => {
      n.pinType === e && n.pinId !== i && n.setOpacity(t)
    })
  }
  fadePinOpacityByType(e, t, i = []) {
    this.idToMesh.forEach(n => {
      n.pinType !== e || i.includes(n.pinId) || n.fadeOpacity(t)
    })
  }
  setPinRenderOverrides(e, t, i) {
    super.setPinRenderOverrides(e, t, i)
    const n = this.idToMesh.get(e)
    n && n.setRenderOverrides(t, i)
  }
  pinHeadTransform(e: string): Matrix4 {
    const t = this.idToMesh.get(e)
    return t ? t.pinHeadMesh.matrixWorld : new Matrix4()
  }
}
export default class PinsModule extends Module {
  editActivated: boolean
  editBindings: ISubscription[]
  touchDevice: boolean
  worldPosition: Vector3
  visibilityChanged: () => void
  interactionmodeData: any
  cameraData: CameraData
  pinRenderer: PinMeshRenderer
  viewmode: ViewModes | null
  viewmodeChanged: (e: any) => void
  onEnablePinEditing: (e: any) => Promise<void>
  updateCurrentPin: () => void
  viewData: PinsViewData
  pinEditor: PinEditor
  onUpdatePin: (e: any) => Promise<void>
  onUpdatePinViews: (e: any) => Promise<void>
  onChangePinVisibility: (e: any) => Promise<void>
  onChangePinVisibilityByType: (e: any) => Promise<void>
  onChangePinOpacity: (e: any) => Promise<void>
  onChangePinOpacityScale: (e: any) => Promise<void>
  onChangePinOpacityByType: (e: any) => Promise<void>
  onUnselectPin: (e: any) => Promise<void>
  clearPinSelection: () => Promise<void>
  onStartPinCreation: (e: any) => Promise<void>
  onCameraUpdate: () => void
  handleSweepChange: () => void
  handleViewModeChange: () => void
  cancelPinCreation: () => void
  engine: EngineContext
  onPinPlacementCancelled: () => void
  onCancelNewPin: () => Promise<void>
  onViewChange: () => void
  handleRemovingPin: (e: any) => Promise<void>
  handleRemovingPinsByType: (e: any) => Promise<void>
  onTogglePinEditing: (e: any) => Promise<void>
  onPinClicked: (e: any) => void
  onHoverChanged: (e: any) => undefined
  onSelectPin: (e: any) => Promise<undefined>
  clickOffPin: () => Promise<void>
  movePin: (e: any) => Promise<void>
  placePin: (e: any) => Promise<void>
  input: InputIniModule
  floorsViewData: FloorsViewData
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  saveScreenPosition: any
  constructor() {
    super(...arguments)
    this.name = "pins"
    this.editActivated = !1
    this.editBindings = []
    this.touchDevice = winCanTouch()
    this.worldPosition = new Vector3()
    this.visibilityChanged = () => {
      const e = !this.in360View()
      const t = !this.interactionmodeData.isVR()
      this.pinRenderer.container.visible = e && t
      const { floorsViewData: i } = this
      const n = this.viewmode === ViewModes.Dollhouse || this.viewmode === ViewModes.Floorplan
      const s = i.transition.progress.active ? () => !0 : i.isHidden
      this.pinRenderer.setFloorsHidden(n ? s : () => !1)
    }
    this.viewmodeChanged = e => {
      this.viewmode = e.toMode
      this.visibilityChanged()
    }
    this.onEnablePinEditing = async e => {
      e.enabled ? this.enableEditing() : this.disableEditing()
    }
    this.updateCurrentPin = () => {
      const { pinEditorState, focusedPin, selectedPinId } = this.viewData
      if (pinEditorState !== PinEditorState.CREATING) {
        const e = selectedPinId ? this.viewData.getPin(selectedPinId) : null
        const n = focusedPin || e
        this.pinEditor.updateAnchorMesh()
        if (n) {
          const { id, pinType, backgroundTexture } = n
          this.pinRenderer.updatePin(id, pinType, n, backgroundTexture)
          this.pinRenderer.setPinColorVariant(id, PinColorVariant.HIGHLIGHTED)
          this.pinRenderer.setPinColorVariants(PinColorVariant.DEFAULT, id)
        } else {
          this.pinRenderer.setPinColorVariants(PinColorVariant.DEFAULT)
        }
      }
    }
    this.onUpdatePin = async e => {
      const { id: t, pinType: i, properties: n } = e,
        s = this.viewData.getPin(t)
      if (s && s.pinType === i) {
        const { focusedPin: e, selectedPinId: i } = this.viewData,
          a = i ? this.viewData.getPin(i) : null,
          o = Object.assign(Object.assign({}, s), n)
        this.viewData.updatePin(o),
          this.pinRenderer.updatePin(o.id, o.pinType, o, o.backgroundTexture),
          (null == a ? void 0 : a.id) === t && (this.saveScreenPosition(o), this.updateCurrentPin()),
          (null == e ? void 0 : e.id) === t && this.saveScreenPosition(o)
      } else this.log.debug(`Cannot update non-existent ${i} pin`)
    }
    this.onUpdatePinViews = async e => {
      const { pinViews: t } = e
      t.forEach(e => {
        this.viewData.updatePin(e),
          this.pinRenderer.updatePin(e.id, e.pinType, e, e.backgroundTexture, e.visible),
          this.viewData.selectedPinId === e.id && (this.viewData.updatePin(e), this.updateCurrentPin()),
          void 0 !== e.opacity && this.pinRenderer.setPinOpacity(e.id, e.opacity),
          void 0 !== e.scale && this.pinRenderer.setPinRenderOverrides(e.id, null, e.scale)
      })
    }
    this.onChangePinVisibility = async e => {
      const { id: t, pinType: i, visible: n } = e,
        s = this.viewData.getPin(t)
      if (s && s.pinType === i) {
        this.pinRenderer.setPinVisible(t, n)
        const { selectedPinId: e, focusedPin: i } = this.viewData
        n || e !== t || this.changeSelectedPin(null), n || (null == i ? void 0 : i.id) !== t || this.viewData.setFocusedPin(null)
      } else this.log.debug(`Cannot change visibility of non-existent ${i} pin`)
    }
    this.onChangePinVisibilityByType = async e => {
      const { pinType: t, visible: i } = e
      this.pinRenderer.setPinTypeVisible(t, i)
    }
    this.onChangePinOpacity = async e => {
      const { id: t, pinType: i, opacity: n } = e,
        s = this.viewData.getPin(t)
      s && s.pinType === i ? this.pinRenderer.setPinOpacity(t, n) : this.log.debug(`Cannot change opacity of non-existent ${i} pin`)
    }
    this.onChangePinOpacityScale = async e => {
      const { id: t, pinType: i, scale: n } = e,
        s = this.viewData.getPin(t)
      s && s.pinType === i ? this.pinRenderer.setPinOpacityScale(t, n) : this.log.debug(`Cannot change opacity scaling of non-existent ${i} pin`)
    }
    this.onChangePinOpacityByType = async e => {
      const { pinType: t, opacity: i, skipIds: n } = e
      this.pinRenderer.fadePinOpacityByType(t, i, n)
    }
    this.onUnselectPin = async e => {
      const { pinType: t, id: i } = e,
        { selectedPinId: n } = this.viewData,
        s = n ? this.viewData.getPin(n) : null
      ;(null == s ? void 0 : s.pinType) === t && (null == s ? void 0 : s.id) === i && this.changeSelectedPin(null)
    }
    this.clearPinSelection = async () => {
      this.changeSelectedPin(null)
    }
    this.onStartPinCreation = async e => {
      const { id: t, pin: i, pinType: n, backgroundTexture: s } = e
      const a = this.viewData
      const o = Object.assign(Object.assign({ id: t, pinType: n }, i), { backgroundTexture: s })
      a.setEditablePin(!0)
      a.setPinEditorState(PinEditorState.CREATING)
      this.changeSelectedPin(o)
      this.pinEditor.startPinCreation()
    }
    this.saveScreenPosition = e => {
      const t = this.viewData,
        i = e.stemNormal.clone().normalize()
      this.worldPosition.copy(e.anchorPosition).addScaledVector(i, e.stemLength)
      const n = getScreenAndNDCPosition(this.cameraData, this.worldPosition)
      t.setScreenPosition(n.ndcPosition.z > 1 ? null : n.screenPosition)
    }
    this.onCameraUpdate = () => {
      const { creatingNewPin: e, focusedPin: t, selectedPinId: i } = this.viewData,
        n = i ? this.viewData.getPin(i) : null
      !e && t ? this.saveScreenPosition(t) : n && this.saveScreenPosition(n)
    }
    this.handleSweepChange = () => this.handleSweepAndViewModeChange()
    this.handleViewModeChange = () => this.handleSweepAndViewModeChange()
    this.cancelPinCreation = () => {
      const { creatingNewPin: e, selectedPinId: t } = this.viewData
      if ((this.changeSelectedPin(null), t)) {
        const i = t ? this.viewData.getPin(t) : null
        e && i && (this.engine.broadcast(new PinAddCancelledMessage(i.id, i.pinType)), this.removePin(i.id, i.pinType), this.pinEditor.endPinCreation())
      }
      this.resetEditingState()
    }
    this.onPinPlacementCancelled = () => {
      this.cancelPinCreation()
    }
    this.onCancelNewPin = async () => {
      this.cancelPinCreation()
    }
    this.onViewChange = () => {
      this.cancelPinCreation()
    }
    this.handleRemovingPin = async e => {
      const { pinType: t, id: i } = e
      this.removePin(i, t)
    }
    this.handleRemovingPinsByType = async e => {
      const { pinType: t } = e,
        { focusedPin: i, selectedPinId: n } = this.viewData,
        s = n ? this.viewData.getPin(n) : null
      ;(null == s ? void 0 : s.pinType) === t && this.changeSelectedPin(null),
        (null == i ? void 0 : i.pinType) === t && this.viewData.setFocusedPin(null),
        this.viewData.removePinsByType(t),
        this.pinRenderer.removePinsByType(t)
    }
    this.onTogglePinEditing = async e => {
      const { id: t, editable: i } = e
      this.viewData.getPin(t) && this.viewData.setEditablePin(i)
    }
    this.onPinClicked = e => {
      const { pinType: t, id: i } = e,
        { creatingNewPin: n, selectedPinId: s } = this.viewData,
        a = s ? this.viewData.getPin(s) : null,
        o = i === (null == a ? void 0 : a.id) && t === (null == a ? void 0 : a.pinType)
      if (a && o) {
        if (n) return
        this.changeSelectedPin(null)
      } else if (n) this.cancelPinCreation()
      else {
        if (!(i === (null == a ? void 0 : a.id) && t === (null == a ? void 0 : a.pinType))) {
          const e = this.viewData.getPin(i)
          e && this.changeSelectedPin(e)
        }
      }
    }
    this.onHoverChanged = e => {
      const { pinType: t, id: i, hovering: n } = e,
        { creatingNewPin: s, focusedPin: a, selectedPinId: o } = this.viewData
      if (!s)
        if (n) {
          const e = this.viewData.getPin(i)
          if (!e) return void this.log.debug("Cannot find pin to focus")
          const n = o ? this.viewData.getPin(o) : null
          if ((this.viewData.setFocusedPin(e), n && n.id === i && n.pinType === t)) return
          this.saveScreenPosition(e),
            this.pinRenderer.setPinColorVariantByType(t, PinColorVariant.DEFAULT, null == a ? void 0 : a.id),
            this.pinRenderer.setPinColorVariant(i, PinColorVariant.HIGHLIGHTED)
        } else a && (this.pinRenderer.setPinColorVariant(a.id, PinColorVariant.DEFAULT), this.viewData.setFocusedPin(null))
    }
    this.onSelectPin = async e => {
      const { id: t, pinType: i, editable: n } = e,
        s = this.viewData,
        { selectedPinId: a, isPinEditable: o } = s
      if ((s.setPinEditorState(PinEditorState.IDLE), t === a && n === o)) return void this.log.debug("Pin is already selected")
      const r = this.viewData.getPin(t)
      r && r.pinType === i ? (s.setEditablePin(n), this.changeSelectedPin(r)) : this.log.debug(`Cannot select ${i} pin`)
    }
    this.clickOffPin = async () => {
      this.viewData.creatingNewPin || this.changeSelectedPin(null)
    }
    this.movePin = async e => {
      const { isPinEditable: t, selectedPinId: i } = this.viewData
      if (!t) return
      const { pos: n, previousPos: s, id: a } = e,
        o = i ? this.viewData.getPin(i) : null
      if (o && o.id === a) {
        const t = Object.assign(Object.assign({}, o), e.pos)
        this.viewData.updatePin(t), this.updateCurrentPin(), this.engine.broadcast(new PinMovedMessage(o.id, o.pinType, n, s))
      } else this.log.debug("Cannot move the pin, not open for edit")
    }
    this.placePin = async e => {
      const { isPinEditable: t, canPlace: i, selectedPinId: n } = this.viewData
      if (!t) return
      const s = n ? this.viewData.getPin(n) : null
      s && i
        ? (this.viewData.setPinEditorState(PinEditorState.PLACED), this.engine.broadcast(new PinPlacedMessage(s.id, s.pinType, s)))
        : (this.log.debug("Cannot place pin because there is no open pin"), this.cancelPinCreation())
    }
  }

  getSaveInfoById(id: string) {
    const tagsModule = this.engine?.getModuleBySymbolSync(TagsSymbol)
    const e = tagsModule?.getSaveInfoById(id)
    return e
  }

  async init(e, t: EngineContext) {
    this.engine = t
    const [i, n, s, o, r, g] = await Promise.all([
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.market.waitForData(CanvasData),
      t.market.waitForData(AppData),
      t.getModuleBySymbol(RaycasterSymbol),
      t.market.waitForData(LayersData),
      document.fonts.ready
    ])
    this.input = i
    const E = {
      onClick: (e, i) => {
        const openInfo = this.getSaveInfoById(e)
        console.log(openInfo, "获取到的tagsModule-openInfo")
        t.broadcast(new PinClickedMessage(e, i, openInfo))
      },
      onHover: (e, i) => {
        t.broadcast(new PinHoverChangeMessage(e, !0, i)),
          t.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER)),
          t.commandBinder.issueCommand(new DisableCursorMeshCommand(!0))
      },
      onUnhover(e, i) {
        t.broadcast(new PinHoverChangeMessage(e, !1, i)),
          t.commandBinder.issueCommand(new SetMouseCursorCommand(null)),
          t.commandBinder.issueCommand(new DisableCursorMeshCommand(!1))
      }
    }
    const D = t.claimRenderLayer(this.name)
    this.pinRenderer = new PinMeshRenderer(i, n.getCamera(), s, D, t.commandBinder, r, E, e.tagIconsEnabled)

    n.getScene().add(this.pinRenderer.container)
    t.addComponent(this, this.pinRenderer)
    ;[this.floorsViewData, this.viewmodeData, this.interactionmodeData, this.sweepData, this.cameraData] = await Promise.all([
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(InteractionData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(CameraData)
    ])
    this.viewData = new PinsViewData()
    this.pinEditor = new PinEditor(this.viewData, this.engine, this.input, this.pinRenderer)
    this.floorsViewData.iterate(e => this.pinRenderer.getFloorContainer(e.id))
    this.viewmode = this.viewmodeData.currentMode
    this.bindings.push(
      t.commandBinder.addBinding(EnablePinCreationCommand, this.onEnablePinEditing),
      t.commandBinder.addBinding(SelectPinCommand, this.onSelectPin),
      t.commandBinder.addBinding(UnselectPinCommand, this.onUnselectPin),
      t.commandBinder.addBinding(PinSelectionClearCommand, this.clearPinSelection),
      t.commandBinder.addBinding(PinClickElsewhereCommand, this.clickOffPin),
      t.commandBinder.addBinding(UpdatePinCommand, this.onUpdatePin),
      t.commandBinder.addBinding(UpdatePinViewsCommand, this.onUpdatePinViews),
      t.commandBinder.addBinding(ChangePinVisibilityCommand, this.onChangePinVisibility),
      t.commandBinder.addBinding(ChangePinTypeVisibilityCommand, this.onChangePinVisibilityByType),
      t.commandBinder.addBinding(ChangePinOpacityCommand, this.onChangePinOpacity),
      t.commandBinder.addBinding(ChangePinOpacityScaleCommand, this.onChangePinOpacityScale),
      t.commandBinder.addBinding(ChangePinTypeOpacityCommand, this.onChangePinOpacityByType),
      t.commandBinder.addBinding(CreatePinCommand, this.onStartPinCreation),
      t.commandBinder.addBinding(RemovePinCommand, this.handleRemovingPin),
      t.commandBinder.addBinding(RemovePinTypeCommand, this.handleRemovingPinsByType),
      t.commandBinder.addBinding(MovePinCommand, this.movePin),
      t.commandBinder.addBinding(TogglePinEditingCommand, this.onTogglePinEditing),
      this.interactionmodeData.onChanged(this.visibilityChanged),
      this.floorsViewData.onChanged(this.visibilityChanged),
      this.viewmodeData.makeModeChangeSubscription(this.visibilityChanged),
      t.subscribe(SweepDataMessage, this.visibilityChanged),
      t.subscribe(ViewModeChangeMessage, this.viewmodeChanged),
      t.subscribe(EndSwitchViewmodeMessage, this.viewmodeChanged),
      t.subscribe(PinClickedMessage, this.onPinClicked),
      this.viewData.onPinEditorStateChanged(this.updateCurrentPin),
      this.viewData.onSelectedPinChanged(this.updateCurrentPin),
      this.viewData.onFocusedPinChanged(this.updateCurrentPin),
      this.viewData.onPinEditableChanged(this.updateCurrentPin),
      this.cameraData.onChanged(this.onCameraUpdate),
      g.onPropertyChanged("currentViewId", this.onViewChange)
    )
    this.touchDevice || this.bindings.push(t.subscribe(PinHoverChangeMessage, this.onHoverChanged))
    let x = o.application
    this.bindings.push(
      o.onPropertyChanged("application", e => {
        e !== x &&
          (this.visibilityChanged(),
          this.viewData.creatingNewPin ? this.cancelPinCreation() : (this.changeSelectedPin(null), this.viewData.setFocusedPin(null), this.resetEditingState()),
          (x = e))
      })
    )
    this.visibilityChanged()
    t.market.register(this, PinsViewData, this.viewData)
  }
  dispose(e) {
    this.disableEditing()
    this.pinEditor.dispose()
    this.pinRenderer.dispose()
    this.bindings.forEach(e => {
      e.cancel()
    })
    this.bindings = []
    this.editBindings = []
    super.dispose(e)
  }
  onUpdate() {
    this.editActivated && this.pinEditor.update()
  }
  in360View() {
    const e = this.sweepData.currentSweep ? this.sweepData.currentSweep : ""
    return this.viewmodeData.isInside() && this.sweepData.isSweepUnaligned(e)
  }
  enableEditing() {
    if (!this.editActivated) {
      this.editActivated = !0
      this.pinEditor.toggleEditing(!0)
      if (0 === this.editBindings.length) {
        const e = this.engine,
          t = e.commandBinder
        this.editBindings.push(
          t.addBinding(PlacePinCommand, this.placePin),
          t.addBinding(PinCreationCancelCommand, this.onCancelNewPin),
          this.sweepData.makeSweepChangeSubscription(this.handleSweepChange),
          e.subscribe(EndSwitchViewmodeMessage, this.handleViewModeChange),
          e.subscribe(PinPlacementCancelledMessage, this.onPinPlacementCancelled)
        )
      } else {
        this.editBindings.forEach(e => {
          e.renew()
        })
      }
      this.handleSweepAndViewModeChange()
    }
  }
  disableEditing() {
    this.editActivated &&
      ((this.editActivated = !1),
      this.pinEditor.toggleEditing(!1),
      this.cancelPinCreation(),
      this.editBindings.forEach(e => {
        e.cancel()
      }))
  }
  changeSelectedPin(e) {
    const { selectedPinId: t } = this.viewData
    if ((e?.id || null) === t) return void this.log.debug("Pin selection did not change")
    t && this.viewData.getPin(t) && this.pinRenderer.hideSelectedMesh()
    if (e) {
      this.saveScreenPosition(e)
      this.viewData.setSelectedPinId(e.id)
      this.pinRenderer.showSelectedMesh(e.pinType, e.id)
    } else {
      this.viewData.setScreenPosition(null)
      this.viewData.setSelectedPinId(null)
    }
  }
  handleSweepAndViewModeChange() {
    const e = this.viewData
    const t = !this.in360View()
    e.creatingNewPin && !t ? this.cancelPinCreation() : e.setCanAdd(t)
  }
  resetEditingState() {
    const e = this.viewData
    e.setPinEditorState(PinEditorState.IDLE)
    e.setEditablePin(!1)
    e.setCanPlace(!0)
    e.setCanAdd(!this.in360View())
  }
  removePin(e, t) {
    const { focusedPin: i, selectedPinId: n } = this.viewData
    n === e && this.changeSelectedPin(null)
    i?.id === e && i?.pinType === t && this.viewData.setFocusedPin(null)
    this.viewData.removePin(e)
    this.pinRenderer.removePin(e)
  }
}
