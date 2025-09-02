import a from "../glsl/77256.glsl"
import { CheckThreshold } from "../utils/49827"
import { LoadTexture } from "../utils/loadTexture"
import * as m from "./87928"
import { PickingPriorityType } from "../const/12529"
import { ColorSpace } from "../const/color.const"
import r from "../glsl/62118.glsl"
import {
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RawShaderMaterial,
  SphereGeometry,
  Texture,
  UniformsUtils,
  Vector3
} from "three"
import { CameraData } from "../data/camera.data"

class PinShaderMaterial extends RawShaderMaterial {
  constructor(e, t) {
    const i = UniformsUtils.clone(PinShaderMaterial.uniforms)
    i.tMask.value = e
    i.tPinHole.value = t
    super({ vertexShader: a, fragmentShader: r, uniforms: i, name: "PinMaterial", transparent: !0 })
  }
  static uniforms = {
    tMask: { type: "t", value: null },
    tPinHole: { type: "t", value: null },
    pinColor: { type: "c", value: new Color() },
    opacity: { type: "f", value: 1 }
  }
}

import pinMaskImagePath from "../images/360_placement_pin_mask.png"
import { PlaneMesh } from "./87928"
export class PinMesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Mesh<
  TGeometry,
  TMaterial
> {}
let v: Texture
const loadPinMaskTexture = () => v || ((v = LoadTexture(pinMaskImagePath)), v)
export class PinMeshObject extends PlaneMesh<PlaneGeometry, PinShaderMaterial> {
  cameraData: CameraData
  _collider: PinMesh<typeof PinMeshObject.colliderGeometry, typeof PinMeshObject.colliderMaterial>
  static colliderGeometry = new SphereGeometry(1.5 * 0.65)
  static colliderMaterial = new MeshBasicMaterial({ transparent: !0, opacity: 0.5, depthWrite: !1, color: 16724312 })
  opacityProgress: number
  shouldHide: boolean
  uniforms: any
  selected: number
  static FADE_DURATION = 500
  constructor(e, t, i, n) {
    const s = new PinShaderMaterial(loadPinMaskTexture(), t)
    super(PinMeshObject.geometry, s)
    this.layers.mask = n.mask
    this.name = "PinMesh"
    this.cameraData = i
    this._collider = new PinMesh(PinMeshObject.colliderGeometry, PinMeshObject.colliderMaterial)
    this._collider.name = "PinMeshCollider"
    this._collider.material.visible = !1
    this.add(this._collider)
    this.opacityProgress = 0
    this.shouldHide = !0
    this.uniforms = s.uniforms
    this.unhover()
    this.selected = 0
    this.visible = !1
    this.position.copy(e)
    this.renderOrder = PickingPriorityType.pins360
  }
  static geometry = new PlaneGeometry(1.5, 1.5)
  updatePosition(e: Vector3) {
    this.position.copy(e)
  }
  get collider() {
    return this._collider
  }
  render(e: number) {
    this.quaternion.copy(this.cameraData.pose.rotation)
    null === this.uniforms.tPinHole.value
      ? (this.opacityProgress = 0)
      : !this.shouldHide && this.opacityProgress < 1
        ? (this.opacityProgress += e / PinMeshObject.FADE_DURATION)
        : this.shouldHide && this.opacityProgress > 0 && (this.opacityProgress -= e / PinMeshObject.FADE_DURATION)
    this.opacityProgress = CheckThreshold(this.opacityProgress, 0, 1)
    this.uniforms.opacity.value = this.opacityProgress
    this.visible = 0 !== this.opacityProgress
  }
  activate() {
    this.shouldHide = !1
  }
  deactivate() {
    this.shouldHide = !0
  }
  dispose() {
    this.collider.geometry.dispose(), this.collider.material.dispose()
  }
  setPinHover(e: number, t = !0, i = !0) {
    const n = Math.min(Math.max(e, 0), 1)
    this.selected !== n &&
      (i && this.uniforms.pinColor.value.copy(ColorSpace.WHITE).lerp(ColorSpace.MP_BRAND, n),
      t && n > 0 && n <= 1 && (this.material.depthTest = !1),
      0 === n && (this.material.depthTest = !0),
      (this.selected = n))
  }
  unhover() {
    this.uniforms.pinColor.value.copy(ColorSpace.WHITE)
  }
}
