import { Vector2 } from "three"
import { DragAndDropObject } from "../message/event.message"
import { Data } from "../core/data"
import { LabelObject } from "../object/label.object"
import { ObservableValue } from "../observable/observable.value"
export class LabelEditorData extends Data {
  data: any
  name: string
  pendingLabelObservable: ObservableValue<null | LabelObject>
  progressObservable: ObservableValue<number>
  screenPositionObservable: ObservableValue<null | Vector2>
  toolStateObservable: ObservableValue<any>
  currentIdObservable: ObservableValue<null | string>
  constructor(e) {
    super()
    this.data = e
    this.name = "label-editor"
    this.pendingLabelObservable = new ObservableValue(null)
    this.progressObservable = new ObservableValue(-1)
    this.screenPositionObservable = new ObservableValue(null)
    this.toolStateObservable = new ObservableValue(DragAndDropObject.ToolState.CLOSED)
    this.currentIdObservable = new ObservableValue(null)
  }
  onDataChanged(e) {
    return this.data.onChanged(e)
  }
  onScreenPositionChanged(e) {
    return this.screenPositionObservable.onChanged(e)
  }
  onProgressChanged(e) {
    return this.progressObservable.onChanged(e)
  }
  onToolStateChanged(e) {
    return this.toolStateObservable.onChanged(e)
  }
  onCurrentIdChanged(e) {
    return this.currentIdObservable.onChanged(e)
  }
  getLabel(e) {
    if (null === e) return null
    const t = this.pendingLabelObservable.value
    return null !== t && t.sid === e ? this.pendingLabel : this.data.getLabel(e)
  }
  get pendingLabel() {
    return this.pendingLabelObservable.value
  }
  setPending(e) {
    this.pendingLabelObservable.value = e
  }
  onPendingChanged(e) {
    return this.pendingLabelObservable.onChanged(e)
  }
  get screenPosition() {
    return this.screenPositionObservable.value
  }
  setScreenPosition(e) {
    this.screenPositionObservable.value = e
  }
  get progress() {
    return this.progressObservable.value
  }
  setProgress(e) {
    this.progressObservable.value = e
  }
  get toolState() {
    return this.toolStateObservable.value
  }
  setToolState(e) {
    this.toolStateObservable.value = e
  }
  get currentId() {
    return this.currentIdObservable.value
  }
  setCurrentId(e) {
    this.currentIdObservable.value = e
  }
}
