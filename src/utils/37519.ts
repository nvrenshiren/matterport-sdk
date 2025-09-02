export function isRealNumber(e) {
  return "number" == typeof e && !isNaN(e)
}
export function getMin(e: number, min: number, max: number) {
  return Math.max(min, Math.min(e, max))
}
