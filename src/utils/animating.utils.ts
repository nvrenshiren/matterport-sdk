import { easeInOutQuad } from "./ease.utils"
export class Animating {
  isAnimating: boolean
  duration: number
  startValue: number
  changeValue: number
  easingFunction: Function
  startTime: number
  constructor(e) {
    this.isAnimating = !0
    this.duration = e.duration
    this.startValue = e.startValue
    this.changeValue = e.endValue - this.startValue
    this.easingFunction = e.easingFunction || easeInOutQuad
  }
  getUpdatedValue() {
    this.startTime || (this.startTime = Date.now())
    const e = Date.now() - this.startTime
    e > this.duration && (this.isAnimating = !1)
    return this.easingFunction(Math.min(e, this.duration), this.startValue, this.changeValue, this.duration)
  }
}
