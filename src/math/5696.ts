function calculateDistance(e: number[][]) {
  return Math.sqrt(Math.pow(e[1][0] - e[0][0], 2) + Math.pow(e[1][1] - e[0][1], 2))
}
export function isPointWithinSegment(point: number[], segment: number[][], tolerance = 0) {
  const i = calculateDistance(segment)
  return (
    (function (e, t, n = 0) {
      var r, i, o
      return Math.abs(((r = e), (i = t[0]), (o = t[1]), (r[0] - o[0]) * (i[1] - o[1]) - (r[1] - o[1]) * (i[0] - o[0]))) <= n
    })(point, segment, tolerance) &&
    calculateDistance([segment[0], point]) <= i &&
    calculateDistance([segment[1], point]) <= i
  )
}

export const s8 = isPointWithinSegment
