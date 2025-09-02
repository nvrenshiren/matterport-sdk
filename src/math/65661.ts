import { isPointWithinSegment } from "./5696"
//闭合线段，确保线段的起点和终点相同。
function closeSegment(e) {
  return (function (e) {
    const t = e[0],
      n = e[e.length - 1]
    return t[0] === n[0] && t[1] === n[1]
  })(e)
    ? e
    : [...e, e[0]]
}
//线段相交，检查两条线段是否相交。
function segmentsIntersect(e, t) {
  const [[n, r], [o, a]] = e,
    [[s, u], [c, l]] = t
  if (n === s && r === u) return !0
  if (o === c && a === l) return !0
  if (isPointWithinSegment(e[0], t) || isPointWithinSegment(e[1], t)) return !0
  if (isPointWithinSegment(t[0], e) || isPointWithinSegment(t[1], e)) return !0
  const d = (l - u) * (o - n) - (c - s) * (a - r)
  if (0 === d) return !1
  const h = r - u,
    p = n - s,
    f = ((c - s) * h - (l - u) * p) / d,
    m = ((o - n) * h - (a - r) * p) / d
  return f > 0 && f < 1 && m > 0 && m < 1
}
//点在多边形内，检查一个点是否位于多边形内部
function isPointInsidePolygon(e, t) {
  let n = !1
  const a = closeSegment(t)
  for (let t = 0, r = a.length - 1; t < r; t++) {
    const r = a[t],
      s = a[t + 1]
    if (segmentsIntersect(e, [r, s]) || (isPointWithinSegment(r, e) && isPointWithinSegment(s, e))) {
      n = !0
      break
    }
  }
  return n
}
//点在边上，使用射线法检查点是否在多边形的边上。
function isPointOnEdge(e, t) {
  let n = e[0],
    r = e[1],
    i = !1
  for (let e = 0, o = t.length - 1; e < t.length; o = e++) {
    const a = t[e][0],
      s = t[e][1],
      u = t[o][0],
      c = t[o][1]
    s > r != c > r && n < ((u - a) * (r - s)) / (c - s) + a && (i = !i)
  }
  return i
}
//线段在多边形内，检查一个线段是否完全位于多边形内部。
export function isSegmentInsidePolygon(e, t) {
  let n = !0
  const i = closeSegment(e)
  for (let e = 0, r = i.length - 1; e < r; e++) {
    const r = i[e]
    if (!isPointOnEdge(r, t)) {
      n = !1
      break
    }
    if (isPointInsidePolygon([r, i[e + 1]], t)) {
      n = !1
      break
    }
  }
  return n
}
