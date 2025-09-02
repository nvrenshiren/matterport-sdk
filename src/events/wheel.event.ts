import { GestureEvent } from "./gesture.event"
import { MousePosition } from "./mouse.event"
export class WheelBindEvent extends GestureEvent {
  position: MousePosition
  delta: MousePosition
  constructor(e: MousePosition, t: MousePosition) {
    super()
    this.position = e
    this.delta = t
  }
}
