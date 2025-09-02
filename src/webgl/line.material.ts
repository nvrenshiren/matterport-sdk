import { RawShaderMaterial, Texture, UniformsUtils, ShaderMaterialParameters, Vector2, Color, ColorRepresentation, LineBasicMaterial } from "three"
import { defaultLineWidth } from "../const/66990"
import { LineShader } from "./line.shader"

export type LineMaterialParameters = ShaderMaterialParameters & {
  color?: ColorRepresentation
  linewidth?: number
  dashed?: boolean
  dashScale?: number
  dashSize?: number
  gapSize?: number
  resolution?: Vector2
}

export class LineMaterial extends RawShaderMaterial {
  parameters: LineMaterialParameters
  hoverTexture?: Texture
  defaultTexture?: Texture
  selectedWidth: number
  isLineMaterial: boolean
  defaultWidth: number
  constructor(parameters: LineMaterialParameters, hoverTexture?: Texture, defaultTexture?: Texture, selectedWidth = defaultLineWidth.lineSelected) {
    super()
    this.parameters = parameters
    this.hoverTexture = hoverTexture
    this.defaultTexture = defaultTexture
    this.selectedWidth = selectedWidth
    this.type = "LineMaterial"
    this.isLineMaterial = !0
    this.defaultWidth = defaultLineWidth.lineDefault
    this.setValues({
      uniforms: UniformsUtils.clone(LineShader.line.uniforms),
      vertexShader: LineShader.line.vertexShader,
      fragmentShader: LineShader.line.fragmentShader,
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      opacity: 1
    })
    this.setValues(parameters)
    defaultTexture && (this.mask = defaultTexture)
    this.defaultWidth = parameters && parameters.linewidth ? parameters.linewidth : defaultLineWidth.lineDefault
  }
  updateSelected(value: boolean) {
    const texture = value ? this.hoverTexture : this.defaultTexture
    texture && this.mask !== texture && ((this.mask = texture), value ? this.setLinewidth(this.selectedWidth) : this.setLinewidth(this.defaultWidth))
  }
  setLinewidth(value: number) {
    this.uniforms.linewidth || (this.uniforms = UniformsUtils.clone(LineShader.line.uniforms))
    this.getLinewidth() !== value && (this.uniforms.linewidth.value = value)
  }
  getLinewidth() {
    return this.uniforms.linewidth.value
  }
  get color(): Color {
    return this.uniforms.diffuse.value
  }
  set color(value: Color) {
    this.uniforms.diffuse.value = value
  }
  getOpacity() {
    return this.uniforms.opacity.value
  }
  setOpacity(value: number) {
    this.uniforms || (this.uniforms = UniformsUtils.clone(LineShader.line.uniforms))
    this.getOpacity() !== value && (this.uniforms.opacity.value = value)
  }
  get dashScale(): number {
    return this.uniforms.dashScale.value
  }
  set dashScale(value: number) {
    this.uniforms.dashScale.value = value
  }
  set dashed(value: boolean) {
    value ? (this.defines.USE_DASH = "") : delete this.defines.USE_DASH, (this.needsUpdate = !0)
  }
  get dashed(): boolean {
    return "USE_DASH" in this.defines
  }
  get dashSize() {
    return this.uniforms.dashSize.value
  }
  set dashSize(value: number) {
    this.uniforms.dashSize.value = value
  }
  get gapSize(): number {
    return this.uniforms.gapSize.value
  }
  set gapSize(value: number) {
    this.uniforms.gapSize.value = value
  }
  get resolution() {
    return this.uniforms.resolution.value
  }
  set resolution(value: Vector2) {
    this.uniforms.resolution.value = value
  }
  set mask(value: Texture) {
    this.uniforms.mask.value !== value &&
      (value ? (this.defines.USE_MASK = "") : delete this.defines.USE_MASK, (this.uniforms.mask.value = value), (this.needsUpdate = !0))
  }
  get mask() {
    return this.uniforms.mask.value as Texture
  }
  copy(e: LineMaterial) {
    RawShaderMaterial.prototype.copy.call(this, e)
    this.parameters = e.parameters
    this.color.copy(e.color)
    this.defaultWidth = e.defaultWidth
    this.setLinewidth(e.getLinewidth())
    this.resolution.copy(e.resolution)
    this.defaultTexture = e.defaultTexture
    this.hoverTexture = e.hoverTexture
    this.mask = e.mask
    this.setOpacity(e.getOpacity())
    this.dashed = e.dashed
    this.dashScale = e.dashScale
    this.dashSize = e.dashSize
    this.gapSize = e.gapSize
    return this
  }
}
