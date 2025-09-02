import { Vector2 } from "three"
import { GestureEvent } from "./gesture.event"
export class LongPressMoveEvent extends GestureEvent {
  position: Vector2
  clientPosition: Vector2
  delta: Vector2
  buttons: number
  constructor(e: Vector2, t: Vector2, n: Vector2, i: number) {
    super(), (this.position = e), (this.clientPosition = t), (this.delta = n), (this.buttons = i)
  }
}
export class LongPressProgressEvent extends GestureEvent {
  position: any
  clientPosition: any
  delta: any
  buttons: any
  progress: any
  constructor(e: Vector2, t: Vector2, n: Vector2, i: number, s: any) {
    super(), (this.position = e), (this.clientPosition = t), (this.delta = n), (this.buttons = i), (this.progress = s)
  }
}
export class LongPressStartEvent extends GestureEvent {
  position: Vector2
  clientPosition: Vector2
  buttons: number
  constructor(e: Vector2, t: Vector2, n: number) {
    super()
    this.position = e
    this.clientPosition = t
    this.buttons = n
  }
}
export class LongPressDoneEvent extends GestureEvent {
  position: Vector2
  clientPosition: Vector2
  constructor(e: Vector2, t: Vector2) {
    super()
    this.position = e
    this.clientPosition = t
  }
}
export class LongPressEndEvent extends GestureEvent {
  position: Vector2
  clientPosition: Vector2
  cancelled: boolean
  constructor(e: Vector2, t: Vector2, n: boolean) {
    super()
    this.position = e
    this.clientPosition = t
    this.cancelled = n
  }
}

export const PC = LongPressProgressEvent
