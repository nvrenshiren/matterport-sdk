export function smoothCurve(e: number, t: number, n: number) {
  return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t)) * e * (3 - 2 * e)
}
