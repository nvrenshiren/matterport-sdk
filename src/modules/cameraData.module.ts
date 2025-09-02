import { Euler, MathUtils, Quaternion, Ray, Vector3 } from "three"
import { NoTransitionViewmodeCommand, ResetCameraPitchCommand, TransitionViewmodeCommand } from "../command/camera.command"
import { CameraSymbol, VisibleMeshBoundsSymbol } from "../const/symbol.const"
import { OpenDeferred } from "../core/deferred"
import { NullGeneratorResult } from "../core/engineGenerators"
import { Message } from "../core/message"
import { Module } from "../core/module"
import { createSubscription } from "../core/subscription"
import { CameraData, copyTransition } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { SettingsData } from "../data/settings.data"
import { isProjectionOrtho } from "../math/81729"
import { CheckThreshold } from "../utils/49827"

import { TargetPhi, TransitionTypeList } from "../const/64918"
import { TransitionTimeConfig } from "../const/66777"
import Engine from "../core/engine"
import Market from "../core/market"
import { TransitionExceptionError } from "../error/transitionException.error"
import { adjustCameraPose } from "../math/59370"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { conditionalEase, easeInOutQuad, easeLiner, easeOutCubic, easeQuadratic } from "../utils/ease.utils"
import { MatrixBase } from "../webgl/matrix.base"
import { Pose } from "../webgl/pose"
import CommonControlsModule from "./commonControls.module"
import VisibleMeshBoundsModule from "./visibleMeshBounds.module"
declare global {
  interface SymbolModule {
    [CameraSymbol]: CameraDataModule
  }
}

class CameraMoveTo extends Message {
  from: {
    position?: Vector3
    rotation?: Quaternion
    projection?: Vector3
    focalDistance?: number
  }
  to: {
    position?: Vector3
    rotation?: Quaternion
    projection?: Vector3
    focalDistance?: number
  }
  timestamp: number

  constructor(e, t) {
    super()
    this.from = {}
    this.to = e
    this.timestamp = Date.now()
  }
}

class CameraMoveToDone extends CameraMoveTo {}

class CameraUnhandledException extends TransitionExceptionError {
  constructor(e = "Unhandled Camera Exception") {
    super(e)
    this.name = "CameraTransitionException"
  }
}

class CameraCannotMoveException extends TransitionExceptionError {
  constructor(e = "Cannot move while the camera is already moving") {
    super(e)
    this.name = "CameraTransitionException"
  }
}

export class PoseController {
  proxy: CameraPoseProxy
  target: CameraDataModule

  constructor(e, t) {
    this.proxy = e
    this.target = t
  }

  updateCameraPose(e) {
    this.proxy.activeSession(this) && this.target.updateCameraPose(e)
  }

  beginExternalTransition() {
    this.proxy.activeSession(this) && this.target.beginExternalTransition()
  }

  endExternalTransition() {
    this.proxy.activeSession(this) && this.target.endExternalTransition()
  }

  updateCameraPosition(e) {
    this.proxy.activeSession(this) && this.target.updateCameraPosition(e)
  }

  updateCameraRotation(e) {
    this.proxy.activeSession(this) && this.target.updateCameraRotation(e)
  }

  updateCameraFocus(e) {
    this.proxy.activeSession(this) && this.target.updateCameraFocus(e)
  }

  updateCameraProjection(e) {
    this.proxy.activeSession(this) && this.target.updateCameraProjection(e)
  }

  moveTo(e: MoveToParams) {
    return this.proxy.activeSession(this) ? this.target.moveTo(e) : OpenDeferred.resolve()
  }
}

export class CameraPoseProxy {
  controller: CameraDataModule
  data: Pose
  proxies: {
    controller?: PoseController
    requester: CommonControlsModule
  }[]

  constructor(e, t) {
    this.controller = e
    this.data = t
    this.proxies = []
  }

  get pose() {
    return this.data
  }

