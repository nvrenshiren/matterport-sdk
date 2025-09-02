import { Box3, Quaternion, Vector2, Vector3 } from "three"
import * as n from "../const/21646"
import * as r from "../const/41602"
import { AddMaxZoom, FrameRate, MinZoom } from "../const/41602"
import { OpenDeferred } from "../core/deferred"
import { CameraData } from "../data/camera.data"
import { checkFrustumIntersectsBox } from "../math/2569"
import { getProjectionMatrixInverse } from "../math/81729"
import CameraDataModule from "../modules/cameraData.module"
import { MatrixBase } from "../webgl/matrix.base"
import { PoseControllerObservable } from "./pose.control.observable"
export class OrthographicControl extends PoseControllerObservable {
  currentOrientation: Quaternion
  checkBounds: boolean
  transition: {
    active: boolean
    startTime: number
    elapsed: number
    duration: number
    angularVelocity?: number
    linearVelocity: Vector2
    zoomVelocity: number
    easeOut: boolean
    deferred?: OpenDeferred
  }
  cameraPoseProxy: CameraDataModule["cameraPoseProxy"]
  getDefaultZoom: CameraData["defaultZoom"]
  targetProjection: MatrixBase
  currentPosition: Vector3
  positionDelta: Vector3
  linearAccel: Vector2
  linearVelocity: Vector2
  zoomAccel: number
  zoomVelocity: number
  scale: number
  maxZoom: number
  minZoom: number
  bounds: Box3
  boundsCenter: Vector3
  worldBounds: Box3
  constructor(e, t, i, n, a = !1) {
    super()
    this.cameraPoseProxy = e
    this.getDefaultZoom = t
    this.targetProjection = new MatrixBase()
    this.currentOrientation = new Quaternion()
    this.currentPosition = new Vector3()
    this.positionDelta = new Vector3()
    this.linearAccel = new Vector2()
    this.linearVelocity = new Vector2()
    this.zoomAccel = 0
    this.zoomVelocity = 0
    this.scale = 1
    this.maxZoom = 0
    this.minZoom = MinZoom
    this.checkBounds = a
    this.bounds = i.clone()
    this.boundsCenter = n.clone()
    this.setupBounds()
    this.transition = { active: !1, startTime: 0, elapsed: 0, duration: 0, linearVelocity: new Vector2(), zoomVelocity: 0, easeOut: !1 }
  }
  start() {
    this.scale = 1
    this.maxZoom = this.getDefaultZoom() * AddMaxZoom
  }
  setPanAcceleration(e: { x: number; y: number }, t = !1, i?) {
    if (!this.transition.active) {
      t && this.haltVelocity(e, this.linearVelocity)
      const s = this.cameraPoseProxy.pose
      const o = s.projection.elements[0]
      const r = s.projection.elements[5]
      this.linearAccel.x = void 0 !== e.x ? e.x / o : this.linearAccel.x
      this.linearAccel.y = void 0 !== e.y ? e.y / r : this.linearAccel.y
      void 0 !== i && this.linearAccel.setLength(i)
    }
  }
  setZoomAcceleration(e: number) {
    this.transition.active || (this.zoomAccel = e)
  }
  haltVelocity(e: { x: number; y: number }, t: Vector2) {
    e.x && t.x && Math.sign(e.x) !== Math.sign(t.x) && (t.x = 0), e.y && t.y && Math.sign(e.y) !== Math.sign(t.y) && (t.y = 0)
  }
  startRotateTransition(e: number, t: Vector2, i: boolean) {
    return Promise.resolve()
  }
  startTranslateTransition(e: number, t: Vector2, i = !0) {
    return this.startTransition(e, 0, t.clone().multiplyScalar(FrameRate), 0, i).nativePromise()
  }
  startZoomTransition(e: number, t: number, i: boolean) {
    return this.startTransition(e, 0, new Vector2(0, 0), t, i).nativePromise()
  }
  startTransition(e: number, t: number, i: Vector2, s: number, o: boolean) {
    const r = new OpenDeferred()
    return this.poseController
      ? ((this.transition.active = !0),
        (this.transition.duration = e),
        (this.transition.elapsed = 0),
        (this.transition.startTime = Date.now()),
        (this.transition.deferred = r),
        this.transition.linearVelocity.copy(i),
        (this.transition.zoomVelocity = s),
        (this.transition.easeOut = o),
        this.linearAccel.set(0, 0),
        (this.zoomAccel = 0),
        this.linearVelocity.copy(i),
        (this.zoomVelocity = s),
        this.poseController.beginExternalTransition(),
        r.promise())
      : r.resolve().promise()
  }
  stopTransition() {
    this.transition.active && (this.poseController?.endExternalTransition(), (this.transition.active = !1))
    this.transition.deferred && (this.transition.deferred.resolve(), (this.transition.deferred = void 0))
  }
  updateTransition(e: number, t: boolean, i: boolean) {
    this.transition.elapsed += e
    const s = this.getTransitionScale(e)
    t && (this.linearVelocity.copy(this.transition.linearVelocity).multiplyScalar(s), this.pan(this.linearVelocity))
    i && ((this.zoomVelocity = this.transition.zoomVelocity * s), this.zoom(this.zoomVelocity))
    this.transition.elapsed >= this.transition.duration && (this.stop(this.transition.easeOut), (this.transition.active = !1))
  }
  getTransitionScale(e: number) {
    if (this.transition.elapsed >= this.transition.duration) {
      return (this.transition.duration - (this.transition.elapsed - e)) / e
    }
    return e / FrameRate
  }
  updateDefault(e: number, t: boolean, i: boolean) {
    const s = e / FrameRate
    t && (this.linearVelocity.addScaledVector(this.linearAccel, s), this.pan(this.linearVelocity), this.linearVelocity.multiplyScalar(Math.pow(1 - r.O8, s)))
    i && ((this.zoomVelocity = this.zoomVelocity + this.zoomAccel * s), this.zoom(this.zoomVelocity), (this.zoomVelocity *= Math.pow(1 - r.TD, s)))
  }
  update(e: number) {
    const t = this.linearAccel.length() > n.Z.epsilon || this.linearVelocity.length() > n.Z.epsilon
    const i = Math.abs(this.zoomAccel) > n.Z.epsilon || Math.abs(this.zoomVelocity) > n.Z.epsilon
    this.transition.active ? this.updateTransition(e, t, i) : this.updateDefault(e, t, i)
  }
  stopMomentum() {
    this.transition.active || (this.linearVelocity.set(0, 0), (this.zoomVelocity = 0))
  }
  stopAcceleration() {
    this.transition.active || (this.setPanAcceleration({ x: 0, y: 0 }), this.setZoomAcceleration(0))
  }
  stop(e = !1) {
    this.stopTransition()
    this.stopAcceleration()
    e || this.stopMomentum()
  }
  pan(e: Vector2) {
    if (!this.poseController) return
    const t = this.cameraPoseProxy.pose
    this.positionDelta.x = e.x
    this.positionDelta.y = e.y
    this.positionDelta.z = 0
    this.positionDelta.applyQuaternion(t.rotation)
    this.currentPosition.copy(t.position).add(this.positionDelta)
    ;(this.checkBounds && !this.insideBounds(this.currentPosition, t.rotation, t.projection)) || this.poseController.updateCameraPosition(this.currentPosition)
  }
  zoom(e: number) {
    if (!this.poseController) return
    const t = this.cameraPoseProxy.pose
    this.targetProjection.copy(t.projection)
    const i = this.scale * (1 - e)
    if (Math.abs(i - this.scale) > n.Z.epsilon) {
      ;(this.targetProjection.elements[0] *= i / this.scale), (this.targetProjection.elements[5] *= i / this.scale)
      const s = getProjectionMatrixInverse(this.targetProjection)
      if ((e < 0 && s <= this.minZoom) || (e > 0 && s >= this.maxZoom)) return
      if (this.checkBounds && !this.insideBounds(t.position, t.rotation, this.targetProjection)) return
      ;(this.scale = i), this.poseController.updateCameraProjection(this.targetProjection.clone())
    }
  }
  setupBounds() {
    this.bounds.min.x = this.adjustBound(this.bounds.min.x, 2)
    this.bounds.min.y = this.adjustBound(this.bounds.min.y, 2)
    this.bounds.min.z = this.adjustBound(this.bounds.min.z, 2)
    this.bounds.max.x = this.adjustBound(this.bounds.max.x, -2)
    this.bounds.max.y = this.adjustBound(this.bounds.max.y, -2)
    this.bounds.max.z = this.adjustBound(this.bounds.max.z, -2)
    this.worldBounds = new Box3().setFromCenterAndSize(
      this.boundsCenter,
      new Vector3(this.bounds.max.x - this.bounds.min.x, this.bounds.max.y - this.bounds.min.y, this.bounds.max.z - this.bounds.min.z)
    )
  }
  insideBounds(e: Vector3, t, i) {
    return !!checkFrustumIntersectsBox(e, t, i, this.worldBounds)
  }
  adjustBound(e, t) {
    return Math.sign(e + t) === Math.sign(e) ? e + t : 0
  }
}
