export class Lock {
  activePromise: Promise<Active>
  constructor() {
    this.activePromise = Promise.resolve(new Active())
  }
  async lock() {
    const e = new Promise<Active>(async e => {
      ;(await this.activePromise).onUnlock(() => e(new Active()))
    })
    const t = this.activePromise
    this.activePromise = e
    return  t
  }
}
class Active {
  unlockCB: () => void
  onUnlock(e: Active['unlockCB']) {
    this.unlockCB = e
  }
  unlock() {
    this.unlockCB()
  }
}