  activeSession(e: PoseController) {
    if (!this.proxies.length) return !1
    return this.proxies[this.proxies.length - 1].controller === e
  }

  newSession(e: CommonControlsModule) {
    let t: PoseController | null = null
    if (-1 !== this.proxies.findIndex(t => t.requester === e)) throw new Error("Cannot create two sessions with the same requester")
    return createSubscription(
      () => {
        if (!t) {
          if (this.proxies.length > 0) {
            const e = this.proxies[this.proxies.length - 1]
            e.requester.onAccessRevoked(e.controller)
          }
          t = new PoseController(this, this.controller)
          this.proxies.push({
            controller: t,
            requester: e
          })
          e.onAccessGranted(t)
        }
      },
      () => {
        if (t) {
          const index = this.proxies.findIndex(item => item.controller === t)
          if (-1 !== index) {
            const t = this.proxies[index],
              n = index === this.proxies.length - 1
            if (n) {
              t.requester.onAccessRevoked(t.controller)
            }
            this.proxies.splice(index, 1)
            if (this.proxies.length > 0 && n) {
              const e = this.proxies[this.proxies.length - 1]
              e.requester.onAccessGranted(e.controller!)
            }
          }
        }
      }
    )
  }
}
const transitionTypeConfig = {
  [TransitionTypeList.Instant]: {
    blackoutTime: 0,
    transitionTime: 0
  },
  [TransitionTypeList.FadeToBlack]: {
    blackoutTime: TransitionTimeConfig.camera.transitionBlackoutTime,
    transitionTime: 2 * TransitionTimeConfig.camera.transitionBlackoutTime
  },
  [TransitionTypeList.Interpolate]: {
    blackoutTime: 0,
    transitionTime: TransitionTimeConfig.camera.transitionFadeTime
  },
  [TransitionTypeList.MoveToBlack]: {
    blackoutTime: TransitionTimeConfig.camera.transitionBlackoutTime,
    transitionTime: TransitionTimeConfig.camera.transitionFadeTime
  },
  [TransitionTypeList.OrbitTo]: {
    blackoutTime: 0,
    transitionTime: TransitionTimeConfig.camera.transitionFadeTime
  }
}
export const TRANSITION_DISTANCE_MULTIPLIER = 166
export const baseTransitionSpeedKey = "Transition time"
export interface MoveToParams {
  easing?: (...args: number[]) => number
  rotationDelay?: number
  transitionType: TransitionTypeList
  pose: {
    position?: Vector3
    rotation?: Quaternion
    focalDistance?: number
    zoom?: number
    sweepID?: string
  }
  focalDistance?: number
  transitionTime?: number
  autoOrtho?: boolean
  projection?: MatrixBase
  targetPhi?: TargetPhi
  transitionSpeedMultiplier?: number
  blackoutTime?: number
  rotationDuration?: number
  matrixDelay?: number
  matrixDuration?: number
}
export default class CameraDataModule extends Module {
  transitionSpeed: number
  baseTransitionTime: number
  eulerCache: Euler
  quaternionCache: Quaternion
  computeOrbitDistance: () => number
  visibleMeshBounds: VisibleMeshBoundsModule
  cameraData: CameraData
  engine: Engine
  market: Market
  canvas: CanvasData
  cameraPoseProxy: CameraPoseProxy

