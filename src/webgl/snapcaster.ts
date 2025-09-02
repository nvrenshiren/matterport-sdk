import { Box3, BufferGeometry, Color, MathUtils, Plane, Raycaster, Triangle, Vector2, Vector3 } from "three"
import { ScheduleProcessCommand } from "../command/schedule.command"
import { DebugInfo } from "../core/debug"
import { Message } from "../core/message"
import { CameraData } from "../data/camera.data"
import EngineContext from "../core/engineContext"
import { RaycastSnappingItem, SnapLine3, SnapVector3, SnappingOctree } from "./snapping"
import { getBoundingBox } from "./56512"
class r {
  vertices: Vector3[]
  colors: Color[]
  faces: SurfaceFace[]
  faceVertexUvs: Vector2[][]
  boundingBox: null
  boundingSphere: null
  constructor() {
    this.vertices = []
    this.colors = []
    this.faces = []
    this.faceVertexUvs = [[], []]
    this.boundingBox = null
    this.boundingSphere = null
  }
}
class SurfaceFace {
  a: number
  b: number
  c: number
  materialIndex: number
  normal: Vector3
  vertexNormals: number[]
  color: Color
  vertexColors: Color[]
  constructor(e, t, n, i, r?, a = 0) {
    this.a = e
    this.b = t
    this.c = n
    this.materialIndex = a
    this.a = e
    this.b = t
    this.c = n
    this.normal = i && !Array.isArray(i) && i.isVector3 ? i : new Vector3()
    this.vertexNormals = Array.isArray(i) ? i : []
    this.color = r && !Array.isArray(r) && r.isColor ? r : new Color()
    this.vertexColors = Array.isArray(r) ? r : []
    this.materialIndex = a
  }
  clone() {
    return new SurfaceFace(this.a, this.b, this.c, this.normal, this.color).copy(this)
  }
  copy(e) {
    this.a = e.a
    this.b = e.b
    this.c = e.c
    this.normal.copy(e.normal)
    this.color.copy(e.color)
    this.materialIndex = e.materialIndex
    for (let t = 0, n = e.vertexNormals.length; t < n; t++) this.vertexNormals[t] = e.vertexNormals[t].clone()
    for (let t = 0, n = e.vertexColors.length; t < n; t++) this.vertexColors[t] = e.vertexColors[t].clone()
    return this
  }
}
const c = new DebugInfo("surface-edge-finder"),
  d = new Triangle(),
  u = ["a", "b", "c"]
