import { DebugInfo } from "../core/debug"
import { createSubscription } from "../core/subscription"
import { ObservableObject } from "../observable/observable.object"
import { easeLiner } from "../utils/ease.utils"
const o = new DebugInfo("animation")
export class AnimationProgress extends ObservableObject {
  _easing: (e: any, t: any, n: any, i: any) => any
  _active: boolean
  _elapsed: number
  _duration: number
  _endValue: number
  _delay: number
  startValue: number
  value: number
  _onComplete: Function[]
  _onActivate: Function[]
  constructor(e: number, t?: number, n?: number, s = easeLiner, r = 0) {
    super()
    this._easing = easeLiner
    t = t || e
    if (!n) {
      this._active = !1
      n = 0
      this._elapsed = 0
      this._duration = 0
    }

    this.modifyAnimation(e, t, n, s, 0, r)
  }
  get active() {
    return this._active
  }
  get duration() {
    return this._duration
  }
  get endValue() {
    return this._endValue
  }
  get easing() {
    return this._easing
  }
  get elapsed() {
    return this._elapsed
  }
  get delay() {
    return this._delay
  }
  tick(e: number) {
    if (!this._active) return this.endValue
    if (this._delay > 0) return (this._delay -= e), this.startValue
    const t = (this._elapsed + e) / Math.max(this._duration, 1e-5)
    this.updateProgress(t)
    return this.value
  }
  updateProgress(e: number) {
    if (isNaN(e)) return void o.error(`Invalid progress value: ${e}`)
    const t = Math.max(0, Math.min(e, 1))
    const n = this.active
    const i = this.value
    if (t >= 1) {
      this.activate(!1)
      this.value = this._easing(1, this.startValue, this._endValue - this.startValue, 1)
      this._elapsed = this.duration
      this.commit()
      this._onComplete && this._onComplete.forEach(e => e())
      return
    }
    this.activate(!0)
    this.value = this._easing(t, this.startValue, this._endValue - this.startValue, 1)
    this._elapsed = t * this.duration
    ;(i === this.value && n === this.active) || this.commit()
  }
  updateAbsolute(e: number) {
    const t = e / Math.max(this._duration, 1e-5)
    this.updateProgress(t)
  }
  modifyAnimation(e: number, t: number, n: number, s = easeLiner, r = 0, a = 0) {
    this._easing = s
    this._endValue = t
    this._duration = n
    this._elapsed = r
    this._delay = a
    this.startValue = e
    this.value = e
    this.activate(this._duration >= 0 && e !== t)
    this.commit()
    return this
  }
  onComplete(e) {
    this._onComplete || (this._onComplete = [])
    return createSubscription(
      () => this._onComplete.push(e),
      () => this._onComplete.splice(this._onComplete.indexOf(e), 1)
    )
  }
  onActivate(e: Function) {
    this._onActivate || (this._onActivate = [])
    return createSubscription(
      () => this._onActivate.push(e),
      () => this._onActivate.splice(this._onActivate.indexOf(e), 1)
    )
  }
  activate(e) {
    e !== this._active && this._onActivate && this._onActivate.forEach(e => e())
    this._active = e
  }
  copy(e: AnimationProgress) {
    this._endValue = e.endValue
    this._duration = e.duration
    this._active = e.active
    this._easing = e.easing
    this._elapsed = e.elapsed
    this.startValue = e.startValue
    this.value = e.value
    this.commit()
  }
  clone() {
    const e = new AnimationProgress(0)
    e.copy(this)
    return e
  }
  stop(e) {
    this._active = !1
    this._elapsed = this._duration
    this.value = e
    this._endValue = e
    this.commit()
  }
  equals(e: AnimationProgress) {
    return (
      this._active === e._active &&
      this.duration === e.duration &&
      this.easing === e.easing &&
      this.elapsed === e.elapsed &&
      this.endValue === e.endValue &&
      this.startValue === e.startValue &&
      this.value === e.value
    )
  }
}
