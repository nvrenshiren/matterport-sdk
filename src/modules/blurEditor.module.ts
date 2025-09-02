import { CursorControllerSymbol, InputSymbol, PanoSymbol, RttSymbol, SettingsSymbol, WebglRendererSymbol, WorkShopBlurEditSymbol } from "../const/symbol.const"
import { Command } from "../core/command"
import n4 from "../glsl/34468.glsl"
import n1 from "../glsl/59285.glsl"
import n2 from "../glsl/65794.glsl"
import n3 from "../glsl/77288.glsl"
declare global {
  interface SymbolModule {
    [WorkShopBlurEditSymbol]: BlurEditorModule
  }
}
class BlurToolChangeCommand extends Command {
  constructor(e) {
    super(), (this.id = "BLUR_TOOL_CHANGE"), (this.payload = { state: e })
  }
}
class SetBlurBrushScaleCommand extends Command {
  constructor(e) {
    super(), (this.id = "SET_BLUR_BRUSH_SCALE"), (this.payload = { scale: e })
  }
}
class NavigateToBlurCommand extends Command {
  constructor(e, t = !1) {
    super(), (this.id = "NAVIGATE_TO_BLUR"), (this.payload = { blur: e, resetBlurTool: t })
  }
}
class ToggleBlurVisibilityCommand extends Command {
  constructor(e) {
    super(), (this.id = "TOGGLE_BLUR_VISIBILITY"), (this.payload = { id: e })
  }
}
class ShowBlursCommand extends Command {
  constructor(...e) {
    super(), (this.id = "SHOW_BLURS"), (this.payload = { ids: e })
  }
}
class HideBlursCommand extends Command {
  constructor(...e) {
    super(), (this.id = "HIDE_BLURS"), (this.payload = { ids: e })
  }
}
class BatchToggleBlurVisibilityCommand extends Command {
  constructor(e) {
    super(), (this.id = "BATCH_TOGGLE_BLUR_VISIBILITY"), (this.payload = { ids: e })
  }
}

export enum BlurToolState {
  IDLE = "idle",
  OFF = "off",
  PAINTING = "painting",
  SUGGESTING = "suggesting"
}

import * as k from "../math/2569"
import { CheckThreshold } from "../utils/49827"
import { MoveToSweepCommand } from "../command/navigation.command"
import { ToolPalette, ToolPanelLayout, ToolsList } from "../const/tools.const"
import { createSubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { SweepsData } from "../data/sweeps.data"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { ToolObject } from "../object/tool.object"
import { ViewModes } from "../utils/viewMode.utils"

import st from "classnames"
import * as et from "react"
import * as He from "react/jsx-runtime"
import * as ze from "../other/17176"
import * as he from "../webgl/56512"
import * as W from "../math/59370"
import * as Ye from "../other/66102"
import * as Ge from "../utils/80361"
import * as Qe from "../other/84426"
import { FeaturesLabelsKey } from "../const/23037"
import * as re from "../const/36074"
import { BlurChunksKey, BlurMeshKey, BlurPipelineKey } from "../const/36074"
import { FeaturesNotesKey } from "../const/39693"
import * as Ie from "../const/44109"
import { ToolsBlurEditorKey } from "../const/44109"
import { featuresMattertagsKey } from "../const/tag.const"
import { BlurSuggestionData } from "../data/blur.suggestion.data"
import { AggregateSubscription } from "../subscription/aggregate.subscription"

enum ObservablesState {
  DISABLED = "disabled",
  IDLE = "idle",
  PAINTING = "painting"
}
class SphereBrushCursor extends Object3D {
  _radius: number
  _thickness: number
  mesh: Mesh<RingGeometry, MeshBasicMaterial>
  constructor() {
    super(), (this._radius = 0.1), (this._thickness = 0.005), (this.name = "SphereBrushCursor")
    const e = new MeshBasicMaterial({ color: 16777215, side: DoubleSide, depthTest: !1, transparent: !0 }),
      t = this.getGeometry()
    ;(this.mesh = new Mesh(t, e)), (this.mesh.renderOrder = PickingPriorityType.reticule), this.add(this.mesh)
  }
  getGeometry() {
    return new RingGeometry(this._radius, this._radius + this._thickness, 64)
  }
  updateCursorMesh() {
    this.mesh.geometry.dispose(), (this.mesh.geometry = this.getGeometry())
  }
  get radius() {
    return this._radius
  }
  set radius(e) {
    ;(this._radius = e), this.updateCursorMesh()
  }
  dispose() {
    this.mesh.material.dispose(), this.mesh.geometry.dispose()
  }
}
const PanoBrushDebugInfo = new DebugInfo("pano-brush")
class X {
  sweepData: any
  cameraData: any
  scene: any
  input: any
  cameraVector: Vector3
  lastPaint: Vector3
  mouseCursorEnabled: boolean
  needsUpdate: boolean
  observables: {
    size: ObservableValue<number>
    scale: ObservableValue<number>
    feather: ObservableValue<number>
    pressure: ObservableValue<number>
    opacity: ObservableValue<number>
    state: ObservableValue<ObservablesState>
  }
  position: Vector3
  direction: Vector3
  sizeRange: number[]
  featherRange: number[]
  pressureRange: number[]
  onPointerButton: (e: any) => void
  onPointerMove: (e: any) => void
  onPaint: boolean
  onClick: (e: any) => void
  onMouseMove: (e: any) => void
  mouseCursor: string | null
  engine: any
  brushCursor: SphereBrushCursor
  bindings: AggregateSubscription
  constructor(e, t, s, i, n = RenderLayers.ALL) {
    ;(this.sweepData = e),
      (this.cameraData = t),
      (this.scene = s),
      (this.input = i),
      (this.cameraVector = new Vector3()),
      (this.lastPaint = new Vector3()),
      (this.mouseCursorEnabled = !1),
      (this.needsUpdate = !0),
      (this.observables = {
        size: new ObservableValue(0.1),
        scale: new ObservableValue(0.2),
        feather: new ObservableValue(0.1),
        pressure: new ObservableValue(0.1),
        opacity: new ObservableValue(1),
        state: new ObservableValue(ObservablesState.DISABLED)
      }),
      (this.position = new Vector3()),
      (this.direction = new Vector3()),
      (this.sizeRange = [0.1, 0.5]),
      (this.featherRange = [0.005, 0.125]),
      (this.pressureRange = [0.0063, 0.0125]),
      (this.onPointerButton = e => (e.down ? this.startPainting() : this.stopPainting())),
      (this.onPointerMove = e => {
        const t = calculatePostDirection(this.cameraData, e.position)
        if ((this.setPosition(t), this.state === ObservablesState.PAINTING && this.onPaint)) {
          const e = lerp(this.observables.size.value, this.sizeRange[0], this.sizeRange[1], 0.005, 0.03)
          if (this.lastPaint.length() > 0) {
            const t = this.direction.clone().sub(this.lastPaint).setLength(e),
              s = this.lastPaint.clone()
            for (; s.angleTo(this.direction) > e; )
              s.add(t).normalize(),
                this.lastPaint.copy(s),
                this.onPaint(s, this.observables.size.value, this.observables.feather.value, this.observables.pressure.value)
          } else
            this.lastPaint.copy(this.direction),
              this.onPaint(this.direction, this.observables.size.value, this.observables.feather.value, this.observables.pressure.value)
        }
      }),
      (this.onClick = e => {
        const t = calculatePostDirection(this.cameraData, e.position)
        this.setPosition(t),
          this.onPaint && this.onPaint(this.direction, this.observables.size.value, this.observables.feather.value, this.observables.pressure.value)
      }),
      (this.onMouseMove = e => {
        const { tagName: t } = e.target || {},
          s = this.mouseCursorEnabled || !t || "CANVAS" !== t ? null : CursorStyle.NONE
        s !== this.mouseCursor && (this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(s)), (this.mouseCursor = s))
      }),
      (this.brushCursor = new SphereBrushCursor()),
      (this.brushCursor.renderOrder = PickingPriorityType.reticule),
      (this.brushCursor.layers.mask = n.mask)
  }
  init() {
    ;(this.bindings = new AggregateSubscription(
      this.input.registerPriorityHandler(DraggerMoveEvent, Mesh, () => !0),
      this.input.registerHandler(OnMoveEvent, this.onPointerMove),
      this.input.registerHandler(OnMouseDownEvent, this.onPointerButton),
      this.input.registerUnfilteredHandler(InputClickerEndEvent, this.onClick),
      new EventsSubscription(document.body, "mousemove", this.onMouseMove)
    )),
      this.bindings.cancel()
  }
  render() {
    this.state !== ObservablesState.DISABLED &&
      this.needsUpdate &&
      (this.brushCursor.position.copy(this.position), this.brushCursor.lookAt(this.scene.camera.getWorldPosition(this.cameraVector)), (this.needsUpdate = !1))
  }
  dispose() {
    this.brushCursor.dispose()
  }
  activate(e) {
    this.engine = e
  }
  deactivate(e) {
    this.disable()
  }
  enable() {
    PanoBrushDebugInfo.debug("Enabled"), (this.observables.state.value = ObservablesState.IDLE), this.bindings.renew(), this.scene.add(this.brushCursor)
  }
  disable() {
    PanoBrushDebugInfo.debug("Disabled"),
      (this.observables.state.value = ObservablesState.DISABLED),
      this.bindings.cancel(),
      this.scene.remove(this.brushCursor),
      this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(null))
  }
  onPropertyChanged(e, t) {
    return this.observables[e].onChanged(t)
  }
  getSizeRange() {
    return this.sizeRange
  }
  setSizeRange(e, t) {
    ;(this.sizeRange = [e, t]), (this.scale = this.observables.scale.value)
  }
  get scale() {
    return this.observables.scale.value
  }
  set scale(e) {
    const t = CheckThreshold(e, 0, 1),
      s = checkLerpThreshold(t, 0, 1, this.sizeRange[0], this.sizeRange[1]),
      i = checkLerpThreshold(t, 0, 1, this.featherRange[0], this.featherRange[1]),
      n = checkLerpThreshold(t, 0, 1, this.pressureRange[0], this.pressureRange[1])
    ;(this.brushCursor.radius = s),
      (this.observables.size.value = s),
      (this.observables.scale.value = t),
      (this.observables.feather.value = i),
      (this.observables.pressure.value = n),
      PanoBrushDebugInfo.debug(`Set brush scale to ${100 * t}% (${s})`)
  }
  get state() {
    return this.observables.state.value
  }
  get size() {
    return this.observables.size.value
  }
  set size(e) {
    const t = CheckThreshold(e, this.sizeRange[0], this.sizeRange[1]),
      s = checkLerpThreshold(t, this.sizeRange[0], this.sizeRange[1], 0, 1),
      i = checkLerpThreshold(t, this.sizeRange[0], this.sizeRange[1], this.featherRange[0], this.featherRange[1]),
      n = checkLerpThreshold(t, this.sizeRange[0], this.sizeRange[1], this.pressureRange[0], this.pressureRange[1])
    ;(this.brushCursor.radius = t),
      (this.observables.size.value = t),
      (this.observables.scale.value = s),
      (this.observables.feather.value = i),
      (this.observables.pressure.value = n),
      PanoBrushDebugInfo.debug(`Set brush size to ${t} (${100 * s}%)`)
  }
  toggleMouseCursor(e) {
    this.mouseCursorEnabled = e
  }
  startPainting() {
    this.observables.state.value = ObservablesState.PAINTING
  }
  stopPainting() {
    ;(this.observables.state.value = ObservablesState.IDLE), this.lastPaint.set(0, 0, 0)
  }
  setPosition(e) {
    const t = this.sweepData.currentSweepObject
    if (!t) return
    const s = e.clone().sub(t.position).normalize(),
      i = t.position.clone().add(s)
    this.position.copy(i), this.direction.copy(s), (this.needsUpdate = !0)
  }
}
class ee extends InstancedMesh {
  blurId: any
}
const ae = {
  brush: {
    uniforms: {
      opacity: { type: "v3", value: new Vector3(1, 1, 1) },
      color: { type: "c", value: new Color() },
      radius: { type: "v3", value: new Vector3(0.1, 0.1, 0.1) },
      feather: { type: "v3", value: new Vector3(0, 0, 0) }
    },
    vertexShader: n1,
    fragmentShader: n2
  },
  combineBlurs: {
    uniforms: {
      maskMatrix: { type: "m4", value: new Matrix4() },
      maskTexture: { type: "t", value: null },
      panoMatrix1: { type: "m4", value: new Matrix4() },
      panoMatrix2: { type: "m4", value: new Matrix4() },
      panoBlurredMap0: { type: "t", value: null },
      panoBlurredMap1: { type: "t", value: null },
      panoBlurredMap2: { type: "t", value: null },
      panoBlurredMap3: { type: "t", value: null }
    },
    vertexShader: n3,
    fragmentShader: n4
  }
}
const oe = new Matrix4()
function le(e) {
  const t = new WebGLCubeRenderTarget(e, { format: RGBAFormat, generateMipmaps: !1, depthBuffer: !1, stencilBuffer: !1 })
  return (t.texture.image = {}), (t.texture.image.width = e), (t.texture.image.height = e), t
}
class de {
  inputSize: any
  outputSize: any
  sigma: any
  input: WebGLCubeRenderTarget
  output: WebGLCubeRenderTarget
  constructor(e, t, s) {
    ;(this.inputSize = e), (this.outputSize = t), (this.sigma = s), (this.input = le(e)), (this.output = le(t))
  }
  get texture() {
    return this.output.texture
  }
}
class ue {
  renderToTexture: any
  renderer: any
  renderTarget: WebGLCubeRenderTarget
  camera: PerspectiveCamera
  blurRTs: { renderTarget: de; cubeCamera: CubeCamera }[]
  debug: {}
  material: RawShaderMaterial
  mesh: Mesh<BoxGeometry, any>
  currentSweepId: any
  currentPanoTexture: any
  constructor(e, t) {
    ;(this.renderToTexture = e),
      (this.renderer = t),
      (this.renderTarget = new WebGLCubeRenderTarget(2048, { format: RGBAFormat, generateMipmaps: !1, depthBuffer: !1, stencilBuffer: !1 })),
      (this.camera = new PerspectiveCamera()),
      (this.blurRTs = re.TW.map(e =>
        ((e, t, s) => {
          const i = new de(e, t, s)
          return { renderTarget: i, cubeCamera: new CubeCamera(0.1, 1e3, i.output) }
        })(e.size, 2 * e.size, e.sigma)
      )),
      (this.debug = {})
    const s = UniformsUtils.clone(ae.combineBlurs.uniforms)
    ;(this.material = new RawShaderMaterial({
      fragmentShader: ae.combineBlurs.fragmentShader,
      vertexShader: ae.combineBlurs.vertexShader,
      uniforms: s,
      side: DoubleSide,
      name: "CubemapRendererMaterial"
    })),
      (this.mesh = new Mesh(new BoxGeometry(100, 100, 100), this.material)),
      (this.material.uniforms.panoBlurredMap0.value = this.blurRTs[0].renderTarget.texture),
      (this.material.uniforms.panoBlurredMap1.value = this.blurRTs[1].renderTarget.texture),
      (this.material.uniforms.panoBlurredMap2.value = this.blurRTs[2].renderTarget.texture),
      (this.material.uniforms.panoBlurredMap3.value = this.blurRTs[3].renderTarget.texture),
      (this.renderTarget.texture.image = {}),
      (this.renderTarget.texture.image.height = 2048),
      (this.renderTarget.texture.image.width = 2048)
  }
  setDebug(e, t) {
    t ? (this.debug[e] = !0) : this.debug[e] && delete this.debug[e], (this.material.defines = this.debug), (this.material.needsUpdate = !0), this.render()
  }
  render() {
    this.renderToTexture.render(this.renderTarget, this.mesh, this.camera)
  }
  get texture() {
    return this.renderTarget.texture
  }
  setMaskTexture(e, t = oe) {
    ;(this.material.uniforms.maskTexture.value = e), this.material.uniforms.maskMatrix.value.copy(t)
  }
  setPano(e, t, s = oe, i = oe) {
    if (e !== this.currentSweepId || this.currentPanoTexture !== t) {
      ;(this.currentSweepId = e), (this.currentPanoTexture = t)
      for (const e of this.blurRTs) {
        const s = e.renderTarget,
          i = 0.5 / s.input.width
        this.renderer.copyCubemap(t, s.input), this.renderer.blurCubemap(s.input.texture, e.cubeCamera, s.sigma, i)
      }
      this.material.uniforms.panoMatrix1.value.copy(s), this.material.uniforms.panoMatrix2.value.copy(i)
    }
  }
  reset() {
    ;(this.currentSweepId = null), (this.currentPanoTexture = null)
  }
}
class ce extends RawShaderMaterial {
  constructor(e, t, s, i) {
    const n = UniformsUtils.clone(ae.brush.uniforms)
    n.radius.value.copy(e),
      n.feather.value.copy(t),
      n.opacity.value.copy(s),
      n.color.value.set(1, 0, 0),
      super(
        Object.assign(Object.assign({}, i), {
          fragmentShader: ae.brush.fragmentShader,
          vertexShader: ae.brush.vertexShader,
          uniforms: n,
          side: FrontSide,
          transparent: !0,
          blending: AdditiveBlending,
          name: "brushMaterial"
        })
      )
  }
  get color() {
    return this.uniforms.color.value
  }
  set color(e) {
    this.uniforms.color.value = e
  }
}
const me = new Color(16711680),
  pe = new Color(65280),
  be = new Color(255)
