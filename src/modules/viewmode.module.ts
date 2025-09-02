import { MathUtils, Matrix4, Plane, Quaternion, Vector3 } from "three"
import { LockViewmodeCommand, UnlockViewmodeCommand } from "../command/viewmode.command"
import { TargetPhi, TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { CameraSymbol, ModelMeshSymbol, ModeSymbol, SweepDataSymbol } from "../const/symbol.const"
import { DeferredPromise, OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import MarketContext from "../core/marketContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { MeshData } from "../data/mesh.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { ViewmodeActiveTransitionError, ViewmodeInvalidError, ViewmodeLockedError } from "../error/viewmode.error"
import { calculatePitchAngle, isPitchFactorOrtho } from "../math/59370"
import {
  adjustVectorAngle,
  calculateCameraPositionAndRotation,
  calculateRayIntersection,
  calculateVectorFromAngle,
  calculateViewWidth,
  clampVectorLength,
  getQuaternionFromVectors,
  getRotationQuaternion,
  rotateVectorByAngle
} from "../math/81729"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { StartViewmodeChange, ViewModeChangeAnalyticsMessage, ViewModeChangeMessage } from "../message/viewmode.message"
import { CameraRigConfig, makePerspectiveFov, OrthographicProjection } from "../utils/camera.utils"
import { easeOutQuad } from "../utils/ease.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { MatrixBase } from "../webgl/matrix.base"
import { minPoseRad } from "../webgl/pose"
import { DirectionVector } from "../webgl/vector.const"
import CameraDataModule, { MoveToParams } from "./cameraData.module"
import SweepDataModule from "./sweepData.module"

declare global {
  interface SymbolModule {
    [ModeSymbol]: ViewmodeModule
  }
}
const S = (e, t, n, i) => {
    const s = n.clone().multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, 60 * MathUtils.DEG2RAD)),
      r = DirectionVector.FORWARD.clone()
        .applyQuaternion(s)
        .multiplyScalar(-1 * e),
      l = t.clone().add(r)
    return (i.position = l), (i.rotation = s), e
  },
  O = e => {
    const t = e.getCenter(new Vector3())
    return e.max.distanceTo(t) / Math.tan((CameraRigConfig.fov / 2) * MathUtils.DEG2RAD)
  }
const A = {
    rotationDuration: 1,
    rotationDelay: 0,
    matrixDelay: 0,
    matrixDuration: 0.5
  },
  N = {
    [ViewModes.Dollhouse]: {
      matrixDelay: 0.5,
      matrixDuration: 1
    },
    [ViewModes.Panorama]: {
      rotationDuration: 0.5
    }
  }
export const DEFAULT_TRANSITION_TIME = 1e3
export const SMALL_TRANSLATION_DISTANCE = 0.2
export const SMALL_ROTATION_DISTANCE = 3 * MathUtils.DEG2RAD
const j = Math.PI / 2 + Number.EPSILON
const U = Math.PI - Number.EPSILON
const F = [ViewModes.Mesh, ViewModes.Panorama, ViewModes.Floorplan, ViewModes.Dollhouse, ViewModes.Orthographic]
const H = {
  [ViewModes.Mesh]: DEFAULT_TRANSITION_TIME,
  [ViewModes.Panorama]: DEFAULT_TRANSITION_TIME,
  [ViewModes.Dollhouse]: DEFAULT_TRANSITION_TIME,
  [ViewModes.Floorplan]: DEFAULT_TRANSITION_TIME,
  [ViewModes.Orthographic]: DEFAULT_TRANSITION_TIME
}
export default class ViewmodeModule extends Module {
  data: ViewmodeData
  minDollhouseDistance: number
  maxDollhouseDistance: number
  peekabooActive: boolean
  _orthoMatrix: MatrixBase
  getFlyinStartPose: (e: any, t: any) => { position: any }
  cameraData: CameraData
  meshData: MeshData
  getFlyinEndPose: (e: any) => { position: Vector3; rotation: Quaternion }
  sweepData: SweepsData
  canvas: CanvasData
  engine: EngineContext
  market: MarketContext
  cameraModule: CameraDataModule
  sweepModule: SweepDataModule

