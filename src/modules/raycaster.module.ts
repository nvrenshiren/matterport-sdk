import {
  Box3,
  Box3Helper,
  BufferGeometry,
  Intersection,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  Ray,
  Raycaster,
  Vector2,
  Vector3,
  Vector4
} from "three"
import { HitPointInfo } from "three-mesh-bvh"
import * as m from "../const/28941"
import { RaycastOctreeSymbol, RaycastSymbol, RaycasterSymbol, SnappingSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { Point, PointerData } from "../data/pointer.data"
import { createSphereFromBox } from "../math/2569"
import { getPointerScreenPosition, getPostDirections } from "../math/59370"
import { SymbolLoadedMessage } from "../other/2032"
import { defaultRaycastFilter } from "../webgl/16769"
import { getBoundingBox, getHitPointInfo, mergeGeometries } from "../webgl/56512"
import { DepthPassRoomMesh } from "../webgl/depthPassRoomMesh"
import { ModelMesh } from "../webgl/model.mesh"
import { RoomMesh } from "../webgl/roomMesh"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { Snapcaster } from "../webgl/snapcaster"
declare global {
  interface SymbolModule {
    [RaycasterSymbol]: RaycasterModule
  }
}
function a(e: RoomMesh | DepthPassRoomMesh) {
  return "excludeFromOctree" in e
}
const c = new Vector3()
class RaycasterOctreeBase {
  parent: null | RaycasterOctreeRoot
  raycastDistance: number
  distance: number
  bounds: Box3
  constructor() {
    this.parent = null
    this.raycastDistance = 1 / 0
    this.distance = 1 / 0
  }
  updateRaycastDistance(e) {
    this.raycastDistance = this.bounds.distanceToPoint(e)
  }
  updateDistanceToBounds(e) {
    this.distance = this.bounds.distanceToPoint(e)
  }
}
class RaycasterOctreeMesh extends RaycasterOctreeBase {
  mesh: RoomMesh
  center: Vector3
  constructor(e) {
    super()
    this.mesh = e
    this.bounds = getBoundingBox(this.mesh.geometry).clone().applyMatrix4(this.mesh.matrixWorld)
    this.center = this.bounds.getCenter(new Vector3())
  }
  raycast(e: Raycaster, t: Intersection[]) {
    this.mesh.visible && this.mesh.raycast(e, t)
  }
  nearestPointOnGeometry(e: Vector3) {
    const t = e.clone().applyMatrix4(new Matrix4().copy(this.mesh.matrixWorld).invert())
    let n: HitPointInfo | ReturnType<typeof getHitPointInfo> | null
    const i = this.mesh.geometry.boundsTree
    n = i ? i.closestPointToPoint(t) : getHitPointInfo(this.mesh.geometry, t)
    if (n) {
      n.point.applyMatrix4(this.mesh.matrixWorld)
    }
    return n
      ? {
          object: this.mesh,
          point: n.point,
          distance: n.point.distanceTo(e),
          faceIndex: n.faceIndex
        }
      : null
  }
}
export class RaycasterOctreeRoot extends RaycasterOctreeBase {
  level: number
  leafMinSize: number
  childNodes: RaycasterOctreeRoot[]
  children: Array<RaycasterOctreeRoot | RaycasterOctreeMesh>
  listeners: Record<string, Function[]>
  size: Vector3
  center: Vector3
  constructor(e: Box3, t, n) {
    super()
    this.level = t
    this.leafMinSize = n
    this.childNodes = []
    this.children = []
    this.listeners = {}
    this.bounds = e.clone()
    this.size = e.getSize(new Vector3())
    this.center = e.getCenter(new Vector3())
  }
  get depth() {
    return this.level
  }
  *addMeshes(e: ModelMesh) {
    e.updateMatrixWorld(!0)
    const t: RoomMesh[] = []
    e.traverse((e: RoomMesh | DepthPassRoomMesh) => {
      if (e instanceof Mesh && e.geometry) {
        if (!(a(e) && (e as DepthPassRoomMesh).excludeFromOctree)) {
          t.push(e as RoomMesh)
        }
      }
    })
    for (const e of t) this.addMesh(new RaycasterOctreeMesh(e))
  }
  removeMeshes(e) {
    let t = !1
    for (let n = 0; n < this.children.length; n++) {
      const i = this.children[n]
      i instanceof RaycasterOctreeMesh && i.mesh.id === e.id && ((i.parent = null), this.children.splice(n, 1), this.emit("removed", this, i), (t = !0))
    }
    if (!t) throw new Error("Mesh that is being attempted removed does not exist in this node.")
  }
  addMesh(e: RaycasterOctreeMesh) {
    this.parent || this.expandToFit(e)
    let t = !1
    if (this.size.length() > this.leafMinSize) {
      0 === this.childNodes.length && this.buildChildNodes()
      for (const n of this.childNodes) n.bounds.containsBox(e.bounds) && ((t = !0), n.addMesh(e))
    }
    t || this.add(e)
  }
  add(e: RaycasterOctreeRoot | RaycasterOctreeMesh) {
    if (e.parent) throw new Error("ColliderNode already has a parent, remove before trying to add in another node")
    e.parent = this
    this.children.push(e)
    this.emit("added", this, e)
  }
  expandToFit(e: RaycasterOctreeMesh) {
    let t = !1
    for (; !this.bounds.containsBox(e.bounds); ) {
      const { bounds, size, center, children, childNodes } = this,
        o = center.clone()
      this.children = []
      this.childNodes = []
      size.multiplyScalar(2)
      center.set(
        bounds[e.center.x > center.x ? "max" : "min"].x,
        bounds[e.center.y > center.y ? "max" : "min"].y,
        bounds[e.center.z > center.z ? "max" : "min"].z
      )
      bounds.setFromCenterAndSize(center, size)
      this.buildChildNodes()
      for (const e of this.childNodes) {
        if (e.center.distanceToSquared(o) < 1e-10) {
          e.children = children
          e.childNodes = childNodes
          children.forEach(t => {
            this.emit("removed", t.parent, t)
            t.parent = e
            this.emit("added", e, t)
          })
          break
        }
      }

      t = !0
    }
    if (t) {
      this.traverse(e => {
        e.parent && (e.level = e.parent.level + 1)
      })
    }
  }
  traverse(e) {
    e(this)
    for (const t of this.childNodes) t.traverse(e)
  }
  clear() {
    this.childNodes.length = 0
    this.children.length = 0
  }
  buildChildNodes() {
    const e = c.copy(this.size).multiplyScalar(0.5)
    for (let t = 0; t < 2; t++)
      for (let n = 0; n < 2; n++)
        for (let i = 0; i < 2; i++) {
          const s = this.bounds.min.x + e.x * i,
            a = s + e.x,
            o = this.bounds.min.y + e.y * t,
            l = o + e.y,
            c = this.bounds.min.z + e.z * n,
            d = c + e.z,
            u = new Box3(new Vector3(s, o, c), new Vector3(a, l, d)),
            p = new RaycasterOctreeRoot(u, this.level + 1, this.leafMinSize)
          this.childNodes.push(p)
          this.add(p)
        }
  }
  raycast(e, t) {
    if (!0 === e.ray.intersectsBox(this.bounds)) for (const n of this.children) n.raycast(e, t)
  }
  pick(e: Raycaster, t: Intersection | null, n?: Function, i?: Function) {
    if (!e.ray.intersectsBox(this.bounds)) return t
    for (const t of this.children) t.updateRaycastDistance(e.ray.origin)
    this.children.sort((e, t) => e.raycastDistance - t.raycastDistance)
    for (const s of this.children) {
      if (t && t.distance < s.raycastDistance) break
      if (n?.(s)) {
        if (s instanceof RaycasterOctreeRoot) t = s.pick(e, t, n, i)
        else {
          const n: Intersection[] = []
          s.raycast(e, n)
          for (const e of n) {
            ;(t && !(t.distance > e.distance)) || (i && !i(e)) || (t = e)
          }
        }
      }
    }
    return t
  }
  nearestTo(
    e: Vector3,
    t,
    n: ReturnType<RaycasterOctreeMesh["nearestPointOnGeometry"]> | null = null
  ): ReturnType<RaycasterOctreeMesh["nearestPointOnGeometry"]> {
    for (const t of this.children) t.updateDistanceToBounds(e)
    this.children.sort((e, t) => e.distance - t.distance)
    for (const i of this.children) {
      if (0 !== i.distance && n && n.distance < i.distance) break
      if (t(i)) {
        if (i instanceof RaycasterOctreeRoot) n = i.nearestTo(e, t, n)
        else if (i instanceof RaycasterOctreeMesh) {
          const t = i.nearestPointOnGeometry(e)
          if (t) {
            ;(!n || n.distance > t.distance) && (n = t)
          }
        }
      }
    }
    return n
  }
  getAllBounds(e, t = 0, n = 1 / 0, i = !1) {
    for (const s of this.children)
      this.level >= t && this.level <= n && (i || e.push(s.bounds.clone())), s instanceof RaycasterOctreeRoot && s.getAllBounds(e, t, n, i)
  }
  emit(e, ...t) {
    const n = this.listeners[e] || []
    for (const e of n) e(...t)
    this.parent && this.parent.emit(e, ...t)
  }
  on(e, t) {
    this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t)
  }
}
class RaycasterOctree {
  meshToNodes: Record<string, RaycasterOctreeMesh[]>
  _depth: number
  root: RaycasterOctreeRoot
  constructor(e: Box3, t: number) {
    this.meshToNodes = {}
    this._depth = 0
    const n = createSphereFromBox(e)
    this.root = new RaycasterOctreeRoot(n, 0, t)
    this.root.on("added", (e, t) => {
      e.depth > this._depth && (this._depth = e.depth),
        t instanceof RaycasterOctreeMesh && (this.meshToNodes[t.mesh.id] || (this.meshToNodes[t.mesh.id] = []), this.meshToNodes[t.mesh.id].push(t))
    })
    this.root.on("removed", (e, t) => {
      if (t instanceof RaycasterOctreeMesh) {
        const e = this.meshToNodes[t.mesh.id]
        for (let n = 0; n < e.length; n++) e[n] === t && e.splice(n, 1)
      }
    })
  }
  get depth() {
    return this._depth
  }
  *addMeshesAsync(e) {
    yield* this.root.addMeshes(e)
  }
  addMeshes(e: ModelMesh) {
    for (const t of this.root.addMeshes(e));
  }
  removeMeshes(e) {
    e.traverse(e => {
      const t = this.meshToNodes[e.id] || []
      for (const n of t) n.parent && n.parent.removeMeshes(e)
    })
  }
  clear() {
    this.root.clear()
    this.meshToNodes = {}
  }
  raycast(e) {
    const t = []
    return this.root.raycast(e, t), t
  }
  getAllBounds(e = 0, t = 1 / 0, n = !1) {
    const i = []
    return this.root.getAllBounds(i, e, t, n), i
  }
  pick(e: Raycaster, t: ShowcaseRaycaster["defaultRaycastFilter"], intersectionFilter?: Function) {
    const i = e.firstHitOnly
    e.firstHitOnly = !intersectionFilter
    const s = this.root.pick(e, null, e => !(!!t && e instanceof RaycasterOctreeMesh) || t(e.mesh), intersectionFilter)
    e.firstHitOnly = i
    return s
  }
  nearestMeshTo(e: Vector3, t) {
    const n = this.root.bounds.clampPoint(e, new Vector3())
    return this.root.nearestTo(n, e => !(t && e instanceof RaycasterOctreeMesh) || t(e.mesh))
  }
  getDebugBoundsMesh(e = 16777215, t = 0, n = 1 / 0, i = !1) {
    const s = this.getAllBounds(t, n, i),
      a = new LineBasicMaterial({
        color: e
      })
    if (s.length > 0) {
      const e: BufferGeometry[] = []
      for (const t of s) {
        const n = new Box3Helper(t)
        n.updateMatrixWorld(!0), n.geometry.applyMatrix4(n.matrixWorld), e.push(n.geometry)
      }
      const t = mergeGeometries(e)
      return new LineSegments(t, a)
    }
    return new LineSegments(new BufferGeometry(), a)
  }
}
export class ShowcaseRaycaster {
  camera: PerspectiveCamera
  cameraData: CameraData
  defaultRaycastFilter: (e: ModelMesh | RoomMesh) => boolean
  intersectionFilter: any
  meshes: Record<string, ModelMesh>
  octreeEnabledMeshes: Record<string, boolean>
  meshFilters: Map<ModelMesh | RoomMesh, ShowcaseRaycaster["defaultRaycastFilter"]>
  raycaster: Raycaster
  prevRay: Ray
  _hitCache: Intersection[]
  hitCacheValid: boolean
  getOctree: () => RaycasterOctree
  octree: RaycasterOctree
  constructor(e, t, n, i) {
    this.camera = e
    this.cameraData = t
    this.defaultRaycastFilter = n
    this.intersectionFilter = i
    this.meshes = {}
    this.octreeEnabledMeshes = {}
    this.meshFilters = new Map()
    this.raycaster = new Raycaster()
    this.prevRay = new Ray()
    this._hitCache = []
    this.hitCacheValid = !0
    this.getOctree = () => this.octree
  }
  init() {
    this.raycaster = new Raycaster()
    this.raycaster.camera = this.camera
    this.raycaster.params.Line && (this.raycaster.params.Line.threshold = 0.1)
  }
  dispose() {
    this.octree.clear()
    this._hitCache.length = 0
    this.meshes = {}
  }
  updateIntersectionFilter(e) {
    this.intersectionFilter = e
  }
  cast(e: Vector3, t: Vector3, n?) {
    e && t && (this.prevRay.copy(this.raycaster.ray), this.raycaster.set(e, t))
    if (!n && this.prevRay.equals(this.raycaster.ray) && this.hitCacheValid) return this._hitCache
    this.hitCacheValid = !0
    this.raycaster.layers.mask = this.camera.layers.mask
    this._hitCache.length = 0
    if (this.octree) {
      const e = this.getRaycastFilter(RaycastFilterType.OctreeMeshes, n)
      const t = this.octree.pick(this.raycaster, e, this.intersectionFilter)
      t && this._hitCache.push(t)
    }
    const i = this.getRaycastFilter(RaycastFilterType.DynamicMeshes, n)
    for (const e in this.meshes) {
      const t = this.meshes[e]
      if (i(t)) {
        const e = this.raycaster.intersectObject(t, !0)
        this._hitCache = this._hitCache.concat(e)
      }
    }
    const s = this.cameraData.isOrtho() ? y : v
    this._hitCache.sort((e, t) => s(e, t)), this.prevRay.copy(this.raycaster.ray)
    return this._hitCache
  }
  pick(e: Vector3, t: Vector3, n?: (e: any) => boolean) {
    this.raycaster.set(e, t)
    const s = this.getRaycastFilter(RaycastFilterType.OctreeMeshes, n)
    return this.octree?.pick(this.raycaster, s, this.intersectionFilter)
  }
  nearest(e: Vector3, t: ShowcaseRaycaster["defaultRaycastFilter"]) {
    return this.octree.nearestMeshTo(e, this.getRaycastFilter(RaycastFilterType.OctreeMeshes, t))
  }
  setupOctree(e: Box3) {
    this.octree = new RaycasterOctree(e, 0.5)
    for (const e of Object.keys(this.meshes)) {
      if (this.octreeEnabledMeshes[e]) {
        const t = this.meshes[e]
        this.octree.addMeshes(t)
      }
    }
    return this.octree
  }
  addTarget(e, t, n) {
    const i = e,
      s = i.collider ? i.collider : e
    this.meshes[e.id] = s
    n && this.meshFilters.set(s, n)
    this.octreeEnabledMeshes[e.id] = t
    if (this.octree && t) {
      this.octree.addMeshes(e)
      e.traverse((e: RoomMesh) => {
        !(e instanceof Mesh) || (a(e) && e["excludeFromOctree"]) || ((this.octreeEnabledMeshes[e.id] = t), n && this.meshFilters.set(e, n))
      })
    }
    this.hitCacheValid = !1
  }
  removeTarget(e) {
    if (this.octree && this.octreeEnabledMeshes[e.id]) {
      this.octree.removeMeshes(e)
      this.octreeEnabledMeshes[e.id] = !1
      e.traverse((e: RoomMesh) => {
        e instanceof Mesh && ((this.octreeEnabledMeshes[e.id] = !1), this.meshFilters.delete(e))
      })
    }

    const t = this.meshes[e.id]
    if (t) {
      this.meshFilters.delete(t)
      delete this.meshes[e.id]
    }
    this.hitCacheValid = !1
  }
  getRaycastFilter(e: RaycastFilterType, t?: ShowcaseRaycaster["defaultRaycastFilter"]) {
    const n = t || this.defaultRaycastFilter
    const i = (t: ModelMesh) => {
      const n = this.octreeEnabledMeshes[t.id]
      switch (e) {
        case RaycastFilterType.DynamicMeshes:
          return !n
        case RaycastFilterType.OctreeMeshes:
          return n
      }
    }
    return (e: ModelMesh) => i(e) && n(e) && this.checkMeshSpecificFilter(e)
  }
  checkMeshSpecificFilter(e: ModelMesh) {
    const t = this.meshFilters.get(e)
    return !t || t(e)
  }
  render() {}
  activate() {}
  deactivate() {}
}
function v(e, t) {
  var n, i
  const s =
    (null !== (n = e.object.intersectionPriority) && void 0 !== n ? n : m.e.Normal) -
    (null !== (i = t.object.intersectionPriority) && void 0 !== i ? i : m.e.Normal)
  return 0 !== s ? s : e.distance - t.distance
}
function y(e, t) {
  const n = e.object instanceof ShowcaseMesh ? e.object.get2DPickingPriority() : e.object.renderOrder,
    i = t.object instanceof ShowcaseMesh ? t.object.get2DPickingPriority() : t.object.renderOrder
  return n > i ? -1 : n < i ? 1 : v(e, t)
}
enum RaycastFilterType {
  DynamicMeshes = 1,
  OctreeMeshes = 0
}

