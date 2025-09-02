import { Box3, Quaternion, Vector3 } from "three"
import * as r from "../const/17881"
import { DirectionVector } from "./vector.const"
import { Pose } from "./pose"
/**
 * 计算沿特定轴的偏移量
 * @param e
 * @param t
 * @param n
 * @returns
 */
export function calculateOffsetAlongAxis(e: Box3, t: Vector3, n: "x" | "y" | "z") {
  const s = e.getSize(new Vector3())
  return e.getCenter(new Vector3()).sub(t)[n] + Math.abs(s[n] / 2) + r.sQ
}
/**
 * 计算最佳位置和旋转
 * @param e
 * @param t
 * @param n
 * @param r
 * @returns
 */
export function calculateBestPositionAndRotation(e: Box3, t: Vector3, n: Pose, r: Quaternion) {
  const o = n.rotation.clone().multiply(r).normalize()
  const l = calculateOffsetAlongAxis(
    e,
    t,
    (e => {
      const t = DirectionVector.FORWARD.clone().applyQuaternion(e)
      const n = DirectionVector.FORWARD
      const i = DirectionVector.UP
      return 1 === Math.round(t.dot(i)) ? "y" : 1 === Math.round(t.dot(n)) ? "z" : "x"
    })(o)
  )
  const c = new Vector3(0, 0, l)
  c.applyQuaternion(o)
  return {
    position: t.clone().add(c),
    rotation: o
  }
}
