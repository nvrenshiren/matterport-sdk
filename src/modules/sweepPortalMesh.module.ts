import {
  BackSide,
  BoxGeometry,
  CubeTexture,
  IUniform,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  RawShaderMaterial,
  Scene,
  Texture,
  UniformsUtils,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderTarget
} from "three"
import * as b from "../const/23331"
import { PanoSizeKey } from "../const/76609"
import { Apiv2Symbol, InputSymbol, MeshApiFixupSymbol, PortalSymbol, RaycasterSymbol, RttSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { RenderLayer } from "../core/layers"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { SweepsData } from "../data/sweeps.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import vertexShader from "../glsl/29837.glsl"
import fragmentShader from "../glsl/45405.glsl"
import { MeshToDataMapMessage, PortalHoverMessage } from "../message/sweep.message"
import { PlacementType, SweepObject } from "../object/sweep.object"
import { UsePool } from "../utils/70903"
import { Comparator } from "../utils/comparator"
import { diffSweep, enabledSweep, isAlignedSweep, isManualSweep, sameFloorSweep } from "../utils/sweep.utils"
import { sweepScoreByDistance } from "../utils/sweepScore.utils"
import { isShowcaseMesh } from "../webgl/16769"
import { PortalMesh, PortalMeshState } from "../webgl/portal.mesh"
import { ShowcaseTextureLoader } from "../webgl/texture.loader"
import InputIniModule from "./inputIni.module"
import RaycasterModule from "./raycaster.module"
import RenderToTextureModule from "./renderToTexture.module"
declare global {
  interface SymbolModule {
    [PortalSymbol]: SweepPortalMeshModule
  }
}
class PortalViewportMaterial extends RawShaderMaterial {
  constructor() {
    const e = UniformsUtils.clone(PortalViewportMaterial.uniforms)
    super({ vertexShader, fragmentShader, uniforms: e, name: "PortalViewportMaterial", side: BackSide })
  }
  updateTexture(e) {
    this.uniforms.tMap.value = e
  }
  static uniforms: Record<string, IUniform & { type: string }>
}
PortalViewportMaterial.uniforms = { tMap: { type: "t", value: null } }
class ViewportLoader {
  tempLookDirection: Vector3
  worldCamera: PerspectiveCamera
  camera: PerspectiveCamera
  renderSize: number
  sweepTextureLoader: ShowcaseTextureLoader
  textureRenderer: RenderToTextureModule
  renderTargets: Record<string, WebGLRenderTarget | WebGLCubeRenderTarget>
  renderCube: Mesh<BoxGeometry, PortalViewportMaterial>
  constructor(e, t, i, n) {
    this.tempLookDirection = new Vector3()
    this.worldCamera = n
    this.camera = new PerspectiveCamera()
    this.renderSize = i
    this.sweepTextureLoader = e
    this.textureRenderer = t
    this.renderTargets = {}
    this.renderCube = new Mesh(new BoxGeometry(4, 4, 4), new PortalViewportMaterial())
  }
  async getPortalTexture(e: SweepObject, t: Quaternion, i: Vector3) {
    const n = this.renderTargets[e.id] || this.textureRenderer.createRenderTarget2D(this.renderSize, this.renderSize)
    const s = await this.sweepTextureLoader.load(e, PanoSizeKey.BASE)
    this.renderCube.material.updateTexture(s)
    this.renderCube.quaternion.copy(t)
    this.camera.projectionMatrix.copy(this.worldCamera.projectionMatrix)
    this.worldCamera.getWorldPosition(this.tempLookDirection)
    this.camera.lookAt(this.tempLookDirection.sub(i).negate())
    this.textureRenderer.render(n, this.renderCube, this.camera)
    return n.texture
  }
  releasePortalTexture(e: string) {
    const t = this.renderTargets[e]
    t && this.textureRenderer.disposeRenderTarget2D(t)
  }
}

export interface SweepLinkItem {
  index: number
  toSweep: SweepObject
  fromSweep: SweepObject
  position: Vector3
  lookDirection: Vector3 | null
  billboard: boolean
  toExterior: boolean
  fromInterior: boolean
}

class PortalRenderer {
  container: Object3D
  bindings: ISubscription[]
  visibilityFilter: (e: SweepLinkItem) => PortalMeshState
  scene: Scene
  input: InputIniModule
  layer: RenderLayer
  cameraData: CameraData
  viewportLoader: ViewportLoader
  meshes: PortalMesh[]
  activeMeshes: Record<number, boolean>
  meshToDataMap: Record<number, SweepLinkItem>
  dataToMeshMap: Record<number, PortalMesh>
  activeTexturePromises: Record<number, Promise<CubeTexture | Texture>>
  meshPool: UsePool<PortalMesh>
  broadcast: EngineContext["broadcast"]
  constructor(e, t, i, n, s) {
    this.container = new Object3D()
    this.bindings = []
    this.visibilityFilter = e => PortalMeshState.HIDE
    this.scene = e
    this.input = t
    this.layer = n
    this.cameraData = s
    this.viewportLoader = i
    this.meshes = []
    this.activeMeshes = {}
    this.meshToDataMap = {}
    this.dataToMeshMap = {}
    this.activeTexturePromises = {}
    this.meshPool = new UsePool()
  }
  addPortal(e: SweepLinkItem) {
    let t: PortalMesh
    const i = this.meshPool.get()
    if (i) {
      t = i.object
      t.update(e)
    } else {
      t = this.meshPool.add(new PortalMesh(e, this.layer)).object
    }

    this.meshes.push(t)
    this.container.add(t)
    this.meshToDataMap[t.id] = e
    this.dataToMeshMap[e.index] = t
    this.activateMesh(t, this.visibilityFilter(e))
  }
  removePortal(e: SweepLinkItem) {
    const t = this.dataToMeshMap[e.index]
    if (t) {
      this.meshPool.free(t)
      const i = this.meshes.findIndex(e => e.id === t.id)
      this.meshes.splice(i, 1)
      this.container.remove(t)
      this.deactivateMesh(t)
      delete this.meshToDataMap[t.id]
      delete this.dataToMeshMap[e.index]
    }
  }
  init() {}
  activate(e: EngineContext) {
    this.broadcast = e.broadcast.bind(e)
    this.bindings.push(
      this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(PortalMesh), (e, t: PortalMesh) => {
        this.onPuckSelect(t)
      })
    )
    this.bindings.push(
      this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PortalMesh), (e, t: PortalMesh) => {
        this.onPuckDeselect(t)
      })
    )
    this.bindings.push(
      this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(PortalMesh), (e, t: PortalMesh) => {
        this.onPuckClick(t)
      })
    )
    this.scene.add(this.container)
  }
  dispose() {
    for (const e of Object.keys(this.meshToDataMap)) {
      const t = this.meshToDataMap[e],
        i = this.dataToMeshMap[t.index]
      this.removePortal(t), i.material.dispose(), i.geometry.dispose()
    }
  }
  deactivate(e) {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
    this.scene.remove(this.container)
  }
  render(e: number) {
    for (const t of this.meshes) t.render(e, this.cameraData)
  }
  filter(e: (e: SweepLinkItem) => PortalMeshState) {
    this.visibilityFilter = e
    for (const t of this.meshes) {
      const i = e(this.meshToDataMap[t.id])
      i === PortalMeshState.HIDE ? this.deactivateMesh(t) : this.activateMesh(t, i)
    }
  }
  mapSweepToMesh(e: string) {
    for (const t in this.meshToDataMap) {
      const i = this.meshToDataMap[t]
      if (i.toSweep.id === e && i.toExterior && i.fromInterior) return this.dataToMeshMap[i.index]
    }
    return null
  }
  activateMesh(e: PortalMesh, t = PortalMeshState.HIDE) {
    this.activeMeshes[e.id] || (this.input.registerMesh(e, !1), (this.activeMeshes[e.id] = !0))
    e.setState(t)
  }
  deactivateMesh(e: PortalMesh) {
    this.input.unregisterMesh(e)
    this.activeMeshes[e.id] = !1
    this.onPuckDeselect(e)
    e.setState(PortalMeshState.HIDE)
  }
  onPuckClick(e: PortalMesh) {
    this.broadcast(new MeshToDataMapMessage(this.meshToDataMap[e.id]))
  }
  onPuckSelect(e: PortalMesh) {
    this.broadcast(new PortalHoverMessage(!0))
    const t = this.meshToDataMap[e.id].toSweep
    const i = this.viewportLoader.getPortalTexture(t, t.rotation, e.position)
    this.activeTexturePromises[e.id] = i
    i.then(t => {
      this.activeTexturePromises.hasOwnProperty(e.id) && i === this.activeTexturePromises[e.id] && (e.updatePortalTexture(t), e.setHover(!0))
    })
  }
  onPuckDeselect(e: PortalMesh) {
    this.broadcast(new PortalHoverMessage(!1))
    e.setHover(!1)
    this.viewportLoader.releasePortalTexture(this.meshToDataMap[e.id].toSweep.id)
    delete this.activeTexturePromises[e.id]
  }
}
export default class SweepPortalMeshModule extends Module {
  portalCount: number
  portalData: Record<string, SweepLinkItem[]>
  raycaster: RaycasterModule
  portalRenderer: PortalRenderer
  constructor() {
    super(...arguments)
    this.name = "sweep-portal-mesh"
    this.portalCount = 0
  }
  async init(e, t: EngineContext) {
    const [i, n, a, o, r, d, c] = await Promise.all([
      t.getModuleBySymbol(Apiv2Symbol),
      t.getModuleBySymbol(RaycasterSymbol),
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(RttSymbol),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.market.waitForData(SweepsData),
      t.market.waitForData(CameraData)
    ])
    const l = t.claimRenderLayer(this.name)
    this.portalData = {}
    const h = r.getScene().camera
    const m = new ShowcaseTextureLoader(i.getApi())
    this.raycaster = n
    const p = new ViewportLoader(m, o, 256, h)
    const g = r.getScene().scene
    this.portalRenderer = new PortalRenderer(g, a, p, l, c)
    await Promise.all([t.getModuleBySymbol(MeshApiFixupSymbol)])
    const v = PlacementType.MANUAL
    const y = d.filter(e => isManualSweep(e))
    d.iterate(e => {
      this.portalData[e.id] || (this.portalData[e.id] = [])
      isManualSweep(e) && this.addPortals(e, this.portalRenderer, d, y)
      let t = e.placementType
      this.bindings.push(
        e.onPropertyChanged("placementType", i => {
          t !== v && i === v && this.addPortals(e, this.portalRenderer, d, y), t === v && i !== v && this.removePortals(e.id, this.portalRenderer), (t = i)
        })
      )
      this.bindings.push(
        e.onChanged(() => {
          isManualSweep(e) && (this.removePortals(e.id, this.portalRenderer), this.addPortals(e, this.portalRenderer, d, y))
        })
      )
    })
    t.addComponent(this, this.portalRenderer)
  }
  filter(e: (e: SweepLinkItem) => PortalMeshState) {
    this.portalRenderer.filter(e)
  }
  getPortalToExterior(e: string) {
    return this.portalRenderer.mapSweepToMesh(e)
  }
  removePortals(e: string, t: PortalRenderer) {
    for (const i of this.portalData[e]) t.removePortal(i)
    this.portalData[e] = []
  }
  addPortals(e: SweepObject, t: PortalRenderer, i: SweepsData, n: SweepObject[]) {
    const s = this.nearestAlignedSweep(e, i)
    if (s) {
      const i = this.entryLinks(e, s)
      const a = this.neighborLinks(e, n)
      this.portalData[e.id] = i.concat(a)
      for (const i of this.portalData[e.id]) t.addPortal(i)
    } else this.log.debug(`Couldn't find the nearest sweep for a 360 on floor ${e.floorId}; not adding portals`)
  }
  nearestAlignedSweep(e: SweepObject, t: SweepsData) {
    const i = [diffSweep(e), enabledSweep(), isAlignedSweep(), sameFloorSweep(e)],
      n = [sweepScoreByDistance(e.position)],
      s = t.sortByScore(i, n)[0]
    return s ? s.sweep : null
  }
  modelIntersection(e: SweepObject, t: SweepObject, i = 1 / 0) {
    const rayDirection = new Vector3().copy(e.position).sub(t.position).setY(0).normalize()
    const intersect = this.raycaster.picking.pick(t.position, rayDirection, isShowcaseMesh)
    return { intersect: intersect && intersect.distance <= i ? intersect : null, rayDirection }
  }
  entryLinks(e: SweepObject, t: SweepObject) {
    const i: SweepLinkItem[] = []
    const n = e.position.distanceTo(t.position)
    const s = this.modelIntersection(e, t, n + b.vX)
    let a: Vector3 | null,
      r: Vector3,
      d = !1
    if (s.intersect && s.intersect.face) {
      a = s.intersect.face.normal.clone().setY(0).normalize()
      Math.abs(s.rayDirection.dot(a)) < 0.3 && a.copy(s.rayDirection).multiplyScalar(-1)
      r = s.intersect.point.clone().addScaledVector(a, b.AF)
    } else {
      a = null
      d = !0
      r = e.position.clone()
    }
    r.y = t.position.y
    i.push({ index: this.portalCount++, toSweep: e, fromSweep: t, position: r, lookDirection: a, billboard: d, toExterior: !0, fromInterior: !0 })
    const c = new Vector3().lerpVectors(e.position, t.position, 2 / n).setY(e.position.y)
    i.push({
      index: this.portalCount++,
      toSweep: t,
      fromSweep: e,
      position: c,
      lookDirection: a ? a.clone().negate() : null,
      billboard: d,
      toExterior: !1,
      fromInterior: !1
    })
    return i
  }
  neighborLinks(e: SweepObject, t: SweepObject[]) {
    const i: SweepLinkItem[] = []
    for (const n of t) {
      if (e !== n && n.floorId === e.floorId && e.position.distanceTo(n.position) < b.M0) {
        const t = e.position.distanceTo(n.position)
        if (this.modelIntersection(e, n, t).intersect || this.modelIntersection(n, e, t).intersect) continue
        const s = e.position.clone().sub(n.position).setY(0).normalize()
        const a = n.position.clone()
        const o = b.iz
        t > o && a.addScaledVector(s, t - o)
        i.push({ index: this.portalCount++, toSweep: n, fromSweep: e, position: a, lookDirection: s, billboard: !1, toExterior: !0, fromInterior: !1 })
      }
    }

    return i
  }
}
