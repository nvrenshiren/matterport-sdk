import { TransitionType } from "../const/transition.const"
import { waitRunCancel } from "../utils/func.utils"

export class DelayTransition {
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionPromise: null | Promise<any>
  cancelDelay: () => any
  constructor(t) {
    this.type = TransitionType.Delay
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
    this.currentTransitionPromise = null
    this.cancelDelay = () => null
    this.duration = t
  }
  get active() {
    return null !== this.currentTransitionPromise
  }
  get promise() {
    return this.currentTransitionPromise ? this.currentTransitionPromise : Promise.resolve()
  }
  async stop() {
    this.currentTransitionPromise && (this.cancelDelay(), (this.currentTransitionPromise = null), (this.stopped = Date.now()))
  }
  start(t: { duration?: number }, e: number) {
    if (this.active) throw Error("Transition already active")
    void 0 !== t.duration && (this.duration = t.duration)
    const i = waitRunCancel(this.duration)
    this.cancelDelay = () => {
      i.cancel()
    }
    this.currentTransitionPromise = i.promise.then(() => this.stop())
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
}
