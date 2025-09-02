import { DebugInfo } from "../core/debug"
import { Message } from "../core/message"
import { MessageBus } from "../core/messageBus"
import { createSubscription } from "../core/subscription"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
const Symbols = new DebugInfo("symbols")

const loadedCallBack: Array<{ symbol: symbol; callback: Function }> = []
export class SymbolLoadedMessage extends Message {
  symbol: symbol
  constructor(e: symbol) {
    super()
    this.symbol = e
  }
}
export class SymbolLoadMessage extends Message {
  payload: any
  constructor(e: { symbol: symbol; callback: () => Promise<void> }) {
    super()
    this.payload = e
  }
}
export class SymbolLoadDoneMessage extends Message {
  payload: any
  constructor(e: any) {
    super()
    this.payload = e
  }
}
export function ShowcaseMessage(e: { messageBus: MessageBus }) {
  return new AggregateSubscription(
    createSubscription(
      () => null,
      () => (loadedCallBack.length = 0)
    ),
    e.messageBus.subscribe(SymbolLoadMessage, e => {
      loadedCallBack.push(e.payload)
    }),
    e.messageBus.subscribe(SymbolLoadDoneMessage, e => {
      const t = loadedCallBack.findIndex(t => t.symbol === e.payload.symbol && t.callback === e.payload.callback)
      t >= 0 && loadedCallBack.splice(t, 1)
    }),
    e.messageBus.subscribe(SymbolLoadedMessage, e => {
      loadedCallBack.forEach(t => {
        if (t.symbol === e.symbol)
          try {
            t.callback()
          } catch (t) {
            Symbols.warn("Error handling SymbolMessage", e, t)
          }
      })
    })
  )
}
