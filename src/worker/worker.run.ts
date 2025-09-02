import { Lock } from "./lock"
export class WorkerRun {
  worker: Worker
  lock: Lock
  constructor(r: Worker) {
    this.worker = r
    this.lock = new Lock()
  }
  async exec(r, t: Array<Transferable | OffscreenCanvas>) {
    const e = await this.lock.lock()
    return new Promise<any>((n, o) => {
      const i = (r: MessageEvent) => {
        this.worker.removeEventListener("message", i)
        n(r.data)
        e.unlock()
      }
      this.worker.addEventListener("message", i)
      this.worker.onerror = r => {
        o(r)
        e.unlock()
      }
      this.worker.postMessage(r, t)
    })
  }
}

export const createWorkerRun = (r: () => Worker) => () => {
  return new WorkerRun(r())
}
