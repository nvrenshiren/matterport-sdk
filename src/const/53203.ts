import { getValFromURL } from "../utils/urlParams.utils"
export const FlipYConfig = {
  flipDownload: getValFromURL("flipDownload", !0),
  flipUpload: getValFromURL("flipUpload", !0),
  debugLOD: getValFromURL("debuglod", !1),
  debugRttQuality: getValFromURL("debugQuality", !1),
  debugRttScores: getValFromURL("debugScores", !1),
  debugRttClear: getValFromURL("debuglodrtt", !0),
  debugPauseTexStream: getValFromURL("textureStreamPause", !1),
  sightingMaxAge: getValFromURL("meshSightingMaxAge", 600),
  textureTileSize: getValFromURL("chunkTileSize", 512)
}

export const WireframeEnabledKey = "wireframeEnabled"
export const FeaturesTiledMeshKey = "features/tiled_mesh"
export const TrimFloorKey = "Trim floor by(%)",
  c = 0,
  d = {
    FADE_OPAQUE: 1,
    FADE_ABOVE: 0.05,
    FADE_BELOW: 0.2,
    FADE_TILE_VISIBLE_THRESHOLD: 0.6,
    FADE_CLICKABLE_THRESHOLD: 0.051,
    FADE_IN_VALUE: 0.2,
    FADE_IN_END_ANGLE: 55,
    FADE_IN_START_ANGLE: 35,
    FADE_IN_HOVER_BOOST_VALUE: 0.3,
    FADE_BELOW_START: 0,
    FADE_BELOW_MULT: 1
  }

export const Kb = c
export const Lp = WireframeEnabledKey
export const NR = TrimFloorKey

export const xx = d
