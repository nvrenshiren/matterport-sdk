import { Color, Vector4 } from "three"
import { fillZeroForNumber } from "./func.utils"
const randomNumber = () => Math.random()
const i: Record<string, Vector4> = {}
export const randomColorMap = (e: number, t = randomNumber()) => (i[t] || (i[t] = new Vector4(randomNumber(), randomNumber(), randomNumber(), e)), i[t])
export const randomColor = () => new Color(randomNumber(), randomNumber(), randomNumber())
export const isColor = e => e instanceof Object && "r" in e && "g" in e && "b" in e
export function buildColorString(e: { r: number; g: number; b: number }) {
  return `#${fillZeroForNumber(255 * e.r, 2, "0", 16)}${fillZeroForNumber(255 * e.g, 2, "0", 16)}${fillZeroForNumber(255 * e.b, 2, "0", 16)}`
}
