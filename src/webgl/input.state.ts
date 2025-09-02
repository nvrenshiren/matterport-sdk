import { ISubscription } from "../core/subscription"

interface InputItem {
  state: string
  subs: ISubscription[]
}
export class InputState {
  map: Map<string, ISubscription[]>
  constructor(t: InputItem[]) {
    this.map = new Map()
    t.forEach(t => this.map.set(t.state, t.subs))
  }
  renew(t: string) {
    ;(this.map.get(t) || []).forEach(t => t.renew())
  }
  cancel(t?: string) {
    if (t) {
      ;(this.map.get(t) || []).forEach(t => t.cancel())
    } else this.map.forEach(t => t.forEach(t => t.cancel()))
  }
  update(t: string, e: ISubscription[]) {
    this.map.set(t, e)
  }
}
