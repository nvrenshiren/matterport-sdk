import polylabel from "polylabel"
import { Box2, ShapeUtils, Vector2, Vector3 } from "three"
import * as h from "../other/62944"
import * as g from "../const/75668"
import * as d from "../const/78283"
import { calculatePathVectors } from "../math/19098"
import { UnitTypeKey } from "../utils/unit.utils"
import * as c from "./58353"
import { RbushBboxNode } from "./rbushBbox.node"
import { RoomWall } from "./room.wall"
import { ADDSets, MergeSets } from "./58353"

export enum LocationType {
  INDOOR = "indoor",
  OUTDOOR = "outdoor"
}
export enum NoneType {
  HIDE = "hide",
  INDOOR = "indoor",
  NON_AREA = "nonArea",
  OUTDOOR = "outdoor"
}
export class Room {
  id: string
  holes: Set<RoomWall>[]
  showDimensions: boolean
  showHeight: boolean
  walls: Set<RoomWall>
  width: number
  length: number
  area: any
  perimeter: number
  l1: Vector2
  l2: Vector2
  w1: Vector2
  w2: Vector2
  height: number
  minimalInnerEdges: Array<{
    start: Vector3
    end: Vector3
  }>
  classifications: any[]
  wallsCCW: {
    wall: RoomWall
    flipped: boolean
  }[]
  holeWallsCW: {
    wall: RoomWall
    flipped: boolean
  }[][]
  hide: boolean
  includeInAreaCalc: any
  points: RbushBboxNode[]
  holesCW: RbushBboxNode[][]
  name: string
  _bbox: Box2 | null
  _geometry: { faces: number[][]; points: Vector2[] } | null
  keywords: string[]
  location: LocationType

  constructor(e: {
    id: string
    name: string
    points: RbushBboxNode[]
    walls: Set<RoomWall>
    holesCW: RbushBboxNode[][]
    holes: Set<RoomWall>[]
    classifications: any[]
    location: LocationType
    includeInAreaCalc: boolean
    hide: boolean
    keywords: string[]
    height: number | null
  }) {
    this.area = NaN
    this.length = NaN
    this.l1 = new Vector2()
    this.l2 = new Vector2()
    this.width = NaN
    this.w1 = new Vector2()
    this.w2 = new Vector2()
    this.height = NaN
    this.minimalInnerEdges = []
    this.classifications = []
    this.showDimensions = !0
    this.showHeight = !0
    this.wallsCCW = []
    this.holeWallsCW = []
    Object.assign(this, e)
    this.initCCWWalls()
  }
  getEntityAnalytic() {
    return "room"
  }
  get roomTypeIds() {
    return 0 === this.classifications.length ? [g.ub] : this.classifications.map(e => e.id)
  }
  accessible() {
    return !(this.hide && !this.includeInAreaCalc)
  }
  isOther() {
    const e = this.roomTypeIds
    return 1 === e.length && e[0] === g.ub
  }
  get floorId() {
    return this.points[0].floorId
  }
  getSnapshot() {
    return { height: this.height, source: "frontend", vertices: this.points.map(e => e.id), holes: this.holesCW.map(e => e.map(e => e.id)), label: this.name }
  }
  pointsMoved() {
    this._bbox = null
    this._geometry = null
  }
  get bbox() {
    this._bbox = this._bbox || new Box2().setFromPoints(this.points.map(e => e.getVec2()))
    return this._bbox
  }
  getViewCenter(e = new Vector3(), t = 1) {
    const o = this.points.map(e => [e.x / t, e.z])
    o.push([this.points[0].x / t, this.points[0].z])
    const s = [o].concat(this.holesCW.map(e => e.map(e => [e.x / t, e.z]).reverse()))
    const n = polylabel(s, 0.1)
    e.set(n[0] * t, 0, n[1])
    return e
  }
  getArea(e) {
    let t = this.area,
      o = 1
    return e === UnitTypeKey.IMPERIAL ? (t = (0, d.Nv)(t)) : e === UnitTypeKey.METRIC && (o = 10), Math.round(t * o) / o
  }
  getMeasurementText(e) {
    return this.canDisplayDimensions() ? [(0, h.up)(this.width, e), (0, h.up)(this.length, e)].join(` ${h.RQ} `) : ""
  }
  canDisplayDimensions() {
    return !(isNaN(this.length) || isNaN(this.width) || this.length <= 0 || this.width <= 0 || !this.showDimensions)
  }
  canDisplayHeight() {
    return !isNaN(this.height) && this.showHeight
  }
  getPerimeterText(e) {
    return (0, h.up)(this.perimeter, e)
  }