class fe {
  sweepData: any
  blurEditorData: any
  scene: any
  input: any
  panoRenderer: any
  root: Group
  meshes: {}
  maskRenderTarget: WebGLCubeRenderTarget
  maskCamera: PerspectiveCamera
  maskBackground: Mesh<BoxGeometry, MeshBasicMaterial>
  maskVisible: boolean
  dirty: boolean
  updating: boolean
  bindings: never[]
  blurs: never[]
  renderBlurredOverlay: (i: any) => Promise<void>
  engine: any
  overlayRenderer: any
  currentSweep: any
  constructor(e, t, s, i, n, a, r) {
    ;(this.sweepData = e),
      (this.blurEditorData = t),
      (this.scene = s),
      (this.input = i),
      (this.panoRenderer = r),
      (this.root = new Group()),
      (this.meshes = {}),
      (this.maskRenderTarget = new WebGLCubeRenderTarget(1024, { format: RGBAFormat, generateMipmaps: !1 })),
      (this.maskCamera = new PerspectiveCamera()),
      (this.maskBackground = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: 0, side: DoubleSide }))),
      (this.maskVisible = !1),
      (this.dirty = !0),
      (this.updating = !1),
      (this.bindings = []),
      (this.blurs = []),
      (this.renderBlurredOverlay = (() => {
        const e = new Matrix4(),
          t = new Matrix4(),
          s = new Quaternion()
        return async i => {
          this.maskCamera.position.copy(i.position),
            this.maskBackground.position.copy(i.position),
            await this.engine.commandBinder.issueCommand(new RequestRenderTargetCameraCommand(this.maskRenderTarget, this.root, this.maskCamera))
          const n = this.maskRenderTarget.texture,
            a = this.panoRenderer.useTexture(i.id)
          e.makeRotationFromQuaternion(s.copy(i.rotation).invert()),
            t.makeScale(-1, 1, 1),
            this.overlayRenderer.setPano(i.id, a, e, t),
            this.overlayRenderer.setMaskTexture(n),
            this.overlayRenderer.render(),
            this.panoRenderer.freeTexture(i.id),
            await this.engine.after(EngineTickState.Begin),
            await this.engine.commandBinder.issueCommand(new SetPanoOverlayCommand(i.id, this.overlayRenderer.texture, new Quaternion()))
        }
      })()),
      (this.currentSweep = this.sweepData.currentSweepObject || null),
      (this.overlayRenderer = new ue(n, a))
  }
  setBlurs(e) {
    this.blurs !== e && ((this.blurs = e), (this.dirty = !0))
  }
  init() {
    this.root.add(this.maskBackground)
  }
  async activate(e) {
    const [t] = await Promise.all([e.getModuleBySymbol(SettingsSymbol)])
    ;(this.engine = e),
      (this.meshes = {}),
      this.bindings.push(
        this.blurEditorData.onChanged(() => (this.dirty = !0)),
        e.subscribe(MoveToSweepBeginMessage, e => {
          ;(this.currentSweep = this.sweepData.getSweep(e.toSweep)), (this.dirty = !0)
        }),
        e.subscribe(WebglRendererContextRestoredMessage, () => {
          this.overlayRenderer.reset(), this.currentSweep && this.renderBlurredOverlay(this.currentSweep)
        })
      ),
      t.registerButton("Blur Debug", "Toggle blur level coloration", () => {
        this.overlayRenderer.setDebug("DEBUG_BLUR_COLORS", !this.overlayRenderer.debug.DEBUG_BLUR_COLORS),
          this.currentSweep && this.renderBlurredOverlay(this.currentSweep)
      }),
      t.registerButton("Blur Debug", "Toggle blur test", () => {
        this.overlayRenderer.setDebug("DEBUG_BLUR_LEVELS", !this.overlayRenderer.debug.DEBUG_BLUR_LEVELS),
          this.currentSweep && this.renderBlurredOverlay(this.currentSweep)
      }),
      (this.maskRenderTarget.texture.image = {}),
      (this.maskRenderTarget.texture.image.width = 1024),
      (this.maskRenderTarget.texture.image.height = 1024)
  }
  dispose() {
    this.root.traverse(e => {
      e instanceof Mesh && e.geometry.dispose()
    })
  }
  render() {
    this.dirty &&
      !this.updating &&
      ((this.updating = !0),
      (this.dirty = !1),
      this.update().finally(() => {
        this.updating = !1
      }))
  }
  deactivate(e) {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
  getBlursForSweep(e) {
    return this.blurs.filter(t => t.sweepId === e)
  }
  async update() {
    var e, t
    if (!this.currentSweep) return
    const s = this.currentSweep,
      n = this.getBlursForSweep(s.id),
      a = {}
    for (const e of n) for (const [t, s] of e.dots.entries()) a[`${e.id}-${t}`] = s
    let r = !1
    for (const e in this.meshes) {
      const t = this.meshes[e]
      ;(a[e] && a[e].directions.length === t.count) || (this.root.remove(t), this.input.unregisterMesh(t), delete this.meshes[e], (r = !0))
    }
    const o = new Vector3(),
      l = new Vector3(),
      d = new Vector3(),
      u = new Matrix4(),
      c = new Vector3()
    for (const e of n)
      for (const [t, i] of e.dots.entries()) {
        const n = `${e.id}-${t}`
        if (0 === i.directions.length || this.meshes[n]) continue
        o.set(i.radius, i.radius - i.feather, i.radius), l.set(i.feather, i.feather, i.feather), d.set(i.strength, 1, i.strength)
        const a = new ce(o, l, d, { defines: { USE_INSTANCING: !0 }, depthTest: !1, depthWrite: !1 }),
          h = new ee(getPlaneGeometry(), a, i.directions.length)
        ;(h.blurId = e.id),
          i.directions.forEach((e, t) => {
            const n = 2 * (i.radius + i.feather),
              a = ve(e, s)
            u.lookAt(s.position, a, DirectionVector.UP), u.scale(c.set(n, n, n)), u.setPosition(a), h.setMatrixAt(t, u)
          }),
          h.computeBoundingSphere(),
          (this.meshes[n] = h),
          this.root.add(h),
          this.input.registerMesh(h, !1),
          (r = !0)
      }
    const h = new Color(),
      { toolState: m, selectedBlur: p, hoveredBlur: b } = this.blurEditorData
    for (const s in this.meshes) {
      const n = this.meshes[s],
        a = n.material
      h.copy(me)
      let o = PickingPriorityType.reticule + 0.1
      const l = null === (e = null == b ? void 0 : b.editable) || void 0 === e || e,
        d = null === (t = null == p ? void 0 : p.editable) || void 0 === t || t
      m !== _BlurToolState.PAINTING &&
        (l && n.blurId === (null == b ? void 0 : b.id) && (h.add(be), (o = PickingPriorityType.reticule + 0.2)),
        d && n.blurId === (null == p ? void 0 : p.id) && (h.add(pe), (o = PickingPriorityType.reticule + 0.3))),
        (a.color.equals(h) && n.renderOrder === o) || (a.color.copy(h), (n.renderOrder = o), (r = !0))
    }
    r && (await this.renderBlurredOverlay(s))
  }
  setMaskVisibility(e) {
    this.maskVisible !== e && (e ? this.scene.add(this.root) : this.scene.remove(this.root), (this.maskVisible = e))
  }
}
function ve(e, t) {
  const s = e.clone().applyQuaternion(t.rotation).normalize()
  return t.position.clone().add(s)
}
class we extends ObservableObject {
  selected: boolean
  hovered: boolean
  constructor() {
    super(...arguments), (this.selected = !1), (this.hovered = !1)
  }
}
class Ee extends ObservableObject {
  openedTool: boolean
  createdBlur: boolean
  constructor() {
    super(...arguments), (this.openedTool = !1), (this.createdBlur = !1)
  }
}
class BlurEditorData extends Data {
  toolState: any
  brushCursorVisibility: boolean
  interactions: Ee
  showMouseCursor: boolean
  states: ObservableMap<any>
  _selectedBlur: null
  _hoveredBlur: null
  constructor() {
    super(...arguments),
      (this.name = "blur-editor"),
      (this.toolState = _BlurToolState.IDLE),
      (this.brushCursorVisibility = !1),
      (this.interactions = new Ee()),
      (this.showMouseCursor = !1),
      (this.states = new ObservableMap()),
      (this._selectedBlur = null),
      (this._hoveredBlur = null)
  }
  getState(e) {
    let t = this.states.get(e)
    return t || ((t = new we()), this.states.set(e, t)), t
  }
  get selectedBlur() {
    return this._selectedBlur
  }
  set selectedBlur(e) {
    if (this.selectedBlur === e) return
    const t = this.selectedBlur
    if (((this._selectedBlur = e), this.commit(), e)) {
      const t = this.getState(e.id)
      ;(t.selected = !0), t.commit()
    }
    if (t) {
      const e = this.getState(t.id)
      ;(e.selected = !1), e.commit()
    }
  }
  onSelectedBlurChanged(e) {
    return this.onPropertyChanged("_selectedBlur", e)
  }
  get hoveredBlur() {
    return this._hoveredBlur
  }
  set hoveredBlur(e) {
    if (this.hoveredBlur === e) return
    const t = this.hoveredBlur
    if (((this._hoveredBlur = e), this.commit(), e)) {
      const t = this.getState(e.id)
      ;(t.hovered = !0), t.commit()
    }
    if (t) {
      const e = this.getState(t.id)
      ;(e.hovered = !1), e.commit()
    }
  }
  onHoveredBlurChanged(e) {
    return this.onPropertyChanged("_hoveredBlur", e)
  }
}
const { BLURS: We, SCANS: qe, MODAL: Ze } = PhraseKey.WORKSHOP
function $e({ sweepCount: e, blurCount: t, failedBlurCount: s, nudge: i }) {
  const n = (0, Ye.b)(),
    a = n.t(qe.NUM_TYPE, e),
    r = n.t(We.NUM_TYPE, t),
    o = n.t(We.APPLY_MODAL_MESSAGE, { scans: a, blurs: r }),
    l = n.t(We.APPLY_MODAL_WARNING),
    d = n.t(We.APPLY_MODAL_NUDGE_MESSAGE)
  let u
  s > 0 && (u = n.t(We.APPLY_MODAL_RETRY))
  const c = t > re.Dr && n.t(We.APPLY_MODAL_TRUNCATED, { blurs: r, maxBlurs: re.Dr })
  return (0, He.jsxs)("div", {
    children: [
      i && (0, He.jsx)("p", { children: d }),
      (0, He.jsx)("p", { dangerouslySetInnerHTML: { __html: o } }),
      (0, He.jsx)("p", { dangerouslySetInnerHTML: { __html: l } }),
      u && (0, He.jsx)("p", { dangerouslySetInnerHTML: { __html: u } }),
      c && (0, He.jsx)("p", { dangerouslySetInnerHTML: { __html: c } })
    ]
  })
}
const Ke = async (e, t, s) => {
    if (!e.hasUnappliedBlurs()) return !1
    const i = e.getByStatus(BlurStatus.PENDING, BlurStatus.FAILED),
      n = e.getByStatus(BlurStatus.FAILED),
      a = new Set(i.map(e => e.sweepId)),
      r = s ? We.APPLY_MODAL_NUDGE_TITLE : We.APPLY_MODAL_TITLE,
      o = s ? We.APPLY_MODAL_NUDGE_CANCEL : Ze.NO,
      l = {
        title: r,
        message: (0, He.jsx)($e, { sweepCount: a.size, blurCount: i.length, failedBlurCount: n.length, nudge: s }),
        cancellable: !0,
        confirmPhraseKey: We.APPLY_MODAL_CONFIRM,
        cancelPhraseKey: o,
        cancelVariant: s ? Qe.Wu.TERTIARY : Qe.Wu.SECONDARY,
        modalClass: "blur-tool-modal full-modal"
      }
    return (await t.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, l))) === ConfirmBtnSelect.CONFIRM
  },
  { SUGGESTIONS: Je } = PhraseKey.WORKSHOP
