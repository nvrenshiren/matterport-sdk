import { Line3, Vector3 } from "three"
import * as a from "../math/2569"
import { WallOpening } from "./80978"
import * as r from "../const/75668"
import { edgeType } from "../const/typeString.const"
import { RbushBboxNode } from "./rbushBbox.node"
import { checkLineSegmentsIntersectionParam } from "../math/2569"

export enum WallType {
  SOLID = "solid-wall",
  DIVIDER = "invisible-wall"
}
export class RoomWall {
  from: RbushBboxNode
  bias: number
  openings: Array<WallOpening>
  _t1: Vector3
  _t2: Vector3
  _rbushBbox: { minX: number; minY: number; maxX: number; maxY: number }
  overlapsCircle: (n: Vector3, r: number) => number | null
  to: RbushBboxNode
  width: number
  overlapsLine: (n: Vector3, h: Vector3) => { entity: any; t: number }[]
  id: string
  type: WallType

  constructor(e, t, o, s, i, r) {
    this.bias = 0.5
    this.openings = []
    this._t1 = new Vector3()
    this._t2 = new Vector3()
    this._rbushBbox = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
    this.overlapsCircle = (() => {
      const e = new Vector3(),
        t = new Vector3(),
        o = new Vector3(),
        s = new Vector3(),
        i = new Vector3()
      return (n, r) => {
        const a = this.getBiasAdjustmentVec(e),
          l = this.from.getVec3(t).add(a),
          d = this.to.getVec3(o).add(a),
          h = s.subVectors(d, l),
          c = h.length(),
          u = i.subVectors(n, l),
          g = u.length(),
          p = h.dot(u) / c,
          f = Math.sqrt(Math.max(g * g - p * p, 0))
        return f <= this.width / 2 + r && p >= -r && p <= c + r ? Math.min(p, f) : null
      }
    })()
    this.overlapsLine = (() => {
      const e = new Vector3(),
        t = new Vector3(),
        o = new Vector3(),
        s = new Vector3(),
        i = new Vector3(),
        r = new Vector3(),
        l = new Vector3(),
        d = new Vector3(),
        h = new Vector3(),
        c = 1e-4
      function u(e, t, o) {
        return h.subVectors(t, e).dot(o) / o.lengthSq()
      }
      return (n, h) => {
        const g = this.getBiasAdjustmentVec(e),
          p = this.from.getVec3(t).add(g),
          f = this.to.getVec3(o).add(g),
          m = s.subVectors(f, p),
          w = r.copy(m).normalize(),
          _ = i.subVectors(h, n),
          O = l.copy(_).normalize(),
          y = w.dot(O)
        if (Math.abs(Math.abs(y) - 1) < c) {
          const e = d.subVectors(n, p),
            t = e.length(),
            o = e.dot(w)
          if (Math.sqrt(Math.abs(t * t - o * o)) < 0.05) {
            const e = c,
              t = 0.9999,
              o = u(n, p, _),
              s = u(n, f, _),
              i = o > t && s > t
            if (!(o < e && s < e) && !i)
              return [
                { entity: this.from, t: o },
                { entity: this.to, t: s }
              ].sort((e, t) => e.t - t.t)
          }
        } else {
          const e = checkLineSegmentsIntersectionParam(n.x, n.z, h.x, h.z, p.x, p.z, f.x, f.z, c)
          if (null != e) return [{ entity: this, t: e }]
        }
        return []
      }
    })()
    this.id = e
    this.type = t
    this.from = o
    this.to = s
    this.width = i
    this.bias = r
  }
  static getCompositeKey(e: string, t: string) {
    const o = [e, t].sort()
    return `${o[0]}:${o[1]}`
  }
  getEntityAnalytic() {
    return this.type
  }
  get floorId() {
    return this.from.floorId
  }
  get compositeKey() {
    return RoomWall.getCompositeKey(this.from.id, this.to.id)
  }
  getOtherNode(e: RbushBboxNode) {
    if (e === this.from) return this.to
    if (e === this.to) return this.from
    throw new Error("WallNode does not belong to edge.")
  }
  hasNodes(e, t) {
    const { from: o, to: s } = this
    return !((e !== o && e !== s) || (t !== o && t !== s))
  }
  getBiasAdjustmentVec(e = new Vector3()) {
    this.getNormal(e)
    const t = (this.bias - 0.5) * this.width
    return e.multiplyScalar(t), e
  }
  getNormal(e = new Vector3()) {
    return this.getDirection(e), e.normalize(), e.set(-e.z, 0, e.x), e
  }
  getDirection(e = new Vector3()) {
    return e.set(this.to.x - this.from.x, 0, this.to.z - this.from.z), e
  }
  getEdgeWidth(e, t) {
    const o = this.from === e && this.to === t ? this.bias : 1 - this.bias
    return this.width * o
  }
  getEdgeNormal(e, t, o = new Vector3()) {
    return this.getNormal(o), (this.from === e && this.to === t) || o.multiplyScalar(-1), o
  }
  getLine3(e = new Line3()) {
    return this.from.getVec3(e.start), this.to.getVec3(e.end), e
  }
  getProjection(e: Vector3) {
    const t = this._t1.copy(e).sub(this.from.getVec3(this._t2)),
      o = this.getDirection(this._t2)
    return t.dot(o) / o.length()
  }
  getSnapshot() {
    const e = {
      thickness: this.width,
      vertices: [this.from.id, this.to.id],
      type: this.type === WallType.SOLID ? edgeType.WALL : edgeType.INVISIBLE,
      openings: undefined as any
    }
    if (this.openings.length) {
      const t = {}
      for (const e of this.openings) t[e.id] = e.getSnapshot()
      e.openings = t
    }
    return e
  }
  getViewCenter(e = new Vector3()) {
    return e.addVectors(this.to.getVec3(), this.from.getVec3()).multiplyScalar(0.5)
  }
  get length() {
    return this.from.distanceTo(this.to)
  }
  get minX() {
    return this._rbushBbox.minX
  }
  get maxX() {
    return this._rbushBbox.maxX
  }
  get minY() {
    return this._rbushBbox.minY
  }
  get maxY() {
    return this._rbushBbox.maxY
  }
  updateRBushBBox() {
    this._rbushBbox = {
      minX: Math.min(this.from.x, this.to.x) - 2 * this.width - r.dt,
      minY: Math.min(this.from.z, this.to.z) - 2 * this.width - r.dt,
      maxX: Math.max(this.from.x, this.to.x) + 2 * this.width + r.dt,
      maxY: Math.max(this.from.z, this.to.z) + 2 * this.width + r.dt
    }
  }
  clone() {
    const e = new RoomWall(this.id, this.type, this.from, this.to, this.width, this.bias)
    e.openings.push(...this.openings)
    return e
  }
}