  getCWPoints() {
    return this.points.slice().reverse()
  }
  allWalls() {
    return MergeSets(this.walls, ...this.holes)
  }

  allKeywords() {
    const e = this.keywords.slice()
    return (
      this.hide && e.push(NoneType.HIDE),
      this.includeInAreaCalc || e.push(NoneType.NON_AREA),
      e.push(this.location === LocationType.OUTDOOR ? NoneType.OUTDOOR : NoneType.INDOOR),
      e
    )
  }
  initCCWWalls() {
    const e = new Map<string, RoomWall>()
    for (const t of this.allWalls()) e.set(RoomWall.getCompositeKey(t.from.id, t.to.id), t)
    const t = (t: RbushBboxNode[]) => {
      const o: Array<{ wall: RoomWall; flipped: boolean }> = [],
        s = t.length
      for (let n = 0; n < s; n++) {
        const i = t[n],
          r = t[(n + 1) % s],
          a = RoomWall.getCompositeKey(i.id, r.id),
          l = e.get(a)
        if (l) {
          const e = i.id === l.to.id
          o.push({ wall: l, flipped: e })
        }
      }
      return o
    }
    this.wallsCCW.length = 0
    this.wallsCCW.push(...t(this.points))
    this.holeWallsCW.length = 0
    for (const e of this.holesCW) this.holeWallsCW.push(t(e))
  }
  getGeometry() {
    if (!this._geometry) {
      const e = this.points.map(e => e.getVec2()),
        t = this.holesCW.map(e => e.map(e => e.getVec2())),
        o = ShapeUtils.triangulateShape(e, t)
      this._geometry = { faces: o, points: e.concat(t.flat(1)) }
    }
    return this._geometry
  }
  getInnerLoops() {
    const e: Vector3[][] = [],
      t = (t: Room["wallsCCW"]) => {
        e.push([])
        const o = t.length
        for (let s = 0; s < o; s++) {
          const n = t[(s + o - 1) % o],
            i = t[s],
            r = t[(s + 1) % o],
            a = calculatePathVectors(i.wall, n.wall, r.wall, i.flipped),
            l = e[e.length - 1],
            d = l[l.length - 1],
            h = a.start.clone()
          ;(!d || (d && d.distanceTo(h) > 0.001)) && l.push(h), l.push(a.end.clone())
        }
      }
    t(this.wallsCCW)
    for (const e of this.holeWallsCW) t(e)

    return e
  }
}
export function containsKeyword(e: any[], t: string) {
  return e.length > 0 && (e[0].defaultKeywords || []).includes(t)
}
function filterValidKeywords(e: NoneType[]) {
  return e.filter(e => !Object.values(NoneType).includes(e))
}
export function getRoomConfig(e: NoneType[]) {
  return {
    location: e.includes(NoneType.OUTDOOR) ? LocationType.OUTDOOR : LocationType.INDOOR,
    includeInAreaCalc: !e.includes(NoneType.NON_AREA),
    hide: e.includes(NoneType.HIDE),
    keywords: filterValidKeywords(e)
  }
}
export function extractRoomKeywords(e) {
  const t = new Set<NoneType>()
  for (const o of e) ADDSets(t, o.defaultKeywords || [])
  return t.has(NoneType.INDOOR) && t.has(NoneType.OUTDOOR) && t.delete(NoneType.OUTDOOR), Array.from(t.values())
}
