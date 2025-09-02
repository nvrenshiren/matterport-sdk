import { Quaternion, Vector3 } from "three"
import * as b from "../math/2569"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { TransitionType } from "../const/transition.const"
import { DeferredPromise, OpenDeferred } from "../core/deferred"
import { NullGeneratorResult, WaitForPromiseGeneratorResult } from "../core/engineGenerators"
import { SettingsData } from "../data/settings.data"
import { ViewmodeData } from "../data/viewmode.data"
import { easeInQuad } from "../utils/ease.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { Pose } from "../webgl/pose"
import { TransitionFactory } from "./transition.factory"
import CameraDataModule from "../modules/cameraData.module"
import SweepDataModule from "../modules/sweepData.module"
import ViewmodeModule from "../modules/viewmode.module"
import SweepPathModule from "../modules/sweepPath.module"
import EngineContext from "../core/engineContext"
import { SnapshotObject } from "../object/snapshot.object"
import { calculateQuaternionAngle } from "../math/2569"

export class SnapshotMoveTransition {
  settingsData: SettingsData
  cameraPose: Pose
  viewmodeData: ViewmodeData
  cameraControl: CameraDataModule
  sweepControl: SweepDataModule
  switchToMode: ViewmodeModule["switchToMode"]
  setRestrictedSweeps: SweepPathModule["setRestrictedSweeps"]
  generators: EngineContext
  toIndex: number
  started: number
  stopped: number
  duration: number
  type: TransitionType
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e, i, s, n, o, a, r) {
    this.settingsData = t
    this.cameraPose = e
    this.viewmodeData = i
    this.cameraControl = s
    this.sweepControl = n
    this.switchToMode = o
    this.setRestrictedSweeps = a
    this.generators = r
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
    this.type = TransitionType.Move
    this.currentTransitionPromise = null
    this.onStopRequested = () => Promise.resolve()
  }
  get active() {
    return null !== this.currentTransitionPromise
  }
  get promise() {
    return this.currentTransitionPromise ? this.currentTransitionPromise : Promise.resolve()
  }
  async stop() {
    this.currentTransitionPromise && (await this.onStopRequested(), await this.promise, (this.currentTransitionPromise = null), (this.stopped = Date.now()))
  }
  start(t: { snapshot: SnapshotObject; currentSweep?: string; transitionType: TransitionTypeList }, e: number) {
    if (this.active) throw Error("Transition already active")
    if (!t.snapshot) return (this.currentTransitionPromise = Promise.resolve()), this
    const { deferred: i } = this.build(t.snapshot, t.currentSweep, t.transitionType)
    this.currentTransitionPromise = i.then(() => {
      ;(this.currentTransitionPromise = null), (this.stopped = Date.now())
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
  build(t: SnapshotObject, e: string | undefined, i: TransitionTypeList) {
    let s = Promise.resolve()
    const n = t.metadata.cameraMode
    const o = t.metadata.cameraQuaternion
    const r = t.metadata.scanId
    const h = this.cameraPose.rotation
    const d = calculateQuaternionAngle(h, o)
    const l = t.metadata.cameraPosition
    const c = this.settingsData.tryGetProperty(DollhousePeekabooKey, !1)
    const u = !t.is360
    const p = { position: l, rotation: o, sweepID: r, zoom: t.metadata.orthoZoom }
    let m = TransitionFactory.getOtherModeTransitionTime(this.settingsData, d, i)
    const g = this.cameraPose.pitchFactor()
    const f = this.viewmodeData.isDollhouse() && !(this.viewmodeData.isDollhouse() && g <= 0.9)
    const v = this.viewmodeData.isFloorplan() || (this.viewmodeData.isDollhouse() && g <= 1e-5)
    const w = n === ViewModes.Floorplan
    const y = n === ViewModes.Dollhouse
    const D = c && ((y && !f) || (w && !v))
    if (n !== this.viewmodeData.currentMode || D) s = this.switchToMode(n, i, p, m)
    else {
      if (!!r && this.viewmodeData.isInside()) {
        !e || r !== e
          ? ((m = TransitionFactory.getTransitionTime(this.settingsData)), (s = this.standardTransitionSweepMovePromise(p, r, u, m)))
          : ((m = TransitionFactory.getSamePanoTransitionTime(this.settingsData, d)), (s = this.standardTransitionSameSweepRotationPromise(p, d, m)))
      } else s = this.cameraControl.moveTo({ transitionType: i, pose: p, transitionTime: m }).nativePromise()
    }
    this.duration = void 0 !== m ? m : 0
    return { deferred: s }
  }
  standardTransitionSameSweepRotationPromise(t, e, i) {
    if (!t.rotation) throw Error("Rotation transition requires a rotation")
    return e < 0.01
      ? Promise.resolve()
      : (this.setRestrictedSweeps(null),
        this.cameraControl.moveTo({ transitionType: TransitionTypeList.Interpolate, pose: { rotation: t.rotation }, transitionTime: i }).nativePromise())
  }
  standardTransitionSweepMovePromise(
    t: {
      position: Vector3
      rotation: Quaternion
      sweepID: string
      zoom: number
    },
    e: string,
    i: boolean,
    n: number
  ) {
    if (!t.position) throw Error("Push transition requires a position")
    const o = t.position.clone().sub(this.cameraPose.position).normalize()
    const a = this.cameraPose.position.clone().add(o.multiplyScalar(0.15))
    const r = new OpenDeferred()
    this.setRestrictedSweeps(null)
    const h = this
    this.generators.startGenerator(function* () {
      yield new WaitForPromiseGeneratorResult(h.sweepControl.activateSweepUnsafe({ sweepId: e }))
      const o = new Vector3()
      const d = h.cameraPose.position.clone()
      const l = Date.now()
      let u: DeferredPromise<any> | undefined
      let p = 0
      let m = !1
      let g = !1
      for (; p < n; ) {
        const r = easeInQuad(p, 0, p / n, n)
        i && h.cameraControl.updateCameraPosition(o.copy(d).lerp(a, r)),
          r >= 0.3 &&
            !g &&
            ((u = h.cameraControl.moveTo({ transitionType: TransitionTypeList.FadeToBlack, pose: t, transitionTime: n, blackoutTime: 0.5 * n }).progress(t => {
              t >= 0.5 && !m && (h.sweepControl.instantSweepTransition(e), (m = !0))
            })),
            (g = !0)),
          yield new NullGeneratorResult(),
          (p = Date.now() - l)
      }
      u && (yield new WaitForPromiseGeneratorResult(u.nativePromise()))
      r.resolve()
    })
    return r.nativePromise()
  }
}
