import * as T from "../webgl/56512"
import {
  RequestRenderCameraCommand,
  RequestRenderContextCommand,
  RequestRenderTargetCameraCommand,
  RequestRenderTargetCommand,
  RequestRenderTargetHeadingCommand,
  RequestTargetCommand
} from "../command/webgl.command"
import { EngineTickState } from "../const/engineTick.const"
import { RttSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import u from "../glsl/17965.glsl"
import v from "../glsl/20367.glsl"
import h from "../glsl/27115.glsl"
import p from "../glsl/87609.glsl"
import d from "../glsl/92393.glsl"
import y from "../glsl/98419.glsl"
import {
  Camera,
  CompressedTexture,
  CubeCamera,
  DataTexture,
  DoubleSide,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  RawShaderMaterial,
  RGBAFormat,
  Scene,
  Texture,
  Vector2,
  Vector4,
  WebGLCubeRenderTarget,
  WebGLRenderer
} from "three"
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget"
import EngineContext from "../core/engineContext"
import { CWFRenderer } from "./webglrender.module"
import { PlaneMesh } from "../webgl/87928"
import { getPlaneGeometry } from "../webgl/56512"

declare global {
  interface SymbolModule {
    [RttSymbol]: RenderToTextureModule
  }
}
const w = {
  circle_projection: new RawShaderMaterial({
    uniforms: {
      textureSampleScale: { value: 5 },
      panoTexture: { value: null },
      borderSize: { value: 0 },
      borderColor: { value: new Vector4(1, 1, 1, 1) }
    },
    depthWrite: !1,
    depthTest: !0,
    side: DoubleSide,
    vertexShader: h,
    fragmentShader: d
  }),
  equirectangular: new RawShaderMaterial({
    uniforms: { cubemap: { value: null }, yaw: { value: 0 } },
    depthWrite: !1,
    depthTest: !1,
    vertexShader: u,
    fragmentShader: p
  }),
  compose: new RawShaderMaterial({
    uniforms: { mask: { value: null }, bg: { value: null } },
    transparent: !0,
    vertexShader: y,
    fragmentShader: v
  })
}

export class RenderTarget {
  _renderer: WebGLRenderer
  _renderTarget: WebGLRenderTarget

  constructor(e, t) {
    this._renderer = e
    this._renderTarget = t
  }

  get target() {
    return this._renderTarget
  }

  get width() {
    return this._renderTarget.width
  }

  get height() {
    return this._renderTarget.height
  }
  //
  // get bpp() {
  //   return 4
  // }

  readRenderTargetData(e?: ArrayBufferLike) {
    const t = this._renderTarget.width
    const i = this._renderTarget.height
    e = e || new Uint8Array(t * i * 4)
    this._renderer.readRenderTargetPixels(this._renderTarget, 0, 0, t, i, e)
    return e
  }

  setSize(e: number, t: number) {
    this._renderTarget.setSize(e, t)
  }

  dispose() {
    this._renderTarget.dispose()
  }
}

const x = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
x.needsUpdate = !0
export default class RenderToTextureModule extends Module {
  circleProjectionPlane: PlaneMesh
  equirectProjectionPlane: PlaneMesh
  composePlane: PlaneMesh
  cachedSize: Vector2
  cachedViewport: Vector4
  cachedViewport2: Vector4
  debugRenderOffset: Number
  engine: EngineContext
  cwfRenderer: CWFRenderer
  renderer: WebGLRenderer
  camera: PerspectiveCamera
  orthoCamera: OrthographicCamera
  scene: Scene

  constructor() {
    super(...arguments)
    this.name = "render-to-texture"
    this.circleProjectionPlane = new PlaneMesh(getPlaneGeometry(), w.circle_projection)
    this.equirectProjectionPlane = new PlaneMesh(getPlaneGeometry(), w.equirectangular)
    this.composePlane = new PlaneMesh(getPlaneGeometry(), w.compose)
    this.cachedSize = new Vector2()
    this.cachedViewport = new Vector4()
    this.cachedViewport2 = new Vector4()
    this.debugRenderOffset = 0
  }

  async init(e, t: EngineContext) {
    this.engine = t
    const i = await t.getModuleBySymbol(WebglRendererSymbol)
    this.cwfRenderer = i.cwfRenderer
    this.renderer = i.threeRenderer
    this.camera = new PerspectiveCamera()
    this.orthoCamera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)
    this.camera.layers.mask = RenderLayers.ALL.mask
    this.scene = new Scene()
    this.scene.name = "rtt"
    this.scene.matrixWorldAutoUpdate = !1
    this.bindings.push(t.commandBinder.addBinding(RequestRenderTargetCommand, async e => new RenderTarget(this.renderer, this.createRenderTarget2D(0))))
    this.bindings.push(
      t.commandBinder.addBinding(RequestRenderContextCommand, async e => {
        this.renderContext(e.renderTarget.target, e.context)
      })
    )
    this.bindings.push(
      t.commandBinder.addBinding(RequestRenderCameraCommand, async e => {
        this.render(e.renderTarget.target, e.sceneObject, e.camera)
      })
    )
    this.bindings.push(
      t.commandBinder.addBinding(RequestRenderTargetHeadingCommand, async e => {
        this.renderEquirectangular(e.texture, e.renderTarget.target, e.heading)
      })
    )
    this.bindings.push(
      t.commandBinder.addBinding(RequestRenderTargetCameraCommand, async e => {
        this.render(e.renderTarget, e.sceneObject, e.camera)
      })
    )
    this.bindings.push(
      t.commandBinder.addBinding(RequestTargetCommand, async e => {
        this.compose(e.target1.target, e.target2.target, e.target2.target)
      })
    )
  }

  getRenderSize() {
    const e = this.renderer.getPixelRatio(),
      t = this.renderer.getSize(this.cachedSize)
    t.width *= e
    t.height *= e
    return t
  }

  onUpdate() {
    this.debugRenderOffset = 0
  }

  createRenderTarget2D(e: number, t = e, i?, s = !0) {
    const o = new WebGLRenderTarget(e, t, i)
    o.texture.generateMipmaps = s
    return o
  }

  clearRenderTarget2D(e) {
    this.renderer.setRenderTarget(e)
    this.renderer.clear()
    this.renderer.setRenderTarget(null)
  }

  disposeRenderTarget2D(e: WebGLRenderTarget | WebGLCubeRenderTarget) {
    e.texture.dispose()
    e.depthTexture && e.depthTexture.dispose()
    e.dispose()
  }

  getRenderTargetData(e, t) {
    const i = e.width,
      s = e.height
    t = t || new Uint8Array(i * s * 4)
    this.renderer.readRenderTargetPixels(e, 0, 0, i, s, t)
    return t
  }

  compose<A extends Texture = DataTexture>(e: WebGLRenderTarget | null, t: A, i = x) {
    const { uniforms } = this.composePlane.material as RawShaderMaterial
    uniforms.bg.value = this.isRenderTarget(t) ? t["texture"] : t
    uniforms.mask.value = this.isRenderTarget(i) ? i["texture"] : i
    this.scene.add(this.composePlane)
    this.overrideRenderTarget(e, () => {
      this.renderer.render(this.scene, this.orthoCamera)
    })
    this.scene.remove(this.composePlane)
    uniforms.bg.value = null
    uniforms.mask.value = null
  }

  copyTexture<A extends Texture = DataTexture>(e: WebGLRenderTarget, t: A) {
    return this.compose(e, t)
  }

  resizeTexture<A extends Texture = DataTexture>(e: A, t: number) {
    const i = new WebGLRenderTarget(t, t)
    e["isCompressedTexture"] ? (i.texture.format = RGBAFormat) : (i.texture.format = e.format)
    i.texture.addEventListener("dispose", i.dispose.bind(i))
    this.copyTexture(i, e)
    return i.texture
  }

  renderToScreen(e, t = !0, i, s) {
    ;(t ? Promise.resolve() : this.engine.after(EngineTickState.Render)).then(() => {
      const t = this.isRenderTarget(e) ? e.width : e.image.width,
        o = this.isRenderTarget(e) ? e.height : e.image.height,
        r = i ? i.x : this.debugRenderOffset,
        n = i ? i.y : 60
      this.renderer.getViewport(this.cachedViewport)
      this.renderer.setViewport(r, n, t, o)
      this.compose(null, e, s)
      this.renderer.setViewport(this.cachedViewport)
      !i && (this.debugRenderOffset += t + 4)
    })
  }

  isRenderTarget(e) {
    return e.hasOwnProperty("texture")
  }

  renderContext(e, t) {
    e.texture.image = t.canvas
    e.texture.needsUpdate = !0
  }

  render(e: WebGLRenderTarget | WebGLCubeRenderTarget, t: Object3D, i: Camera, s?) {
    const o = t.parent
    o && this.scene.applyMatrix4(o.matrixWorld)
    this.scene.add(t)
    if (e instanceof WebGLCubeRenderTarget) {
      const t = new CubeCamera(0.01, 1e3, e)
      i.getWorldPosition(t.position)
      i.getWorldQuaternion(t.quaternion)
      this.scene.add(t)
      this.scene.updateMatrixWorld()
      t.layers.mask = s ? s.mask : i.layers.mask
      t.update(this.renderer, this.scene)
      this.scene.remove(t)
    } else {
      i.getWorldPosition(this.camera.position)
      i.getWorldQuaternion(this.camera.quaternion)
      this.camera.projectionMatrix.copy(i.projectionMatrix)
      this.camera.layers.mask = s ? s.mask : i.layers.mask
      const t = this.renderer.getSize(this.cachedSize),
        o = t.width / t.height,
        r = e.width / e.height,
        n = this.camera.projectionMatrix
      o > r ? (n.elements[0] = n.elements[5] / r) : (n.elements[5] = n.elements[0] * r)
      this.overrideRenderTarget(e, () => {
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
      })
    }

    if (o) {
      o.add(t)
      this.scene.matrixWorld.identity()
    }
    this.scene.remove(t)
    return e
  }

  setScissors(e, t) {
    if (e) {
      if (!t) throw Error("Rect to restrict rendering to required when enabling scissors.")
      this.renderer.setScissorTest(!0)
      this.renderer.setScissor(t.x, t.y, t.width, t.height)
    } else {
      const e = this.renderer.getSize(this.cachedSize)
      this.renderer.setScissor(0, 0, e.width, e.height)
      this.renderer.setScissorTest(!1)
    }
  }

  renderSphericalProjection(e, t, i, s, o) {
    const r = w.circle_projection
    r.uniforms.borderColor.value.copy(o || new Vector4(1, 1, 1, 1))
    r.uniforms.borderSize.value = s || 0
    r.uniforms.textureSampleScale.value = i || 5
    r.uniforms.panoTexture.value = e
    this.scene.add(this.circleProjectionPlane)
    this.circleProjectionPlane.position.z = 0
    this.overrideRenderTarget(t, () => {
      this.renderer.render(this.scene, this.orthoCamera)
    })
    this.scene.remove(this.circleProjectionPlane)
    r.uniforms.panoTexture.value = null
  }

  renderEquirectangular(e, t, i = 0) {
    const s = this.equirectProjectionPlane.material as RawShaderMaterial
    s.uniforms.cubemap.value = e
    s.uniforms.yaw.value = i
    this.scene.add(this.equirectProjectionPlane)
    this.equirectProjectionPlane.position.z = 0
    this.overrideRenderTarget(t, () => {
      this.renderer.render(this.scene, this.orthoCamera)
    })
    this.scene.remove(this.equirectProjectionPlane)
    s.uniforms.cubemap.value = null
    s.uniforms.yaw.value = 0
  }

  overrideRenderTarget(e: WebGLRenderTarget | null, t) {
    const i = this.renderTargetSwap(e)
    t()
    this.renderTargetRestore(i)
  }

  renderTargetSwap(e: WebGLRenderTarget | null) {
    const t = this.renderer.xr.enabled
    const i = this.renderer.getRenderTarget()
    const s = this.renderer.getViewport(this.cachedViewport2)
    this.renderer.xr.enabled = !1
    this.renderer.setRenderTarget(e)
    return { xr: t, rtt: i, viewport: s }
  }

  renderTargetRestore(e) {
    this.renderer.xr.enabled = e.xr
    this.renderer.setRenderTarget(e.rtt)
    this.renderer.setViewport(e.viewport)
  }

  renderAndReadAsync(e, t, i) {
    const s = i.buffer
    if (!this.renderer.capabilities.isWebGL2) {
      this.log.debug("renderAsync call webgl2, falling back to sync render/read")
      this.render(e.target, e.mesh, e.camera)
      return Promise.resolve(this.getRenderTargetData(e.target, s))
    }

    const o = this.renderTargetSwap(e.target),
      r = this.renderer.getContext() as WebGL2RenderingContext,
      n = i.webglBuffer || r.createBuffer()
    if (!n) throw Error("Unable to create pack buffer")
    r.bindBuffer(r.PIXEL_PACK_BUFFER, n)
    r.bufferData(r.PIXEL_PACK_BUFFER, s.byteLength, r.DYNAMIC_READ)
    e.clear && this.renderer.clear()
    this.renderer.render(e.mesh, e.camera)
    r.readPixels(t.x, t.y, t.width, t.height, r.RGBA, r.UNSIGNED_BYTE, 0)
    r.bindBuffer(r.PIXEL_PACK_BUFFER, null)
    this.renderTargetRestore(o)
    return this.cwfRenderer
      .fence(r)
      .then(
        () => (
          r.bindBuffer(r.PIXEL_PACK_BUFFER, n),
          r.getBufferSubData(r.PIXEL_PACK_BUFFER, 0, s),
          r.bindBuffer(r.PIXEL_PACK_BUFFER, null),
          !i.webglBuffer && r.deleteBuffer(n),
          s
        )
      )
  }
}
