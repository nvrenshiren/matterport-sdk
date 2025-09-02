import { PanDirectionList, TransitionType } from "../const/transition.const"
import { SettingsData } from "../data/settings.data"
import CommonControlsModule from "../modules/commonControls.module"
import { SnapshotObject } from "../object/snapshot.object"
import { DirectionVector } from "../webgl/vector.const"
import * as L from "../const/21646"
import { TransitionFactory } from "./transition.factory"
import { Vector2 } from "three"
export class NopTransition {
  settingsData: SettingsData
  rotate: CommonControlsModule["startRotateTransition"]
  stopRotating: CommonControlsModule["stop"]
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: Promise<any> | null

  onStopRequested: () => Promise<void>
  getPanDirection: (t: SnapshotObject, e: SnapshotObject) => PanDirectionList
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
    this.getPanDirection = (t, e) => {
      let i = PanDirectionList.Right
      if (
        t &&
        t.metadata.scanId &&
        t.metadata.cameraQuaternion &&
        t.metadata.cameraPosition &&
        e &&
        e.metadata.scanId &&
        e.metadata.cameraPosition &&
        e.metadata.cameraQuaternion
      ) {
        const s = DirectionVector.FORWARD.clone().applyQuaternion(t.metadata.cameraQuaternion)
        const n = e.metadata.cameraPosition
        const o = t.metadata.cameraPosition
        let a = n.clone().sub(o).normalize()
        a.lengthSq() < L.Z.epsilon && (a = DirectionVector.FORWARD.clone().applyQuaternion(e.metadata.cameraQuaternion))
        s.cross(a).y > 0 && (i = PanDirectionList.Left)
      }
      return i
    }
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
    if (!t) throw Error("Tour pan requires two snapshots")
    if (!t.snapshot || !t.nextSnapshot) {
      this.currentTransitionPromise = Promise.resolve()
      this.toIndex = e
      this.started = Date.now()
      this.stopped = Date.now()
      return this
    }

    const { deferred: s } = this.build(t.snapshot, t.nextSnapshot, t.panOverrides, i)
    this.currentTransitionPromise = s.then(() => {
      this.currentTransitionPromise = null
      this.stopped = Date.now()
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
    const a = TransitionFactory.getPanValues(this.settingsData, !1, n, o)
    let r = a.direction
    ;(void 0 !== r && r !== PanDirectionList.Auto) || (r = this.getPanDirection(t, e))
    this.onStopRequested = async () => {
      await this.stopRotating()
    }
    this.duration = void 0 !== s ? s : a.ms
    return { deferred: this.rotate(this.duration, new Vector2(r! * a.radiansPerMs, 0)) }
  }
}
