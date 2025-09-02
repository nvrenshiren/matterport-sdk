import { Box3, Plane, Vector3 } from "three"
import { DiffState } from "../other/71954"
import * as c from "../8699"
import { SaveCommand } from "../command/save.command"
import { AggregationType } from "../const/2541"
import { DataType } from "../const/79728"
import { FloorSymbol, StorageSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { FloorsData } from "../data/floors.data"
import { LayersData } from "../data/layers.data"
import { InvalidFloorExceptionError } from "../error/invalidFloorException.error"
import { ChangeObserver } from "../observable/observable"
import { ObservableObject } from "../observable/observable.object"
import { ObservableValue } from "../observable/observable.value"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import { deepCopy } from "../utils/object.utils"
import { DirectionVector } from "../webgl/vector.const"
import GetFloors from "../test/GetFloors"
declare global {
  interface SymbolModule {
    [FloorSymbol]: FloorsModule
  }
}
class HeightsOrderList {
  list: number[]
  constructor() {
    this.list = []
  }
  insort(e) {
    const t = this.binarySearch(e)
    let i = t.index
    if (!t.success) for (; this.compare(e, this.list[i]) >= 0 && i < this.list.length; ) i++
    for (let e = this.list.length; e > i; e--) this.list[e] = this.list[e - 1]
    this.list[i] = e
  }
  removeIndex(e: number) {
    if (e > this.list.length) throw Error("OrderList.removeIndex() -> Invalid index: " + e)
    this.list.splice(e, 1)
  }
  getElement(e: number) {
    if (e >= 0 && e < this.list.length) return this.list[e]
    throw new Error("OrderList.getElement() -> Invalid index: " + e)
  }
  get length() {
    return this.list.length
  }
  find(e) {
    const t = this.binarySearch(e)
    return t.success ? t.index : -1
  }
  compare(e, t: number) {
    return void 0 === t ? 1 : "number" == typeof e ? (e === t ? 0 : e < t ? -1 : 1) : e.compare(t)
  }
  binarySearch(e) {
    let t,
      i = 0,
      s = this.list.length - 1,
      o = -1,
      r = 0
    for (; i <= s; ) {
      if (((o = Math.floor((i + s) / 2)), (t = this.list[o]), (r = this.compare(e, t)), 0 === r)) return { success: !0, index: o }
      r < 0 ? (s = o - 1) : (i = o + 1)
    }
    return { success: !1, index: o }
  }
}
export class FloorsObject extends ObservableObject {
  name: string
  center: Vector3
  centerOfMass: Vector3
  _boundingBox: ObservableValue<Box3>
  size: Vector3
  sweepHeights: HeightsOrderList
  sweepFloorHeights: HeightsOrderList
  _groundPlane: Plane
  _groundPt: Vector3
  medianSweepHeight: () => number
  minSweepFloorHeight: () => number
  id: string
  meshGroup: number
  index: number
  constructor(e = {}) {
    super()
    this.name = ""
    this.center = new Vector3()
    this.centerOfMass = new Vector3()
    this._boundingBox = new ObservableValue(new Box3())
    this.size = new Vector3()
    this.sweepHeights = new HeightsOrderList()
    this.sweepFloorHeights = new HeightsOrderList()
    this._groundPlane = new Plane()
    this._groundPt = new Vector3()
    this.medianSweepHeight = () => (this.sweepHeights.length > 0 ? this.sweepHeights.getElement(Math.floor(this.sweepHeights.length / 2)) : this.center.y)
    this.minSweepFloorHeight = () => (this.sweepFloorHeights.length > 0 ? this.sweepFloorHeights.getElement(0) : this.boundingBox.min.y)
    Object.assign(this, e)
  }
  get boundingBox() {
    return this._boundingBox.value
  }
  set boundingBox(e) {
    this.setBounds(e)
  }
  setBounds(e: Box3) {
    this._boundingBox.value.copy(e)
    this._boundingBox.value.getSize(this.size)
    this._boundingBox.value.getCenter(this.center)
    this._boundingBox.setDirty(!0)
  }
  setCenterOfMass(e: Vector3) {
    this.centerOfMass.copy(e)
  }
  onBoundsChanged(e: ChangeObserver<Box3>) {
    return this._boundingBox.onChanged(e)
  }
  addSweep(e, t) {
    this.sweepHeights.insort(e.y)
    this.sweepFloorHeights.insort(t.y)
  }
  medianSweepFloorHeight() {
    return this.sweepFloorHeights.length > 0 ? this.sweepFloorHeights.getElement(Math.floor(this.sweepFloorHeights.length / 2)) : this.bottom
  }
  get bottom() {
    return this.minSweepFloorHeight()
  }
  get groundPlane() {
    this._groundPt.set(0, this.bottom, 0)
    this._groundPlane.setFromNormalAndCoplanarPoint(DirectionVector.UP, this._groundPt)
    return this._groundPlane
  }
  get top() {
    return this.sweepFloorHeights.length > 0 ? this.sweepFloorHeights.getElement(this.sweepFloorHeights.length - 1) : this.boundingBox.max.y
  }
  deepCopy() {
    return deepCopy({
      id: this.id,
      meshGroup: this.meshGroup,
      index: this.index,
      name: this.name,
      center: this.center,
      boundingBox: this.boundingBox,
      size: this.size,
      medianSweepHeight: this.medianSweepHeight(),
      bottom: this.bottom
    })
  }
}
const MdsFloorDeserializer = new DebugInfo("mds-floor-deserializer")
class D {
  deserialize(e) {
    if (!e || !this.validate(e)) return MdsFloorDeserializer.debug("Deserialized invalid floor data from MDS", e), null
    const t = e.label || ""
    const i = e.dimensions || { areaFloor: -1 }
    const { areaFloor } = i
    return new FloorsObject({ id: e.id, index: e.sequence, meshGroup: e.meshId, name: t, areaFloor: areaFloor || -1 })
  }
  validate(e) {
    return ["id", "sequence", "meshId"].every(t => t in e)
  }
}
class S {
  serialize(e) {
    return { label: e.name }
  }
}
class T extends MdsStore {
  deserializer: D
  constructor() {
    super(...arguments), (this.deserializer = new D()), (this.prefetchKey = "data.model.floors")
  }
  async read(e = {}) {
    const t = { modelId: this.getViewId() }
    // pw
    //楼层数据
    // return this.query(c.GetFloors, t, e).then(e => {
    //   const s = e.data?.model?.floors

    //   if (!s || !Array.isArray(s)) return null
    //   return s.reduce((e, t) => {
    //     const i = this.deserializer.deserialize(t)
    //     return i && (e[t.id] = i), e
    //   }, {})
    // })

    const s = GetFloors
    if (!s || !Array.isArray(s)) return null
    return s.reduce((e, t) => {
      const i = this.deserializer.deserialize(t)
      return i && (e[t.id] = i), e
    }, {})
  }
  async update(e, t) {
    const i = this.getViewId(),
      s = new S().serialize(t)
    if (!s) throw new Error("Could not update Floor")
    // return this.mutate(c.PatchFloor, { modelId: i, floorId: e, data: s })
    return !0
  }
}
export default class FloorsModule extends Module {
  engine: any
  store: T
  data: FloorsData
  monitor: a
  constructor() {
    super(...arguments), (this.name = "floors")
  }
  async init(e, t) {
    const { readonly: i, baseUrl: s, baseModelId: n } = e
    this.engine = t
    const { mdsContext: c } = await t.market.waitForData(LayersData)
    this.store = new T({ context: c, readonly: i, baseUrl: s, viewId: n })
    const [u] = await Promise.all([this.store.read()])

    if (((this.data = new FloorsData(u || {})), t.market.register(this, FloorsData, this.data), !1 === i)) {
      const e = this.data.getCollection()
      ;(this.monitor = new SweepsMonitor(e, { aggregationType: AggregationType.NextFrame, shallow: !0 }, t)),
        this.monitor.onChanged(() => this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.FLOORS] })))
      const [i] = await Promise.all([t.getModuleBySymbol(StorageSymbol)])
      this.bindings.push(i.onSave(() => this.save(), { dataType: DataType.FLOORS }))
    }
  }
  onUpdate() {}
  async save() {
    const e = this.monitor.getDiffRecord()
    this.monitor.clearDiffRecord()
    const t = []
    for (const i of e) {
      const e = i.index
      if (!e) throw new InvalidFloorExceptionError(`Invalid floor '${i.index}'`)
      i.action === DiffState.updated && t.push(this.store.update(e, i.diff))
    }
    return Promise.all(t)
  }
}
