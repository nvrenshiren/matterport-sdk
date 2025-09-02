import { deepCopy, isNumber } from "../utils/object.utils"
import { ElementChangedParams, Observable } from "./observable"

function toString(e: any) {
  return isNumber(e) ? "" + e : e
}
export class ObservableMap<T = any> extends Observable<T> {
  map: Record<string, T>
  _keysSet: Set<string>
  _keysList: Array<keyof ObservableMap["map"]>
  constructor() {
    super()
    this.map = {}
    this._keysSet = new Set()
    this._keysList = []
  }
  get keys() {
    return this._keysList.slice()
  }
  get values(): T[] {
    return this._keysList.map(e => this.get(e))
  }
  entries() {
    const e: [string, T][] = []
    for (const t in this.map) e.push([t, this.map[t]])
    return e
  }
  get length() {
    return this._keysList.length
  }
  *[Symbol.iterator]() {
    for (const e of this._keysList) yield this.get(e)
  }
  get<K extends keyof ObservableMap["map"] = keyof ObservableMap["map"]>(e: K) {
    return this.map[e] as T
  }
  has(e: string) {
    return void 0 !== this.map[e]
  }
  set(e: string, t: T) {
    e = toString(e)
    if (this.map[e] !== t) {
      this.removeChildObservables(this.map[e])
      this.addChildObservable(t)
      this.map[e] = t
      this._keysSet.has(e) || (this._keysList.push(e), this._keysSet.add(e))
      this.setDirty()
    }
  }
  clear() {
    if (this.length > 0) {
      for (const e in this.map) this.removeChildObservables(this.map[e])
      this.map = {}
      this._keysSet.clear()
      this._keysList = []
      this.setDirty()
    }
  }
  replace(e: Record<string, T>) {
    this.clear()
    for (const t in e) this.set(t, e[t])
  }
  delete(e: any) {
    e = toString(e)
    this.removeChildObservables(this.map[e])
    const t = this.map.hasOwnProperty(e)
    delete this.map[e]
    t && (this._keysSet.delete(e), this._keysList.splice(this._keysList.indexOf(e), 1), this.setDirty())
    return t
  }
  forEach(e: Parameters<Array<T>["forEach"]>[0], t?: any) {
    for (const i of this._keysList) {
      const n = this.map[i]
      e.call(t, n, i, this)
    }
  }
  onElementChanged(e: ElementChangedParams<T>) {
    let t = Object.assign({}, this.map)
    return this.onChanged(() => {
      for (const i in t) e.onRemoved && !this.has(i) && e.onRemoved(t[i], i)
      for (const i of this._keysList) {
        const s = this.get(i)
        void 0 === t[i]
          ? e.onAdded && e.onAdded(s, i)
          : ((Observable.isObservable(s) && s._dirtyObservable) || s !== t[i]) &&
            (e.onUpdated && null !== s ? e.onUpdated(s, i) : e.onRemoved && null === s && e.onRemoved(t[i], i))
      }
      t = Object.assign({}, this.map)
    })
  }
  deepCopy() {
    const e = {}
    for (const t of this._keysList) e[t] = deepCopy(this.map[t])
    return e
  }
}
export const createObservableMap = <T>(e: Record<string, T> = {}) => {
  const t = new ObservableMap<T>()
  t.replace(e)
  return t
}
