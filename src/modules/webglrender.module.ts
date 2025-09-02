import b from "../glsl/13969.glsl"
const f = (e: number, t: Euler) => {
  switch (e) {
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_X:
      t.set(0, -Math.PI / 2, 0)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_X:
      t.set(0, Math.PI / 2, 0)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Y:
      t.set(Math.PI / 2, Math.PI, 0)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Y:
      t.set(-Math.PI / 2, Math.PI, 0)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Z:
      t.set(0, -Math.PI, 0)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Z:
      t.set(0, 0, 0)
  }
}

import { EngineTickState } from "../const/engineTick.const"
import { Module } from "../core/module"
import { SettingsData } from "../data/settings.data"

import {
  BackSide,
  BoxGeometry,
  BufferAttribute,
  Color,
  CubeCamera,
  DataTexture,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  Mesh,
  NoBlending,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Scene,
  Texture,
  UniformsUtils,
  Vector2,
  WebGLCubeRenderTarget,
  WebGLRenderer
} from "three"
import { WorldPositionChangeCommand } from "../command/webgl.command"
import { PickingPriorityType } from "../const/12529"
import { PanoSize } from "../const/76609"
import { ModelShaderConfig } from "../const/97178"
import { WebglRendererSymbol } from "../const/symbol.const"
import { CubeMapPositive } from "../const/webgl.const"
import EngineContext from "../core/engineContext"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { WEBGLGENERICError, WEBGLUNSUPPORTEDError } from "../error/webgl.error"
import S from "../glsl/74696.glsl"
import { getScreenAndNDCPosition } from "../math/59370"
import { PixelRatioChangedMessage, WebglRendererContextLostMessage, WebglRendererContextRestoredMessage } from "../message//webgl.message"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { SymbolLoadedMessage } from "../other/2032"
import { EventsSubscription } from "../subscription/events.subscription"
import { basicShader } from "../webgl/basic.shader"
import { ShowCaseScene } from "../webgl/showcase.scene"

