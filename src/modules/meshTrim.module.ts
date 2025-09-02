import {
  BackSide,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  Intersection,
  Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Vector2,
  Vector3
} from "three"
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry"
import { AttachGizmoCommand, DetachGizmoCommand, SetGizmoControlModeCommand } from "../command/attachment.command"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { MovetoFloorCommand, MovetoFloorNumberCommand } from "../command/floors.command"
import {
  ActivateMeshTrimEditorCommand,
  ChangeMeshTrimEditorViewCommand,
  ChangeTrimMeshGroupCommand,
  CreateMeshTrimCommand,
  CreateMeshTrimDataCommand,
  DeactivateMeshTrimEditorCommand,
  DeleteMeshTrimCommand,
  DeleteMeshTrimDataCommand,
  EditMeshTrimCommand,
  MoveMeshTrimAllFloorsCommand,
  RecenterMeshTrimEditorCommand,
  SelectMeshTrimCommand,
  UnselectMeshTrimCommand
} from "../command/meshTrim.command"
import { CameraPoseCommand, ChangeViewmodeCommand, LockViewmodeCommand, UnlockViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { PickingPriorityType } from "../const/12529"
import * as j from "../const/17881"
import { MaterialDefaultColor, MaterialSelectColor } from "../const/17881"
import { EditorState } from "../const/24730"
import * as lt from "../const/49623"
import { defaultMeshGroup } from "../const/52498"
import { TransitionTypeList } from "../const/64918"
import { MaxTrimsPerFloor } from "../const/97178"
import { CursorStyle } from "../const/cursor.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import { InputSymbol, ModelMeshSymbol, TransformGizmoSymbol, WebglRendererSymbol, WorkShopTrimEditSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { AppData, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { MeshTrimData } from "../data/meshTrim.data"
import { MeshTrimViewData } from "../data/meshTrimView.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { calculateDistanceToViewEdge } from "../math/70616"
import { UpdateMeshTrimMessage, ValidateTrimMessage } from "../message/meshTrim.message"
import { MeshTrimObject } from "../object/meshTrim.object"
import { StartTransition } from "../utils/6282"
import { Comparator } from "../utils/comparator"
import { ViewModes } from "../utils/viewMode.utils"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import { getNearestPoseConfiguration } from "../webgl/48057"
import { getCameraPose, MeshTrimViewState, ViewChangeState } from "../webgl/49123"
import { LineMaterial } from "../webgl/line.material"
import { LineMesh } from "../webgl/line.mesh"
import { Pose } from "../webgl/pose"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { DirectionVector } from "../webgl/vector.const"
import InputIniModule from "./inputIni.module"
import TransformGizmoModule from "./transformGizmo.module"
import WebglRendererModule from "./webglrender.module"

declare global {
  interface SymbolModule {
    [WorkShopTrimEditSymbol]: MeshTrimModule
  }
}
class DragController {
  onDragBegin: (t: DraggerStartEvent, e: MeshTrim | MeshTrimView, i: Box3, n: Intersection) => void
  currentDragEvent?: {
    dragStartPosition: Vector2
    meshTrimStartPosition: Vector3
    meshTrimStartScale: Vector3
    worldChange: Vector3
    dragNormal: Vector3
    buttons: number
    bounds: Box3
    dragEndPosition?: Vector2
  }
  onDrag: (t: DraggerMoveEvent | DraggerStopEvent, e: MeshTrim | MeshTrimView, i: Intersection) => any
  onDragEnd: (t: DraggerStopEvent, e: MeshTrim | MeshTrimView, i: Intersection) => any
  cameraData: CameraData
  renderer: WebglRendererModule
  constructor(t, e) {
    this.onDragBegin = (t, e, i, n) => {
      if (!!n?.face && !!e.meshTrim) {
        this.currentDragEvent = {
          dragStartPosition: new Vector2(t.position.x, t.position.y),
          meshTrimStartPosition: e.meshTrim.position.clone(),
          meshTrimStartScale: e.meshTrim.scale.clone(),
          worldChange: new Vector3(0, 0, 0),
          dragNormal: n.face.normal,
          buttons: t.buttons,
          bounds: i
        }
        e.onDragBegin(this.currentDragEvent)
      }
    }

    this.onDrag = (t, e, i) => {
      if (void 0 === this.currentDragEvent) return !1
      const { dragStartPosition: s } = this.currentDragEvent
      this.currentDragEvent.worldChange = this.getWorldChange(s, t.position)
      return e.onDrag(this.currentDragEvent)
    }
    this.onDragEnd = (t, e, i) => {
      if (void 0 === this.currentDragEvent) return !1
      this.currentDragEvent.dragEndPosition = new Vector2(t.position.x, t.position.y)
      const n = this.onDrag(t, e, i)
      this.currentDragEvent = void 0
      return n
    }
    this.cameraData = t
    this.renderer = e
  }
  getWorldChange(t: Vector2, e: Vector2) {
    const i = this.cameraData.pose.rotation
    const n = this.renderer.getCamera()
    const a = new Vector3(e.x, e.y, -1).unproject(n)
    const o = new Vector3(t.x, t.y, -1).unproject(n)
    const r = a.sub(o)
    const d = DirectionVector.BACK.clone().applyQuaternion(i)
    r.projectOnPlane(d)
    return r
  }
}
const _ = [new Vector3(-1, -1, -1), new Vector3(-1, -1, 1), new Vector3(-1, -1, 1), new Vector3(-1, 1, 1), new Vector3(-1, 1, 1), new Vector3(-1, 1, -1)].map(
  t => t.multiplyScalar(0.5)
)
function k(t: number) {
  return (e: Vector3) => e.clone().applyAxisAngle(DirectionVector.UP, t)
}
function H(t: number[], e: Vector3) {
  t.push(e.x, e.y, e.z)
  return t
}
const linePostions = [_, _.map(k(Math.PI / 2)), _.map(k(Math.PI)), _.map(k(Math.PI / -2))].map(t => t.reduce(H, []))
const W = new LineMaterial({ color: MaterialSelectColor, linewidth: j.b5, side: DoubleSide })
const DefaultColor = new Color(MaterialDefaultColor)
const SelectColor = new Color(MaterialSelectColor)
class MeshTrimLineSegment extends LineMesh<LineSegmentsGeometry> {
  constructor(t, e) {
    super(t, e)
    this.onBeforeRender = t => {
      const { offsetWidth: e, offsetHeight: i } = t.domElement
      this.material.resolution.set(e, i)
    }
  }
}
class LineBox extends Group {
  material: LineMaterial
  constructor() {
    super()
    this.material = W.clone()
    linePostions.forEach(t => {
      const e = new LineSegmentsGeometry().setPositions(t)
      const i = new MeshTrimLineSegment(e, this.material)
      this.add(i)
    })
  }
  setEnabled(t) {
    this.material.setOpacity(t ? 1 : 0.5)
  }
  setSelected(t: boolean) {
    this.material.color = t ? SelectColor : DefaultColor
  }
}
class MeshTrimBase extends Mesh<BufferGeometry, MeshBasicMaterial> {
  raycastEnabled: boolean
  constructor(geometry, material) {
    super(geometry, material)
    this.raycastEnabled = !0
  }
}
const defaultOpacity = 0.25
const $ = new BoxGeometry(1, 1, 1)
const J = new MeshBasicMaterial({ color: MaterialDefaultColor, transparent: !0, opacity: 0, side: FrontSide, depthTest: !1 })
const q = new MeshBasicMaterial({ color: MaterialDefaultColor, transparent: !0, opacity: 0, side: BackSide, depthTest: !1 })
export class MeshTrimView extends MeshTrimBase {
  bindings: ISubscription[]
  _selected: boolean
  updateMeshTrimView: () => void
  meshTrim: MeshTrimObject
  lineBox: LineBox
  onClick: () => void
  commandBinder: EngineContext["commandBinder"]
  backMaterial: MeshBasicMaterial
  backMesh: Mesh<BoxGeometry, MeshBasicMaterial>
  constructor(t: MeshTrimObject, e) {
    super($, J.clone())
    this.bindings = []
    this._selected = !1
    this.updateMeshTrimView = () => {
      this.position.copy(this.meshTrim.position)
      this.quaternion.copy(this.meshTrim.rotation)
      this.scale.copy(this.meshTrim.scale)
      this.lineBox.setEnabled(this.meshTrim.enabled)
    }
    this.onClick = () => {
      this.selected
        ? this.commandBinder.issueCommand(new UnselectMeshTrimCommand())
        : this.commandBinder.issueCommand(new SelectMeshTrimCommand({ meshTrimId: this.meshTrim.id }))
    }
    this.backMaterial = q.clone()
    this.backMesh = new Mesh($, this.backMaterial)
    this.add(this.backMesh)
    this.commandBinder = e
    this.lineBox = new LineBox()
    this.add(this.lineBox)
    this.name = t.id
    this.renderOrder = 1
    this.setMeshTrimData(t)
  }
  init() {}
  render(t) {}
  dispose() {
    this.removeBindings()
  }
  activate(t) {}
  deactivate(t) {}
  get selected() {
    return this._selected
  }
  set selected(t: boolean) {
    this._selected = t
    this.material.opacity = t ? defaultOpacity : 0
    this.backMaterial.opacity = t ? defaultOpacity : 0
    this.material.depthTest = !!t
    this.backMaterial.depthTest = !!t
    this.lineBox.setSelected(t)
  }
  setupBindings(t: MeshTrimObject) {
    this.bindings.push(t.onChanged(this.updateMeshTrimView))
  }
  removeBindings() {
    this.bindings.forEach(t => t.cancel())
    this.bindings.length = 0
  }
  setMeshTrimData(t: MeshTrimObject) {
    this.removeBindings()
    this.setupBindings(t)
    this.meshTrim = t
    this.updateMeshTrimView()
  }
  onHover() {
    this.material.opacity = defaultOpacity
    this.backMaterial.opacity = defaultOpacity
    this.material.depthTest = !0
    this.backMaterial.depthTest = !0
    this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER))
  }
  onUnhover() {
    this.commandBinder.issueCommand(new SetMouseCursorCommand(null)),
      this.selected || ((this.material.opacity = 0), (this.backMaterial.opacity = 0), (this.material.depthTest = !1), (this.backMaterial.depthTest = !1))
  }
  onDrag(t) {
    return !1
  }
  onDragBegin(t) {
    return !1
  }
}
const it = new MeshBasicMaterial({ color: MaterialDefaultColor })
class MeshTrim extends MeshTrimBase {
  options: {
    handleDirection: Vector3
    cursor: string
    name: string
    layer: number
    disableCursorChangeOnHover: boolean
    validButtons: MouseKeyCode
    widthInPixels?: number
    heightInPixels?: number
  }
  cameraData: CameraData
  commandBinder: EngineContext["commandBinder"]
  meshTrim: MeshTrimObject
  static ComponentVectors = [DirectionVector.RIGHT, DirectionVector.UP, DirectionVector.FORWARD]
  constructor(t, e, i, s, n?: Material) {
    super(t, n || it)
    this.options = e
    this.cameraData = i
    this.commandBinder = s
    this.name = "handle" + this.options.name
  }
  update(t: MeshTrimObject, e: Pose, i: PerspectiveCamera, s: CanvasData) {
    this.updatePosition(t, e, i)
    this.updateScale(t, e, i, s)
  }
  setMeshTrim(t: MeshTrimObject) {
    this.meshTrim = t
  }
  getInvertedScale(t: MeshTrimObject, e: Pose) {
    const i = e.rotation
    const n = new Quaternion(i.x, i.y, i.z, -i.w)
    return new Vector3(1, 1, 1).divide(t.scale).applyQuaternion(n)
  }
  updatePosition(t: MeshTrimObject, e: Pose, i: PerspectiveCamera) {
    const s = this.getInvertedScale(t, e)
    const n = this.options.handleDirection.clone().multiplyScalar(0.5)
    const a =
      ((function (t, e) {
        const i = DirectionVector.BACK.clone().applyQuaternion(e.rotation),
          s = t.clone().projectOnVector(i)
        return e.position.clone().projectOnVector(i).distanceTo(s)
      })(t.position, e) -
        this.getRenderDepth(i)) *
      s.z
    const o = DirectionVector.BACK.clone().applyQuaternion(e.rotation).normalize()
    o.multiply(o)
    const r = o.multiplyScalar(a)
    const d = n.applyQuaternion(e.rotation).add(r)
    this.position.copy(d)
  }
  updateScale(t: MeshTrimObject, e: Pose, i: PerspectiveCamera, n: CanvasData) {
    const { widthInPixels: a, heightInPixels: o } = this.options
    const r = this.getInvertedScale(t, e)
    const d = DirectionVector.BACK.clone()
    const c = new Vector3()
    MeshTrim.ComponentVectors.forEach((t, e) => {
      t.clone().projectOnVector(d).length() > 0 && c.setComponent(e, 0.01 * r.getComponent(e))
      if (t.clone().projectOnVector(DirectionVector.RIGHT).length() > 0) {
        if (a) {
          const t = calculateDistanceToViewEdge(a, i, n.width)
          c.setComponent(e, t * r.getComponent(e))
        } else c.setComponent(e, 1)
        return
      }
      if (t.clone().projectOnVector(DirectionVector.UP).length() > 0) {
        if (o) {
          const t = calculateDistanceToViewEdge(o, i, n.width)
          c.setComponent(e, t * r.getComponent(e))
        } else c.setComponent(e, 1)
      }
    })
    c.applyQuaternion(e.rotation)
    this.scale.copy(c)
  }
  getRenderDepth(t: PerspectiveCamera) {
    return t.near + 10 + 0.01 * (this.options.layer || 0)
  }
  onHover() {
    this.options.disableCursorChangeOnHover || this.useMouseCursor(!0)
  }
  onUnhover() {
    this.useMouseCursor(!1)
  }
  onDrag(t: DragController["currentDragEvent"]) {
    return !!this.checkButtonMask(t) && (this.options.disableCursorChangeOnHover && this.useMouseCursor(!0), !0)
  }
  onDragBegin(t: DragController["currentDragEvent"]) {
    return !!this.checkButtonMask(t)
  }
  onDragEnd(t: DragController["currentDragEvent"]) {
    return !!this.checkButtonMask(t) && (this.options.disableCursorChangeOnHover && this.useMouseCursor(!1), !0)
  }
  checkButtonMask(t: DragController["currentDragEvent"]) {
    return !this.options.validButtons || this.options.validButtons === t!.buttons
  }
  useMouseCursor(t: boolean) {
    this.commandBinder.issueCommand(new SetMouseCursorCommand(t ? this.options.cursor : null))
  }
}