  constructor() {
    super(...arguments)
    this.name = "camera-data"
    this.transitionSpeed = TransitionTimeConfig.camera.transitionSpeed
    this.baseTransitionTime = TransitionTimeConfig.camera.baseTransitionTime
    this.eulerCache = new Euler()
    this.quaternionCache = new Quaternion()
    this.computeOrbitDistance = () => {
      if (this.visibleMeshBounds) {
        const e = this.cameraData.pose,
          t = new Ray(e.position.clone(), e.forward().clone())
        return this.visibleMeshBounds.computeFocusPoint(t).distanceTo(e.position) / e.fovDistanceScale()
      }
      return this.cameraData.pose.fovCorrectedFocalDistance()
    }
  }
  async init(e, t) {
    this.engine = t
    this.market = t.market
    this.canvas = await t.market.waitForData(CanvasData)
    this.cameraData = new CameraData(this.canvas.width, this.canvas.height)
    this.market.register(this, CameraData, this.cameraData)
    this.cameraPoseProxy = new CameraPoseProxy(this, this.cameraData.pose)
    t.market.waitForData(SettingsData).then(e => {
      this.bindings.push(
        e.onPropertyChanged(baseTransitionSpeedKey, e => {
          this.baseTransitionTime = e
        }),
        t.commandBinder.addBinding(TransitionViewmodeCommand, async () => {
          this.cameraData.setAutoOrtho(!0)
        }),
        t.commandBinder.addBinding(NoTransitionViewmodeCommand, async () => {
          this.cameraData.setAutoOrtho(!1)
        })
      )
    })
    t.getModuleBySymbol(VisibleMeshBoundsSymbol).then(e => (this.visibleMeshBounds = e))
    this.bindings.push(
      t.commandBinder.addBinding(ResetCameraPitchCommand, async () => this.resetPitch()),
      t.subscribe(SetCameraDimensionsMessage, e => this.cameraData.setCameraDimensions(e.width, e.height))
    )
  }

  onUpdate(e) {}

  fromPose(e = !1) {
    const t = this.cameraData.pose

    return {
      position: e ? t.fovCorrectedPosition().clone() : t.position.clone(),
      rotation: t.rotation.clone(),
      projection: t.projection.clone(),
      focalDistance: e ? t.fovCorrectedFocalDistance() : t.focalDistance
    }
  }

  updateCameraPosition(e: Vector3) {
    this.cameraData.pose.position.copy(e)
    this.cameraData.pose.commit()
  }

