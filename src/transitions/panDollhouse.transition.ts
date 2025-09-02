import { Vector2 } from "three"
import { PanDirectionList, TransitionType } from "../const/transition.const"
import { SettingsData } from "../data/settings.data"
import { DirectionVector } from "../webgl/vector.const"
import { TransitionFactory } from "./transition.factory"
import { SnapshotObject } from "../object/snapshot.object"

export class PanDollhouseTransition {
  settingsData: SettingsData
  rotate: TransitionFactory["startRotateTransition"]
  stopRotating: TransitionFactory["stopCamera"]
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e, i) {
    this.settingsData = t
    this.rotate = e
    this.stopRotating = i
    this.type = TransitionType.Burns
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
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
  start(
    t: {
      snapshot: SnapshotObject
      nextSnapshot: SnapshotObject
      panOverrides: {
        panDirection?: PanDirectionList
        panAngle?: number
      }
    },
    e: number,
    i?: number
  ) {
    if (this.active) throw Error("Transition already active")
    if (!t.snapshot || !t.nextSnapshot) return (this.currentTransitionPromise = Promise.resolve()), this
    const { deferred: s } = this.build(t.snapshot, t.nextSnapshot, t.panOverrides, i)
    this.currentTransitionPromise = s.then(() => {
      ;(this.currentTransitionPromise = null), (this.stopped = Date.now())
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
  build(
    t: SnapshotObject,
    e: SnapshotObject,
    i: {
      panDirection?: PanDirectionList
      panAngle?: number
    },
    s?: number
  ) {
    const { panDirection: n, panAngle: o } = i
    const a = TransitionFactory.getPanValues(this.settingsData, !0, n, o)
    let r = -1 * a.radiansPerMs
    this.duration = void 0 !== s ? s : a.ms
    const h = a.direction
    if (void 0 !== h && h !== PanDirectionList.Auto) r *= h!
    else if (t && t.metadata.cameraQuaternion && e && e.metadata.cameraQuaternion) {
      const i = DirectionVector.FORWARD.clone().applyQuaternion(t.metadata.cameraQuaternion)
      const s = DirectionVector.FORWARD.clone().applyQuaternion(e.metadata.cameraQuaternion)
      const n = Math.sign(i.cross(s).y)
      r = 0 !== n ? r * n : r
    }
    this.onStopRequested = async () => {
      await this.stopRotating()
    }
    return { deferred: this.rotate(this.duration, new Vector2(r, 0)) }
  }
}
