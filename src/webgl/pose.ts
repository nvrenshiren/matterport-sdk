import { MathUtils, Quaternion, Vector3 } from "three"
import * as u from "../math/59370"
import { calculatePitchAngle, isPitchFactorOrtho } from "../math/59370"
import { isProjectionOrtho } from "../math/81729"
import { createSubscription } from "../core/subscription"
import { Observable } from "../observable/observable"
import { ObservableObject } from "../observable/observable.object"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { CameraRigConfig, computeNearFar, makePerspectiveFov } from "../utils/camera.utils"
import { easePitchFactor } from "../utils/ease.utils"
import { MatrixBase } from "./matrix.base"
import { DirectionVector } from "./vector.const"
class BooleanSubscription {
  computation: Function
  _changeObservers: Set<Function>
  updateValue: () => void
  _lastValue: any
  _subscriptions: AggregateSubscription
  constructor(e: Function, t: Observable["onChanged"][]) {
    this.computation = e
    this._changeObservers = new Set()
    this.updateValue = () => {
      const e = this.computation()
      if (e !== this._lastValue) {
        this._lastValue = e
        for (const e of this._changeObservers) e(this._lastValue)
      }
    }
    this._lastValue = this.computation()
    this._subscriptions = new AggregateSubscription(...t.map(e => e(this.updateValue)))
  }
  get value() {
    return this._lastValue
  }
  renew() {
    this._subscriptions.renew()
  }
  cancel() {
    this._subscriptions.cancel()
  }
  onChanged(e) {
    if (this._changeObservers.has(e))
      throw new Error("This observer function is already observing this Observable, and double subscriptions are not supported.")
    return createSubscription(
      () => this._changeObservers.add(e),
      () => this.removeOnChanged(e),
      !0
    )
  }
  removeOnChanged(e) {
    this._changeObservers.delete(e)
  }
}
export const minPoseRad = 75 * MathUtils.DEG2RAD
export class Pose extends ObservableObject {
  position: Vector3
  rotation: Quaternion
  focalDistance: number
  _autoOrthoApplied: boolean
  _shouldAutoOrtho: boolean
  fovCorrectedPosition: () => Vector3
  fovCorrectionOffsetVec: () => Vector3
  focalPoint: () => Vector3
  forward: () => Vector3
  pitchFactor: () => number
  projection: MatrixBase
  isPitchFactorOrtho: BooleanSubscription
  isProjectionOrtho: BooleanSubscription
  isPitchFactorTransitionActive: BooleanSubscription
  constructor(e: number) {
    super()
    this.position = new Vector3()
    this.rotation = new Quaternion()
    this.focalDistance = -1
    this._autoOrthoApplied = !1
    this._shouldAutoOrtho = !1
    this.fovCorrectedPosition = (() => {
      const e = new Vector3()
      return () => (e.copy(DirectionVector.FORWARD).applyQuaternion(this.rotation).multiplyScalar(this.fovCorrectionOffset()).add(this.position), e)
    })()
    this.fovCorrectionOffsetVec = (() => {
      const e = new Vector3()
      return () => (e.copy(DirectionVector.FORWARD).applyQuaternion(this.rotation).multiplyScalar(-this.fovCorrectionOffset()), e)
    })()
    this.focalPoint = (() => {
      const e = new Vector3(),
        t = new Vector3()
      return () => (e.copy(DirectionVector.FORWARD).applyQuaternion(this.rotation).multiplyScalar(this.focalDistance), t.copy(this.position).add(e), t)
    })()
    this.forward = (() => {
      const e = new Vector3()
      return () => (e.copy(DirectionVector.FORWARD).applyQuaternion(this.rotation), e)
    })()
    this.pitchFactor = (() => {
      const e = easePitchFactor(0.6, 0, 0.88, 0.5)
      return () => {
        const t = MathUtils.radToDeg(this.phi()),
          n = MathUtils.radToDeg(minPoseRad),
          i = Math.max((t - n) / (90 - n), 0),
          s = e(i),
          r = 1 - s,
          a = 1 - Math.round(s)
        return Math.abs(r - a) <= 0.001 ? a : r
      }
    })()
    this.projection = makePerspectiveFov(e)
    this.isPitchFactorOrtho = new BooleanSubscription(() => isPitchFactorOrtho(this.pitchFactor()), [this.onChanged.bind(this)])
    this.isProjectionOrtho = new BooleanSubscription(() => isProjectionOrtho(this.projection), [this.onChanged.bind(this)])
    this.isPitchFactorTransitionActive = new BooleanSubscription(() => {
      const e = Math.abs(this.pitchFactor())
      return e > 0 && e < 1
    }, [this.onChanged.bind(this)])
  }
  setAutoOrtho(e: boolean) {
    this._shouldAutoOrtho = e
  }
  get autoOrtho() {
    return this._shouldAutoOrtho
  }
  get autoOrthoApplied() {
    return this._autoOrthoApplied
  }
  fovCorrectedFocalDistance() {
    return this.focalDistance / this.fovDistanceScale()
  }
  fovCorrectionOffset() {
    return this.focalDistance - this.fovCorrectedFocalDistance()
  }
  aspect() {
    return this.projection.elements[5] / this.projection.elements[0]
  }
  halfHeight() {
    return this.fovCorrectedFocalDistance() * Math.tan(MathUtils.degToRad(CameraRigConfig.fov / 2))
  }
  fovDistanceScale(e?: number) {
    const { minFov } = CameraRigConfig
    const n = null != e ? Math.max(e, minFov) : this.isOrtho() ? minFov : MathUtils.radToDeg(this.fovY())
    return Math.tan(MathUtils.degToRad(CameraRigConfig.fov / 2)) / Math.tan(MathUtils.degToRad(n) / 2)
  }
  phi() {
    return calculatePitchAngle(this.rotation)
  }
  clone(e = new Pose(this.aspect())) {
    e.position.copy(this.position), e.rotation.copy(this.rotation)
    e.focalDistance = this.focalDistance
    e.projection.copy(this.projection)
    e._autoOrthoApplied = this.autoOrthoApplied
    e._shouldAutoOrtho = this.autoOrtho
    e.commit()
    return e
  }
  applyPhiBasedFovSquish() {
    if (!this._shouldAutoOrtho) return
    const e = MathUtils.lerp(0, CameraRigConfig.fov, this.pitchFactor())
    const t = this.aspect()
    const n = this.fovCorrectedFocalDistance() * this.fovDistanceScale(e)
    const { near, far } = computeNearFar(n)
    if (e > CameraRigConfig.minFov) this.projection.makePerspectiveFov(e, t, near, far)
    else {
      const e = this.halfHeight()
      const t = this.aspect() * e
      this.projection.makeOrthographic(-t, t, e, -e, near, far)
    }
    this.focalDistance = n
    this.position.add(this.fovCorrectionOffsetVec())
    this._autoOrthoApplied = !0
  }
  unapplyPhiBasedFovSquish() {
    if (!this._autoOrthoApplied) return
    const e = this.fovCorrectedPosition().clone(),
      t = this.fovCorrectedFocalDistance()
    this.position.copy(e), (this.focalDistance = t), this.resetProjMatrix(), (this._autoOrthoApplied = !1)
  }
  copy(e: Pose) {
    this.position.copy(e.position)
    this.rotation.copy(e.rotation)
    this.focalDistance = e.focalDistance
    this.projection.copy(e.projection)
    this._autoOrthoApplied = e.autoOrthoApplied
    this._shouldAutoOrtho = e.autoOrtho
    this.commit()
    return this
  }
  isOrtho() {
    return isProjectionOrtho(this.projection)
  }
  fovX() {
    return 2 * Math.atan((1 * this.aspect()) / this.projection.elements[5])
  }
  fovY() {
    return 2 * Math.atan(1 / this.projection.elements[5])
  }
  resetProjMatrix() {
    this.projection.makePerspectiveFov(CameraRigConfig.fov, this.aspect(), CameraRigConfig.near, CameraRigConfig.far)
  }
}
