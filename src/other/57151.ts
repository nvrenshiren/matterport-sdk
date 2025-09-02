import { isTouchEvent } from "./54106"
import * as s from "../const/41602"
class r {
  constructor(e) {
    ;(this.couldBeDrag = !1),
      (this.isDragging = !1),
      (this.shouldHandleEvents = !0),
      (this.handleEvent = e => {
        if (this.shouldHandleEvents)
          switch ((e.stopPropagation(), e.type)) {
            case "mousedown":
            case "touchstart":
            case "pointerdown":
              this.onPressStart(e)
              break
            case "mousemove":
            case "pointermove":
            case "touchmove":
              this.onPressMove(e)
              break
            case "mouseup":
            case "pointerup":
            case "mouseleave":
            case "touchend":
            case "touchcancel":
            case "pointercancel":
            case "pointerleave":
              this.onPressEnd(e)
          }
      }),
      (this.callbacks = e)
  }
  setEnabled(e) {
    ;(this.shouldHandleEvents = e), (this.couldBeDrag = this.couldBeDrag && e)
  }
  getPosition(e) {
    return isTouchEvent(e)
      ? {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
      : {
          x: e.clientX,
          y: e.clientY
        }
  }
  onPressStart(e) {
    ;(this.couldBeDrag = !0),
      (this.dragEvents = []),
      (this.dragStart = this.getPosition(e)),
      this.callbacks.handlePressStart && this.callbacks.handlePressStart(this.getPosition(e))
  }
  onPressMove(e) {
    if (!this.couldBeDrag) return
    const t = this.getPosition(e)
    this.addDragEvent(t),
      this.isDragging ||
        (Math.sqrt(Math.pow(t.x - this.dragStart.x, 2) + Math.pow(t.y - this.dragStart.y, 2)) > s.JU &&
          ((this.isDragging = !0), this.callbacks.handleDragStart && this.callbacks.handleDragStart())),
      this.callbacks.handlePressMove &&
        this.callbacks.handlePressMove({
          x: this.dragStart.x - t.x,
          y: this.dragStart.y - t.y
        })
  }
  onPressEnd(e) {
    if (this.couldBeDrag) {
      if (((this.couldBeDrag = !1), this.isDragging)) {
        if (!this.dragEvents || !this.dragEvents[0]) return
        const e = this.dragEvents[0],
          t = this.dragEvents[this.dragEvents.length - 1]
        if (this.callbacks.handleDragEnd) {
          const n = {
            x: 0,
            y: 0
          }
          Date.now() - t.timestamp < r.dragMoveTimeout && ((n.x = e.position.x - t.position.x), (n.y = e.position.y - t.position.y)),
            this.callbacks.handleDragEnd(n, t.timestamp - e.timestamp)
        }
      } else this.callbacks.handleClick && this.callbacks.handleClick(e)
      this.isDragging = !1
    }
  }
  addDragEvent(e) {
    this.dragEvents.push({
      position: e,
      timestamp: Date.now()
    }),
      this.dragEvents.length > 10 && this.dragEvents.shift()
  }
}
r.dragMoveTimeout = 100
export const Z = r
