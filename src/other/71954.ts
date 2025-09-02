import { AggregationType } from "../const/2541"
import { EngineTickState } from "../const/engineTick.const"
import { ObservableMap } from "../observable/observable.map"
import { TargetMonitors } from "../observable/targetMonitors"
import { delArrayItem } from "../utils/38042"

export enum DiffState {
  added = "added",
  removed = "removed",
  updated = "updated"
}
export class DiffRecord {
  index: string
  action: any
  diff: any
  constructor(e, t, n) {
    this.index = e
    this.action = t
    this.diff = n
  }
}
export class MonitorBase<T extends ObservableMap = ObservableMap> {
  changedHandlers: any[]
  awaitingInvoke: boolean
  diffRecord: DiffRecord[]
  targetMonitors: Record<string, TargetMonitors<T>>
  triggerChangeHandlers: any
  config: any
  updatePhaseSync: any
  constructor(e, t) {
    this.changedHandlers = []
    this.awaitingInvoke = !1
    this.diffRecord = []
    this.targetMonitors = {}
    this.triggerChangeHandlers = this.invokeChangeHandlers.bind(this)
    this.config = e
    this.updatePhaseSync = t
    if (this.config.aggregationType === AggregationType.NextFrame) {
      if (!t) throw Error("UpdatePhaseSync required for NextFrame aggregation")
    } else if (this.config.aggregationType === AggregationType.Duration) throw Error("Aggregation Type not implemented")
  }
  hasDiffRecord() {
    return this.diffRecord.length > 0
  }
  clearDiffRecord() {
    this.diffRecord = []
    for (const e in this.targetMonitors) {
      const t = this.targetMonitors[e]
      t.hasDiffRecord() && t.clearDiffRecord()
    }
    this.awaitingInvoke = !1
  }
  onChanged(e) {
    this.changedHandlers.push(e)
  }
  removeOnChanged(e) {
    delArrayItem(this.changedHandlers, e)
  }
  invokeCallbacks(e) {
    if (this.changedHandlers.length > 0) for (const t of this.changedHandlers) t(e)
  }
  invokeChangeHandlers(e) {
    switch (this.config.aggregationType) {
      case AggregationType.Immediate:
        this.invokeCallbacks(e)
        break
      case AggregationType.NextFrame:
        this.awaitingInvoke ||
          ((this.awaitingInvoke = !0),
          this.updatePhaseSync.after(EngineTickState.End).then(() => {
            this.awaitingInvoke && (this.invokeCallbacks(e), (this.awaitingInvoke = !1))
          }))
        break
      case AggregationType.Manual:
    }
  }
}
