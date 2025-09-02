import { KeyboardStateList } from "../const/keyboard.const"
import { Event } from "../core/event"
export class KeyboardCallbackEvent extends Event {
  key: number
  state: KeyboardStateList
  modifiers: KeyboardEvent
  constructor(e: number, t: KeyboardStateList, n: KeyboardEvent) {
    super()
    this.key = e
    this.state = t
    this.modifiers = n
  }
}