  constructor() {
    super(...arguments)
    this.name = "viewmode"
    this.data = new ViewmodeData()
    this.minDollhouseDistance = 15
    this.maxDollhouseDistance = 50
    this.peekabooActive = !1
    this._orthoMatrix = new MatrixBase()
    this.getFlyinStartPose = (e, t) => {
      const i = e?.position || new Vector3(),
        s = t || this.cameraData.pose.position,
        r = i.y - s.y,
        l = getQuaternionFromVectors(i, s, this.meshData.meshCenter),
        c = DirectionVector.FORWARD.clone().applyQuaternion(l),
        d = (Math.sign(c.y) * Math.PI) / 4
      return {
        position: rotateVectorByAngle(i, s, d, !0).setY(1.5 * r)
      }
    }
    this.getFlyinEndPose = e => {
      const i = e.position || this.sweepData.getSweep(e?.sweepID || "invalid")?.position || new Vector3(),
        s = e.rotation || new Quaternion(),
        r = (Math.PI / 180) * CameraRigConfig.fov
      return calculateCameraPositionAndRotation({
        targetPosition: i,
        targetRotation: s,
        angleDown: -Math.PI / 6,
        box: this.meshData.meshBounds,
        fovY: r,
        aspectRatio: this.canvas.aspectRatio
      })
    }
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.market = t.market
    this.data.currentMode = e?.startingMode || ViewModes.Dollhouse
    this.market.register(this, ViewmodeData, this.data)
    t.market.waitForData(MeshData).then(e => {
      this.meshData = e
      this.setDollhouseBounds()
    })
    t.market.waitForData(SettingsData).then(e => {
      this.peekabooActive = e.tryGetProperty(DollhousePeekabooKey, !1)
      this.bindings.push(
        e.onPropertyChanged(DollhousePeekabooKey, e => {
          this.peekabooActive = e
        })
      )
    })
    this.bindings.push(
      t.commandBinder.addBinding(LockViewmodeCommand, this.lockViewmode.bind(this)),
      t.commandBinder.addBinding(UnlockViewmodeCommand, this.unlockViewmode.bind(this))
    )
    const [r, a, o, l, c] = await Promise.all([
      t.getModuleBySymbol(CameraSymbol),
      t.getModuleBySymbol(SweepDataSymbol),
      t.market.waitForData(SweepsData),
      t.market.waitForData(CanvasData),
      t.market.waitForData(CameraData)
    ])
    this.cameraModule = r
    this.sweepModule = a
    this.sweepData = o
    this.canvas = l
    this.cameraData = c
  }

  lockViewmode() {
    this.data.viewmodeChangeEnabled = !1
    this.data.commit()
  }

  unlockViewmode() {
    this.data.viewmodeChangeEnabled = !0
    this.data.commit()
  }

  get currentMode() {
    return this.data.currentMode
  }

