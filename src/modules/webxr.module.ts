import {
  ArrayCamera,
  Euler,
  EventDispatcher,
  Group,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  Ray,
  SphereGeometry,
  Vector2,
  Vector3
} from "three"
import { ShowcaseLineSegments } from "../webgl/line.segments"
import * as G from "../webgl/20043"
import * as h from "../math/2569"
import * as f from "../math/59370"
import * as k from "../webgl/87928"
import { HoverSweepCommand, SetEavPanoSizeCommand } from "../command/sweep.command"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { XrPresentCommand, XrPresentEndCommand } from "../command/xr.command"
import { PanoSizeKey } from "../const/76609"
import { CameraSymbol, CanvasSymbol, MeshQuerySymbol, RaycasterSymbol, WebglRendererSymbol, WebxrSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { RenderLayers } from "../core/layers"
import { Message } from "../core/message"
import { MessageBus } from "../core/messageBus"
import { Module } from "../core/module"
import { createSubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { CursorData } from "../data/cursor.data"
import { InteractionData } from "../data/interaction.data"
import { PointerData } from "../data/pointer.data"
import { PolicyData } from "../data/policy.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { LoadTexture } from "../utils/loadTexture"
import { ObservableValue } from "../observable/observable.value"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { isMobilePhone } from "../utils/browser.utils"
import { getVRPlatform, VRSessionSupported, XrBrowsers } from "../utils/vr.utils"
import { ColliderMesh } from "../webgl/sweepPuck.render"
import { DirectionVector } from "../webgl/vector.const"
import { makeLineMaterial } from "./lines.module"
import { getSweepByIntersection } from "../webgl/20043"
import { transformPoint } from "../math/59370"
import { copyRotationMatrixFromQuaternion, getPointOnRayForVR } from "../math/2569"
declare global {
  interface SymbolModule {
    [WebxrSymbol]: WebxrModule
  }
}
const v = new Vector3(0, -100, 0),
  w = new Vector2(-2, -2),
  y = new Vector3(-1, -1, -1),
  b = new Vector3(1, 1, 1)
class D {
  constructor(t) {
    ;(this.raycaster = t),
      (this.currentRay = new Ray()),
      (this.origin = v),
      (this.direction = new Vector3()),
      (this.pointerNdc = w),
      (this.cameraCache = { position: new Vector3(), quaternion: new Quaternion(), camera: void 0 }),
      (this.cast = t => {
        const e = this.currentRay,
          i = this.raycaster.cast(e.origin, e.direction, t).slice()
        return i.length && (this.lastHit = i[0]), i
      }),
      (this.update3D = (t, e, i) => {
        t instanceof Vector3 && this.origin.copy(t),
          e instanceof Vector3 && this.direction.copy(e),
          (this.cameraCache.camera = i),
          this.currentRay.set(this.origin, this.direction)
      }),
      (this.updateNDCPosition = () => {
        const t = this.lastHit
        if (this.cameraCache.camera && t && t.point) {
          const e = this.cameraCache.camera
          this.cameraCache.position.setFromMatrixPosition(e.matrixWorld), this.cameraCache.quaternion.setFromRotationMatrix(e.matrixWorld)
          const i = transformPoint(t.point, this.cameraCache.position, this.cameraCache.quaternion, e.projectionMatrix)
          i.clamp(y, b), this.pointerNdc.set(i.x, i.y)
        }
      }),
      (this.updatePointer = () => {})
  }
  get pointerRay() {
    return this.currentRay
  }
  get ndcPosition() {
    return this.updateNDCPosition(), this.pointerNdc
  }
}
class I extends Message {}
class P extends I {
  constructor(t) {
    super(), (this.trackedCamera = t)
  }
}
class T extends I {}
class M extends I {}

enum E {
  Mono = 0,
  SixDof = 2,
  Stereo = 1,
  __length = 3
}
const L = { controllers: Object.freeze([0, 1]), rotationDegrees: 25 }
enum A {
  thumbstickX = 2,
  thumbstickY = 3,
  touchpadX = 0,
  touchpadY = 1
}
const O = { x: 0, y: 0, z: 0, w: 1 }
class F extends MessageBus {
  constructor(t, e, i, n) {
    super(),
      (this.renderer = t),
      (this.webglScene = e),
      (this.cameraData = i),
      (this.cameraModule = n),
      (this.trackingStyle = E.Mono),
      (this.session = null),
      (this.rotations = {
        initialYawOffset: new Quaternion(),
        yawOffset: new Quaternion(),
        invYawOffset: new Quaternion(),
        trackingOffset: new Quaternion()
      }),
      (this.setTrackingStyle = (t, e = !0) => {
        t < E.__length && ((this.trackingStyle = t), e && this.resetInitialRotation())
      }),
      (this.offsetRotation = t => {
        this.rotations.invYawOffset.multiply(t), this.rotations.yawOffset.copy(this.rotations.invYawOffset).invert()
      }),
      (this.onPresentStart = t => {
        ;(t.cameras[0].layers.mask = RenderLayers.ALL.mask),
          (t.cameras[1].layers.mask = RenderLayers.ALL.mask),
          (t.cameras[0].far = t.far),
          (t.cameras[1].far = t.far),
          (t.layers.mask = RenderLayers.ALL.mask),
          this.resetInitialRotation(),
          this.broadcast(new T())
      }),
      (this.resetInitialRotation = () => {
        const t = this.cameraData.pose.rotation.clone()
        copyRotationMatrixFromQuaternion(t, this.rotations.initialYawOffset),
          this.rotations.yawOffset.copy(this.rotations.initialYawOffset),
          this.rotations.invYawOffset.copy(this.rotations.initialYawOffset).invert()
      }),
      (this.onPresentEnd = () => {
        this.broadcast(new M())
      }),
      (this.applyTrackingOverrides = (t, e, i) => {
        if (t.xr.isPresenting && i instanceof ArrayCamera) {
          t.clear()
          const e = i.cameras[0],
            s = i.cameras[1]
          ;(this.frame = this.renderer.xr.getFrame()), this.session || ((this.session = t.xr.getSession()), this.onPresentStart(i))
          const n = this.renderer.xr.getReferenceSpace()
          if (this.frame && this.session && n) {
            this.rotations.trackingOffset.copy(this.rotations.yawOffset).multiply(i.quaternion),
              this.cameraModule.updateCameraRotation(this.rotations.trackingOffset)
            const t = this.webglScene.camera.parent
            if (t) {
              const e = this.getReferenceSpace(this.frame, t, n)
              this.updateCameras(i, this.frame, e, t), this.updateControllers(this.session, this.frame, e, t)
            }
            switch (this.trackingStyle) {
              case E.Mono:
                s.matrixWorld.copy(e.matrixWorld), s.matrixWorldInverse.copy(s.matrixWorld), s.matrixWorldInverse.invert()
            }
            this.broadcast(new P(e))
          }
        } else this.session && ((this.session = null), this.onPresentEnd())
      }),
      (this.getReferenceSpace = (t, e, i) => {
        const s = t.getViewerPose(i),
          n = (null == s ? void 0 : s.views[0].transform.position) || O,
          o = this.trackingStyle === E.SixDof ? O : n,
          a = new XRRigidTransform({ x: o.x - e.position.x, y: o.y - e.position.y, z: o.z - e.position.z }),
          r = i.getOffsetReferenceSpace(a),
          h = this.rotations.invYawOffset,
          d = this.cameraData.pose.position,
          l = new XRRigidTransform({ x: d.x, y: d.y, z: d.z, w: 1 }, { x: h.x, y: h.y, z: h.z, w: h.w })
        return r.getOffsetReferenceSpace(l)
      }),
      (this.updateCameras = (t, e, i, s) => {
        const n = e.getViewerPose(i)
        if (n) {
          const e = n.views
          for (let i = 0; i < e.length; i++) {
            const n = e[i],
              o = t.cameras[i]
            o.matrix.fromArray(n.transform.matrix),
              o.projectionMatrix.fromArray(n.projectionMatrix),
              o.projectionMatrixInverse.copy(o.projectionMatrix),
              o.projectionMatrixInverse.invert(),
              o.matrixWorld.multiplyMatrices(s.matrixWorld, o.matrix),
              o.matrixWorldInverse.copy(o.matrixWorld),
              o.matrixWorldInverse.invert(),
              o.matrix.decompose(o.position, o.quaternion, o.scale),
              0 === i &&
                (t.matrix.copy(o.matrix),
                t.matrix.decompose(t.position, t.quaternion, t.scale),
                t.matrixWorld.copy(o.matrixWorld),
                t.matrixWorldInverse.copy(o.matrixWorldInverse),
                t.projectionMatrix.copy(o.projectionMatrix),
                t.projectionMatrixInverse.copy(o.projectionMatrixInverse))
          }
        }
      }),
      (this.updateControllers = (t, e, i, s) => {
        for (let n = 0; n < 2; n++) {
          const o = this.renderer.xr.getController(n),
            a = this.renderer.xr.getControllerGrip(n),
            r = t.inputSources[n]
          let h = null,
            d = null
          r &&
            (o &&
              ((h = e.getPose(r.targetRaySpace, i)),
              h &&
                (o.matrix.fromArray(h.transform.matrix),
                o.matrixWorld.multiplyMatrices(s.matrixWorld, o.matrix),
                o.matrix.decompose(o.position, o.quaternion, o.scale)),
              (o.visible = !!h)),
            a &&
              r.gripSpace &&
              ((d = e.getPose(r.gripSpace, i)),
              d &&
                (a.matrix.fromArray(d.transform.matrix),
                a.matrixWorld.multiplyMatrices(s.matrixWorld, a.matrix),
                a.children.forEach(t => {
                  t.updateMatrixWorld()
                }),
                a.matrix.decompose(a.position, a.quaternion, a.scale)))),
            a && (a.visible = !!d)
        }
      }),
      (this.webglScene.scene.onBeforeRender = this.applyTrackingOverrides)
  }
}
import $ from "../images/selected_sweep_glow.png"
import { PlaneMesh } from "../webgl/87928"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory"

class q {
  constructor(t) {
    ;(this.meshQuery = t),
      (this.active = !1),
      (this.target = new ObservableValue(null)),
      (this.previousSweep = null),
      (this.activate = () => {
        this.active || (this.updateLoopSub.renew(), this.selectionChangeSub.renew(), this.ray.toggle(!0), this.targetDecoration.toggle(!0), (this.active = !0))
      }),
      (this.deactivate = () => {
        this.active &&
          ((this.target.value = null),
          this.selectionChangeSub.cancel(),
          this.updateLoopSub.cancel(),
          this.ray.toggle(!1),
          this.targetDecoration.toggle(!1),
          (this.active = !1))
      }),
      (this.getTargetSweep = (t, e, i) => {
        let s = null
        if (e.object instanceof ColliderMesh) return (s = t.getSweep(e.object.userData.sid)), s
        const n = getSweepByIntersection(t, !0, e.intersection, this.meshQuery)
        return (s = n.length > 0 ? n[0].sweep : null), s
      })
  }
  get container() {
    return this._container
  }
  async init(t) {
    ;(this.engine = t),
      (this._container = new Group()),
      (this._container.name = "XRNavigationVisuals"),
      (this.ray = new Y(this.container)),
      (this.targetDecoration = new Destination(this.container))
    const e = await this.engine.market.waitForData(PointerData)
    return (
      (this.updateLoopSub = e.onChanged(() => this.update(e))),
      this.updateLoopSub.cancel(),
      (this.selectionChangeSub = this.target.onChanged(t => {
        null !== this.previousSweep && this.engine.commandBinder.issueCommand(new HoverSweepCommand(this.previousSweep.id, !1, 200)),
          null !== t &&
            (this.engine.commandBinder.issueCommand(new HoverSweepCommand(t.id, !0, 200)), this.targetDecoration.updateTargetPosition(t.floorPosition)),
          (this.previousSweep = t)
      })),
      this.selectionChangeSub.cancel(),
      this
    )
  }
  update(t) {
    const e = this.engine.market.tryGetData(SweepsData),
      i = this.engine.market.tryGetData(CameraData),
      s = this.engine.market.tryGetData(ViewmodeData),
      n = this.engine.market.tryGetData(CursorData),
      o = this.engine.market.tryGetData(InteractionData)
    if (!(e && i && s && o && n)) return
    if (!o.isVR()) return
    if (!s.isInside()) return
    const { hit: a, pointerDirection: r, pointerOrigin: h } = t
    if (!a) return
    const d = this.getTargetSweep(e, a, r)
    ;(this.target.value = d), this.ray.update(h, a.point, n.opacity.value), this.targetDecoration.update(i.pose.rotation, n.opacity.value)
  }
}
class Y {
  constructor(t) {
    ;(this.container = t),
      (this.styles = {
        ray: { color: "white", transparent: !0, opacity: 0.3, linewidth: 2, depthWrite: !1 },
        hit: { color: "white", transparent: !0, opacity: 0.3 },
        hitScale: 0.02
      }),
      (this.update = (t, e, i) => {
        this.ray.updatePositions(t, e).opacity(Math.min(i, this.styles.ray.opacity)),
          this.hitMarker.position.copy(e),
          (this.hitMarker.material.opacity = Math.min(i, this.styles.hit.opacity))
      }),
      (this.toggle = t => {
        t
          ? (this.container.add(...this.ray.children), this.container.add(this.hitMarker))
          : (this.container.remove(...this.ray.children), this.container.remove(this.hitMarker))
      })
    const { ray: e, hit: i } = this.styles,
      n = makeLineMaterial(e.color, !1, e)
    ;(this.ray = new ShowcaseLineSegments(new Vector3(), new Vector3(), n, {})),
      this.ray.updateResolution(window.innerWidth, window.innerHeight),
      (this.hitMarker = new PlaneMesh(new SphereGeometry(this.styles.hitScale), new MeshBasicMaterial(i))),
      (this.hitMarker.name = "hit")
  }
}
class Destination {
  constructor(t) {
    ;(this.container = t),
      (this.styles = {
        scale: 0.46,
        animationSpeed: 1,
        plane: { color: "white", transparent: !0, opacity: 0.6, depthWrite: !1, depthTest: !1, map: LoadTexture($) }
      }),
      (this.position = new Vector3()),
      (this.quaternion = new Quaternion()),
      (this.updateTargetPosition = t => {
        this.position.copy(getPointOnRayForVR(t, DirectionVector.UP, 0.05))
      }),
      (this.update = (t, e) => {
        const i = copyRotationMatrixFromQuaternion(t, this.quaternion)
        this.target.quaternion.copy(i),
          this.target.position.lerp(this.position, this.styles.animationSpeed),
          (this.target.material.opacity = Math.min(e, this.styles.plane.opacity))
      }),
      (this.toggle = t => {
        t ? this.container.add(this.target) : this.container.remove(this.target)
      })
    const e = new PlaneGeometry(1),
      i = new Matrix4()
    i.makeRotationFromEuler(new Euler(-Math.PI / 2, 0, 0, "XYZ")),
      e.applyMatrix4(i),
      (this.target = new PlaneMesh(e, new MeshBasicMaterial(this.styles.plane))),
      (this.target.name = "Destination"),
      this.target.scale.set(this.styles.scale, this.styles.scale, this.styles.scale)
  }
}
class X {
  constructor(t) {
    ;(this.controllers = t), (this._lastInputWas = 0)
  }
  focus(t) {
    t !== this._lastInputWas &&
      (L.controllers.forEach(e => {
        this.controllers.controller(e).grip.visible = e !== t
      }),
      (this._lastInputWas = t))
  }
}
class XRControllerMesh {
  constructor(t) {
    ;(this.renderer = t),
      (this._defaultController = 0),
      (this.controllerGroups = []),
      (this.bindings = []),
      (this.cancel = () => {
        this.bindings.forEach(t => t.cancel()), (this.bindings.length = 0)
      }),
      (this.container = new Group()),
      (this.container.name = "XRControllerMesh"),
      L.controllers.forEach(t => {
        const e = this.createControllerGroup(t)
        this.controllerGroups.push(e), this.container.add(e.grip, e.pointer)
      }),
      this.connectControllerModel(),
      (this.container.matrixAutoUpdate = !1)
  }
  controller(t = this._defaultController) {
    return this.controllerGroups[t]
  }
  setDefault(t) {
    this._defaultController = t
  }
  async connectControllerModel() {
    const t = new XRControllerModelFactory()
    L.controllers.forEach(e => {
      const i = this.controller(e).grip
      i.add(t.createControllerModel(i))
    })
  }
  createControllerGroup(t) {
    const e = this.renderer.xr.getController(t)
    e.name = `Controller Ray ${t}`
    const i = this.renderer.xr.getControllerGrip(t)
    ;(i.name = `Controller Grip ${t}`), (i.visible = !1)
    const s = { index: t, pointer: e, grip: i, connected: !1, hand: "none" },
      n = t => {
        ;(s.hand = t.data.handedness), (s.connected = !0)
      },
      o = () => {
        ;(s.hand = "none"), (s.connected = !1)
      }
    return (
      this.bindings.push(
        createSubscription(
          () => e.addEventListener("connected", n),
          () => e.removeEventListener("connected", n)
        ),
        createSubscription(
          () => e.addEventListener("disconnected", o),
          () => e.removeEventListener("disconnected", o)
        )
      ),
      s
    )
  }
}
const J = new DebugInfo("xr-input-forwarding")
class tt {
  constructor(t) {
    ;(this.options = t),
      (this.dispatchPointerDown = t => {
        this.forwardEvent("pointerdown", this.mockPointerEventInit(t))
      }),
      (this.dispatchPointerUp = t => {
        this.forwardEvent("pointerup", this.mockPointerEventInit(t))
      }),
      (this.target = t.forwardToElement)
  }
  dispatchPointerMove(t) {
    this.forwardEvent("pointermove", this.mockPointerEventInit(t))
  }
  mockPointerEventInit(t) {
    let e = 0,
      i = 0
    if (this.options.getPointerScreenPosition) {
      const t = this.options.getPointerScreenPosition()
      ;(e = t.x), (i = t.y)
    }
    return { pointerType: "gamepad", pointerId: t, clientX: e, clientY: i }
  }
  forwardEvent(t, e) {
    let i
    try {
      ;(i = window.PointerEvent ? new PointerEvent(t, e) : new MouseEvent(t, e)), i && this.target.dispatchEvent(i)
    } catch (t) {
      J.error(t)
    }
  }
}
class et extends EventDispatcher {
  constructor(t, e) {
    super(),
      (this.renderer = t),
      (this.options = { forwardNativeXrEvents: !0, dispatchToControllerGroup: !1, axisMoveTriggerThreshold: 0.5 }),
      (this.previousGamepad = new Map()),
      (this.forwardedEvents = ["selectstart", "select", "selectend", "squeeze", "squeezestart", "squeezeend"]),
      (this.active = !1),
      (this.renew = () => {
        !this.active && this.options.forwardNativeXrEvents && (this.addSessionListeners(), (this.active = !0))
      }),
      (this.cancel = () => {
        this.active && this.options.forwardNativeXrEvents && (this.removeSessionListeners(), (this.active = !1))
      }),
      (this.updateFromGamepads = () => {
        if (!this.active) return
        const t = this.renderer.xr.getSession()
        if (t)
          for (const e of L.controllers) {
            const i = t.inputSources[e]
            if (!i || !i.gamepad) continue
            const s = this.renderer.xr.getController(e),
              n = this.previousGamepad.get(i),
              o = { buttons: i.gamepad.buttons.map(t => t.value), axes: new Float32Array(i.gamepad.axes.slice()) },
              a = { controllerIndex: e, inputSource: i, axes: o.axes }
            n &&
              (o.buttons.forEach((t, e) => {
                t !== n.buttons[e] &&
                  (1 === t
                    ? this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "buttondown", value: t, index: e, target: s }))
                    : 0 === t && this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "buttonup", value: t, index: e, target: s })))
              }),
              o.axes.forEach((t, e) => {
                const i = n.axes[e]
                if (t !== i) {
                  this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "axesmove", value: t, index: e, target: s })),
                    0 === i && this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "axesmovestart", value: t, index: e, target: s }))
                  const n = this.options.axisMoveTriggerThreshold
                  Math.abs(i) < n &&
                    Math.abs(t) > n &&
                    this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "axestriggered", value: t, index: e, target: s })),
                    0 === t && this.sendGamepadEvent(s, Object.assign(Object.assign({}, a), { type: "axesmoveend", value: t, index: e, target: s }))
                }
              })),
              this.previousGamepad.set(i, o)
          }
      }),
      (this.onGamepadEvent = (t, e) =>
        createSubscription(
          () => super.addEventListener(t, e),
          () => super.removeEventListener(t, e)
        )),
      (this.onSessionEvent = (t, e) =>
        createSubscription(
          () => super.addEventListener(t, e),
          () => super.removeEventListener(t, e)
        )),
      (this.sendGamepadEvent = (t, e) => {
        this.dispatchEvent(e), this.options.dispatchToControllerGroup && t.dispatchEvent(e)
      }),
      (this.sendSessionEvent = (t, e) => {
        this.dispatchEvent({ type: t, controllerIndex: e })
      }),
      (this.addSessionListeners = () => {
        L.controllers.forEach(t => {
          const e = this.renderer.xr.getController(t)
          for (const i of this.forwardedEvents) e.addEventListener(i, e => this.sendSessionEvent(e.type, t))
        })
      }),
      (this.removeSessionListeners = () => {
        L.controllers.forEach(t => {
          const e = this.renderer.xr.getController(t)
          for (const i of this.forwardedEvents) e.removeEventListener(i, e => this.sendSessionEvent(e.type, t))
        })
      }),
      e && (this.options = Object.assign(Object.assign({}, this.options), e)),
      this.renew()
  }
}
const at = new Quaternion().setFromAxisAngle(DirectionVector.UP, MathUtils.DEG2RAD * L.rotationDegrees),
  rt = new Quaternion().setFromAxisAngle(DirectionVector.UP, MathUtils.DEG2RAD * -L.rotationDegrees)
