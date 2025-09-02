import { AlwaysStencilFunc, BoxGeometry, ColorRepresentation, KeepStencilOp, MathUtils, MeshBasicMaterial, Object3D, Quaternion, ReplaceStencilOp } from "three"

import { Text, preloadFont } from "troika-three-text"
import { RenderLayer } from "../core/layers"
import { ISubscription } from "../core/subscription"
import { transformPoint } from "../math/59370"
import { calculateFieldOfView } from "../math/81729"
import { CheckThreshold } from "../utils/49827"
import { LabelMakerMesh } from "./label.maker.mesh"
export enum ScaleType {
  WORLD = "world",
  NDC = "ndc"
}
// configureTextBuilder({ unicodeFontsURL: "https://static.matterport.com/webgl-vendors/unicode-font-resolver/1.0.1/" })

export class TextLabel extends Object3D {
  config: TextRenderer["currentTextConfig"]
  scaleType: ScaleType
  unscaledWidth: number
  unscaledHeight: number
  labelTextMaterial: MeshBasicMaterial
  bindings: ISubscription[]
  labelBackgroundMesh: LabelMakerMesh
  collider: LabelMakerMesh
  labelTextMesh: Text
  aspect: number
  _onGeomUpdate: any
  constructor(t: TextRenderer["currentTextConfig"], e = ScaleType.WORLD) {
    super()
    this.config = t
    this.scaleType = e
    this.unscaledWidth = 0
    this.unscaledHeight = 0
    this.labelTextMaterial = new MeshBasicMaterial()
    this.bindings = []
    const l = this.config.background || this.config.backgroundAsCollider
    if (l) {
      this.config.backgroundOpacity = this.config.backgroundOpacity || 1
      this.config.backgroundOpacity = this.config.background ? this.config.backgroundOpacity : 0
      const e = new BoxGeometry(1, 1, 0.01)
      const i = new MeshBasicMaterial({
        color: t.backgroundColor,
        transparent: !0,
        depthTest: this.config.backgroundOpacity > 0 && !t.disableDepth,
        depthWrite: this.config.backgroundOpacity > 0 && !t.disableDepth,
        opacity: this.config.backgroundOpacity,
        stencilRef: 1,
        stencilFail: KeepStencilOp,
        stencilZFail: KeepStencilOp,
        stencilZPass: ReplaceStencilOp,
        stencilFunc: AlwaysStencilFunc,
        stencilWrite: !0
      })
      this.labelBackgroundMesh = new this.config.backgroundColliderType(e, i)
      this.labelBackgroundMesh.position.z = -0.01
      this.labelBackgroundMesh.name = "Label Background"
      this.collider = this.labelBackgroundMesh
      this.add(this.labelBackgroundMesh)
    }
    const h = (this.labelTextMesh = new Text())
    h.material = this.labelTextMaterial
    h.name = "Label Text"
    h.text = t.text || ""
    h.renderOrder = 10
    h.font = `${t.assetBasePath || ""}${t.fontPath}`
    h.lang = t.lang
    h.fontSize = 1
    h.fontWeight = 700
    h.anchorX = "50%"
    h.anchorY = "50%"
    h.outlineWidth = t.outline ? t.outlineWidth : 0
    h.maxWidth = t.wordWrapWidth
    h.textAlign = t.align
    h.depthOffset = t.depthOffset || 0
    l && (h.raycast = () => {})
    h.addEventListener("synccomplete", () => {
      const [e, i, s, o] = h.textRenderInfo.visibleBounds
      let a = s - e
      let r = o - i
      l && ((a += this.config.backgroundBorderWidth), (r += this.config.backgroundBorderHeight), this.labelBackgroundMesh.scale.set(a, r, 1))
      this.unscaledWidth = a
      this.unscaledHeight = r
      this.aspect = a / Math.max(r, 0.001)
      h.position.set((e + s) / -2, (i + o) / -2, 0)
      this._onGeomUpdate?.call(this)
    })
    this.scaleFactor = t.scale || 1
    this.opacity = t.opacity || 1
    this.setColor(t.color || 0)
    this.add(h)
    h.sync()
    this.name = "Label Container"
  }
  dispose() {
    this.bindings.forEach(t => t.cancel())
    this.labelTextMesh.dispose()
  }
  onGeomUpdate(t) {
    this._onGeomUpdate = t
  }
  get text() {
    return this.config.text
  }
  set text(t) {
    this.config.text = t
    this.labelTextMesh.text = t
    this.labelTextMesh.sync()
  }
  get mesh() {
    return this.labelTextMesh
  }
  getUnscaledSize() {
    return { width: this.unscaledWidth, height: this.unscaledHeight }
  }
  get scaleFactor() {
    return this.config.scale
  }
  set scaleFactor(t) {
    this.config.scale = t
    this.scale.setScalar(t)
  }
  get opacity() {
    return void 0 !== this.config.opacity ? this.config.opacity : 1
  }
  set opacity(t) {
    if (t !== this.config.opacity) {
      this.config.opacity = t
      const e = t > 0 && !this.config.disableDepth
      if (this.config.background) {
        const i = this.labelBackgroundMesh.material
        i.opacity = Math.min(this.config.backgroundOpacity || 1, t)
        i.depthWrite = t > 0.15
        i.depthTest = e
      }
      const i = this.labelTextMaterial
      i.opacity = t
      i.depthTest = e
      this.visible = t > 0
    }
  }
  setColor(t: ColorRepresentation) {
    this.labelTextMaterial.color.set(t)
  }
  setRenderLayer(t: RenderLayer) {
    this.labelTextMesh.layers.mask = t.mask
    this.labelBackgroundMesh && (this.labelBackgroundMesh.layers.mask = t.mask)
  }
  setRenderOrder(t: number) {
    this.renderOrder = t
    this.labelTextMesh.renderOrder = t
    this.labelBackgroundMesh && (this.labelBackgroundMesh.renderOrder = t)
  }
  setPosition(t, e = t => t) {
    this.position.copy(e(t))
  }
  setOrientation(t: Quaternion, e = 0) {
    this.quaternion.copy(t)
    0 !== e && this.rotateZ(-e * MathUtils.DEG2RAD)
  }
  scaleBillboard(t, e, i, s, o, r, h = d.SCALE_DEFAULT) {
    if (0 !== i.elements[15]) this.scaleFactor = 0.2 * h * s * (d.ORTHO_IDEAL_HEIGHT / o)
    else {
      const u = transformPoint(this.position, t, e, i.asThreeMatrix4())
      const p = Math.abs(u.x)
      if (p < 1) {
        const e = calculateFieldOfView(i, t, this.position, o, h)
        const a = (CheckThreshold(r, 1, 2.5) + s) * d.SCALE_ASPECT
        const u = 1 + d.SCALE_NDC - p * d.SCALE_NDC - a
        const m = Math.max(Math.min((1 / e) * u, 3), 0.001)
        this.scaleType === ScaleType.NDC ? (this.scaleFactor = m) : (this.scaleFactor = Math.min(m * d.NDC_MULT, h * d.SCALE_WORLD))
      } else {
        this.scaleFactor = 0.001
      }
    }
  }
}
const d = { SCALE_DEFAULT: 0.1, SCALE_WORLD: 4, SCALE_NDC: 0.5, SCALE_ASPECT: 0.035, DEPTH_WRITE_THRESHOD: 0.15, ORTHO_IDEAL_HEIGHT: 1500, NDC_MULT: 1.15 }
//字体图标
export class TextRenderer {
  currentTextConfig: typeof TextRenderer.defaultTextConfig
  static defaultTextConfig = {
    opacity: void 0 as undefined | number,
    lang: "",
    depthOffset: void 0,
    disableDepth: void 0,
    backgroundOpacity: 1,
    assetBasePath: "" as undefined | string | null,
    text: "",
    fontPath: "fonts/roboto-700.woff",
    // fontPath: "",
    align: "center",
    wordWrapWidth: void 0,
    color: "black",
    backgroundColor: "white",
    backgroundBorderWidth: 0.9,
    backgroundBorderHeight: 0.7,
    background: !0,
    backgroundAsCollider: !0,
    backgroundColliderType: LabelMakerMesh,
    scale: 1,
    outline: !1,
    outlineWidth: 0.06
  }
  constructor(t?: Partial<TextRenderer["currentTextConfig"]>) {
    this.currentTextConfig = TextRenderer.defaultTextConfig
    t ? this.updateTextStyle(t) : this.updateTextStyle(TextRenderer.defaultTextConfig)
  }
  updateTextStyle(t: Partial<TextRenderer["currentTextConfig"]>) {
    this.currentTextConfig = Object.assign(Object.assign({}, this.currentTextConfig), t)
  }
  createLabel(t: Partial<TextRenderer["currentTextConfig"]> = { text: "" }) {
    return new TextLabel(Object.assign(Object.assign({}, this.currentTextConfig), t))
  }
  async preload(t: Partial<TextRenderer["currentTextConfig"]> = { text: "" }) {
    const e = Object.assign(Object.assign({}, this.currentTextConfig), t)
    return new Promise(t => {
      preloadFont({ font: `${e.assetBasePath || ""}${e.fontPath}`, characters: e.text }, t)
    })
  }
  static makeConfig(t: Partial<TextRenderer["currentTextConfig"]>) {
    return Object.assign(Object.assign({}, TextRenderer.defaultTextConfig), t)
  }
}
