import { BufferGeometry, Intersection, Matrix4, Mesh, Ray, Raycaster } from "three"
import { MeshBVH, MeshBVHOptions } from "three-mesh-bvh"
import { adjustIntersectionToWorld } from "../math/78129"
const o = new Ray()
const a = new Matrix4()
const MeshRaycast = Mesh.prototype.raycast
export function ShowcaseMeshRaycast(t: Raycaster, e: Intersection[]) {
  const that = this as Mesh
  if (that.geometry.boundsTree) {
    if (void 0 === that.material) return
    a.copy(that.matrixWorld).invert()
    o.copy(t.ray).applyMatrix4(a)
    const n = that.geometry.boundsTree
    if (!0 === t.firstHitOnly) {
      const r = adjustIntersectionToWorld(n.raycastFirst(o, that.material), that, t)
      r && e.push(r)
    } else {
      const r = n.raycast(o, that.material)
      for (let n = 0, s = r.length; n < s; n++) {
        const s = adjustIntersectionToWorld(r[n], that, t)
        s && e.push(s)
      }
    }
  } else MeshRaycast.call(that, t, e)
}
export function buildMeshBVH(t?: MeshBVHOptions) {
  const that = this as BufferGeometry
  that.boundsTree = new MeshBVH(that, t)
  return that.boundsTree
}
export function clearMeshBVH() {
  this.boundsTree = null
}
