import * as h from "../webgl/26269"
import * as u from "../webgl/49416"
import { MeshQuerySymbol, RaycasterSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { RoomsData } from "../data/rooms.data"
import { FloorsData } from "../data/floors.data"
import { LayersData } from "../data/layers.data"
import { RoomBoundData } from "../data/room.bound.data"
import RaycasterModule from "./raycaster.module"
import { Vector3 } from "three"
import { RoomMeshCheck } from "../webgl/26269"
import { shouldDisplayLayer } from "../webgl/49416"

declare global {
  interface SymbolModule {
    [MeshQuerySymbol]: MeshQueryModule
  }
}
const a = (...e) =>
  function (t) {
    return e.every(e => e(t))
  }
export default class MeshQueryModule extends Module {
  roomBoundData: RoomBoundData | null
  raycaster: RaycasterModule
  floorData: FloorsData
  roomData: RoomsData
  layersData: LayersData

  constructor() {
    super(...arguments)
    this.name = "mesh-query"
    this.roomBoundData = null
  }

  async init(e, t) {
    const { market: i } = t
    ;[this.raycaster, this.floorData, this.roomData, this.layersData] = await Promise.all([
      t.getModuleBySymbol(RaycasterSymbol),
      i.waitForData(FloorsData),
      i.waitForData(RoomsData),
      i.waitForData(LayersData)
    ])
    i.waitForData(RoomBoundData).then(e => (this.roomBoundData = e))
  }

  nearestMeshInfoOnFloor(e, t) {
    const i = a(RoomMeshCheck.isRoomMesh, this.matchesFloorId(t))
    return this.raycaster.picking.nearest(new Vector3().set(e.x, e.y, e.z), i)
  }

  nearestMeshInfo(e) {
    return this.raycaster.picking.nearest(new Vector3().set(e.x, e.y, e.z), RoomMeshCheck.isRoomMesh)
  }

  inferMeshIdsFromPoint(e, t, i = !0) {
    const s = i && shouldDisplayLayer(this.roomBoundData, this.layersData, e.layerId),
      o = !!this.roomBoundData && this.roomBoundData.hasRooms() && s
    let r = !s || !e.roomId || !this.roomData.get(e.roomId)
    const n = !e.floorId || !this.floorData.hasFloor(e.floorId)
    if (!n && r && o && this.roomBoundData) {
      const i = this.roomBoundData.findRoomIdForPosition(t, e.floorId)
      i && ((e.roomId = i), (r = !1))
    }
    if (r || n) {
      const i = n ? RoomMeshCheck.isRoomMesh : a(RoomMeshCheck.isRoomMesh, this.matchesFloorId(e.floorId)),
        s = this.raycaster.picking.nearest(new Vector3().set(t.x, t.y, t.z), i)
      let d
      if (this.roomBoundData && this.roomBoundData.hasRooms()) {
        if (s) {
          const e = s.object.meshGroup
          if (void 0 !== e) {
            const i = this.floorData.getFloorByMeshGroup(e)
            i && (d = { floorId: i.id, roomId: (o && this.roomBoundData.findRoomIdForPosition(t, i.id)) || void 0 })
          }
        }
      } else d = s && this.roomIdFloorIdFromObject(s.object)
      if (d) {
        const { roomId, floorId } = d
        this.log.debug(
          "data-fixup:",
          r ? { roomId, prev: e.roomId } : "",
          n
            ? {
                floorId: i,
                prev: e.floorId
              }
            : "",
          { data: e }
        )
        r && (e.roomId = roomId)
        n && (e.floorId = floorId)
      } else
        this.log.warn("Nearest Room/Floor not found for:", {
          point: t,
          data: e,
          invalidRoomId: r,
          invalidFloorId: n
        })
    }
    return e
  }

  roomIdFloorIdFromObject(e) {
    if (!RoomMeshCheck.hasMeshGroup(e)) return
    const t = this.floorData.getFloorByMeshGroup(e.meshGroup)
    if (void 0 === t) return
    const i = (
      shouldDisplayLayer(this.roomBoundData, this.layersData, null) && RoomMeshCheck.hasMeshSubgroup(e)
        ? this.roomData.getByMeshSubgroup(e.meshSubgroup)
        : void 0
    ) as {
      id: string
    }
    return { floorId: t.id, roomId: null == i ? void 0 : i.id }
  }

  floorIdFromObject(e) {
    if (RoomMeshCheck.hasMeshGroup(e)) {
      const t = this.floorData.getFloorByMeshGroup(e.meshGroup)
      return null == t ? void 0 : t.id
    }
  }

  mdsRoomIdFromObject(e) {
    if (!shouldDisplayLayer(this.roomBoundData, this.layersData, null) || !RoomMeshCheck.hasMeshSubgroup(e) || !RoomMeshCheck.hasMeshGroup(e)) return
    const t = this.roomData.getByMeshSubgroup(e.meshSubgroup) as { floorId: string; id: string }
    if (!t) return
    const i = this.floorData.getFloorByMeshGroup(e.meshGroup)
    return t.floorId === (null == i ? void 0 : i.id) ? t.id : void 0
  }

  mdsFloorIdFromObject(e) {
    if (!RoomMeshCheck.hasMeshGroup(e)) return
    const t = this.floorData.getFloorByMeshGroup(e.meshGroup)
    return t ? t.id : void 0
  }

  matchesFloorId(e) {
    return t => {
      const i = this.roomIdFloorIdFromObject(t)
      return (null == i ? void 0 : i.floorId) === e
    }
  }
}
