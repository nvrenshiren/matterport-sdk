import * as i from "../utils/camera.utils"

import { MathUtils, Matrix4, Quaternion, Vector3 } from "three"
import * as a from "../math/81729"
import { calculateWorldUnitsFromScreenWidth, getProjectionMatrixInverse, isProjectionOrtho } from "../math/81729"
import { Data } from "../core/data"
import { ObservableObject } from "../observable/observable.object"
import { CameraRigConfig, computeNearFar, OrthographicProjection } from "../utils/camera.utils"
import { AnimationProgress } from "../webgl/animation.progress"
import { MatrixBase } from "../webgl/matrix.base"
import { Pose } from "../webgl/pose"
import { OpenDeferred } from "../core/deferred"
import { TargetPhi, TransitionTypeList } from "../const/64918"
const sameData = (e, t) => (e && t ? e.equals(t) : e === t)
class Transition extends ObservableObject {
  startTime: number
  duration: number
  active: boolean
  autoOrtho: boolean
  type: TransitionTypeList | null
  progress: AnimationProgress
  blackoutProgress: AnimationProgress
  from: { position?: Vector3; rotation?: Quaternion; projection?: MatrixBase; focalDistance?: number }
  to: { position?: Vector3; rotation?: Quaternion; projection?: MatrixBase; focalDistance?: number }
  rotationDelay: number
  rotationDuration: number
  matrixDelay: number
  matrixDuration: number
  activeInternal: boolean
  promise: OpenDeferred | null
  orbitTarget: TargetPhi | null
  orbitStartPhi: number
  orbitStartDistance: number
  constructor() {
    super(), (this.startTime = 0)
    this.duration = 0
    this.active = !1
    this.autoOrtho = !1
    this.type = null
    this.progress = new AnimationProgress(0)
    this.blackoutProgress = new AnimationProgress(0)
    this.from = {
      position: new Vector3(),
      rotation: new Quaternion(),
      projection: new MatrixBase()
    }
    this.to = {
      position: new Vector3(),
      rotation: new Quaternion(),
      projection: new MatrixBase()
    }
    this.rotationDelay = 0
    this.rotationDuration = 1
    this.matrixDelay = 0
    this.matrixDuration = 1
    this.activeInternal = !1
    this.promise = null
    this.orbitTarget = null
    this.orbitStartPhi = 0
    this.orbitStartDistance = 0
  }
}
export const copyTransition = (e, t, n = !0) => {
  t.position = copyData(e.position, t.position, n)
  t.rotation = copyData(e.rotation, t.rotation, n)
  t.projection = copyData(e.projection, t.projection, n)
  t.focalDistance = e.focalDistance
}
const copyData = (e, t, n = !0) => (e && !t ? (t = e.clone()) : e && t ? t.copy(e) : n && (t = void 0), t)
export class CameraData extends Data {
  _width: number
  _height: number
  name: string
  _baseProjection: MatrixBase
  _orthoMatrix: MatrixBase
  _lastOrthoZoom: number
  _perspectiveMatrix: MatrixBase
  pose: Pose
  transition: Transition
  _baseFovY: number
  constructor(e: number, t: number) {
    super()
    this._width = e
    this._height = t
    this.name = "camera"
    this._baseProjection = new MatrixBase()
    this._orthoMatrix = new MatrixBase()
    this._lastOrthoZoom = 1
    this._perspectiveMatrix = new MatrixBase()
    this.pose = new Pose(e / t)
    this.transition = new Transition()
    this.setCameraDimensions(e, t)
    this._baseFovY = MathUtils.DEG2RAD * CameraRigConfig.fov
  }
  setCameraDimensions(e: number, t: number) {
    if (isNaN(e) || 0 === e || isNaN(t) || 0 === t) return
    this._width = e
    this._height = t
    const n = e / t
    const { near: s, far: r } = computeNearFar(this.pose.focalDistance)
    const o = this.isOrtho()
      ? OrthographicProjection(e, t, t / (2 * this.orthoZoom()), 1, s, r, this._orthoMatrix)
      : this._perspectiveMatrix.makePerspectiveFov(MathUtils.RAD2DEG * this.fovY(), n, s, r)
    this.pose.projection.copy(o)
    if (this.transition.active && this.transition.to.projection) {
      if (isProjectionOrtho(this.transition.to.projection)) {
        const n = getProjectionMatrixInverse(this.transition.to.projection)
        this.transition.to.projection.copy(OrthographicProjection(e, t, t / (2 * n), 1))
      } else {
        const e = 2 * MathUtils.RAD2DEG * Math.atan(1 / this.transition.to.projection.elements[5])
        this.transition.to.projection.makePerspectiveFov(e, n, CameraRigConfig.near, CameraRigConfig.far)
      }
    }
    this.pose.commit()
  }
  setAutoOrtho(e) {
    e !== this.pose.autoOrtho && (this.pose.setAutoOrtho(e), e ? this.pose.applyPhiBasedFovSquish() : this.pose.unapplyPhiBasedFovSquish(), this.pose.commit())
  }
  setBaseProjection(e: MatrixBase) {
    this._baseProjection = e
  }
  get width() {
    return this._width
  }
  get height() {
    return this._height
  }
  get screenDiagonalPx() {
    return Math.sqrt(this.width * this.width + this.height * this.height)
  }
  get baseFovY() {
    return this._baseFovY
  }
  aspect() {
    return this.pose.aspect()
  }
  fovY() {
    return this.pose.fovY()
  }
  fovX() {
    return this.pose.fovX()
  }
  isOrtho() {
    return this.pose.isOrtho()
  }
  baseZoom() {
    return this.pose.projection.elements[0] / 2
  }
  defaultZoom() {
    return isProjectionOrtho(this._baseProjection) ? getProjectionMatrixInverse(this._baseProjection) : this.perspectiveZoom()
  }
  zoom() {
    return this.isOrtho() ? this.orthoZoom() : this.perspectiveZoom()
  }
  orthoZoom() {
    const e = getProjectionMatrixInverse(this.pose.projection)
    return isNaN(e) ? this._lastOrthoZoom : ((this._lastOrthoZoom = e), e)
  }
  perspectiveZoom() {
    return this.baseFovY / this.fovY()
  }
  metersPerPx() {
    return calculateWorldUnitsFromScreenWidth(this.pose.focalDistance, this.pose.projection.asThreeMatrix4(), this.width)
  }
  copyTransition(e) {
    this.transition.active = e.active
    this.transition.activeInternal = e.activeInternal
    this.transition.type = e.type
    this.transition.startTime = e.startTime
    this.transition.duration = e.duration
    this.transition.rotationDelay = e.rotationDelay
    this.transition.rotationDuration = e.rotationDuration
    this.transition.matrixDelay = e.matrixDelay
    this.transition.matrixDuration = e.matrixDuration
    e.progress && this.transition.progress.copy(e.progress)
    e.blackoutProgress && this.transition.blackoutProgress.copy(e.blackoutProgress)
    e.from && copyTransition(e.from, this.transition.from)
    e.to && copyTransition(e.to, this.transition.to)
    this.transition.promise = e.promise
  }
  canTransition() {
    return !this.transition.active
  }
  clone() {
    const e = new CameraData(this.width, this.height)
    e.copy(this)
    return e
  }
  copy(e: CameraData) {
    this.pose.copy(e.pose)
    this.pose.commit()
    this._baseFovY = e.baseFovY
    this.copyTransition(e.transition)
    this.transition.commit()
    this._width = e.width
    this._height = e.height
  }
  shallowIsEqual(e: CameraData) {
    return (
      this.pose.position.equals(e.pose.position) &&
      this.pose.rotation.equals(e.pose.rotation) &&
      this.pose.projection.equals(e.pose.projection) &&
      this.pose.focalDistance === e.pose.focalDistance &&
      this.baseFovY === e.baseFovY
    )
  }
  isEqual(e: CameraData) {
    return this.shallowIsEqual(e) && this.transitionIsEqual(e.transition)
  }
  transitionIsEqual(e: Transition) {
    return (
      this.transition.active === e.active &&
      this.transition.type === e.type &&
      this.transition.progress.equals(e.progress) &&
      this.transition.blackoutProgress.equals(e.blackoutProgress) &&
      this.transition.rotationDelay === e.rotationDelay &&
      this.transition.rotationDuration === e.rotationDuration &&
      this.transition.matrixDelay === e.matrixDelay &&
      this.transition.matrixDuration === e.matrixDuration &&
      this.transition.activeInternal === e.activeInternal &&
      sameData(this.transition.from.position, e.from.position) &&
      sameData(this.transition.from.rotation, e.from.rotation) &&
      sameData(this.transition.from.projection, e.from.projection) &&
      sameData(this.transition.to.position, e.to.position) &&
      sameData(this.transition.to.rotation, e.to.rotation) &&
      sameData(this.transition.to.projection, e.to.projection) &&
      this.transition.startTime === e.startTime &&
      this.transition.duration === e.duration
    )
  }
}