class DefaultPointer {
  raycaster: ShowcaseRaycaster
  cameraData: CameraData
  currentRay: Ray
  pointer: Vector2
  origin: Vector3
  direction: Vector3
  cast: (e?: any) => Intersection[]
  updatePointer: (e: Vector2) => void
  constructor(e, t) {
    this.raycaster = e
    this.cameraData = t
    this.currentRay = new Ray()
    this.pointer = new Vector2(-2, -2)
    this.origin = new Vector3()
    this.direction = new Vector3()
    this.cast = e => {
      const t = this.pointerRay
      return this.raycaster.cast(t.origin, t.direction, e).slice()
    }
    this.updatePointer = e => {
      this.pointer.distanceToSquared(e) > 2e-5 && this.pointer.set(e.x, e.y)
    }
  }
  get pointerRay() {
    const { origin: e, direction: t } = this.updateDirections()
    return this.currentRay.set(e, t)
  }
  get ndcPosition() {
    return this.pointer
  }
  updateDirections() {
    getPostDirections(this.cameraData.pose, this.origin.set(this.pointer.x, this.pointer.y, -1), this.origin)
    getPostDirections(this.cameraData.pose, this.direction.set(this.pointer.x, this.pointer.y, 1), this.direction)
    this.direction.sub(this.origin).normalize()
    return {
      origin: this.origin,
      direction: this.direction
    }
  }
}
class RaycasterCalculate {
  raycaster: RaycasterModule
  data: PointerData
  cameraData: CameraData
  cache: { normal4: Vector4; normal: Vector3; rotationMatrix: Matrix4; ndc3: Vector3 }
  constructor(e, t, n) {
    this.raycaster = e
    this.data = t
    this.cameraData = n
    this.cache = {
      normal4: new Vector4(),
      normal: new Vector3(),
      rotationMatrix: new Matrix4(),
      ndc3: new Vector3()
    }
  }
  beforeRender() {
    if (this.raycaster.pointer.pointerRay.equals(this.data.pointerRay)) return
    this.data.pointerRay.copy(this.raycaster.pointer.pointerRay)
    this.data.pointerOrigin.copy(this.data.pointerRay.origin)
    this.data.pointerDirection.copy(this.data.pointerRay.direction)
    const e = this.raycaster.pointer.cast()
    this.data.hits.length = 0
    this.data.hits.push(...e)
    this.data.pointerNdcPosition.copy(this.raycaster.pointer.ndcPosition)
    this.cache.ndc3.set(this.data.pointerNdcPosition.x, this.data.pointerNdcPosition.y, 0.5)
    this.data.pointerScreenPosition.copy(getPointerScreenPosition(this.cameraData.width, this.cameraData.height, this.cache.ndc3))
    if (e.length > 0) {
      const t = e[0]
      if (t && t.face) {
        const e = t.face.normal
        this.cache.normal4.set(e.x, e.y, e.z, 0),
          this.cache.rotationMatrix.extractRotation(t.object.matrixWorld),
          this.cache.normal4.applyMatrix4(this.cache.rotationMatrix),
          this.cache.normal.set(this.cache.normal4.x, this.cache.normal4.y, this.cache.normal4.z),
          (this.data.hit = new Point(t.point.clone(), this.cache.normal.clone(), t.object, t))
      }
    } else this.data.hit = null
    this.data.commit()
  }
  init() {}
  render() {}
  dispose() {
    this.data.hit = null
    this.data.hits.length = 0
    this.data.commit()
  }
  activate() {}
  deactivate() {}
}

