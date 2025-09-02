import { Box3, BufferAttribute, BufferGeometry, PlaneGeometry, Sphere, Triangle, Vector3 } from "three"
import { DirectionVector } from "./vector.const"
export function mergeGeometries(e: BufferGeometry[]) {
  if (0 === e.length) throw Error("Can't merge empty list of geometries")
  if (1 === e.length) return e[0]
  let t = 0,
    n = 0,
    s = 0,
    r = 0
  const o = new Box3()
  for (const i of e) {
    if (i.index) {
      t += i.index.count
      n += i.getAttribute("position").count
      i.getAttribute("uv") && (s += i.getAttribute("uv").count)
      i.boundingBox && (o.union(i.boundingBox), r++)
    }
  }

  const c = new BufferGeometry()
  r !== e.length || o.isEmpty() ? c.computeBoundingBox() : (c.boundingBox = o)
  o.copy(getBoundingBox(c))
  c.boundingSphere = o.getBoundingSphere(new Sphere())
  const d = appendAttributeData(new Float32Array(3 * n), "position", e)
  c.setAttribute("position", new BufferAttribute(d, 3))
  const u = (function (e, t) {
    let n = 0,
      i = 0
    for (const s of t) {
      const t = s.index
      for (let s = 0; s < t!.array.length; s++) e[n + s] = t!.array[s] + i
      n += t!.array.length
      i += s.getAttribute("position").count
    }
    return e
  })(new Uint32Array(t), e)
  c.setIndex(new BufferAttribute(u, 1))
  if (s) {
    const t = appendAttributeData(new Float32Array(2 * s), "uv", e)
    c.setAttribute("uv", new BufferAttribute(t, 2))
  }
  return c
}
function appendAttributeData(e: Float32Array, t: string, n: BufferGeometry[]) {
  let i = 0
  for (const s of n) {
    const n = s.getAttribute(t) as BufferAttribute
    e.set(n.array, i)
    i += n.array.length
  }
  return e
}
const defaultBoundingBox = new Box3(DirectionVector.ZERO, DirectionVector.UNIT)
export function getBoundingBox(e: BufferGeometry) {
  e.boundingBox || e.computeBoundingBox()
  return e.boundingBox || defaultBoundingBox
}
export function getHitPointInfo(e: BufferGeometry, t: Vector3) {
  let n = 1 / 0
  const s = t.clone(),
    r = new Vector3(),
    a = new Vector3(1 / 0, 1 / 0, 1 / 0)
  let o = -1
  const l = new Triangle()
  ;(function (e, t) {
    var n
    const i = e.index?.array
    const s = e.getAttribute("position") as BufferAttribute
    if (!s) return
    const r =
      e.groups.length > 0
        ? e.groups
        : [
            {
              start: 0,
              count: i ? i.length : s.count,
              materialIndex: 0
            }
          ]
    let a = 0
    for (const e of r) {
      for (let n = e.start; n < e.start + e.count; n += 3) {
        let r = n,
          o = n + 1,
          l = n + 2
        i && ((r = i[r]), (o = i[o]), (l = i[l])), t(s.getX(r), s.getY(r), s.getZ(r), s.getX(o), s.getY(o), s.getZ(o), s.getX(l), s.getY(l), s.getZ(l), a++)
      }
    }
  })(e, (e, t, i, c, d, u, h, p, m, f) => {
    l.a.set(e, t, i)
    l.b.set(c, d, u)
    l.c.set(h, p, m)
    l.closestPointToPoint(s, r)
    const g = s.distanceToSquared(r)
    g < n && (a.copy(r), (n = g), (o = f))
  })
  return {
    point: a,
    distance: Math.sqrt(n),
    faceIndex: o
  }
}
const planeGeometry = new PlaneGeometry(1, 1)
export function getPlaneGeometry() {
  return planeGeometry
}
