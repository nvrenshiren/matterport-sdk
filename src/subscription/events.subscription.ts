export class EventsSubscription<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> {
  target: HTMLElement
  type: K
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  options?: boolean
  constructor(e, t, n, i?) {
    this.target = e
    this.type = t
    this.listener = n
    this.options = i
    this.renew()
  }
  renew() {
    this.target.addEventListener(this.type, this.listener, this.options)
  }
  cancel() {
    this.target.removeEventListener(this.type, this.listener)
  }
}
