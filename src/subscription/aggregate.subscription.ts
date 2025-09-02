import { ISubscription } from "../core/subscription"

export class AggregateSubscription {
  subs: ISubscription[]
  constructor(...e: ISubscription[]) {
    this.subs = e
  }
  renew() {
    for (const e of this.subs) e.renew()
  }
  cancel() {
    for (const e of this.subs) e.cancel()
  }
}
