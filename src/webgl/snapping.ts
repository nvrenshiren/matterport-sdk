import { Box3, Line3, Raycaster, Vector3 } from "three"
export interface RaycastSnappingItem {
  distance: number
  object: SnapLine3 | SnapVector3
  distanceToRay: number
  point: Vector3
  isLineOctreeIntersection: boolean
}
class OctreeRoot {
  raycast: (n: Raycaster, i: number, r: RaycastSnappingItem[], l?: (e) => boolean) => void
  children: Array<Vector3 | Line3 | OctreeRoot>
  level: number
  childNodes: OctreeRoot[]
  bounds: Box3
  constructor(e: Box3, t) {
    this.raycast = (() => {
      const e = new Vector3()
      const t = new Box3()
      return (n, i, r, l) => {
        const c = t.copy(this.bounds).expandByScalar(i)
        if (n.ray.intersectsBox(c))
          for (const t of this.children) {
            if (t instanceof OctreeRoot) t.raycast(n, i, r, l)
            else if (t instanceof SnapLine3) {
              if (!1 === l?.(t)) continue
              const s = e
              const a = n.ray.distanceSqToSegment(t.start, t.end, void 0, e)
              const o = Math.sqrt(a)
              if (o < i) {
                r.push({
                  distance: n.ray.origin.distanceTo(s),
                  object: t,
                  distanceToRay: o,
                  point: s.clone(),
                  isLineOctreeIntersection: !0
                })
              }
            } else if (t instanceof SnapVector3) {
              if (!1 === l?.(t)) continue
              const e = n.ray.distanceToPoint(t)
              if (e < i) {
                r.push({
                  distance: n.ray.origin.distanceTo(t),
                  object: t,
                  distanceToRay: e,
                  point: t.clone(),
                  isLineOctreeIntersection: !0
                })
              }
            }
          }
      }
    })()
    this.level = t
    this.bounds = e.clone()
    this.clear()
  }

  clear() {
    this.childNodes = []
    this.children = []
  }
  add(e: Vector3 | Line3) {
    let t = !1
    const n = e instanceof Line3 ? [e.start, e.end] : [e]
    if (this.level < 4) {
      0 === this.childNodes.length && this.buildChildNodes()
      for (const i of this.childNodes) {
        n.every(e => i.bounds.containsPoint(e)) && ((t = !0), i.add(e))
      }
    }
    t || this.children.push(e)
  }
  remove(e: Vector3 | Line3) {
    const t = e instanceof Line3 ? [e.start, e.end] : [e]
    for (let n = 0; n < this.children.length; n++) {
      const i = this.children[n]
      if (i instanceof OctreeRoot) {
        if (t.every(e => i.bounds.containsPoint(e)) && i.remove(e)) return !0
      } else if (i === e) {
        this.children.splice(n, 1)
        return !0
      }
    }
    return !1
  }
  buildChildNodes() {
    const e = this.bounds.max.clone().sub(this.bounds.min).clone().multiplyScalar(0.5)
    for (let t = 0; t < 2; t++) {
      for (let n = 0; n < 2; n++) {
        for (let r = 0; r < 2; r++) {
          const a = this.bounds.min.x + e.x * r,
            o = a + e.x,
            l = this.bounds.min.y + e.y * t,
            c = l + e.y,
            d = this.bounds.min.z + e.z * n,
            u = d + e.z,
            h = new Box3(new Vector3(a, l, d), new Vector3(o, c, u)),
            p = new OctreeRoot(h, this.level + 1)
          this.childNodes.push(p)
          this.children.push(p)
        }
      }
    }
  }
  spherecast(e, t) {
    if (e.intersectsBox(this.bounds))
      for (const n of this.children)
        if (n instanceof OctreeRoot) n.spherecast(e, t)
        else if (n instanceof SnapLine3) {
          const s = n.closestPointToPoint(e.center, !0, new Vector3())
          s.distanceTo(e.center) < e.radius && t.push(new SnapVector3(s))
        } else n instanceof Vector3 && n.distanceTo(e.center) < e.radius && t.push(n)
  }
  traverse(e: Function) {
    for (const t of this.children) t instanceof OctreeRoot ? t.traverse(e) : e(t)
  }
}
export class SnappingOctree {
  pointCount: number
  lineCount: number
  root: OctreeRoot
  constructor(e: Box3) {
    this.pointCount = 0
    this.lineCount = 0
    this.root = new OctreeRoot(e, 0)
  }
  add(e) {
    e instanceof Line3 ? this.lineCount++ : e instanceof Vector3 && this.pointCount++, this.root.add(e)
  }
  remove(e) {
    e instanceof SnapLine3 ? this.lineCount-- : e instanceof SnapVector3 && this.pointCount--, this.root.remove(e)
  }
  clear() {
    this.root.clear()
    this.pointCount = 0
    this.lineCount = 0
  }
  traverse(e: Function) {
    this.root.traverse(e)
  }
  raycast(e: Raycaster, t: number, n?: (e) => boolean) {
    const i: RaycastSnappingItem[] = []
    this.root.raycast(e, t, i, n)
    return i
  }
}
export class SnapLine3 extends Line3 {
  isSnapLine3: boolean
  meshName: string
  meta: any
  constructor(e: Vector3, t: Vector3) {
    super(e, t)
    this.start = e
    this.end = t
    this.isSnapLine3 = !0
  }
  copy(e: SnapLine3) {
    this.start.copy(e.start)
    this.end.copy(e.end)
    return this
  }
  //@ts-ignore
  clone() {
    return new SnapLine3(this.start, this.end)
  }
}
export class SnapVector3 extends Vector3 {
  meshName: string
  meta: any
  point: Vector3
  isSnapVector3: boolean
  constructor(e: Vector3) {
    super()
    this.point = e
    this.isSnapVector3 = !0
    super.copy(e)
  }
  copy(e: SnapVector3) {
    this.point.copy(e.point)
    return this
  }
  //@ts-ignore
  clone() {
    return new SnapVector3(this.point)
  }
}
