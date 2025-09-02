import { TransitionType } from "../const/transition.const"
import CommonControlsModule from "../modules/commonControls.module"

export class ZoomTransition {
  zoom: CommonControlsModule["startZoomTransition"]
  stopZooming: CommonControlsModule["stop"]
  peekabooActive: boolean
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: null | Promise<any>
  onStopRequested: () => Promise<void>
  constructor(t, e, i, s = !1) {
    this.zoom = t
    this.stopZooming = e
    this.peekabooActive = s
    this.type = TransitionType.Zoom
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
    this.currentTransitionPromise = null
    this.onStopRequested = () => Promise.resolve()
    this.duration = i
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
  start(t: { duration?: number }, e: number) {
    if (this.active) throw Error("Transition already active")
    void 0 !== t.duration && (this.duration = t.duration)
    const i = this.peekabooActive ? -5 : -5e-4
    this.currentTransitionPromise = this.zoom(this.duration, i).then(() => {
      this.currentTransitionPromise = null
      this.stopped = Date.now()
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    this.onStopRequested = async () => {
      await this.stopZooming()
    }
    return this
  }
}
