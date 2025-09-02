import { Vector3ToJson } from "../other/59296"
import { roundToDecimalPlaces, VisionParase } from "../math/2569"
import { calculateAngleFromLength } from "../math/92542"
import { toISOString } from "../utils/date.utils"
export function createSweepDataMapper(e) {
  return function (t) {
    if (!t) return null
    const s = e.getSweep(t.sweepId)
    const n = processDotsData(t.dots)
    if (!s || !n?.length) return null
    return {
      sid: t.id,
      index: t.index,
      sweepId: s.uuid,
      status: t.status,
      dots: n,
      visible: t.visible,
      created: toISOString(t.created),
      modified: toISOString(t.modified)
    }
  }
}
export function createSweepDataObjectMapper(e) {
  const t = createSweepDataMapper(e)
  return function (e) {
    const s = {}
    for (const i of Object.values(e)) {
      const e = t(i)
      e && (s[i.id] = e)
    }
    return s
  }
}
export function processDotsData(e) {
  if (!e) return null
  return (function (e, t = 5) {
    return e.map(e => ({
      unitVectors: e.unitVectors.map(e => ({ x: roundToDecimalPlaces(e.x, t), y: roundToDecimalPlaces(e.y, t), z: roundToDecimalPlaces(e.z, t) })),
      radius: roundToDecimalPlaces(e.radius, t),
      feather: roundToDecimalPlaces(e.feather, t),
      strength: roundToDecimalPlaces(e.strength, 3)
    }))
  })(
    e.map(e => ({
      unitVectors: e.directions.map(e => Vector3ToJson(VisionParase.toVisionVector(e))),
      radius: calculateAngleFromLength(e.radius),
      feather: e.feather,
      strength: e.strength
    }))
  )
}
