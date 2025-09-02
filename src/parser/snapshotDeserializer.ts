import { Quaternion, Vector3 } from "three"
import { SnapshotCategory } from "../const/50090"
import { placementType, snapshotCategory, snapshotOrigin, snapshotType, viewModesType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import { ExpiringResource } from "../utils/expiringResource"
import { SnapshotObject } from "../object/snapshot.object"
import { toDate } from "../utils/date.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { VisionParase } from "../math/2569"
const MdsSnapshotDeserializer = new DebugInfo("mds-snapshot-deserializer")
export class SnapshotDeserializer {
  deserialize(e) {
    // if (!e || !this.validate(e)) return MdsSnapshotDeserializer.debug("Deserialized invalid Snapshot data from MDS", e), null
    if (!e) return MdsSnapshotDeserializer.debug("Deserialized invalid Snapshot data from MDS", e), null
    const m = new SnapshotObject()
    m.sid = e.id
    m.thumbnailUrl = new ExpiringResource(e.thumbnailUrl || "", toDate(e.validUntil))
    m.imageUrl = new ExpiringResource(e.presentationUrl || "", toDate(e.validUntil))
    m.name = e.label || ""
    m.category = this.getCwfSnapshotCategory(e) || SnapshotCategory.USER
    m.width = e.width || 0
    m.height = e.height || 0
    m.created = toDate(e.created)
    m.modified = toDate(e.modified)
    m.visionLabel = e.classification || ""
    const f = e.snapshotLocation?.anchor?.pano?.placement
    m.is360 = !(!f || f === placementType.AUTO)
    const { snapshotLocation: g } = e
    if (g) {
      const e = g.position ? VisionParase.fromVisionVector(g.position) : new Vector3()
      const t = g.rotation ? VisionParase.fromVisionCameraQuaternion(g.rotation) : new Quaternion()
      const n = this.getCwfViewmode(g.viewMode) || ViewModes.Panorama
      const r: number[] = []
      for (const e of g.floorVisibility || []) {
        for (let t = 0; t < e.sequence; t++) r[t] = r[t] || 0
        r[e.sequence] = 1
      }
      m.metadata = {
        cameraMode: n,
        cameraPosition: e,
        cameraQuaternion: t,
        scanId: (g.anchor && g.anchor.id) || "",
        orthoZoom: (n === ViewModes.Floorplan && g.zoom) || -1,
        ssZoom: g.zoom || 1,
        floorId: g.floorVisibility && g.floorVisibility.length > 0 ? g.floorVisibility[0].id : null,
        floorVisibility: r
      }
    }
    return m
  }
  validate(e) {
    if (!e.snapshotLocation?.position) return !1
    const n = ["id", "snapshotLocation", "thumbnailUrl", "presentationUrl"].every(t => t in e)
    const i = null !== this.getCwfSnapshotCategory(e)
    return n && i
  }
  getCwfViewmode(e?: viewModesType) {
    const t = {
      [viewModesType.DOLLHOUSE]: ViewModes.Dollhouse,
      [viewModesType.PANORAMA]: ViewModes.Panorama,
      [viewModesType.FLOORPLAN]: ViewModes.Floorplan,
      [viewModesType.MESH]: ViewModes.Panorama
    }
    return e && e in t ? t[e] : null
  }
  getCwfSnapshotCategory(e) {
    if (e.category === snapshotCategory.TOUR) return SnapshotCategory.TOUR
    if (e.origin === snapshotOrigin.VISION) return SnapshotCategory.AUTO
    if (e.type === snapshotType.EQUIRECTANGULAR) return SnapshotCategory.PANORAMA
    const s = e.snapshotLocation?.anchor?.pano?.placement
    return e.type === snapshotType.PHOTO2D ? (s === placementType.MANUAL ? SnapshotCategory.UNALIGNED : SnapshotCategory.USER) : null
  }
}
