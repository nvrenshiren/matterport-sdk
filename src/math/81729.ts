import * as l from "./2569"
import * as o from "../const/21646"

import { Euler, Line3, MathUtils, Matrix4, Plane, Quaternion, Ray, Vector2, Vector3, Vector4 } from "three"
import { CheckThreshold } from "../utils/49827"
import { CameraRigConfig } from "../utils/camera.utils"
import { MatrixBase } from "../webgl/matrix.base"
import { DirectionVector } from "../webgl/vector.const"
import { calculatePitchAngle } from "./59370"
import { smoothCurve } from "./66372"
import { copyRotationMatrixFromQuaternion } from "./2569"
/**
 * 检查投影矩阵是否表示正交投影
 * @param e
 * @returns
 */
export const isProjectionOrtho = (e: MatrixBase) => !!e && 1 === e.elements[15]

/**
 *  检查是否为透视投影
 * @param e
 * @returns
 */
export const isPerspectiveProjection = e => !!e && e.elements[15] > 0 && e.elements[15] < 1
/**
 * 限制向量长度
 */
export const clampVectorLength = (() => {
  const e = new Vector3()
  return (t: Vector3, n: Vector3, i: number, s: number) => (e.copy(t).sub(n), e.clampLength(i, s), n.clone().add(e))
})()
/**
 * 调整向量角度
 */
export const adjustVectorAngle = (() => {
  const e = new Vector3()
  return (t, n, i, s) => {
    e.copy(n).sub(t)
    const r = Math.atan2(Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.z, 2)), e.y),
      a = Math.min(Math.max(i, r), s)
    return Math.abs(r - a) > Number.EPSILON ? rotateVectorByAngle(t, n, r - a, !1) : t
  }
})()
/**
 * 根据角度旋转向量
 */
export const rotateVectorByAngle = (() => {
  const e = new Vector3(),
    t = new Vector3()
  return (n, i, s, a) => (
    e.copy(i).sub(n),
    a
      ? t.copy(DirectionVector.UP)
      : t
          .copy(e)
          .applyAxisAngle(DirectionVector.UP, (-1 * Math.PI) / 2)
          .setY(0)
          .normalize(),
    e.applyAxisAngle(t, s),
    i.clone().sub(e)
  )
})()
/**
 * 从两个向量获取四元数
 */
export const getQuaternionFromVectors = (() => {
  const e = new Vector3(),
    t = new Vector3()
  return (n, s, r) => (e.copy(n).sub(s).normalize(), t.copy(n).sub(r).normalize(), new Quaternion().setFromUnitVectors(e, t))
})()
/**
 * 获取旋转四元数
 */
export const getRotationQuaternion = (() => {
  const e = new MatrixBase()
  return (t: Vector3, n: Vector3) => (e.setPosition(t), e.lookAt(t, n, DirectionVector.UP), new Quaternion().setFromRotationMatrix(e.asThreeMatrix4()))
})()
/**
 *  根据角度计算向量
 */
export const calculateVectorFromAngle = (() => {
  const e = new Vector3()
  return (t: Quaternion, n: Vector3, i: number) => (
    e.copy(DirectionVector.FORWARD).applyQuaternion(t).normalize(),
    e
      .clone()
      .multiplyScalar(-1 * i)
      .add(n)
  )
})()
/**
 * 计算射线与平面的交点
 */
export const calculateRayIntersection = (() => {
  const e = new Ray(),
    t = new Vector3(),
    n = new Vector3()
  return (i, s, a) => (n.set(0, 0, 0), t.copy(DirectionVector.FORWARD).applyQuaternion(s), e.set(i, t), e.intersectPlane(a, n))
})()
/**
 * 计算相机的位置和旋转
 */
