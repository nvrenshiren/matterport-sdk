import { Box3, Frustum, MathUtils, Matrix4, Quaternion, Ray, Sphere, Vector3 } from "three"
import { MatrixBase } from "../webgl/matrix.base"
import { DirectionVector } from "../webgl/vector.const"
import { CheckThreshold } from "../utils/49827"

export const VisionParase = {
  fromVisionVector: function (e) {
    return new Vector3(e.x, e.z, -e.y)
  },
  toVisionVector: function (e) {
    return new Vector3(e.x, -e.z, e.y)
  },
  fromVisionQuaternion: function (e) {
    return new Quaternion(e.x, e.z, -e.y, e.w).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(90)))
  },
  fromVisionCameraQuaternion: function (e) {
    return new Quaternion(-e.x, -e.z, e.y, -e.w).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), MathUtils.degToRad(90)))
  },
  toVisionQuaternion: function (e) {
    const t = new Quaternion(e.x, e.y, e.z, e.w).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(-90)))
    return t.set(t.x, -t.z, t.y, t.w), t
  },
  toVisionCameraQuaternion: function (e) {
    return new Quaternion(e.x, -e.z, e.y, e.w).multiply(new Quaternion(-0.70710678118, 0, 0, 0.70710678118))
  }
}
/**
 * 对数字进行四舍五入到指定的小数位数
 * @param e
 * @param t
 * @returns
 */
export const roundToDecimalPlaces = function (e, t) {
  const n = Math.pow(10, t)
  return Math.round(e * n) / n
}
/**
 * 将数值限制在指定的范围内，使用阈值进行限制
 * @param e
 * @param t
 * @param n
 * @returns
 */
export function clampValueWithThreshold(e, t, n) {
  return Math.abs(t - e) <= n ? t : e + Math.sign(t - e) * n
}
/**
 * 计算两个四元数之间的夹角
 */
export const calculateQuaternionAngle = function (e: Quaternion, t: Quaternion) {
  const n = new Vector3(0, 0, -1)
  return n.clone().applyQuaternion(e).angleTo(n.clone().applyQuaternion(t))
}
/**
 * 从相机矩阵创建一个视锥体
 */
export const createFrustumFromMatrix = (() => {
  const e = new MatrixBase()
  const t = new Frustum()
  return (n, i, s, r?) => (
    (r = r || t),
    e.identity().makeRotationFromQuaternion(i).setPosition(n),
    e.getInverse(e),
    e.premultiply(s.asThreeMatrix4()),
    r.setFromProjectionMatrix(e.asThreeMatrix4()),
    r
  )
})()
/**
 * 检查视锥体是否与盒子相交
 */
export const checkFrustumIntersectsBox = (e, t, n, i) => createFrustumFromMatrix(e, t, n).intersectsBox(i)
/**
 * 从盒子中创建一个球形
 * @param e
 * @returns
 */
export const createSphereFromBox = (e: Box3) => {
  const t = e.getSize(new Vector3())
  const n = Math.max(t.x, t.y, t.z)
  return new Box3().setFromCenterAndSize(e.getCenter(new Vector3()), new Vector3(n, n, n))
}
/**
 * 线性插值
 * @param e
 * @param t
 * @param n
 * @param i
 * @param s
 * @returns
 */
export const lerp = (e: number, t: number, n: number, i: number, s: number) => (s - i) * ((e - t) / (n - t)) + i
/**
 * 检查线性插值的结果是否在指定的阈值内
 * @param e
 * @param t
 * @param n
 * @param i
 * @param s
 * @returns
 */
export const checkLerpThreshold = (e: number, t: number, n: number, i: number, s: number) => {
  const r = lerp(e, t, n, i, s)
  return CheckThreshold(r, i, s)
}
/**
 * 检查四元数是否为零
 * @param e
 * @returns
 */
function isQuaternionZero(e: Quaternion) {
  return 0 === e.x && 0 === e.y && 0 === e.z
}
/**
 * 从四元数创建一个旋转矩阵
 */
export const createRotationMatrixFromQuaternion = (() => {
  const e = new Vector3(),
    t = new Matrix4()
  return (n: Quaternion) =>
    isQuaternionZero(n)
      ? n.clone()
      : (e.copy(DirectionVector.FORWARD).applyQuaternion(n), t.lookAt(DirectionVector.ZERO, e, DirectionVector.UP), new Quaternion().setFromRotationMatrix(t))
})()
/**
 * 从四元数创建一个旋转矩阵
 */
export const copyRotationMatrixFromQuaternion = (() => {
  const e = new Vector3(),
    t = new Matrix4()
  return (n, i) =>
    isQuaternionZero(n)
      ? i.copy(n)
      : (e.copy(DirectionVector.FORWARD).applyQuaternion(n).setY(0).normalize(),
        t.lookAt(DirectionVector.ZERO, e, DirectionVector.UP),
        i.setFromRotationMatrix(t))
})()
/**
 * 在射线上指定距离处获取点
 */
export const getPointOnRay = (() => {
  const e = new Vector3(),
    t = new Ray()
  return (n, i, r, a = new Vector3()) => (t.origin.copy(n), t.lookAt(i), a.copy(t.at(r, e)))
})()
/**
 * 在射线上指定距离处获取点
 */
export const getPointOnRayForVR = (() => {
  const e = new Vector3(),
    t = new Ray()
  return (n, i, r, a = new Vector3()) => (t.set(n, i), a.copy(t.at(r, e)))
})()
/**
 * 检查两条线段是否相交，并返回交点
 * @param e
 * @param t
 * @param n
 * @param i
 * @param s
 * @param r
 * @param a
 * @param o
 * @param l
 * @returns
 */
export function checkLineSegmentsIntersection(e, t, n, i, s, r, a, o, l) {
  if ((e === n && t === i) || (s === a && r === o)) return !1
  const c = (o - r) * (n - e) - (a - s) * (i - t)
  if (0 === c) return !1
  const d = ((a - s) * (t - r) - (o - r) * (e - s)) / c,
    u = e + d * (n - e),
    h = t + d * (i - t)
  return l && l.set(u, h), !0
}
/**
 * 检查两条线段是否在一定范围内相交，并返回交点和参数值。
 * @param e
 * @param t
 * @param n
 * @param i
 * @param s
 * @param r
 * @param a
 * @param o
 * @param l
 * @param c
 * @returns
 */
export function checkLineSegmentsIntersectionParam(e, t, n, i, s, r, a, o, l = 0, c?) {
  if ((e === n && t === i) || (s === a && r === o)) return null
  const d = (o - r) * (n - e) - (a - s) * (i - t)
  if (0 === d) return null
  const u = ((a - s) * (t - r) - (o - r) * (e - s)) / d,
    h = ((n - e) * (t - r) - (i - t) * (e - s)) / d,
    p = 1 - l
  if (u < l || u > p || h < l || h > p) return null
  const m = e + u * (n - e),
    f = t + u * (i - t)
  return c && c.set(m, f), u
}
