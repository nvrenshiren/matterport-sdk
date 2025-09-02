import { BackSide, DoubleSide, Intersection, Mesh, Raycaster, Triangle, Vector2, Vector3 } from "three"
const i = new Vector3()
const s = new Vector3()
const o = new Vector3()
const a = new Vector2()
const c = new Vector2()
const l = new Vector2()
const h = new Vector3()
/**
 * 计算射线与三角形的交点
 * @param t
 * @param e
 * @param n
 * @param u
 * @param d
 * @param f
 * @param p
 * @returns
 */
function calculateRayTriangleIntersection(t, e, n, u, d, f, p) {
  i.fromBufferAttribute(e, u), s.fromBufferAttribute(e, d), o.fromBufferAttribute(e, f)
  const g = (function (t, e, n, i, s, o) {
    let a
    return (
      (a = o === BackSide ? t.intersectTriangle(i, n, e, !0, s) : t.intersectTriangle(e, n, i, o !== DoubleSide, s)),
      null === a ? null : { distance: t.origin.distanceTo(s), point: s.clone() }
    )
  })(t, i, s, o, h, p)
  if (g) {
    n && (a.fromBufferAttribute(n, u), c.fromBufferAttribute(n, d), l.fromBufferAttribute(n, f), (g.uv = Triangle.getUV(h, i, s, o, a, c, l, new Vector2())))
    const t = { a: u, b: d, c: f, normal: new Vector3(), materialIndex: 0 }
    Triangle.getNormal(i, s, o, t.normal), (g.face = t), (g.faceIndex = u)
  }
  return g
}
/**
 * 获取特定三角形的交点
 * @param t
 * @param e
 * @param n
 * @param r
 * @param i
 * @returns
 */
function getIntersectionForTriangle(t, e, n, r: number, i?: any[]) {
  const s = 3 * r,
    o = t.index.getX(s),
    a = t.index.getX(s + 1),
    c = t.index.getX(s + 2),
    l = calculateRayTriangleIntersection(n, t.attributes.position, t.attributes.uv, o, a, c, e)
  return l ? ((l.faceIndex = r), i && i.push(l), l) : null
}
/**
 * 计算网格所有三角形的交点
 * @param t
 * @param e
 * @param n
 * @param r
 * @param i
 * @param s
 */
export function calculateIntersectionsForMesh(t, e, n, r, i, s) {
  for (let o = r, a = r + i; o < a; o++) getIntersectionForTriangle(t, e, n, o, s)
}
/**
 * 获取最近交点
 * @param t
 * @param e
 * @param n
 * @param r
 * @param i
 * @returns
 */
export function getClosestIntersection(t, e, n, r: number, i: number) {
  let s = 1 / 0
  let o: ReturnType<typeof getIntersectionForTriangle> = null
  for (let a = r, c = r + i; a < c; a++) {
    const r = getIntersectionForTriangle(t, e, n, a)
    r && r.distance < s && ((o = r), (s = r.distance))
  }
  return o
}
/**
 * 将交点调整到世界坐标系
 * @param t
 * @param e
 * @param n
 * @returns
 */
export function adjustIntersectionToWorld(t: Intersection, e: Mesh, n: Raycaster) {
  return null === t
    ? null
    : (t.point.applyMatrix4(e.matrixWorld),
      (t.distance = t.point.distanceTo(n.ray.origin)),
      (t.object = e),
      t.distance < n.near || t.distance > n.far ? null : t)
}
