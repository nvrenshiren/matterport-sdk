import * as i from "../const/36074"
/**
 * 根据长度计算角度
 * @param e
 * @returns
 */
export function calculateAngleFromLength(e: number) {
  return Math.atan(e / i.U_)
}
/**
 * 根据角度计算长度
 * @param e
 * @returns
 */
export function calculateLengthFromAngle(e: number) {
  return i.U_ * Math.tan(e)
}
