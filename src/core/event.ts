export class Event {
  eventType: string
  _propagationStopped: boolean
  _defaultPrevented: boolean
  constructor(...rest: any[]) {
    this.eventType = "input"
    this._propagationStopped = !1
    this._defaultPrevented = !1
  }
  stopPropagation() {
    this._propagationStopped = !0
  }
  get propagationStopped() {
    return this._propagationStopped
  }
  preventDefault() {
    this._defaultPrevented = !0
  }
  get defaultPrevented() {
    return this._defaultPrevented
  }
}
