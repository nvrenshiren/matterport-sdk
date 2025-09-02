import { Box3, Quaternion, Vector3 } from "three"
import { calculateOffsetAlongAxis } from "./20898"
import { MeshTrimViewState } from "./49123"
import { Pose } from "./pose"
import { DirectionVector } from "./vector.const"
const o = new Quaternion().setFromAxisAngle(DirectionVector.UP, Math.PI / 2)
const l = new Quaternion().setFromAxisAngle(DirectionVector.UP, Math.PI)
const c = new Quaternion().setFromAxisAngle(DirectionVector.UP, 0)
const d = new Quaternion().setFromAxisAngle(DirectionVector.UP, Math.PI / -2)
const u = new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, Math.PI / -2)
/**
 * 生成顶部位置和旋转配置
 * @param e
 * @param t
 * @returns
 */
function generateTopPositionsAndRotations(e: Box3, t: Vector3) {
  const n = calculateOffsetAlongAxis(e, t, "y"),
    s = new Vector3(0, n, 0)
  return [
    {
      position: t.clone().add(s),
      rotation: c.clone().multiply(u)
    },
    {
      position: t.clone().add(s),
      rotation: o.clone().multiply(u)
    },
    {
      position: t.clone().add(s),
      rotation: d.clone().multiply(u)
    },
    {
      position: t.clone().add(s),
      rotation: l.clone().multiply(u)
    }
  ]
}
/**
 * 生成侧面位置和旋转配置
 * @param e
 * @param t
 * @returns
 */
function generateSidePositionsAndRotations(e: Box3, t: Vector3) {
  const n = calculateOffsetAlongAxis(e, t, "x"),
    s = calculateOffsetAlongAxis(e, t, "z"),
    r = new Vector3(n, 0, 0),
    u = new Vector3(0, 0, s)
  return [
    {
      position: t.clone().add(r),
      rotation: o.clone()
    },
    {
      position: t.clone().add(u),
      rotation: c.clone()
    },
    {
      position: t.clone().sub(r),
      rotation: d.clone()
    },
    {
      position: t.clone().sub(u),
      rotation: l.clone()
    }
  ]
}
/**
 * 找到最接近的配置
 * @param e
 * @param t
 * @returns
 */
function findClosestConfiguration(
  e: Pose,
  t: {
    position: Vector3
    rotation: Quaternion
  }[]
) {
  return t.reduce((t, n) => (n.rotation.angleTo(e.rotation) < t.rotation.angleTo(e.rotation) ? n : t), t[0])
}
/**
 * 获取最接近的姿势配置
 * @param e
 * @param t
 * @param n
 * @returns
 */
export function getNearestPoseConfiguration(e: Box3, t: Vector3, n: Pose) {
  const i = generateTopPositionsAndRotations(e, t)
  const s = generateSidePositionsAndRotations(e, t)
  const a = findClosestConfiguration(n, [...i, ...s])
  return [a, i.includes(a) ? MeshTrimViewState.TOP : MeshTrimViewState.SIDE] as [
    {
      position: Vector3
      rotation: Quaternion
    },
    MeshTrimViewState
  ]
}
/**
 * 获取最接近的顶部姿势
 * @param e
 * @param t
 * @param n
 * @returns
 */
export function getNearestTopPose(e: Box3, t: Vector3, n: Pose) {
  return findClosestConfiguration(n, generateTopPositionsAndRotations(e, t))
}
/**
 * 获取最接近的侧面姿势
 * @param e
 * @param t
 * @param n
 * @returns
 */
export function getNearestSidePose(e: Box3, t: Vector3, n: Pose) {
  return findClosestConfiguration(n, generateSidePositionsAndRotations(e, t))
}
