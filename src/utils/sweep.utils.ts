import { AlignmentType, PlacementType, SweepObject } from "../object/sweep.object"
import { Vector3 } from "three"
export const r = 0.25
export const diffSweep = (e: SweepObject) => (t: SweepObject) => t !== e
export const inNeighbours = (e: SweepObject) => (t: SweepObject) => !!e.neighbours && -1 !== e.neighbours.indexOf(t.id)
export const SameOrNearSweep = (e: SweepObject) => (t: SweepObject) => e === t || inNeighbours(e)(t)
export const isManualSweep = (e: SweepObject) => e.placementType === PlacementType.MANUAL
export const isAlignedSweep = () => (e: { alignmentType: AlignmentType }) => e.alignmentType === AlignmentType.ALIGNED
export const noAlignedSweep = () => (e: { alignmentType: AlignmentType }) => e.alignmentType !== AlignmentType.ALIGNED
export const sameFloorSweep = (e: SweepObject) => (t: SweepObject) => e.floorId === t.floorId
export const sweepByFloor = (e: string) => (t: SweepObject) => e === t.floorId
export const farSweep = (() => {
  const e = new Vector3()
  const t = new Vector3()
  return (n: Vector3, i: Vector3, s = r) =>
    (r: SweepObject) =>
      e.copy(r.position).sub(n).normalize().dot(t.copy(i).normalize()) > s
})()
export const enabledSweep = () => (e: SweepObject) => e.enabled
export const inViewSweep = (e: Vector3, t: Vector3) => {
  const n = new Vector3()
  t = t.clone()
  return (i: SweepObject) => n.copy(i.position).sub(e).normalize().dot(t) > 0
}
export const isFarSweep = (e: Vector3, t: number) => (n: SweepObject) => e.distanceTo(n.position) > t
export const isNearSweep = (e: Vector3, t: number) => (n: SweepObject) => e.distanceTo(n.position) < t
export const nearSquaredSweep = (e: Vector3, t: number) => (n: SweepObject) => e.distanceToSquared(n.position) < t
