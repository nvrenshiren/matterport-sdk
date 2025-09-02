export class ObserverManager {
  observers: Set<{ notify: Function }>
  constructor(...ags: any[]) {
    this.observers = new Set()
  }
  observe(e: { notify: Function }) {
    this.observers.add(e)
    const t = this
    return {
      renew() {
        t.observers.add(e)
      },
      cancel() {
        t.removeObserver(e)
      }
    }
  }
  removeObserver(e: { notify: Function }) {
    this.observers.delete(e)
  }
  notify() {
    for (const e of this.observers) e.notify()
  }
}