class EdgeFinderSurfaceFace extends SurfaceFace {
  va: EdgeFinderVertices
  vb: EdgeFinderVertices
  vc: EdgeFinderVertices
  area: number
  midpoint: Vector3
  vertices: EdgeFinderVertices[]
  surface: EdgeFinderSurface
  constructor(e: SurfaceFace, t: EdgeFinderVertices, n: EdgeFinderVertices, i: EdgeFinderVertices) {
    super(e.a, e.b, e.c, e.normal)
    this.va = t
    this.vb = n
    this.vc = i
    this.area = d.set(this.va.vector, this.vb.vector, this.vc.vector).getArea()
    this.midpoint = d.getMidpoint(new Vector3())
    this.vertices = [this.va, this.vb, this.vc]
    t.faces.push(this)
    n.faces.push(this)
    i.faces.push(this)
  }
}
class EdgeFinderVertices {
  vector: Vector3
  faces: EdgeFinderSurfaceFace[]
  constructor(e: Vector3) {
    this.vector = e
    this.faces = []
  }
}
class EdgeFinderSurface {
  area: number
  normal: Vector3
  midpoint: Vector3
  faces: EdgeFinderSurfaceFace[]
  normalSum: Vector3
  midpointSum: Vector3
  constructor() {
    ;(this.area = 0),
      (this.normal = new Vector3()),
      (this.midpoint = new Vector3()),
      (this.faces = []),
      (this.normalSum = new Vector3()),
      (this.midpointSum = new Vector3())
  }
  add(e: EdgeFinderSurfaceFace) {
    e.surface && e.surface.remove(e)
    this.faces.push(e)
    this.area += e.area
    this.midpointSum.add(e.midpoint)
    this.normalSum.add(e.normal)
    this.recalcFromSums()
    e.surface = this
  }
  remove(e) {
    e.surface &&
      (this.faces.splice(this.faces.indexOf(e), 1),
      (this.area -= e.area),
      this.midpointSum.sub(e.midpoint),
      this.normalSum.sub(e.normal),
      this.recalcFromSums()),
      (e.surface = null)
  }
  recalcFromSums() {
    this.normal.copy(this.normalSum).normalize(), this.midpoint.copy(this.midpointSum).divideScalar(this.faces.length)
  }
  mergeSurfaces(e) {
    for (const t of e.faces) (t.surface = this), this.faces.push(t)
    ;(this.area += e.area),
      this.normalSum.add(e.normalSum),
      this.midpointSum.add(e.midpointSum),
      this.recalcFromSums(),
      (e.faces = []),
      (e.area = 0),
      e.normal.set(0, 0, 0),
      e.normalSum.set(0, 0, 0),
      e.midpointSum.set(0, 0, 0),
      e.midpoint.set(0, 0, 0)
  }
  getEdges() {
    const e: Record<string, { edge1: number; edge2: number; isEdge: boolean }> = {}
    const t = {}
    for (const t of this.faces)
      for (let n = 0; n < 3; n++) {
        const i = t[u[n]],
          s = t[u[(n + 1) % 3]],
          r = Math.min(i, s) + "," + Math.max(i, s)
        if (void 0 === e[r]) {
          const t = {
            edge1: i,
            edge2: s,
            isEdge: !0
          }
          e[r] = t
        } else e[r].isEdge = !1
      }
    for (const { edge1: n, edge2: i, isEdge: s } of Object.values(e)) s && (t[n] || (t[n] = []), t[n].push(i), t[i] || (t[i] = []), t[i].push(n))
    return t
  }
  getCircularPaths(e: EdgeFinderVertices[]) {
    const t = this.getEdges()
    const n = new Set()
    const i: EdgeFinderVertices[][] = []
    const s = Object.keys(t).map(e => parseInt(e, 10))
    let r
    for (; (r = s.pop()); ) {
      const s: EdgeFinderVertices[] = []
      for (; r; ) {
        let i
        s.push(e[r])
        let a = 0
        for (const s of t[r]) {
          const t = Math.min(r, s) + "," + Math.max(r, s)
          if (n.has(t)) continue
          const o = e[r].vector.distanceToSquared(this.midpoint)
          ;(void 0 === i || o > a) && ((i = s), (a = o))
        }
        if (!i) break
        {
          const e = Math.min(r, i) + "," + Math.max(r, i)
          n.add(e), (r = i)
        }
      }
      s.length > 2 && i.push(s)
    }
    return i
  }
}
class EdgeFinder {
  surfaces: Set<EdgeFinderSurface>
  lines: SnapLine3[]
  points: SnapVector3[]
  constructor() {
    this.surfaces = new Set()
    this.lines = []
    this.points = []
  }
  *run(e, t = [1, 5, 10], n = 0.2, o = 0.01, d = 20) {
    const u = (function (e) {
      const t = new r()
      const n = null !== e.index ? e.index : void 0
      const i = e.attributes
      if (void 0 === i.position) throw Error("THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion.")
      const o = i.position
      const l = i.normal
      const c = i.color
      const d = i.uv
      const u = i.uv2
      void 0 !== u && (t.faceVertexUvs[1] = [])
      for (let e = 0; e < o.count; e++) {
        t.vertices.push(new Vector3().fromBufferAttribute(o, e))
        void 0 !== c && t.colors.push(new Color().fromBufferAttribute(c, e))
      }

      function h(e: number, n: number, i: number, r = 0) {
        const o = void 0 === c ? [] : [t.colors[e].clone(), t.colors[n].clone(), t.colors[i].clone()]
        const h =
          void 0 === l ? [] : [new Vector3().fromBufferAttribute(l, e), new Vector3().fromBufferAttribute(l, n), new Vector3().fromBufferAttribute(l, i)]
        const p = new SurfaceFace(e, n, i, h, o, r)
        t.faces.push(p)
        void 0 !== d &&
          t.faceVertexUvs[0].push(new Vector2().fromBufferAttribute(d, e), new Vector2().fromBufferAttribute(d, n), new Vector2().fromBufferAttribute(d, i))
        void 0 !== u &&
          t.faceVertexUvs[1].push(new Vector2().fromBufferAttribute(u, e), new Vector2().fromBufferAttribute(u, n), new Vector2().fromBufferAttribute(u, i))
      }
      const p = e.groups
      if (p.length > 0) {
        for (let e = 0; e < p.length; e++) {
          const t = p[e],
            i = t.start
          for (let e = i, s = i + t.count; e < s; e += 3)
            void 0 !== n ? h(n.getX(e), n.getX(e + 1), n.getX(e + 2), t.materialIndex) : h(e, e + 1, e + 2, t.materialIndex)
        }
      } else if (void 0 !== n) {
        for (let e = 0; e < n.count; e += 3) h(n.getX(e), n.getX(e + 1), n.getX(e + 2))
      } else {
        for (let e = 0; e < o.count; e += 3) h(e, e + 1, e + 2)
      }
      return t
    })(e)

    const f = u.vertices.map(e => new EdgeFinderVertices(e))
    const g: EdgeFinderSurfaceFace[] = []
    for (const e of u.faces) g.push(new EdgeFinderSurfaceFace(e, f[e.a], f[e.b], f[e.c])), yield
    for (let e = 0, t = g.length; e < t; e++) {
      const t = g[e]
      new EdgeFinderSurface().add(t)
    }
    for (const e of t) yield* this.mergeSurfacesByNormal(g, e)
    for (const e of g) this.surfaces.add(e.surface)
    let v = 0
    const y: EdgeFinderVertices[][] = []
    for (const e of this.surfaces) {
      if (e.area <= n) continue
      const t = e.getCircularPaths(f)
      for (const e of t) {
        this.cullPath(e, (e, t) => {
          if (e.length() < o || t.length() < o) return v++, !1
          const n = e.angleTo(t) * MathUtils.RAD2DEG
          return !(n < d || n > 180 - d) || (v++, !1)
        })
        e.length > 2 && y.push(e)
      }
      yield
    }
    c.debug(`Culled ${v} path points`)
    const b = new Set(),
      E = new Set(),
      S = e => `${e.x.toFixed(3)},${e.y.toFixed(3)},${e.z.toFixed(3)}`,
      O = e => `${S(e.start)}:${S(e.end)}`,
      T = e => `${S(e.end)}:${S(e.start)}`
    for (const e of y)
      for (let t = 0; t < e.length; t++) {
        const n = e[t].vector,
          s = e[(t + 1) % e.length].vector,
          r = new SnapLine3(n, s),
          a = O(r),
          o = T(r),
          l = S(n)
        E.has(a) || E.has(o) || (E.add(a), E.add(o), this.lines.push(r)), b.has(l) || (b.add(l), this.points.push(new SnapVector3(n)))
      }
    yield
  }
  cullPath(e: EdgeFinderVertices[], t: Function) {
    const n = new Vector3()
    const i = new Vector3()
    let r = !0
    for (; r; ) {
      r = !1
      for (let s = 0; s < e.length && e.length > 2; s++) {
        const a = e[0 === s ? e.length - 1 : s - 1].vector,
          o = e[s].vector,
          l = e[(s + 1) % e.length].vector
        n.copy(a).sub(o)
        i.copy(l).sub(o)
        t(n, i) || (e.splice(s, 1), (r = !0), s--)
      }
    }
  }
  *mergeSurfacesByNormal(e, t, n = 5) {
    let i = -1,
      s = 0
    for (; 0 !== i && s++ < n; ) {
      c.debug(`Merging surfaces by normal angle threshold: ${t}`)
      const n = Math.cos(MathUtils.DEG2RAD * t)
      i = 0
      let s = 0
      for (const t of e) {
        s++ % 1e3 == 0 && (yield)
        for (const e of t.vertices)
          for (const s of e.faces) {
            const e = s.surface
            t.surface !== e &&
              t.surface.normal.dot(e.normal) >= n &&
              (t.surface.faces.length > e.faces.length ? t.surface.mergeSurfaces(e) : e.mergeSurfaces(t.surface), i++)
          }
      }
      i && c.debug(`Merged ${i} surfaces by normal...`)
    }
  }
}
const b = new DebugInfo("snapcaster")
enum MeshStatus {
  READY = 2,
  UNINITIALIZED = 0,
  WORKING = 1
}
interface MesheItem {
  meshName: string
  geometry: BufferGeometry | null
  status: MeshStatus
  meta: { tile: string; meshGroup: number }
  filter?: (e: any) => boolean
}
interface SnappingItem {
  meshName: string
  geometry: BufferGeometry
  distance: number
  info: MesheItem
}
export class Snapcaster {
  cameraData: CameraData
  engine: EngineContext
  meshes: Map<string, MesheItem>
  newMeshes: Set<string>
  raycaster: Raycaster
  filterSnapFeature: (e: any) => boolean
  cast: (e: any, t: any, n: any, r: any) => any
  add: (...e: any[]) => void
  remove: (...e: any[]) => void
  _snappingOctree: SnappingOctree
  populateProcess: any
  constructor(e, t) {
    this.cameraData = e
    this.engine = t
    this.meshes = new Map()
    this.newMeshes = new Set()
    this.raycaster = new Raycaster()
    this.filterSnapFeature = e => {
      const { meshName } = e
      return !meshName || !1 !== this.meshes.get(meshName)?.filter?.call(this.meshes.get(meshName)?.filter, e)
    }
    this.cast = (e, t, n, r) => {
      let a: undefined | Plane
      n && r && (a = new Plane().setFromNormalAndCoplanarPoint(r, n)), this.raycaster.set(e.origin, e.direction)
      const o = this.snappingOctree.raycast(this.raycaster, t, this.filterSnapFeature) || []
      const l = (e: RaycastSnappingItem) => {
        let t = (1 + e.distance) * (1 + e.distanceToRay) ** 2
        e.object instanceof SnapVector3 && (t /= 10)
        a && a.distanceToPoint(e.point) < -0.2 && (t += 10)
        return t
      }
      o.sort((e, t) => l(e) - l(t))
      return o
    }
    this.add = (...e) => {
      for (const t of e) this.snappingOctree.add(t)
    }
    this.remove = (...e) => {
      for (const t of e) this.snappingOctree.remove(t)
    }
  }
  dispose() {
    this.meshes.clear()
    this.newMeshes.clear()
    this._snappingOctree.clear()
  }
  get snappingOctree() {
    this.preloadMeshSnapping()
    return this._snappingOctree
  }
  setupOctree(e: Box3) {
    this._snappingOctree = new SnappingOctree(e)
  }
  async preloadMeshSnapping() {
    if (!this.populateProcess && this.newMeshes.size) {
      this.populateProcess = await this.engine.commandBinder.issueCommand(new ScheduleProcessCommand("snapping", this.buildSnappingForMeshes(), 6e4))
      await this.populateProcess?.promise
      this.populateProcess = null
    }
  }
  *buildSnappingForMeshes() {
    const e = new Vector3()
    for (;;) {
      let t: SnappingItem | null = null
      for (const n of this.newMeshes) {
        const i = this.meshes.get(n)
        if (i) {
          const { geometry } = i
          if (!geometry) {
            b.error("No mesh to generate snapping information from!"), (i.status = MeshStatus.READY)
            continue
          }
          const distance = getBoundingBox(geometry).getCenter(e).distanceTo(this.cameraData.pose.position)
          if (!t || distance < t.distance) {
            t = {
              meshName: n,
              geometry,
              distance,
              info: i
            }
          }
        }
      }
      if (!t) break
      this.newMeshes.delete(t.meshName)
      t.info.status = MeshStatus.WORKING
      yield* this.buildSnappingForGeometry(t.geometry, t.info)
      t.info.status = MeshStatus.READY
      t.info.geometry = null
      yield
    }
    b.info(`Snapping found ${this._snappingOctree.pointCount} points and ${this._snappingOctree.lineCount} lines`)
  }
  *buildSnappingForGeometry(e: BufferGeometry, t: MesheItem) {
    e.computeVertexNormals()
    yield
    const n = new EdgeFinder()
    yield* n.run(e)
    b.debug(`Mesh done, added ${n.points.length} points and ${n.lines.length} lines`)
    for (const e of n.points) {
      e.meshName = t.meshName
      e.meta = t.meta
      this._snappingOctree.add(e)
    }
    for (const e of n.lines) {
      e.meshName = t.meshName
      e.meta = t.meta
      this._snappingOctree.add(e)
    }
    this.engine.broadcast(new BuildSnappingDoneMessage(n))
  }
  forEachSnapFeature(e, t = !1) {
    this.snappingOctree.traverse(n => {
      ;(t && !this.filterSnapFeature(n)) || e(n)
    })
  }
  addMeshGeometry(meshName: string, geometry: BufferGeometry, meta, filter) {
    if (!this.meshes.has(meshName)) {
      this.meshes.set(meshName, {
        meshName,
        geometry,
        status: MeshStatus.UNINITIALIZED,
        meta,
        filter
      })
      this.newMeshes.add(meshName)
    }
  }
  removeMeshGeometry(e: string) {
    const t = this.meshes.get(e)
    t && t.status === MeshStatus.UNINITIALIZED && (this.meshes.delete(e), this.newMeshes.delete(e))
  }
}
export class BuildSnappingDoneMessage extends Message {
  edgeFinder: EdgeFinder
  constructor(e: EdgeFinder) {
    super()
    this.edgeFinder = e
  }
}
