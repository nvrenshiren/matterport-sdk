import { Euler, Matrix4, Quaternion, Vector3 } from "three"

export class Matrix4Three {
  elements: number[]
  static identity: number[]
  constructor(e?: number[] | Matrix4Three) {
    this.elements = []
    e
      ? ((e: Matrix4Three) => void 0 !== e.elements)(e as Matrix4Three)
        ? (this.elements = (e as Matrix4Three).elements.slice())
        : Matrix4.prototype.set.apply(this, e)
      : Matrix4.prototype.set.apply(this, Matrix4Three.identity)
  }
  equals(e: MatrixBase) {
    return Matrix4.prototype.equals.call(this, e)
  }
  clone() {
    return new Matrix4Three(this)
  }
}
Matrix4Three.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
export class MatrixBase extends Matrix4Three {
  threeMatrix: Matrix4
  constructor(e?: number[] | Matrix4Three) {
    e instanceof Array || e ? super(e) : super()
    this.threeMatrix = new Matrix4()
  }
  set(e, t, n, s, r, a, o, l, c, d, u, h, p, m, f, g) {
    return Matrix4.prototype.set.call(this, e, t, n, s, r, a, o, l, c, d, u, h, p, m, f, g), this
  }
  makeScale(e, t, n) {
    return Matrix4.prototype.makeScale.call(this, e, t, n), this
  }
  copy(e) {
    for (let t = 0; t < this.elements.length; t++) this.elements[t] = e.elements[t]
    return this
  }
  clone() {
    return new MatrixBase().copy(this)
  }
  transpose() {
    return Matrix4.prototype.transpose.call(this)
  }
  lookAt(eye: Vector3, target: Vector3, up: Vector3) {
    Matrix4.prototype.lookAt.call(this, eye, target, up)
    return this
  }
  setPosition(e: Vector3) {
    Matrix4.prototype.setPosition.call(this, e.x, e.y, e.z)
    return this
  }
  extractRotation(e: Matrix4) {
    Matrix4.prototype.extractRotation.call(this, e)
    return this
  }
  makePerspective(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    Matrix4.prototype.makePerspective.call(this, left, right, bottom, top, near, far)
    return this
  }
  makePerspectiveFov(e: number, t: number, near = 0.1, far = 1e3) {
    const bottom = near * Math.tan((e * (Math.PI / 180)) / 2)
    const top = -bottom
    const right = bottom * t
    const left = -right
    Matrix4.prototype.makePerspective.call(this, left, right, bottom, top, near, far)
    return this
  }
  makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number) {
    Matrix4.prototype.makeOrthographic.call(this, left, right, top, bottom, near, far)
    return this
  }
  identity() {
    return this.set.apply(this, Matrix4Three.identity)
  }
  makeRotationFromQuaternion(e: Quaternion) {
    return Matrix4.prototype.makeRotationFromQuaternion.call(this, e), this
  }
  makeRotationFromEuler(e: Euler) {
    return Matrix4.prototype.makeRotationFromEuler.call(this, e), this
  }
  getInverse(e: MatrixBase) {
    return Matrix4.prototype.copy.call(this, e), Matrix4.prototype.invert.call(this), this
  }
  premultiply(e: Matrix4) {
    return Matrix4.prototype.premultiply.call(this, e), this
  }
  multiplyMatrices(e: MatrixBase, t: MatrixBase) {
    return Matrix4.prototype.multiplyMatrices.call(this, e, t), this
  }
  scale(e: Matrix4) {
    return Matrix4.prototype.scale.call(this, e), this
  }
  compose(translation: Vector3, rotation: Quaternion, scale: Vector3) {
    return Matrix4.prototype.compose.call(this, translation, rotation, scale), this
  }
  asThreeMatrix4() {
    return this.threeMatrix.set(
      this.elements[0],
      this.elements[4],
      this.elements[8],
      this.elements[12],
      this.elements[1],
      this.elements[5],
      this.elements[9],
      this.elements[13],
      this.elements[2],
      this.elements[6],
      this.elements[10],
      this.elements[14],
      this.elements[3],
      this.elements[7],
      this.elements[11],
      this.elements[15]
    )
  }
}

export const M = MatrixBase
