import { Plane, Vector3 } from "three"
import * as m from "../const/52498"
import { AlignmentType } from "../object/sweep.object"
import { PhraseKey } from "../const/phrase.const"
import { Data } from "../core/data"
import { ISubscription } from "../core/subscription"
import { FloorsObject } from "../modules/floors.module"
import { ChangeObserver } from "../observable/observable"
import { ObservableArray } from "../observable/observable.array"
import { ObservableMap } from "../observable/observable.map"
import { ObservableObject } from "../observable/observable.object"
import { ObservableValue } from "../observable/observable.value"
import { AnimationProgress } from "../webgl/animation.progress"
import { AppData, AppMode } from "./app.data"
import { FloorsData } from "./floors.data"
import { SweepsData } from "./sweeps.data"
import { ViewmodeData } from "./viewmode.data"
import { defaultMeshGroup } from "../const/52498"
class FloorState extends ObservableObject {
  hidden: boolean
  navigable: boolean
  hasEnabledAlignedSweeps: boolean
  hasEnabledUnalignedSweeps: boolean
  constructor() {
    super()
    this.hidden = !1
    this.navigable = !0
    this.hasEnabledAlignedSweeps = !1
    this.hasEnabledUnalignedSweeps = !1
  }
}
class FloorStateHelper {
  floors: FloorsData
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  applicationData: AppData
  currentFloorObservable: ObservableValue<FloorsObject | null>
  bindings: ISubscription[]
  states: ObservableMap<FloorState>
  _navigableFloorIds: ObservableArray<string>
  hasEnabledAlignedSweeps: boolean
  updateFloorSweepData: () => void
  updateHidden: () => void
  updateNavigable: () => void
  constructor(e: FloorsData, t: ViewmodeData, n: SweepsData, i: AppData, s: ObservableValue<FloorsObject | null>) {
    this.floors = e
    this.viewmodeData = t
    this.sweepData = n
    this.applicationData = i
    this.currentFloorObservable = s
    this.bindings = []
    this.states = new ObservableMap()
    this._navigableFloorIds = new ObservableArray()
    this.hasEnabledAlignedSweeps = !1
    this.updateFloorSweepData = () => {
      const e = this.sweepData
      if (!this.isEditMode()) {
        this.states.values.forEach(e => {
          e.hasEnabledAlignedSweeps = !1
          e.hasEnabledUnalignedSweeps = !1
        })
        e.iterate(e => {
          if (null !== e.floorId) {
            let t = this.getState(e.floorId) || this.initializeFloorState(e.floorId)

            e.alignmentType === AlignmentType.ALIGNED
              ? t.hasEnabledAlignedSweeps || (t.hasEnabledAlignedSweeps = e.enabled)
              : t.hasEnabledUnalignedSweeps || (t.hasEnabledUnalignedSweeps = e.enabled)
            t.commit()
            this.hasEnabledAlignedSweeps || (this.hasEnabledAlignedSweeps = e.enabled)
          }
        })
      }

      this.updateNavigable()
    }
    this.updateHidden = () => {
      const e = !this.currentFloorId,
        t = this.isViewingAlignedPano()
      this.states.keys.forEach(n => {
        const i = !!n && n === this.currentFloorId,
          s = this.getState(n)
        ;(s.hidden = !(e || i || t)), s.commit()
      })
    }
    this.updateNavigable = () => {
      const e = this.isEditMode(),
        t = this.isViewingAlignedPano(),
        n = this.viewmodeData.isDollhouse() || this.viewmodeData.isFloorplan()
      this.states.keys.forEach(i => {
        const s = this.getState(i)
        ;(s.navigable = !!e || (t ? s.hasEnabledAlignedSweeps : !!n || s.hasEnabledAlignedSweeps || s.hasEnabledUnalignedSweeps)), s.commit()
      })
      const i: string[] = []
      this.floors.iterate(e => {
        this.getState(e.id).navigable && i.push(e.id)
      })
      this._navigableFloorIds.replace(i)
    }
    this.bindings.push(
      t.makeModeChangeSubscription(this.updateHidden),
      n.makeSweepChangeSubscription(this.updateHidden),
      s.onChanged(this.updateHidden),
      t.makeModeChangeSubscription(this.updateNavigable),
      n.makeSweepChangeSubscription(this.updateNavigable),
      i.onPropertyChanged("application", this.updateFloorSweepData)
    )
    this.initializeFloorStates()
    this.updateFloorSweepData()
    this.updateHidden()
  }