const cubemapShader = {
  copyCubeMap: {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: null
      },
      alpha: {
        type: "f",
        value: 1
      }
    },
    vertexShader: b,
    fragmentShader: S
  }
}
const cubemapTextureConfig = {
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 3e-6, 229e-6, 0.005977, 0.060598, 0.24173, 0.382925, 0.24173, 0.060598, 0.005977, 229e-6, 3e-6, 0, 0, 0, 0, 0, 0, 0],
  2: [
    0, 0, 1e-6, 1e-5, 78e-6, 489e-6, 0.002403, 0.009245, 0.027835, 0.065591, 0.120978, 0.174666, 0.197413, 0.174666, 0.120978, 0.065591, 0.027835, 0.009245,
    0.002403, 489e-6, 78e-6, 1e-5, 1e-6, 0, 0
  ],
  3: [
    48e-6, 169e-6, 538e-6, 0.001532, 0.003907, 0.008921, 0.018247, 0.033432, 0.054867, 0.080658, 0.106212, 0.125283, 0.132372, 0.125283, 0.106212, 0.080658,
    0.054867, 0.033432, 0.018247, 0.008921, 0.003907, 0.001532, 538e-6, 169e-6, 48e-6
  ],
  4: [
    0.001133, 0.002316, 0.00445, 0.008033, 0.013627, 0.021724, 0.032542, 0.04581, 0.0606, 0.075333, 0.088001, 0.096603, 0.099654, 0.096603, 0.088001, 0.075333,
    0.0606, 0.04581, 0.032542, 0.021724, 0.013627, 0.008033, 0.00445, 0.002316, 0.001133
  ],
  5: [
    0.004571, 0.00723, 0.010989, 0.016048, 0.022521, 0.03037, 0.039354, 0.049003, 0.058632, 0.067411, 0.074476, 0.079066, 0.080657, 0.079066, 0.074476,
    0.067411, 0.058632, 0.049003, 0.039354, 0.03037, 0.022521, 0.016048, 0.010989, 0.00723, 0.004571
  ],
  6: [
    0.009379, 0.012899, 0.017256, 0.022453, 0.028417, 0.034983, 0.041888, 0.048784, 0.055264, 0.060893, 0.065262, 0.068032, 0.068981, 0.068032, 0.065262,
    0.060893, 0.055264, 0.048784, 0.041888, 0.034983, 0.028417, 0.022453, 0.017256, 0.012899, 0.009379
  ],
  7: [
    0.014185, 0.01793, 0.022207, 0.02695, 0.032045, 0.037335, 0.042622, 0.047676, 0.052254, 0.056116, 0.059048, 0.06088, 0.061504, 0.06088, 0.059048, 0.056116,
    0.052254, 0.047676, 0.042622, 0.037335, 0.032045, 0.02695, 0.022207, 0.01793, 0.014185
  ]
}
export class CWFRenderer {
  threeRenderer: WebGLRenderer
  cachedSize: Vector2
  renderToCubeMap: (l: any, c: any, d: any, u: any, h: any, p: any, m: any, f: any, v: any, y: any, b: any, E: any, S: any, O?: any, T?: any, _?: any) => void
  contextLost: boolean
  copyCubemap: (c: any, d: any, u?: any, h?: any, p?: any) => void
  blurCubemap: (t: any, o: any, l?: number, c?: number) => void
  _maxCubemapSize: number
  _maxTextureSize: number
  _gpuInfo: { vendor: any; renderer: any }
  constructor(e) {
    this.threeRenderer = e
    this.cachedSize = new Vector2()
    this.renderToCubeMap = (() => {
      let e: Scene,
        t: OrthographicCamera,
        n: RawShaderMaterial,
        s: PlaneGeometry,
        r: Mesh,
        a = !1
      const o = 0.5
      return (l, c, d, u, h, p, m, f, v, y, b, E, S, O?, T?, _?) => {
        if (this.contextLost) return
        if (!a) {
          t = new OrthographicCamera(-0.5, o, o, -0.5, -200, 200)
          t.position.z = 150
          e = new Scene()
          e.name = "rttCube"
          e.add(t)
          n = new RawShaderMaterial({
            uniforms: {
              tDiffuse: {
                value: null
              },
              alpha: {
                value: 1
              }
            },
            vertexShader: basicShader.basicTextured.vertexShader,
            fragmentShader: basicShader.basicTextured.fragmentShader,
            depthWrite: !1,
            depthTest: !1,
            side: DoubleSide
          })
          s = new PlaneGeometry(1, 1)
          r = new Mesh(s, n)
          r.position.z = 0
          e.add(r)
          a = !0
        }
        const w = s.getAttribute("uv") as BufferAttribute
        w.setUsage(DynamicDrawUsage)
        w.needsUpdate = !0
        const A = w.array
        const N = h / d
        const I = p / u
        const P = m / d
        const x = f / u
        //@ts-ignore
        A[0] = N
        //@ts-ignore
        A[1] = I + x
        //@ts-ignore
        A[2] = N + P
        //@ts-ignore
        A[3] = I + x
        //@ts-ignore
        A[4] = N
        //@ts-ignore
        A[5] = I
        //@ts-ignore
        A[6] = N + P
        //@ts-ignore
        A[7] = I
        const k = s.getAttribute("position") as BufferAttribute
        k.setUsage(DynamicDrawUsage), (k.needsUpdate = !0)
        const L = k.array,
          C = v / c.width - o,
          D = y / c.height - o,
          R = b / c.width,
          M = E / c.height
        //@ts-ignore
        L[0] = C
        //@ts-ignore
        L[1] = D + M
        //@ts-ignore
        L[3] = C + R
        //@ts-ignore
        L[4] = D + M
        //@ts-ignore
        L[6] = C
        //@ts-ignore
        L[7] = D
        //@ts-ignore
        L[9] = C + R
        //@ts-ignore
        L[10] = D
        n.uniforms.tDiffuse.value = l
        n.blending = O || NoBlending
        n.transparent = !!T
        null == _ && (_ = 1)
        n.uniforms.alpha.value = _
        c.viewport.set(0, 0, c.width, c.height)
        const j = this.threeRenderer.getRenderTarget()
        const U = this.threeRenderer.autoClear
        const F = this.threeRenderer.xr.enabled
        this.threeRenderer.xr.enabled = !1
        this.threeRenderer.autoClear = !1
        this.threeRenderer.setRenderTarget(c, S)
        this.threeRenderer.render(e, t)
        this.threeRenderer.setRenderTarget(j)
        this.threeRenderer.autoClear = U
        this.threeRenderer.xr.enabled = F
      }
    })()
    this.copyCubemap = (() => {
      let e: Scene,
        t: OrthographicCamera,
        n: RawShaderMaterial,
        s: BoxGeometry,
        r: Mesh,
        a = !1
      const o = new Euler()
      const l = this
      return (c, d, u, h, p) => {
        if (this.contextLost) return
        if (!a) {
          const o = 2,
            l = o / 2
          t = new OrthographicCamera(-l, l, l, -l, 0, 200)
          t.position.set(0, 0, 0)
          e = new Scene()
          e.name = "copyCube"
          e.add(t)
          n = new RawShaderMaterial({
            uniforms: {
              tDiffuse: {
                value: null
              },
              alpha: {
                value: 1
              }
            },
            vertexShader: cubemapShader.copyCubeMap.vertexShader,
            fragmentShader: cubemapShader.copyCubeMap.fragmentShader,
            depthWrite: !1,
            depthTest: !1,
            side: DoubleSide
          })
          s = new BoxGeometry(o, o, o)
          r = new Mesh(s, n)
          e.add(r)
          a = !0
        }
        const m = l.threeRenderer.getRenderTarget()
        const g = l.threeRenderer.autoClear
        const v = l.threeRenderer.xr.enabled
        l.threeRenderer.xr.enabled = !1
        l.threeRenderer.autoClear = !1
        for (let s = 0; s < 6; s++) {
          f(s, o)
          r.rotation.copy(o)
          r.matrixWorldNeedsUpdate = !0
          r.updateMatrixWorld(!0)
          n.uniforms.tDiffuse.value = c
          n.blending = u || NoBlending
          n.transparent = !!h
          null == p && (p = 1)
          n.uniforms.alpha.value = p
          d.viewport.set(0, 0, d.width, d.height)
          l.threeRenderer.setRenderTarget(d, s)
          l.threeRenderer.render(e, t)
        }
        l.threeRenderer.setRenderTarget(m)
        l.threeRenderer.autoClear = g
        l.threeRenderer.xr.enabled = v
      }
    })()
    this.blurCubemap = (() => {
      const e = e => {
        const t = new WebGLCubeRenderTarget(e)
        t.texture.image = {}
        t.texture.image.width = e
        t.texture.image.height = e
        return {
          renderTarget: t,
          cubeCamera: new CubeCamera(0.1, 1000, t)
        }
      }
      class t extends Mesh<BoxGeometry, RawShaderMaterial> {}
      const n = {
        512: e(512)
      }
      const s = new Scene()
      const r = new t(new BoxGeometry(1, 1, 1))
      s.add(r)
      const a: Record<number, RawShaderMaterial> = {}
      return (t, o, l = 3, c = 0.005) => {
        const d = o.renderTarget
        n[d.width] || (n[d.width] = e(d.width))
        r.material = (function (e) {
          if (!a[e]) {
            const t = new RawShaderMaterial({
              uniforms: UniformsUtils.clone(ModelShaderConfig.blurCube.uniforms),
              vertexShader: ModelShaderConfig.blurCube.vertexShader,
              fragmentShader: ModelShaderConfig.blurCube.fragmentShader,
              side: BackSide
            })
            t.defines = {}
            const n = cubemapTextureConfig[`${e}`]
            for (const [e, i] of n.entries()) t.defines[`KERNEL_${e + 1}`] = 0 === i || 1 === i ? i.toFixed(1) : i
            a[e] = t
          }
          return a[e]
        })(l)
        const u = n[d.width]
        r.material.uniforms.map.value = t
        r.material.uniforms.dir.value.set(c, 0)
        u.cubeCamera.update(this.threeRenderer, s)
        r.material.uniforms.map.value = u.renderTarget.texture
        r.material.uniforms.dir.value.set(0, c)
        o.update(this.threeRenderer, s)
      }
    })()
    try {
      const e = this.threeRenderer.getContext()
      this.setupRendererProxy()
      this.contextLost = e.isContextLost()
      this._maxCubemapSize = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)
      this._maxTextureSize = e.getParameter(e.MAX_TEXTURE_SIZE)
      this._gpuInfo = (e => {
        try {
          const t = e.getExtension("WEBGL_debug_renderer_info")
          if (t)
            return {
              vendor: e.getParameter(t.UNMASKED_VENDOR_WEBGL),
              renderer: e.getParameter(t.UNMASKED_RENDERER_WEBGL)
            }
        } catch (e) {}
        return {
          vendor: "Unknown",
          renderer: "Unknown"
        }
      })(e)
    } catch (e) {
      throw new WEBGLGENERICError("Unable to create a WebGL rendering context")
    }
    this.initTexture = this.initTexture.bind(this)
  }
  setupRendererProxy() {
    const e = this.threeRenderer.getContext()
    const t = e.canvas as HTMLCanvasElement
    const n = {}
    const i = new Proxy(e, {
      get: (e, t, i) => ("canvas" === t ? s : e[t] instanceof Function ? n[t] || (n[t] = e[t].bind(e)) : e[t])
    })
    const s = {
      get clientHeight() {
        return t.clientHeight
      },
      get clientLeft() {
        return t.clientLeft
      },
      get clientTop() {
        return t.clientTop
      },
      get clientWidth() {
        return t.clientWidth
      },
      getBoundingClientRect: () => t.getBoundingClientRect(),
      get height() {
        return t.height
      },
      get offsetHeight() {
        return t.offsetHeight
      },
      get offsetLeft() {
        return t.offsetLeft
      },
      get offsetTop() {
        return t.offsetTop
      },
      get offsetWidth() {
        return t.offsetWidth
      },
      get width() {
        return t.width
      }
    }
    //@ts-ignore
    this.threeRenderer.domElement = s
    this.threeRenderer.getContext = function () {
      return i
    }
  }
  initTexture(e: Texture) {
    return this.threeRenderer.initTexture(e)
  }
  get maxCubemapSize() {
    return this._maxCubemapSize
  }
  get maxTextureSize() {
    return this._maxTextureSize
  }
  get gpuInfo() {
    return this._gpuInfo
  }
  getSize() {
    return this.threeRenderer.getSize(this.cachedSize)
  }
  getPixelRatio() {
    return this.threeRenderer.getPixelRatio()
  }
  dispose() {
    this.threeRenderer.dispose()
  }
  initSizedTexture2D(e: number, t?) {
    const n = new DataTexture(null, e, e)
    t && Object.assign(n, t)
    n.needsUpdate = !0
    this.contextLost || this.threeRenderer.initTexture(n)
    return n
  }
  initRenderTargetCube(e: PanoSize) {
    const t = new WebGLCubeRenderTarget(e, {
      stencilBuffer: !1,
      depthBuffer: !1,
      generateMipmaps: !1
    })
    t.texture.image = {}
    t.texture.image.width = e
    t.texture.image.height = e
    return t
  }
  uploadTexture2D(e: any, t, n, s) {
    if (!this.contextLost) {
      const r = new Texture()
      r.image = e
      this.threeRenderer.copyTextureToTexture(r, t, null, new Vector2(n, s), 0)
    }
  }
  fence(e) {
    return new Promise((t, n) => {
      const i = this.contextLost ? null : e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE, 0)
      if (null === i) return n()
      e.flush()
      const s = () => {
        switch (e.getSyncParameter(i, e.SYNC_STATUS)) {
          case e.TIMEOUT_EXPIRED:
            setTimeout(s, 0)
            break
          case e.WAIT_FAILED:
            n()
            break
          case e.SIGNALED:
            e.deleteSync(i)
            t(void 0)
            break
          default:
            setTimeout(s, 0)
            break
        }
      }
      setTimeout(s, 0)
    })
  }
}
class BlackoutOverlayMesh extends Mesh<PlaneGeometry, RawShaderMaterial> {
  _opacity: number
  constructor(e: number) {
    super(
      new PlaneGeometry(2, 2, 1, 1),
      new RawShaderMaterial({
        uniforms: UniformsUtils.clone(basicShader.screenSpaceColored.uniforms),
        vertexShader: basicShader.screenSpaceColored.vertexShader,
        fragmentShader: basicShader.screenSpaceColored.fragmentShader,
        transparent: !0,
        depthTest: !1,
        depthWrite: !1
      })
    )
    this._opacity = 1
    this.material.uniforms.color.value = new Color(e)
    this.renderOrder = PickingPriorityType.colorOverlay
    this.name = "ScreenOverlayMesh"
  }
  set opacity(e) {
    this.visible = e > 0
    this._opacity = e
    this.material.uniforms.opacity.value = e
  }
  get opacity() {
    return this._opacity
  }
  dispose() {
    this.material.dispose(), this.geometry.dispose()
  }
}
class BlackoutOverlay {
  scene: ShowCaseScene
  cameraData: CameraData
  blackoutOverlayMesh: BlackoutOverlayMesh
  constructor(e, t) {
    this.scene = e
    this.cameraData = t
  }
  init() {
    this.blackoutOverlayMesh = new BlackoutOverlayMesh(0)
  }
  dispose() {
    this.blackoutOverlayMesh.dispose()
  }
  render(e) {
    this.blackoutOverlayMesh.opacity = this.cameraData.transition.blackoutProgress.value
  }
  activate(e) {
    this.scene.addChild(this.scene.ids.CameraRig, this.blackoutOverlayMesh)
  }
  deactivate(e) {
    this.scene.removeChild(this.scene.ids.CameraRig, this.blackoutOverlayMesh)
  }
}
export const MAX_RESOLUTION = 3686400

