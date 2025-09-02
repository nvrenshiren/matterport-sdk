import { Intersection, Vector3 } from "three"
import { LockNavigationCommand, UnlockNavigationCommand } from "../command/navigation.command"
import { TransitionFactor } from "../const/transition.const"
import { CommandBinder } from "../core/commandBinder"
import { createSubscription } from "../core/subscription"
import { SweepsData } from "../data/sweeps.data"
import MeshQueryModule from "../modules/meshQuery.module"
import { SweepObject } from "../object/sweep.object"
import { diffSweep, enabledSweep, farSweep, inNeighbours, inViewSweep, isAlignedSweep, isNearSweep } from "../utils/sweep.utils"
import { sweepScoreByDirection, sweepScoreByDistance, sweepScoreByFloorID, sweepScoreByPosition } from "../utils/sweepScore.utils"
export function createCommandBinderSubscription(t: CommandBinder["issueCommand"]) {
  return createSubscription(
    () => t(new LockNavigationCommand()),
    () => t(new UnlockNavigationCommand()),
    !1
  )
}
export const getSweepByDirection = (
  sweepData: SweepsData,
  direction: Vector3,
  directionFactor?: number,
  sourceSweep?: SweepObject,
  ...ignoreSweeps: SweepObject[]
) => {
  if (!sweepData.currentSweepObject) return []
  const l = sourceSweep || sweepData.currentSweepObject
  const c = [diffSweep(l), enabledSweep(), inNeighbours(l), farSweep(l.position, direction, directionFactor)]
  for (const t of ignoreSweeps) c.push(diffSweep(t))
  const h = [sweepScoreByDirection(l.position, direction), sweepScoreByDistance(l.position)]
  const SweepNeighbours = sweepData.getSweepNeighbours(l)
  return sweepData.sortByScore(c, h, SweepNeighbours)
}

export const getSweepByIntersection = (t: SweepsData, e: boolean, i: Intersection, r: MeshQueryModule) => {
  const n = [enabledSweep(), isAlignedSweep()]
  const l = [sweepScoreByPosition(i.point)]
  const c = t.currentSweepObject
  e && c && n.push(diffSweep(c), isNearSweep(c.position, TransitionFactor.longerTransitionMaxDist), inNeighbours(c))
  i.face && n.push(inViewSweep(i.point, i.face.normal))
  const h = r.floorIdFromObject(i.object)
  h && l.push(sweepScoreByFloorID(h))
  const d = t.sortByScore(n, l)
  if (0 === d.length) {
    const e = t.getClosestSweep(i.point, !0)!
    d.push({ sweep: e, score: 0 })
  }
  return d
}
