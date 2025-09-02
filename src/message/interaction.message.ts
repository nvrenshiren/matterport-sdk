import { Message } from "../core/message"
export class InteractionModeChangedMessage extends Message {
  mode: number | string
  fromMode: number
  constructor(e: string | number, t: number) {
    super()
    this.mode = e
    this.fromMode = t
  }
}
export class UpdateSourceMessage extends Message {
  source: string
  constructor(e: string) {
    super()
    this.source = e
  }
}
