import { InputGesturePointerItem } from "../modules/inputIni.module"
import { GestureEvent } from "./gesture.event"
export class MovePointerEvent extends GestureEvent {
  pointers: InputGesturePointerItem[]
  constructor(e: InputGesturePointerItem[]) {
    super()
    this.pointers = e
  }
}
