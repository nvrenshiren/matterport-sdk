import { GestureEvent } from "./gesture.event"
export class PincherMoveEvent extends GestureEvent {
  pinchDelta: number
  constructor(e: number) {
    super()
    this.pinchDelta = e
  }
}
export class PincherStopEvent extends GestureEvent {
  pinchDelta: number
  timeSinceLastMove: number
  constructor(e: number, t: number) {
    super()
    this.pinchDelta = e
    this.timeSinceLastMove = t
  }
}