export const calculateCameraPositionAndRotation = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    n = new Vector3(),
    s = new Vector3(),
    a = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()],
    o = new Vector3(),
    c = new Vector3(),
    d = new Vector3(),
    u = new Vector3(),
    h = new Plane(),
    p = new Vector3(),
    m = new Ray(),
    f = new Vector3(),
    g = new Vector3()
  return ({ targetPosition: v, targetRotation: y, angleDown: b, box: E, fovY: O, aspectRatio: T }) => {
    const _ = "number" == typeof b ? b : -1 * y.angleTo(copyRotationMatrixFromQuaternion(y, new Quaternion()))
    e.copy(DirectionVector.FORWARD).applyQuaternion(y).setY(0),
      t.copy(e).setY(_).normalize(),
      s
        .copy(t)
        .applyAxisAngle(DirectionVector.UP, -Math.PI / 2)
        .setY(0)
        .normalize(),
      n.copy(s).cross(t).normalize()
    let w = 0
    const A = E.max,
      N = E.min,
      I = [A, N]
    for (let e = 0; e < 2; e++) {
      const t = I[e].x
      for (let e = 0; e < 2; e++) {
        const n = I[e].y
        for (let e = 0; e < 2; e++) {
          const i = I[e].z
          a[w].set(t, n, i), w++
        }
      }
    }
    o.copy(N), d.copy(v).setY(N.y)
    let P = c.copy(o).sub(d).dot(t)
    a.forEach(e => {
      if (e.y === A.y) return
      const n = c.copy(e).sub(d).dot(t)
      n < P && (o.copy(e), (P = n))
    })
    const x = Math.sign(o.dot(s))
    u.copy(o).setX(o.x === A.x ? N.x : A.x),
      Math.sign(u.dot(s)) !== x
        ? h.set(p.set(0, 0, -1 * Math.sign(o.z)), Math.abs(o.z))
        : (u.copy(o).setZ(o.z === A.z ? N.z : A.z), h.set(p.set(-1 * Math.sign(o.x), 0, 0), Math.abs(o.x))),
      m.set(v, f.copy(t).multiplyScalar(-1)),
      m.intersectPlane(h, g)
    const k = Math.min(Math.abs(g && g.dot(t)), P)
    let L = 0,
      C = 0
    a.forEach(function (e) {
      c.copy(e).sub(v)
      const t = Math.abs(c.dot(s)),
        i = Math.abs(c.dot(n))
      t > L && (L = t), i > C && (C = i)
    })
    const D = L / Math.tan((O * T) / 2),
      R = C / Math.tan(O / 2),
      M = Math.max(D, R) + Math.abs(k),
      j = v.clone().add(t.clone().multiplyScalar(1.1 * -M))
    return {
      position: j,
      rotation: getRotationQuaternion(j, v)
    }
  }
})()
/**
 * 屏幕坐标转世界坐标
 */
export const convertScreenToWorldCoordinates = (() => {
  const e = new Matrix4(),
    t = new Vector4()
  return (n, s, r, a, o) => (
    (o = o || new Vector2()),
    e.makeRotationFromQuaternion(r).setPosition(s),
    e.invert(),
    e.premultiply(a.asThreeMatrix4()),
    (t.x = n.x),
    (t.y = n.y),
    (t.z = n.z),
    (t.w = 1),
    t.applyMatrix4(e),
    (t.x /= t.w),
    (t.y /= t.w),
    (t.z /= t.w),
    (t.w = 1),
    (o.x = t.x),
    (o.y = t.y),
    o
  )
})()
/**
 * 计算两个向量之间的角度
 */
export const calculateAngleBetweenVectors = (() => {
  const e = new Vector3()
  return (t: Vector3, n: Vector3, i = DirectionVector.UP) => {
    const s = t.angleTo(n)
    return Math.sign(e.crossVectors(t, n).dot(i)) * s
  }
})()
/**
 * 计算对象的旋转矩阵
 */