export default class RaycasterModule extends Module {
  raycasterPointerData: PointerData
  overridePointer: null
  setOverridePointer: (e: any) => void
  raycaster: ShowcaseRaycaster
  defaultPointer: DefaultPointer
  snapcaster: Snapcaster
  constructor() {
    super(...arguments)
    this.name = "raycaster"
    this.raycasterPointerData = new PointerData()
    this.overridePointer = null
    this.setOverridePointer = e => {
      this.overridePointer = e
    }
  }
  async init(e, t: EngineContext) {
    t.market.register(this, PointerData, this.raycasterPointerData)
    const [n, i] = await Promise.all([t.getModuleBySymbol(WebglRendererSymbol), t.market.waitForData(CameraData)])
    const r = n.getCamera()
    this.raycaster = new ShowcaseRaycaster(r, i, defaultRaycastFilter, null)
    t.addComponent(this, this.raycaster)
    this.defaultPointer = new DefaultPointer(this.raycaster, i)
    this.snapcaster = new Snapcaster(i, t)
    const a = new RaycasterCalculate(this, this.raycasterPointerData, i)
    t.addComponent(this, a)
    t.broadcast(new SymbolLoadedMessage(RaycastSymbol))
    t.broadcast(new SymbolLoadedMessage(RaycastOctreeSymbol))
    t.broadcast(new SymbolLoadedMessage(SnappingSymbol))
  }
  dispose(e) {
    super.dispose(e)
    this.raycaster.dispose()
    this.snapcaster.dispose()
  }
  setupOctree(e: Box3) {
    this.raycaster.setupOctree(e)
    this.snapcaster.setupOctree(e)
  }
  setIntersectionFilter(e) {
    this.raycaster.updateIntersectionFilter(e)
  }
  getOctree() {
    return this.raycaster.getOctree()
  }
  get pointer() {
    return null !== this.overridePointer ? this.overridePointer : this.defaultPointer
  }
  get targets() {
    return this.raycaster
  }
  get picking() {
    return this.raycaster
  }
  get snapping() {
    return this.snapcaster
  }
  get data() {
    return this.raycasterPointerData
  }
}
