export function isPointInPolygon(e, t) {
  let o,
    s,
    n = t[t.length - 1],
    i = 0
  for (let r = 0; r < t.length; ++r)
    (o = n),
      (n = t[r]),
      (o.y <= e.y && n.y <= e.y) ||
        (o.y > e.y && n.y > e.y) ||
        (o.x < e.x && n.x < e.x) ||
        ((s = (e.y - o.y) * (n.x - o.x) - (e.x - o.x) * (n.y - o.y)), n.y < o.y && (s = -s), (i += s > 0 ? 1 : 0))
  return i % 2 == 1
}