class ComparatorMeshTrim {
  constructor() {}
  compare(t) {
    return t instanceof MeshTrim ? t.raycastEnabled : t instanceof MeshTrimView
  }
}
function at(t: number) {
  return Math.round(100 * t) / 100
}
function ct(t: MeshTrimObject, e: Box3) {
  const i = e.clone()
  const n = i.getSize(new Vector3())
  t.scale.clamp(new Vector3(), n)
  i.expandByVector(t.scale.clone().multiplyScalar(-0.5))
  i.clampPoint(t.position, t.position)
}
function ht(t: MeshTrimObject, e: Box3) {
  const i = t.scale
  i.set(Math.abs(i.x), Math.abs(i.y), Math.abs(i.z))
  const n = new Vector3(),
    a = e
  a.getSize(n)
  const o = Math.max(n.x, n.y, n.z)
  n.setScalar(o), n.multiplyScalar(j.aM), i.clamp(j.UM, n)
  const r = t.position
  a.clampPoint(r, r), t.commit()
}
class MeshTrimHandle extends MeshTrim {
  constructor(t, e, i) {
    super(new BoxGeometry(1, 1, 1), t, e, i)
    this.visible = !1
  }
  updatePosition(t, e, i) {
    this.position.set(0, 0, 0)
  }
  updateScale(t, e, i) {
    this.scale.set(1, 1, 1)
  }
  onDrag(t: DragController["currentDragEvent"]) {
    if (!this.meshTrim) return !1
    if (!super.onDrag(t)) return !1
    const { dragEndPosition: e, meshTrimStartPosition: i, worldChange: s, bounds: n } = t!
    this.meshTrim.position.addVectors(i, s)
    ht(this.meshTrim, n)
    this.meshTrim.commit()
    if (e) {
      const { x, y } = e
      ;(Math.abs(x) > 0.5 || Math.abs(y) > 0.5) && this.commandBinder.issueCommand(new RecenterMeshTrimEditorCommand())
    }
    return !0
  }
}
const MeshTrimOptions = [
  {
    handleDirection: new Vector3(0, 0, 0),
    cursor: CursorStyle.MOVE,
    name: "move",
    layer: 3,
    disableCursorChangeOnHover: !0,
    validButtons: MouseKeyCode.PRIMARY
  }
]
class MeshTrimModuleHandles {
  viewData: MeshTrimViewData
  viewmodeData: ViewmodeData
  cameraData: CameraData
  canvasData: CanvasData
  renderer: WebglRendererModule
  bindings: ISubscription[]
  handles: MeshTrimHandle[]
  updateHandles: () => void
  updateVisibility: () => void
  onCurrentMeshTrimViewChanged: () => void
  group: Group
  meshTrimSubscription?: ISubscription
  constructor(t, e, i, n, a, o) {
    this.viewData = t
    this.viewmodeData = e
    this.cameraData = i
    this.canvasData = n
    this.renderer = o
    this.bindings = []
    this.handles = []
    this.updateHandles = () => {
      const t = this.viewData.currentMeshTrimView
      if (!t) return
      if (!this.visible) return
      const e = this.renderer.getCamera()
      for (const i of this.handles) i.update(t.meshTrim, this.cameraData.pose, e, this.canvasData)
    }
    this.onCurrentMeshTrimViewChanged = () => {
      this.updateVisibility()
      this.unsubscribeMeshTrimSubscription()
      this.subscribeMeshTrimSubscription()
    }
    this.updateVisibility = () => {
      const t = ViewModes.Orthographic === this.viewmodeData.currentMode
      const e = !!this.viewData.currentMeshTrimView
      const i = this.cameraData.transition.active
      this.visible = t && e && !i
    }
    this.group = new Group()
    this.group.renderOrder = PickingPriorityType.meshTrims + 1
    for (const t of MeshTrimOptions) {
      const e = new MeshTrimHandle(t, i, a)
      this.handles.push(e)
      this.group.add(e)
    }
    this.visible = !1
  }

