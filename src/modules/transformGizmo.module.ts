import { BoxGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, OrthographicCamera, Quaternion, Vector3 } from "three"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import * as _ from "../math/70616"
import * as c from "../webgl/skySphere.mesh"
import { AttachGizmoCommand, DetachGizmoCommand, SetGizmoControlModeCommand } from "../command/attachment.command"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { Comparator } from "../utils/comparator"
import { PickingPriorityType } from "../const/12529"
import * as w from "../const/49623"
import { ColorSpace } from "../const/color.const"
import { CursorStyle } from "../const/cursor.const"
import { MouseKeyCode } from "../const/mouse.const"
import { CameraSymbol, CanvasSymbol, InputSymbol, TransformGizmoSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { PointerData } from "../data/pointer.data"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { UpdateMeshTrimMessage, ValidateTrimMessage } from "../message/meshTrim.message"
import { StartViewmodeChange } from "../message/viewmode.message"
import { ObservableValue } from "../observable/observable.value"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import { LineMaterial } from "../webgl/line.material"
import { LineMesh } from "../webgl/line.mesh"
import { DirectionVector } from "../webgl/vector.const"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { calculateDistanceToViewEdge } from "../math/70616"
declare global {
  interface SymbolModule {
    [TransformGizmoSymbol]: TransformGizmoModule
  }
}
const E = (() => {
    const t = new Vector3(),
      e = new Vector3()
    return i => {
      const s = i.getWorldScale(t)
      return e.set(1, 1, 1), e.divide(s)
    }
  })(),
  f = (t, e, i = 1) => {
    const s = E(e)
    t.scale.copy(s), t.scale.multiplyScalar(i), t.scale.applyQuaternion(t.quaternion)
  }
const M = new BoxGeometry(1, 1, 1),
  T = new MeshBasicMaterial({ color: 7171437, depthTest: !1, transparent: !0 })
class C extends Mesh {
  constructor() {
    const t = T.clone()
    super(M, t), (this.meshMaterial = t)
  }
}
class I extends C {
  constructor(t, e) {
    super(),
      (this.options = e),
      (this.faceDirection = new Vector3()),
      (this.parentGizmo = t),
      (this.meshMaterial.color = e.standardColor),
      this.faceDirection.copy(e.face),
      this.position.copy(this.faceDirection).multiplyScalar(0.6),
      this.scale.set(1, 1, 1),
      this.scale.multiplyScalar(0.1)
  }
  onDragBegin(t) {
    return !0
  }
  onDrag(t) {
    if (!this.parentGizmo.attachedObject) return !1
    const { startScale: e, startPosition: i, worldStartPosition: n, worldPosition: a } = t
    if (!a) return !1
    const o = new Vector3().subVectors(a, n),
      r = this.parentGizmo.attachedObject.quaternion,
      d = this.faceDirection.clone(),
      c = d.applyQuaternion(r),
      h = o.projectOnVector(c),
      { position: l, scale: m } = this.parentGizmo.attachedObject,
      u = h.length(),
      g = h.dot(d) > 0 ? 1 : -1,
      p = this.faceDirection.clone().multiplyScalar(u).multiply(this.faceDirection).multiplyScalar(g)
    m.addVectors(e, p)
    const w = p.clone().multiplyScalar(0.5).multiply(this.faceDirection).applyQuaternion(r)
    return l.addVectors(i, w), m.set(Math.abs(m.x), Math.abs(m.y), Math.abs(m.z)), !0
  }
  onDragEnd(t) {
    return !!this.parentGizmo.attachedObject
  }
  onHover() {
    this.meshMaterial.color = ColorSpace.YELLOW
  }
  onUnhover() {
    this.meshMaterial.color = this.options.standardColor
  }
}
const P = new LineGeometry().setPositions([0, 0, -0.6, 0, 0, 0.6]),
  A = new LineMaterial({ color: 16777215, linewidth: 8, side: DoubleSide, depthTest: !1 })
class V extends LineMesh {
  constructor(t) {
    super(P, A.clone()),
      (this.onBeforeRender = t => {
        const { offsetWidth: e, offsetHeight: i } = t.domElement
        this.material.resolution.set(e, i)
      }),
      (this.material.color = t.color),
      this.rotateOnAxis(t.rotationAxis, t.rotationRadians)
  }
}
const N = [
  { direction: new Vector3(0, 1, 0), cursor: CursorStyle.ARROW_UD },
  { direction: new Vector3(0, -1, 0), cursor: CursorStyle.ARROW_UD },
  { direction: new Vector3(1, 0, 0), cursor: CursorStyle.ARROW_LR },
  { direction: new Vector3(-1, 0, 0), cursor: CursorStyle.ARROW_LR },
  { direction: new Vector3(1, 1, 0).normalize(), cursor: CursorStyle.ARROW_URDL },
  { direction: new Vector3(-1, 1, 0).normalize(), cursor: CursorStyle.ARROW_ULDR },
  { direction: new Vector3(1, -1, 0).normalize(), cursor: CursorStyle.ARROW_ULDR },
  { direction: new Vector3(-1, -1, 0).normalize(), cursor: CursorStyle.ARROW_URDL }
]
const H = [
    { face: DirectionVector.LEFT.clone(), standardColor: ColorSpace.RED },
    { face: DirectionVector.RIGHT.clone(), standardColor: ColorSpace.RED },
    { face: DirectionVector.UP.clone(), standardColor: ColorSpace.GREEN },
    { face: DirectionVector.DOWN.clone(), standardColor: ColorSpace.GREEN },
    { face: DirectionVector.FORWARD.clone(), standardColor: ColorSpace.BLUE },
    { face: DirectionVector.BACK.clone(), standardColor: ColorSpace.BLUE }
  ],
  F = [
    { color: ColorSpace.RED, rotationAxis: new Vector3(0, 1, 0), rotationRadians: 0.5 * Math.PI },
    { color: ColorSpace.GREEN, rotationAxis: new Vector3(1, 0, 0), rotationRadians: 0.5 * Math.PI },
    { color: ColorSpace.BLUE, rotationAxis: new Vector3(0, 0, 1), rotationRadians: 0.5 * Math.PI }
  ]
class W extends Group {
  constructor(t, e, i, n) {
    super(),
      (this.input = t),
      (this.camera = e),
      (this.cameraData = i),
      (this.engine = n),
      (this.faces = []),
      (this.lines = []),
      (this.bindings = []),
      (this.onHover = (t, e) => {
        this.hoverHandle(e)
      }),
      (this.onUnhover = (t, e) => {
        this.unhoverHandle(e)
      }),
      (this.onDragBegin = (t, e, i) =>
        !(void 0 === i || !i.face) &&
        !!this.attachedObject &&
        ((this.currentDragEvent = {
          startPosition: this.attachedObject.position.clone(),
          startScale: this.attachedObject.scale.clone(),
          buttons: t.buttons,
          worldPosition: new Vector3(),
          worldStartPosition: this.getProjectedWorldPosition(t.position, e)
        }),
        e.onDragBegin(this.currentDragEvent))),
      (this.onDrag = (t, e, i) => {
        if (void 0 === this.currentDragEvent) return !1
        const { buttons: s } = this.currentDragEvent
        if (s !== MouseKeyCode.PRIMARY) return !1
        this.currentDragEvent.worldPosition = this.getProjectedWorldPosition(t.position, e)
        const n = e.onDrag(this.currentDragEvent)
        return this.engine.broadcast(new UpdateMeshTrimMessage()), this.updateScales(), n
      }),
      (this.onDragEnd = (t, e, i) => {
        if (void 0 === this.currentDragEvent) return !1
        const s = this.onDrag(t, e, i)
        return (this.currentDragEvent = void 0), this.engine.broadcast(new ValidateTrimMessage()), s
      }),
      (this.updateScales = () => {
        if (!this.attachedObject) return
        const t = this.attachedObject.getWorldScale(new Vector3()),
          e = 0.1 * Math.min(t.x, t.y, t.z),
          i = this.getWorldPosition(new Vector3()).project(this.camera),
          n = calculateDistanceToViewEdge(15, this.camera, this.cameraData.width, i.z),
          a = Math.max(n, e)
        for (const t of this.faces) f(t, this.attachedObject, a)
      }),
      (this.renderOrder = PickingPriorityType.gizmos)
    for (const t of H) {
      const e = new I(this, t)
      this.add(e), this.faces.push(e)
    }
    for (const t of F) {
      const e = new V(t)
      this.add(e), this.lines.push(e)
    }
    this.waitForRaycastData()
  }
  async waitForRaycastData() {
    this.raycasterData = await this.engine.market.waitForData(PointerData)
  }
  update() {
    if (!this.raycasterData) return
    const t = this.raycasterData.hits.find(t => t.object instanceof I)
    if (t) {
      const e = t.object
      ;(this.hoveredHandle = e), this.hoverHandle(this.hoveredHandle)
    } else this.hoveredHandle && (this.unhoverHandle(this.hoveredHandle), (this.hoveredHandle = void 0))
  }
  attachToObject(t) {
    ;(this.target = t), t.add(this), this.registerBindings(), this.updateScales()
  }
  detach() {
    var t
    this.unregisterBindings(), this.target && (null === (t = this.target) || void 0 === t || t.remove(this), (this.target = void 0))
  }
  get attachedObject() {
    return this.target
  }
  registerBindings() {
    const t = this.input
    this.bindings.length > 0
      ? this.bindings.forEach(t => t.renew())
      : this.bindings.push(
          t.registerMeshHandler(DraggerStartEvent, Comparator.isInstanceOf(I), this.onDragBegin),
          t.registerMeshHandler(DraggerMoveEvent, Comparator.isInstanceOf(I), this.onDrag),
          t.registerMeshHandler(DraggerStopEvent, Comparator.isInstanceOf(I), this.onDragEnd),
          t.registerMeshHandler(HoverMeshEvent, Comparator.isInstanceOf(I), this.onHover),
          t.registerMeshHandler(UnhoverMeshEvent, Comparator.isInstanceOf(I), this.onUnhover),
          this.cameraData.pose.onChanged(this.updateScales)
        )
  }
  unregisterBindings() {
    this.bindings.forEach(t => t.cancel())
  }
  hoverHandle(t) {
    t.onHover()
    const e = this.getMouseCursorForBoxFace(t)
    this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(e))
  }
  unhoverHandle(t) {
    t.onUnhover(), this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(null))
  }
  getProjectedWorldPosition(t, e) {
    const i = e || this.attachedObject,
      n = this.camera,
      a = i.getWorldPosition(new Vector3()).project(this.camera).z
    return new Vector3(t.x, t.y, a).unproject(n)
  }
  getMouseCursorForBoxFace(t) {
    const e = new Vector3(),
      i = new Quaternion()
    return t.getWorldQuaternion(i), e.copy(t.faceDirection), e.applyQuaternion(i), this.getMouseCursorForWorldDirection(e)
  }
  getMouseCursorForWorldDirection(t) {
    const e = new Vector3(),
      i = this.cameraData.pose
    e.copy(t).applyQuaternion(i.rotation)
    const n = N.map(t => t.direction.dot(e)),
      a = n.reduce((t, e) => Math.max(t, e), -2),
      o = n.indexOf(a)
    return N[o].cursor
  }
}
const U = 0.012125
class Threetransformcontrols {
  constructor(t, e, i, n, a, o, r, d) {
    ;(this.camera = e),
      (this.cameraData = n),
      (this.engine = o),
      (this.disableCamera = r),
      (this.enableCamera = d),
      (this.bindings = []),
      (this.controlModeObservable = new ObservableValue(w.g.Translate)),
      (this.mirrorOrthoToMainCam = () => {
        const t = this.cameraData.pose
        this.orthoCam.position.copy(t.position),
          this.orthoCam.quaternion.copy(t.rotation),
          this.orthoCam.projectionMatrix.copy(t.projection.asThreeMatrix4()),
          this.orthoCam.projectionMatrixInverse.copy(t.projection.asThreeMatrix4()),
          this.orthoCam.projectionMatrixInverse.invert(),
          this.orthoCam.updateMatrixWorld(!0),
          this.controls.camera === this.orthoCam && this.controls.setSize(U * this.cameraData.orthoZoom())
      }),
      (this.onDragStart = () => {
        this.disableCamera()
      }),
      (this.onDragEnd = () => {
        this.enableCamera(), this.engine.broadcast(new ValidateTrimMessage())
      }),
      (this.controls = new TransformControls(this.camera, i)),
      (this.controls.name = "ThreeTransformControls"),
      (this.controls.enabled = !0),
      (this.controls.space = "local"),
      this.controls.setSize(1),
      t.add(this.controls),
      (this.scaleGizmo = new W(a, e, n, o))
    const c = this.cameraData.pose
    this.orthoCam = new OrthographicCamera(
      -this.camera.fov * c.aspect(),
      this.camera.fov * c.aspect(),
      this.camera.fov,
      -this.camera.fov,
      this.camera.near,
      this.camera.far
    )
  }
  attachToObject(t) {
    this.controls.attach(t), this.scaleGizmo.attachToObject(t), (this.targetObject = t), this.updateGizmoVisibility(), this.registerBindings()
  }
  detach() {
    this.controls.detach(), this.scaleGizmo.detach(), this.unregisterBindings()
  }
  update() {
    this.dragging && this.getMode() !== w.g.Scale && this.engine.broadcast(new UpdateMeshTrimMessage()),
      this.getMode() === w.g.Scale && void 0 !== this.targetObject && this.scaleGizmo.update()
  }
  get dragging() {
    return this.controls.dragging
  }
  setMode(t) {
    ;(this.controls.mode = t), (this.controlModeObservable.value = t), this.updateGizmoVisibility()
  }
  getMode() {
    return this.controlModeObservable.value
  }
  onChanged(t) {
    return this.controlModeObservable.onChanged(t)
  }
  setOrthoMode() {
    ;(this.controls.camera = this.orthoCam), this.controls.setSize(U * this.cameraData.orthoZoom())
  }
  setPerspectiveMode() {
    ;(this.controls.camera = this.camera), this.controls.setSize(1)
  }
  registerBindings() {
    if (this.bindings.length > 0) this.bindings.forEach(t => t.renew())
    else {
      const t = {
        renew: () => this.controls.addEventListener("mouseUp", this.onDragEnd),
        cancel: () => this.controls.removeEventListener("mouseUp", this.onDragEnd)
      }
      t.renew()
      const e = {
        renew: () => this.controls.addEventListener("mouseDown", this.onDragStart),
        cancel: () => this.controls.removeEventListener("mouseDown", this.onDragStart)
      }
      e.renew(), this.bindings.push(this.cameraData.pose.onChanged(this.mirrorOrthoToMainCam), t, e)
    }
  }
  updateGizmoVisibility() {
    if (!this.targetObject) return this.controls.detach(), void this.scaleGizmo.detach()
    const t = this.getMode() === w.g.Scale
    t ? (this.controls.detach(), this.scaleGizmo.attachToObject(this.targetObject)) : (this.scaleGizmo.detach(), this.controls.attach(this.targetObject)),
      (this.controls.visible = !t),
      (this.scaleGizmo.visible = t)
  }
  unregisterBindings() {
    this.bindings.forEach(t => t.cancel())
  }
}
export default class TransformGizmoModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "transform_gizmo"),
      (this.activeBindings = []),
      (this.onTransformControlsCheck = () => this.gizmo.dragging),
      (this.attachGizmo = async t => {
        this.gizmo.attachToObject(t.target),
          this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand()),
          (this.canvasModule.element.style.touchAction = "none"),
          this.registerActiveBindings()
      }),
      (this.detachGizmo = async () => {
        this.unregisterActiveBindings(),
          this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand()),
          (this.canvasModule.element.style.touchAction = "unset"),
          this.gizmo.detach()
      }),
      (this.setGizmoMode = async t => {
        this.gizmo.setMode(t.mode)
      }),
      (this.onOrthoChange = t => {
        t ? this.gizmo.setOrthoMode() : this.gizmo.setPerspectiveMode()
      }),
      (this.onOrthoTransition = t => {
        this.group.visible = !t
      }),
      (this.onStartViewmodeChange = () => {
        this.group.visible = !1
      }),
      (this.onEndViewmodeChange = () => {
        this.group.visible = !0
      })
  }
  get gizmo() {
    return (
      this._gizmo ||
        ((this._gizmo = new Threetransformcontrols(
          this.group,
          this.renderer.getCamera(),
          this.canvasModule.element,
          this.cameraModule.cameraData,
          this.input,
          this.engine,
          () => {
            this.cameraDisableSub
              ? this.cameraDisableSub.renew()
              : (this.cameraDisableSub = this.cameraModule.cameraPoseProxy.newSession({ onAccessGranted() {}, onAccessRevoked() {} }))
          },
          () => {
            var t
            null === (t = this.cameraDisableSub) || void 0 === t || t.cancel(), (this.cameraDisableSub = null)
          }
        )),
        (this.canvasModule.element.style.touchAction = "unset")),
      this._gizmo
    )
  }
  async init(t, e) {
    ;(this.engine = e),
      (this.renderer = await this.engine.getModuleBySymbol(WebglRendererSymbol)),
      (this.input = await this.engine.getModuleBySymbol(InputSymbol)),
      (this.canvasModule = await this.engine.getModuleBySymbol(CanvasSymbol)),
      (this.cameraModule = await this.engine.getModuleBySymbol(CameraSymbol)),
      (this.group = new Group()),
      (this.group.name = "TransformGizmo"),
      this.renderer.getScene().add(this.group),
      this.bindings.push(
        this.engine.commandBinder.addBinding(SetGizmoControlModeCommand, this.setGizmoMode),
        this.engine.commandBinder.addBinding(AttachGizmoCommand, this.attachGizmo),
        this.engine.commandBinder.addBinding(DetachGizmoCommand, this.detachGizmo),
        this.cameraModule.cameraData.pose.isProjectionOrtho.onChanged(this.onOrthoChange),
        this.cameraModule.cameraData.pose.isPitchFactorTransitionActive.onChanged(this.onOrthoTransition),
        this.engine.subscribe(StartViewmodeChange, this.onStartViewmodeChange),
        this.engine.subscribe(EndSwitchViewmodeMessage, this.onEndViewmodeChange)
      )
  }
  onUpdate(t) {
    var e
    super.onUpdate(t), null === (e = this._gizmo) || void 0 === e || e.update()
  }
  registerActiveBindings() {
    this.activeBindings.length > 0
      ? this.activeBindings.forEach(t => t.renew())
      : this.activeBindings.push(
          this.input.registerMeshHandler(DraggerMoveEvent, Comparator.is(isVisibleShowcaseMesh), this.onTransformControlsCheck),
          this.input.registerMeshHandler(DraggerMoveEvent, Comparator.isType(SkySphereMesh), this.onTransformControlsCheck)
        )
  }
  unregisterActiveBindings() {
    this.activeBindings.forEach(t => t.cancel())
  }
}
