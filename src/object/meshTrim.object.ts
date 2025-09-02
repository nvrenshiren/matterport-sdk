import { Matrix4, Quaternion, Vector3 } from "three"
import { ObservableObject } from "../observable/observable.object"
import { randomString } from "../utils/func.utils"
const o = new Vector3()
export class MeshTrimObject extends ObservableObject {
  position: Vector3
  scale: Vector3
  rotation: Quaternion
  enabled: boolean
  meshGroup: number
  created: Date
  modified: Date
  discardContents: boolean
  activeInPanoMode: boolean
  _rotationMatrix: Matrix4
  _matrix: Matrix4
  id: string
  index: number
  name: string
  constructor(t, e, i, n, o, r, d = new Date(), c = new Date(), h?, l?, m?, u?) {
    super()
    this.position = t
    this.scale = e
    this.rotation = i
    this.enabled = o
    this.meshGroup = r
    this.created = d
    this.modified = c
    this.discardContents = !0
    this.activeInPanoMode = !0
    this._rotationMatrix = new Matrix4()
    this._matrix = new Matrix4()
    this.id = h || `${this.meshGroup}` + randomString(11)
    this.index = n
    this.name = l
    this.discardContents = void 0 === m || m
    this.activeInPanoMode = void 0 === u || u
  }
  get sid() {
    return this.id
  }
  isPointTrimmed(t: Vector3, e) {
    return !!this.enabled && !(e && !this.activeInPanoMode) && (this.discardContents ? this.isPointInside(t) : !this.isPointInside(t))
  }
  isPointInside(t: Vector3) {
    this._matrix.compose(this.position, this.rotation, this.scale), this._matrix.invert()
    const e = o.copy(t).applyMatrix4(this._matrix)
    return e.x < 0.5 && e.x > -0.5 && e.y < 0.5 && e.y > -0.5 && e.z < 0.5 && e.z > -0.5
  }
  updateRotationMatrix() {
    const t = this.rotation,
      e = this.rotation.clone().set(t.x, t.y, t.z, -t.w)
    this._rotationMatrix.makeRotationFromQuaternion(e.normalize())
  }
  get rotationMatrix() {
    this.updateRotationMatrix()
    return this._rotationMatrix
  }
}
