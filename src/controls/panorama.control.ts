import { Euler, Quaternion, Vector2, Vector3 } from "three"
import { CheckThreshold } from "../utils/49827"
import * as n from "../const/21646"
import * as r from "../const/93642"
import { PoseControllerObservable } from "../controls/pose.control.observable"
import { OpenDeferred } from "../core/deferred"
import { CameraData } from "../data/camera.data"
import { DirectionVector } from "../webgl/vector.const"

export class PanoramaControl extends PoseControllerObservable {
  cameraPoseProxy: CameraData
  lookVelocity: Vector2
  lookAccel: Vector2
  tempAxis: Vector3
  tempOrientation: Quaternion
  currentOrientation: Quaternion
  tempEuler: Euler
  transition: {
    easeOut: boolean
    active: boolean
    startTime: number
    elapsed: number
    duration: number
    velocity: Vector2
    deferred?: OpenDeferred
  }
  beforeStartRotationTransition: () => void

  constructor(e) {
    super()
    this.cameraPoseProxy = e
    this.lookVelocity = new Vector2()
    this.lookAccel = new Vector2()
    this.tempAxis = new Vector3()
    this.tempOrientation = new Quaternion()
    this.currentOrientation = new Quaternion()
    this.tempEuler = new Euler()
    this.transition = { active: !1, startTime: 0, elapsed: 0, duration: 0, velocity: new Vector2(), easeOut: !1 }
  }

  setController(e) {
    !e && this.stop()
    return super.setController(e)
  }
  setLookAcceleration(e, t = !1) {
    this.transition.active ||
      (t &&
        (e.x && this.lookVelocity.x && Math.sign(e.x) !== Math.sign(this.lookVelocity.x) && (this.lookVelocity.x = 0),
        e.y && this.lookVelocity.y && Math.sign(e.y) !== Math.sign(this.lookVelocity.y) && (this.lookVelocity.y = 0)),
      (this.lookAccel.x = void 0 !== e.x ? e.x : this.lookAccel.x),
      (this.lookAccel.y = void 0 !== e.y ? e.y : this.lookAccel.y))
  }
  startTransition(e: number, t: Vector2, i: boolean) {
    const o = new OpenDeferred()
    this.transition.active = !0
    this.transition.duration = e
    this.transition.elapsed = 0
    this.transition.startTime = Date.now()
    this.transition.deferred = o
    this.transition.velocity.copy(t)
    this.transition.easeOut = i
    this.lookAccel.set(0, 0)
    this.lookVelocity.copy(t)
    this.poseController && this.poseController.beginExternalTransition()

    return o.promise()
  }

  stopTransition() {
    this.transition.active && (this.poseController && this.poseController.endExternalTransition(), (this.transition.active = !1))
    this.transition.deferred && (this.transition.deferred.resolve(), (this.transition.deferred = void 0))
  }
  updateTransition(e) {
    const t = e / r.SI
    if ((this.lookVelocity.copy(this.transition.velocity), (this.transition.elapsed += e), this.transition.elapsed >= this.transition.duration)) {
      const t = this.transition.duration - (this.transition.elapsed - e)
      this.lookVelocity.multiplyScalar(t / e)
    } else this.lookVelocity.multiplyScalar(t)
  }
  updateCameraParameters() {
    var e
    const t = this.cameraPoseProxy.pose
    this.tempEuler.setFromQuaternion(t.rotation, "YXZ")
    const i = this.tempEuler.x,
      s = CheckThreshold(this.lookVelocity.y, r.zf - i, r.uQ - i)
    this.tempAxis.copy(DirectionVector.RIGHT),
      this.tempOrientation.setFromAxisAngle(this.tempAxis.applyQuaternion(t.rotation), s),
      this.currentOrientation.copy(t.rotation).premultiply(this.tempOrientation),
      this.tempOrientation.setFromAxisAngle(DirectionVector.UP, this.lookVelocity.x),
      this.currentOrientation.premultiply(this.tempOrientation),
      t.rotation.equals(this.currentOrientation) ||
        (this.tempOrientation.copy(this.currentOrientation).normalize(),
        null === (e = this.poseController) || void 0 === e || e.updateCameraRotation(this.tempOrientation))
  }
  update(e) {
    const t = this.cameraPoseProxy.pose,
      i = e / r.SI
    t.rotation.equals(this.currentOrientation) || this.currentOrientation.copy(t.rotation),
      this.transition.active
        ? (this.updateTransition(e),
          this.updateCameraParameters(),
          this.transition.elapsed >= this.transition.duration && (this.stop(this.transition.easeOut), (this.transition.active = !1)))
        : (this.lookAccel.length() > n.Z.epsilon || this.lookVelocity.length() > n.Z.epsilon) &&
          (this.lookVelocity.addScaledVector(this.lookAccel, i), this.updateCameraParameters(), this.lookVelocity.multiplyScalar(Math.pow(1 - r.O8, i)))
  }
  stop(e = !1) {
    this.stopTransition(), this.lookAccel.set(0, 0), e || this.lookVelocity.set(0, 0)
  }
  startRotateTransition(e: number, t: Vector2, i: boolean) {
    return (
      this.beforeStartRotationTransition && this.beforeStartRotationTransition(), this.startTransition(e, t.clone().multiplyScalar(r.SI), i).nativePromise()
    )
  }

  startTranslateTransition(e: number, t: Vector2, i = !0) {
    throw new Error("Panning isn't supported in Panorama Controls")
  }

  startZoomTransition(e: number, t: number, i: boolean) {
    throw new Error("Zooming isn't supported in Panorama Controls")
  }
}