  async switchToMode(e: ViewModes, t = TransitionTypeList.FadeToBlack, n?: MoveToParams["pose"], a?: number, o?: number) {
    if (this.peekabooActive) {
      return this.switchToModePeekaboo(e, t, n, a, o)
    }
    this.log.debug(`switchToMode mode:${ViewModes[e]} type:${TransitionTypeList[t]}`)
    const l = this.isAlreadyInMode(e)
    const c = !n || (n && !ViewmodeModule.willPoseChange(this.cameraData, n))
    if (l && c) return
    if (!F.includes(e) || (this.data.isFloorplanDisabled() && e === ViewModes.Floorplan) || (this.data.isDollhouseDisabled() && e === ViewModes.Dollhouse)) {
      throw new ViewmodeInvalidError(`Cannot change to invalid viewmode ${e}`)
    }

    this.meshData ||
      (e !== ViewModes.Floorplan && e !== ViewModes.Dollhouse) ||
      (await (
        await this.engine.getModuleBySymbol(ModelMeshSymbol)
      ).firstMeshLoadPromise)
    const d = !this.cameraData.canTransition()
    if (!this.data.canStartTransition() || d) throw new ViewmodeActiveTransitionError()
    if (e !== this.currentMode && !this.data.viewmodeChangeEnabled) throw new ViewmodeLockedError()
    let u = void 0 !== a ? a : H[e]
    t === TransitionTypeList.Instant && (u = 0),
      this.sweepData.currentSweep && this.sweepData.isSweepUnaligned(this.sweepData.currentSweep) && !PanoramaOrMesh(e) && (t = TransitionTypeList.FadeToBlack)
    const h = Object.assign({}, this.data.transition),
      v = this.data.currentMode
    let y = !1
    const b = t => {
      this.data.transition.progress = t
      this.data.commit()
      t >= 0.5 && !y && ((y = !0), this.engine.broadcast(new ViewModeChangeMessage(e, null != v ? v : void 0)))
    }
    const E = () => {
      this.data.transition.progress = 1
      this.data.currentMode = e
      this.data.deactivateTransition()
      this.data.commit()
      this.engine.broadcast(new EndSwitchViewmodeMessage(e, null != v ? v : void 0))
    }
    let S: DeferredPromise<any>

    this.data.activateTransition(this.data.currentMode, e, u)
    this.data.currentMode = ViewModes.Transition
    this.data.commit()
    this.engine.broadcast(new StartViewmodeChange(e, null != v ? v : void 0))
    switch (e) {
      case ViewModes.Mesh:
      case ViewModes.Panorama:
        S = this.moveCameraToPanorama(v, t, u, n)
        break
      case ViewModes.Dollhouse:
        this.peekabooActive && this.cameraData.setAutoOrtho(!0), (S = this.moveCameraToDollhouse(t, u, n))
        break
      case ViewModes.Floorplan:
        S = this.moveCameraToFloorplan(null != v ? v : void 0, t, u, n)
        break
      case ViewModes.Orthographic:
        S = this.moveCameraToOrthographic(null != v ? v : void 0, t, u, n)
        break
      default:
        throw new ViewmodeInvalidError(`Invalid target mode ${e}`)
    }
    try {
      S.progress(b)
      await S.nativePromise()
      E()
    } catch (e) {
      throw ((this.data.currentMode = v), (this.data.transition = h), this.data.commit(), e)
    }
  }

