import * as h from "../86400"
import { RoomsSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { RoomsData } from "../data/rooms.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { RoomVisitedMessage } from "../message/room.message"
import { RoomObject } from "../object/room.object"
import GetRooms from "../test/GetRooms"
declare global {
  interface SymbolModule {
    [RoomsSymbol]: RoomDataModule
  }
}
const MdsFloorDeserializer = new DebugInfo("mds-floor-deserializer")
class m {
  deserialize(e) {
    var s, o
    if (!e || !this.validate(e)) return MdsFloorDeserializer.debug("Deserialized invalid room data from MDS", e), null
    const r = e => (null !== e ? e : void 0),
      n = e.dimensions || { height: null, width: null, depth: null, areaFloor: null },
      { height, width, depth, areaFloor } = n
    return new RoomObject({
      id: e.id,
      meshSubgroup: e.meshId || -1,
      floorId: e?.floor?.id ? e.floor.id : "",
      height: r(height),
      width: r(width),
      depth: r(depth),
      areaFloor: r(areaFloor),
      tags: null !== (o = null === (s = e.tags) || void 0 === s ? void 0 : s.filter(e => e)) && void 0 !== o ? o : void 0
    })
  }
  validate(e) {
    const t = ["id", "meshId"].every(t => t in e),
      i = e.floor && e.floor.id && "number" == typeof e.floor.meshId
    return t && !!i
  }
}
class p extends MdsStore {
  constructor(e?) {
    super(...arguments)
    this.prefetchKey = "data.model.rooms"
  }
  async read(e?) {
    const t = new m(),
      i = { modelId: this.getViewId() }
    //pw
    //房间数据
    // return this.query(h.GetRooms, i, e).then(e => {
    //   const o = e?.data?.model?.rooms
    //   if (!o || !Array.isArray(o)) return null
    //   return o.reduce((e, i) => {
    //     const s = t.deserialize(i)
    //     s && (e[s.id] = s)
    //     return e
    //   }, {})
    // })

    const o = GetRooms
    if (!o || !Array.isArray(o)) return null
    return o.reduce((e, i) => {
      const s = t.deserialize(i)
      s && (e[s.id] = s)
      return e
    }, {})
  }
}
export default class RoomDataModule extends Module {
  store: p
  data: RoomsData
  visitedRooms: any
  constructor() {
    super(...arguments)
    this.name = "room-data"
    this.visitedRooms = {}
  }
  async init(e, t) {
    const { baseModelId, baseUrl } = e,
      h = await t.market.waitForData(LayersData)
    this.store = new p({ context: h.mdsContext, baseUrl, readonly: !0, viewId: baseModelId })
    const l = await this.store.read()
    this.data = new RoomsData(l || {})
    t.market.register(this, RoomsData, this.data)
    const d = await t.market.waitForData(ViewmodeData),
      c = this.data.roomCount,
      u = e => {
        const i = d.closestMode
        this.visitedRooms[e.id] || (this.visitedRooms[e.id] = { visitCount: 0 }), this.visitedRooms[e.id].visitCount++
        const s = this.visitedRooms[e.id].visitCount
        t.broadcast(new RoomVisitedMessage(e.id, e.meshSubgroup, i, s, c, ""))
      },
      m = await t.market.waitForData(SweepsData),
      y = m.makeSweepChangeSubscription(e => {
        if (e) {
          const t = m.getSweep(e)
          ;(this.data.selected.value = t.roomId), this.data.commit()
        }
      }),
      f = this.data.selected.onChanged(e => {
        if (null !== e) {
          const t = this.data.get(e)
          t && u(t)
        }
      })
    this.bindings.push(y, f)
  }
}
