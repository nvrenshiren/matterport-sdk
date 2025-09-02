import { Vector2, Vector3 } from "three"
import * as n from "../const/75668"
export class RbushBboxNode {
  rbushBbox: { minX: number; minY: number; maxX: number; maxY: number }
  overlapsCircle: (t: Vector3, o: number) => number | null
  overlapsLine: (t: Vector3, o: Vector3) => Array<{ entity: RbushBboxNode; t: number }>
  id: string
  floorId: string
  x: number
  z: number
  constructor(e, t, o, n) {
    this.rbushBbox = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
    this.overlapsCircle = (() => {
      const e = new Vector3()
      return (t, o) => {
        const s = this.getVec3(e).distanceTo(t)
        return s <= o + 0.3 ? s : null
      }
    })()
    this.overlapsLine = (() => {
      const e = new Vector3()
      const t = new Vector3()
      const o = new Vector3()
      return (s, n) => {
        const i = e.subVectors(n, s),
          r = this.getVec3(o),
          a = t.subVectors(r, s),
          l = a.dot(i) / i.length(),
          d = a.length()
        return Math.sqrt(d * d - l * l) < 0.3 ? [{ entity: this, t: l / i.length() }] : []
      }
    })()
    this.id = e
    this.floorId = t
    this.x = o
    this.z = n
  }
  getEntityAnalytic() {
    return "node"
  }
  getPoint() {
    return { x: this.x, z: this.z }
  }
  getVec3(e = new Vector3()) {
    return e.set(this.x, 0, this.z), e
  }
  getVec2(e = new Vector2()) {
    return e.set(this.x, this.z), e
  }
  getViewCenter(e = new Vector3()) {
    return this.getVec3(e)
  }
  getSnapshot() {
    return { x: this.x, y: -this.z }
  }
  distanceTo(e) {
    const t = this.x - e.x
    const o = this.z - e.z
    return Math.sqrt(t * t + o * o)
  }
  updateRBushBBox() {
    this.rbushBbox = { minX: this.x - n.dt, minY: this.z - n.dt, maxX: this.x + n.dt, maxY: this.z + n.dt }
  }
  get minX() {
    return this.rbushBbox.minX
  }
  get maxX() {
    return this.rbushBbox.maxX
  }
  get minY() {
    return this.rbushBbox.minY
  }
  get maxY() {
    return this.rbushBbox.maxY
  }
}
