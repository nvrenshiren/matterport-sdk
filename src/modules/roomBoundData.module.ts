import { gql } from "@apollo/client"
import { CheckForProxyLayerCommand, ConvertModelToLayeredCommand } from "../command/layers.command"
import { NavigateToRoomCommand } from "../command/navigation.command"
import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { SaveCommand } from "../command/save.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand } from "../command/searchQuery.command"
import { FeaturesRoomboundsFloorplanNudgekEY } from "../const/62496"
import * as G from "../const/78283"
import { setStemHeight } from "../const/78283"
import { DataType } from "../const/79728"
import { defaultLayerId } from "../const/mds.const"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, RoomBoundDataSymbol } from "../const/symbol.const"
import { edgeType, legacyRoomsType, searchModeType, unitsType } from "../const/typeString.const"
import { UserPreferencesKeys } from "../const/user.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { AppData, AppMode } from "../data/app.data"
import { FloorsData } from "../data/floors.data"
import { LayersData } from "../data/layers.data"
import { BtnText } from "../data/player.options.data"
import { RoomBoundData } from "../data/room.bound.data"
import { RoomBoundViewData } from "../data/room.bound.view.data"
import { RoomsData } from "../data/rooms.data"
import { SettingsData } from "../data/settings.data"
import { ErrorTextDisplayedMessage, RoomBoundErrorMessage } from "../message/room.message"
import { RoomObject } from "../object/room.object"
import * as C from "../other/15004"
import * as $ from "../other/3907"
import { RoomBoundUserViewErrorKey, ShowcaseRoomBoundsKey } from "../other/47309"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import * as R from "../other/84784"
import { BaseParser } from "../parser/baseParser"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import GetRoomBounds from "../test/GetRoomBounds"
import { DayTag } from "../utils/date.utils"
import { UnitTypeKey } from "../utils/unit.utils"
import { shouldDisplayLayer } from "../webgl/49416"
import { WallType } from "../webgl/room.wall"
declare global {
  interface SymbolModule {
    [RoomBoundDataSymbol]: RoomBoundDataModule
  }
}
class O extends BaseParser {
  constructor(t, e, i, s, n, o, a) {
    super(t, e, s),
      (this.room = n),
      (this.title = o),
      (this.id = this.room.id),
      (this.icon = `icon-${(0, C.mX)(this.room.roomTypeIds)}`),
      (this.typeId = searchModeType.MODELROOM),
      (this.layerId = defaultLayerId),
      (this.dateBucket = DayTag.OLDER),
      (this.enabled = !0),
      (this.onSelect = async () => {
        super.onSelect(), await this.commandBinder.issueCommand(new NavigateToRoomCommand(this.room))
      }),
      (this.floorId = a),
      (this.roomId = n.id)
    const r = i.tryGetProperty(UserPreferencesKeys.UnitType, UnitTypeKey.IMPERIAL)
    this.description = this.room.getMeasurementText(r)
  }
}
const _ = new DebugInfo("MdsRoomBoundsDeserializer")
class H {
  deserialize(t) {
    var e, i, s, n, o, a, r, h
    const d = { version: 0, floors: {} }
    for (const e of t.floors || []) {
      const t = { edges: {}, vertices: {}, rooms: {} }
      d.floors[e.id] = t
      for (const i of e.vertices || []) i ? (t.vertices[i.id] = { x: i.position.x, y: i.position.y }) : _.warn("Found null vertex in floor vertices!")
      for (const i of e.edges || []) {
        if (!i || null === i.thickness || null === i.centerLineBias) {
          _.warn("Invalid edge!")
          continue
        }
        for (const e of i.vertices || []) (null == e ? void 0 : e.position) && (t.vertices[e.id] = { x: e.position.x, y: e.position.y })
        const e = {
          vertices: (i.vertices || []).map(t => (null == t ? void 0 : t.id)),
          thickness: i.thickness,
          bias: i.centerLineBias,
          openings: {},
          type: i.type || void 0
        }
        t.edges[i.id] = e
        for (const t of i.openings || []) {
          if (!t) {
            _.warn("Found null opening!")
            continue
          }
          const i = { height: t.height, lowerElevation: t.lowerElevation, relativePos: t.relativeCenter, type: t.type, width: t.width }
          e.openings[t.id] = i
        }
      }
    }
    for (const l of t.rooms || []) {
      if (!l || !l.floor) {
        _.warn("Found null room")
        continue
      }
      if (!d.floors[l.floor.id]) {
        _.warn("Unable to find floor for room!")
        continue
      }
      const t = l.classifications || [].sort((t, e) => (t.confidence || 0) - (e.confidence || 0)),
        c = null === (e = l.dimensionEstimates) || void 0 === e ? void 0 : e.units,
        u = (l.label || "").trim()
      d.floors[l.floor.id].rooms[l.id] = {
        edges: (null === (s = null === (i = l.boundary) || void 0 === i ? void 0 : i.edges) || void 0 === s ? void 0 : s.map(t => t.id)) || [],
        holes:
          (null === (n = l.holes) || void 0 === n
            ? void 0
            : n.map(t => {
                var e
                return (null === (e = t.edges) || void 0 === e ? void 0 : e.map(t => t.id)) || []
              })) || [],
        classifications: t,
        label: u,
        width: this.ensureMetric("distance", null === (o = l.dimensionEstimates) || void 0 === o ? void 0 : o.width, c),
        length: this.ensureMetric("distance", null === (a = l.dimensionEstimates) || void 0 === a ? void 0 : a.depth, c),
        area: this.ensureMetric("area", null === (r = l.dimensionEstimates) || void 0 === r ? void 0 : r.area, c),
        height: this.ensureMetric("distance", null === (h = l.dimensionEstimates) || void 0 === h ? void 0 : h.height, c) || NaN,
        keywords: l.keywords || []
      }
    }
    return d
  }
  ensureMetric(t, e, i) {
    if (null != e && null != i) {
      const s = i === unitsType.IMPERIAL,
        n = "area" === t ? G.W3 : setStemHeight
      return s ? n(e) : e
    }
    return NaN
  }
}
class z extends MdsStore {
  constructor(t, e = !1, i = () => {}) {
    super(t),
      (this.writeRepairs = e),
      (this.broadcast = i),
      (this.queuedMutations = []),
      (this.seenRooms = new Map()),
      (this.lastUpdates = new Map()),
      (this.deserializer = new H())
  }
  async read(t) {
    const s = { modelId: this.getViewId() }
    //pw
    // const n = await this.query(B.GetRoomBounds, s, t)
    // return n.data?.model?.floors ? this.validateData(this.deserializer.deserialize(n.data.model)) : null
    return GetRoomBounds.floors ? this.validateData(this.deserializer.deserialize(GetRoomBounds)) : null
  }
  async readClassifications({ options: t, localizeFn: e } = {}) {
    // var i
    // const s = { modelId: this.getViewId() },
    //   n = Object.assign(Object.assign({}, t), { prefetchKey: "data.roomClassifications" })
    // return ((null === (i = (await this.query(B.GetRoomClassifications, s, n)).data) || void 0 === i ? void 0 : i.roomClassifications) || []).reduce(
    //   (t, i) => (i && (t[i.id] = e ? e(i) : i), t),
    //   {}
    // )
    //pw
    return {}
  }
  get readonly() {
    return this.config.readonly
  }
  set readonly(t) {
    this.config.readonly = t
  }
  queueRemoveEntity(t, e) {
    this.queueDeleteRoomsAndBoundaryData(t, e)
  }
  queueAddNode(t) {
    this.queuedMutations.push(`addBoundaryVertex(modelId: $modelId, id: "${t.id}", vertex: ${this.vertexDetailsFromNode(t)}) { id }`)
  }
  queueUpdateNode(t) {
    this.updateEntity("node", t.id, `patchBoundaryVertex(modelId: $modelId, id: "${t.id}", vertex: ${this.vertexDetailsFromNode(t)}) { id }`)
  }
  vertexDetailsFromNode(t) {
    return `{\n      floorId: "${t.floorId}",\n      position: { x: ${t.x} y: ${-t.z} }\n    }`
  }
  queueRemoveNode(t) {
    this.queueRemoveEntity("node", t.id)
  }
  queueAddWall(t) {
    this.queuedMutations.push(`addBoundaryEdge(modelId: $modelId, id: "${t.id}", edge: ${this.edgeDetailsFromWall(t)}) { id }`)
  }
  queueUpdateWall(t) {
    this.updateEntity("wall", t.id, `patchBoundaryEdge(modelId: $modelId, id: "${t.id}" edge: ${this.edgeDetailsFromWall(t)}) { id }`)
  }
  edgeDetailsFromWall(t) {
    return `\n    {\n      floorId: "${t.floorId}"\n      vertices: ["${t.from.id}", "${t.to.id}"]\n      thickness: ${t.width}\n      units: ${unitsType.METRIC}\n      centerLineBias: ${1 - t.bias}\n      type: ${t.type === WallType.SOLID ? edgeType.WALL : edgeType.INVISIBLE}\n    }\n    `
  }
  queueRemoveWall(t) {
    this.queueRemoveEntity("wall", t.id)
  }
  queueAddOpening(t) {
    this.queuedMutations.push(`addEdgeOpenings(modelId: $modelId, id: "${t.wallId}", openings: [${this.openingDetailsFromOpening(t)}]) { id }`)
  }
  queueUpdateOpening(t) {
    this.updateEntity("opening", t.id, `patchEdgeOpening(modelId: $modelId, id: "${t.wallId}", opening: ${this.openingDetailsFromOpening(t)}) { id }`)
  }
  openingDetailsFromOpening(t) {
    return `\n    {\n      id: "${t.id}"\n      relativeCenter: ${t.relativePos}\n      type: ${t.type}\n      width: ${t.width}\n      height: 0.1,\n      lowerElevation: 0.1\n    }\n    `
  }
  queueRemoveOpening(t) {
    this.queuedMutations.push(`removeEdgeOpenings(\n        modelId: $modelId\n        id: "${t.wallId}"\n        openings: ["${t.id}"]\n      )`),
      this.clearEntityUpdate("opening", t.id)
  }
  queueAddRoom(t) {
    this.queuedMutations.push(`addRoom(\n        modelId: $modelId,\n        id: "${t.id}",\n        room: ${this.getRoomDetailsFromRoom(t)}\n      ) { id }`)
  }
  queueUpdateRoom(t) {
    const e = this.seenRooms.get(t.id)
    e && e !== t && this.clearEntityUpdate("room", t.id),
      this.seenRooms.set(t.id, t),
      this.updateEntity(
        "room",
        t.id,
        `patchRoom(\n        modelId: $modelId,\n        id: "${t.id}",\n        room: ${this.getRoomDetailsFromRoom(t)}\n      ) { id }`
      )
  }
  getRoomDetailsFromRoom(t) {
    const e = !t.showDimensions,
      i = !t.showHeight
    return `\n    {\n      floorId: "${t.floorId}"\n      label: "${this.escapeUserString(t.name)}"\n      classifications: [${t.roomTypeIds.map(t => `"${t}"`)}],\n      boundary: {\n        edges: [${Array.from(t.walls.values()).map(t => `"${t.id}"`)}],\n      }\n      holes: [${Array.from(t.holes.values()).map(t => `{ edges: [${Array.from(t.values()).map(t => `"${t.id}"`)}] }`)}]\n      dimensionEstimates: {\n        room: "${t.id}",\n        area: ${Number.isNaN(t.area) ? 0 : t.area},\n        areaIndoor: ${Number.isNaN(t.area) ? null : t.area},\n        depth: ${Number.isNaN(t.length) || e ? 0 : t.length}\n        width: ${Number.isNaN(t.width) || e ? 0 : t.width}\n        height: ${Number.isNaN(t.height) || i ? 0 : t.height}\n        units: ${unitsType.METRIC}\n      }\n      keywords: [${t.allKeywords().map(t => `"${t}"`)}]\n    }\n    `
  }
  queueRemoveRoom(t) {
    this.seenRooms.delete(t.id), this.queueRemoveEntity("room", t.id)
  }
  queueRemoveLegacyRooms(t) {
    const e = t.map(t => `"${t}"`)
    this.queuedMutations.push(
      `deleteRoomsAndBoundaryData(\n      modelId: $modelId,\n      selectedData: {\n        ids: [${e.join(",")}],\n        type: ${legacyRoomsType.ROOM}\n      }\n    )`
    )
  }
  queueUpdateRoomAssociations(t) {
    if (0 === t.length) return
    this.queuedMutations.push(
      `bulkPatchRoomData(\n        modelId: $modelId,\n        updatedRoomAssociations: [${t.map(t =>
        (t =>
          `{ ${Object.keys(t)
            .map(e => `${e}: ${JSON.stringify(t[e])}`)
            .join(",")} }`)(t)
      )}]\n      )`
    )
  }
  peekQueuedMutations() {
    return this.queuedMutations.slice()
  }
  async submitQueuedMutations() {
    if (0 === this.queuedMutations.length) return
    const t = this.queuedMutations.slice()
    this.queuedMutations.length = 0
    for (const t of this.lastUpdates.values()) t.clear()
    const e = Math.ceil(t.length / 100)
    for (let i = 0; i < e; i++) {
      const e = 100 * i,
        s = Math.min(e + 100, t.length),
        n = t.slice(e, s),
        o = gql`
        mutation updateRoomBoundaries($modelId: ID!) {
          ${n.map((t, e) => `op${e}: ${t}`).join("\n")}
        }
      `
      await this.mutate(o, { modelId: this.getViewId() })
    }
  }
  updateEntity(t, e, i) {
    const s = this.lastUpdates.get(t) || new Map()
    this.lastUpdates.set(t, s)
    const n = s.get(e)
    void 0 !== n ? (this.queuedMutations[n] = i) : (this.queuedMutations.push(i), s.set(e, this.queuedMutations.length - 1))
  }
  clearEntityUpdate(t, e) {
    const i = this.lastUpdates.get(t)
    i && i.delete(e)
  }
  queueDeleteRoomsAndBoundaryData(t, e) {
    let i = legacyRoomsType.BOUNDARYVERTEX
    switch (t) {
      case "room":
        i = legacyRoomsType.ROOM
        break
      case "wall":
        i = legacyRoomsType.BOUNDARYEDGE
    }
    this.queuedMutations.push(
      `deleteRoomsAndBoundaryData(\n        modelId: $modelId,\n        selectedData: {\n          ids: ["${e}"],\n          type: ${i},\n        }\n      )`
    ),
      this.clearEntityUpdate(t, e)
  }
  escapeUserString(t) {
    return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  }
  validateData(t) {
    var e, i, s
    const n = this.config.readonly || !this.writeRepairs
    Object.values(t.floors).forEach(t => {
      const e = {}
      Object.values(t.edges).forEach(t => {
        t.vertices &&
          t.vertices.forEach(t => {
            e[t] = !0
          })
      })
      const i = {}
      Object.entries(t.vertices).forEach(([t, s]) => {
        e[t]
          ? (i[t] = s)
          : n
            ? this.broadcast(new ErrorTextDisplayedMessage(`validateData: Would delete orphan node: ${t}`))
            : (this.broadcast(new ErrorTextDisplayedMessage(`validateData: Deleting orphan node: ${t}`)), this.queueRemoveEntity("node", t))
      }),
        (t.vertices = i)
    }),
      Object.values(t.floors).forEach(t => {
        Object.entries(t.edges).forEach(([e, i]) => {
          var s
          ;(2 === (null === (s = i.vertices) || void 0 === s ? void 0 : s.length) && t.vertices[i.vertices[0]] && t.vertices[i.vertices[1]]) ||
            (delete t.edges[e],
            n
              ? this.broadcast(new ErrorTextDisplayedMessage(`validateData: Would delete invalid wall: ${e}`))
              : (this.broadcast(new ErrorTextDisplayedMessage(`validateData: Deleting invalid wall: ${e}`)), this.queueRemoveEntity("wall", e)))
        })
      })
    for (const o of Object.values(t.floors))
      for (const t of Object.keys(o.rooms)) {
        const a = o.rooms[t]
        let r = !1
        const h = (null !== (e = a.edges) && void 0 !== e ? e : []).concat(
          null !== (s = null === (i = a.holes) || void 0 === i ? void 0 : i.flat()) && void 0 !== s ? s : []
        )
        for (const t of h) {
          o.edges[t] || (r = !0)
        }
        r &&
          (n
            ? this.broadcast(new ErrorTextDisplayedMessage(`validateData: Would delete invalid room: ${t}`))
            : (this.broadcast(new ErrorTextDisplayedMessage(`validateData: Deleting invalid room: ${t}`)), this.queueRemoveEntity("room", t)),
          delete o.rooms[t])
      }
    return (
      Object.values(t.floors).forEach(t => {
        const e = e => {
            n
              ? this.broadcast(new ErrorTextDisplayedMessage(`validateData: Would delete existing wall: ${e}`))
              : (this.broadcast(new ErrorTextDisplayedMessage(`validateData: Deleting existing wall: ${e}`)), this.queueRemoveEntity("wall", e)),
              delete t.edges[e]
          },
          i = new Set()
        Object.values(t.rooms).forEach(t => {
          for (const e of t.edges || []) i.add(e)
        })
        const s = new Map()
        Array.from(Object.entries(t.edges)).forEach(([t, n]) => {
          if (!n.vertices) return
          const o = n.vertices.slice().sort().join(":")
          if (s.has(o))
            if (i.has(t)) {
              const n = s.get(o)
              n && !i.has(n) && (e(n), s.set(o, t))
            } else e(t)
          else s.set(o, t)
        })
      }),
      n || this.submitQueuedMutations(),
      t
    )
  }
}
class q extends $.MU {
  constructor(t, e, i) {
    const s = new Y(),
      n = new Z()
    super({
      queue: t,
      path: `${e}/api/v1/jsonstore/model/room-bound-debug/${i}`,
      batchUpdate: !1,
      deserialize: t => s.deserialize(t),
      serialize: t => n.serialize(t)
    })
  }
}
class Y {
  deserialize(t) {
    if (!this.isValid(t)) return null
    return { mutations: t.mutations.slice(), error: t.error, localData: t.localData, actionList: t.actionList }
  }
  isValid(t) {
    return !(!t || "object" != typeof t) && t.mutations && "object" == typeof t.mutations
  }
}
class Z {
  serialize(t, ...e) {
    return t
  }
}
export default class RoomBoundDataModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "room_bound_data"),
      (this.associationSources = []),
      (this.modifiedFloors = new Set()),
      (this.layersChecked = !1),
      (this.afterFinalize = async () => {
        if (!this.writeBindings) throw new Error("Not permitted to write room bounds data")
        if (this.appData.error) return
        const t = this.data.getSnapshot(),
          e = this.store.peekQueuedMutations()
        try {
          this.store.queueUpdateRoomAssociations(this.updateRoomAssociations()), await this.store.submitQueuedMutations(), this.data.getAndClearActionList()
        } catch (i) {
          throw (
            (this.log.info("Error finalizing room bounds data", i),
            this.data.clearUndoBuffer(),
            (this.appData.error = i),
            this.appData.commit(),
            this.debugStore.update({
              error: `${new Date().toUTCString()} ${i.message}`,
              mutations: e,
              localData: t,
              actionList: this.data.getAndClearActionList()
            }),
            i)
          )
        }
      }),
      (this.addRoom = t => {
        this.roomData.get(t.id) || this.roomData.add(new RoomObject({ id: t.id, floorId: t.floorId, meshSubgroup: -1 })),
          this.addToModifiedFloors(t),
          this.data.legacyRoomIds.length &&
            (this.store.queueRemoveLegacyRooms(this.data.legacyRoomIds),
            this.data.legacyRoomIds.forEach(t => this.roomData.remove(t)),
            (this.data.legacyRoomIds.length = 0)),
          this.store.queueAddRoom(t)
      }),
      (this.removeRoom = t => {
        this.roomData.get(t.id) && this.roomData.remove(t.id), this.addToModifiedFloors(t), this.store.queueRemoveRoom(t)
      })
  }
  async init(t, e: EngineContext) {
    const [i, s, c, u] = await Promise.all([
      e.market.waitForData(LayersData),
      e.market.waitForData(RoomsData),
      e.market.waitForData(AppData),
      e.market.waitForData(SettingsData)
    ])
    ;(this.roomData = s), (this.layersData = i), (this.appData = c), (this.issueCommand = e.commandBinder.issueCommand)
    const y = i.getBaseModelView()
    if (!y)
      return (
        e.market.register(this, RoomBoundData, new RoomBoundData(null)),
        u.setProperty(RoomBoundUserViewErrorKey, !0),
        void e.broadcast(new RoomBoundErrorMessage(new Error("Unable to find view for RoomBoundData")))
      )
    ;(this.localeModule = await e.getModuleBySymbol(LocaleSymbol)),
      (this.store = new z(
        { viewId: y.id, context: i.mdsContext, readonly: !0, baseUrl: t.baseUrl },
        1 === u.getOverrideParam("rbeRepair", 0),
        e.broadcast.bind(e)
      )),
      (this.debugStore = new q(t.requestQueue, t.baseUrl, y.id))
    const S = await this.store.read(),
      I = {}
    //pw
    // I = await this.store.readClassifications({ localizeFn: t => this.localizeRoomClassification(t) })
    // F.Ds.forEach(t => {
    //   const e = t.join(F.Rt)
    //   I[e] = {
    //     id: e,
    //     label: t
    //       .map(t => {
    //         var e
    //         return (null === (e = I[t]) || void 0 === e ? void 0 : e.label) || []
    //       })
    //       .join(F.X9),
    //     defaultKeywords: (0, f.Hc)(t.map(t => I[t]))
    //   }
    // }),
    this.data = new RoomBoundData(S, I, e.broadcast.bind(e))
    this.data.commit()
    const M = u.tryGetProperty(BtnText.RoomBounds, !1)
    ;(this.roomBoundViewData = new RoomBoundViewData(this.data, c, M)),
      this.data.rooms.size > 0 && u.setProperty(FeaturesRoomboundsFloorplanNudgekEY, !0),
      this.data.clearUndoBuffer(),
      this.data.resetHistory(),
      t.readonly ||
        ((this.writeBindings = new AggregateSubscription(
          this.data.onWallsChanged({
            onAdded: t => {
              this.addToModifiedFloors(t), this.store.queueAddWall(t)
            },
            onUpdated: t => {
              this.addToModifiedFloors(t), this.store.queueUpdateWall(t)
            },
            onRemoved: t => {
              this.addToModifiedFloors(t), this.store.queueRemoveWall(t)
            }
          }),
          this.data.onNodesChanged({
            onAdded: t => {
              this.addToModifiedFloors(t), this.store.queueAddNode(t)
            },
            onUpdated: t => {
              this.addToModifiedFloors(t), this.store.queueUpdateNode(t)
            },
            onRemoved: t => {
              this.addToModifiedFloors(t), this.store.queueRemoveNode(t)
            }
          }),
          this.data.onRoomsChanged({
            onAdded: this.addRoom,
            onUpdated: t => {
              this.addToModifiedFloors(t), this.store.queueUpdateRoom(t)
            },
            onChildUpdated: t => {
              this.addToModifiedFloors(t), this.store.queueUpdateRoom(t)
            },
            onRemoved: this.removeRoom
          }),
          this.data.onOpeningsChanged({
            onAdded: t => {
              this.addToModifiedFloors(t), this.store.queueAddOpening(t)
            },
            onUpdated: t => {
              this.addToModifiedFloors(t), this.store.queueUpdateOpening(t)
            },
            onRemoved: t => {
              this.addToModifiedFloors(t), this.store.queueRemoveOpening(t)
            }
          }),
          this.data.afterFinalize(async () => {
            await e.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.ROOM_BOUNDS], onCallback: this.afterFinalize, skipDirtyUpdate: !0 }))
          })
        )),
        this.writeBindings.cancel()),
      this.bindings.push(e.commandBinder.addBinding(RegisterRoomAssociationSourceCommand, t => this.registerRoomAssociationSource(t.roomAssociation))),
      (async function (t, e) {
        const [i, s, o, r, c, u] = await Promise.all([
          t.market.waitForData(AppData),
          t.market.waitForData(LayersData),
          t.market.waitForData(SettingsData),
          t.market.waitForData(FloorsData),
          t.getModuleBySymbol(LocaleSymbol),
          t.market.waitForData(RoomBoundViewData)
        ])
        let p = i.application === AppMode.WORKSHOP
        const m = (i, n, a, h = []) => {
            const d = o.tryGetProperty(ShowcaseDollhouseKey, !1),
              l = o.tryGetProperty(ShowcaseFloorPlanKey, !1),
              m = d || l || p,
              g = (o.tryGetProperty(ShowcaseRoomBoundsKey, !1) && u.visibleInShowcase) || p,
              f = 0 === h.length
            if (!(g && m && f)) return []
            const v = []
            for (const a of e.rooms.values()) {
              const h = (0, R.LN)(a.id, c, e)
              if (i(a.name) || i(h)) {
                const e = r.getFloor(a.floorId)
                if (!e) throw new Error("Unable to find floor for room while generating search results.")
                v.push(new O(t.commandBinder, s, o, n, a, h, e.id))
              }
            }
            return v.sort((t, e) => t.title.localeCompare(e.title))
          },
          g = t => {},
          f = t => new AggregateSubscription(e.onChanged(t), o.onPropertyChanged(UserPreferencesKeys.UnitType, t), u.onChanged(t)),
          v = {
            renew: () => {
              t.commandBinder.issueCommandWhenBound(
                new SearchGroupRegisterCommand({
                  id: searchModeType.MODELROOM,
                  groupPhraseKey: PhraseKey.SHOWCASE.ROOMS.SEARCH_GROUP_HEADER,
                  getSimpleMatches: m,
                  registerChangeObserver: f,
                  onSearchActivatedChanged: g,
                  groupOrder: 100,
                  groupIcon: "edit-floorplan",
                  batchSupported: !1
                })
              )
            },
            cancel: () => {
              t.commandBinder.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.MODELROOM))
            }
          },
          y = () => {
            ;(p = i.application === AppMode.WORKSHOP), (o.tryGetProperty(ShowcaseRoomBoundsKey, !1) && u.visibleInShowcase) || p ? v.renew() : v.cancel()
          },
          S = i.onPropertyChanged("application", y),
          I = o.onPropertyChanged(ShowcaseRoomBoundsKey, y),
          M = u.onChanged(y)
        return y(), new AggregateSubscription(v, S, I, M)
      })(e, this.data).then(t => this.bindings.push(t)),
      e.market.register(this, RoomBoundData, this.data),
      e.market.register(this, RoomBoundViewData, this.roomBoundViewData)
  }
  dispose(t) {
    super.dispose(t), this.writeBindings && this.writeBindings.cancel()
  }
  async setReadOnly(t) {
    t !== this.store.readonly &&
      ((this.store.readonly = t),
      this.writeBindings &&
        (t
          ? this.writeBindings.cancel()
          : (this.writeBindings.renew(),
            this.layersChecked ||
              (await this.issueCommand(new ConvertModelToLayeredCommand()),
              this.layersData.getProxyLayerId() || (await this.issueCommand(new CheckForProxyLayerCommand())),
              this.data.validateGraph()))))
  }
  localizeRoomClassification(t) {
    return this.localeModule ? Object.assign(Object.assign({}, t), { label: (0, R.Nw)(t, this.localeModule) }) : t
  }

  addToModifiedFloors(t) {
    this.modifiedFloors.add(t.floorId)
  }
  updateRoomAssociations() {
    const t = new Map()
    for (const e of this.associationSources)
      for (const i of e.getPositionId()) {
        if (!i.floorId || !this.modifiedFloors.has(i.floorId) || !shouldDisplayLayer(this.data, this.layersData, i.layerId)) continue
        const s = this.data.findRoomIdForPosition(i.position, i.floorId, i.roomId)
        if (s != i.roomId) {
          const n = t.get(s) || (s ? { roomId: s } : { resetRoom: !0 }),
            o = n[e.type] || []
          o.push(i.id), (n[e.type] = o), t.set(s, n), e.updateRoomForId(i.id, s)
        }
      }
    return this.modifiedFloors.clear(), Array.from(t.values())
  }
  async registerRoomAssociationSource(t) {
    this.associationSources.push(t)
  }
}
