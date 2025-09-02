import { Subscription, createSubscription } from "../core/subscription"
export type ChangeObserver<T = never> = (newValue: T) => void
export interface ElementChangedParams<T = never, K = string> {
  onRemoved?: (e?: T, k?: K) => void
  onAdded?: (e?: T, k?: K) => void
  onUpdated?: (e?: T, k?: K) => void
}

export class Observable<T = any> {
  isObservableProxy: boolean
  private readonly isObservable = true
  _dirtyObservable = false
  protected _activeObservable = true
  protected _observerNotifying = false
  private readonly _changeObservers = new Set<ChangeObserver<T>>()
  private readonly _parentObservables: Set<Observable<any>> = new Set()
  private readonly _childObservables: Set<Observable<any>> = new Set()
  constructor() {
    Object.defineProperties(this, {
      isObservable: {
        value: this.isObservable,
        writable: !1,
        enumerable: !1
      },
      _dirtyObservable: {
        value: this._dirtyObservable,
        enumerable: !1
      },
      _activeObservable: {
        value: this._activeObservable,
        enumerable: !1
      },
      _observerNotifying: {
        value: this._observerNotifying,
        enumerable: !1
      },
      _changeObservers: {
        value: this._changeObservers,
        writable: !1,
        enumerable: !1
      },
      _childObservables: {
        value: this._childObservables,
        writable: !1,
        enumerable: !1
      },
      _parentObservables: {
        value: this._parentObservables,
        writable: !1,
        enumerable: !1
      }
    })
  }

  /**
   * Register a callback to be called whenever any kind of change occurs with this object.
   * It is up to the deriving classes to determine what a "change" is.
   *
   * @param {ChangeObserver<T>} [observer]
   * @memberof Observable
   */
  public onChanged(observer: ChangeObserver<T>): Subscription {
    if (this._changeObservers.has(observer)) {
      throw new Error("This observer function is already observing this Observable, " + "and double subscriptions are not supported.")
    }
    return createSubscription(
      () => this._changeObservers.add(observer),
      () => this.removeOnChanged(observer),
      !0
    )
  }

  /**
   * Remove a specific callback registered to respond to any change event.
   *
   * @param {ChangeObserver} [observer]
   * @memberof Observable
   */
  public removeOnChanged(observer: ChangeObserver<T>): void {
    this._changeObservers.delete(observer)
  }

  /**
   * Call the "anything changed" callbacks associated with 'observable'.
   * Also calls it for any ancestors, then finally clears the dirty flag.
   */
  protected notifyObservers() {
    if (this._dirtyObservable && !this._observerNotifying && this._activeObservable) {
      this._observerNotifying = !0
      for (const e of this._changeObservers) this.notifyObserver(e)
      this._dirtyObservable = !1
      this._observerNotifying = !1
    }
  }

  protected notifyObserver(observer: ChangeObserver<T>): void {
    // The basic onChange() has no arguments (because an Observable itself has no value),
    // but any subclass will likely override this
    observer(undefined as never)
  }
  protected notifyDown() {
    for (const e of this._childObservables) e.notifyDown()
    this.notifyObservers()
  }
  protected notifyUp() {
    for (const e of this._parentObservables) e.notifyUp()
    this.notifyObservers()
  }
  /**
   * Set this object and all Observable ancestors as dirty,
   * then notify all observers. Generally used internally by the Observable* implementations,
   * but can also be triggered manually if needed
   */
  public setDirty(notify = true) {
    // We dirty the tree first BEFORE notifying,
    // because notifying will stop propagating if the observable is inactive
    this.setDirtyUp()
    notify && this.notifyUp()
  }

  protected setDirtyUp() {
    if (!this._dirtyObservable) {
      this._dirtyObservable = !0
      for (const e of this._parentObservables) e.setDirtyUp()
    }
  }

  /**
   * Add an Observable as a child to this one (if it's Observable)
   * This is what ensures onChange() notifications bubble up correctly
   * and setActive() flows down correctly
   */
  protected addChildObservable(obj: T | Observable<any>): void {
    if (Observable.isObservable(obj)) {
      this._childObservables.add(obj)
      obj._parentObservables.add(this)
    }
  }

  /**
   * Remove an Observable as a child to this one (if it's Observable)
   * This is what ensures onChange() notifications bubble up correctly,
   * and setActive() flows down correctly
   */
  protected removeChildObservables(obj: T | Observable<any>): void {
    if (Observable.isObservable(obj)) {
      this._childObservables.delete(obj)
      obj._parentObservables.delete(this)
    }
  }

  /**
   * Run a function *atomically*, meaning that even if you
   * mutate lots of parts of the Observable dozens of times,
   * listeners will only be notified once
   * @param func to fun
   */
  public atomic(func: () => void) {
    // If we are already inactive (aka in an atomic block),
    // we don't have to do anything, the outer atomic will handle this
    if (!this._activeObservable) {
      return func()
    }
    try {
      this.setActive(false)
      func()
    } finally {
      this.setActive(true)
    }
  }

  /**
   * Set whether this Observable (and all descendants) should be
   * considered active, aka notifying about changes
   * @param value
   */
  protected setActive(value: boolean) {
    const oldValue = this._activeObservable
    this._activeObservable = value
    if (!oldValue && value) {
      this.notifyObservers()
    }
    for (const child of this._childObservables) {
      child.setActive(value)
    }
  }

  /**
   * Return a deep copy of the target object of the observable,
   * without any observable members. See also the deepCopy util function
   */
  public deepCopy(): any {
    throw Error("deepCopy is only implemented in subclasses of Observable")
  }

  /**
   * Convenient static function to type check if object is Observable
   * @param obj
   */
  public static isObservable<T>(obj: any): obj is Observable<T> {
    return obj && obj.isObservable
  }
}
