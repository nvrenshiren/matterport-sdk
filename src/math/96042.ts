import { MathUtils } from "three"
import * as r from "../const/14439"
import { lerp } from "./2569"
/**
 * 在给定范围内进行插值计算
 * @param e
 * @returns
 */
export const interpolateValue = e => {
  let t = r.Im
  if (!isNaN(e)) {
    const n = Math.min(Math.max(r.OJ, e), r.BY)
    t = lerp(n, r.OJ, r.BY, r.LO, r.Qo)
  }
  return t
}
/**
 * 先限制值的范围，然后进行插值计算
 * @param e
 * @returns
 */
export const clampAndInterpolate = e => lerp(e, r.LO, r.N5, r.OJ, r.BY)
/**
 * 限制值在指定的最小值和最大值之间
 * @param e
 * @returns
 */
export const clampValue = (e: number) => Math.min(Math.max(r.LO, e), r.N5)
/**
 * 角度转换为弧度
 * @param e
 * @returns
 */
export const convertDegreesToRadians = (e: number) => MathUtils.degToRad(e) / 1000

export const mf = clampValue