  async switchToModePeekaboo(e: ViewModes, t = TransitionTypeList.FadeToBlack, n?: MoveToParams["pose"], a?: number, o?: number) {
    this.log.debug(`switchToMode mode:${ViewModes[e]} type:${TransitionTypeList[t]}`)
    this.fixHighPhiPose(e, n)
    const l = !n || (n && !ViewmodeModule.willPoseChange(this.cameraData, n))
    if (this.isAlreadyInMode(e) && l) return
    if (!F.includes(e) || (this.data.isFloorplanDisabled() && e === ViewModes.Floorplan) || (this.data.isDollhouseDisabled() && e === ViewModes.Dollhouse)) {
      throw new ViewmodeInvalidError(`Cannot change to invalid viewmode ${e}`)
    }
    if (!this.meshData) {
      if ([ViewModes.Floorplan, ViewModes.Dollhouse].includes(e)) {
        await (
          await this.engine.getModuleBySymbol(ModelMeshSymbol)
        ).firstMeshLoadPromise
      }
    }

    const c = !this.cameraData.canTransition()
    if (!this.data.canStartTransition() || c) {
      throw new ViewmodeActiveTransitionError()
    }
    if (e !== this.currentMode && !this.data.viewmodeChangeEnabled) {
      throw new ViewmodeLockedError()
    }
    this.engine.broadcast(new ViewModeChangeAnalyticsMessage(e))
    let d = void 0 !== a ? a : H[e]
    t === TransitionTypeList.Instant && (d = 0)
    if (this.sweepData.currentSweep && this.sweepData.isSweepUnaligned(this.sweepData.currentSweep) && !PanoramaOrMesh(e)) {
      t = TransitionTypeList.FadeToBlack
    }

    let u = e
    e === ViewModes.Floorplan && (u = ViewModes.Dollhouse)
    const h = Object.assign({}, this.data.transition)
    const y = this.data.currentMode
    const b = () => {
      this.data.transition.active = !0
      this.data.activateTransition(this.data.currentMode, u, d)
      this.data.currentMode = ViewModes.Transition
      this.data.commit()
      this.engine.broadcast(new StartViewmodeChange(u, null != y ? y : void 0))
    }
    let S = !1
    const O = e => {
      this.data.transition.progress = e
      this.data.commit()
      e >= 0.5 && !S && ((S = !0), this.engine.broadcast(new ViewModeChangeMessage(u, null != y ? y : void 0)))
    }
    const T = () => {
      this.data.transition.active = !1
      this.data.transition.progress = 1
      this.data.currentMode = u
      this.data.deactivateTransition()
      this.data.commit()
    }
    const pitchFactor = isPitchFactorOrtho(this.cameraData.pose.pitchFactor())
    const w = n && n.position && n.rotation
    let A = !1
    const N = y === ViewModes.Dollhouse || y === ViewModes.Floorplan
    const I = () =>
      this.cameraModule.moveTo({
        transitionType: TransitionTypeList.OrbitTo,
        pose: {},
        autoOrtho: !0,
        targetPhi: TargetPhi.Top
      })
    const P = () =>
      this.cameraModule.moveTo({
        transitionType: TransitionTypeList.OrbitTo,
        pose: {},
        autoOrtho: !0,
        targetPhi: TargetPhi.Bottom
      })
    const x: Array<() => DeferredPromise<any>> = []
    if (pitchFactor && e === ViewModes.Dollhouse) {
      if (!w) {
        A = !0
      }
      x.push(P)
    } else {
      if (!N || e !== ViewModes.Floorplan || w || o) {
        pitchFactor && N && (e === ViewModes.Panorama || e === ViewModes.Mesh) && x.push(P)
      } else {
        if (!w) {
          A = !0
        }
        x.push(I)
      }
    }
    let k = () => OpenDeferred.resolve()
    let L = !1
    if (!A || o) {
      let i = n
      switch (e) {
        case ViewModes.Mesh:
        case ViewModes.Panorama:
          k = () => this.moveCameraToPanorama(y, t, d, n)
          break
        case ViewModes.Floorplan:
          const r = pitchFactor || 0 === d
          i = this.getPeekabooDollhousePoseFromFloorplanPose(n, r)
          if (r && i) {
            this.cameraData.setAutoOrtho(!0)
            k = () =>
              i
                ? this.cameraModule.moveTo({
                    transitionType: t,
                    pose: i,
                    transitionTime: d,
                    focalDistance: i.focalDistance,
                    autoOrtho: !0
                  })
                : OpenDeferred.resolve()
            break
          }
          L = !0
        case ViewModes.Dollhouse:
          this.cameraData.setAutoOrtho(!0)
          k = () => this.moveCameraToDollhouse(t, d, i, L)
          break
        case ViewModes.Orthographic:
          this.cameraData.setAutoOrtho(!1)
          k = () => this.moveCameraToOrthographic(null != y ? y : void 0, t, d, n)
          break
        default:
          throw new ViewmodeInvalidError(`Invalid target mode ${e}`)
      }
    }
    x.push(k)
    if ((!pitchFactor && y !== ViewModes.Dollhouse && e === ViewModes.Floorplan) || L) {
      x.push(I)
    }
    try {
      const e = x.length
      b()
      for (let t = 0; t < e; t++) {
        const n = t / e,
          i = x[t]()
        i.progress(t => O(t / e + n))
        await i
      }
      T()
    } catch (e) {
      throw ((this.data.currentMode = y), (this.data.transition = h), this.data.commit(), e)
    }
    !A && this.engine.broadcast(new EndSwitchViewmodeMessage(u, null != y ? y : void 0))
  }

