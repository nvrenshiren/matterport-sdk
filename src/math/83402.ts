import { MathUtils, Vector3 } from "three"
import { DirectionKey, DirectionVector } from "../webgl/vector.const"
export enum ConstraintMode {
  Axes = 1,
  Edges = 4,
  EdgesAndPlanarAxes = 3,
  Free = 5,
  Locked = 6,
  PlanarAxes = 2
}
const directionVectors = {
  [DirectionKey.UP]: { dir: Object.freeze(DirectionVector.UP.clone()) },
  [DirectionKey.DOWN]: { dir: Object.freeze(DirectionVector.DOWN.clone()) },
  [DirectionKey.BACK]: { dir: Object.freeze(DirectionVector.BACK.clone()) },
  [DirectionKey.LEFT]: { dir: Object.freeze(DirectionVector.LEFT.clone()) },
  [DirectionKey.RIGHT]: { dir: Object.freeze(DirectionVector.RIGHT.clone()) },
  [DirectionKey.FORWARD]: { dir: Object.freeze(DirectionVector.FORWARD.clone()) }
}
const horizontalPlaneVector = { [DirectionKey.HORIZONTAL_PLANE]: { dir: Object.freeze(DirectionVector.HORIZONTAL_PLANE.clone()) } }
/**
 *计算并返回一个对象的位置和约束轴
 */
export const calculateConstrainedPosition = (() => {
  let constrainedCount = 0
  const tempVector = new Vector3(),
    directionVector = new Vector3(),
    constrainedVector = new Vector3(),
    zeroVector = new Vector3(),
    initialAngleTo = 999,
    constrainedAxis = Object.freeze(DirectionVector.ZERO.clone()),
    allAxes = Object.keys(directionVectors).map(t => Object.assign(Object.assign({}, directionVectors[t]), { name: t, angleTo: initialAngleTo })),
    allPlanes = Object.keys(horizontalPlaneVector).map(t => Object.assign(Object.assign({}, horizontalPlaneVector[t]), { name: t, angleTo: initialAngleTo })),
    toggleSign = (t: number) => (t + 3) % 2
  let currentClosestAxis = allAxes[0]
  return (startPoint: Vector3, endPoint: Vector3, mode = ConstraintMode.Axes) => {
    if (mode === ConstraintMode.Free) return { position: endPoint.clone(), constrainedAxis, axisName: DirectionKey.NONE }
    if (
      (allAxes.forEach(t => (t.angleTo = initialAngleTo)),
      allPlanes.forEach(t => (t.angleTo = initialAngleTo)),
      constrainedVector.copy(endPoint).sub(startPoint),
      (constrainedCount = constrainedVector.length()),
      constrainedCount < 0.05)
    )
      return { position: endPoint.clone(), constrainedAxis, axisName: DirectionKey.NONE }
    zeroVector.copy(constrainedVector).normalize()
    const threshold = 0.05 * Math.min(constrainedCount, 1)
    if (mode !== ConstraintMode.Locked) {
      for (const t of allAxes) {
        const e = MathUtils.radToDeg(zeroVector.angleTo(t.dir))
        e < currentClosestAxis.angleTo && (currentClosestAxis = t), (t.angleTo = e)
      }
      if (currentClosestAxis.angleTo > 20) {
        const t = Math.abs(constrainedVector.y)
        t * t < threshold && (currentClosestAxis = allPlanes[0])
      }
    }
    tempVector.set(
      startPoint.x * toggleSign(currentClosestAxis.dir.x),
      startPoint.y * toggleSign(currentClosestAxis.dir.y),
      startPoint.z * toggleSign(currentClosestAxis.dir.z)
    )
    directionVector
      .set(endPoint.x * Math.abs(currentClosestAxis.dir.x), endPoint.y * Math.abs(currentClosestAxis.dir.y), endPoint.z * Math.abs(currentClosestAxis.dir.z))
      .add(tempVector)
    return mode === ConstraintMode.Locked || directionVector.distanceToSquared(endPoint) < threshold
      ? { position: directionVector.clone(), constrainedAxis: currentClosestAxis.dir, axisName: currentClosestAxis.name }
      : { position: endPoint.clone(), constrainedAxis, axisName: DirectionKey.NONE }
  }
})()

export const r2 = calculateConstrainedPosition
