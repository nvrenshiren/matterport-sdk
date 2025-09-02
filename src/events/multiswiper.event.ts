import { Vector2 } from "three"
import { GestureEvent } from "./gesture.event"
export class MultiswiperMoveEvent extends GestureEvent {
  pointerCount: number
  position: Vector2
  delta: Vector2
  constructor(e: number, t: Vector2, n: Vector2) {
    super()
    this.pointerCount = e
    this.position = Object.assign({}, t)
    this.delta = Object.assign({}, n)
  }
}
export class MultiswiperStopEvent extends GestureEvent {
  pointerCount: number
  position: Vector2
  delta: Vector2
  timeSinceLastMove: number
  constructor(e: number, t: Vector2, n: Vector2, i: number) {
    super()
    this.pointerCount = e
    this.position = Object.assign({}, t)
    this.delta = Object.assign({}, n)
    this.timeSinceLastMove = i
  }
}
