import { MathUtils, Vector2, Vector3 } from "three"
import { checkLineSegmentsIntersection } from "./2569"
import { DirectionVector } from "../webgl/vector.const"
import { RoomWall } from "../webgl/room.wall"
import { RoomBoundData } from "../data/room.bound.data"
import { RbushBboxNode } from "../webgl/rbushBbox.node"
class VectorPair {
  primary: Vector3
  bevel: Vector3
  constructor() {
    this.primary = new Vector3()
    this.bevel = new Vector3()
  }
  set(x: number, y: number, z: number) {
    this.primary.set(x, y, z)
    this.bevel.set(x, y, z)
  }
  copy(e: Vector3, t?: Vector3) {
    this.primary.copy(e)
    t ? this.bevel.copy(t) : this.bevel.copy(e)
  }
}
/**
 * 计算给定节点的左右邻居的路径向量
 */
export const calculateWallNeighborsVectors = (() => {
  const e = { fromLeft: new VectorPair(), fromRight: new VectorPair(), toLeft: new VectorPair(), toRight: new VectorPair() }
  return (t: RoomWall, o: RoomBoundData) => {
    setPathBias(t, e)
    const s = o.getWallNeighbors(t, "from")
    const n = o.getWallNeighbors(t, "to")
    return (
      s && (adjustPathForIntersection(t, s.left, "from", "left", e.fromLeft), adjustPathForIntersection(t, s.right, "from", "right", e.fromRight)),
      n && (adjustPathForIntersection(t, n.left, "to", "left", e.toLeft), adjustPathForIntersection(t, n.right, "to", "right", e.toRight)),
      e
    )
  }
})()
/**
 * 计算两个节点之间的路径向量，包括左右两侧
 */
export const calculatePathVectors = (() => {
  const e = { start: new Vector3(), end: new Vector3() }
  const t = { fromLeft: new VectorPair(), fromRight: new VectorPair(), toLeft: new VectorPair(), toRight: new VectorPair() }
  return (o: RoomWall, s: RoomWall, n: RoomWall, i: boolean) => {
    let r, a, l, d, c
    return (
      i
        ? ((r = "right"), (a = "to"), (l = "from"), (d = t.toRight), (c = t.fromRight))
        : ((r = "left"), (a = "from"), (l = "to"), (d = t.fromLeft), (c = t.toLeft)),
      setPathBias(o, t),
      o.id !== s.id && adjustPathForIntersection(o, s, a, r, d),
      adjustPathForIntersection(o, n, l, r, c),
      e.start.copy(d.primary),
      e.end.copy(c.primary),
      e
    )
  }
})()
/**
 * 计算两个节点之间的交点，并调整路径向量
 */
const adjustPathForIntersection = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    o = new Vector3(),
    a = new Vector3(),
    l = new Vector3(),
    d = new Vector3(),
    h = new Vector3(),
    u = new Vector2(),
    p = new Vector2(),
    f = new Vector2(),
    m = new Vector3(),
    w = new Vector3()
  return (n: RoomWall, _: RoomWall, O: "from" | "to", y: "left" | "right", I: VectorPair) => {
    const W = n.getDirection(e).normalize()
    const b = n[O]
    const v = "from" === O ? -1 : 1
    const N = _.getOtherNode(b).getVec3(t).sub(b.getVec3(o)).normalize().multiplyScalar(v)
    const S = W.dot(N)

    if (Math.acos(S) * MathUtils.RAD2DEG < 5) return
    n.getBiasAdjustmentVec(m), _.getBiasAdjustmentVec(w)
    const x = "left" === y ? Math.PI / 2 : -Math.PI / 2,
      R = W.applyAxisAngle(DirectionVector.UP, x)
        .multiplyScalar(n.width / 2)
        .add(m),
      E = N.applyAxisAngle(DirectionVector.UP, x)
        .multiplyScalar(_.width / 2)
        .add(w)
    n.from.getVec3(a).add(R), n.to.getVec3(l).add(R), _.from.getVec3(d).add(E), _.to.getVec3(h).add(E)
    if (checkLineSegmentsIntersection(a.x, a.z, l.x, l.z, d.x, d.z, h.x, h.z, u)) {
      const e = calculateIntersectionParameters(b, n, _, u, f),
        t = e.x > 0 && e.y > 0,
        o = e.x < 0 && e.y < 0
      if (e.x < n.length && e.y < _.length)
        if (t) I.set(u.x, 0, u.y)
        else {
          p.set(b.x + m.x + w.x, b.z + m.z + w.z).distanceTo(u) > 1.2 * Math.max(n.width, _.width) && o
            ? adjustVectorsOnIntersection(b, n, _, R, E, I)
            : I.set(u.x, 0, u.y)
        }
    }
  }
})()
/**
 * 计算交点在两个节点路径上的参数
 */
const calculateIntersectionParameters = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    o = new Vector3(),
    s = new Vector3()
  return (n: RbushBboxNode, i: RoomWall, r: RoomWall, a: Vector2, l: Vector2) => {
    let d = i.getOtherNode(n)
    n.getVec3(o)
    d.getVec3(e).sub(o)
    d = r.getOtherNode(n)
    d.getVec3(t).sub(o)
    s.set(a.x, 0, a.y).sub(o)
    l.set(e.dot(s) / e.length(), t.dot(s) / t.length())
    return l
  }
})()
/**
 * 设置节点的路径向量的偏移
 */
const setPathBias = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    o = new Vector3(),
    s = new Vector3()
  return (n: RoomWall, i: ReturnType<typeof calculateWallNeighborsVectors>) => {
    const r = n.width
    n.getBiasAdjustmentVec(o)
    n.getNormal(e)
      .multiplyScalar(-r / 2)
      .add(o)
    n.getNormal(t)
      .multiplyScalar(r / 2)
      .add(o)
    const a = n.from.getVec3(s).add(t)
    i.fromRight.copy(a)
    const l = n.to.getVec3(s).add(t)
    i.toRight.copy(l)
    const d = n.to.getVec3(s).add(e)
    i.toLeft.copy(d)
    const h = n.from.getVec3(s).add(e)
    i.fromLeft.copy(h)
  }
})()
/**
 * 在检测到交点时，调整路径向量以避免交叉
 */
const adjustVectorsOnIntersection = (() => {
  const e = new Vector3(),
    t = new Vector3(),
    o = new Vector3(),
    s = new Vector3(),
    i = new Vector3()
  return (n, r, a, l, d, h) => {
    const c = r.getOtherNode(n)
    const u = a.getOtherNode(n)
    n.getVec3(t),
      c
        .getVec3(e)
        .sub(t)
        .normalize()
        .multiplyScalar(-r.width / 2),
      u
        .getVec3(o)
        .sub(t)
        .normalize()
        .multiplyScalar(-a.width / 2),
      s.copy(t).add(l).add(e),
      i.copy(t).add(d).add(o),
      h.copy(s, i)
  }
})()

export const T = calculatePathVectors
export const b = calculateWallNeighborsVectors