  updateCameraProjection(e: MatrixBase) {
    this.cameraData.pose.projection.copy(e)
    this.cameraData.pose.commit()
  }
  updateCameraFocus(e: number) {
    this.cameraData.pose.focalDistance = e
    this.cameraData.pose.commit()
  }
  updateCameraRotation(e: Quaternion) {
    this.cameraData.pose.rotation.copy(e)
    this.cameraData.pose.commit()
  }
  updateCameraPose(e: Pose) {
    this.cameraData.pose.copy(e)
    this.cameraData.pose.commit()
  }
  resetPitch() {
    this.eulerCache.setFromQuaternion(this.cameraData.pose.rotation, "YXZ")
    this.eulerCache.x = 0
    this.eulerCache.z = 0
    this.quaternionCache.setFromEuler(this.eulerCache)
    this.updateCameraRotation(this.quaternionCache)
  }
  canTransition() {
    return this.cameraData.canTransition()
  }
  moveTo(e: MoveToParams) {
    if (!this.canTransition()) return OpenDeferred.reject(new CameraCannotMoveException("Tried to start transition while another transition was active"))
    const transitionType = transitionTypeConfig[e.transitionType]
    const rotation = e.pose.rotation
    const position = e.pose.position
    let projection = e.projection
    if (e.autoOrtho) {
      projection = void 0
    } else {
      if (e.pose.zoom && ((projection && isProjectionOrtho(projection)) || this.cameraData.isOrtho())) {
        projection = this.adjustProjectionZoom(projection || this.cameraData.pose.projection.clone(), e.pose.zoom)
      }
    }

    const blackoutTime = e.blackoutTime ? e.blackoutTime : transitionType.blackoutTime
    const o = e.transitionType
    const transitionSpeedMultiplier = e.transitionSpeedMultiplier ? 1 / e.transitionSpeedMultiplier : 1
    let transitionTime = o === TransitionTypeList.Instant ? 0 : e.transitionTime
    if (!transitionTime) {
      if (e.transitionType === TransitionTypeList.Interpolate && position) {
        const e = position.distanceTo(this.cameraData.pose.position)
        transitionTime = this.baseTransitionTime + Math.log2(1 + e) * TRANSITION_DISTANCE_MULTIPLIER * this.transitionSpeed * transitionSpeedMultiplier
      } else transitionTime = transitionType.transitionTime
    }

    const MoveFrom = this.fromPose(!!e.autoOrtho)
    const f = o === TransitionTypeList.OrbitTo ? e.targetPhi : void 0
    const g = o === TransitionTypeList.OrbitTo ? easeLiner : e.easing
    this.beginInternalTransition({
      transitionType: o,
      transitionTime,
      blackoutTime,
      pose: {
        position,
        rotation
      },
      autoOrtho: !!e.autoOrtho,
      projection,
      easing: g,
      rotationDelay: e.rotationDelay || 0,
      rotationDuration: e.rotationDuration || 1,
      matrixDelay: e.matrixDelay || 0,
      matrixDuration: e.matrixDuration || 1,
      focalDistance: e.focalDistance || MoveFrom.focalDistance,
      targetPhi: f
    })
    const MoveTo = {
      position: e.pose.position ? e.pose.position.clone() : void 0,
      rotation: e.pose.rotation ? e.pose.rotation.clone() : void 0,
      projection: e.projection ? e.projection.clone() : void 0,
      focalDistance: e.focalDistance ? e.focalDistance : void 0
    }
    this.engine.broadcast(new CameraMoveTo(MoveTo, MoveFrom))
    const S: OpenDeferred<any> | null = this.cameraData.transition.promise
    if (!S) return OpenDeferred.reject(new CameraUnhandledException("Expected promise to have been created."))
    const progressInternalTransition = this.progressInternalTransition.bind(this)
    const w = this.shouldProgressInternalTransition.bind(this)
    const A = this.endInternalTransition.bind(this)
    const N = this
    S.notify(0)
    this.engine.startGenerator(function* () {
      let t = 16
      for (t >= N.cameraData.transition.duration && (S.notify(0.5), yield new NullGeneratorResult()); w(t); ) {
        progressInternalTransition(t, blackoutTime)
        const e = CheckThreshold(t / N.cameraData.transition.duration, 0, 1)
        S.notify(e)
        yield new NullGeneratorResult()
        t = 16 + Date.now() - N.cameraData.transition.startTime
      }
      A(e.transitionType)
      N.cameraData.commit()
      S.notify(1)
      S.resolve()
      N.engine.broadcast(new CameraMoveToDone(MoveTo, MoveFrom))
    })
    return S.promise()
  }
  get transitionActive() {
    return this.cameraData.transition.active
  }

  setBaseProjection(e: MatrixBase) {
    this.cameraData.setBaseProjection(e)
  }

  async cancelTransition() {
    if (this.cameraData.transition.active)
      return new Promise(resolve => {
        copyTransition(this.cameraData.pose, this.cameraData.transition.to, !1)
        const t = Date.now() - this.cameraData.transition.startTime
        this.cameraData.transition.duration = t
        this.cameraData.transition.progress.stop(1)
        this.cameraData.pose.commit()
        this.cameraData.transition.commit()
        const n = this.cameraData.transition.onPropertyChanged("active", t => {
          if (!t) {
            n && n.cancel()
            resolve(1)
          }
        })
      })
  }
  updateTransitionSpeed(e: number) {
    if (this.cameraData.transition.active) {
      const t = Date.now(),
        n = t - this.cameraData.transition.startTime,
        i = n / e,
        s = this.cameraData.transition.progress,
        r = (s.duration - n) / e + i
      this.cameraData.transition.duration = r
      this.cameraData.transition.startTime = t - i
      s.modifyAnimation(s.value, s.endValue, r, s.easing, i)
      this.cameraData.transition.commit()
    }
  }

