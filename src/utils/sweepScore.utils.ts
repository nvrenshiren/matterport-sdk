import { Vector3 } from "three"
import { SweepObject } from "../object/sweep.object"
export const n = -1
export const i = 10
export const r = 5
export const a = -5
export const sweepScoreByPosition =
  (e: Vector3, t = n) =>
  (o: SweepObject) =>
    e.distanceToSquared(o.position) * t
export const sweepScoreByDistance =
  (e: Vector3, t = n) =>
  (o: SweepObject) =>
    e.distanceTo(o.position) * t
export const sweepScoreByDirection = (e: Vector3, t: Vector3, o = i) => {
  const n = new Vector3()
  return (s: SweepObject) => n.copy(s.position).sub(e).normalize().dot(t) * o
}
export const sweepScoreByFloorPosition =
  (e: Vector3, t = n) =>
  (o: SweepObject) =>
    e.distanceToSquared(o.floorPosition) * t
export const sweepScoreByFloorID =
  (e: string, t = r, o = a) =>
  (s: SweepObject) =>
    e === s.floorId ? t : o