class Xe {
  engine: any
  settingsData: any
  initialized: boolean
  toggledAssets: {
    "features/sweep_pucks": boolean
    "features/mattertags": boolean
    "features/notes": boolean
    "features/labels": boolean
    "features/360_views": boolean
  }
  navigateToNextSuggestion: (e: any, t: any) => void
  debouncedNavigateToNextSuggestion: (...i: any[]) => void
  settingsToggler: SettingsToggler
  dataMap: {
    blurData: any
    blurEditorData: any
    blurList: ObservableOrder<any>
    floorsViewData: any
    settings: any
    suggestionData: any
    suggestionList: ObservableOrder<any>
    sweepViewData: any
    viewmodeData: any
  }
  constructor(e, t) {
    ;(this.engine = e),
      (this.settingsData = t),
      (this.initialized = !1),
      (this.toggledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesNotesKey]: !1,
        [FeaturesLabelsKey]: !1,
        [Features360ViewsKey]: !1
      }),
      (this.navigateToNextSuggestion = (e, t) => {
        let s
        for (let i = 0; i < e.length; i++) {
          const n = e[i],
            a = n.items.indexOf(t)
          if (-1 !== a) {
            const t = a + 1
            t < n.items.length ? (s = n.items[t]) : e[i + 1] && e[i + 1].items.length && (s = e[i + 1].items[0])
            break
          }
        }
        s && this.engine.commandBinder.issueCommand(new NavigateToBlurCommand(s, !1))
      }),
      (this.debouncedNavigateToNextSuggestion = (0, Ge.D)(this.navigateToNextSuggestion, 500)),
      (this.settingsToggler = new SettingsToggler(this.settingsData, this.toggledAssets))
  }
  async activate() {
    var e
    if (!this.initialized) {
      this.initialized = !0
      const { market: e } = this.engine,
        [t, s, i, n, a] = await Promise.all([
          e.waitForData(BlurData),
          e.waitForData(BlurEditorData),
          e.waitForData(FloorsViewData),
          e.waitForData(SweepsViewData),
          e.waitForData(ViewmodeData)
        ]),
        r = new ObservableOrder(t.blurs)
      r.sort((e, t) => e.index - t.index), (r.priority = ObservableOrderPriority.LOW)
      const o = await e.waitForData(BlurSuggestionData),
        l = new ObservableOrder(o.suggestions)
      l.setFilter("accepted", e => null === e.accepted),
        l.sort((e, t) => t.index - e.index),
        (this.dataMap = {
          blurData: t,
          blurEditorData: s,
          blurList: r,
          floorsViewData: i,
          settings: this.settingsData,
          suggestionData: o,
          suggestionList: l,
          sweepViewData: n,
          viewmodeData: a
        })
    }
    const t = null === (e = this.dataMap.sweepViewData.data.currentSweepObject) || void 0 === e ? void 0 : e.isAligned(),
      s = this.dataMap.viewmodeData.canStartTransition() && this.dataMap.viewmodeData.currentMode !== ViewModes.Panorama
    s && !t && (await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE))),
      this.settingsToggler.toggle(!0),
      this.toggleBlurTool(BlurToolState.IDLE),
      s && t && (await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE)))
  }
  async deactivate() {
    const { blurData: e } = this.dataMap
    if (!e.hasProcessingBlurs() && e.hasUnappliedBlurs()) {
      ;(await Ke(this.dataMap.blurData, this.engine.commandBinder, !0)) && this.engine.commandBinder.issueCommand(new ApplyBlursCommand())
    }
    this.settingsToggler.toggle(!1), await this.toggleBlurTool(BlurToolState.OFF)
  }
  async toggleBlurTool(e) {
    await this.engine.commandBinder.issueCommand(new BlurToolChangeCommand(e))
  }
  async rejectAllSuggestions() {
    const { suggestionData: e } = this.dataMap
    if (!e) return !1
    const t = e.getByAccepted(null).map(e => e.id)
    if (!t.length) return !1
    const s = (0, ze.P)(t.length, Je.TYPE)
    return (
      (await this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, s))) !== ConfirmBtnSelect.CLOSE &&
      (this.engine.commandBinder.issueCommand(new RejectBlurSuggestionsCommand(...t)), !0)
    )
  }
}

