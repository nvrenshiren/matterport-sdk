import { MaxTrimsPerFloor } from "../const/97178"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { createSubscription } from "../core/subscription"
import { TooManyTrimsError } from "../error/tooManyTrims.error"
import { MeshTrimObject } from "../object/meshTrim.object"
import { ObservableArray } from "../observable/observable.array"
import { ObservableMap } from "../observable/observable.map"
const Ne = new DebugInfo("MeshTrimData")
const Ue = -1
export class MeshTrimData extends Data {
  maxTrimsPerFloor: number
  maxAllFloorsTrims: number
  numberOfTrims: number
  meshTrimsByMeshGroup: ObservableMap<ObservableArray<MeshTrimObject>>
  meshTrimsById: ObservableMap<MeshTrimObject>
  onMeshGroupChangedCallbacks: Set<Function>
  onMeshTrimChangedCallbacks: Set<Function>
  updateMeshTrim: (e: any) => void
  notifyMeshGroupChanges: (e: any) => void
  singleFloorMeshGroup: number
  constructor() {
    super()
    this.maxTrimsPerFloor = MaxTrimsPerFloor
    this.maxAllFloorsTrims = MaxTrimsPerFloor
    this.numberOfTrims = 0
    this.meshTrimsByMeshGroup = new ObservableMap()
    this.meshTrimsById = new ObservableMap()
    this.onMeshGroupChangedCallbacks = new Set()
    this.onMeshTrimChangedCallbacks = new Set()
    this.updateMeshTrim = e => {
      for (const t of this.onMeshTrimChangedCallbacks) t(e)
    }
    this.notifyMeshGroupChanges = e => {
      for (const t of this.onMeshGroupChangedCallbacks) t(e)
    }
    this.meshTrimsByMeshGroup.set("-1", new ObservableArray())
  }
  addMeshGroups(e: number[]) {
    for (const t of e)
      if (!this.meshTrimsByMeshGroup.has(`${t}`)) {
        const e = new ObservableArray()
        this.meshTrimsByMeshGroup.set(`${t}`, e)
      }
    this.singleFloorMeshGroup || 1 !== e.length || (this.singleFloorMeshGroup = e[0])
  }
  add(...e: MeshTrimObject[]) {
    const t = new Set<number>()
    let i = !1
    this.meshTrimsById.atomic(() => {
      this.meshTrimsByMeshGroup.atomic(() => {
        for (const s of e) {
          void 0 !== this.singleFloorMeshGroup && (s.meshGroup = this.singleFloorMeshGroup)
          const e = s.meshGroup === Ue
          const o = `${s.meshGroup}`
          this.meshTrimsByMeshGroup.has(o) || this.meshTrimsByMeshGroup.set(o, new ObservableArray())
          const r = this.meshTrimsByMeshGroup.get(o)
          r.length < (e ? this.maxAllFloorsTrims : this.maxTrimsPerFloor)
            ? (r.push(s), this.meshTrimsById.set(s.id, s), t.add(s.meshGroup), s.onChanged(this.updateMeshTrim))
            : (Ne.debugWarn("Trims exceed floor limit (trimId, meshGroup):", s.id, s.meshGroup), (i = !0))
        }
      })
    })
    t.forEach(e => {
      const t = this.meshTrimsByMeshGroup.get(`${e}`)
      this.sortList(t), this.reassignIndexes(t), this.notifyMeshGroupChanges(e)
    })
    this.updateDerivedProperties()
    if (i) throw new TooManyTrimsError("Exceeding max trims")
  }
  delete(...e) {
    const t = new Set()
    this.meshTrimsByMeshGroup.atomic(() => {
      for (const i of e) {
        const e = this.meshTrimsByMeshGroup.get(`${i.meshGroup}`),
          s = e.indexOf(i)
        if (s >= 0) {
          ;(e.splice(s, 1)[0].enabled = !1), t.add(i.meshGroup), i.removeOnChanged(this.updateMeshTrim)
        } else Ne.error("Could not delete mesh trim:" + i.id)
      }
    }),
      t.forEach(e => {
        const t = this.meshTrimsByMeshGroup.get(`${e}`)
        this.reassignIndexes(t)
        this.notifyMeshGroupChanges(e)
      }),
      this.meshTrimsById.atomic(() => {
        e.forEach(e => {
          this.meshTrimsById.delete(e.id)
        })
      }),
      this.updateDerivedProperties()
  }
  updateDerivedProperties() {
    this.numberOfTrims = this.meshTrimsById.length
    this.maxTrimsPerFloor = MaxTrimsPerFloor - this.meshTrimsByMeshGroup.get("-1").length
    this.maxAllFloorsTrims = MaxTrimsPerFloor - this.getLongestTrimListLength()
    this.commit()
  }
  onMeshGroupChanged(e) {
    return createSubscription(
      () => this.onMeshGroupChangedCallbacks.add(e),
      () => this.onMeshGroupChangedCallbacks.delete(e)
    )
  }
  onMeshTrimChanged(e) {
    return createSubscription(
      () => this.onMeshTrimChangedCallbacks.add(e),
      () => this.onMeshTrimChangedCallbacks.delete(e)
    )
  }
  getTrimById(e: string) {
    return this.meshTrimsById.get(e)
  }
  getTrim(e: number, t: number) {
    return this.meshTrimsByMeshGroup.has(`${e}`) ? this.meshTrimsByMeshGroup.get(`${e}`).get(t) : null
  }
  getTrimsForMeshGroup(e: number) {
    return this.meshTrimsByMeshGroup.has(`${e}`) ? this.meshTrimsByMeshGroup.get(`${e}`).values() : []
  }
  *activeTrimsForMeshGroup(e: number) {
    if (this.meshTrimsByMeshGroup.has(`${e}`)) for (const t of this.meshTrimsByMeshGroup.get(`${e}`)) t.enabled && (yield t)
    if (this.meshTrimsByMeshGroup.has("-1")) for (const e of this.meshTrimsByMeshGroup.get("-1")) e.enabled && (yield e)
  }
  reassignIndexes(e: ObservableArray<MeshTrimObject>) {
    e.forEach((e, t) => {
      e.index = t
    })
  }
  sortList(e: ObservableArray<MeshTrimObject>) {
    e.sort((e, t) => e.index - t.index)
  }
  getLongestTrimListLength() {
    let e = 0
    return (
      this.meshTrimsByMeshGroup.keys.forEach(t => {
        if ("-1" === t) return
        const i = this.meshTrimsByMeshGroup.get(t)
        e = Math.max(i.length, e)
      }),
      e
    )
  }
}
