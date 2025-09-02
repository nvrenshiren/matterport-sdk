import { DebugInfo } from "../core/debug"
import { PanoramaOrMesh } from "../utils/viewMode.utils"
const CameraStartUtilDebugInfo = new DebugInfo("camera-start-util")
function r(e, t) {
  const { mode: n, quaternion: i, position: r, floorVisibility: a, sweepIndex: o, zoom: l } = e
  let { panoId: c } = e
  if (c && !t.containsSweep(c)) {
    const e = t.getSweepByUuid(c)
    e && (c = e.id)
  }
  if (!c && void 0 !== o) {
    const e = t.getSweepByIndex(o)
    e ? (c = e.id) : CameraStartUtilDebugInfo.debug(`Failed to load sweep index ${o}`)
  }
  return {
    mode: n,
    camera: {
      position: r,
      rotation: i,
      zoom: l
    },
    pano: {
      uuid: c
    },
    floorVisibility: a
  }
}
function a(e, t) {
  return !!e && (!PanoramaOrMesh(e.mode) || (!!e.pano.uuid && t.containsSweep(e.pano.uuid)))
}
export const J = r
export const l = a