import Slider from "rc-slider"
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  CubeCamera,
  DoubleSide,
  FrontSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  RawShaderMaterial,
  RGBAFormat,
  RingGeometry,
  UniformsUtils,
  Vector3,
  WebGLCubeRenderTarget
} from "three"
import * as Dt from "../other/11889"
import { useAnalytics } from "../other/19564"
import * as At from "../other/25770"
import { isIncludes } from "../other/29708"
import * as nt from "../other/38772"
import * as gt from "../other/45755"
import * as ht from "../other/51978"
import * as ot from "../other/60770"
import * as ft from "../other/69041"
import * as Gt from "../other/72400"
import * as It from "../other/73372"
import * as wt from "../other/75043"
import * as Xt from "../other/82513"
import * as rt from "../other/86495"
import { Blur } from "../observable/observable.blur"
import { AcceptBlurSuggestionsCommand, HideBlurSuggestionsCommand, RejectBlurSuggestionsCommand, ShowBlurSuggestionsCommand } from "../command/blurs.command"
import { ApplyBlursCommand, DeleteBlursCommand, RefreshBlursCommand, SaveBlursCommand } from "../command/blurs.command"
import { ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState } from "../command/ui.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { SetPanoOverlayCommand } from "../command/pano.command"
import { RequestRenderTargetCameraCommand } from "../command/webgl.command"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { RegisterToolsCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { PickingPriorityType } from "../const/12529"
import { Features360ViewsKey } from "../const/360.const"
import { TransactionState } from "../const/45905"
import { TransitionTypeList } from "../const/64918"
import { BlurStatus } from "../const/66310"
import { CursorStyle } from "../const/cursor.const"
import { EngineTickState } from "../const/engineTick.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { PhraseKey } from "../const/phrase.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { SettingsToggler } from "../core/settingsToggler"
import { BlurData } from "../data/blur.data"
import { FloorsViewData } from "../data/floors.view.data"
import { PointerData } from "../data/pointer.data"
import { SettingsData } from "../data/settings.data"
import * as ws from "../data/storage.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent } from "../events/drag.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { MoveToSweepBeginMessage } from "../message/sweep.message"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { WebglRendererContextRestoredMessage } from "../message//webgl.message"
import { ObservableMap } from "../observable/observable.map"
import { ObservableObject } from "../observable/observable.object"
import { ObservableOrder, ObservableOrderPriority } from "../observable/observable.order"
import { ObservableValue } from "../observable/observable.value"
import { EventsSubscription } from "../subscription/events.subscription"
import { PlacementType } from "../object/sweep.object"
import { winCanTouch } from "../utils/browser.utils"
import { DirectionVector } from "../webgl/vector.const"
import { getPlaneGeometry } from "../webgl/56512"
import { useDataHook } from "../other/45755"
import { calculatePostDirection } from "../math/59370"
import { checkLerpThreshold, createRotationMatrixFromQuaternion, lerp } from "../math/2569"
const lt = "Blur-Help",
  { BLURS: dt } = PhraseKey.WORKSHOP
function ut({ canAdd: e, selectedBlur: t, onClickAdd: s, onDelete: n, toolState: a, nudgeDisabled: r }) {
  const o = (0, Ye.b)(),
    l = o.t(dt.CREATE_TOOLTIP_TITLE),
    d = o.t(dt.CREATE_TOOLTIP_MESSAGE)
  let u = ot.d.ADD
  a === BlurToolState.PAINTING && (u = t ? ot.d.CONFIRM : ot.d.CANCEL)
  const c =
    t && t.editable ? (0, He.jsx)(Qe.zx, { className: "action-button-outer", variant: Qe.Wu.FAB, theme: "overlay", icon: "delete", onClick: n }) : void 0
  return (0, He.jsx)(
    rt.o,
    Object.assign(
      { outerRight: c },
      {
        children: (0, He.jsx)(ot.H, {
          addIcon: u,
          onClick: s,
          disabled: !e,
          ariaDescribedBy: lt,
          nudgeMessage: d,
          nudgeTitle: l,
          nudgeLocalStorage: UserPreferencesKeys.BlursAddNudgeSeen
        })
      }
    )
  )
}
const mt = useDataHook(BlurEditorData)

enum BrushState {
  feather = "feather",
  opacity = "opacity",
  pressure = "pressure",
  scale = "scale",
  size = "size",
  state = "state"
}
function bt() {
  const e = (function () {
      const e = mt()
      return (null == e ? void 0 : e.brush) || null
    })(),
    [t, s] = (0, et.useState)(0.2)
  return (
    (0, et.useEffect)(() => {
      if (!e) return () => {}
      const t = () => {
          s(e.scale)
        },
        i = e.onPropertyChanged(BrushState.scale, t)
      return t(), () => i.cancel()
    }, [e]),
    t
  )
}

const { BLURS: vt } = PhraseKey.WORKSHOP
const St = "blur-nudge-seen"
function Ct({ toolState: e }) {
  const t = (0, Ye.b)(),
    [s, n] = (0, et.useState)(20),
    a = (0, ht.y)(St, !1),
    [o, l] = (0, et.useState)(!a),
    { commandBinder: d, settings: u } = (0, et.useContext)(AppReactContext),
    [c, h] = (0, et.useState)(null),
    g = bt()
  if (
    ((0, et.useEffect)(() => {
      const e = Math.round(lerp(g, 0, 1, 1, 100))
      n(e)
    }, [g]),
    (0, et.useEffect)(
      () => () => {
        u.setProperty(St, !0)
      },
      []
    ),
    e !== BlurToolState.PAINTING)
  )
    return null
  const m = t.t(vt.BRUSH_TOOLTIP_TITLE),
    p = t.t(vt.BRUSH_TOOLTIP_MESSAGE),
    b = (0, He.jsx)(ft.p, { className: "nudge-featured", title: m, message: p, closeButton: !0 }),
    f = {
      trigger: "static",
      onToggle: e => {
        e || l(!1)
      },
      theme: "light",
      size: "small",
      className: "nudge-button-tooltip",
      placement: "top",
      offset: [0, 30]
    }
  return (0, He.jsxs)(
    "div",
    Object.assign(
      { className: "brush-controls" },
      {
        children: [
          (0, He.jsx)(
            "div",
            Object.assign(
              { className: "brush-size-control", ref: h },
              {
                children: (0, He.jsx)(Slider, {
                  min: 1,
                  max: 100,
                  step: 1,
                  included: !0,
                  dots: !1,
                  value: s,
                  onChange: e => {
                    l(!1)
                    const t = lerp(e, 1, 100, 0, 1)
                    d.issueCommand(new SetBlurBrushScaleCommand(t))
                  }
                })
              }
            )
          ),
          o && (0, He.jsx)(Qe.u, Object.assign({ title: b, target: c }, f))
        ]
      }
    )
  )
}

const { BLURS: yt } = PhraseKey.WORKSHOP
@nt.Z
class Tt extends et.Component {
  bindings: never[]
  onToolStateChange: (e: any) => void
  onBrushStateChange: (e: any) => void
  onSelectedBlurChange: (e: any) => void
  onDeleteClick: () => Promise<void>
  onCreateClick: () => void
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.onToolStateChange = e => {
        let { creating: t } = this.state
        e === BlurToolState.IDLE ? (t = !1) : e === BlurToolState.PAINTING && (t = !0), this.setState({ toolState: e, creating: t })
      }),
      (this.onBrushStateChange = e => {
        this.setState({ brushState: e })
      }),
      (this.onSelectedBlurChange = e => {
        this.setState({ selectedBlur: e })
      }),
      (this.onDeleteClick = async () => {
        const { toolState: e } = this.state
        await this.deleteSelectedBlur(), e === BlurToolState.PAINTING && this.context.commandBinder.issueCommand(new BlurToolChangeCommand(BlurToolState.IDLE))
      }),
      (this.onCreateClick = () => {
        let e = BlurToolState.IDLE
        this.state.toolState === BlurToolState.IDLE && (e = BlurToolState.PAINTING), this.context.commandBinder.issueCommand(new BlurToolChangeCommand(e))
      })
    const { viewmodeData: t } = this.props.manager.dataMap
    this.state = {
      toolState: BlurToolState.IDLE,
      brushState: ObservablesState.DISABLED,
      viewmode: t.currentMode,
      selectedBlur: null,
      showHints: !0,
      creating: !1
    }
  }
  componentDidMount() {
    const { blurEditorData: e, viewmodeData: t } = this.props.manager.dataMap
    this.bindings.push(
      e.onPropertyChanged("toolState", this.onToolStateChange),
      e.onSelectedBlurChanged(this.onSelectedBlurChange),
      e.brush.onPropertyChanged(BrushState.state, this.onBrushStateChange),
      e.interactions.onPropertyChanged("createdBlur", () => {
        this.setState({ showHints: !1 })
      }),
      t.makeModeChangeSubscription(e => {
        this.setState({ viewmode: e })
      })
    )
  }
  componentWillUnmount() {
    for (const e of this.bindings) e.cancel()
    this.bindings = []
  }
  deleteSelectedBlur() {
    const { selectedBlur: e } = this.state,
      { commandBinder: t } = this.context
    if (!e) throw new Error("Cannot delete, no Blur selected")
    t.issueCommand(new DeleteBlursCommand(e.id))
  }
  renderOverlayMessage() {
    const { locale: e } = this.context,
      { toolState: t, showHints: s } = this.state
    if (!s || t !== BlurToolState.PAINTING) return null
    const n = e.t(winCanTouch() ? yt.OVERLAY_MESSAGE_TOUCH : yt.OVERLAY_MESSAGE)
    return (0, He.jsxs)(
      "div",
      Object.assign(
        { className: "overlay-message" },
        {
          children: [
            (0, He.jsx)("div", { className: "icon icon-brush-outline" }),
            (0, He.jsx)("span", Object.assign({ id: lt, className: "message" }, { children: n }))
          ]
        }
      )
    )
  }
  render() {
    const { locale: e } = this.context,
      { blurList: t } = this.props.manager.dataMap,
      { brushState: s, toolState: n, selectedBlur: a, viewmode: r } = this.state,
      o = st("blur-tool-overlay", "overlay", "grid-overlay", { painting: s === ObservablesState.PAINTING }),
      l = n === BlurToolState.SUGGESTING,
      d = a && e.t(l ? yt.SUGGESTED_BLUR : yt.DEFAULT_BLUR_NAME, { number: a.index }),
      u = t.length > 0
    return (0, He.jsxs)(
      "div",
      Object.assign(
        { className: o },
        {
          children: [
            a && (0, He.jsx)(wt.u, { children: d }),
            !l &&
              (0, He.jsxs)(He.Fragment, {
                children: [
                  this.renderOverlayMessage(),
                  (0, He.jsx)(ut, {
                    toolState: n,
                    nudgeDisabled: u,
                    canAdd: r === ViewModes.Panorama,
                    selectedBlur: a,
                    onClickAdd: this.onCreateClick,
                    onDelete: this.onDeleteClick
                  }),
                  (0, He.jsx)(Ct, { toolState: n })
                ]
              })
          ]
        }
      )
    )
  }
}
Tt.contextType = AppReactContext

