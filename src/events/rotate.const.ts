import { GestureEvent } from "./gesture.event"
export class RotaterMoveEvent extends GestureEvent {
  rotateDelta: number
  constructor(e: number) {
    super()
    this.rotateDelta = e
  }
}
export class RotaterStopEvent extends GestureEvent {
  rotateDelta: any
  timeSinceLastMove: any
  constructor(e: number, t: number) {
    super()
    this.rotateDelta = e
    this.timeSinceLastMove = t
  }
}
