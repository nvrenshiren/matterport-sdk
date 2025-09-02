import { Message } from "../core/message"
export class StartLocationCreatedMessage extends Message {
  is360: boolean
  constructor(e: boolean) {
    super()
    this.is360 = e
  }
}