  subscribe() {
    this.bindings.push(
      this.cameraData.pose.onChanged(this.updateHandles),
      this.viewData.onSelectedMeshTrimChanged(this.onCurrentMeshTrimViewChanged),
      this.cameraData.transition.onPropertyChanged("active", this.updateVisibility),
      this.viewmodeData.makeModeChangeSubscription(this.updateVisibility)
    )
    this.onCurrentMeshTrimViewChanged()
  }
  unsubscribe() {
    this.bindings.forEach(t => t.cancel())
    this.unsubscribeMeshTrimSubscription()
    this.visible = !1
  }
  unsubscribeMeshTrimSubscription() {
    this.removeFromScene()
    this.meshTrimSubscription && (this.meshTrimSubscription.cancel(), (this.meshTrimSubscription = void 0))
  }
  subscribeMeshTrimSubscription() {
    const t = this.viewData.selectedMeshTrim
    if (t) {
      this.meshTrimSubscription = t.onChanged(this.updateHandles)
      for (const e of this.handles) e.setMeshTrim(t)
      this.visible && this.addToScene()
    }
  }
  get visible() {
    return this.group.visible
  }
  set visible(t: boolean) {
    t !== this.group.visible && ((this.group.visible = t), t && this.addToScene(), t || this.removeFromScene())
  }
  removeFromScene() {
    this.group.parent && this.group.parent.remove(this.group)
  }
  addToScene() {
    const t = this.viewData.currentMeshTrimView
    t && t.add(this.group)
  }
}
export default class MeshTrimModule extends Module {
  inputModule: InputIniModule
  active: boolean
  floorGroups: Record<number, Group>
  permanentBindings: ISubscription[]
  commandBindings: ISubscription[]
  setCameraPosePromise: Promise<void>
  activateEditor: () => Promise<void>
  dragController: DragController
  cameraData: CameraData
  renderer: WebglRendererModule
  handles: MeshTrimModuleHandles
  engine: EngineContext
  floorsViewData: FloorsViewData
  deactivateEditor: () => Promise<void>
  viewData: MeshTrimViewData
  transformGizmo: TransformGizmoModule
  data: MeshTrimData
  createStateSubscription: any
  // analytics: AnalyticsModule
  deleteTrimView: (t: any) => void
  static KeysToDirection = {
    [KeyboardCode.LEFTARROW]: DirectionVector.LEFT,
    [KeyboardCode.RIGHTARROW]: DirectionVector.RIGHT,
    [KeyboardCode.UPARROW]: DirectionVector.UP,
    [KeyboardCode.DOWNARROW]: DirectionVector.DOWN
  }
  canvasData: CanvasData
  viewmodeData: ViewmodeData
  applicationData: AppData
  meshData: MeshData
  rootGroup: Group
  updateTrimForView: () => void
  onDragBegin: (t: DraggerStartEvent, e: MeshTrim | MeshTrimView, i: Intersection) => any
  onDrag: (t: DraggerMoveEvent, e: MeshTrim | MeshTrimView, i: Intersection) => any
  onDragEnd: (t: DraggerStopEvent, e: MeshTrim | MeshTrimView, i: Intersection) => any
  selectMeshTrimCommand: (e: { meshTrimId: string }) => Promise<void>
  unselectMeshTrimCommand: () => Promise<void>
  editMeshTrimCommand: () => Promise<void>
  validateTrim: () => void
  onFloorChanged: () => void
  onHover: (t: HoverMeshEvent, e: MeshTrim | MeshTrimView) => void
  onUnhover: (t: UnhoverMeshEvent, e: MeshTrim | MeshTrimView) => void
  onModelClicked: (t: InputClickerEndEvent, e: ShowcaseMesh) => false
  onMeshTrimClicked: (t: InputClickerEndEvent, e: MeshTrimView, i: Intersection) => void
  onBackgroundClicked: (t: InputClickerEndEvent) => boolean
  onMeshTrimSelected: (t: string) => Promise<void>
  onMeshTrimUnselected: () => void
  onCreateMeshTrimCommand: () => Promise<void>
  onDeleteMeshTrimCommand: (e: { meshTrimId: string }) => Promise<void>
  onMoveMeshTrimToAllFloors: (t: any) => Promise<void>
  changeViewState: (e: { viewChange: ViewChangeState }) => Promise<void>
  recenterCamera: () => Promise<void>
  onKey: (t: KeyboardCallbackEvent) => void
  constructor() {
    super(...arguments)
    this.name = "mesh_trim"
    this.active = !1
    this.floorGroups = {}
    this.permanentBindings = []
    this.commandBindings = []
    this.setCameraPosePromise = Promise.resolve()
    this.activateEditor = async () => {
      const t = new ComparatorMeshTrim()
      0 === this.bindings.length
        ? ((this.dragController = new DragController(this.cameraData, this.renderer)),
          this.handles.subscribe(),
          this.bindings.push(
            this.inputModule.registerMeshHandler(InputClickerEndEvent, Comparator.isInstanceOf(MeshTrimView), this.onMeshTrimClicked),
            this.inputModule.registerMeshHandler(InputClickerEndEvent, Comparator.is(isVisibleShowcaseMesh), this.onModelClicked),
            this.inputModule.registerMeshHandler(InputClickerEndEvent, Comparator.isType(SkySphereMesh), this.onBackgroundClicked),
            this.inputModule.registerMeshHandler(DraggerStartEvent, t, this.onDragBegin),
            this.inputModule.registerMeshHandler(DraggerMoveEvent, t, this.onDrag),
            this.inputModule.registerMeshHandler(DraggerStopEvent, t, this.onDragEnd),
            this.engine.subscribe(UpdateMeshTrimMessage, this.updateTrimForView),
            this.engine.subscribe(ValidateTrimMessage, this.validateTrim),
            this.inputModule.registerMeshHandler(HoverMeshEvent, t, this.onHover),
            this.inputModule.registerMeshHandler(UnhoverMeshEvent, t, this.onUnhover),
            this.inputModule.registerHandler(KeyboardCallbackEvent, this.onKey),
            this.floorsViewData.makeFloorChangeSubscription(this.onFloorChanged)
          ))
        : this.renewSubscriptions(this.bindings),
        this.commandBindings.length
          ? this.renewSubscriptions(this.commandBindings)
          : this.commandBindings.push(
              this.engine.commandBinder.addBinding(SelectMeshTrimCommand, this.selectMeshTrimCommand),
              this.engine.commandBinder.addBinding(EditMeshTrimCommand, this.editMeshTrimCommand),
              this.engine.commandBinder.addBinding(UnselectMeshTrimCommand, this.unselectMeshTrimCommand),
              this.engine.commandBinder.addBinding(CreateMeshTrimCommand, this.onCreateMeshTrimCommand),
              this.engine.commandBinder.addBinding(DeleteMeshTrimCommand, this.onDeleteMeshTrimCommand),
              this.engine.commandBinder.addBinding(RecenterMeshTrimEditorCommand, this.recenterCamera),
              this.engine.commandBinder.addBinding(ChangeMeshTrimEditorViewCommand, this.changeViewState),
              this.engine.commandBinder.addBinding(ChangeTrimMeshGroupCommand, this.onMoveMeshTrimToAllFloors)
            )
      this.setViewsVisible(!0)
      this.active = !0
      await this.activateViewmode()
    }
    this.deactivateEditor = async () => {
      this.active &&
        ((this.active = !1),
        this.cancelSubscriptions(this.bindings),
        this.cancelSubscriptions(this.commandBindings),
        this.setViewsVisible(!1),
        await this.resetCameraPose())
    }
    this.selectMeshTrimCommand = async ({ meshTrimId: t }) => {
      this.onMeshTrimSelected(t)
    }
    this.unselectMeshTrimCommand = async () => {
      this.onMeshTrimUnselected()
    }
    this.editMeshTrimCommand = async () => {
      if (!this.viewData.currentMeshTrimView) return
      const [t, e] = this.getNearestPose()
      await this.setCameraPose(t, e)
    }
    this.onDragBegin = (t, e, i) => !!this.transformGizmo.gizmo.dragging || this.dragController.onDragBegin(t, e, this.getTrimBounds(), i)
    this.onDrag = (t, e, i) => !!this.transformGizmo.gizmo.dragging || this.dragController.onDrag(t, e, i)
    this.onDragEnd = (t, e, i) => !!this.transformGizmo.gizmo.dragging || this.dragController.onDragEnd(t, e, i)
    this.updateTrimForView = () => {
      if (!this.viewData.currentMeshTrimView) return
      const t = this.viewData.currentMeshTrimView,
        e = t.meshTrim
      e.atomic(() => {
        e.position.copy(t.position), e.scale.copy(t.scale), e.rotation.copy(t.quaternion), e.updateRotationMatrix()
      }),
        e.commit()
    }
    this.validateTrim = () => {
      if (!this.viewData.currentMeshTrimView) return
      this.updateTrimForView()
      ht(this.viewData.currentMeshTrimView.meshTrim, this.getTrimBounds())
    }
    this.onFloorChanged = () => {
      var t
      const e = this.floorsViewData.currentFloorMeshGroup
      for (const t in this.floorGroups) {
        const i = `${e}` === t
        this.floorGroups[t].visible = i
      }
      ;(null === (t = this.viewData.currentMeshTrimView) || void 0 === t ? void 0 : t.meshTrim.meshGroup) !== e && this.onMeshTrimUnselected()
    }
    this.onHover = (t, e) => {
      e.onHover()
    }
    this.onUnhover = (t, e) => {
      e.onUnhover()
    }
    this.onModelClicked = (t, e) =>
      !!this.viewData.currentMeshTrimView && (e.meshGroup === this.viewData.currentMeshTrimView.meshTrim.meshGroup && this.onMeshTrimUnselected(), !1)
    this.onMeshTrimClicked = (t, e, i) => {
      void 0 !== i && i.face && e.onClick()
    }
    this.onBackgroundClicked = t => (this.onMeshTrimUnselected(), !1)
    this.onMeshTrimSelected = async t => {
      const e = this.viewData.getMeshTrimView(t)
      if (!e) return
      const i = this.floorsViewData.getFloorIndexForMeshGroup(e.meshTrim.meshGroup)
      const s = new MovetoFloorNumberCommand(i)
      await this.engine.commandBinder.issueCommand(s)
      this.viewData.currentMeshTrimView = e
      this.setEditorState(EditorState.EDITING)
      this.engine.commandBinder.issueCommand(new AttachGizmoCommand(e))
    }
    this.onMeshTrimUnselected = () => {
      this.viewData.currentMeshTrimView = null
      this.setEditorState(EditorState.IDLE)
      this.engine.commandBinder.issueCommand(new DetachGizmoCommand())
    }
    this.onCreateMeshTrimCommand = async () => {
      const t = this.viewData.viewState
      const e = this.floorsViewData.currentFloorMeshGroup
      const i = this.data.getTrimsForMeshGroup(e).length + 1
      const s = i === MaxTrimsPerFloor
      const n = this.createMeshTrim()
      this.engine.commandBinder.issueCommand(new CreateMeshTrimDataCommand(n))
      this.addTrimView(n)
      await this.onMeshTrimSelected(n.id)
      this.setEditorState(EditorState.CREATING)
      this.createStateSubscription = n.onChanged(() => this.setEditorState(EditorState.EDITING))
      // this.analytics.track("trim_created", { trim_id: n.id, view_state: t, trim_count_for_floor: i, is_at_floor_limit: s })
    }
    this.onDeleteMeshTrimCommand = async ({ meshTrimId }) => this.deleteMeshTrim(meshTrimId)
    this.onMoveMeshTrimToAllFloors = async t => {
      this.engine.commandBinder.issueCommand(new MoveMeshTrimAllFloorsCommand(t))
      const e = this.viewData.getMeshTrimView(t.id)
      if (e) {
        this.getFloorGroup(defaultMeshGroup).add(e)
      }
    }
    this.changeViewState = async ({ viewChange }) => {
      try {
        const e = this.getCameraBounds()
        const i = this.getCameraTarget()
        const s = this.cameraData.pose
        const n = this.viewData.viewState
        const [a, o] = getCameraPose(n, viewChange, e, i, s)
        this.setCameraPosePromise = this.setCameraPose(a, o)
        return this.setCameraPosePromise
      } catch (t) {
        this.log.debug(t)
      }
    }
    this.recenterCamera = async () => {
      if (!this.viewData.currentMeshTrimView) return
      const [t, e] = this.getNearestPose()
      this.setCameraPosePromise = this.setCameraPose(t, e)
    }
    this.deleteTrimView = t => {
      t.dispose()
      const e = this.floorGroups[t.meshTrim.meshGroup]
      e && e.remove(t), this.inputModule.unregisterMesh(t), this.inputModule.unregisterMesh(t.backMesh), this.viewData.deleteMeshTrimView(t.meshTrim.id)
    }
    this.onKey = t => {
      if (t.state !== KeyboardStateList.DOWN) return
      const e = MeshTrimModule.KeysToDirection[t.key]
      if (e) return this.moveMeshTrim(e.clone())
      switch (t.key) {
        case KeyboardCode.ESCAPE:
          this.isCreating() ? this.deleteCurrentMeshTrim() : this.isEditing() && this.onMeshTrimUnselected()
          break
        case KeyboardCode.BACKSPACE:
        case KeyboardCode.DELETE:
          this.deleteCurrentMeshTrim()
          break
        case KeyboardCode.TWO:
          this.engine.commandBinder.issueCommand(new ChangeMeshTrimEditorViewCommand({ viewChange: ViewChangeState.PERSPECTIVE }))
          break
        case KeyboardCode.THREE:
          this.engine.commandBinder.issueCommand(new ChangeMeshTrimEditorViewCommand({ viewChange: ViewChangeState.TOP }))
          break
        case KeyboardCode.FOUR:
          this.engine.commandBinder.issueCommand(new SetGizmoControlModeCommand(lt.g.Translate))
          break
        case KeyboardCode.FIVE:
          this.engine.commandBinder.issueCommand(new SetGizmoControlModeCommand(lt.g.Scale))
          break
        case KeyboardCode.SIX:
          this.engine.commandBinder.issueCommand(new SetGizmoControlModeCommand(lt.g.Rotate))
      }
    }
  }
  async init(t = {}, e: EngineContext) {
    this.engine = e
    this.floorsViewData = await this.engine.market.waitForData(FloorsViewData)
    this.renderer = await this.engine.getModuleBySymbol(WebglRendererSymbol)
    this.inputModule = await this.engine.getModuleBySymbol(InputSymbol)
    this.data = (await this.engine.getModuleBySymbol(ModelMeshSymbol)).meshTrimData
    this.cameraData = await this.engine.market.waitForData(CameraData)
    this.canvasData = await this.engine.market.waitForData(CanvasData)
    this.viewmodeData = await this.engine.market.waitForData(ViewmodeData)
    this.applicationData = await this.engine.market.waitForData(AppData)
    this.meshData = await this.engine.market.waitForData(MeshData)
    // this.analytics = await this.engine.getModuleBySymbol(AnalyticsSymbol)
    this.transformGizmo = await this.engine.getModuleBySymbol(TransformGizmoSymbol)
    this.viewData = new MeshTrimViewData()
    this.rootGroup = new Group()
    this.rootGroup.renderOrder = PickingPriorityType.meshTrims
    this.rootGroup.name = "Mesh Trims"
    this.setViewsVisible(!1)
    this.renderer.getScene().add(this.rootGroup)
    this.handles = new MeshTrimModuleHandles(this.viewData, this.viewmodeData, this.cameraData, this.canvasData, this.engine.commandBinder, this.renderer)
    const i = this.floorsViewData.floors.getOrderedValues().map(t => t.meshGroup)
    i.push(defaultMeshGroup)
    for (const t of i) {
      const e = this.data.getTrimsForMeshGroup(t)
      if (e) for (const t of e) this.addTrimView(t)
    }
    this.permanentBindings.push(
      this.engine.commandBinder.addBinding(ActivateMeshTrimEditorCommand, this.activateEditor),
      this.engine.commandBinder.addBinding(DeactivateMeshTrimEditorCommand, this.deactivateEditor)
    )
    e.market.register(this, MeshTrimViewData, this.viewData)
  }
  dispose(t) {
    super.dispose(t)
    t.market.unregister(this, MeshTrimViewData)
    this.deactivateEditor()
    this.viewData.forEachMeshTrimView(this.deleteTrimView)
    this.cancelSubscriptions(this.permanentBindings)
  }
  async activateViewmode() {
    return this.applicationData.phase === AppStatus.PLAYING
      ? this.transitionViewmode()
      : new Promise(t => {
          const e = this.applicationData.onPropertyChanged("phase", async i => {
            i === AppStatus.PLAYING && (e.cancel(), await this.transitionViewmode(), t(void 0))
          })
        })
  }
  async transitionViewmode() {
    await StartTransition(this.cameraData, this.viewmodeData)
    const t = this.engine.commandBinder
      .issueCommand(new ChangeViewmodeCommand(ViewModeCommand.DOLLHOUSE))
      .then(() => this.engine.commandBinder.issueCommand(new LockViewmodeCommand()))
    await Promise.all([t, this.engine.commandBinder.issueCommand(new MovetoFloorCommand(null, !0, 0))])
  }
  setEditorState(t: EditorState) {
    this.createStateSubscription && this.createStateSubscription.cancel()
    this.viewData.editorState = t
    this.viewData.commit()
  }
  cancelSubscriptions(t: ISubscription[]) {
    t.forEach(t => t.cancel())
  }
  renewSubscriptions(t: ISubscription[]) {
    t.forEach(t => t.renew())
  }
  setViewsVisible(t: boolean) {
    this.rootGroup.visible = t
  }
  createMeshTrim() {
    const t = this.floorsViewData.currentFloorMeshGroup
    const e = this.cameraData.pose
    const i = !e.isOrtho() && this.viewData.viewState === MeshTrimViewState.PERSPECTIVE
    const n = new Vector3()
    if (i) {
      const t = DirectionVector.FORWARD.clone().applyQuaternion(e.rotation)
      t.setLength(e.focalDistance)
      n.copy(e.position).add(t)
    } else n.copy(e.position)
    const a = j.JB
    const r = i ? e.focalDistance * a : this.cameraData.zoom()
    const d = new Vector3(1, 1, 1).multiplyScalar(r)
    const c = new MeshTrimObject(n, d, new Quaternion().identity(), Number.MAX_SAFE_INTEGER, !0, t)
    ct(c, this.getTrimBounds())
    return c
  }
  deleteCurrentMeshTrim() {
    this.viewData.currentMeshTrimView && this.deleteMeshTrim(this.viewData.currentMeshTrimView.meshTrim.id)
  }
  deleteMeshTrim(t: string) {
    const e = this.viewData.getMeshTrimView(t)
    if (!e) return
    const i = this.viewData.viewState
    const s = e === this.viewData.currentMeshTrimView
    const n = this.data.getTrimsForMeshGroup(e.meshTrim.meshGroup)
    const a = n.length === MaxTrimsPerFloor
    const o = n.length - 1
    s && this.onMeshTrimUnselected()
    this.engine.commandBinder.issueCommand(new DeleteMeshTrimDataCommand(e.meshTrim))
    this.deleteTrimView(e)
    // this.analytics.track("trim_deleted", { trim_id: t, view_state: i, currently_selected: s, trim_count_for_floor: o, was_at_floor_limit: a })
  }
  async setCameraPose(
    t: {
      position: Vector3
      rotation: Quaternion
      zoom?: number
    },
    e: MeshTrimViewState
  ) {
    const i = this.viewData.viewState === MeshTrimViewState.PERSPECTIVE
    this.viewData.viewState = e
    this.viewData.commit()
    const n = e === MeshTrimViewState.PERSPECTIVE
    const a = n ? ViewModeCommand.DOLLHOUSE : ViewModeCommand.ORTHOGRAPHIC
    const o = n
      ? t.rotation
      : (t => {
          const e = at(DirectionVector.UP.clone().applyQuaternion(t).y)
          const i = at(DirectionVector.RIGHT.clone().applyQuaternion(t).y)
          const n = at(DirectionVector.LEFT.clone().applyQuaternion(t).y)
          const a = at(DirectionVector.DOWN.clone().applyQuaternion(t).y)
          const o = DirectionVector.BACK.clone()
          const r = Math.max(e, i, n, a)
          if (r === e) return t
          if (r === i) {
            const e = new Quaternion().setFromAxisAngle(o, Math.PI / -2)
            return t.multiply(e)
          }
          if (r === n) {
            const e = new Quaternion().setFromAxisAngle(o, Math.PI / 2)
            return t.multiply(e)
          }
          if (r === a) {
            const e = new Quaternion().setFromAxisAngle(o, Math.PI)
            return t.multiply(e)
          }
          return t
        })(t.rotation)
    const r = n || i || t.zoom ? t.zoom : this.cameraData.orthoZoom()
    CameraPoseCommand[a] !== this.viewmodeData.currentMode && this.engine.commandBinder.issueCommand(new UnlockViewmodeCommand())
    this.viewData.currentMeshTrimView
      ? this.engine.commandBinder.issueCommand(new AttachGizmoCommand(this.viewData.currentMeshTrimView))
      : this.engine.commandBinder.issueCommand(new DetachGizmoCommand())
    await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(a, TransitionTypeList.Interpolate, { position: t.position, rotation: o, zoom: r }))
    this.active && this.engine.commandBinder.issueCommand(new LockViewmodeCommand())
  }
  async resetCameraPose() {
    await this.setCameraPosePromise
    await StartTransition(this.cameraData, this.viewmodeData)
    this.onMeshTrimUnselected()
    this.viewData.viewState = MeshTrimViewState.PERSPECTIVE
    this.viewData.commit()
    await this.engine.commandBinder.issueCommand(new UnlockViewmodeCommand())
    const t = new ChangeViewmodeCommand(ViewModeCommand.DOLLHOUSE, TransitionTypeList.Interpolate, this.cameraData.pose)
    await this.engine.commandBinder.issueCommand(t)
  }
  addTrimView(t: MeshTrimObject) {
    let e = this.viewData.getMeshTrimView(t.id)
    if (e) return e
    e = new MeshTrimView(t, this.engine.commandBinder)
    this.engine.addComponent(this, e)
    this.getFloorGroup(t.meshGroup).add(e)
    this.viewData.setMeshTrimView(t.id, e)
    this.inputModule.registerMesh(e, !1)
    this.inputModule.registerMesh(e.backMesh, !1)
    return e
  }
  moveMeshTrim(t: Vector3) {
    if (this.viewData.viewState === MeshTrimViewState.PERSPECTIVE) return
    if (!this.viewData.currentMeshTrimView) return
    const e = this.renderer.getCamera()
    const i = calculateDistanceToViewEdge(4, e, this.canvasData.width)
    const s = t.applyQuaternion(this.cameraData.pose.rotation)
    s.setLength(i)
    const { meshTrim: n } = this.viewData.currentMeshTrimView
    n.position.add(s)
    ct(n, this.getTrimBounds())
    n.commit()
  }
  getFloorGroup(t: number) {
    let e = this.floorGroups[t]
    return e || ((e = new Group()), (e.name = `${t}`), (e.renderOrder = PickingPriorityType.meshTrims), this.rootGroup.add(e), (this.floorGroups[t] = e), e)
  }
  getTrimBounds() {
    return this.floorsViewData.currentFloor?.boundingBox || this.meshData.extendedBounds
  }
  getCameraBounds() {
    return this.meshData.extendedBounds
  }
  getCameraTarget() {
    const t = new Vector3()
    if (this.viewData.currentMeshTrimView) return t.copy(this.viewData.currentMeshTrimView.position), t
    const e = this.floorsViewData.currentFloor
    return e ? (e.boundingBox.getCenter(t), t) : this.meshData.meshCenter
  }
  getNearestPose() {
    return getNearestPoseConfiguration(this.getCameraBounds(), this.getCameraTarget(), this.cameraData.pose)
  }
  isCreating() {
    return this.viewData.editorState === EditorState.CREATING
  }
  isEditing() {
    return this.viewData.editorState === EditorState.EDITING
  }
}
