import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { defaultLayerId } from "../const/mds.const"
import { AnalyticsSymbol, MeshApiFixupSymbol, MeshQuerySymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { FloorsData } from "../data/floors.data"
import { MeshData } from "../data/mesh.data"
import { SweepsData } from "../data/sweeps.data"
import AnalyticsModule from "./analytics.module"
import MeshQueryModule from "./meshQuery.module"

declare global {
  interface SymbolModule {
    [MeshApiFixupSymbol]: MeshApiDataFixupsModule
  }
}
export default class MeshApiDataFixupsModule extends Module {
  floorData: FloorsData
  sweepData: SweepsData
  meshData: MeshData
  meshQuery: MeshQueryModule
  // analytics: AnalyticsModule

  constructor() {
    super(...arguments)
    this.name = "mesh-api-data-fixups"
  }

  async init(e, t) {
    const { market: i } = t
    ;[this.floorData, this.sweepData, this.meshData, this.meshQuery] = await Promise.all([
      i.waitForData(FloorsData),
      i.waitForData(SweepsData),
      i.waitForData(MeshData),
      t.getModuleBySymbol(MeshQuerySymbol)
      // t.getModuleBySymbol(AnalyticsSymbol)
    ])
    this.assignSweepToFloors()
    this.assignBoundingBoxesToFloors()
    this.assignMissingSweepFloors()
    this.registerRoomAssociationSource(t)
  }

  assignBoundingBoxesToFloors() {
    const e = this.meshData.meshGroups.floors
    this.floorData.iterate((t, i) => {
      const s = e.get(t.meshGroup)
      s && (t.setBounds(s.boundingBox), t.setCenterOfMass(s.centerOfMass))
    })
    this.floorData.commit()
  }

  assignMissingSweepFloors() {
    let e = 0

    this.sweepData.getSweepList().forEach(t => {
      var i
      if (t.isUnplaced()) return
      let s
      if (null === t.floorId || !this.floorData.hasFloor(t.floorId)) {
        const o = this.meshQuery.floorIdFromObject(null === (i = this.meshQuery.nearestMeshInfo(t.position)) || void 0 === i ? void 0 : i.object)
        o && this.floorData.hasFloor(o) && (s = this.floorData.getFloor(o)),
          (null == s ? void 0 : s.id) &&
            s.id !== t.floorId &&
            (this.log.debug(`Setting ${t.alignmentType} sweep ${t.id} from floor ${t.floorId} to ${s.id}`), (t.floorId = s.id), t.commit(), e++)
      }
    })
  }

  assignSweepToFloors() {
    this.sweepData.getSweepList().forEach(e => {
      var t
      if (!e.isUnplaced() && e.isAligned()) {
        let i
        if (e.floorId && this.floorData.hasFloor(e.floorId)) i = this.floorData.getFloor(e.floorId)
        else {
          const s = this.meshQuery.floorIdFromObject(null === (t = this.meshQuery.nearestMeshInfo(e.position)) || void 0 === t ? void 0 : t.object)
          s && this.floorData.hasFloor(s) && (i = this.floorData.getFloor(s))
        }

        i && i.addSweep(e.position, e.floorPosition)
      }
    })
    this.floorData.commit()
  }

  registerRoomAssociationSource(e) {
    const t = this.sweepData
    e.commandBinder.issueCommandWhenBound(
      new RegisterRoomAssociationSourceCommand({
        type: "locations",
        getPositionId: function* () {
          for (const e of t.sweeps())
            yield {
              id: e.id,
              roomId: e.roomId || void 0,
              floorId: e.floorId || void 0,
              position: e.position,
              layerId: defaultLayerId
            }
        },
        updateRoomForId: (e, i) => {
          const s = t.getSweep(e)
          if (!s) throw new Error("Invalid sweep id!")
          s.roomId = i || null
        }
      })
    )
  }
}
