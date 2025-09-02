import { TransitionTypeList } from "../const/64918"
import { TransitionType } from "../const/transition.const"
import { ViewmodeData } from "../data/viewmode.data"
import CameraDataModule from "../modules/cameraData.module"
import SweepDataModule from "../modules/sweepData.module"
import ViewmodeModule from "../modules/viewmode.module"
import { SnapshotObject } from "../object/snapshot.object"

export class SweepMoveTransition {
  moveToSweep: SweepDataModule["moveToSweep"]
  viewmodeData: ViewmodeData
  cameraControl: CameraDataModule
  switchToMode: ViewmodeModule["switchToMode"]
  toIndex: number
  started: number
  stopped: number
  duration: number
  type: TransitionType
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e, i, s) {
    this.moveToSweep = t
    this.viewmodeData = e
    this.cameraControl = i
    this.switchToMode = s
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
  start(t: { snapshot: SnapshotObject; currentSweep?: string }, e: number) {
    if (this.active) throw Error("Transition already active")
    if (!t.snapshot) return (this.currentTransitionPromise = Promise.resolve()), (this.started = Date.now()), (this.stopped = Date.now()), this
    const { deferred: i } = this.build(t.snapshot, t.currentSweep)
    this.currentTransitionPromise = i.then(() => {
      this.currentTransitionPromise = null
      this.stopped = Date.now()
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
  build(t: SnapshotObject, e?: string) {
    let i = Promise.resolve()
    const s = t.metadata.cameraMode,
      n = t.metadata.cameraQuaternion,
      o = t.metadata.scanId,
      a = { position: t.metadata.cameraPosition, rotation: n, sweepID: o, zoom: t.metadata.orthoZoom },
      r = s !== this.viewmodeData.currentMode,
      h = !!o && this.viewmodeData.isInside()
    if (r) i = this.switchToMode(s, TransitionTypeList.Instant, a)
    else if (h) {
      const t = { transitionType: TransitionTypeList.Instant, sweepId: o, rotation: n }
      i = this.moveToSweep(t).nativePromise()
    } else i = this.cameraControl.moveTo({ transitionType: TransitionTypeList.Instant, pose: a }).nativePromise()
    return { deferred: i }
  }
}
