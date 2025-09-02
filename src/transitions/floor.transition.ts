import { MovetoFloorCommand } from "../command/floors.command"
import { TransitionType } from "../const/transition.const"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"

import { defaultFloorDuration } from "../const/52498"
import { TransitionFactory } from "./transition.factory"
import { SnapshotObject } from "../object/snapshot.object"

export class FloorTransition {
  issueCommand: TransitionFactory["issueCommand"]
  currentFloorId: () => string
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e) {
    this.issueCommand = t
    this.currentFloorId = e
    this.type = TransitionType.FloorChange
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = defaultFloorDuration
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
  start(t: { targetSnapshot: SnapshotObject }, e: number) {
    if (this.active) throw Error("Transition already active")
    let i = Promise.resolve()
    const s = t.targetSnapshot.metadata.floorId
    const n = s !== this.currentFloorId()
    const o = t.targetSnapshot.metadata.cameraMode
    !PanoramaOrMesh(o) && o !== ViewModes.Outdoor && n && (i = this.issueCommand(new MovetoFloorCommand(s, !0, this.duration)))
    this.currentTransitionPromise = i.then(() => {
      this.currentTransitionPromise = null
      this.stopped = Date.now()
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
}
