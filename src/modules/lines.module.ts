import { Color, LinearFilter, RawShaderMaterial, Texture, UniformsUtils, Vector2, Vector3 } from "three"
import { ShowcaseLineSegments } from "../webgl/line.segments"
import * as m from "../const/66990"
import { LinesSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { LoadTexture } from "../utils/loadTexture"
import { LineMaterial } from "../webgl/line.material"
import { LineShader } from "../webgl/line.shader"
import { ChildIDS } from "../webgl/showcase.scene"
declare global {
  interface SymbolModule {
    [LinesSymbol]: LinesModule
  }
}
enum LineEventType {
  END_DEFAULT = 2,
  END_HOVER = 3,
  LINE_DEFAULT = 0,
  LINE_HOVER = 1
}
class LineTexture {
  textures: Record<LineEventType, Texture>
  constructor() {
    const t = LoadTexture(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAJ1BMVEUAAAD///////////////////////////////////////////////+uPUo5AAAADHRSTlMA4ZNBI+fLwLSGYE5aqgIgAAAAlUlEQVQoz2MAAy91mYNFSxjgwEjmDBAcVIbxPWPOgMHRKRA+c88ZKDhhABbYdgYOssEKchACx0BKPM4ggRagwBxkgZNAHTHIAkcNGJjOoAAFBkdUARGGNagCpxh0UAUOMdSgChxnkEEVOMhwBg1gCGBowTAUw1oMh2E4HcNzGN5HDyCMIMQIZPRowIgozKjEjGyM5AAACSg5ooJJElsAAAAASUVORK5CYII="
    )
    const e = LoadTexture(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAD/AVL/AVL/AVL/AVL/AVL/AVL/AVL/AVL/AVL/AVL/AVL/////+fr/5er/0tv/ytX/iaH/dJL/cpA84uD/AAAAC3RSTlMA45NBI8vAtIZgTrS8MGcAAAC5SURBVDjLhVPtDoQgDBuICPKpvP+7Xs4t6LlL2j9GWtYCG91w0XqTkvE2OtJYrEkTxi4v2gWhpyS4n+1bUtgeRfY1/cG6z/3Ma8Ui/rP+6LWU2sd04RxBfs+WBe2UpXAZSP4jP3DIWb4m9ua1whI5w/XzC+xiHEWWtreg8XoUh5EVhnj469u1oF+EJ45QtaByCGKrogWFGSiAFjAkPCa8KHjV6LHgc6OGgS2Hmha2PR4cPHp4eOH4fwAGdiPh+RS0GAAAAABJRU5ErkJggg=="
    )
    const i = LoadTexture(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAIBAMAAABqq+CcAAAAD1BMVEUAAAD///////////////+PQt5oAAAABHRSTlMAy4AzqjrmZgAAABRJREFUCNdjAAMjERcXR2Uwc4AEAIn2CZHn9cAcAAAAAElFTkSuQmCC"
    )
    const s = LoadTexture(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAIBAMAAABqq+CcAAAAGFBMVEUAAAD/AVL/AVL/AVL/////AVL/r7//OWiicYg+AAAABHRSTlMAy4AzqjrmZgAAABlJREFUCNdjYGBgVgwtcwGC9FAhAyB3YAQAVg4X6a0jaXAAAAAASUVORK5CYII="
    )
    this.textures = { [LineEventType.LINE_DEFAULT]: i, [LineEventType.LINE_HOVER]: s, [LineEventType.END_DEFAULT]: t, [LineEventType.END_HOVER]: e }
    i.minFilter = LinearFilter
    s.minFilter = LinearFilter
    t.minFilter = LinearFilter
    e.minFilter = LinearFilter
  }
  get(t: LineEventType) {
    return this.textures[t]
  }
  dispose() {
    for (const t in this.textures) {
      const e = Number(t)
      this.get(e).dispose()
    }
  }
}
export class LineEndpointMaterial extends RawShaderMaterial {
  color: any
  defaultTex: any
  hoverTex: any
  constructor(t, e, i) {
    const s = UniformsUtils.clone(LineShader.endpoint.uniforms)
    super({
      fragmentShader: LineShader.endpoint.fragmentShader,
      vertexShader: LineShader.endpoint.vertexShader,
      uniforms: s,
      name: "LineEndpointMaterial",
      transparent: !0,
      depthWrite: !1,
      depthTest: !0
    }),
      (this.color = t),
      (this.defaultTex = e),
      (this.hoverTex = i),
      (this.uniforms.bg.value = e),
      this.uniforms.color.value.copy(this.color)
  }
  clone() {
    return new LineEndpointMaterial(this.color, this.defaultTex, this.hoverTex).copy(this) as this
  }
  setOpacity(t: number) {
    this.uniforms && t !== this.uniforms.opacity.value && (this.uniforms.opacity.value = t)
  }
  getOpacity() {
    return this.uniforms.opacity.value
  }
  updateHovered(t) {
    const e = t ? this.hoverTex : this.defaultTex
    this.uniforms.bg.value !== e && (this.uniforms.bg.value = e)
  }
}
let g: LineTexture | null = null
function getLineTexture() {
  return g || (g = new LineTexture()), g
}
export default class LinesModule extends Module {
  scene: any
  canvas: any
  cameraData: any
  cameraPosition: Vector3
  segments: ShowcaseLineSegments[]
  constructor() {
    super(...arguments), (this.name = "lines")
  }
  async init(t, e) {
    const i = await e.getModuleBySymbol(WebglRendererSymbol)
    ;(this.scene = i.getScene()),
      (this.canvas = await e.market.waitForData(CanvasData)),
      (this.cameraData = await e.market.waitForData(CameraData)),
      this.bindings.push(this.canvas.onChanged(this.onCanvasChange.bind(this))),
      (this.cameraPosition = new Vector3()),
      (this.segments = [])
  }
  onUpdate() {
    this.cameraPosition.copy(this.cameraData.pose.position)
  }
  dispose(t) {
    super.dispose(t), this.segments.forEach(t => t.dispose())
  }
  makeLine(t, e, i, s, n = () => !1) {
    const o = n() ? m.iV.OFFSET_TOWARDS_CAMERA : 0,
      a = n() ? t => this.cameraPosition.clone().sub(t).setLength(o).add(t) : t => t,
      h = new ShowcaseLineSegments(
        t,
        e,
        i,
        {
          beforeUpdatePositions: a,
          onShow: () => h.children.forEach(t => this.scene.addChild(ChildIDS.Root, t)),
          onHide: () => h.children.forEach(t => this.scene.removeChild(ChildIDS.Root, t))
        },
        s
      )
    return h.updateResolution(this.canvas.width, this.canvas.height), h.opacity(1), h.show(), h.updatePositions(t, e), this.segments.push(h), h
  }
  makeLineMaterial(t, e, i = {}, s, n) {
    return makeLineMaterial(t, e, i, s, n)
  }
  makeEndpointMaterial(t, e, i) {
    return makeEndpointMaterial(t, e, i)
  }
  onCanvasChange(t) {
    for (const e of this.segments) e.updateResolution(t.width, t.height)
  }
}
export function makeEndpointMaterial(t, e, i) {
  const s = i || getLineTexture().get(LineEventType.END_HOVER),
    n = e || getLineTexture().get(LineEventType.END_DEFAULT)
  return new LineEndpointMaterial(new Color(t), n, s)
}
export function makeLineMaterial(t: number, e: boolean, i: any = {}, s?: Texture, n?: Texture) {
  const r = n || getLineTexture().get(LineEventType.LINE_HOVER)
  const a = s || getLineTexture().get(LineEventType.LINE_DEFAULT)
  const d = new Vector2(window.innerWidth, window.innerHeight)
  return e ? new LineMaterial(Object.assign({ color: new Color(t), resolution: d }, i), r, a) : new LineMaterial(Object.assign({ color: new Color(t) }, i))
}
