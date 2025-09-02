import { Box3, MathUtils, Plane, Quaternion, Ray, Vector2, Vector3 } from "three"
import { CheckThreshold } from "../utils/49827"
import { getPostDirections } from "../math/59370"
import * as y from "../const/21646"
import * as b from "../const/61282"
import { TransitionTypeList } from "../const/64918"
import { PoseControllerObservable } from "./pose.control.observable"
import { OpenDeferred } from "../core/deferred"
import Engine from "../core/engine"
import { createSubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { DollhouseControlData } from "../data/dollhouse.control.data"
import { StopAndClearStateMessage } from "../message/dollhouse.message"
import CameraDataModule from "../modules/cameraData.module"
import { isMobilePhone } from "../utils/browser.utils"
import { CameraRigConfig } from "../utils/camera.utils"
import { Pose } from "../webgl/pose"
import { DirectionVector } from "../webgl/vector.const"
export enum ControlState {
  NONE = 0,
  ROTATE = 1,
  PAN = 2,
  ZOOM = 3
}

export enum ActiveDevice {
  NONE = 0,
  MOUSE = 1,
  KEYBOARD = 2,
  TOUCH = 3
}
enum GestureType {
  GRAB = "grab",
  NONE = "none",
  SPIN = "spin"
}
const I = y.Z.epsilon
const R = b.pj
const V = 0.15 * Math.PI
class TouchControls {
  poseProxy: CameraData
  poseConstrainer: PoseConstrainer
  getRayPoint: (e?, t?) => Vector3
  getFocusPoint: () => Vector3
  invalidateParentOrbitCache: () => void
  movingCamera: boolean
  smoothedTouch0: Vector2
  smoothedTouch1: Vector2
  origTouchAxis: Vector2
  origCenterPt: Vector2
  intersectionPt: Vector3
  plane: Plane
  focusPlane: Plane
  initialPose: Pose
  maxScale: number
  minScale: number
  originalPinchLength: number
  pointersMoved: (e?) => void
  initMove: (e?) => void
  castFrom: (x, y, g) => void
  poseController: CameraDataModule | undefined

  constructor(e, t, i, s, o, n) {
    this.poseProxy = e
    this.poseConstrainer = t
    this.getRayPoint = i
    this.getFocusPoint = s
    this.invalidateParentOrbitCache = o
    this.movingCamera = !1
    this.smoothedTouch0 = new Vector2()
    this.smoothedTouch1 = new Vector2()
    this.origTouchAxis = new Vector2()
    this.origCenterPt = new Vector2()
    this.plane = new Plane(DirectionVector.UP.clone(), 0)
    this.focusPlane = new Plane(DirectionVector.UP.clone(), 0)
    this.maxScale = 1
    this.minScale = 1
    this.originalPinchLength = 0
    this.pointersMoved = (() => {
      const e = new Vector2(),
        t = new Vector3(),
        i = new Vector3(),
        s = new Vector2(),
        o = new Pose(1),
        n = new Ray(),
        a = new Vector3()
      return h => {
        if (!this.poseController || !this.movingCamera) return
        o.copy(this.poseProxy.pose)
        this.smoothedTouch0.lerp(h[0].position, 0.2)
        this.smoothedTouch1.lerp(h[1].position, 0.2)
        s.copy(this.smoothedTouch1).sub(this.smoothedTouch0).normalize()
        const l = this.origTouchAxis.angle() - s.angle()
        t.copy(this.initialPose.fovCorrectedPosition())
        const d = new Vector3(-this.intersectionPt.x, 0, -this.intersectionPt.z)
        t.add(d), t.applyAxisAngle(DirectionVector.UP, l), d.negate(), t.add(d)
        const c = new Quaternion().copy(this.initialPose.rotation),
          u = new Quaternion().setFromAxisAngle(DirectionVector.UP, l)
        c.premultiply(u)
        const p = this.smoothedTouch0.clone().lerp(this.smoothedTouch1, 0.5),
          g = new Vector3()
        if ((i.copy(DirectionVector.FORWARD).applyQuaternion(c), this.castFrom(p.x, p.y, g), isNaN(g.x))) return void (this.movingCamera = !1)
        g.sub(this.intersectionPt), g.negate(), g.applyAxisAngle(DirectionVector.UP, l)
        const y = e.subVectors(this.smoothedTouch0, this.smoothedTouch1).length() / this.originalPinchLength,
          f = 1 - 1 / CheckThreshold(y, this.minScale, this.maxScale),
          w = t.add(g).lerp(this.intersectionPt, f).clone()
        if ((n.set(w, i), n.intersectPlane(this.focusPlane, a))) {
          const e = a.distanceTo(w)
          o.position.copy(w)
          o.rotation.copy(c)
          o.focalDistance = e
          o.resetProjMatrix()
          o.applyPhiBasedFovSquish()
          this.poseConstrainer.constrain(o)
          this.poseController.updateCameraPose(o)
          this.invalidateParentOrbitCache()
        }
      }
    })()
    this.initMove = (() => {
      const e = new Vector2(),
        t = new Ray()
      return i => {
        const s = i[0].position,
          o = i[1].position
        this.smoothedTouch0.copy(s)
        this.smoothedTouch1.copy(o)
        this.originalPinchLength = e.subVectors(s, o).length()
        this.origTouchAxis.copy(o).sub(s).normalize()
        this.origCenterPt.copy(s).lerp(o, 0.5)
        const { pose: n } = this.poseProxy
        this.initialPose = n.clone()
        const a = new Vector3(),
          h = new Vector3()
        getPostDirections(this.initialPose, a.set(this.origCenterPt.x, this.origCenterPt.y, -1), a)
        getPostDirections(this.initialPose, h.set(this.origCenterPt.x, this.origCenterPt.y, 1), h)
        h.sub(a).normalize()
        t.set(a, h)
        this.intersectionPt = this.getRayPoint(t)
        const l = this.getFocusPoint()
        n.focalDistance = n.position.distanceTo(l)
        this.initialPose.focalDistance = n.position.distanceTo(l)
        this.maxScale = this.initialPose.fovCorrectedFocalDistance() / this.poseConstrainer.minZoomDistance
        this.minScale = this.initialPose.fovCorrectedFocalDistance() / this.poseConstrainer.maxZoomDistance
        this.poseConstrainer.setStartPose(this.initialPose)
        const d = n.phi() < b.N2 ? n.forward().clone().multiplyScalar(-1) : DirectionVector.UP
        this.plane.setFromNormalAndCoplanarPoint(d, this.intersectionPt)
        this.focusPlane.setFromNormalAndCoplanarPoint(d, l)
      }
    })()
    this.castFrom = (() => {
      const e = new Ray(),
        t = new Vector3(),
        i = new Vector3()
      return (s, o, r) => {
        getPostDirections(this.initialPose, t.set(s, o, -1), t),
          getPostDirections(this.initialPose, i.set(s, o, 1), i),
          i.sub(t).normalize(),
          e.set(t, i),
          (e.intersectPlane(this.plane, r) && !r.equals(t)) || (r.x = NaN)
      }
    })()
    n.onGrabStart(e => {
      this.movingCamera = !0
      this.initMove(e.pointers)
    })
    n.onGrabEnd(() => {
      this.movingCamera = !1
    })
  }

  isMovingCamera() {
    return this.movingCamera
  }

  rawPointerUpdate(e) {
    this.pointersMoved(e.pointers)
  }

  setController(e) {
    e ? (this.poseController = e) : ((this.poseController = void 0), (this.movingCamera = !1))
  }
}
export class PoseConstrainer {
  idealOrbitCenter: Vector3
  gestureStartPose: Pose
  maxDeviationOfOrbitPoint: Box3
  modelBoundingBox: Box3
  minOrbitDistance: number
  maxOrbitDistance: number
  modelSize: number
  constrain: (e) => void

  constructor(e) {
    this.idealOrbitCenter = new Vector3()
    this.gestureStartPose = new Pose(1)
    this.constrain = (() => {
      const e = new Vector3(),
        t = new Vector3(),
        i = new Vector3(),
        s = new Vector3(),
        o = new Ray(),
        n = new Plane()
      return a => {
        const h = this.gestureStartPose.focalPoint(),
          l = a.focalPoint()
        if (l.distanceTo(h) < 1e-10) return
        const d = i.subVectors(a.position, this.gestureStartPose.position)
        o.set(this.gestureStartPose.position, d)
        const c = this.maxDeviationOfOrbitPoint.clampPoint(l, e),
          u = a.fovDistanceScale(),
          m = this.minOrbitDistance * u,
          p = this.maxOrbitDistance * u,
          g = CheckThreshold(a.focalDistance, m, p),
          y = t.copy(c).addScaledVector(a.forward(), -1 * g)
        Math.abs(d.y) > 1e-8 && (n.setFromNormalAndCoplanarPoint(DirectionVector.UP, y), o.intersectPlane(n, s) && y.copy(s))
        a.focalDistance = g
        a.position.copy(y)
        a.commit()
      }
    })()
    this.updateConstraints(e)
  }

  updateConstraints(e) {
    const t = e.getSize(new Vector3())
    this.modelSize = Math.max(t.length(), 1)
    this.modelBoundingBox = e
    this.idealOrbitCenter = e.getCenter(this.idealOrbitCenter)
    const i = e.max.distanceTo(this.idealOrbitCenter)
    this.minOrbitDistance = 2
    const s = 2 * i
    this.maxOrbitDistance = s / Math.tan((CameraRigConfig.fov / 2) * MathUtils.DEG2RAD)
    const o = 2 * i
    this.maxDeviationOfOrbitPoint = new Box3(this.idealOrbitCenter.clone().add(new Vector3(-o, 0, -o)), this.idealOrbitCenter.clone().add(new Vector3(o, 0, o)))
    this.maxDeviationOfOrbitPoint.min.y = this.modelBoundingBox.min.y
    this.maxDeviationOfOrbitPoint.max.y = this.modelBoundingBox.max.y
  }

  get minZoomDistance() {
    return this.minOrbitDistance
  }

  get maxZoomDistance() {
    return this.maxOrbitDistance
  }

  setStartPose(e) {
    this.gestureStartPose.copy(e)
  }

  containsPoint(e) {
    return this.maxDeviationOfOrbitPoint.containsPoint(e)
  }
}
class TouchGestureRecognizer {
  t1: Vector2
  t2: Vector2
  initT1: Vector2
  initT2: Vector2
  deltaT1: Vector2
  deltaT2: Vector2
  currPos: Vector2
  twoFingerEventCt: number
  contiguousGrabEventCt: number
  currGesture: string
  grabStartObservers: Set<any>
  grabEndObservers: Set<any>
  spinStartObservers: Set<any>
  spinEndObservers: Set<any>
  gesturePointerIds: any[]
  gestureStartPointers: any

  constructor() {
    this.t1 = new Vector2()
    this.t2 = new Vector2()
    this.initT1 = new Vector2()
    this.initT2 = new Vector2()
    this.deltaT1 = new Vector2()
    this.deltaT2 = new Vector2()
    this.twoFingerEventCt = 0
    this.currGesture = GestureType.NONE
    this.contiguousGrabEventCt = 0
    this.grabStartObservers = new Set()
    this.grabEndObservers = new Set()
    this.spinStartObservers = new Set()
    this.spinEndObservers = new Set()
    this.gesturePointerIds = [null, null]
    this.currPos = new Vector2()
  }

  rawPointerUpdate(e) {
    if (e.pointers.length >= 2) {
      0 === this.twoFingerEventCt
        ? (this.t1.copy(e.pointers[0].clientPosition),
          this.t2.copy(e.pointers[1].clientPosition),
          this.initT1.copy(e.pointers[0].clientPosition),
          this.initT2.copy(e.pointers[1].clientPosition),
          (this.gestureStartPointers = e),
          (this.gesturePointerIds[0] = e.pointers[0].id),
          (this.gesturePointerIds[1] = e.pointers[1].id),
          this.setCurrGesureAndNotifyObservers(GestureType.NONE))
        : (this.t1.lerp(e.pointers[0].clientPosition, 0.2),
          this.t2.lerp(e.pointers[1].clientPosition, 0.2),
          (this.currGesture === GestureType.NONE || (this.currGesture === GestureType.GRAB && this.contiguousGrabEventCt < 30)) &&
            this.setCurrGesureAndNotifyObservers(this.nextGesture()))
      const t = (e.pointers[0].position.x + e.pointers[1].position.x) / 2,
        i = (e.pointers[0].position.y + e.pointers[1].position.y) / 2
      this.currPos.set(t, i), this.twoFingerEventCt++
    } else {
      this.twoFingerEventCt = 0
    }
    this.setCurrGesureAndNotifyObservers(GestureType.NONE)
    this.currGesture === GestureType.GRAB && this.contiguousGrabEventCt++
  }

  onGrabStart(e) {
    return createSubscription(
      () => this.grabStartObservers.add(e),
      () => this.grabStartObservers.delete(e),
      !0
    )
  }

  onGrabEnd(e) {
    return createSubscription(
      () => this.grabEndObservers.add(e),
      () => this.grabEndObservers.delete(e),
      !0
    )
  }

  onSpinStart(e) {
    return createSubscription(
      () => this.spinStartObservers.add(e),
      () => this.spinStartObservers.delete(e),
      !0
    )
  }

  onSpinEnd(e) {
    return createSubscription(
      () => this.spinEndObservers.add(e),
      () => this.spinEndObservers.delete(e),
      !0
    )
  }

  setCurrGesureAndNotifyObservers(e) {
    const t = this.currGesture
    if (((this.currGesture = e), t === GestureType.NONE))
      e === GestureType.GRAB ? this.notifyGrabStartObservers() : e === GestureType.SPIN && this.notifySpinStartObservers()
    else if (t === GestureType.GRAB)
      e === GestureType.SPIN ? (this.notifyGrabEndObservers(), this.notifySpinStartObservers()) : e === GestureType.NONE && this.notifyGrabEndObservers()
    else if (t === GestureType.SPIN)
      if (e === GestureType.NONE) this.notifySpinEndObservers()
      else if (e === GestureType.GRAB) throw new Error("Gesture recognizer should never switch from SPIN -> GRAB")
  }

  notifyGrabStartObservers() {
    for (const e of this.grabStartObservers) e(this.gestureStartPointers)
  }

  notifySpinStartObservers() {
    for (const e of this.spinStartObservers) e(this.gestureStartPointers)
  }

  notifyGrabEndObservers() {
    this.contiguousGrabEventCt = 0
    for (const e of this.grabEndObservers) e()
  }

  notifySpinEndObservers() {
    for (const e of this.spinEndObservers) e()
  }

  nextGesture() {
    if (this.twoFingerEventCt > 5) {
      const e = this.t1.y - this.initT1.y,
        t = this.t2.y - this.initT2.y,
        i = this.t1.x - this.initT1.x,
        s = this.t2.x - this.initT2.x
      this.deltaT1.set(i, e)
      this.deltaT2.set(s, t)
      const o = this.deltaT1.length(),
        r = this.deltaT2.length(),
        n = Math.min(o, r) / Math.max(o, r) > 0.7,
        a = this.deltaT1.normalize().dot(this.deltaT2.normalize()) > 0.7
      return n && a && o > 2 && r > 2 ? GestureType.SPIN : GestureType.GRAB
    }
    return GestureType.NONE
  }
}
export class DollhouseControl extends PoseControllerObservable {
  cameraPoseProxy: CameraDataModule["cameraPoseProxy"]
  poseConstrainer: PoseConstrainer
  constrolsData: DollhouseControlData
  messageBus: Engine["messageBus"]
  tempOrientation: Quaternion
  nextOrientation: Quaternion
  tempAxis: Vector3
  nextPosition: Vector3
  positionDelta: Vector3
  orbitPoint: Vector3
  grabPt: Vector3
  aimTarget: Vector3
  zoomDirection: Vector3
  currentPose: Pose
  angularAccel: Vector2
  angularVelocity: Vector2
  linearAccel: Vector2
  linearVelocity: Vector2
  ndcPos: Vector2
  grabPlane: Plane
  orbitPlane: Plane
  zoomAccel: number
  zoomVelocity: number
  orbitDistance: number
  autoOrbitStartPhi: number
  needsOrbitDataInit: boolean
  isTouchSpinning: boolean
  currentPhiLowerLimit: number
  currentPhiUpperLimit: number
  activeAction: number
  activeDevice: number
  prevTouchY: number
  prevTouchX: number
  touchGestureRecognizer: TouchGestureRecognizer
  touchControls: TouchControls
  transition: {
    active: boolean
    startTime: number
    elapsed: number
    duration: number
    angularVelocity: Vector2
    linearVelocity: Vector2
    zoomVelocity: number
    easeOut: boolean
    deferred?: OpenDeferred
  }
  grabCameraPose: Pose
  getOrbitPoint: () => Vector3
  getGrabPoint: () => Vector3
  castFromNdc: () => Vector3 | null
  dampedZoomDir: (e?) => void

  constructor(e, t, i, o, n, a, h) {
    super()
    this.cameraPoseProxy = e
    this.poseConstrainer = t
    this.getOrbitPoint = i
    this.getGrabPoint = o
    this.constrolsData = a
    this.messageBus = h
    this.tempOrientation = new Quaternion()
    this.tempAxis = new Vector3()
    this.nextPosition = new Vector3()
    this.nextOrientation = new Quaternion()
    this.currentPose = new Pose(1)
    this.positionDelta = new Vector3()
    this.angularAccel = new Vector2()
    this.angularVelocity = new Vector2()
    this.linearAccel = new Vector2()
    this.linearVelocity = new Vector2()
    this.grabPlane = new Plane().setFromNormalAndCoplanarPoint(DirectionVector.UP, DirectionVector.ZERO)
    this.grabPt = new Vector3()
    this.ndcPos = new Vector2()
    this.zoomAccel = 0
    this.zoomVelocity = 0
    this.orbitPoint = new Vector3()
    this.orbitDistance = 0
    this.orbitPlane = new Plane()
    this.needsOrbitDataInit = !0
    this.autoOrbitStartPhi = 0
    this.aimTarget = new Vector3()
    this.currentPhiLowerLimit = b.zf
    this.currentPhiUpperLimit = b.uQ
    this.activeAction = ControlState.NONE
    this.activeDevice = ActiveDevice.NONE
    this.touchGestureRecognizer = new TouchGestureRecognizer()
    this.isTouchSpinning = !1
    this.prevTouchY = 0
    this.prevTouchX = 0
    this.zoomDirection = new Vector3()
    this.castFromNdc = (() => {
      const e = new Vector3(),
        t = new Vector3(0, 0, -1),
        i = new Ray(e, t),
        s = new Vector3()
      return () => {
        getPostDirections(this.grabCameraPose, e.set(this.ndcPos.x, this.ndcPos.y, -1), e)
        getPostDirections(this.grabCameraPose, t.set(this.ndcPos.x, this.ndcPos.y, 1), t)
        t.sub(e).normalize()
        i.set(e, t)
        return i.intersectPlane(this.grabPlane, s)
      }
    })()
    this.dampedZoomDir = (() => {
      const e = new Vector3(),
        t = new Quaternion(),
        i = new Vector3(),
        s = new Vector3(),
        o = new Quaternion()
      return (r = b.SI) => {
        const n = this.cameraPoseProxy.pose,
          a = n.forward().clone(),
          h = this.getGrabPoint(),
          l = h.clone().sub(this.cameraPoseProxy.pose.fovCorrectedPosition()).normalize(),
          d = this.poseConstrainer.modelBoundingBox.containsPoint(h) && n.phi() > b.bp ? l : a,
          c = o.angleTo(n.rotation) > 1e-8
        if ((o.copy(n.rotation), e.length() < 0.1 || c)) e.copy(d), this.zoomDirection.copy(d)
        else {
          const o = e.angleTo(d)
          s.crossVectors(e, d)
          const n = MathUtils.degToRad(1 * r),
            a = Math.min(o, n)
          t.setFromAxisAngle(s, a)
          const h = i.copy(e).applyQuaternion(t)
          e.copy(h)
          this.zoomDirection.copy(h)
        }
      }
    })()
    this.touchControls = new TouchControls(e, t, n, i, () => this.invalidateOrbitMetadata(), this.touchGestureRecognizer)
    e.pose.autoOrtho && (this.currentPhiUpperLimit = b.pj)
    this.transition = {
      active: !1,
      startTime: 0,
      elapsed: 0,
      duration: 0,
      angularVelocity: new Vector2(),
      linearVelocity: new Vector2(),
      zoomVelocity: 0,
      easeOut: !1
    }
    this.touchGestureRecognizer.onGrabStart(() => {
      this.messageBus.broadcast(new StopAndClearStateMessage())
      this.stopAndClearState()
    })
    this.touchGestureRecognizer.onGrabEnd(() => this.stopAndClearState())
    this.touchGestureRecognizer.onSpinStart(e => {
      this.isTouchSpinning = !0
      this.prevTouchX = (e.pointers[0].position.x + e.pointers[1].position.x) / 2
      this.prevTouchY = (e.pointers[0].position.y + e.pointers[1].position.y) / 2
      this.initMove(ControlState.ROTATE, ActiveDevice.MOUSE)
    })
    this.touchGestureRecognizer.onSpinEnd(() => {
      this.endMove()
      this.isTouchSpinning = !1
    })
  }

  touchGestureIds() {
    return this.touchGestureRecognizer.gesturePointerIds
  }

  rawPointerUpdate(e) {
    this.touchGestureRecognizer.rawPointerUpdate(e)
    this.touchControls.rawPointerUpdate(e)
  }

  setController(e) {
    super.setController(e)
    this.touchControls.setController(e)
    !e && this.activeAction !== ControlState.NONE && this.endMove()
    return this
  }

  setOrbitalAcceleration(e, t = !1) {
    !this.transition.active &&
      (t && this.haltVelocity(e, this.angularVelocity),
      (this.angularAccel.x = void 0 !== e.x ? e.x : this.angularAccel.x),
      (this.angularAccel.y = void 0 !== e.y ? e.y : this.angularAccel.y))
  }

  setPanAcceleration(e, t = !1) {
    !this.transition.active &&
      (t && this.haltVelocity(e, this.linearVelocity),
      (this.linearAccel.x = void 0 !== e.x ? e.x : this.linearAccel.x),
      (this.linearAccel.y = void 0 !== e.y ? e.y : this.linearAccel.y))
  }

  setNdcPos(e) {
    this.ndcPos.copy(e)
  }

  initMove(e, t, i?) {
    t !== ActiveDevice.KEYBOARD &&
      (this.setPanAcceleration({
        x: 0,
        y: 0
      }),
      this.stop())
    i && this.setNdcPos(i)
    if (e !== this.activeAction || t !== this.activeDevice) {
      this.updateOrbitState()
      this.activeDevice = t
      this.activeAction = e
      const i = this.cameraPoseProxy.pose
      this.poseConstrainer.setStartPose(i)
      const o = this.getGrabPoint(),
        n = i.phi() < b.N2 ? i.forward().clone().multiplyScalar(-1) : DirectionVector.UP
      this.grabPlane.setFromNormalAndCoplanarPoint(n, o)
      this.grabCameraPose = this.cameraPoseProxy.pose.clone()
      this.grabPt.copy(o)
      e === ControlState.ROTATE && this.messageBus.broadcast(new StopAndClearStateMessage())
    }
  }

  stopAndClearState(e = !1) {
    ;(isMobilePhone() || e) && this.stop()
    this.updateOrbitState()
    this.activeDevice = ActiveDevice.NONE
    this.activeAction = ControlState.NONE
  }

  softStopAndClearState() {
    this.stopAcceleration()
    this.updateOrbitState()
    this.activeDevice = ActiveDevice.NONE
    this.activeAction = ControlState.NONE
  }

  endMove(e?) {
    e && this.setNdcPos(e), this.isTouchSpinning ? this.softStopAndClearState() : this.stopAndClearState()
    const t = this.cameraPoseProxy.pose.pitchFactor()
    !this.isAutoOrbitting && t < 1 && t > 1e-10 && this.cameraPoseProxy.pose.autoOrtho && this.startAutoOrbitTo()
  }

  startAutoOrbitTo(e = "top") {
    const t = "top" === e ? R : b.dG
    if (Math.abs(this.cameraPoseProxy.pose.phi() - t) < 1e-10) {
      return Promise.resolve()
    }
    const i = this.constrolsData.startAutoOrbit(e)
    this.autoOrbitStartPhi = this.cameraPoseProxy.pose.phi()
    return i
  }

  stopAutoOrbit() {
    this.stopAndClearState(!0)
    this.constrolsData.stopAutoOrbit()
    this.invalidateOrbitMetadata()
  }

  invalidateOrbitMetadata() {
    this.needsOrbitDataInit = !0
  }

  get isAutoOrbitting() {
    return this.constrolsData.isAutoOrbitting
  }

  get mouseDown() {
    return this.activeDevice === ActiveDevice.MOUSE || this.activeDevice === ActiveDevice.TOUCH
  }

  updateOrbitState() {
    if (this.activeAction !== ControlState.ROTATE || this.needsOrbitDataInit) {
      const e = this.cameraPoseProxy.pose,
        t = this.getOrbitPoint()
      this.orbitPoint.copy(t)
      const i = e.position.distanceTo(this.orbitPoint)
      this.orbitDistance = i / e.fovDistanceScale()
      this.orbitPlane.setFromNormalAndCoplanarPoint(DirectionVector.UP, this.orbitPoint)
      this.cameraPoseProxy.pose.focalDistance = i
      this.needsOrbitDataInit = !1
    }
  }

  setZoomAcceleration(e) {
    !this.transition.active && (this.zoomAccel = e)
  }

  async setPhiLimits(e, t, i) {
    this.currentPhiLowerLimit = e
    this.currentPhiUpperLimit = t
    const s = this.cameraPoseProxy.pose.phi(),
      o = CheckThreshold(0, this.currentPhiLowerLimit - s, this.currentPhiUpperLimit - s)
    Math.abs(o) > I && i && (await this.orbit(new Vector2(), !0))
  }

  haltVelocity(e, t) {
    e.x && t.x && Math.sign(e.x) !== Math.sign(t.x) && (t.x = 0)
    e.y && t.y && Math.sign(e.y) !== Math.sign(t.y) && (t.y = 0)
  }

  startTransition(e: number, t: Vector2, i: Vector2, s: number, o: boolean) {
    if (null === this.poseController) return OpenDeferred.reject("Unable to start transition, since controller is unavailable.")
    const r = new OpenDeferred()
    this.transition.active = !0
    this.transition.duration = e
    this.transition.elapsed = 0
    this.transition.startTime = Date.now()
    this.transition.deferred = r
    this.transition.angularVelocity.copy(t)
    this.transition.linearVelocity.copy(i)
    this.transition.zoomVelocity = s
    this.transition.easeOut = o
    this.angularAccel.set(0, 0)
    this.linearAccel.set(0, 0)
    this.zoomAccel = 0
    this.angularVelocity.copy(t)
    this.linearVelocity.copy(i)
    this.zoomVelocity = s
    this.poseController.beginExternalTransition()
    return r.promise()
  }

  stopTransition() {
    this.transition.active && (this.poseController && this.poseController.endExternalTransition(), (this.transition.active = !1)),
      this.transition.deferred && (this.transition.deferred.resolve(), (this.transition.deferred = void 0))
  }

  updateTransition(e, t, i, s) {
    let o = 1,
      r = e / b.SI
    this.transition.elapsed += e
    if (this.transition.elapsed >= this.transition.duration) {
      o = (this.transition.duration - (this.transition.elapsed - e)) / e
      r = 1
    }
    t && (this.angularVelocity.copy(this.transition.angularVelocity).multiplyScalar(o * r), this.orbit(this.angularVelocity)),
      i && (this.linearVelocity.copy(this.transition.linearVelocity).multiplyScalar(o * r), this.pan(this.linearVelocity)),
      s && ((this.zoomVelocity = this.transition.zoomVelocity * o * r), this.zoom(this.zoomVelocity)),
      this.transition.elapsed >= this.transition.duration && (this.stop(this.transition.easeOut), (this.transition.active = !1))
  }

  updateDefault(e, t, i, s) {
    if (this.touchControls.isMovingCamera()) return
    const o = e / b.SI
    if (t && !s) {
      this.angularVelocity.addScaledVector(this.angularAccel, o)
      const e = this.isTouchSpinning ? 1.1 : 1
      this.orbit(this.angularVelocity.clone().multiplyScalar(o / e)), this.angularVelocity.multiplyScalar(Math.pow(1 - b.O8, o) / e)
    }
    i && (this.linearVelocity.addScaledVector(this.linearAccel, o), this.pan(this.linearVelocity), this.linearVelocity.multiplyScalar(Math.pow(1 - b.O8, o))),
      s &&
        ((this.zoomVelocity += this.zoomAccel * o),
        this.zoom(this.zoomVelocity),
        (this.zoomVelocity *= Math.pow(1 - b.TD, o)),
        this.angularVelocity.set(0, 0),
        this.angularAccel.set(0, 0))
  }

  startRotateTransition(e: number, t: Vector2, i: boolean) {
    t.x *= -1
    this.orbitDistance = this.cameraPoseProxy.pose.focalDistance
    return this.startTransition(e, t.clone().multiplyScalar(b.SI), new Vector2(), 0, i).nativePromise()
  }

  startTranslateTransition(e: number, t: Vector2, i = !0) {
    return this.startTransition(e, new Vector2(), t.clone().multiplyScalar(b.SI), 0, i).nativePromise()
  }

  startZoomTransition(e: number, t: number, i: boolean) {
    return this.startTransition(e, new Vector2(0, 0), new Vector2(0, 0), t, i).nativePromise()
  }

  update(e) {
    const t = this.linearAccel.length() > I || this.linearVelocity.length() > I,
      i = this.angularAccel.length() > I || this.angularVelocity.length() > I,
      o = Math.abs(this.zoomAccel) > I || Math.abs(this.zoomVelocity) > I,
      r = i || this.isAutoOrbitting,
      n = t || (this.mouseDown && this.activeAction === ControlState.PAN),
      a = o
    this.dampedZoomDir(e),
      this.updateMultiTouchGesture(e),
      this.activeDevice !== ActiveDevice.KEYBOARD || t || i || o
        ? this.transition.active
          ? this.updateTransition(e, r, n, a)
          : this.updateDefault(e, r, n, a)
        : this.endMove()
  }

  stopMomentum() {
    !this.transition.active && (this.angularVelocity.set(0, 0), this.linearVelocity.set(0, 0), (this.zoomVelocity = 0))
  }

  stopAcceleration() {
    !this.transition.active &&
      (this.setOrbitalAcceleration({ x: 0, y: 0 }),
      this.setPanAcceleration({
        x: 0,
        y: 0
      }),
      this.setZoomAcceleration(0))
  }

  stop(e = !1) {
    this.stopTransition()
    this.stopAcceleration()
    !e && this.stopMomentum()
  }

  pan(e) {
    if (!this.poseController) return
    this.setupCurrentPose()
    const t = this.cameraPoseProxy.pose
    if (this.mouseDown) {
      const e = this.castFromNdc()
      if (e) {
        const t = e.sub(this.grabPt)
        t.lengthSq() > 0 &&
          (this.nextPosition.copy(this.grabCameraPose.fovCorrectedPosition()).addScaledVector(t, -1),
          this.currentPose.position.copy(this.nextPosition),
          this.currentPose.applyPhiBasedFovSquish(),
          this.poseConstrainer.constrain(this.currentPose),
          this.poseController.updateCameraPose(this.currentPose))
      }
    } else
      (this.positionDelta.x = e.x),
        (this.positionDelta.z = e.y),
        (this.positionDelta.y = 0),
        this.nextPosition.copy(t.fovCorrectedPosition()).add(this.positionDelta),
        this.currentPose.position.copy(this.nextPosition),
        this.currentPose.applyPhiBasedFovSquish(),
        this.poseConstrainer.constrain(this.currentPose),
        this.poseController.updateCameraPose(this.currentPose)
  }

  orbit(e, t = !1) {
    if (!this.poseController) return
    this.setupCurrentPose()
    const i = this.cameraPoseProxy.pose,
      s = i.phi(),
      o = this.isAutoOrbitting ? this.calcAutoOrbitVelocity(s) : e,
      n = this.isAutoOrbitting ? R : this.currentPhiUpperLimit,
      a = this.isAutoOrbitting ? b.dG : this.currentPhiLowerLimit,
      h = CheckThreshold(o.y, a - s, n - s),
      l = n - s < 1e-10,
      d = s - a < 1e-10,
      c = "top" === this.constrolsData.autoOrbitTarget ? l : d
    if (this.isAutoOrbitting && c) return void this.stopAutoOrbit()
    if (l && h > 0 && !(Math.abs(e.x) > 0)) return (this.angularVelocity.y = 0), void (this.angularAccel.y = 0)
    const u = this.orbitDistance
    if (
      (this.aimTarget.copy(DirectionVector.FORWARD).applyQuaternion(i.rotation),
      this.aimTarget.setLength(u),
      this.aimTarget.addVectors(i.fovCorrectedPosition(), this.aimTarget),
      this.tempAxis.copy(DirectionVector.RIGHT),
      this.tempOrientation.setFromAxisAngle(this.tempAxis.applyQuaternion(i.rotation), -h),
      this.nextPosition.copy(i.fovCorrectedPosition()).sub(this.aimTarget).applyQuaternion(this.tempOrientation),
      this.nextOrientation.copy(i.rotation).premultiply(this.tempOrientation),
      this.tempOrientation.setFromAxisAngle(DirectionVector.UP, o.x),
      this.nextPosition.applyQuaternion(this.tempOrientation),
      this.nextOrientation.premultiply(this.tempOrientation),
      (this.nextPosition = this.nextPosition.add(this.aimTarget)),
      this.nextOrientation.normalize(),
      this.currentPose.position.copy(this.nextPosition),
      this.currentPose.rotation.copy(this.nextOrientation),
      (this.currentPose.focalDistance = u),
      this.currentPose.applyPhiBasedFovSquish(),
      t)
    )
      return this.poseController
        .moveTo({
          transitionType: TransitionTypeList.Interpolate,
          pose: { position: this.currentPose.position.clone(), rotation: this.currentPose.rotation.clone() },
          transitionTime: 500
        })
        .nativePromise()
    this.poseController.updateCameraPose(this.currentPose)
  }

  zoom(e) {
    if (!this.poseController) return
    this.setupCurrentPose(), this.updateOrbitState()
    const t = this.cameraPoseProxy.pose
    this.poseConstrainer.setStartPose(t)
    const i = t.forward().clone(),
      s = (1 / (this.getGrabPoint().distanceTo(t.position) / t.fovDistanceScale())) * 2,
      o = this.poseConstrainer.modelSize,
      r = (e * b.jX) / (s * o * b.mP),
      n = this.zoomDirection,
      a = this.orbitPoint,
      h = this.poseConstrainer.maxZoomDistance - this.poseConstrainer.minZoomDistance,
      l = a.distanceTo(t.position) / t.fovDistanceScale(),
      d = CheckThreshold(r * h + l, this.poseConstrainer.minZoomDistance, this.poseConstrainer.maxZoomDistance) - l,
      c = n.setLength(-d)
    this.nextPosition.copy(t.fovCorrectedPosition()).add(c)
    const u = new Ray(this.nextPosition, i),
      p = new Vector3(),
      g = u.intersectPlane(this.orbitPlane, p) || a
    this.currentPose.position.copy(this.nextPosition)
    this.currentPose.focalDistance = g.distanceTo(this.nextPosition)
    this.currentPose.resetProjMatrix()
    this.currentPose.applyPhiBasedFovSquish()
    this.poseConstrainer.constrain(this.currentPose)
    this.poseController.updateCameraPose(this.currentPose)
  }

  setupCurrentPose() {
    const e = this.cameraPoseProxy.pose
    this.currentPose.copy(e)
    this.currentPose.unapplyPhiBasedFovSquish()
  }

  calcAutoOrbitVelocity(e) {
    const t = "top" === this.constrolsData.autoOrbitTarget ? 1 : -1,
      i = "top" === this.constrolsData.autoOrbitTarget ? R : b.dG,
      s = Math.abs((i - e) / (i - this.autoOrbitStartPhi)),
      o = MathUtils.lerp(0.002, 0.08, s)
    return new Vector2(0, t * o)
  }

  getDebugState() {
    return {
      plane: this.orbitPlane.clone(),
      orbitPt: this.orbitPoint.clone(),
      zoomDir: this.zoomDirection.clone().normalize()
    }
  }

  updateMultiTouchGesture(e) {
    if (this.isTouchSpinning) {
      const t = this.touchGestureRecognizer.currPos.x,
        i = this.touchGestureRecognizer.currPos.y,
        s = this.prevTouchX - t,
        o = this.prevTouchY - i,
        r = Math.abs(s) > 0.001 ? s : 0,
        n = Math.abs(o) > 0.001 ? o : 0,
        a = e / b.SI
      this.setOrbitalAcceleration({ x: V * r * a, y: V * n * a })
      this.prevTouchX = t
      this.prevTouchY = i
    }
  }
}
