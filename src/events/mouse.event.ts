import { InputPointerType } from "../const/41927"
import { Event } from "../core/event"
class BaseEvent extends Event {}
export interface MousePosition {
  x: number
  y: number
}
export class OnMouseDownEvent extends BaseEvent {
  id: number
  position: MousePosition
  clientPosition: MousePosition
  button: number
  down: boolean
  device: InputPointerType
  nativeEvent: MouseEvent | PointerEvent | TouchEvent
  constructor(e: number, t: MousePosition, n: MousePosition, i: number, s: boolean, r: InputPointerType, a: MouseEvent | TouchEvent) {
    super()
    this.id = e
    this.position = t
    this.clientPosition = n
    this.button = i
    this.down = s
    this.device = r
    this.nativeEvent = a
  }
}
export class OnMoveEvent extends BaseEvent {
  id: number
  position: MousePosition
  clientPosition: MousePosition
  buttons: number
  device: InputPointerType
  nativeEvent: MouseEvent | PointerEvent | TouchEvent
  constructor(e: number, t: MousePosition, n: MousePosition, i: number, s: InputPointerType, r: MouseEvent | TouchEvent) {
    super()
    this.id = e
    this.position = t
    this.clientPosition = n
    this.buttons = i
    this.device = s
    this.nativeEvent = r
  }
}
