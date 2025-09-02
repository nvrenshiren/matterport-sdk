import { DiffRecord, DiffState, MonitorBase } from "../other/71954"
import { TargetMonitors } from "./targetMonitors"
import { ObservableMap } from "./observable.map"
import { deepCopy, merge } from "../utils/object.utils"
export class SweepsMonitor<T extends ObservableMap = ObservableMap> extends MonitorBase<T> {
  target: T
  constructor(e: T, t, n?) {
    super(t, n)
    this.target = e
    for (const i of e.keys) {
      const r = e.get(i)
      const a = new TargetMonitors(r, t, n)
      a.onChanged(this.triggerChangeHandlers), (this.targetMonitors[i] = a)
    }
    const a = {
      onAdded: (e, a) => {
        const o = new TargetMonitors(e, t, n)
        o.onChanged(this.triggerChangeHandlers), (this.targetMonitors[a] = o)
        const l = this.diffRecord.findIndex(e => e.index === a)
        ;-1 !== l && this.diffRecord.splice(l, 1)
        const c = new DiffRecord(a, DiffState.added, deepCopy(e))
        ;-1 === l && this.diffRecord.push(c), this.triggerChangeHandlers(c)
      },
      onRemoved: (e, t) => {
        delete this.targetMonitors[t]
        const n = this.diffRecord.findIndex(e => e.index === t)
        ;-1 !== n && this.diffRecord.splice(n, 1)
        const s = new DiffRecord(t, DiffState.removed, deepCopy(e))
        ;-1 === n && this.diffRecord.push(s), this.triggerChangeHandlers(s)
      }
    }
    this.target.onElementChanged(a)
  }

  commitChanges() {
    this.invokeCallbacks(this.getDiffRecord())
  }
  getDiffRecord() {
    const e: DiffRecord[] = []
    for (const t in this.targetMonitors) {
      const n = this.targetMonitors[t]
      if (n.hasDiffRecord()) {
        const s = n.getDiffRecord()
        const a = this.diffRecord.findIndex(e => e.index === t)
        ;-1 !== a ? merge(this.diffRecord[a].diff, s) : e.push(new DiffRecord(t, DiffState.updated, s))
      }
    }
    return this.diffRecord.concat(e)
  }
}
