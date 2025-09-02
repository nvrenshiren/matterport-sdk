import { MeshChunkLOD } from "./21270"
import { isMobilePhone } from "../utils/browser.utils"
import { getValFromURL } from "../utils/urlParams.utils"
export const ChunkConfig = {
  urlTemplateToken: "<file>",
  initialMaxLOD: MeshChunkLOD.Min,
  nonMeshMaxLOD: MeshChunkLOD.Standard,
  maxLOD: MeshChunkLOD.High,
  minLOD: MeshChunkLOD.Min,
  loadSiblings: !0,
  displayActiveTiles: !1,
  autoDisableRendererCulling: !0,
  optimizeRaycast: !1,
  stopAtEmptyTiles: !1,
  disableTileUpdates: !1,
  disposeModel: !1,
  limitMemoryUsage: isMobilePhone(),
  allocatedMegsBeforeLimitingLod: 350,
  lruMinExtraTiles: isMobilePhone() ? 0 : 100,
  lruMaxTiles: 800,
  lruUnloadPercent: 0.05,
  downloadQueueConcurrency: 8,
  parseQueueConcurrency: 10,
  snappingMaxLOD: MeshChunkLOD.Standard,
  errorTarget: Number(getValFromURL("errorTarget", isMobilePhone() ? 6 : 4)),
  errorMultiplierHiddenFloors: 0.01,
  errorMultiplierRaycastOcclusion: 0.1,
  smallMeshThreshold: Number(getValFromURL("smallMeshThreshold", 40)),
  smallMeshErrorMultiplier: Number(getValFromURL("smallMeshErrorMultiplier", 0.1))
}
