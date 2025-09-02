import { Observable } from "./observable"
import { createSubscription } from "../core/subscription"
import { ObservableMap } from "./observable.map"

export const ObservableOrderPriority = {
  LOW: "low",
  NORMAL: "normal"
}
export class ObservableOrder<T = any> extends Observable<T> {
  priority: string
  filters: Map<string, Function>
  view: T[]
  _keys: Map<string, T>
  _dirty: boolean
  sortNeeded: boolean
  map: ObservableMap<T>
  compareFunc: (a: T, b: T) => number
  constructor(e: ObservableMap<T>) {
    super()
    this.priority = ObservableOrderPriority.NORMAL
    this.filters = new Map()
    this.view = []
    this._keys = new Map()
    this._dirty = !1
    this.sortNeeded = !1
    this.map = e
    this.applyFilters(),
      this.map.onElementChanged({
        onAdded: (e, t) => this.onAdded(t!, e),
        onRemoved: (e, t) => this.onRemoved(t!, e),
        onUpdated: (e, t) => this.onUpdated(t!, e!)
      })
    this.map.onChanged(() => {
      this.sortNeeded && (this.applySort(), this.setDirty(), (this.sortNeeded = !1))
    })
  }
  has(e: string) {
    return this._keys.has(e)
  }
  get(e: string) {
    return this.has(e) ? this.map.get(e) : void 0
  }
  setFilter(e: string, t: Function) {
    return createSubscription(
      () => {
        this.filters.set(e, t), this.applyFilters()
      },
      () => this.clearFilter(e),
      !0
    )
  }
  clearFilter(e: string) {
    return !!this.filters.has(e) && (this.filters.delete(e), this.applyFilters(), !0)
  }
  clearFilters() {
    this.filters.clear()
    this.applyFilters()
  }
  sort(e: (a: T, b: T) => number) {
    this.compareFunc = e
    this.applySort()
    this.setDirty()
  }
  *[Symbol.iterator]() {
    for (const e of this.view) yield e
  }
  get length() {
    return this.view.length
  }
  groupBy<K extends keyof T = keyof T>(e: K) {
    const t: Record<string, T[]> = {}
    for (const n of this.view) {
      const i = String(n[e])
      t[i] || (t[i] = []), t[i].push(n)
    }
    return t
  }
  get values() {
    return this.view.slice()
  }
  setDirty(e = !0) {
    this.priority === ObservableOrderPriority.LOW
      ? this._dirty ||
        ((this._dirty = !0),
        requestAnimationFrame(() => {
          this._dirty = !1
          super.setDirty(e)
        }))
      : super.setDirty(e)
  }
  add(e: string) {
    if (this.has(e)) return !1
    const t = this.map.get(e)
    this._keys.set(e, t)
    this.view.push(t)
    return !0
  }
  delete(e: string) {
    const t = this._keys.get(e)
    if (!t) return !1
    this._keys.delete(e)
    const n = this.view.indexOf(t)
    return -1 !== n && this.view.splice(n, 1), !0
  }
  testFilters(e) {
    return [...this.filters.values()].every(t => t(e))
  }
  applyFilters(e?: string, t = !1) {
    let n = !1
    const i = e ? [e] : this.map.keys
    for (const e of i) {
      const t = this.map.get(e),
        i = this.testFilters(t)
      ;((i && this.add(e)) || (!i && this.delete(e))) && (n = !0)
    }
    e && this.has(e) && (n = !0), n && (t ? (this.sortNeeded = !0) : (this.applySort(), this.setDirty()))
  }
  applySort() {
    this.compareFunc && this.view.sort(this.compareFunc)
  }
  onRemoved(e: string, t) {
    this.delete(e) && this.setDirty()
  }
  onAdded(e: string, t) {
    this.testFilters(t) && this.applyFilters(e, !0)
  }
  onUpdated(e: string, t: T) {
    const n = this._keys.get(e),
      i = this.view.findIndex(e => e === n)
    ;-1 !== i && ((this.view[i] = t), this._keys.set(e, t)), this.applyFilters(e, !0)
  }
}
