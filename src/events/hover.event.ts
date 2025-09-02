import { Event } from "../core/event"
export class HoverMeshEvent extends Event {
  nativeEvent: MouseEvent | PointerEvent | TouchEvent
  type: string
  constructor(e: MouseEvent | TouchEvent) {
    super()
    this.nativeEvent = e
    this.type = "hover"
  }
}
export class UnhoverMeshEvent extends Event {
  nativeEvent: MouseEvent | PointerEvent | TouchEvent
  type: string
  constructor(e: MouseEvent | TouchEvent) {
    super()
    this.nativeEvent = e
    this.type = "unhover"
  }
}