declare global {
  interface SymbolModule {
    [WebglRendererSymbol]: WebglRendererModule
  }
}
export default class WebglRendererModule extends Module {
  onContextLost: (e: any) => void
  _cwfRenderer: CWFRenderer
  engine: EngineContext
  onContextRestored: (e: any) => void
  canvas: HTMLCanvasElement
  getPixelRatioFor: (e: number, t: number) => number
  _threeRenderer: WebGLRenderer
  cameraData: CameraData
  settingsData: SettingsData
  scene: ShowCaseScene
  webGlMemoryTracker: any
  constructor() {
    super(...arguments)
    this.name = "webgl-renderer"
    this.onContextLost = e => {
      this.log.info(e)
      this._cwfRenderer.contextLost = !0
      this.engine.broadcast(new WebglRendererContextLostMessage(e)), e.preventDefault()
    }
    this.onContextRestored = e => {
      this.log.info(e)
      this._cwfRenderer.contextLost = !1
      this.engine.broadcast(new WebglRendererContextRestoredMessage(e))
      this.canvas.parentNode?.insertBefore(this.canvas, this.canvas)
    }
    this.getPixelRatioFor = (e, t) => {
      const n = window.devicePixelRatio || 1
      return e * t * n <= MAX_RESOLUTION ? n : 1
    }
  }
  async init(e, t: EngineContext) {
    if (!("WebGLRenderingContext" in window)) throw new WEBGLUNSUPPORTEDError("WebGL not supported")
    let n: WebGLRenderer
    this.canvas = e.canvas
    this.engine = t
    try {
      const t = {
        canvas: this.canvas,
        antialias: e.antialias,
        alpha: !0,
        powerPreference: "high-performance"
      }
      // n = e.useWebGL2 ? new WebGLRenderer(t) : new WebGL1Renderer(t)
      n = new WebGLRenderer(t)
      n.autoClear = !1
      n.xr.enabled = !0
    } catch (e) {
      throw new WEBGLGENERICError("Unable to create a WebGL rendering context")
    }
    n.setOpaqueSort(this.painterSortStable)
    this.patchGLContext(n.getContext())
    this._cwfRenderer = new CWFRenderer(n)
    this._threeRenderer = n
    ;[this.cameraData, this.settingsData] = await Promise.all([t.market.waitForData(CameraData), t.market.waitForData(SettingsData)])
    const s = new Scene()
    s.name = "main"
    this.scene = new ShowCaseScene(s, n, this.cameraData, e.useEffectComposer)
    t.addComponent(this, this.scene)
    t.addComponent(this, new BlackoutOverlay(this.scene, this.cameraData))
    const canvasData = await t.market.waitForData(CanvasData)
    this.setSize(canvasData.width, canvasData.height)
    this.bindings.push(
      t.subscribe(SetCameraDimensionsMessage, e => this.setSize(e.width, e.height)),
      t.commandBinder.addBinding(WorldPositionChangeCommand, async e => getScreenAndNDCPosition(this.cameraData, e.worldPosition).screenPosition),
      new EventsSubscription(this.canvas, "webglcontextlost", this.onContextLost),
      new EventsSubscription(this.canvas, "webglcontextrestored", this.onContextRestored)
    )
    this.webGlMemoryTracker = n.getContext().getExtension("GMAN_webgl_memory")
    this.webGlMemoryTracker || this.log.warn("Unable to find WebGL memory tracker!")
    t.broadcast(new SymbolLoadedMessage(WebglRendererSymbol))
  }
  dispose(e) {
    super.dispose(e)
    this.threeRenderer.dispose()
  }
  isHighPerformanceMobileGPU() {
    return (
      /Apple A(9|1\d)/.test(this._cwfRenderer.gpuInfo.renderer) ||
      /Adreno \(TM\) (512|530|540|[6-9]\d\d)/.test(this._cwfRenderer.gpuInfo.renderer) ||
      /Mali-G(7[1-9]|[8-9]\d)/.test(this._cwfRenderer.gpuInfo.renderer)
    )
  }
  patchGLContext(e: WebGLRenderingContext | WebGL2RenderingContext) {
    const unsupported = (e: WebGLRenderingContext | WebGL2RenderingContext) => {
      let t = !1
      if ("undefined" != typeof OffscreenCanvas) {
        const n = new OffscreenCanvas(1, 1)
        if (n.getContext("2d")) {
          const i = e.createTexture()
          try {
            e.bindTexture(e.TEXTURE_2D, i)
            e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, n)
          } catch (e) {
            t = !0
          } finally {
            e.bindTexture(e.TEXTURE_2D, null)
            e.deleteTexture(i)
          }
        }
      }
      return t
    }
    if (unsupported(e)) {
      this.log.warn("OffscreenCanvas unsupported as texImage2D source, applying workaround")
      let t: HTMLCanvasElement | null = null
      const n = e.texImage2D
      e.texImage2D = (...i) => {
        const r = i[5]
        r && r instanceof OffscreenCanvas
          ? ((t = t || document.createElement("canvas")),
            (t.width = r.width),
            (t.height = r.height),
            t.getContext("2d")?.drawImage(r, 0, 0),
            (i[5] = t),
            n.call(e, ...i),
            (t.width = t.height = 1))
          : n.call(e, ...i)
      }
    }
  }
  get gpuInfo() {
    return this._cwfRenderer.gpuInfo
  }
  get maxCubemapSize() {
    return this._cwfRenderer.maxCubemapSize
  }
  get maxTextureSize() {
    return this._cwfRenderer.maxTextureSize
  }
  get maxVaryings() {
    return this._threeRenderer.capabilities.maxVaryings
  }
  getScene() {
    return this.scene
  }
  getCamera() {
    return this.scene.camera
  }
  get cwfRenderer() {
    return this._cwfRenderer
  }
  get threeRenderer() {
    return this._threeRenderer
  }
  async renderOnce() {
    this.scene.startRender(!0)
    return this.engine.after(EngineTickState.Render).then(() => this.scene.startRender(!1))
  }
  startRender(e = !0) {
    this.scene.startRender(e)
    this.engine.broadcast(new PixelRatioChangedMessage(this._cwfRenderer.getPixelRatio()))
  }
  setSize(e: number, t: number) {
    const n = this.getPixelRatioFor(e, t)
    n !== this._cwfRenderer.getPixelRatio() && (this.log.debug(`Setting pixel ratio to ${n}`), this.engine.broadcast(new PixelRatioChangedMessage(n)))
    this.threeRenderer.xr.isPresenting && this.log.error("setting size while in xr is a no no, it resets the viewport", e, t)
    this.threeRenderer.setDrawingBufferSize(e, t, n)
    this.scene.setCameraDirty()
  }
  supportsInstancing() {
    const { threeRenderer, settingsData } = this
    return (
      1 !== settingsData.getOverrideParam("noInstancing", 0) && (threeRenderer.capabilities.isWebGL2 || threeRenderer.extensions.has("ANGLE_instanced_arrays"))
    )
  }
  getCapabilities() {
    const { capabilities, extensions } = this.threeRenderer
    const n = capabilities.isWebGL2
    let gl_v2 = !1
    try {
      gl_v2 = !!document.createElement("canvas").getContext("webgl2")
    } catch (e) {}
    return {
      gl_v2,
      gl_max_textures: capabilities.maxTextures,
      gl_max_texture_size: capabilities.maxTextureSize,
      gl_max_cubemap_size: capabilities.maxCubemapSize,
      gl_instancing: this.supportsInstancing(),
      gl_oes_texture_float: n || extensions.has("OES_texture_float"),
      gl_oes_texture_half_float: n || extensions.has("OES_texture_half_float"),
      gl_depth_texture: n || extensions.has("WEBGL_depth_texture"),
      gl_draw_buffers: n || extensions.has("WEBGL_draw_buffers"),
      gl_oes_fbo_render_mip_map: n || extensions.has("OES_fbo_render_mipmap"),
      gl_shader_texture_lod: n || extensions.has("EXT_shader_texture_lod"),
      gl_oes_vertex_array_obj: n || extensions.has("OES_vertex_array_object"),
      gl_ovr_multi_view: n && extensions.has("OVR_multiview2"),
      gl_color_buffer_float: n && extensions.has("EXT_color_buffer_float"),
      gl_astc_supported: extensions.has("WEBGL_compressed_texture_astc"),
      gl_etc1_supported: extensions.has("WEBGL_compressed_texture_etc1"),
      gl_etc2_supported: extensions.has("WEBGL_compressed_texture_etc"),
      gl_dxt_supported: extensions.has("WEBGL_compressed_texture_s3tc"),
      gl_bptc_supported: extensions.has("EXT_texture_compression_bptc"),
      gl_pvrtc_supported: extensions.has("WEBGL_compressed_texture_pvrtc") || extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")
    }
  }
  estimatedGPUMemoryAllocated() {
    if (this.webGlMemoryTracker) {
      return this.webGlMemoryTracker.getMemoryInfo().memory.total
    }
    return -1
  }
  painterSortStable(e, t) {
    if (e.groupOrder !== t.groupOrder) return e.groupOrder - t.groupOrder
    if (e.renderOrder !== t.renderOrder) return e.renderOrder - t.renderOrder
    if (e.program !== t.program) return e.program.id - t.program.id
    if (e.material.id !== t.material.id) return e.material.id - t.material.id
    if (e.object.getSortKey && t.object.getSortKey) {
      const n = e.object.getSortKey() - t.object.getSortKey()
      if (0 !== n) return n
    }
    return e.z !== t.z ? e.z - t.z : e.id - t.id
  }
}