enum xt {
  FLOORS = "floors",
  SCANS = "scans"
}
const { BLURS: _t } = PhraseKey.WORKSHOP,
  Lt = {
    all: _t.BLUR_STATUS_ALL,
    [BlurStatus.PENDING]: _t.BLUR_STATUS_PENDING,
    [BlurStatus.APPLIED]: _t.BLUR_STATUS_APPLIED,
    [BlurStatus.FAILED]: _t.BLUR_STATUS_FAILED,
    [BlurStatus.PROCESSING]: _t.BLUR_STATUS_PROCESSING
  },
  Ot = ({ value: e, onChange: t }) => {
    const s = (0, Ye.b)(),
      i = s.t(e ? Lt[e] : _t.STATUS)
    return (0, He.jsxs)(
      Qe.xz,
      Object.assign(
        { className: "blur-filter blur-filter-status", variant: Qe.Wu.TERTIARY, label: i, ariaLabel: i, caret: !0 },
        {
          children: [
            (0, He.jsx)(Qe.zx, { label: s.t(_t.BLUR_STATUS_ALL), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t("all") }),
            (0, He.jsx)(Qe.zx, { label: s.t(_t.BLUR_STATUS_PENDING), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t(BlurStatus.PENDING) }),
            (0, He.jsx)(Qe.zx, { label: s.t(_t.BLUR_STATUS_APPLIED), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t(BlurStatus.APPLIED) }),
            (0, He.jsx)(Qe.zx, { label: s.t(_t.BLUR_STATUS_FAILED), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t(BlurStatus.FAILED) })
          ]
        }
      )
    )
  },
  Pt = { [xt.SCANS]: _t.GROUP_BY_SCAN, [xt.FLOORS]: _t.GROUP_BY_FLOOR },
  kt = ({ value: e, onChange: t }) => {
    const s = (0, Ye.b)(),
      i = s.t(e ? Pt[e] : _t.GROUP_BY)
    return (0, He.jsxs)(
      Qe.xz,
      Object.assign(
        { className: "blur-filter blur-filter-groupby", variant: Qe.Wu.TERTIARY, label: i, ariaLabel: i, caret: !0 },
        {
          children: [
            (0, He.jsx)(Qe.zx, { label: s.t(_t.GROUP_BY_SCAN), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t(xt.SCANS) }),
            (0, He.jsx)(Qe.zx, { label: s.t(_t.GROUP_BY_FLOOR), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t(xt.FLOORS) })
          ]
        }
      )
    )
  },
  Nt = { CREATED_DESC: _t.SORT_CREATED_DESC, CREATED_ASC: _t.SORT_CREATED_ASC },
  Mt = ({ value: e, onChange: t }) => {
    const s = (0, Ye.b)(),
      i = s.t(e ? Nt[e] : _t.SORT)
    return (0, He.jsxs)(
      Qe.xz,
      Object.assign(
        { className: "blur-filter blur-filter-sort", variant: Qe.Wu.TERTIARY, label: i, ariaLabel: i, caret: !0 },
        {
          children: [
            (0, He.jsx)(Qe.zx, { label: s.t(_t.SORT_CREATED_DESC), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t("CREATED_DESC") }),
            (0, He.jsx)(Qe.zx, { label: s.t(_t.SORT_CREATED_ASC), size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: () => t("CREATED_ASC") })
          ]
        }
      )
    )
  }
function jt() {
  const [e, t] = (0, et.useState)(null),
    s = mt()
  return (
    (0, et.useEffect)(() => {
      const e = []
      return (
        s && (e.push(s.onSelectedBlurChanged(e => t(e))), t(s.selectedBlur)),
        () => {
          e.forEach(e => e.cancel())
        }
      )
    }, [s]),
    e
  )
}
function Ft() {
  const [e, t] = (0, et.useState)(null),
    s = mt()
  return (
    (0, et.useEffect)(() => {
      const e = []
      return (
        s && (e.push(s.onHoveredBlurChanged(e => t(e))), t(s.hoveredBlur)),
        () => {
          e.forEach(e => e.cancel())
        }
      )
    }, [s]),
    e
  )
}
const { BLURS: zt } = PhraseKey.WORKSHOP
function Vt({ blur: e }) {
  const { commandBinder: t } = (0, et.useContext)(AppReactContext),
    s = mt(),
    i = jt(),
    n = Ft(),
    a = (0, Ye.b)(),
    r = useAnalytics(),
    l = (0, et.useCallback)(() => {
      t.issueCommand(new NavigateToBlurCommand(e, !0))
    }, [t, e]),
    c = (0, et.useCallback)(() => {
      const s = e.visible
      s ? t.issueCommand(new HideBlursCommand(e.id)) : t.issueCommand(new ShowBlursCommand(e.id)),
        r.trackToolGuiEvent("blur", "blur_list_click_" + (s ? "hide" : "show"))
    }, [t, e, r]),
    h = (0, et.useCallback)(() => {
      t.issueCommand(new DeleteBlursCommand(e.id)), r.trackToolGuiEvent("blur", "blur_list_click_delete")
    }, [t, e, r]),
    g = (0, et.useCallback)(() => {
      s && (s.hoveredBlur = e)
    }, [e, s]),
    m = (0, et.useCallback)(() => {
      s && (s.hoveredBlur = null)
    }, [s]),
    p = e.status !== BlurStatus.PENDING,
    b = (0, He.jsxs)("span", {
      children: [a.t(zt.DEFAULT_BLUR_NAME, { number: e.index }), p && (0, He.jsx)("span", Object.assign({ className: "blur-status" }, { children: e.status }))]
    }),
    f = e.status !== BlurStatus.APPLIED && e.status !== BlurStatus.PROCESSING,
    v = a.t(zt.DELETE_BLUR_CTA),
    S = (0, He.jsx)(Qe.hE, {
      children:
        f &&
        (0, He.jsxs)(He.Fragment, {
          children: [
            (0, He.jsx)(Gt.Z, {
              id: e.id,
              visible: e.visible,
              showTooltip: zt.SHOW_LIST_ITEM_TOOLTIP_MESSAGE,
              hideTooltip: zt.HIDE_LIST_ITEM_TOOLTIP_MESSAGE,
              onClick: c
            }),
            (0, He.jsx)(
              Qe.xz,
              Object.assign(
                { icon: "more-vert", ariaLabel: a.t(PhraseKey.MORE_OPTIONS), menuArrow: !0, menuClassName: "search-result-menu" },
                { children: (0, He.jsx)(Qe.zx, { className: "menu-delete-btn", label: v, size: Qe.qE.SMALL, variant: Qe.Wu.TERTIARY, onClick: h }) }
              )
            )
          ]
        })
    }),
    C = st("blur-list-item", { active: i && i.id === e.id }, { hover: n && n.id === e.id })
  return (0, He.jsx)(Qe.HC, { className: C, onClick: l, onMouseEnter: g, onMouseLeave: m, actions: S, title: b, id: e.id })
}
const Ht = "other",
  { BLURS: Yt, SCANS: Qt, VIEWS_360: Wt } = PhraseKey.WORKSHOP
