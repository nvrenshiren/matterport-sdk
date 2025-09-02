import { CurveUtil } from "./curve.utils"
export const easeLiner = (e: number, t: number, n: number, i: number) => {
  return (n * e) / i + t
}
export const easeInQuad = (e: number, t: number, n: number, i: number) => {
  return n * (e /= i) * e + t
}
export const easeOutQuad = (e: number, t: number, n: number, i: number) => {
  return -n * (e /= i) * (e - 2) + t
}
export const easeInOutQuad = (e: number, t: number, n: number, i: number) => {
  return (e /= i / 2) < 1 ? (n / 2) * e * e + t : (-n / 2) * (--e * (e - 2) - 1) + t
}
export const easeInCubic = (e: number, t: number, n: number, i: number) => {
  return n * (e /= i) * e * e + t
}
export const easeOutCubic = (e: number, t: number, n: number, i: number) => {
  return (e /= i), n * (--e * e * e + 1) + t
}
export const easeInOutCubic = (e: number, t: number, n: number, i: number) => {
  return (e /= i / 2) < 1 ? (n / 2) * e * e * e + t : (n / 2) * ((e -= 2) * e * e + 2) + t
}
export const easeInOutSine = (e: number, t: number, n: number, i: number) => {
  return (-n / 2) * (Math.cos((Math.PI * e) / i) - 1) + t
}
export const easeOutExpo = (e: number, t: number, n: number, i: number) => {
  return n * (1 - Math.pow(2, (-10 * e) / i)) + t
}
export const easeInOutExpo = (e: number, t: number, n: number, i: number) => {
  return (e /= i / 2) < 1 ? (n / 2) * Math.pow(2, 10 * (e - 1)) + t : (e--, (n / 2) * (2 - Math.pow(2, -10 * e)) + t)
}

export function easePitchFactor(e, t, n, i) {
  const r = new CurveUtil(e, t, n, i)
  return e => r.solve(e)
}
export const easeQuadratic = (e: number, t: number, n: number, i: number) => {
  return -4 * n * Math.pow(e / i - (0.5 + t), 2) + 1
}
export const conditionalEase = (e, t, n, i, s) => {
  let r = t
  if (s > 0) {
    const t = (1 - Math.max(s, 0)) * Math.abs(i)
    r = n <= t ? 0 : e(n - t, 0, 1, t)
  }
  return r
}
export function createEaseFunction(e, t, n, i) {
  const r = new CurveUtil(e, t, n, i)
  return (e, t, n, i) => {
    const s = e / i
    return t + n * r.solve(s)
  }
}
