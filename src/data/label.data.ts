import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { LabelObject } from "../object/label.object"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { randomString } from "../utils/func.utils"
const debug = new DebugInfo("label-data")
export class LabelData extends Data {
  name: string
  has: (e: string) => boolean
  map: ObservableMap<LabelObject>
  getLabel: (e: string) => LabelObject
  constructor(e?: any) {
    super()
    this.name = "label"
    this.has = e => this.map.has(e)
    this.getLabel = e => this.map.get(e)
    this.map = createObservableMap(e || {})
  }
  getCount() {
    return this.map.length
  }
  add(e: LabelObject) {
    let t = e.sid
    this.map.has(t) &&
      debug.warn("Label already tracked:", {
        sid: t,
        label: e,
        existing: this.getLabel(t)
      })
    t = t || this.generateSid()
    e.sid = t
    e.commit()
    this.map.set(e.sid, e)
    return t
  }
  generateSid() {
    let e = ""
    for (; !e || this.map.has(e); ) e = randomString(11)
    return e
  }
  remove(e: string) {
    return !!this.map.has(e) && (this.map.delete(e), !0)
  }
  clear() {
    this.map.clear()
  }
  replace(e: Record<string, LabelObject>) {
    this.map.replace(e)
  }
  getCollection() {
    return this.map
  }
  iterate(e: (e: LabelObject, key: string) => void) {
    for (const t of this.map.keys) e(this.map.get(t), t)
  }
  isEqual(e: LabelData) {
    if (this.map.length !== e.map.length) return !1
    for (const t of this.map) {
      const n = e.map.get(t.sid)
      if (!n || !LabelData.labelsAreEqual(t, n)) return !1
    }
    return !0
  }
  static labelsAreEqual(e: LabelObject, t: LabelObject) {
    return (
      e.floorId === t.floorId &&
      e.roomId === t.roomId &&
      e.position.x === t.position.x &&
      e.position.y === t.position.y &&
      e.position.z === t.position.z &&
      e.sid === t.sid &&
      e.text === t.text &&
      e.floorId === t.floorId &&
      e.roomId === t.roomId &&
      e.visible === t.visible
    )
  }
  getLabelsForRoom(e) {
    const t: LabelObject[] = []
    this.iterate(n => {
      n.roomId === e && t.push(n)
    })
    return t
  }
}
