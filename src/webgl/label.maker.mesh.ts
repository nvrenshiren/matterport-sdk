import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial, Plane, Ray, Vector3 } from "three"
import { ColorSpace } from "../const/color.const"
export const LabelColor = { ColorDefault: 16777215, ColorHovered: ColorSpace.MP_BRAND.getHex(), ColorInvalid: 16750933 }

export class LabelMakerMesh extends Mesh<BoxGeometry, MeshBasicMaterial> {
  hitTest: (o: any, a: any) => void
  labelMesh: any
  data: any
  constructor(geometry: BoxGeometry, material: MeshBasicMaterial) {
    super(geometry, material)
    this.hitTest = (() => {
      const t = new Matrix4()
      const e = new Ray()
      const i = new Plane(new Vector3(0, 0, -1))
      const s = new Vector3()
      return (o, a) => {
        t.copy(this.matrixWorld).invert()
        e.copy(o.ray).applyMatrix4(t)
        if (e.intersectPlane(i, s)) {
          const t = this.scale.x / this.scale.y
          let e = 0.5
          t < 1.5 && (e = 1 / t),
            Math.abs(s.x) <= e &&
              Math.abs(s.y) <= 0.75 &&
              (s.applyMatrix4(this.matrixWorld), a.push({ distance: o.ray.origin.distanceTo(s), point: s.clone(), object: this }))
        }
      }
    })()
  }
  labelVisible() {
    return !(!this.labelMesh || !this.labelMesh.labelVisible())
  }
  getId() {
    if (!this.data) throw new Error("LabelInputCollider used before configure")
    return this.data.sid
  }
  raycast(t, e) {
    if (!this.labelVisible()) return
    if (this.material.depthTest) return void this.hitTest(t, e)
    const i = this.material.depthTest ? e : []
    this.hitTest(t, i), i.length > 0 && ((i[0].distance /= 1e4), e.push(i[0]))
  }
}
