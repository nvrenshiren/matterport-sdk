import { Data } from "../core/data"
import { Subscription, createSubscription } from "../core/subscription"
import { InvalidFloorExceptionError } from "../error/invalidFloorException.error"
import { FloorsObject } from "../modules/floors.module"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class FloorsData extends Data {
  name: string
  floors: ObservableMap<FloorsObject>
  constructor(e: Record<string, FloorsObject> = {}) {
    super()
    this.name = "floors"
    this.floors = createObservableMap(e)
    this.floors.values
  }
  onNameChange(e: ChangeObserver<string>) {
    let t: Subscription[] = []
    return createSubscription(
      () => {
        this.getOrderedValues().forEach((n, i) => {
          t.push(n.onPropertyChanged("name", e))
        })
      },
      () => {
        t.forEach(e => e.cancel()), (t = [])
      },
      !0
    )
  }
  addFloor(e: FloorsObject) {
    this.floors.set(e.id, e)
  }
  getFloor(e: string) {
    if (!this.floors.has(e)) throw new InvalidFloorExceptionError()
    return this.floors.get(e)
  }
  hasFloor(e: string) {
    return this.floors.has(e)
  }
  getFloorAtIndex(e: number) {
    return this.floors.values.find(t => t.index === e)
  }
  getFloorByMeshGroup(e: number) {
    return this.floors.values.find(t => t.meshGroup === e)
  }
  getFloorCount() {
    return this.floors.length
  }
  getCollection() {
    return this.floors
  }
  iterate(e: (value: FloorsObject, index: number, array: FloorsObject[]) => void) {
    return this.getOrderedValues().forEach(e)
  }
  getTopFloor() {
    const e = this.getOrderedValues()
    if (!e.length) throw new InvalidFloorExceptionError("Cannot get top floor, model has no floors")
    return e[e.length - 1]
  }
  getBottomFloor() {
    const e = this.getOrderedValues()
    if (!e.length) throw new InvalidFloorExceptionError("Cannot get bottom floor, model has no floors")
    return e[0]
  }
  getFloorAtHeight(e: number, t = !1) {
    const n = this.getOrderedValues()
    t && n.reverse()
    for (const t of n) {
      const n = t.boundingBox
      if (n.min.y <= e && e <= n.max.y) return t
    }
    const i = this.getBottomFloor()
    return e < i.boundingBox.min.y ? i : this.getTopFloor()
  }
  getClosestFloorAtHeight(e: number) {
    let t,
      n = 1 / 0
    for (const i of this.floors) {
      const s = Math.abs(i.medianSweepHeight() - e)
      n > s && ((n = s), (t = i))
    }
    return t
  }
  rename(e: string, t: string) {
    if (!this.floors.has(e)) return
    const n = this.floors.get(e)
    n.name = t
    n.commit()
  }
  getOrderedValues() {
    return this.floors.values.sort((e, t) => e.index - t.index)
  }
  getFloorIdMap(e: boolean) {
    const t: Record<string, string> = {}
    for (const n of this.floors.values) e ? (t[String(n.index)] = n.id) : (t[n.id] = String(n.index))
    return t
  }
}
