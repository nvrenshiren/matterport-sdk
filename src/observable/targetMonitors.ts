import { delArrayItem } from "../utils/38042"
import { AggregationType } from "../const/2541"
import { EngineTickState } from "../const/engineTick.const"
import { ObservableMap } from "./observable.map"
import { ObservableObject } from "./observable.object"
import { deepCopy, diffObject } from "../utils/object.utils"
export class TargetMonitors<T extends ObservableMap = ObservableMap, D extends ObservableObject = ObservableObject> {
  updatePhaseSync: any
  target: T | D
  diffRecord: T | D | {}
  aggregationType: any
  changedHandlers: Function[]
  nextFramePromise: any
  originalData: T | D
  constructor(e: T | D, t, n) {
    this.updatePhaseSync = n
    this.target = e
    this.clearDiffRecord()
    this.target.onChanged(() => {
      this.diffRecord = diffObject(this.originalData, deepCopy(this.target), t.shallow)
      this.handleAggregation()
    })
    this.aggregationType = t.aggregationType
    this.changedHandlers = []
  }

  hasDiffRecord() {
    return Object.keys(this.diffRecord).length > 0
  }
  getDiffRecord() {
    return this.diffRecord
  }
  clearDiffRecord() {
    this.originalData = deepCopy(this.target)
    this.diffRecord = {}
  }
  onChanged(e: Function) {
    this.changedHandlers.push(e)
  }
  removeOnChanged(e) {
    delArrayItem(this.changedHandlers, e)
  }
  commitChanges() {
    this.triggerChangeHandlers(this.diffRecord)
  }
  handleAggregation() {
    switch (this.aggregationType) {
      case AggregationType.Immediate:
        this.triggerChangeHandlers(this.diffRecord)
        break
      case AggregationType.NextFrame:
        if (!this.updatePhaseSync) throw new Error("handleAggregation() -> Next frame aggregation requested, but updatePhaseSync is null")
        this.nextFramePromise ||
          (this.nextFramePromise = this.updatePhaseSync
            .after(EngineTickState.Begin)
            .then(() => {
              this.triggerChangeHandlers(this.diffRecord)
            })
            .finally(() => {
              this.nextFramePromise = void 0
            }))
        break
      case AggregationType.Duration:
        throw new Error("AggregationType.Duration: Please implement me :)")
      case AggregationType.Manual:
    }
  }
  triggerChangeHandlers(e) {
    if (this.changedHandlers.length > 0) for (const t of this.changedHandlers) t(e)
  }
}
