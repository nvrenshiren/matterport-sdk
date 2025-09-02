import { Vector2 } from "three"
import { PanDirectionList, TransitionType } from "../const/transition.const"
import { SettingsData } from "../data/settings.data"
import { SnapshotObject } from "../object/snapshot.object"
import { SweepObject } from "../object/sweep.object"
import { PanoramaOrMesh } from "../utils/viewMode.utils"
import { Pose } from "../webgl/pose"
import { DirectionVector } from "../webgl/vector.const"
import { TransitionFactory } from "./transition.factory"

export class PanTransition {
  settingsData: SettingsData
  cameraPose: Pose
  rotate: TransitionFactory["startRotateTransition"]
  stopRotating: TransitionFactory["stopCamera"]
  getCurve: TransitionFactory["getCurveForPath"]
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e, i, s, n) {
    this.settingsData = t
    this.cameraPose = e
    this.rotate = i
    this.stopRotating = s
    this.getCurve = n
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
      path: SweepObject[] | null
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
    const { deferred: s } = this.build(t.path, t.snapshot, t.nextSnapshot, t.panOverrides, i)
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
    t: SweepObject[] | null,
    e: SnapshotObject,
    i: SnapshotObject,
    s: {
      panDirection?: PanDirectionList
      panAngle?: number
    },
    n?: number
  ) {
    this.onStopRequested = async () => {
      await this.stopRotating()
    }
    const { panDirection: o, panAngle: r } = s
    const h = TransitionFactory.getPanValues(this.settingsData, !1, o, r)
    const d = h.direction
    let l = h.radiansPerMs
    if (void 0 !== d && d !== PanDirectionList.Auto) {
      l *= d!
    } else if (t) {
      const e = this.cameraPose.position.clone().setY(0)
      const i = t.map(t => t.position)
      const s = this.getCurve(i).curve.getPointAt(0.1).setY(0).clone().sub(e).normalize()
      const n = DirectionVector.FORWARD.clone().applyQuaternion(this.cameraPose.rotation)
      const o = Math.sign(n.cross(s).y)
      l = 0 !== o ? l * o : l
    } else if (i && e) {
      if ((!PanoramaOrMesh(e.metadata.cameraMode) && (l = -l), e.metadata.scanId === i.metadata.scanId)) {
        const t = DirectionVector.FORWARD.clone().applyQuaternion(this.cameraPose.rotation)
        const e = DirectionVector.FORWARD.clone().applyQuaternion(i.metadata.cameraQuaternion)
        const s = Math.sign(t.cross(e).y)
        l = 0 !== s ? l * s : l
      }
    }
    const c = i && !PanoramaOrMesh(i.metadata.cameraMode)
    this.duration = void 0 !== n ? n : h.ms
    return { deferred: this.rotate(this.duration, new Vector2(l, 0), !c) }
  }
}