  getState(e: string) {
    return this.states.get(e)
  }
  get navigableFloorIds() {
    return this._navigableFloorIds.values()
  }
  onNavigableFloorIdsChanged(e: ChangeObserver<string>) {
    return this._navigableFloorIds.onChanged(e)
  }
  isViewingAlignedPano() {
    return this.viewmodeData.isInside() && void 0 !== this.sweepData.currentAlignedSweepObject
  }
  isEditMode() {
    return this.applicationData.application === AppMode.WORKSHOP
  }
  get currentFloorId() {
    return this.currentFloorObservable.value ? this.currentFloorObservable.value.id : null
  }
  initializeFloorStates() {
    this.floors.iterate(e => this.initializeFloorState(e.id))
  }
  initializeFloorState(e: string) {
    const t = new FloorState()
    this.states.set(e, t)
    return t
  }
}
function defaultLocalize(e, t) {
  return e
}
const defaultConfig = {
  floorChangesEnabled: () => !0
}
export class FloorsViewData extends Data {
  name: string
  floorSelectable: boolean
  currentFloorObservable: ObservableValue<FloorsObject | null>
  transitionObservable: ObservableValue<{ from?: string | null; to?: string | null; progress: AnimationProgress; promise: Promise<void> }>
  _observableFloorsSelectMode: ObservableValue<boolean>
  _observableRoomSelectMode: ObservableValue<boolean>
  _showFloorSelection: ObservableValue<boolean>
  onlyShowActiveFloor: ObservableValue<boolean>
  showAllFloorsOption: boolean
  floorSelectHoverEnabled: boolean
  getFloorMin: (e?: string | null) => number
  floors: FloorsData
  getFloorMinPlane: (e: string) => Plane
  getFloorCentroid: (e: Vector3, t: string) => Vector3
  isHidden: (e: any) => boolean
  stateHelper: FloorStateHelper
  isNavigable: (e: any) => boolean
  updateViewData: () => void
  derivedData: Record<string, { id: string; index: number; name: string }>
  getViewData: (e: string) => { id: string; index: number; name: string }
  getAllViewData: () => { id: string; index: number; name: string }[]
  getFloor: (e: string) => FloorsObject
  config: Record<string, Function>
  localize: (...rest: any[]) => string
  constructor(e: FloorsData, t, n, s, r, o) {
    super()
    this.name = "floors-view"
    this.floorSelectable = !1
    this.currentFloorObservable = new ObservableValue(null)
    this.transitionObservable = new ObservableValue({
      from: null,
      to: null,
      progress: new AnimationProgress(0),
      promise: Promise.resolve()
    })
    this._observableFloorsSelectMode = new ObservableValue(!1)
    this._observableRoomSelectMode = new ObservableValue(!1)
    this._showFloorSelection = new ObservableValue(!1)
    this.onlyShowActiveFloor = new ObservableValue(!1)
    this.showAllFloorsOption = !0
    this.floorSelectHoverEnabled = !0
    this.getFloorMin = e => {
      const t = e || this.currentFloorId || this.bottomFloorId
      return this.floors.getFloor(t).bottom
    }
    this.getFloorMinPlane = e => {
      const t = e || this.currentFloorId || this.bottomFloorId
      return this.floors.getFloor(t).groundPlane
    }
    this.getFloorCentroid = (e, t) => {
      const n = t || this.currentFloorId || this.bottomFloorId
      return this.floors.getFloor(n).boundingBox.getCenter(e)
    }
    this.isHidden = e => "string" == typeof e && this.stateHelper.getState(e).hidden
    this.isNavigable = e => "string" == typeof e && this.stateHelper.getState(e).navigable
    this.updateViewData = () => {
      this.floors.iterate(e => {
        this.derivedData[e.id] = {
          id: e.id,
          index: e.index,
          name: this.getFloorName(e.id)
        }
      })
      this.commit()
    }
    this.getViewData = e => {
      if (!this.derivedData[e]) {
        const t = this.floors.getFloor(e)
        this.derivedData[e] = {
          id: t.id,
          index: t.index,
          name: this.getFloorName(t.id)
        }
      }
      return this.derivedData[e]
    }
    this.getAllViewData = () => {
      const e: Array<ReturnType<FloorsViewData["getViewData"]>> = []
      this.floors.iterate(t => {
        e.push(this.getViewData(t.id))
      })
      return e
    }
    this.getFloor = e => this.floors.getFloor(e)
    this.floors = e
    this.config = o || defaultConfig
    this.localize = r || defaultLocalize
    this.derivedData = {}
    this.stateHelper = new FloorStateHelper(e, t, n, s, this.currentFloorObservable)
    this.updateViewData()
  }
  isCurrentOrAllFloors(e: string | null) {
    return !e || !this.currentFloorId || e === this.currentFloorId
  }
  isCurrentMeshGroupOrAllFloors(e: number) {
    return this.currentFloorMeshGroup === defaultMeshGroup || this.currentFloorMeshGroup === e
  }
  isCurrentFloorIndexOrAllFloors(e: number) {
    return this.currentFloorIndex === e || this.currentFloorIndex === m.qE
  }
  makeFloorChangeSubscription(e: ChangeObserver<FloorsObject>) {
    return this.currentFloorObservable.onChanged(e)
  }
  get currentFloor() {
    return this.currentFloorObservable.value
  }
  get currentFloorId() {
    return this.currentFloorObservable.value?.id || null
  }
  get currentFloorIndex() {
    return this.currentFloorObservable.value ? this.currentFloorObservable.value.index : m.qE
  }
  get currentFloorMeshGroup() {
    return this.currentFloorObservable.value ? this.currentFloorObservable.value.meshGroup : defaultMeshGroup
  }
  getFloorIndexForMeshGroup(e: number) {
    if (e === defaultMeshGroup) return m.qE
    const t = this.floors.getFloorByMeshGroup(e)
    return t ? t.index : m.qE
  }
  get bottomFloorId() {
    return this.floors.getBottomFloor().id
  }
  get topFloorId() {
    return this.floors.getTopFloor().id
  }
  get singleFloor() {
    if (1 === this.floors.getFloorCount()) return this.floors.getFloorAtIndex(0)
  }
  isMultifloor() {
    return this.floors.getFloorCount() > 1
  }
  get nearestFloorId() {
    return this.transitionActive ? (this.transition.progress.value > 0.5 ? this.transition.to : this.transition.from) : this.currentFloorId
  }
  get nearestFloor() {
    const e = this.nearestFloorId
    return e ? this.floors.getFloor(e) : void 0
  }
  get transitionActive() {
    return this.transition.progress.active
  }
  get transition() {
    return this.transitionObservable.value
  }
  transitionToFloorInstant(e: string | null) {
    this.currentFloorObservable.value = e ? this.floors.getFloor(e) : null
    this.commit()
  }
  transitionToFloor(from: string | null, to: string, n: number, promise: Promise<any>) {
    const progress = this.transitionObservable.value.progress
    progress.modifyAnimation(0, 1, n)
    this.transitionObservable.value = {
      from,
      to,
      progress,
      promise
    }
    this.commit()
    promise.then(() => {
      this.transitionToFloorInstant(to)
    })
  }
  get totalFloors() {
    return this.floorsEnabled ? this.floors.getFloorCount() : 1
  }
  hasEnabledAlignedSweeps(e: string) {
    return null !== e ? this.stateHelper.getState(e).hasEnabledAlignedSweeps : this.stateHelper.hasEnabledAlignedSweeps
  }
  getNavigableFloorIds() {
    return this.stateHelper.navigableFloorIds
  }
  onNavigableFloorIdsChanged(e: ChangeObserver<string>) {
    return this.stateHelper.onNavigableFloorIdsChanged(e)
  }
  getHighestVisibleFloor() {
    return this.currentFloor ? this.currentFloor : this.floors.getTopFloor()
  }
  getHighestVisibleFloorId() {
    return this.getHighestVisibleFloor().id
  }
  getFloorIdMap() {
    const e: Record<string, { id: string; name: string; items: any[] }> = {}
    this.iterate(t => {
      e[t.id] = {
        id: t.id,
        name: t.name,
        items: []
      }
    })
    return e
  }
  iterate(e: (e: ReturnType<FloorsViewData["getViewData"]>) => void) {
    this.floors.iterate(t => {
      const n = this.getViewData(t.id)
      n && e(n)
    })
  }
  getFloorNames() {
    const e: string[] = []
    return this.floorsEnabled
      ? (this.floors.iterate(t => {
          e[t.index] = this.getFloorName(t.id)
        }),
        e)
      : e
  }
  getFloorName(e: string) {
    if (!e) return this.localize(PhraseKey.FLOOR_ALL)
    const t = this.floors.getFloor(e)
    return void 0 !== t.name && "" !== t.name ? t.name : this.getDefaultFloorName(e)
  }
  getDefaultFloorName(e: string) {
    const t = this.floors.getFloor(e)
    return this.localize(PhraseKey.SHOWCASE.FLOORS.DEFAULT_NAME, t.index + 1)
  }
  getFloorsVisibility() {
    if (this.currentFloorId) {
      const e: number[] = []
      this.floors.iterate(t => {
        e[t.index] = t.id === this.currentFloorId ? 1 : 0
      })
      return e
    }
    return []
  }
  get floorsEnabled() {
    return this.config.floorChangesEnabled() as boolean
  }
  get floorSelectModeActive() {
    return this._observableFloorsSelectMode.value
  }
  set floorSelectModeActive(e) {
    const t = e && this.floorsEnabled
    t !== this._observableFloorsSelectMode.value && ((this._observableFloorsSelectMode.value = t), this.commit())
  }
  onFloorSelectModeChange(e: ChangeObserver<boolean>) {
    return this._observableFloorsSelectMode.onChanged(e)
  }
  get showFloorSelection() {
    return this._showFloorSelection.value
  }
  set showFloorSelection(e) {
    e !== this._showFloorSelection.value && ((this._showFloorSelection.value = e), this.commit())
  }
  onShowFloorSelectionChanged(e: ChangeObserver<boolean>) {
    return this._showFloorSelection.onChanged(e)
  }
  get roomSelectModeActive() {
    return this._observableRoomSelectMode.value
  }
  set roomSelectModeActive(e) {
    const t = e
    t !== this._observableRoomSelectMode.value && ((this._observableRoomSelectMode.value = t), this.commit())
  }
  onRoomSelectModeChange(e: ChangeObserver<boolean>) {
    return this._observableRoomSelectMode.onChanged(e)
  }
  get isInAllFloorsMode() {
    return this.isMultifloor() && this.currentFloorIndex === m.qE
  }
}
