import { DebugInfo } from "../core/debug"
import { createSubscription } from "../core/subscription"
import { deepCopy } from "../utils/object.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { ChangeObserver, Observable } from "./observable"
const debug = new DebugInfo("ObservableObject")
const isDebug = getValFromURL("debug", 0) === 1
export class ObservableObject extends Observable {
  readonly _propertyObservables: { [Key in keyof this]: ChangeObserver<this[Key]>[] }
  readonly _valueCache: { [Key in keyof this]: Observable<this[Key]> }
  readonly _dirtyKeys: Set<string>
  constructor() {
    super()
    //@ts-ignore
    this._propertyObservables = {}
    //@ts-ignore
    this._valueCache = {}
    this._dirtyKeys = new Set()
    Object.defineProperties(this, {
      _propertyObservables: {
        value: this._propertyObservables,
        writable: !1,
        enumerable: !1
      },
      _valueCache: {
        value: this._valueCache,
        writable: !1,
        enumerable: !1
      },
      _dirtyKeys: {
        value: this._dirtyKeys,
        writable: !1,
        enumerable: !1
      }
    })
    if (isDebug) {
      setTimeout(() => {
        const oldData: Partial<this> = {}
        for (const key in this) {
          if (this.hasOwnProperty(key)) {
            oldData[key] = this[key]
            this._valueCache[key] = this[key] as Observable<this[Extract<keyof this, string>]>
            Object.defineProperty(this, key, {
              get: () => oldData[key],
              set: newVal => {
                const cache = this._valueCache[key]
                if (cache !== newVal || (Observable.isObservable(cache) && cache._dirtyObservable)) {
                  addDebug(this, key)
                }
                oldData[key] = newVal
              },
              enumerable: !0
            })
          }
        }
      }, 1)
    }
  }
  onPropertyChanged<K extends keyof this>(name: K, t: ChangeObserver<this[K]>) {
    if (!this._propertyObservables[name]) {
      this._propertyObservables[name] = []
    }
    if (-1 !== this._propertyObservables[name].indexOf(t)) throw new Error("此观察者函数已经在观察此Observable，不支持重复订阅。")
    return createSubscription(
      () => this._propertyObservables[name].push(t),
      () => this.removeOnPropertyChanged(name, t),
      !0,
      name
    )
  }
  protected removeOnPropertyChanged<K extends keyof this>(name: K, t: ChangeObserver<this[K]>) {
    const i = this._propertyObservables[name].indexOf(t)
    i >= 0 && this._propertyObservables[name].splice(i, 1)
  }
  commit(e: string[] = []) {
    for (const t of e) this._dirtyKeys.add(t)
    this.setDirtyUp()
    this.notifyUp()
  }
  protected setDirtyUp() {
    for (const key in this) {
      if (!this.hasOwnProperty(key)) continue
      const cache = this._valueCache[key]
      const val = this[key] as Observable<this[Extract<keyof this, string>]>
      const s = typeof val
      const noObs = "undefined" === s || "string" === s || "number" === s || "boolean" === s || null === val
      if (this._propertyObservables[key] && !noObs && !Observable.isObservable(val)) {
        throw new Error(`Property ${key} has property listeners, but has a value that is not observable or a primitive!`)
      }
      if (cache !== val) {
        this.removeChildObservables(cache)
        this.addChildObservable(val)
        this._valueCache[key] = val
        this._dirtyKeys.add(key)
      } else {
        Observable.isObservable(cache) && cache._dirtyObservable && this._dirtyKeys.add(key)
      }
    }
    super.setDirtyUp()
  }
  notifyObservers() {
    if (this._dirtyObservable && !this._observerNotifying && this._activeObservable) {
      this._observerNotifying = !0
      for (const e of this._dirtyKeys) {
        for (const t of this._propertyObservables[e] || []) this.notifyPropertyObserver(t, e)
        isDebug && delDebugMap(this, e)
      }
      this._observerNotifying = !1
      this._dirtyKeys.clear()
    }
    super.notifyObservers()
  }
  notifyPropertyObserver(observer: ChangeObserver<this>, key: string) {
    observer(this._valueCache[key])
  }
  onChanged(observer: ChangeObserver<this>) {
    return super.onChanged(observer)
  }
  notifyObserver(observer: ChangeObserver<this>) {
    observer(this as never)
  }
  deepCopy() {
    const e: Partial<this> = {}
    for (const t in this) {
      this.hasOwnProperty(t) && (e[t] = deepCopy(this[t]))
    }
    return e
  }
}
const debugMap = new Map<ObservableObject, Record<string, Error>>()
function addDebug(obj: ObservableObject, t: string) {
  debugMap.has(obj) || debugMap.set(obj, {})
  debugMap.get(obj)![t] = Error()
}
function delDebugMap(obj: ObservableObject, t: string) {
  if (debugMap.has(obj)) {
    const i = debugMap.get(obj)!
    i[t] && delete i[t]
  }
}
if (isDebug) {
  const e = setInterval(() => {
    ;(function () {
      for (const items of debugMap.values())
        for (const key in items)
          return (
            debug.error(`ObservableObject property "${key}" was still dirty after one tick! Did you forget a .commit()?`),
            debug.error("See stack trace of the property write below:"),
            debug.error(items[key].stack),
            !0
          )
      return !1
    })() &&
      void 0 !== e &&
      clearInterval(e)
  }, 16)
}
