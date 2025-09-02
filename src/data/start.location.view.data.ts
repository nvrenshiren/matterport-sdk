import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class StartLocationViewData extends Data {
  startLocationsObservable: ObservableMap<string[]>
  constructor() {
    super()
    this.name = "start-location-view-data"
    this.startLocationsObservable = createObservableMap()
  }
  setStartLocations(e: Array<{ sweepId: string; viewId: string }>) {
    this.atomic(() => {
      this.startLocationsObservable.clear()
      e.forEach(e => {
        this.addStartLocationForView(e.sweepId, e.viewId)
      })
    })
  }
  getStartLocationsForSweep(e: string) {
    return this.startLocationsObservable.get(e) || []
  }
  isStartLocation(e: string) {
    return this.startLocationsObservable.has(e)
  }
  isStartLocationForView(e: string, t: string) {
    return this.getStartLocationsForSweep(e).includes(t)
  }
  onStartLocationSweepsChanged(e: ChangeObserver<string[]>) {
    return this.startLocationsObservable.onChanged(e)
  }
  addStartLocationForView(e: string, t: string) {
    const n = this.startLocationsObservable.get(e)

    n ? n.push(t) : this.startLocationsObservable.set(e, [t])
  }
}