  isAlreadyInMode(e: ViewModes) {
    const { data } = this
    const same = data.transition.from === data.transition.to
    let inMode = data.currentMode === e
    if (this.peekabooActive) {
      const n = data.currentMode === ViewModes.Floorplan || data.currentMode === ViewModes.Dollhouse
      let currentMode = data.currentMode
      n && (currentMode = isPitchFactorOrtho(this.cameraData.pose.pitchFactor()) ? ViewModes.Floorplan : ViewModes.Dollhouse)
      inMode = currentMode === e
    }
    return (data.transition.active && same) || inMode
  }

  static willPoseChange(e: CameraData, t?: MoveToParams["pose"]) {
    return (t?.position && !e.pose.position.equals(t.position)) || (t?.rotation && !e.pose.rotation.equals(t.rotation)) || (t?.zoom && e.zoom() !== t.zoom)
  }

  moveCameraToPanorama(e, t, n, i) {
    let c = i?.sweepID || this.sweepData.currentSweep
    if (!c) {
      c = this.sweepData.getFirstSweep()?.id
    }
    let d = i?.rotation
    if (!d) {
      const t = (e === ViewModes.Floorplan ? DirectionVector.UP : DirectionVector.FORWARD)
        .clone()
        .applyQuaternion(this.cameraData.pose.rotation)
        .setY(0)
        .normalize()
      d = new Quaternion().setFromUnitVectors(DirectionVector.FORWARD, t)
    }
    return this.sweepModule.moveToSweep({
      transitionType: t,
      sweepId: c,
      rotation: d,
      transitionTime: n,
      rotationDelay: 0.5
    })
  }

