import { Vector2 } from "three"
import { GestureEvent } from "./gesture.event"
export class InputClickerStartEvent extends GestureEvent {
  position: Vector2
  buttons?: number
  constructor(e: Vector2, t?: number) {
    super()
    this.position = e
    this.buttons = t
  }
}
class r extends GestureEvent {
  position: Vector2
  button?: number
  constructor(e: Vector2, t?: number) {
    super()
    this.position = e
    this.button = t
  }
}
export class InputClickerEndEvent extends r {}
export class DoubleClickerStopEvent extends r {}
