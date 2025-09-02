import { SweepObject } from "../object/sweep.object"
import { DebugInfo } from "./debug"
const debug = new DebugInfo("Subscription")
export interface ISubscription {
  renew: () => void
  cancel: () => void
  active?: boolean
}
export class WatchedData {
  watchedData: Function
  registerSubscription: Function
  unregisterSubscription: Function
  constructor(e, t, n) {
    this.watchedData = e
    this.registerSubscription = t
    this.unregisterSubscription = n
  }
  createSubscription(e, t) {
    return new Subscription(
      () => this.registerSubscription(e),
      () => this.unregisterSubscription(e),
      t
    )
  }
  getData() {
    return this.watchedData()
  }
}
export class Collection {
  collection: SweepObject[]
  itemProperty: string
  subscribeFcn: any
  unsubcribeFcn: any
  constructor(e, t, n, i) {
    this.collection = e
    this.itemProperty = t
    this.subscribeFcn = n
    this.unsubcribeFcn = i
  }
  createSubscription(e: Function, t?: boolean) {
    const n: Function[] = []
    const i = new Subscription(
      () => {
        for (const t of this.collection) {
          const i = () => e(t, this.itemProperty)
          n.push(i), this.subscribeFcn(t, i)
        }
      },
      () => {
        let e = 0
        for (const t of this.collection) this.unsubcribeFcn(t, n[e]), e++
      },
      t
    )
    return this.collection.hasOwnProperty("isObservable")
      ? (this.collection.onElementChanged({
          onAdded: t => {
            n.push(() => e(t, this.itemProperty))
            i.active && this.subscribeFcn(t, n[n.length - 1])
          },
          onRemoved: e => {
            let t = 0
            for (const n of this.collection) {
              if (n === e) break
              t++
            }
            this.unsubcribeFcn(e, n[t]), n.splice(t, 1)
          }
        }),
        i)
      : i
  }
  getData() {
    return this.collection
  }
}
export class Subscription {
  startSubscription: Function
  endSubscription: Function
  id: string | number | symbol
  isSubbed: boolean
  constructor(startSubscription: Function, endSubscription: Function, renew = !1, id: string | number | symbol = "") {
    this.startSubscription = startSubscription
    this.endSubscription = endSubscription
    this.id = id
    this.isSubbed = !1
    renew && this.renew()
  }
  renew() {
    this.isSubbed ? debug.debugWarn(`Duplicate subscription renew ${String(this.id)}`) : (this.startSubscription(), (this.isSubbed = !0))
  }
  cancel() {
    this.isSubbed && (this.endSubscription(), (this.isSubbed = !1))
  }
  get active() {
    return this.isSubbed
  }
}
export function createSubscription(startSubscription: Function, endSubscription: Function, renew = !0, id: string | number | symbol = "") {
  return new Subscription(startSubscription, endSubscription, renew, id)
}
