import { TransitionType } from "../const/transition.const"

export class NormalTransition {
  active: boolean
  type: TransitionType
  promise: Promise<void>
  stop: () => Promise<void>
  duration: number
  started: number
  stopped: number
  toIndex: number
  constructor(t = -1) {
    this.active = !1
    this.type = TransitionType.Nop
    this.promise = Promise.resolve()
    this.stop = () => Promise.resolve()
    this.duration = 0
    this.started = -1
    this.stopped = -1
    this.toIndex = t
  }
}