export default class WebxrModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "webxr"),
      (this.framebufferScaledTo = 1),
      (this.framebufferScale = 0),
      (this.ray = { forward: new Vector3(), origin: new Vector3() }),
      (this.onXrPresentBegin = () => {
        const t = this.renderer.xr.getSession()
        t &&
          (this.log.info(`Session framebuffer: ${t.renderState.baseLayer}`),
          this.engine.commandBinder.issueCommand(new SetEavPanoSizeCommand(PanoSizeKey.HIGH)),
          this.viewmodeData.isInside() || this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE)),
          (this.xrPointer = new D(this.raycaster.picking)),
          this.raycaster.setOverridePointer(this.xrPointer),
          this.xrNavVisuals.activate())
      }),
      (this.onXrPresentEnd = () => {
        this.engine.commandBinder.issueCommand(new SetEavPanoSizeCommand(null)),
          this.xrNavVisuals.deactivate(),
          this.raycaster.setOverridePointer(null),
          this.cameraModule.updateCameraRotation(copyRotationMatrixFromQuaternion(this.cameraData.pose.rotation, new Quaternion())),
          this.webglScene.setCameraDirty()
      }),
      (this.onXrTrackingApplied = t => {
        const e = this.controllerMesh.controller()
        if (e.connected) {
          const i = this.ray.forward.copy(DirectionVector.FORWARD).applyQuaternion(e.pointer.quaternion),
            s = this.ray.origin.setFromMatrixPosition(e.pointer.matrixWorld)
          this.xrPointer.update3D(s, i, t.trackedCamera), this.xrPointerInput.dispatchPointerMove(e.index)
        }
        this.xrGamepadInput.updateFromGamepads()
      }),
      (this.tryEndSession = async () => {
        var t
        await (null === (t = this.activeXrSession) || void 0 === t ? void 0 : t.end()), (this.activeXrSession = void 0)
      }),
      (this.requestSession = async (t, e) => {
        var i
        if ((await getVRPlatform(this.config.xrBrowsersUnlocked)) !== XrBrowsers.webxr) return null
        if (this.renderer.xr.isPresenting) return this.renderer.xr.getSession()
        if (VRSessionSupported.apiExists()) {
          const s = await (null === (i = navigator.xr) || void 0 === i ? void 0 : i.requestSession(t, { optionalFeatures: e }))
          if (!s) return null
          this.activeXrSession = s
          const n = XRWebGLLayer.getNativeFramebufferScaleFactor(s)
          return (
            (this.framebufferScaledTo = this.framebufferScale * (n - 1) + 1),
            this.log.info("Scaling framebuffer by:", this.framebufferScaledTo, "native size:", n, " * factor:", this.framebufferScale),
            0 !== this.framebufferScale && this.renderer.xr.setFramebufferScaleFactor(this.framebufferScaledTo),
            this.renderer.xr.setSession(s),
            s
          )
        }
        return null
      })
  }
  async init(t, e) {
    ;(this.config = t), (this.engine = e)
    const [i, s] = await Promise.all([e.getModuleBySymbol(WebglRendererSymbol), e.getModuleBySymbol(MeshQuerySymbol)])
    ;(this.renderer = i.threeRenderer),
      (this.webglScene = i.getScene()),
      this.bindings.push(
        e.commandBinder.addBinding(XrPresentCommand, t => this.requestSession(t.type, t.features)),
        e.commandBinder.addBinding(XrPresentEndCommand, () => this.tryEndSession())
      )
    if ((await getVRPlatform(t.xrBrowsersUnlocked)) !== XrBrowsers.webxr) return
    ;([this.canvasModule, this.cameraModule, this.raycaster] = await Promise.all([
      e.getModuleBySymbol(CanvasSymbol),
      e.getModuleBySymbol(CameraSymbol),
      e.getModuleBySymbol(RaycasterSymbol)
    ])),
      ([this.cameraData, this.raycasterData, this.viewmodeData, this.policyData] = await Promise.all([
        e.market.waitForData(CameraData),
        e.market.waitForData(PointerData),
        e.market.waitForData(ViewmodeData),
        e.market.waitForData(PolicyData)
      ])),
      this.renderer.xr.setReferenceSpaceType("local"),
      (this.framebufferScale =
        this.config.framebufferScaling ||
        (function (t) {
          const e = isMobilePhone()
          return !e ||
            (e &&
              (function (t) {
                return /Adreno \(TM\) (540|[6-9]\d\d)/.test(t.renderer)
              })(t))
            ? 1
            : 0
        })(i.gpuInfo))
    const n = new F(this.renderer, this.webglScene, this.cameraData, this.cameraModule)
    n.setTrackingStyle(t.tracking),
      this.bindings.push(n.subscribe(T, this.onXrPresentBegin), n.subscribe(M, this.onXrPresentEnd), n.subscribe(P, this.onXrTrackingApplied)),
      (this.controllerMesh = new XRControllerMesh(this.renderer)),
      this.webglScene.add(this.controllerMesh.container)
    const r = new X(this.controllerMesh),
      h = t.enableEventPositions ? () => this.raycasterData.pointerScreenPosition : void 0
    ;(this.xrPointerInput = new tt({ forwardToElement: this.canvasModule.element, getPointerScreenPosition: h })), (this.xrGamepadInput = new et(this.renderer))
    const d = [
      this.xrGamepadInput.onGamepadEvent("axestriggered", t => {
        if (t.index === A.thumbstickX || t.index === A.touchpadX) {
          this.log.debug(`${t.inputSource.handedness} ${A[t.index]} axis.value over threshold, do the rotate!`)
          Math.sign(t.value) > 0 ? n.offsetRotation(at) : n.offsetRotation(rt)
        }
        r.focus(t.controllerIndex), this.controllerMesh.setDefault(t.controllerIndex)
      }),
      this.xrGamepadInput.onSessionEvent("selectstart", t => {
        this.xrPointerInput.dispatchPointerDown(t.controllerIndex), r.focus(t.controllerIndex), this.controllerMesh.setDefault(t.controllerIndex)
      }),
      this.xrGamepadInput.onSessionEvent("selectend", t => {
        this.xrPointerInput.dispatchPointerUp(t.controllerIndex), r.focus(t.controllerIndex), this.controllerMesh.setDefault(t.controllerIndex)
      }),
      this.xrGamepadInput.onSessionEvent("squeezestart", t => {
        r.focus(t.controllerIndex), this.controllerMesh.setDefault(t.controllerIndex)
      })
    ]
    this.policyData.hasPolicy("spaces.sdk.qa") &&
      d.push(
        this.xrGamepadInput.onGamepadEvent("buttondown", e => {
          4 === e.index
            ? ((t.tracking = (t.tracking + 1) % E.__length), n.setTrackingStyle(t.tracking, !1))
            : 5 === e.index && ((t.tracking = (E.__length + t.tracking - 1) % E.__length), n.setTrackingStyle(t.tracking, !1)),
            r.focus(e.controllerIndex),
            this.controllerMesh.setDefault(e.controllerIndex)
        })
      )
    const u = new AggregateSubscription(...d)
    this.bindings.push(u, this.xrGamepadInput), (this.xrNavVisuals = new q(s)), this.xrNavVisuals.init(e), this.webglScene.add(this.xrNavVisuals.container)
  }
}