export const calculateObjectRotationMatrix = (() => {
  const e = new MatrixBase()
  const t = new Vector3()
  return (n, i, r, a = new MatrixBase()) => (
    n.parent ? n.parent.getWorldPosition(t) : n.getWorldPosition(t),
    a.lookAt(i, t, r),
    //@ts-ignore
    n.parent && a.premultiply(e.getInverse(n.parent.matrixWorld)),
    //@ts-ignore
    a.extractRotation(a),
    a
  )
})()
/**
 * 根据投影矩阵和距离计算视场
 * @param e
 * @param t
 * @param n
 * @param i
 * @param s
 * @returns
 */
export const calculateFieldOfView = (e, t, n, i, s = 1.5) => {
  const r = 1 / e.elements[5]
  if (isProjectionOrtho(e)) return (s * i) / (2 * r)
  const a = t.distanceTo(n),
    o = Math.atan(r)
  return i * (s / (2 * Math.tan(o) * a))
}
/**
 * 根据屏幕宽度计算世界单位
 */
export const calculateWorldUnitsFromScreenWidth = (() => {
  const e = new Vector3(),
    t = new Matrix4()
  return (n: number, i: Matrix4, s: number) => {
    const r = e.set(0, 0, -n).applyMatrix4(i).z
    t.copy(i)
    t.invert()
    e.set(2 / s, 0, r).applyMatrix4(t)
    return e.x
  }
})()
/**
 * 获取投影矩阵的倒数
 * @param e
 * @returns
 */
export const getProjectionMatrixInverse = e => 1 / e.elements[5]
/**
 * 根据视场和距离计算视野宽度
 * @param e
 * @param t
 * @returns
 */
export const calculateViewWidth = (e, t = CameraRigConfig.fov) => e / Math.tan(MathUtils.degToRad(t / 2))
/**
 * 检查两个向量是否几乎平行
 */
export const areVectorsNearlyParallel = (() => {
  const e = new Vector3()
  return (t, n, i) => {
    const s = i.angleTo(DirectionVector.UP),
      a = Math.abs(s - Math.PI)
    return s < 0.2 || a < 0.2 ? (t.quaternion.setFromUnitVectors(DirectionVector.FORWARD, i), !0) : (t.lookAt(e.copy(n).add(i)), !1)
  }
})()
/**
 * 检查向量是否几乎指向下
 */
export const isVectorNearlyDown = (() => {
  const e = new Vector3(),
    t = new Vector3(0, 1, 0)
  return (n, i) => {
    e.set(0, 0, -1).applyQuaternion(n)
    const s = e.angleTo(t),
      r = Math.abs(s - Math.PI)
    return s < i || r < i
  }
})()
/**
 * 根据角度调整四元数
 */
export const adjustQuaternionByAngle = (() => {
  const e = new Vector3(1, 0, 0)
  return (t, n = -45) => {
    const s = n * (Math.PI / 180)
    return isVectorNearlyDown(t, 0.1) ? new Quaternion().setFromAxisAngle(e, s) : t
  }
})()
/**
 * 限制俯仰角度
 */
export const limitPitchAngle = (() => {
  const e = new Quaternion(),
    t = new Euler()
  return (n, i = 35 * MathUtils.DEG2RAD) => {
    const s = calculatePitchAngle(n)
    if (s < i) {
      const r = s - i
      t.set(r, 0, 0), e.setFromEuler(t), n.multiply(e)
    }
    return n
  }
})()
/**
 *  计算相机的碰撞响应
 */
export const calculateCameraCollisionResponse = (() => {
  const e = new Vector3()
  return (t, n, s, r, a) => {
    const l = n.getWorldPosition(e).distanceTo(t),
      c = a.maxSize - (a.maxSize - a.minSize) * smoothCurve(l, a.nearBound, a.farBound),
      d = t.clone().project(n),
      u = new Vector3(r.width / 2, r.height / 2, 1).multiply(d),
      h = new Vector3(c / 2, 0, 0).add(u),
      f = new Vector3(2 / r.width, 2 / r.height, 1).multiply(h).clone().unproject(n).clone().distanceTo(t) * (1 + (a.responsiveness / 100) * (s - 1))
    return CheckThreshold(f, o.Z.epsilon, f)
  }
})()