function qt(e, t) {
  const [s, i] = (0, et.useState)(xt.SCANS),
    [n, a] = (0, et.useState)([]),
    r = (0, Ye.b)(),
    o = (0, et.useCallback)(() => {
      const { sweepViewData: s } = t.dataMap,
        i = s.getAlignedSweeps(!1),
        n = {}
      if (e) {
        const t = e.groupBy("sweepId")
        for (const e in t) {
          const a = s.getSweep(e)
          let o = r.t(Qt.LIST_ITEM_TEXT, a.index + 1)
          if (!a.isAligned()) {
            const e = i.findIndex(e => e.id === a.id) || 0
            o = a.name || r.t(Wt.DEFAULT_NAME, { index: e + 1 })
          }
          n[e] = { id: `sweep-${a.id}`, data: a, title: o, items: t[e] }
        }
      }
      return n
    }, [e, r, t.dataMap]),
    l = (0, et.useCallback)(() => {
      const { floorsViewData: s } = t.dataMap,
        i = {}
      if (e) {
        const t = e.groupBy("floorId")
        s.floors.iterate(e => {
          i[e.id] = { id: e.id, data: e, title: e.name, items: t[e.id] || [] }
        }),
          t.null && (i.other = { id: Ht, title: r.t(Yt.OTHER_GROUP_LABEL), items: t.null })
      }
      return i
    }, [e, r, t.dataMap]),
    d = (0, et.useCallback)(() => {
      const e = s === xt.SCANS ? o() : l(),
        t = Object.values(e).sort((e, t) => e.title.localeCompare(t.title, void 0, { numeric: !0 }))
      a(t)
    }, [o, l, s])
  return (
    (0, et.useEffect)(() => {
      const t = [
        e.onChanged(() => {
          d()
        })
      ]
      return (
        d(),
        () => {
          t.forEach(e => e.cancel())
        }
      )
    }, [e, s, r, t.dataMap, d]),
    { groups: n, groupBy: s, setGroupBy: i }
  )
}
const Zt = useDataHook(BlurSuggestionData)
const { BLURS: $t } = PhraseKey.WORKSHOP
let Kt = !1
const Jt = () => {
  const e = (function () {
      const e = Zt(),
        [t, s] = (0, et.useState)(0)
      return (
        (0, et.useEffect)(() => {
          if (!e) return () => {}
          const t = () => {
              s(e.getByAccepted(null).length)
            },
            i = e.onChanged(t)
          return t(), () => i.cancel()
        }, [e]),
        t
      )
    })(),
    { commandBinder: t } = (0, et.useContext)(AppReactContext),
    s = (0, Ye.b)(),
    n = useAnalytics(),
    r = (0, et.useCallback)(() => {
      n.trackToolGuiEvent("blur", "blur_click_view_suggestions"), t.issueCommand(new BlurToolChangeCommand(BlurToolState.SUGGESTING))
    }, [t, n])
  if (!e) return null
  const o = s.t($t.SUGGESTIONS_AVAILABLE_MESSAGE, e),
    l = (0, He.jsxs)(
      Qe.zx,
      Object.assign(
        { size: Qe.qE.SMALL, variant: Qe.Wu.SECONDARY, onClick: r },
        { children: [(0, He.jsx)(Qe.o3, {}), (0, He.jsx)("span", { children: s.t($t.VIEW_SUGGESTIONS) })] }
      )
    )
  return (
    Kt || ((Kt = !0), n.trackToolGuiEvent("blur", "blur_suggestions_banner_shown")),
    (0, He.jsx)(Qe.jL, { layout: "horizontal", text: o, actions: l, className: "blur-list-banner" })
  )
}
const { BLURS: es } = PhraseKey.WORKSHOP,
  ts = ({ group: e }) => {
    const { id: t, items: s } = e
    return (0, He.jsx)(Xt.J, { id: t, numItems: s.length })
  },
  ss = ({ group: e }) => {
    const { id: t, title: s, items: i } = e
    return (0, He.jsx)(Qe._m, {
      id: t,
      title: s,
      decals: (0, He.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: `(${i.length})` }))
    })
  },
  is = ({ item: e }) => {
    const t = (0, Ye.b)()
    if (!e) {
      const e = t.t(es.MULTI_FLOOR_EMPTY_MESSAGE)
      return (0, He.jsx)(Qe.gQ, { message: e })
    }
    return (0, He.jsx)(Vt, { blur: e })
  },
  ns = ({ className: e = "", manager: t }) => {
    const { blurList: s } = t.dataMap,
      i = (0, Ye.b)(),
      n = useAnalytics(),
      [a, r] = (0, et.useState)(null),
      { groups: o, groupBy: l, setGroupBy: d } = qt(s, t),
      u = (0, et.useCallback)(
        e => {
          isIncludes(BlurStatus, e) ? s.setFilter("status", t => t.status === e) : s.clearFilter("status"),
            null !== e && n.trackToolGuiEvent("blur", `blur_list_filter_by_${e}`),
            r(e)
        },
        [s, n]
      ),
      [c, h] = (0, et.useState)(null),
      g = (0, et.useCallback)(
        e => {
          switch (e) {
            case "CREATED_DESC":
              s.sort((e, t) => e.created.getTime() - t.created.getTime() || e.index - t.index)
              break
            case "CREATED_ASC":
              s.sort((e, t) => t.created.getTime() - e.created.getTime() || t.index - e.index)
          }
          null !== e && n.trackToolGuiEvent("blur", `blur_list_sort_by_${e.toLowerCase()}`), h(e)
        },
        [s, n]
      ),
      m = (0, et.useCallback)(
        e => {
          n.trackToolGuiEvent("blur", `blur_list_group_by_${e.toLowerCase()}`), d(e)
        },
        [d, n]
      ),
      p = st(e, "blur-list"),
      b = i.t(es.NO_BLURS)
    return (0, He.jsxs)(
      "div",
      Object.assign(
        { className: p },
        {
          children: [
            (0, He.jsxs)(
              "header",
              Object.assign(
                { className: "blur-list-header" },
                {
                  children: [
                    (0, He.jsx)(Jt, {}),
                    (0, He.jsxs)(Qe.w0, {
                      children: [
                        (0, He.jsx)(kt, { value: l, onChange: m }),
                        (0, He.jsx)(Ot, { value: a, onChange: u }),
                        (0, He.jsx)(Mt, { value: c, onChange: g })
                      ]
                    })
                  ]
                }
              )
            ),
            (0, He.jsx)(
              "div",
              Object.assign(
                { className: "blur-list-content" },
                {
                  children:
                    0 === o.length
                      ? (0, He.jsx)(Qe.gQ, { message: b, itemHeight: 60 })
                      : (0, He.jsx)(Qe.UQ, {
                          ariaExpandLabel: i.t(PhraseKey.ACCORDIONS.EXPAND),
                          ariaCollapseLabel: i.t(PhraseKey.ACCORDIONS.COLLAPSE),
                          data: o,
                          itemHeight: 60,
                          renderItem: is,
                          renderGroup: l === xt.FLOORS ? ts : ss
                        })
                }
              )
            )
          ]
        }
      )
    )
  }
function as() {
  const e = mt(),
    [t, s] = (0, et.useState)(BlurToolState.OFF)
  return (
    (0, et.useEffect)(() => {
      const t = []
      if (e) {
        const i = () => {
          s(e.toolState)
        }
        t.push(e.onPropertyChanged("toolState", i)), i()
      }
      return () => {
        t.forEach(e => e.cancel())
      }
    }, [e]),
    t
  )
}
const { BLURS: rs } = PhraseKey.WORKSHOP,
  os = ({ suggestion: e, onResolved: t }) => {
    const { commandBinder: s } = (0, et.useContext)(AppReactContext),
      i = useAnalytics(),
      n = (0, Ye.b)(),
      a = mt(),
      r = Ft(),
      l = jt(),
      [d, u] = (0, et.useState)(null),
      c = (0, et.useCallback)(() => {
        s.issueCommand(new AcceptBlurSuggestionsCommand(e.id)), i.trackToolGuiEvent("blur", "blur_suggestion_list_click_accept"), t(e, !0)
      }, [i, s, e, t]),
      h = (0, et.useCallback)(() => {
        s.issueCommand(new RejectBlurSuggestionsCommand(e.id)), i.trackToolGuiEvent("blur", "blur_suggestion_list_click_reject"), t(e, !1)
      }, [i, s, e, t]),
      g = (0, et.useCallback)(
        e => {
          d || (u("accepted"), setTimeout(c, 500), e.stopPropagation())
        },
        [c, d]
      ),
      m = (0, et.useCallback)(
        e => {
          d || (u("rejected"), setTimeout(h, 500), e.stopPropagation())
        },
        [h, d]
      ),
      p = (0, et.useCallback)(
        t => {
          const n = e.visible
          n ? s.issueCommand(new HideBlurSuggestionsCommand(e.id)) : s.issueCommand(new ShowBlurSuggestionsCommand(e.id)),
            i.trackToolGuiEvent("blur", "blur_suggestion_list_click_" + (n ? "hide" : "show")),
            t.stopPropagation()
        },
        [i, s, e]
      ),
      b = { placement: "top" },
      f = (0, et.useCallback)(() => {
        a && (a.hoveredBlur = e)
      }, [e, a]),
      v = (0, et.useCallback)(() => {
        a && (a.hoveredBlur = null)
      }, [a]),
      S = (0, He.jsxs)(Qe.hE, {
        children: [
          (0, He.jsx)(Qe.zx, {
            icon: e.visible ? "eye-show" : "eye-hide",
            onClick: p,
            tooltip: e.visible ? n.t(rs.HIDE_LIST_ITEM_TOOLTIP_MESSAGE) : n.t(rs.SHOW_LIST_ITEM_TOOLTIP_MESSAGE),
            tooltipOptions: b
          }),
          (0, He.jsx)(Qe.zx, { icon: "checkmark", onClick: g, tooltip: n.t(rs.ACCEPT_SUGGESTION_TOOLTIP), tooltipOptions: b }),
          (0, He.jsx)(Qe.zx, { icon: "close", onClick: m, tooltip: n.t(rs.REJECT_SUGGESTION_TOOLTIP), tooltipOptions: b })
        ]
      }),
      C = n.t(rs.SUGGESTED_BLUR, { number: e.index }),
      B = st("blur-suggestion-list-item", { active: l && l.id === e.id, hover: r && r.id === e.id, accepted: "accepted" === d, rejected: "rejected" === d })
    return (0, He.jsx)(Qe.HC, {
      actions: S,
      className: B,
      title: C,
      id: e.id,
      onClick: () => {
        s.issueCommand(new NavigateToBlurCommand(e, !1))
      },
      onMouseEnter: f,
      onMouseLeave: v
    })
  },
  { BLURS: ls } = PhraseKey.WORKSHOP,
  ds = ({ onClose: e, manager: t }) => {
    const s = (0, Ye.b)(),
      i = useAnalytics(),
      { commandBinder: n } = (0, et.useContext)(AppReactContext),
      { suggestionList: a } = t.dataMap,
      r = (0, et.useCallback)(() => {
        n.issueCommand(new AcceptBlurSuggestionsCommand()), i.trackToolGuiEvent("blur", "blur_suggestion_list_click_accept_all"), e()
      }, [n, e, i]),
      o = (0, et.useCallback)(async () => {
        ;(await t.rejectAllSuggestions()) && (i.trackToolGuiEvent("blur", "blur_suggestion_list_click_reject_all"), e())
      }, [t, e, i])
    if (!(null == a ? void 0 : a.length)) return null
    const l = a.length,
      d = s.t(ls.SUGGESTIONS_FOUND_MESSAGE, l),
      u = (0, He.jsxs)(
        Qe.hE,
        Object.assign(
          { spacing: "small" },
          {
            children: [
              (0, He.jsx)(Qe.zx, { variant: Qe.Wu.PRIMARY, size: Qe.qE.SMALL, onClick: r, label: s.t(ls.ACCEPT_ALL_SUGGESTIONS) }),
              (0, He.jsx)(Qe.zx, { variant: Qe.Wu.TERTIARY, size: Qe.qE.SMALL, onClick: o, label: s.t(ls.REJECT_ALL_SUGGESTIONS) })
            ]
          }
        )
      ),
      c = (0, He.jsx)(Qe.zx, {
        size: Qe.qE.LARGE,
        variant: Qe.Wu.TERTIARY,
        onClick: e,
        className: "blur-banner-exit",
        icon: "back",
        label: s.t(ls.CLOSE_SUGGESTIONS)
      })
    return (0, He.jsx)("div", Object.assign({ className: "suggestion-list-header" }, { children: (0, He.jsx)(Qe.jL, { text: d, actions: u, header: c }) }))
  },
  { BLURS: us } = PhraseKey.WORKSHOP,
  cs = ({ group: e }) => {
    const { id: t, title: s, items: i } = e
    return (0, He.jsx)(Qe._m, {
      id: t,
      title: s,
      decals: (0, He.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: `(${i.length})` }))
    })
  },
  hs = ({ group: e }) => {
    const { id: t, items: s } = e
    return (0, He.jsx)(Xt.J, { id: t, numItems: s.length })
  },
  gs = ({ item: e, onResolved: t }) => {
    const s = (0, Ye.b)()
    if (!e) {
      const e = s.t(us.NO_SUGGESTIONS_ON_FLOOR)
      return (0, He.jsx)(Qe.gQ, { message: e })
    }
    return (0, He.jsx)(os, { suggestion: e, onResolved: t })
  },
  ms = ({ className: e, manager: t, onClose: s }) => {
    const { suggestionList: i } = t.dataMap,
      n = useAnalytics(),
      a = (0, Ye.b)(),
      { groups: r, groupBy: o, setGroupBy: l } = qt(i, t),
      d = (0, et.useCallback)(
        e => {
          n.trackToolGuiEvent("blur", `blur_suggestion_list_group_by_${e.toLowerCase()}`), l(e)
        },
        [n, l]
      ),
      u = (0, et.useCallback)(
        (e, s) => {
          t.debouncedNavigateToNextSuggestion(r, e)
        },
        [t, r]
      )
    if (!i) return null
    const c = st(e, "suggestion-list"),
      h = a.t(us.NO_SUGGESTIONS)
    return (0, He.jsxs)(
      "div",
      Object.assign(
        { className: c },
        {
          children: [
            (0, He.jsxs)(
              "header",
              Object.assign(
                { className: "suggestion-list-header" },
                { children: [(0, He.jsx)(ds, { manager: t, onClose: s }), (0, He.jsx)(Qe.w0, { children: (0, He.jsx)(kt, { value: o, onChange: d }) })] }
              )
            ),
            (0, He.jsx)(
              "div",
              Object.assign(
                { className: "suggestion-list-content" },
                {
                  children:
                    0 === r.length
                      ? (0, He.jsx)(Qe.gQ, { message: h, itemHeight: 42 })
                      : (0, He.jsx)(Qe.UQ, {
                          ariaExpandLabel: a.t(PhraseKey.ACCORDIONS.EXPAND),
                          ariaCollapseLabel: a.t(PhraseKey.ACCORDIONS.COLLAPSE),
                          data: r,
                          itemHeight: 42,
                          renderItem: gs,
                          renderItemProps: { onResolved: u },
                          renderGroup: o === xt.FLOORS ? hs : cs
                        })
                }
              )
            )
          ]
        }
      )
    )
  },
  ps = useDataHook(BlurData)
