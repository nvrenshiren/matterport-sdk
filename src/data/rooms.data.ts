import { Data } from "../core/data"
import { RoomObject } from "../object/room.object"
import { ObservableValue } from "../observable/observable.value"
export class RoomsData extends Data {
  selected: ObservableValue<null | string>
  _rooms: Record<string, RoomObject>
  floorToRoomsMap: Map<string, RoomObject[]>
  constructor(e?: Record<string, RoomObject>) {
    super()
    this.name = "rooms"
    this.selected = new ObservableValue(null)
    this._rooms = {}
    this.floorToRoomsMap = new Map()
    if (e) for (const t of Object.values(e)) this.add(t)
  }
  add(e: RoomObject) {
    this._rooms[e.id] = e
    const t = this.floorToRoomsMap.get(e.floorId)
    t ? t.push(e) : this.floorToRoomsMap.set(e.floorId, [e])
  }
  remove(e: string) {
    const t = this.get(e)
    if (!t) return
    const n = this.floorToRoomsMap.get(t.floorId)
    if (n) {
      const e = n.indexOf(t)
      e > -1 && n.splice(e, 1)
    }
    delete this._rooms[e]
  }
  rooms() {
    const e = this._rooms
    const t = Object.keys(this._rooms)
    return (function* () {
      for (const n of t) yield e[n]
    })()
  }
  get roomCount() {
    return Object.keys(this._rooms).length
  }
  get collection() {
    return this._rooms
  }
  getAllRooms() {
    return Object.values(this.floorToRoomsMap)
  }
  get(e: string) {
    return this._rooms[e]
  }
  getByMeshSubgroup(e: number) {
    return Object.values(this._rooms).find(t => t.meshSubgroup === e)
  }
  roomsByFloor(e: string) {
    return this.floorToRoomsMap.get(e) || []
  }
  getRoomIdMap(e, t) {
    const n = {}
    for (const i of Object.values(this._rooms)) {
      const s = e.getFloor(i.floorId),
        r = s ? String((s.index << 16) + i.meshSubgroup) : "",
        a = i.id
      "" === r ? console.warn("[WARNING getRoomIdMap]: mapping between room IDs was incomplete!") : t ? (n[r] = a) : (n[a] = r)
    }
    return n
  }
}
