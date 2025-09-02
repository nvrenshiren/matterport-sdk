export class Message {
  msgId: number
  constructor(...e: any[]) {
    this.msgId = -1
  }
  setID(msgId: number) {
    if (-1 !== this.msgId) throw Error("Message.msgId can only be set once.")
    this.msgId = msgId
  }
}
export class MessageFeature extends Message {
  feature: any
  constructor(e) {
    super()
    this.feature = e
  }
}
