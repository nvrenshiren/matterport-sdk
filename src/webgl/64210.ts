import { Color, ColorRepresentation, InstancedMesh, Matrix4, MeshBasicMaterial, SphereGeometry } from "three"
import { FlipYConfig } from "../const/53203"
import { Pose } from "./pose"
import { ShowCaseScene } from "./showcase.scene"

const r = FlipYConfig.sightingMaxAge
const l = new Color()
let i: InstancedMesh
let s = -1
const updateSightingInstance = (e: ColorRepresentation, t: ShowCaseScene, n: Pose) => {
  if (!i) {
    i = new InstancedMesh(new SphereGeometry(0.005, 8, 4), new MeshBasicMaterial(), r)
    i.frustumCulled = !1
    resetInstanceMatrices(i)
  }
  const o = new Matrix4()
  return ({ point, distance }) => {
    const u = distance / n.fovDistanceScale()
    o.makeScale(u, u, u).setPosition(point)
    i.setMatrixAt(++s % r, o)
    i.instanceMatrix.needsUpdate = !0
    for (let t = r; t--; ) {
      i.setColorAt((s - t + r) % r, l.set(e).multiplyScalar(1 - t / r))
    }
    i.instanceColor && (i.instanceColor.needsUpdate = !0)
    i.parent || t.scene.add(i)
  }
}
const clearSightingInstances = () => {
  i && (i.parent?.remove(i), resetInstanceMatrices(i))
}
function resetInstanceMatrices(e: InstancedMesh) {
  const t = new Matrix4().makeScale(0, 0, 0)
  for (let n = 0; n < r; n++) e.setMatrixAt(n, t)
}

export const dw = clearSightingInstances
export const ef = updateSightingInstance
