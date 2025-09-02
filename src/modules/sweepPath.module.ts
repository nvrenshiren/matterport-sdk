import { CatmullRomCurve3, Vector3 } from "three"
import * as o from "../webgl/shortest.path"
import { PathSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { SweepsData } from "../data/sweeps.data"
import { RestrictedSweepsMessage, RestrictSweepsSetMessage } from "../message/sweep.message"
import EngineContext from "../core/engineContext"
import { SweepObject } from "../object/sweep.object"
import { findShortestPath, SweepPathStatus } from "../webgl/shortest.path"
const r = Object.freeze({ sweeps: { maxNeighborDistance: 50 } })
declare global {
  interface SymbolModule {
    [PathSymbol]: SweepPathModule
  }
}
export default class SweepPathModule extends Module {
  engine: EngineContext
  sweepData: SweepsData
  validNeighbors: Record<string, SweepObject[]>
  maxNeighborDistance: number
  restrictedSweeps?: string[]
  distanceMap: Record<string, Record<string, number>>
  constructor() {
    super(...arguments)
    this.name = "sweep-path"
  }
  async init(e, t: EngineContext) {
    this.engine = t
    this.sweepData = await t.market.waitForData(SweepsData)
    this.validNeighbors = {}
    this.maxNeighborDistance = e.maxNeighborDistance || r.sweeps.maxNeighborDistance
    this.buildDistanceMap()
  }
  setRestrictedSweeps(e: SweepObject[] | null, t = 0) {
    this.restrictedSweeps = []
    if (e) {
      for (let i = t; i < e.length; i++) this.restrictedSweeps.push(e[i].id)
      this.engine.broadcast(new RestrictSweepsSetMessage(this.restrictedSweeps))
    } else {
      this.restrictedSweeps = void 0
      this.engine.broadcast(new RestrictedSweepsMessage())
    }
  }
  findShortestPath(e: string, t: string, i, n, s, a?, r = 5e3) {
    const d = this.sweepData.getSweep(e)
    const c = this.sweepData.getSweep(t)
    const l = this
    const h = findShortestPath({
      start: d,
      isEnd: e => e === c,
      *neighbors(e) {
        for (const t of e.neighbours) yield l.sweepData.getSweep(t)
      },
      distance: (e, t) => l.getDistance(e.id, t.id),
      heuristic: (e, t) => 1,
      timeout: r
    })
    return h.status === SweepPathStatus.Success && h.path.length < s ? (this.addSweepsNearPath(h.path, i), this.filterCloseSweepsFromPath(h.path, n)) : null
  }
  addSweepsNearPath(e: SweepObject[], t: number) {
    const i = new Vector3()
    const s = new Vector3()
    const a = new Vector3()
    const o = new Vector3()
    const r = new Vector3()
    const d = new Vector3()
    const c: SweepObject[] = []
    const l = new Vector3()
    const h = (e, t, i) => (a.copy(t).sub(e), a.dot(i))
    const u = (e, t) => h(l, e.position, i) - h(l, t.position, i)
    let m = 0
    for (; m < e.length - 1; ) {
      const n = e[m].id,
        h = e[m + 1].id,
        p = this.sweepData.getSweep(n),
        g = this.sweepData.getSweep(h)
      l.copy(p.position), (c.length = 0), i.copy(g.position).sub(l).normalize()
      const v = this.findConnectedSweeps(p, this.maxNeighborDistance),
        y = this.findConnectedSweeps(g, this.maxNeighborDistance),
        f = v.concat(y)
      for (const e of f) {
        const n = a.copy(e.position).sub(l).dot(i)
        if (n > 0) {
          r.copy(i), r.multiplyScalar(n), o.copy(a), o.sub(r)
          if (o.length() < t) {
            s.copy(i).negate(), d.copy(e.position).sub(g.position)
            d.dot(s) > 0 && c.push(e)
          }
        }
      }
      if (c.length > 0) {
        c.sort(u)
        for (let t = e.length + c.length - 1; t >= m + c.length; t--) e[t] = e[t - c.length]
        for (let t = 0; t < c.length; t++) e[t + m + 1] = c[t]
      }
      m += c.length + 1
    }
  }
  findConnectedSweeps(e: SweepObject, t: number, i = 2) {
    const n: SweepObject[] = []
    this._findConnectedSweeps(e, e, t, n, {}, i, 0)
    return n
  }
  _findConnectedSweeps(e: SweepObject, t: SweepObject, i: number, n: SweepObject[], s: Record<string, boolean>, a: number, o: number) {
    const r = this.getValidNeighbors(e.id)
    for (const e of r)
      if (!s[e.id]) {
        e.position.distanceTo(t.position) < i && (n.push(e), (s[e.id] = !0), o < a && this._findConnectedSweeps(e, t, i, n, s, a, o + 1))
      }
  }
  getValidNeighbors(e: string, t?: Function) {
    let i = this.validNeighbors[e]
    if (!i) {
      ;(i = []), (this.validNeighbors[e] = i)
      const n = this.sweepData.getSweep(e)
      const s = n.neighbours
      for (const a of s) {
        const s = this.sweepData.getSweep(a)
        const o = this.getDistance(e, a)
        if (!s.enabled) continue
        if (o > this.maxNeighborDistance) continue
        let r = !0
        if (t) {
          const e = s.position.clone().sub(n.position).normalize()
          r = 0 === t(n.position, e, o).length
        }
        r && i.push(s)
      }
    }
    return i
  }
  filterCloseSweepsFromPath(e: SweepObject[], t) {
    const i: SweepObject[] = []
    let n: SweepObject | null = null
    let s = !1
    for (const a of e) (s = (n && a.position.distanceTo(n.position) < t) || !1), (n && s) || (i.push(a), (n = a))
    return i.length < 2 ? e : (s && e.length > 1 && (i[i.length - 1] = e[e.length - 1]), i)
  }
  getCurveForPath(e: Vector3[]) {
    let t = 0
    const i = [0]
    for (let n = 1; n < e.length; n++) (t += e[n - 1].distanceTo(e[n])), i.push(t)
    const s = [0]
    for (let n = 1; n < e.length; n++) s.push(i[n] / t)
    const a = new CatmullRomCurve3(e, !1)
    return { curve: new CatmullRomCurve3(a.getSpacedPoints(2 * t).concat(e[e.length - 1])), totalLength: t, sourceDistances: i, normalSourceDistances: s }
  }
  buildDistanceMap() {
    const e: Record<string, Record<string, number>> = {}
    const t = new Vector3(0, 0, 0)
    this.sweepData.iterate(i => {
      const n: Record<string, number> = {}
      const s = i.neighbours
      for (const e of s) {
        const s = this.sweepData.getSweep(e)
        t.copy(i.position).sub(s.position)
        let a
        let o = Math.max(0, Math.abs(t.y) - 0.2)
        let r = Math.sqrt(t.x * t.x + t.z * t.z)
        o > 0 ? ((o = Math.pow(4 * o, 2)), (r = Math.pow(r, 2)), (a = Math.sqrt(o * o + r * r))) : (a = t.length()), (n[s.id] = a)
      }
      e[i.id] = n
    })
    this.distanceMap = e
  }
  getDistance(e: string, t: string) {
    return this.distanceMap[e][t]
  }
}
