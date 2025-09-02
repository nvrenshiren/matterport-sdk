import { DebugInfo } from "../core/debug"
import * as ss from "../other/18448"
import { OpenDeferred } from "../core/deferred"
const a = new DebugInfo("expiring-resource")
const o = new WeakMap<ExpiringResource, OpenDeferred>()
export function BuildOnStale(e: ExpiringResource | Object, t: Function) {
  ;(0, ss.y)(e, e => {
    e instanceof ExpiringResource && (e.onStale = t)
  })
}
export class ExpiringResource {
  onStale: Function
  value: any
  validUntil: Date | null
  constructor(e: any, t: Date | null) {
    this.value = e
    this.validUntil = t
  }
  refreshFrom(e: ExpiringResource) {
    if (!e) return
    this.value = e.value
    this.validUntil = e.validUntil
    const t = o.get(this)
    t && (t.resolve(), o.delete(this))
  }
  async get() {
    if (this.validUntil && this.onStale) {
      const e = Date.now()
      if (e + 6e4 + 1e4 > this.validUntil.getTime()) {
        let t = o.get(this)
        if (!t) {
          t = new OpenDeferred()
          o.set(this, t)
          this.onStale()
        }
        e + 6e4 + 1e3 > this.validUntil.getTime() && (a.info("Stale resource, waiting for refresh"), await t.nativePromise(), a.info("Refreshed resource"))
      }
    }
    return this.value
  }
  getCurrentValue() {
    return this.value
  }
}
