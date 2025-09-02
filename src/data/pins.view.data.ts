import { Vector2 } from "three"
import { PinEditorState } from "../const/62612"
import { Data } from "../core/data"
import TagsModule from "../modules/tags.module"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap } from "../observable/observable.map"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
export class PinsViewData extends Data {
  pins: ObservableMap<ReturnType<TagsModule["getPinUpdate"]>>
  creatingPin: boolean
  pinEditorStateObservable: ObservableValue<PinEditorState>
  selectedPinObservable: ObservableValue<null | string>
  focusedPinObservable: ObservableValue<null | ReturnType<TagsModule["getPinUpdate"]>>
  editableObservable: ObservableValue<boolean>
  progressObservable: ObservableValue<number>
  screenPositionObservable: ObservableValue<null | Vector2>
  canPlaceObservable: ObservableValue<boolean>
  canAddObservable: ObservableValue<boolean>
  iteratePins: (e: any) => void
  constructor() {
    super()
    this.name = "pins-view-data"
    this.pins = new ObservableMap()
    this.creatingPin = !1
    this.pinEditorStateObservable = createObservableValue(PinEditorState.IDLE)
    this.selectedPinObservable = createObservableValue(null)
    this.focusedPinObservable = createObservableValue(null)
    this.editableObservable = createObservableValue(!1)
    this.progressObservable = createObservableValue(-1)
    this.screenPositionObservable = createObservableValue(null)
    this.canPlaceObservable = createObservableValue(!0)
    this.canAddObservable = createObservableValue(!0)
    this.iteratePins = e => {
      this.pins.forEach(e)
    }
  }
  onPinUpdate(e) {
    return this.pins.onElementChanged(e)
  }
  updatePin(e) {
    this.pins.set(e.id, e)
  }
  getPin(e: string) {
    return this.pins.get(e)
  }
  removePin(e: string) {
    this.pins.get(e) && this.pins.delete(e)
  }
  removePinsByType(e: string) {
    this.pins.forEach((t, n) => {
      t.pinType === e && this.pins.delete(t.id)
    })
  }
  get creatingNewPin() {
    return this.creatingPin
  }
  setSelectedPinId(e: string | null) {
    this.selectedPinObservable.value = e
  }
  get selectedPinId() {
    return this.selectedPinObservable.value
  }
  onSelectedPinChanged(e: ChangeObserver<string | null>) {
    return this.selectedPinObservable.onChanged(e)
  }
  setFocusedPin(e: ReturnType<TagsModule["getPinUpdate"]> | null) {
    this.focusedPinObservable.value = e
  }
  get focusedPin() {
    return this.focusedPinObservable.value
  }
  onFocusedPinChanged(e: ChangeObserver<ReturnType<TagsModule["getPinUpdate"]> | null>) {
    return this.focusedPinObservable.onChanged(e)
  }
  setPinEditorState(e: PinEditorState) {
    switch (e) {
      case PinEditorState.IDLE:
        this.creatingPin = !1
        break
      case PinEditorState.CREATING:
        this.creatingPin = !0
    }
    this.pinEditorStateObservable.value = e
  }
  get pinEditorState() {
    return this.pinEditorStateObservable.value
  }
  onPinEditorStateChanged(e: ChangeObserver<PinEditorState>) {
    return this.pinEditorStateObservable.onChanged(e)
  }
  setProgress(e: number) {
    this.progressObservable.value = e
  }
  get progress() {
    return this.progressObservable.value
  }
  onProgressChanged(e: ChangeObserver<number>) {
    const t = this.progressObservable.onChanged(e)
    t.renew()
    return t
  }
  get screenPosition() {
    return this.screenPositionObservable.value
  }
  setScreenPosition(e) {
    this.screenPositionObservable.value = e
  }
  onScreenPositionChanged(e) {
    return this.screenPositionObservable.onChanged(e)
  }
  get isPinEditable() {
    return this.editableObservable.value
  }
  setEditablePin(e: boolean) {
    this.editableObservable.value = e
  }
  onPinEditableChanged(e) {
    return this.editableObservable.onChanged(e)
  }
  get canAdd() {
    return this.canAddObservable.value
  }
  setCanAdd(e: boolean) {
    this.canAddObservable.value = e
  }
  onCanAddChanged(e: ChangeObserver<boolean>) {
    return this.canAddObservable.onChanged(e)
  }
  get canPlace() {
    return this.canPlaceObservable.value
  }
  setCanPlace(e: boolean) {
    this.canPlaceObservable.value = e
  }
  onCanPlaceChanged(e: ChangeObserver<boolean>) {
    return this.canPlaceObservable.onChanged(e)
  }
}
