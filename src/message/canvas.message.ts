import { Message } from "../core/message"
export class CanvasMessage extends Message {
  x: number
  y: number
  constructor(e: number, t: number) {
    super()
    this.x = e
    this.y = t
  }
}