  moveCameraToDollhouse(e, t, n, i = !1) {
    var r
    const c = this.meshData.meshBounds,
      d: { position?: Vector3; rotation?: Quaternion } = {}
    let u,
      h = t
    if (n && (n.position || n.rotation)) {
      if (n.position && n.rotation) {
        d.position = n.position
        d.rotation = n.rotation
        const e = new Vector3().copy(this.meshData.meshCenter)
        if (calculatePitchAngle(n.rotation) * MathUtils.RAD2DEG > 5) {
          const t = Math.min(this.meshData.meshCenter.y, n.position.y - 1),
            i = new Plane(DirectionVector.UP.clone(), t),
            s = calculateRayIntersection(d.position, d.rotation, i)
          s && e.copy(s)
        }
        u = d.position?.distanceTo(e)
        d.rotation = getRotationQuaternion(n.position, e)
      } else if (n.position) (d.position = n.position), (d.rotation = (0, getRotationQuaternion)(n.position, this.meshData.meshCenter))
      else {
        d.rotation = null !== (r = n.rotation) && void 0 !== r ? r : new Quaternion()
        const e = c.min.distanceTo(c.max)
        d.position = calculateVectorFromAngle(d.rotation, this.meshData.meshCenter, e)
      }
      u || (u = this.meshData.meshCenter.clone().distanceTo(d.position))
    } else {
      let e, t
      const n = this.sweepData.isSweepUnaligned(this.sweepData?.currentSweep)
      let r = this.cameraData.pose.position
      if (
        (n || this.data.transition.from === ViewModes.Floorplan
          ? (r = this.meshData.meshCenter)
          : this.data.transition.from === ViewModes.Dollhouse &&
            (r = this.cameraData.pose
              .focalPoint()
              .clone()
              .add(new Vector3(0, 1, 0))),
        this.data.transition.from !== ViewModes.Floorplan)
      )
        if (this.peekabooActive) {
          const e = ((e, t, n, i, s = !1) => {
            const r = 30 * MathUtils.DEG2RAD,
              l = i < 1,
              c = 1.2 * O(n),
              d = e.clone().add(new Vector3(0, -1, 0)),
              u = calculatePitchAngle(t),
              h = t.clone().multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, u))
            let p = h
            if (s) {
              const e = n.getCenter(new Vector3())
              d.x = e.x
              d.z = e.z
              const t = n.getSize(new Vector3()),
                i = t.x / t.z < 1,
                s = DirectionVector.FORWARD.clone().applyQuaternion(h).normalize(),
                r = l === i ? new Vector3(0, 0, -(Math.sign(s.z) || 1)) : new Vector3(-(Math.sign(s.x) || 1), 0, 0)
              p = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(new Vector3().crossVectors(DirectionVector.UP, r), DirectionVector.UP, r))
              d.add(r.clone().multiplyScalar(1))
            }
            const m = p.multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, -r)),
              f = DirectionVector.FORWARD.clone().applyQuaternion(m)
            return {
              position: d.clone().add(f.clone().multiplyScalar(-c)),
              rotation: m,
              focalDistance: c
            }
          })(r, this.cameraData.pose.rotation, c, this.canvas.aspectRatio, i)
          ;(d.position = e.position), (d.rotation = e.rotation), (u = e.focalDistance)
          const t = d.position.distanceTo(this.cameraData.pose.position) < SMALL_TRANSLATION_DISTANCE,
            n = d.rotation.angleTo(this.cameraData.pose.rotation) < SMALL_ROTATION_DISTANCE
          t && n && (h = 0)
        } else {
          const n = 1.5,
            i = calculateCameraPositionAndRotation({
              targetPosition: this.cameraData.pose.position,
              targetRotation: this.cameraData.pose.rotation,
              angleDown: -Math.PI / 6,
              box: c,
              fovY: this.cameraData.fovY() * n,
              aspectRatio: this.cameraData.pose.aspect()
            }),
            s = ((e, t) => {
              const n = e.clone().add(new Vector3(0, 6, 0)),
                i = DirectionVector.FORWARD.clone().applyQuaternion(t)
              return (
                i.y >= 0.01 && (i.y = 0.01),
                {
                  position: n.clone().add(i.clone().multiplyScalar(-10)),
                  direction: i
                }
              )
            })(r, this.cameraData.pose.rotation)
          ;[e, t] = [i.position, s.direction]
          const l = r.clone().add(t).setY(this.meshData.meshCenter.y)
          d.position = clampVectorLength(e, l, this.minDollhouseDistance, this.maxDollhouseDistance)
          d.position = adjustVectorAngle(d.position, l, j, U)
          d.rotation = getRotationQuaternion(d.position!, l)
          u = l.distanceTo(d?.position || new Vector3())
        }
      else
        u = ((e, t, n) => {
          const i = e.getCenter(new Vector3()),
            s = O(e)
          return S(s, i, t, n)
        })(this.meshData.meshBounds, this.cameraData.pose.rotation, d)
    }
    return this.cameraModule.moveTo({
      transitionType: e,
      pose: d,
      transitionTime: h,
      autoOrtho: !!this.peekabooActive || void 0,
      projection: makePerspectiveFov(this.cameraData.aspect()),
      focalDistance: u,
      rotationDuration: 0.5
    })
  }

  setDollhouseBounds() {
    const e = this.meshData.extendedBounds
    const t = e.min.distanceTo(e.max)
    this.minDollhouseDistance = Math.min(t / 2, this.minDollhouseDistance)
    this.maxDollhouseDistance = Math.max(t, this.maxDollhouseDistance)
  }

  moveCameraToFloorplan(e, t, n, i) {
    const s: {
        position?: Vector3
        rotation?: Quaternion
      } = {},
      r = this.meshData.meshCenter,
      c = this.meshData.meshSize,
      d = Math.max(c.x, c.z),
      u = this.canvas.aspectRatio,
      h = this.getDefaultFloorplanZoom(this.meshData.meshSize),
      p = i && i.zoom ? this.canvas.height / (2 * i.zoom) : h,
      m = OrthographicProjection(this.canvas.width, this.canvas.height, p),
      f = this.getDefaultFloorplanZoom(this.meshData.extendedSize),
      g = OrthographicProjection(this.canvas.width, this.canvas.height, f)
    this.cameraModule.setBaseProjection(g)
    this.cameraData.pose.setAutoOrtho(!1)
    if (i && i.position) {
      s.position = i.position
    } else {
      const e = DirectionVector.UP.clone().multiplyScalar(d)
      s.position = r.clone().add(e)
    }
    if (i && i.rotation) {
      s.rotation = i.rotation
    } else {
      const e = new MatrixBase().setPosition(s?.position || new Vector3())
      e.lookAt(s?.position || new Vector3(), r, DirectionVector.FORWARD)
      s.rotation = new Quaternion().setFromRotationMatrix(e.asThreeMatrix4())
      if (u < 1 !== c.x / c.z < 1) {
        const e = new Quaternion().setFromUnitVectors(DirectionVector.UP, DirectionVector.LEFT)
        s.rotation.multiply(e)
      }
    }
    const v = s?.position!.y - this.meshData.meshCenter.y
    let y = Object.assign(Object.assign({}, A), {
      easing: easeOutQuad,
      transitionType: t,
      pose: s,
      transitionTime: n,
      projection: m,
      focalDistance: v
    })
    if (e && e in N) {
      y = Object.assign(Object.assign({}, N[e]), y)
    }
    return this.cameraModule.moveTo(y)
  }

  moveCameraToOrthographic(e, t, n, i) {
    const s = i && i.zoom ? i.zoom : this.getDefaultFloorplanZoom(this.meshData.extendedSize),
      r = OrthographicProjection(this.canvas.width, this.canvas.height, s, 1, void 0, void 0, this._orthoMatrix)
    this.cameraModule.setBaseProjection(r)
    const a = {
      easing: easeOutQuad,
      transitionType: t,
      pose: i || {},
      transitionTime: n,
      projection: r,
      focalDistance: 2
    }
    return this.cameraModule.moveTo(a)
  }

  getPeekabooDollhousePoseFromFloorplanPose(e, t = !1) {
    let n
    if (e && e.position && e.rotation && e.zoom) {
      const i = e.position,
        s = e.rotation,
        r = calculateViewWidth(e.zoom)
      t
        ? (n = {
            position: new Vector3(i.x, this.meshData.meshCenter.y + r, i.z),
            rotation: e.rotation.clone(),
            focalDistance: r
          })
        : ((n = {
            position: new Vector3(),
            rotation: new Quaternion(),
            focalDistance: r
          }),
          S(r, new Vector3(i.x, this.meshData.meshCenter.y, i.z), s, n))
    }
    return n
  }

  fixHighPhiPose(e: ViewModes, t?: MoveToParams["pose"]) {
    if (t?.rotation && t?.position && calculatePitchAngle(t.rotation) > minPoseRad && e === ViewModes.Dollhouse) {
      const [e, n] = this.setPhi(t?.position, t.rotation)
      t.position = t.position.clone().add(n)
      t.rotation = e
    }
  }

  setPhi(e, t) {
    const i = calculatePitchAngle(t),
      s = this?.meshData?.meshCenter.y || 0,
      r = Math.abs(s - e.y) * Math.tan(Math.abs(minPoseRad - i)),
      l = t
        .clone()
        .multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, i))
        .multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, -minPoseRad)),
      c = DirectionVector.UP.clone().applyQuaternion(l)
    c.y = 0
    c.normalize().multiplyScalar(-r)
    return [l, c]
  }

  getDefaultFloorplanZoom(e) {
    const t = Math.max(e.x, e.z),
      n = Math.min(e.x, e.z),
      i = this.canvas.aspectRatio,
      s = Math.max(t, n / i),
      r = Math.max(n, t / i),
      a = i < 1 ? s : r
    return this.canvas.height / (1.2 * a)
  }
}
// export const DEFAULT_TRANSITION_TIME = DEFAULT_TRANSITION_TIME
// export const SMALL_ROTATION_DISTANCE = SMALL_ROTATION_DISTANCE
// export const SMALL_TRANSLATION_DISTANCE = R
