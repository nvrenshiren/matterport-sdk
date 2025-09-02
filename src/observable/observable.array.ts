import { deepCopy } from "../utils/object.utils"
import { ElementChangedParams, Observable } from "./observable"
export class ObservableArray<T = any> extends Observable<T> {
  isObservableArray: boolean
  elements: T[]
  constructor() {
    super()
    this.isObservableArray = !0
    this.elements = []
  }
  push(e: T) {
    this.elements.push(e)
    this.addChildObservable(e)
    this.setDirty()
    return this.length
  }

  concat(e: T[]) {
    const t = this.elements.length
    this.elements = this.elements.concat(e)
    for (let e = t; e < this.elements.length; e++) {
      this.addChildObservable(this.elements[e])
    }
    this.setDirty()
    return this.length
  }
  replace(e: T[]) {
    for (const e of this.elements) {
      this.removeChildObservables(e)
    }
    this.elements = []
    return this.concat(e)
  }

  remove(e) {
    if (e < 0 || e >= this.length) throw new Error(`Index ${e} not in range of ObservableArray`)
    const [t] = this.elements.splice(e, 1)
    this.removeChildObservables(t)
    this.setDirty()
  }
  update(e: number, t: T) {
    const i = this.elements[e]
    i !== t && ((this.elements[e] = t), this.removeChildObservables(i), this.addChildObservable(t), this.setDirty())
  }
  get length() {
    return this.elements.length
  }
  set length(e: number) {
    if (e < this.elements.length) {
      for (let t = this.elements.length - 1; t >= e; t--) {
        const e = this.elements[t]
        this.removeChildObservables(e)
      }
      this.elements.length = e
      this.setDirty()
    }
  }
  values() {
    return [...this.elements]
  }
  filter(e: Parameters<Array<T>["filter"]>[0]) {
    return this.elements.filter(e)
  }
  find(e: Parameters<Array<T>["find"]>[0]) {
    return this.elements.find(e)
  }
  *[Symbol.iterator]() {
    for (const e of this.elements) yield e
  }
  map(e: Parameters<Array<T>["map"]>[0], t?: Parameters<Array<T>["map"]>[1]) {
    return this.elements.map(e, t)
  }
  forEach(e: Parameters<Array<T>["forEach"]>[0], t?: Parameters<Array<T>["forEach"]>[1]) {
    this.elements.forEach(e, t)
  }
  sort(e: Parameters<Array<T>["sort"]>[0]) {
    this.elements.sort(e)
  }
  get(e: number) {
    return this.elements[e]
  }
  findIndex(e: Parameters<Array<T>["findIndex"]>[0], t?: Parameters<Array<T>["findIndex"]>[1]) {
    return this.elements.findIndex(e, t)
  }
  indexOf(e: Parameters<Array<T>["indexOf"]>[0]) {
    return this.elements.indexOf(e)
  }
  splice(start: number, deleteCount: number, ...items: T[]) {
    let n: T[]
    if (items.length) {
      n = this.elements.splice(start, deleteCount, ...items)
      for (const e of items) this.addChildObservable(e)
    } else n = this.elements.splice(start, deleteCount)
    for (const e of n) this.removeChildObservables(e)
    this.setDirty()
    return n
  }
  insert(e: number, t: T) {
    if (e > this.elements.length) throw new Error(`Tried to insert at index ${e} in an array that's only ${this.elements.length} long`)
    e !== this.elements.length ? (this.elements.splice(e, 0, t), this.addChildObservable(t), this.setDirty()) : this.push(t)
  }
  shift() {
    const e = this.elements.shift()
    e && (this.removeChildObservables(e), this.setDirty())
    return e
  }
  move(from: number, to: number) {
    if (to > this.elements.length - 1) throw Error("Index to move to is out of bounds")
    const i = this.elements[from]
    this.elements.splice(from, 1)
    this.elements.splice(to, 0, i)
    this.setDirty()
  }
  includes(e: T, t?: number) {
    return this.elements.includes(e, t)
  }
  some(e: Parameters<Array<T>["some"]>[0], t?: Parameters<Array<T>["some"]>[1]) {
    return this.elements.some(e, t)
  }
  every(e: Parameters<Array<T>["every"]>[0], t?: Parameters<Array<T>["every"]>[1]) {
    return this.elements.every(e, t)
  }
  onElementChanged(e: ElementChangedParams<T, number>) {
    let t = this.elements.slice()
    return this.onChanged(() => {
      for (const i in t) {
        const n = parseInt(i, 10)
        e.onRemoved && void 0 === this.get(n) && e.onRemoved(t[n], n)
      }
      for (const i in this.elements) {
        const s = parseInt(i, 10)
        const r = this.get(s)
        void 0 === t[s]
          ? e.onAdded && e.onAdded(r, s)
          : ((Observable.isObservable(r) && r._dirtyObservable) || r !== t[s]) &&
            (e.onUpdated ? e.onUpdated(r, s) : e.onRemoved && null === r && e.onRemoved(t[s], s))
      }
      t = this.elements.slice()
    })
  }
  deepCopy() {
    return this.map(e => deepCopy(e))
  }
}
export const createObservableArray = <T = any>(e?: T[]) => {
  const t = new ObservableArray<T>()
  e && t.concat(e)
  return t
}