const { BLURS: bs } = PhraseKey.WORKSHOP
function fs() {
  const { analytics: e, commandBinder: t } = (0, et.useContext)(AppReactContext),
    [s, n] = (0, et.useState)(!1),
    a = ps(),
    r = (0, Ye.b)(),
    o = (function () {
      var e
      const t = ps(),
        [s, i] = (0, et.useState)((null === (e = null == t ? void 0 : t.getByStatus(BlurStatus.PROCESSING)) || void 0 === e ? void 0 : e.length) || 0)
      return (
        (0, et.useEffect)(() => {
          if (!t) return () => {}
          function e() {
            t && i(t.getByStatus(BlurStatus.PROCESSING).length)
          }
          const s = t.makeProcessingSubscription(e)
          return e(), () => s.cancel()
        }, [t]),
        s
      )
    })(),
    l = (function () {
      var e
      const t = ps(),
        [s, i] = (0, et.useState)(
          (null === (e = null == t ? void 0 : t.getByStatus(BlurStatus.PENDING, BlurStatus.FAILED)) || void 0 === e ? void 0 : e.length) || 0
        )
      return (
        (0, et.useEffect)(() => {
          if (!t) return () => {}
          function e() {
            t && i(t.getByStatus(BlurStatus.PENDING, BlurStatus.FAILED).length)
          }
          const s = [t.makeUnappliedSubscription(e), t.blurs.onElementChanged({ onAdded: e, onRemoved: e })]
          return (
            e(),
            () => {
              s.forEach(e => e.cancel())
            }
          )
        }, [t]),
        s
      )
    })(),
    d = as(),
    u = (0, et.useCallback)(async () => {
      if (!a || 0 === l) return
      n(!0), e.trackToolGuiEvent("blur", "blur_click_apply")
      if (await Ke(a, t, !1))
        return t.issueCommand(new ApplyBlursCommand()).finally(() => {
          n(!1)
        })
      n(!1)
    }, [l, a, e, t]),
    c = o > 0,
    h = l > 0,
    g = d === BlurToolState.PAINTING,
    m = h && !c && !s && !g,
    p = c ? r.t(bs.APPLYING, o) : r.t(bs.APPLY_BLURS_CTA, l)
  return (0, He.jsx)(Qe.zx, { className: "apply-blurs-button", variant: Qe.Wu.TERTIARY, disabled: !m, size: Qe.qE.SMALL, onClick: u, label: p })
}
const { BLURS: vs } = PhraseKey.WORKSHOP
function Ss({ manager: e, className: t }) {
  const s = (0, Dt.m)(e.dataMap.blurList),
    n = (0, Dt.m)(e.dataMap.suggestionList),
    { commandBinder: r } = (0, et.useContext)(AppReactContext),
    o = (0, Ye.b)(),
    l = as() === BlurToolState.SUGGESTING,
    d = st(t, "blurs-panel"),
    u = (0, et.useCallback)(
      e => {
        const t = l ? BlurToolState.IDLE : BlurToolState.SUGGESTING
        r.issueCommand(new BlurToolChangeCommand(t)), e && e.stopPropagation()
      },
      [l, r]
    )
  if (!s || !n) return null
  const c = l ? o.t(vs.NUM_BLUR_SUGGESTIONS, n.length) : o.t(vs.NUM_TYPE, s.length),
    h = l ? void 0 : (0, He.jsx)(fs, {}),
    g = l ? void 0 : (0, He.jsx)(At.z, { toolId: ToolsList.BLUR })
  return (0, He.jsxs)(
    It.L,
    Object.assign(
      { toolId: ToolsList.BLUR, className: d, title: c, controls: h, subheader: g },
      {
        children: [
          l && (0, He.jsx)(ms, { className: "blurs-panel-contents", manager: e, onClose: u }),
          !l && (0, He.jsx)(ns, { className: "blurs-panel-contents", manager: e })
        ]
      }
    )
  )
}
class Cs {
  renderPanel: () => et.ReactElement<any, string | et.JSXElementConstructor<any>>
  manager: any
  renderOverlay: () => et.ReactElement<any, string | et.JSXElementConstructor<any>>
  constructor(e, t) {
    ;(this.renderPanel = () => (0, He.jsx)(Ss, { manager: this.manager })),
      (this.renderOverlay = () => (0, He.jsx)(Tt, { manager: this.manager })),
      (this.manager = e)
  }
}
export default class BlurEditorModule extends Module {
  activeBindings: never[]
  setMeshCursorVisibility: () => boolean
  data: any
  changeToolState: (e: any) => Promise<void>
  navigateToBlur: (e: any, t: any) => any
  sweepData: any
  engine: any
  toolData: any
  renderer: any
  checkForUpdates: () => Subscription
  onViewmodeChange: (e: any) => void
  clickHandler: any
  onSweepChange: (e: any) => void
  onBlursChanged: () => void
  blurData: any
  onSuggestionsChanged: () => void
  suggestionData: any
  onPointerButton: (e: any) => void
  raycasterData: { hit: any }
  onKeyEvent: (e: any) => void
  onClick: (e: any, t: any) => boolean
  onPaint: (e: any, t: any, s: any, i: any) => void
  updateHoveredBlur: () => void
  config: any
  cameraData: any
  cursorController: any
  settings: any
  storageData: any
  viewmodeData: any
  pollingSubscription: any
  constructor() {
    super(...arguments),
      (this.name = "blur_editor"),
      (this.activeBindings = []),
      (this.setMeshCursorVisibility = () => !this.data.hoveredBlur && this.data.toolState !== BlurToolState.PAINTING),
      (this.changeToolState = async e => {
        const t = this.data.toolState
        e !== t && ((this.data.toolState = e), this.data.commit(), await this.onToolStateChange(e, t))
      }),
      (this.navigateToBlur = (e, t) => {
        if (!e) throw new Error("Cannot navigate to non-existant blur")
        let s
        const n = this.getFocalPoint(e.dots)
        if (n) {
          const t = this.sweepData.getSweep(e.sweepId)
          n.applyQuaternion(t.rotation), (s = createRotationMatrixFromQuaternion(new Quaternion().setFromUnitVectors(DirectionVector.FORWARD, n)))
        }
        let r = TransitionTypeList.Interpolate
        const o = this.sweepData.currentSweepObject
        if (o) {
          const t = this.sweepData.getSweep(e.sweepId)
          o.neighbours.includes(t.id) || (r = TransitionTypeList.FadeToBlack)
        }
        const l = new MoveToSweepCommand({ transition: r, sweep: e.sweepId, rotation: s }),
          d = this.engine.commandBinder.issueCommand(l).then(() => {
            this.data.selectedBlur = e || null
          })
        return (
          t && this.engine.commandBinder.issueCommand(new BlurToolChangeCommand(BlurToolState.IDLE)),
          this.toolData.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL && this.engine.commandBinder.issueCommand(new ToolPanelToggleCollapseCommand(!0)),
          d
        )
      }),
      (this.onToolStateChange = async (e, t) => {
        const { brush: s } = this.data
        t === BlurToolState.PAINTING && (await this.engine.commandBinder.issueCommand(new SaveBlursCommand())),
          e === BlurToolState.PAINTING
            ? (s.enable(),
              this.engine.broadcast(new ToggleViewingControlsMessage(!1)),
              this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand()))
            : (s.disable(),
              this.engine.broadcast(new ToggleViewingControlsMessage(!0)),
              this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand())),
          e === BlurToolState.OFF
            ? (this.activeBindings.forEach(e => e.cancel()),
              (this.data.selectedBlur = null),
              (this.data.hoveredBlur = null),
              (this.data.interactions.openedTool = !1),
              this.data.interactions.commit(),
              this.renderer.setBlurs([]))
            : this.activeBindings.forEach(e => e.renew()),
          e !== BlurToolState.OFF &&
            ((this.data.selectedBlur = null),
            (this.data.hoveredBlur = null),
            this.data.interactions.openedTool || ((this.data.interactions.openedTool = !0), this.data.interactions.commit()),
            e === BlurToolState.SUGGESTING ? this.renderSuggestions() : this.renderBlurs()),
          this.updatePolling()
      }),
      (this.checkForUpdates = () => {
        let e
        return createSubscription(
          () => {
            clearInterval(e),
              (e = window.setInterval(() => {
                this.log.debug("Polling..."), this.engine.commandBinder.issueCommand(new RefreshBlursCommand())
              }, 1e3 * Ie.F8))
          },
          () => {
            window.clearInterval(e)
          },
          !1
        )
      }),
      (this.onViewmodeChange = e => {
        const { toolState: t } = this.data
        e !== ViewModes.Panorama && t === BlurToolState.PAINTING && this.changeToolState(BlurToolState.IDLE),
          e === ViewModes.Panorama ? this.clickHandler.renew() : this.clickHandler.cancel()
      }),
      (this.onSweepChange = e => {
        const { selectedBlur: t } = this.data
        t && (this.onDeselectBlur(t), (this.data.selectedBlur = null))
      }),
      (this.onBlursChanged = () => {
        const { selectedBlur: e } = this.data
        e && !this.blurData.isEditable(e.id) && (this.data.selectedBlur = null)
        const { toolState: t } = this.data
        t !== BlurToolState.SUGGESTING && this.renderBlurs()
      }),
      (this.onSuggestionsChanged = () => {
        const e = this.toolData.getTool(ToolsList.BLUR)
        if (e) {
          const t = this.suggestionData.getByAccepted(null).length > 0
          e.hasUpdates !== t && ((e.hasUpdates = t), e.commit())
        }
        if (!this.data) return
        const { toolState: t } = this.data
        t === BlurToolState.SUGGESTING && this.renderSuggestions()
      }),
      (this.onPointerButton = e => {
        const { toolState: t } = this.data,
          { hit: s } = this.raycasterData
        e.down && t === BlurToolState.PAINTING && this.updateSelectedBlur(s ? s.object : null)
      }),
      (this.onKeyEvent = e => {
        const { selectedBlur: t } = this.data
        if (t && e.state === KeyboardStateList.PRESSED)
          switch (e.key) {
            case KeyboardCode.ESCAPE:
              this.engine.commandBinder.issueCommand(new BlurToolChangeCommand(BlurToolState.IDLE))
              break
            case KeyboardCode.DELETE:
              this.data.selectedBlur && this.engine.commandBinder.issueCommand(new DeleteBlursCommand(t.id))
          }
      }),
      (this.onClick = (e, t) => {
        const { toolState: s } = this.data
        return s === BlurToolState.PAINTING || (!!(t instanceof ee || this.data.selectedBlur) && (this.updateSelectedBlur(t), !0))
      }),
      (this.onPaint = (e, t, s, i) => {
        const n = this.sweepData.currentSweepObject
        if (!n) return
        let a = this.data.selectedBlur instanceof Blur ? this.data.selectedBlur : null
        const r = a ? a.dotCount : 0
        ;(!a || r > Ie.Vw) &&
          ((a = new Blur({ sweepId: n.id })),
          n.placementType !== PlacementType.UNPLACED && ((a.floorId = n.floorId), (a.roomId = n.roomId)),
          this.blurData.add(a),
          (this.data.selectedBlur = a))
        const o = e.clone().applyQuaternion(n.rotation.clone().invert()).normalize()
        a.add(o, t, s, i)
      }),
      (this.updateHoveredBlur = () => {
        const { toolState: e } = this.data,
          t = this.raycasterData.hit && this.raycasterData.hit.object,
          s = e === BlurToolState.PAINTING ? null : this.getBlurFromMesh(t)
        if (s !== this.data.hoveredBlur && ((this.data.hoveredBlur = s), this.data.toolState !== BlurToolState.PAINTING)) {
          const e = s ? CursorStyle.FINGER : null
          this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(e))
        }
      })
  }

  async init(e, t) {
    this.log.debug("Module config", e),
      (this.engine = t),
      (this.config = e),
      ([
        this.blurData,
        this.cameraData,
        this.cursorController,
        this.raycasterData,
        this.settings,
        this.storageData,
        this.sweepData,
        this.toolData,
        this.viewmodeData
      ] = await Promise.all([
        t.market.waitForData(BlurData),
        t.market.waitForData(CameraData),
        t.getModuleBySymbol(CursorControllerSymbol),
        t.market.waitForData(PointerData),
        t.getModuleBySymbol(SettingsSymbol),
        t.market.waitForData(ws.Q),
        t.market.waitForData(SweepsData),
        t.market.waitForData(ToolsData),
        t.market.waitForData(ViewmodeData)
      ]))
    const [s, n, h, m] = await Promise.all([
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(RttSymbol),
      t.market.waitForData(ViewmodeData),
      t.getModuleBySymbol(WebglRendererSymbol)
    ])
    ;(this.suggestionData = await t.market.waitForData(BlurSuggestionData)),
      this.bindings.push(this.toolData.onChanged(this.onSuggestionsChanged), this.suggestionData.onChanged(this.onSuggestionsChanged))
    const f = (await t.getModuleBySymbol(PanoSymbol)).getRenderer()
    ;(this.data = new BlurEditorData()),
      t.market.register(this, BlurEditorData, this.data),
      this.cursorController.addVisibilityRule(this.setMeshCursorVisibility)
    const w = m.getScene()
    ;(this.renderer = new fe(this.sweepData, this.data, w, s, n, m.cwfRenderer, f)), t.addComponent(this, this.renderer)
    const E = new X(this.sweepData, this.cameraData, w, s)
    E.setSizeRange(Ie.oR, Ie.rC),
      (E.onPaint = this.onPaint),
      t.addComponent(this, E),
      (this.data.brush = E),
      this.registerSettings(),
      this.registerTool(),
      (this.clickHandler = s.registerPriorityHandler(InputClickerEndEvent, Mesh, this.onClick)),
      this.bindings.push(
        t.commandBinder.addBinding(BlurToolChangeCommand, async e => this.changeToolState(e.state)),
        t.commandBinder.addBinding(SetBlurBrushScaleCommand, async e => (this.data.brush.scale = e.scale)),
        t.commandBinder.addBinding(NavigateToBlurCommand, async ({ blur: e, resetBlurTool: t }) => this.navigateToBlur(e, t)),
        t.commandBinder.addBinding(ShowBlursCommand, ({ ids: e }) => this.showBlurs(...e)),
        t.commandBinder.addBinding(HideBlursCommand, ({ ids: e }) => this.hideBlurs(...e)),
        t.commandBinder.addBinding(ToggleBlurVisibilityCommand, async ({ id: e }) => this.batchToggleVisibility([e])),
        t.commandBinder.addBinding(BatchToggleBlurVisibilityCommand, async ({ ids: e }) => this.batchToggleVisibility(e))
      ),
      (this.pollingSubscription = this.checkForUpdates()),
      this.updatePolling(),
      this.activeBindings.push(
        h.makeModeChangeSubscription(this.onViewmodeChange),
        this.sweepData.makeSweepChangeSubscription(this.onSweepChange),
        this.blurData.blurs.onChanged(this.onBlursChanged),
        s.registerHandler(OnMouseDownEvent, this.onPointerButton),
        s.registerHandler(KeyboardCallbackEvent, this.onKeyEvent),
        this.raycasterData.onChanged(this.updateHoveredBlur),
        this.clickHandler,
        this.storageData.onPropertyChanged("transactionState", () => this.updatePolling()),
        this.blurData.makeProcessingSubscription(() => this.updatePolling())
      ),
      this.changeToolState(BlurToolState.OFF),
      this.viewmodeData.currentMode && this.onViewmodeChange(this.viewmodeData.currentMode),
      this.activeBindings.forEach(e => e.cancel()),
      e.debug && this.log.info("DEBUG mode enabled")
  }
  dispose(e) {
    super.dispose(e),
      this.pollingSubscription && this.pollingSubscription.cancel(),
      this.activeBindings.forEach(e => e.cancel()),
      e.disposeRenderLayer(this.name),
      this.data && e.market.unregister(this, BlurEditorData),
      this.cursorController.removeVisibilityRule(this.setMeshCursorVisibility)
  }
  renderBlurs() {
    const e = this.blurData.getByStatus(BlurStatus.PENDING, BlurStatus.PROCESSING, BlurStatus.FAILED).filter(e => e.visible)
    this.renderer.setBlurs(e)
  }
  renderSuggestions() {
    const e = this.suggestionData.getByAccepted(!0, null).filter(e => e.visible)
    this.renderer.setBlurs(e)
  }
  getFocalPoint(e) {
    if (!e.length) return null
    let t = 0
    const s = e.reduce(
      (e, s) => {
        for (const i of s.directions) (e.x += i.x), (e.y += i.y), (e.z += i.z), t++
        return e
      },
      { x: 0, y: 0, z: 0 }
    )
    return new Vector3(s.x / t, s.y / t, s.z / t)
  }
  async showBlurs(...e) {
    this.blurData.setVisibility(!0, ...e)
  }
  async hideBlurs(...e) {
    this.blurData.setVisibility(!1, ...e)
  }
  batchToggleVisibility(e) {
    this.blurData.batchToggleVisibility(e)
  }
  updatePolling() {
    const { toolState: e } = this.data,
      { transactionState: t } = this.storageData,
      s = e !== BlurToolState.OFF,
      n = t === TransactionState.IDLE
    return s && n
      ? (this.pollingSubscription.renew(), this.log.debug("Polling enabled"), !0)
      : (this.log.debug("Polling disabled"), this.pollingSubscription.cancel(), !1)
  }
  onDeselectBlur(e) {
    const { toolState: t } = this.data
    e && t === BlurToolState.PAINTING && this.engine.commandBinder.issueCommand(new SaveBlursCommand())
  }
  getBlurFromMesh(e) {
    if (e && e instanceof ee) {
      const t = this.data.toolState === BlurToolState.SUGGESTING,
        s = t ? this.suggestionData.get(e.blurId) : this.blurData.get(e.blurId)
      if (t || (null == s ? void 0 : s.status) === BlurStatus.PENDING) return s
    }
    return null
  }
  updateSelectedBlur(e) {
    const t = this.getBlurFromMesh(e)
    t !== this.data.selectedBlur && (this.onDeselectBlur(this.data.selectedBlur), (this.data.selectedBlur = t), t && this.log.debug(`Selected blur ${t.id}`))
  }
  registerSettings() {
    const e = "Blur Tool",
      { brush: t } = this.data,
      { debug: s, meshBlurEnabled: i, pipelineEnabled: n } = this.config
    ;[
      { header: e, setting: "blur/brush_size", range: [Ie.oR, Ie.rC], initialValue: () => t.size, onChange: e => (t.size = e) },
      { header: e, setting: "blur/brush_scale", range: [0, 1], initialValue: () => t.scale, onChange: e => (t.scale = e) },
      {
        header: e,
        setting: "blur/tool_enabled",
        initialValue: () => this.settings.tryGetProperty(ToolsBlurEditorKey, !1),
        onChange: e => this.settings.updateSetting(ToolsBlurEditorKey, e)
      },
      {
        header: e,
        setting: "blur/mask",
        initialValue: () => !1,
        onChange: e => {
          this.renderer && this.renderer.setMaskVisibility(e)
        }
      },
      {
        header: e,
        setting: "blur/show_cursor",
        initialValue: () => !1,
        onChange: e => {
          this.log.debug("Brush mouse cursor " + (e ? "enabled" : "disabled")), t.toggleMouseCursor(e)
        }
      },
      {
        header: e,
        setting: Ie.Vk,
        initialValue: () => s,
        onChange: e => {
          this.settings.updateSetting(Ie.Vk, e)
        }
      },
      {
        header: e,
        setting: BlurChunksKey,
        initialValue: () => !1,
        onChange: e => {
          this.settings.updateSetting(BlurChunksKey, e)
        }
      },
      {
        header: e,
        setting: BlurPipelineKey,
        initialValue: () => n,
        onChange: e => {
          this.settings.updateSetting(BlurPipelineKey, e)
        }
      },
      {
        header: e,
        setting: BlurMeshKey,
        initialValue: () => i,
        onChange: e => {
          this.settings.updateSetting(BlurMeshKey, e)
        }
      }
    ].forEach(e => this.settings.registerMenuEntry(e))
  }
  async registerTool() {
    const e = await this.engine.market.waitForData(SettingsData),
      t = new Xe(this.engine, e),
      s = new ToolObject({
        id: ToolsList.BLUR,
        namePhraseKey: PhraseKey.TOOLS.BLUR,
        panel: !0,
        icon: "icon-blur-outline",
        analytic: "blur",
        palette: ToolPalette.MODEL_BASED,
        allViewsPhraseKey: PhraseKey.WORKSHOP.LAYERS.APPLY_TO_ALL_VIEWS_BLURS,
        order: 90,
        dimmed: !1,
        enabled: e.tryGetProperty(ToolsBlurEditorKey, !1),
        manager: t,
        ui: new Cs(t, e),
        featureFlag: ToolsBlurEditorKey,
        helpMessagePhraseKey: PhraseKey.TOOLS.BLUR_HELP_MESSAGE,
        helpHref: "https://support.matterport.com/hc/en-us/articles/1500003156162-How-to-use-Manual-Blur-Brush"
      })
    this.engine.commandBinder.issueCommand(new RegisterToolsCommand([s]))
  }
}
