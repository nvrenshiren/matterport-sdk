import { MeshProgressBindingMessage } from "../message/mesh.message"
import { TileDownloadedMessage } from "../message/title.message"
import { ViewModeChangeMessage } from "../message/viewmode.message"
import { DebugInfo } from "./debug"
import { Message } from "./message"

import { createSubscription } from "./subscription"
import { TypeLookup, getKey } from "./typeLookup"
const debugInfo = new DebugInfo("message-bus")
export enum MessageType {
  PERMANENT = 0,
  ONCE = 1
}
type MessageItem = { type: MessageType; callback: (e: Message) => void }
export type MessageCallback<M extends typeof Message = typeof Message> = (e: InstanceType<M>) => void
export class MessageBus {
  typeLookup: TypeLookup
  callbacks: Record<string, MessageItem[]>
  messageQueue: Message[]
  messageCount: number
  constructor() {
    this.typeLookup = new TypeLookup()
    this.callbacks = {}
    this.messageQueue = []
    this.messageCount = 0
  }
  subscribe<M extends typeof Message = typeof Message>(e: M, t: MessageCallback<M>, n = MessageType.PERMANENT) {
    return createSubscription(
      () => this._subscribe(e, t, n),
      () => this.unsubscribe(e, t),
      !0,
      getKey(e)
    )
  }
  _subscribe<M extends typeof Message = typeof Message>(e: M, t: MessageCallback<M>, n = MessageType.PERMANENT) {
    const i = this.typeLookup.getKeyByType(e, !0)
    this.callbacks[i] || (this.callbacks[i] = [])
    if (!this.callbacks[i].find(n => n.callback === t)) {
      this.callbacks[i].push({
        type: n,
        callback: t
      })
    }
  }
  unsubscribe(e: typeof Message, t: MessageCallback) {
    const n = this.typeLookup.getKeyByType(e)
    n ? this.unsubscribeByIndex(n, t) : debugInfo.debug(`Message callback not bound for Type: ${e.name}`)
  }
  unsubscribeByIndex(e: string, t: MessageCallback) {
    const n = this.callbacks[e].findIndex(e => e.callback === t)
    ;-1 !== n ? this.callbacks[e].splice(n, 1) : debugInfo.debug(`Message callback not bound for TypeIndex: ${e}`)
  }
  broadcast<T extends Message = Message>(e: T) {
    // if (e instanceof TileDownloadedMessage || e instanceof MeshProgressBindingMessage) {
    // } else {
    //   console.log(e)
    // }
    e.setID(this.messageCount++)
    this.messageQueue.push(e)
    if (1 === this.messageQueue.length) {
      for (const e of this.messageQueue) {
        const t = this.typeLookup.getKeyByInstance(e)

        if (!t) continue

        const n = this.callbacks[t].slice()
        for (const i of n) {
          i.callback(e)
          i.type === MessageType.ONCE && this.unsubscribeByIndex(t, i.callback)
        }
      }
      this.messageQueue = []
    }
  }
}
