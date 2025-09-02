import { MathUtils, Vector2, Vector3 } from "three"
import { CameraData } from "../data/camera.data"
import { getScreenAndNDCPosition } from "./59370"
const a = new Vector2()
const r = new Vector3()
const h = new Vector2()
const d = new Vector2()
/**
 * 计算屏幕数据，包括屏幕位置、像素距离和旋转角度
 * @param t
 * @param e
 * @param i
 * @returns
 */
export const calculateScreenData = (t: Vector3, e: Vector3, i: CameraData) => {
  const s = ((t, e, i) => (
    getScreenAndNDCPosition(i, t, h), getScreenAndNDCPosition(i, e, d), { pixelDistance: h.distanceTo(d), startScreenPosition: h, endScreenPosition: d }
  ))(t, e, i)
  return {
    screenPosition: ((t, e, i) => (r.copy(t).add(e).multiplyScalar(0.5), getScreenAndNDCPosition(i, r, a), a))(t, e, i),
    rotation: calculateAngle(h, d),
    pixelDistance: s.pixelDistance,
    startScreenPosition: s.startScreenPosition,
    endScreenPosition: s.endScreenPosition
  }
}
/**
 * 计算角度，根据两点的屏幕坐标计算旋转角度
 * @param t
 * @param e
 * @returns
 */
const calculateAngle = (t, e) => {
  const i = t.y - e.y,
    s = t.x - e.x
  let o = Math.atan2(i, s) * MathUtils.RAD2DEG
  return (o = o >= 90 || o <= -90 ? o + 180 : o), o
}
/**
 * 计算矩形尺寸，根据给定的参数确定矩形的宽度和高度
 * @param t
 * @param e
 * @param i
 * @returns
 */
export const calculateRectangleSize = (t: number, e = 10, i = 40) => ({ width: Math.max(9 * Math.max(t, 2) + e, i), height: 18 + e })
