import { Vector3 } from "three"
import { MeasurePhase } from "../const/measure.const"
import { Data } from "../core/data"
import { createSubscription } from "../core/subscription"
import { ObservableValue } from "../observable/observable.value"
export class MeasureModeData extends Data {
  _groups: any[]
  _groupMap: {}
  onDataChangedCallbacks: Set<Function>
  _editingGroupId: null
  _creatingGroupId: null
  phase: MeasurePhase
  pressProgress: number
  selectedGroupIndexObservable: ObservableValue<number>
  pointPositionObservable: ObservableValue<null | Vector3>
  idVisibility: Set<unknown>
  constructor() {
    super(...arguments)
    this.name = "measure-mode"
    this._groups = []
    this._groupMap = {}
    this.onDataChangedCallbacks = new Set()
    this._editingGroupId = null
    this._creatingGroupId = null
    this.phase = MeasurePhase.CLOSED
    this.pressProgress = -1
    this.selectedGroupIndexObservable = new ObservableValue(-1)
    this.pointPositionObservable = new ObservableValue(null)
    this.idVisibility = new Set()
  }
  onPhaseChanged(e) {
    return this.onPropertyChanged("phase", e)
  }
  onDataChanged(e) {
    return createSubscription(
      () => this.onDataChangedCallbacks.add(e),
      () => this.onDataChangedCallbacks.delete(e),
      !0
    )
  }
  onPointPositionChanged(e) {
    return this.pointPositionObservable.onChanged(e)
  }
  onSelectedGroupIndexChanged(e) {
    return this.selectedGroupIndexObservable.onChanged(e)
  }
  modeActive() {
    return this.phase !== MeasurePhase.CLOSED
  }
  isEditingOrCreating() {
    //@ts-ignore
    return this.phase >= MeasurePhase.EDITING
  }
  *groups() {
    for (const e of this._groups) yield e
  }
  get selectedGroupSid() {
    const e = this.selectedGroupInfo
    return e && e.info.sid ? e.info.sid : null
  }
  get selectedGroupInfo() {
    return -1 === this.selectedGroupIndex ? null : this.getGroupInfo(this.selectedGroupIndex)
  }
  get creatingGroupId() {
    return this._creatingGroupId
  }
  set creatingGroupId(e) {
    this._creatingGroupId = e
  }
  get editingGroupId() {
    return this._editingGroupId
  }
  set editingGroupId(e) {
    this._editingGroupId = e
  }
  get groupCount() {
    return this._groups.length
  }
  get pointPosition() {
    return this.pointPositionObservable.value
  }
  get selectedGroupIndex() {
    return this.selectedGroupIndexObservable.value
  }
  getGroupInfo(e) {
    return e < 0 || e >= this._groups.length ? null : this._groups[e]
  }
  getGroupInfoBySid(e) {
    return e ? this._groupMap[e] : null
  }
  setPhase(e) {
    this.phase !== e && ((this.phase = e), this.commit())
  }
  notifyDataChanged() {
    this.onDataChangedCallbacks.forEach(e => e())
  }
  setPointPosition(e) {
    this.pointPositionObservable.value = e
  }
  setSelectedGroupIndex(e) {
    this.selectedGroupIndexObservable.value = e
  }
  repopulate(e) {
    this.clear()
    for (const t of e) {
      const e = t.clone()
      this._groups.push(e)
      this._groupMap[t.info.sid] = e
    }
    this.notifyDataChanged()
  }
  clear() {
    this._groups = []
    this._groupMap = {}
  }
}
