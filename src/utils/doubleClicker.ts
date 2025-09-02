import { dragLimit } from "../const/input.const"
import { DoubleClickerStopEvent, InputClickerEndEvent } from "../events/click.event"
export const doubleClickLimit = 500
export class DoubleClicker {
  dragLimit: number
  lastClick: null | number
  lastClickButton: null | number
  lastClickPosition: { x: number; y: number }
  constructor(e = dragLimit) {
    this.dragLimit = e
    this.lastClick = null
    this.lastClickButton = null
    this.lastClickPosition = {
      x: 0,
      y: 0
    }
  }
  checkForDoubleClick(e: InputClickerEndEvent) {
    const t = () => {
      this.lastClick = performance.now()
      this.lastClickButton = e.button
      this.lastClickPosition.x = e.position.x
      this.lastClickPosition.y = e.position.y
    }
    if (this.lastClick) {
      const n = performance.now() - this.lastClick,
        s = this.lastClickPosition.x - e.position.x,
        a = this.lastClickPosition.y - e.position.y,
        o = s * s + a * a
      if (!(n > doubleClickLimit || o > this.dragLimit || e.button !== this.lastClickButton))
        return (this.lastClick = null), new DoubleClickerStopEvent(e.position, e.button)
      t()
    } else t()
  }
}
