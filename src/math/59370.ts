import { MathUtils, Matrix4, Quaternion, Vector2, Vector3 } from "three"
import { CheckThreshold } from "../utils/49827"
import { TargetPhi } from "../const/64918"
import { TransitionTimeConfig } from "../const/66777"
import { CameraData } from "../data/camera.data"
import { Pose } from "../webgl/pose"
import { DirectionVector } from "../webgl/vector.const"
/**
 * 获取屏幕和NDC位置，计算3D点在屏幕坐标系和NDC中的位置
 */
export const getScreenAndNDCPosition = (() => {
  const e = new Matrix4()
  const t = new Matrix4()
  return (n: CameraData, s: Vector3, r = new Vector2(), a = new Vector3()) => (
    createMatrixFromPose(n.pose, t),
    e.copy(t),
    e.invert(),
    a.set(s.x, s.y, s.z).applyMatrix4(e).applyMatrix4(n.pose.projection.asThreeMatrix4()),
    getPointerScreenPosition(n.width, n.height, a, r),
    {
      screenPosition: r,
      ndcPosition: a
    }
  )
})()
/**
 * 获取指针屏幕位置向量，计算3D点在屏幕坐标系中的位置。
 */
export const getPointerScreenPositionVector = (() => {
  const e = new Vector3()
  const t = new Vector2()
  return (n: Vector3, i: Vector3, s: Quaternion, r: number, a: number, o: Matrix4) => (
    e.copy(transformPoint(n, i, s, o)), getPointerScreenPosition(r, a, e, t), t
  )
})()
/**
 * 变换点，将3D点从一个坐标系转换到另一个坐标系
 */
export const transformPoint = (() => {
  const e = new Matrix4(),
    t = new Matrix4(),
    n = new Vector3()
  return (i, r, a, o) => (e.compose(r, a, DirectionVector.UNIT), t.copy(e), t.invert(), n.copy(i).applyMatrix4(t).applyMatrix4(o), n)
})()
/**
 * 从姿势创建矩阵
 */
const createMatrixFromPose = (e, t) => (t = t || new Matrix4()).compose(e.position, e.rotation, DirectionVector.UNIT)
/**
 * 屏幕坐标转NDC，将屏幕坐标转换为归一化设备坐标
 * @param e
 * @param t
 * @param n
 * @param s
 * @param r
 * @returns
 */
export const convertScreenToNDC = (e, t, n, s, r = new Vector2()) => ((r.x = (e / n) * 2 - 1), (r.y = (-t / s) * 2 + 1), r)
/**
 * 根据给定的参数计算方向向量
 * @param e
 * @param t
 * @param n
 * @param s
 * @returns
 */
export const calculatePostDirection = (e: CameraData, t: Vector2, n = 0.5, s = new Vector3()) => (
  (s.x = t.x), (s.y = t.y), (s.z = n), getPostDirections(e.pose, s)
)
/**
 * 根据姿势和方向向量计算方向
 */
export const getPostDirections = (() => {
  const e = new Matrix4()
  const t = new Matrix4()
  return (n: Pose, s: Vector3, r = new Vector3()) => (
    r.copy(s), t.copy(n.projection.asThreeMatrix4()), t.invert(), createMatrixFromPose(n, e), r.applyMatrix4(t).applyMatrix4(e)
  )
})()
/**
 * 计算3D空间中的点在屏幕坐标系中的位置
 * @param e
 * @param t
 * @param n
 * @param s
 * @returns
 */
export const getPointerScreenPosition = (e: number, t: number, n: Vector3, s = new Vector2()) => (s.set(((n.x + 1) * e) / 2, ((1 - n.y) * t) / 2), s)
/**
 * 检查俯仰角是否适用于正交投影
 * @param e
 * @returns
 */
export const isPitchFactorOrtho = (e: number) => Math.abs(e) < 0.1
/**
 * 计算俯仰角，根据四元数计算物体的俯仰角度
 */
export const calculatePitchAngle = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    n = new Vector3()
  return i => {
    e.copy(DirectionVector.FORWARD).applyQuaternion(i).multiplyScalar(-1), t.copy(DirectionVector.UP).applyQuaternion(i)
    const r = t.dot(DirectionVector.UP) <= 0
    n.set(e.x, 0, e.z)
    const a = r ? -n.length() : n.length(),
      o = e.y
    return Math.atan2(o, a)
  }
})()
/**
 * 调整摄像机姿势，根据目标和参数调整摄像机的姿势
 */
export const adjustCameraPose = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    n = new Quaternion(),
    o = new Vector3(),
    d = new Quaternion()
  let u: Pose | null = null
  return (i: Pose, h, p, m, f) => {
    u = u || new Pose(1)
    const g = i
    u.copy(g)
    u.unapplyPhiBasedFovSquish()
    const v = g.phi()
    const y = calculateAutoOrbitSpeed(v, p, h)
    const E = TransitionTimeConfig.camera.autoOrbitUpperPhiLimit
    const T = TransitionTimeConfig.camera.autoOrbitLowerPhiLimit
    const _ = CheckThreshold(y, T - v, E - v)
    const w = E - v < 1e-10
    const A = v - T < 1e-10
    if (h === TargetPhi.Top ? w : A) return 1
    const N = m
    e.copy(DirectionVector.FORWARD).applyQuaternion(g.rotation)
    e.setLength(N)
    e.addVectors(g.fovCorrectedPosition(), e)
    t.copy(DirectionVector.RIGHT)
    n.setFromAxisAngle(t.applyQuaternion(g.rotation), -_)
    o.copy(g.fovCorrectedPosition()).sub(e).applyQuaternion(n)
    d.copy(g.rotation).premultiply(n)
    o.applyQuaternion(n)
    d.premultiply(n)
    o.add(e)
    d.normalize()
    calculatePitchAngle(d) >= E && correctQuaternionDirection(d)
    u.position.copy(o)
    u.rotation.copy(d)
    u.focalDistance = N
    u.applyPhiBasedFovSquish()
    f.copy(u)
    const I = h === TargetPhi.Top ? E : T
    const P = Math.abs((f.phi() - p) / (I - p))
    return CheckThreshold(P, 0, 1)
  }
})()
//计算自动轨道速度
const calculateAutoOrbitSpeed = (e, t, n) => {
  const i = n === TargetPhi.Top ? 1 : -1,
    s = n === TargetPhi.Top ? TransitionTimeConfig.camera.autoOrbitUpperPhiLimit : TransitionTimeConfig.camera.autoOrbitLowerPhiLimit,
    r = Math.abs((s - e) / (s - t))
  return i * MathUtils.lerp(TransitionTimeConfig.camera.autoOrbitMinVelocity, TransitionTimeConfig.camera.autoOrbitMaxVelocity, r)
}
//校正四元数方向，调整四元数的方向以符合约束
const correctQuaternionDirection = (() => {
  const e = DirectionVector.RIGHT.clone()
  const t = DirectionVector.UP.clone()
  const n = DirectionVector.BACK.clone()
  const r = new Matrix4()
  return (i: Quaternion) => {
    e.copy(DirectionVector.RIGHT)
    t.copy(DirectionVector.UP)
    n.copy(DirectionVector.BACK)
    e.applyQuaternion(i)
    e.y = 0
    t.applyQuaternion(i)
    t.y = 0
    n.applyQuaternion(i)
    n.x = 0
    n.y = 1
    n.z = 0
    r.makeBasis(e, t, n)
    i.setFromRotationMatrix(r)
  }
})()
