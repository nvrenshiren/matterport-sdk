import { deepCopy } from "../utils/object.utils"
import { ChangeObserver, Observable } from "./observable"
export class ObservableValue<T> extends Observable<T> {
  private _value: T

  constructor(e: T) {
    super()
    this.value = e
  }
  notifyObserver(e: ChangeObserver<T>) {
    e(this.value)
  }
  get value() {
    return this._value
  }
  set value(e: T) {
    this._value !== e && (this.removeChildObservables(this._value), this.addChildObservable(e), (this._value = e), this.setDirty())
  }
  deepCopy(): T {
    return deepCopy(this._value)
  }
}
export const createObservableValue = <T>(e: T) => new ObservableValue(e)
