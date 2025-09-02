export const CheckThreshold = function (e: number, t: number, n: number) {
  return Math.max(t, Math.min(e, n))
}
