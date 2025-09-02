import { PickingPriorityType } from "../const/12529"
import * as w from "../const/28361"
import { isProjectionOrtho } from "../math/81729"
import { WebglRendererSymbol, WorkShopGridUnderlaySymbol } from "../const/symbol.const"
import { Data } from "../core/data"
import { RenderLayer, RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { ViewmodeData } from "../data/viewmode.data"
import n2 from "../glsl/60842.glsl"
import n1 from "../glsl/69513.glsl"
import { EndMoveToFloorMessage } from "../message/floor.message"
import { StartMoveToFloorMessage } from "../message//floor.message"
import { ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import { BackgroundColorDefault } from "../const/28361"
import {
  Box3,
  CanvasTexture,
  LinearFilter,
  LinearMipMapLinearFilter,
  Mesh,
  PlaneGeometry,
  RawShaderMaterial,
  RepeatWrapping,
  UniformsUtils,
  Vector3
} from "three"
import EngineContext from "../core/engineContext"
import { ShowCaseScene } from "../webgl/showcase.scene"
declare global {
  interface SymbolModule {
    [WorkShopGridUnderlaySymbol]: GridUnderlayModule
  }
}
const l = {
  grid: {
    uniforms: {
      gridTexture: {
        type: "t",
        value: null
      },
      gridSize: {
        type: "f",
        value: 100
      },
      cellSize: {
        type: "f",
        value: 1
      },
      radius: {
        type: "f",
        value: 100
      },
      center: {
        type: "v3",
        value: new Vector3(0, 0, 0)
      }
    },
    vertexShader: n1,
    fragmentShader: n2
  }
}
class GridMaterial extends RawShaderMaterial {
  constructor() {
    const e = UniformsUtils.clone(l.grid.uniforms)
    super({
      fragmentShader: l.grid.fragmentShader,
      vertexShader: l.grid.vertexShader,
      uniforms: e,
      name: "GridMaterial",
      transparent: !0,
      depthTest: !0,
      depthWrite: !1
    })
  }
}
const u = 1024
class GridMesh extends Mesh<PlaneGeometry, GridMaterial> {
  gridParams: { outerLineColor: string; innerLineColor: string; innerLineAlpha: number; lineScale: number }
  texture: CanvasTexture
  constructor(e, t, n, i, s) {
    const a = new PlaneGeometry(e, e, 1, 1)
    a.lookAt(DirectionVector.UP)
    const l = new GridMaterial()
    super(a, l)
    this.gridParams = {
      outerLineColor: "#585858",
      innerLineColor: "#373737",
      innerLineAlpha: 1,
      lineScale: 1
    }
    l.uniforms.gridSize.value = e
    l.uniforms.cellSize.value = t
    l.uniforms.radius.value = n
    l.uniforms.center.value.copy(i)
    l.uniforms.gridTexture.value = this.createGridTexture()
    l.premultipliedAlpha = !0
    l.alphaTest = 0.99
    this.layers.mask = s.mask
    this.renderOrder = PickingPriorityType.grid
    this.drawGridTexture()
  }
  setGridParams(e) {
    Object.assign(this.gridParams, e)
    this.drawGridTexture()
  }
  dispose() {
    this.material.dispose()
    this.texture.dispose()
    this.geometry.dispose()
  }
  createGridTexture() {
    const e = document.createElement("canvas")
    e.width = u
    e.height = u
    const t = new CanvasTexture(e)
    return (
      (t.wrapS = RepeatWrapping),
      (t.wrapT = RepeatWrapping),
      (t.flipY = !1),
      (t.generateMipmaps = !0),
      (t.anisotropy = 2),
      (t.magFilter = LinearFilter),
      (t.minFilter = LinearMipMapLinearFilter),
      (this.texture = t)
    )
  }
  drawGridTexture() {
    const e = this.texture.image.getContext("2d") as CanvasRenderingContext2D
    if (e) {
      const { outerLineColor: t, innerLineColor: n, innerLineAlpha: i, lineScale: s } = this.gridParams
      e.fillStyle = t + "00"
      e.fillRect(0, 0, u, u)
      const r = (t, n) => {
        e.beginPath()
        e.moveTo(0, t)
        e.lineTo(n, t)
        e.moveTo(t, 0)
        e.lineTo(t, n)
        e.stroke()
      }

      const a = 5 * s
      const o = 3 * s

      e.strokeStyle = n + this.convertToHexAlpha(i)
      e.lineWidth = o
      e.strokeStyle = t
      r(a, u)
      this.texture.needsUpdate = !0
    }
  }
  convertToHexAlpha(e, t = 1) {
    let n = Math.floor(255 * Math.max(e, t)).toString(16)
    return n.length <= 1 && (n = "0" + n), n
  }
}
class GridData extends Data {
  center: Vector3
  radius: number
  boundingBox: Box3
  constructor() {
    super(...arguments)
    this.name = "grid"
    this.center = new Vector3()
    this.radius = 0
    this.boundingBox = new Box3()
  }
}
const b = -0.2
class GridRender {
  webglscene: ShowCaseScene
  cameraData: CameraData
  floorsViewData: FloorsViewData
  viewmodeData: ViewmodeData
  layer: RenderLayer
  floorsTransitionActive: boolean
  bounds: GridData
  mesh: GridMesh
  oldZoom: number
  constructor(e, t, n, i, s, r, o, l = RenderLayers.ALL) {
    this.webglscene = e
    this.cameraData = s
    this.floorsViewData = r
    this.viewmodeData = o
    this.layer = l
    this.floorsTransitionActive = !1
    this.bounds = new GridData()
    this.mesh = this.createGridMesh(t, n, i)
    this.updateYForFloor(this.floorsViewData.currentFloorId)
  }
  init() {
    this.endMove = this.endMove.bind(this)
    this.startMove = this.startMove.bind(this)
  }
  startMove(e) {
    this.floorsTransitionActive = !0
  }
  endMove(e) {
    this.updateYForFloor(e.floorId)
    this.floorsTransitionActive = !1
  }
  dispose() {
    this.mesh.dispose()
  }
  activate(e) {
    e.subscribe(StartMoveToFloorMessage, this.startMove)
    e.subscribe(EndMoveToFloorMessage, this.endMove)
    this.webglscene.scene.add(this.mesh)
  }
  deactivate(e) {
    e.unsubscribe(StartMoveToFloorMessage, this.startMove)
    e.unsubscribe(EndMoveToFloorMessage, this.endMove)
    this.webglscene.scene.remove(this.mesh)
  }
  render() {
    if (!this.floorsViewData || !this.viewmodeData || !this.cameraData) return
    if (this.floorsTransitionActive) {
      const e = this.floorsViewData.getFloorMin(this.floorsViewData.transition.to) + b
      const t = this.floorsViewData.getFloorMin(this.floorsViewData.transition.from) + b

      const n = Math.min(this.floorsViewData.transition.progress.value, 1)
      this.mesh.position.y = n * e + (1 - n) * t
    }
    this.viewmodeData.isInside() || this.viewmodeData.currentMode === ViewModes.Outdoor ? (this.mesh.visible = !1) : (this.mesh.visible = !0)

    const e = this.cameraData.isOrtho()
    const t = this.cameraData.baseZoom()

    if ((e && (void 0 === this.oldZoom || this.oldZoom !== t)) || this.cameraData.transition.active) {
      let n = 0.05 + 1 / (40 * t)
      n = n > 3 ? 3 : n
      let i = e ? n : 1
      if (this.cameraData.transition.active) {
        const e = this.cameraData.transition.to.projection,
          t = this.cameraData.transition.from.projection
        if (e && t) {
          const n = isProjectionOrtho(e)
          const s = isProjectionOrtho(t)
          if ((!n && n) || (s && !n)) {
            const e = this.cameraData.transition.progress.value
            i = e * (n ? i : 1) + (1 - e) * (n ? 1 : i)
          }
        }
      }
      const s = 0.01
      const r = t <= s ? Math.max(1 - (s - t) / 0.004, 0) : 1
      this.mesh.setGridParams({
        innerLineAlpha: r,
        lineScale: i
      })
      this.oldZoom = t
    }
  }
  getBounds() {
    return this.bounds
  }
  updateGridColors(e, t) {
    this.mesh.setGridParams({
      outerLineColor: e,
      innerLineColor: t
    })
    this.oldZoom = -1
  }
  createGridMesh(e: Vector3, t: number, n: number) {
    const i = 10 * t

    this.bounds.center.copy(e)
    this.bounds.radius = n
    this.bounds.boundingBox.setFromCenterAndSize(this.bounds.center, new Vector3(i, i, 1))
    return new GridMesh(i, 4, n, e, this.layer)
  }
  updateYForFloor(e) {
    this.mesh.position.y = this.floorsViewData.getFloorMin(e) + b
    // this.mesh.position.y = -0.2
  }
}
export default class GridUnderlayModule extends Module {
  renderer: GridRender
  constructor() {
    super(...arguments)
    this.name = "grid-underlay"
  }
  async init(e, t: EngineContext) {
    const [n, i, r, a, o, l] = await Promise.all([
      t.getModuleBySymbol(WebglRendererSymbol),
      t.market.waitForData(MeshData),
      t.market.waitForData(CameraData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(SettingsData)
    ])
    const c = n.getScene()
    const d = i.meshCenter
    const u = i.meshRadius
    const h = i.maxPlacementRadius
    this.renderer = new GridRender(c, d, u, h, r, a, o, t.claimRenderLayer(this.name))
    t.addComponent(this, this.renderer)
    t.market.register(this, GridData, this.renderer.getBounds())
    const p = l.tryGetProperty(BtnText.BackgroundColor, BackgroundColorDefault.default)
    this.renderer.updateGridColors(w.K[p].gridPrimary, w.K[p].gridSecondary)
    this.bindings.push(
      l.onPropertyChanged(BtnText.BackgroundColor, e => {
        this.renderer.updateGridColors(w.K[e].gridPrimary, w.K[e].gridSecondary)
      })
    )
  }
  dispose(e) {
    e.market.unregister(this, GridData)
  }
}