  beginExternalTransition() {
    if (!this.cameraData.transition.activeInternal) {
      this.cameraData.transition.startTime = Date.now()
      this.cameraData.transition.active = !0
      this.cameraData.transition.promise = new OpenDeferred()
      this.cameraData.transition.commit()
    }
  }

  endExternalTransition() {
    if (!this.cameraData.transition.activeInternal) {
      this.cameraData.transition.active = !1
      this.cameraData.transition.promise?.resolve()
      this.cameraData.transition.commit()
    }
  }
  beginInternalTransition(e: {
    transitionType: TransitionTypeList
    transitionTime: number
    blackoutTime: number
    pose: {
      position?: Vector3
      rotation?: Quaternion
    }
    autoOrtho: boolean
    projection?: MatrixBase
    easing?: (...args: number[]) => number
    rotationDelay: number
    rotationDuration: number
    matrixDelay: number
    matrixDuration: number
    focalDistance: number
    targetPhi?: TargetPhi
  }) {
    const t = e.transitionTime || 0
    this.cameraData.transition.startTime = Date.now()
    this.cameraData.transition.duration = t
    this.cameraData.transition.active = !0
    this.cameraData.transition.promise = new OpenDeferred()
    this.cameraData.transition.activeInternal = !0
    this.cameraData.transition.type = e.transitionType
    this.cameraData.transition.progress.modifyAnimation(0, 1, t, e.easing || easeInOutQuad)
    this.cameraData.transition.rotationDelay = e.rotationDelay || 0
    this.cameraData.transition.rotationDuration = e.rotationDuration || 1
    this.cameraData.transition.matrixDelay = e.matrixDelay || 0
    this.cameraData.transition.matrixDuration = e.matrixDuration || 1
    this.cameraData.transition.autoOrtho = !!e.autoOrtho

    if (e.transitionType === TransitionTypeList.FadeToBlack) {
      this.cameraData.transition.blackoutProgress.modifyAnimation(0, 1, e.blackoutTime, easeLiner)
    }
    if (e.transitionType === TransitionTypeList.MoveToBlack) {
      const e = 500
      this.cameraData.transition.blackoutProgress.modifyAnimation(0, 1, t - 2 * e, easeQuadratic, 0, e)
    }

    this.cameraData.transition.from = this.fromPose(!!e.autoOrtho)
    this.cameraData.transition.to.position = e.pose.position ? e.pose.position.clone() : void 0
    this.cameraData.transition.to.rotation = e.pose.rotation ? e.pose.rotation.clone() : void 0
    this.cameraData.transition.to.projection = e.projection ? e.projection.clone() : void 0
    this.cameraData.transition.to.focalDistance = e.focalDistance ? e.focalDistance : void 0
    if (e.targetPhi) {
      this.cameraData.transition.orbitStartDistance = this.computeOrbitDistance()
      this.cameraData.transition.orbitTarget = e.targetPhi
      this.cameraData.transition.orbitStartPhi = this.cameraData.pose.phi()
      this.cameraData.pose.focalDistance = this.cameraData.transition.orbitStartDistance * this.cameraData.pose.fovDistanceScale()
    }

    this.cameraData.transition.commit()
  }
  shouldProgressInternalTransition(e: number) {
    return this.cameraData.transition.type === TransitionTypeList.OrbitTo
      ? this.cameraData.transition.progress.value < 1
      : e < this.cameraData.transition.duration
  }
  progressInternalTransition(e: number, t: number) {
    if (this.cameraData.transition.active) {
      this.cameraData.transition.progress.updateAbsolute(e)
      if (this.cameraData.transition.type === TransitionTypeList.Interpolate) {
        this.updateInterpolateTransition()
      } else if (this.cameraData.transition.type === TransitionTypeList.FadeToBlack) {
        let n = 0
        const i = this.cameraData.transition.duration
        e <= t ? (n = e) : (copyTransition(this.cameraData.transition.to, this.cameraData.pose, !1), (n = e >= i - t ? i - e : t))
        this.cameraData.transition.blackoutProgress.updateAbsolute(n)
        this.cameraData.transition.progress.updateAbsolute(e <= t ? 0 : i)
      } else if (this.cameraData.transition.type === TransitionTypeList.MoveToBlack) {
        const t = this.cameraData.transition.blackoutProgress
        this.updateInterpolateTransition()
        t.updateAbsolute(e - t.delay)
      } else if (this.cameraData.transition.type === TransitionTypeList.OrbitTo) {
        this.updateOrbitToTransition()
      }
      this.cameraData.pose.commit()
      this.cameraData.transition.commit()
    }
  }
  updateOrbitToTransition() {
    if (null != this.cameraData.transition.orbitTarget) {
      const e = adjustCameraPose(
        this.cameraData.pose,
        this.cameraData.transition.orbitTarget,
        this.cameraData.transition.orbitStartPhi,
        this.cameraData.transition.orbitStartDistance,
        this.cameraData.pose
      )
      this.cameraData.transition.progress.updateProgress(e)
    }
  }
  updateInterpolateTransition() {
    const from = this.cameraData.transition.from,
      to = this.cameraData.transition.to
    if (to.position && from.position) {
      this.cameraData.pose.position.copy(from.position).lerp(to.position, this.cameraData.transition.progress.value)
    }
    if (to.focalDistance && from.focalDistance) {
      this.cameraData.pose.focalDistance = MathUtils.lerp(from.focalDistance, to.focalDistance, this.cameraData.transition.progress.value)
    }
    if (to.rotation && from.rotation) {
      const n = conditionalEase(
        this.cameraData.transition.progress.easing,
        this.cameraData.transition.progress.value,
        this.cameraData.transition.progress.elapsed,
        this.cameraData.transition.progress.duration * this.cameraData.transition.rotationDuration,
        this.cameraData.transition.rotationDelay
      )
      this.cameraData.pose.rotation.copy(from.rotation).slerp(to.rotation, n)
    }
    if (this.cameraData.transition.autoOrtho) this.cameraData.pose.resetProjMatrix(), this.cameraData.pose.applyPhiBasedFovSquish()
    else if (to.projection && from.projection) {
      const n = conditionalEase(
        easeOutCubic,
        this.cameraData.transition.progress.value,
        this.cameraData.transition.progress.elapsed,
        this.cameraData.transition.progress.duration * this.cameraData.transition.matrixDuration,
        this.cameraData.transition.matrixDelay
      )
      const s = this.cameraData.pose.projection.elements
      const r = from.projection.elements
      const a = to.projection.elements
      for (let e = 0; e < 16; e++) s[e] = r[e] * (1 - n) + a[e] * n
    }
  }
  endInternalTransition(e: TransitionTypeList) {
    if (e !== TransitionTypeList.OrbitTo) {
      copyTransition(this.cameraData.transition.to, this.cameraData.pose, !1)
      this.cameraData.transition.autoOrtho && (this.cameraData.pose.resetProjMatrix(), this.cameraData.pose.applyPhiBasedFovSquish())
    }
    this.cameraData.transition.type = null
    this.cameraData.transition.active = !1
    this.cameraData.transition.activeInternal = !1
    this.cameraData.transition.progress.stop(1)
    if ([TransitionTypeList.FadeToBlack, TransitionTypeList.MoveToBlack].includes(e)) {
      this.cameraData.transition.blackoutProgress.stop(0)
    }

    this.cameraData.pose.commit()
    this.cameraData.transition.commit()
  }
  adjustProjectionZoom(e: MatrixBase, t: number) {
    const n = 1 / t
    e.elements[0] = n / this.canvas.aspectRatio
    e.elements[5] = n
    return e
  }
}
