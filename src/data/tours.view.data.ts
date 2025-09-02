import { TourMode } from "../const/tour.const"
import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
import { TourData } from "./tour.data"
export class ToursViewData extends Data {
  data: TourData
  currentTourMode: TourMode
  reelOpen: boolean
  tourSweepsObservable: ObservableMap<string[]>
  tourModeSettingObservable: ObservableValue<TourMode>
  constructor(e: TourData, t: TourMode, n: TourMode) {
    super()
    this.data = e
    this.currentTourMode = n
    this.name = "tours-view-data"
    this.reelOpen = !1
    this.tourSweepsObservable = createObservableMap()
    this.tourModeSettingObservable = createObservableValue(t)
  }
  getPhotosForTour() {
    return this.data.getPhotosForTour()
  }
  isTourEmpty() {
    return 0 === this.data.getSnapshotCount()
  }
  onReelChanged(e) {
    return this.data.getReel().onChanged(e)
  }
  getTourStoryMode() {
    return this.currentTourMode === TourMode.STORIES
  }
  get tourModeSetting() {
    return this.tourModeSettingObservable.value
  }
  setTourModeSetting(e: TourMode) {
    this.tourModeSettingObservable.value = e
  }
  onTourModeSettingChanged(e: ChangeObserver<TourMode>) {
    return this.tourModeSettingObservable.onChanged(e)
  }
  getSnapshot(e: string) {
    return this.data.getSnapshot(e)
  }
  setSweepsInToursAcrossViews(e) {
    this.atomic(() => {
      this.tourSweepsObservable.clear(),
        e.forEach(e => {
          this.addTourSweepForView(e.sweepId, e.viewId)
        })
    })
  }
  getViewsWithSweepInTour(e: string) {
    return this.tourSweepsObservable.get(e) || []
  }
  isSweepInAnyTour(e) {
    return this.tourSweepsObservable.has(e)
  }
  isSweepInTourForView(e: string, t: string) {
    return this.getViewsWithSweepInTour(e).includes(t)
  }
  onSweepsInToursChanged(e: ChangeObserver<string[]>) {
    return this.tourSweepsObservable.onChanged(e)
  }
  addTourSweepForView(e: string, t: string) {
    const n = this.tourSweepsObservable.get(e)
    n ? n.push(t) : this.tourSweepsObservable.set(e, [t])
  }
}
