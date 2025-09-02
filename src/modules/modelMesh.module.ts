import {
  BackSide,
  Box3,
  BoxGeometry,
  BufferGeometry,
  ColorRepresentation,
  CubeTexture,
  DataTexture,
  DoubleSide,
  FrontSide,
  IUniform,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  RGBAFormat,
  RawShaderMaterial,
  Scene,
  Side,
  Texture,
  UniformsUtils,
  Vector3,
  Vector4,
  WebGLCubeRenderTarget
} from "three"
import { MeshPreviewPositionCommand, SetMeshOverLayColorCommand, ToggleMeshOverlayColorCommand } from "../command/mesh.command"
import { SetPanoOverlayCommand } from "../command/pano.command"
import { ScheduleTaskCommand } from "../command/schedule.command"
import { SetChunkRenderModeCommand } from "../command/webgl.command"
import { PickingPriorityType } from "../const/12529"
import { MeshChunkLOD } from "../const/21270"
import { RenderingMode } from "../const/22533"
import { RenderMode } from "../const/24048"
import { ModelChunkType } from "../const/34742"
import * as Q from "../const/53203"
import { FeaturesTiledMeshKey, FlipYConfig, WireframeEnabledKey } from "../const/53203"
import { TextureLOD } from "../const/80626"
import { MaxTrimsPerFloor, ModelShaderConfig } from "../const/97178"
import { MeshTextureQuality } from "../const/99935"
import { EngineTickState } from "../const/engineTick.const"
import {
  Apiv2Symbol,
  InputSymbol,
  ModelMeshSymbol,
  PanoSymbol,
  PucksSymbol,
  RaycasterSymbol,
  RttSymbol,
  SettingsSymbol,
  StreamingMeshSymbol,
  StreamingTextureSymbol,
  WebglRendererSymbol
} from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { RenderLayer } from "../core/layers"
import MarketContext from "../core/marketContext"
import { Module } from "../core/module"
import { HttpPriority } from "../core/request"
import { ISubscription, createSubscription } from "../core/subscription"
import { AppData, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { MeshData } from "../data/mesh.data"
import { MeshTrimData } from "../data/meshTrim.data"
import { RoomMeshData } from "../data/room.mesh.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import Oe from "../images/uv_grid_opengl.jpg"
import { lerp } from "../math/2569"
import { calculateWorldUnitsFromScreenWidth } from "../math/81729"
import { WebglRendererContextLostMessage, WebglRendererContextRestoredMessage } from "../message//webgl.message"
import { RenderTargetMessage } from "../message/webgl.message"
import { MeshTrimObject } from "../object/meshTrim.object"
import { ObservableMap } from "../observable/observable.map"
import { ObservableValue } from "../observable/observable.value"
import { SymbolLoadedMessage } from "../other/2032"
import { CheckThreshold } from "../utils/49827"
import { randomColorMap } from "../utils/69984"
import { isGooglebot } from "../utils/browser.utils"
import { easeInCubic, easeOutCubic } from "../utils/ease.utils"
import { ExpiringResource } from "../utils/expiringResource"
import { setSame } from "../utils/func.utils"
import { LoadTexture } from "../utils/loadTexture"
import { mergParamsToURL } from "../utils/url.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import * as xe from "../webgl/64210"
import { calculateGeometryCenter, computeBarycentricCoordinates, createRandomCubeTexture } from "../webgl/75730"
import { AnimationProgress } from "../webgl/animation.progress"
import { BaseShaderMaterial } from "../webgl/baseShaderMaterial"
import { ShowcaseMeshRaycast, buildMeshBVH, clearMeshBVH } from "../webgl/mesh.raycast"
import { ModelMesh, createModelMesh } from "../webgl/model.mesh"
import { Pose } from "../webgl/pose"
import { RoomMesh } from "../webgl/roomMesh"
import { ShowCaseScene } from "../webgl/showcase.scene"
import { TiledMesh } from "../webgl/tiled.mesh"
import { UndoBuffer } from "../webgl/undo.buffer"
import { DirectionVector } from "../webgl/vector.const"
import InputIniModule from "./inputIni.module"
import { ModelObject } from "./modelData.module"
import RaycasterModule, { ShowcaseRaycaster } from "./raycaster.module"
import RenderToTextureModule from "./renderToTexture.module"
import { PanoRenderer } from "./sweepPanoTiling.module"
import { UserApiClient } from "./userInfo.module"
import WebglRendererModule, { CWFRenderer } from "./webglrender.module"
declare global {
  interface SymbolModule {
    [ModelMeshSymbol]: ModelMeshModule
  }
}
export interface UniformsItem {
  opacity?: number
  pano0Map?: CubeTexture
  pano0Matrix1?: Matrix4
  pano0Matrix2?: Matrix4
  pano0Position?: Vector3
  progress?: number
  panoOpacity?: number
  meshOpacity?: number
  colorOverlay?: Vector4
  map?: DataTexture
  time?: number
  meshTrimMatrices?: Matrix4[]
  meshTrimsDiscardContents?: boolean[]
  hasKeepVolume?: boolean
  meshPreviewCenter?: Vector3 | null
  meshPreviewSize?: number
  floorTrimHeight?: number
  floorHeightMin?: number
  floorHeightMax?: number
}
export interface CreateModelMeshParams {
  uuid: string
  model: ModelObject
  renderLayer: RenderLayer
  engine: EngineContext
  settings: typeof FlipYConfig
  roomMeshData: RoomMeshData
  chunkSharedState: ChunkSharedState
  chunkVisibilityChecker: ChunkVisibilityChecker
  gltfConfig: any
  chunkFactory: (meshGroup: number, meshSubgroup: number, geometry: BufferGeometry, textureName?: string) => MeshChunk
}
let THREEFix = !1
class MeshTrimUniforms {
  floorUniforms: Record<string, UniformsItem>
  sharedFloorUniforms: Record<string, UniformsItem>
  isPanoMode: boolean
  constructor(e) {
    this.floorUniforms = {}
    this.sharedFloorUniforms = {}
    this.isPanoMode = e
  }
  getSharedFloorUniforms(e: number) {
    void 0 === this.sharedFloorUniforms[`${e}`] &&
      ((this.sharedFloorUniforms[`${e}`] = this.getEmptyCacheUniforms()),
      this.floorUniforms[`${e}`] ? this.updateSharedFloorUniforms(e) : this.updateMeshTrimArrays(e, []))
    return this.sharedFloorUniforms[`${e}`]
  }
  updateMeshTrimArrays(e: number, t: MeshTrimObject[]) {
    const meshTrimMatrices: Matrix4[] = []
    const meshTrimsDiscardContents: boolean[] = []
    let hasKeepVolume = !1
    t.forEach(e => {
      meshTrimMatrices.push(this.computeTrimMatrixFromTrim(e, new Matrix4()))
      meshTrimsDiscardContents.push(e.discardContents)
      hasKeepVolume || (hasKeepVolume = e.enabled && !e.discardContents)
    })
    this.setFloorUniforms(e, { meshTrimMatrices, meshTrimsDiscardContents, hasKeepVolume })
    "-1" == `${e}`
      ? Object.keys(this.sharedFloorUniforms).forEach(e => {
          this.updateSharedFloorUniforms(+e)
        })
      : this.updateSharedFloorUniforms(e)
  }
  computeTrimMatrixFromTrim(e: MeshTrimObject, t = new Matrix4()) {
    return (
      e.enabled && (!this.isPanoMode || (this.isPanoMode && e.activeInPanoMode))
        ? (t.compose(e.position, e.rotation, e.scale), t.invert())
        : t.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      t
    )
  }
  updateSharedFloorUniforms(e: number) {
    const t = this.getSharedFloorUniforms(e)
    const i = "-1" != `${e}` ? this.getFloorUniforms(e) : this.getEmptyCacheUniforms()
    const o = this.getFloorUniforms(-1)
    const r = new Matrix4()
    r.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    this.concatUniformArrays(t.meshTrimMatrices!, o.meshTrimMatrices!, i.meshTrimMatrices!, r)
    this.concatUniformArrays(t.meshTrimsDiscardContents!, o.meshTrimsDiscardContents!, i.meshTrimsDiscardContents!, !0)
    t.hasKeepVolume = o.hasKeepVolume || i.hasKeepVolume
    this.sharedFloorUniforms[`${e}`] = t
  }
  concatUniformArrays(e: Matrix4[] | boolean[], t: Matrix4[] | boolean[], i: Matrix4[] | boolean[], s: Matrix4 | boolean) {
    const o = t.concat(i).slice(0, MaxTrimsPerFloor)
    for (let e = o.length; e < MaxTrimsPerFloor; e++) {
      o.push(s)
    }
    e.length = 0
    //@ts-ignore
    e.push(...o)
    return e
  }
  getFloorUniforms(e: number) {
    return this.floorUniforms[`${e}`] || this.getEmptyCacheUniforms()
  }
  setFloorUniforms(e: number, t: UniformsItem) {
    this.floorUniforms[`${e}`] = t
  }
  getEmptyCacheUniforms() {
    return { meshTrimMatrices: [], meshTrimsDiscardContents: [], hasKeepVolume: !1 }
  }
}
export class StandardMaterial extends BaseShaderMaterial {
  getSide: () => Side
  capabilities: any
  constructor(e: string, t, i, s: () => Side) {
    const o = {}
    for (const e of t) o[e] = !0
    super({
      extensions: { derivatives: !0 },
      fragmentShader: ModelShaderConfig.modelChunk.fragmentShader,
      vertexShader: ModelShaderConfig.modelChunk.vertexShader,
      uniforms: i,
      name: e,
      defines: o
    })
    this.getSide = s
    this.capabilities = t
  }
  //@ts-ignore
  get side() {
    return this.getSide()
  }
  //@ts-ignore
  set side(e) {}
}
function W(e, t) {
  if (null == t) return t
  if (t.isVector3 || t.isVector4 || t.isMatrix3 || t.isMatrix4 || t.isColor) return null != e ? (e.copy(t), e) : t.clone()
  if (Array.isArray(t) && (Array.isArray(e) || null == e)) {
    null == e && (e = [])
    const i = 0 === e.length
    let s = e.length === t.length
    for (let o = 0; o < t.length; o++) {
      s = s || void 0 === e[o] || e[o] !== t[o]
      const r = W(i ? void 0 : e[o], t[o])
      i ? e.push(r) : s && (e[o] = r)
    }
    return e
  }
  return t
}
let K: CubeTexture
let tempID = 1
try {
  K = createRandomCubeTexture(0, 0)
} catch (e) {}
const q = 5 + MaxTrimsPerFloor
const Y: Array<{ key: ModelChunkType; enabled: Function; dependsOn: ModelChunkType[]; uniformsUsed: string[] }> = [
  {
    key: ModelChunkType.PanoTextureTransition,
    enabled: e => {
      return e.progress.value > 0 && e.progress.value < 1 && e.pano0Map.value !== e.pano1Map.value
    },
    dependsOn: [ModelChunkType.PanoTexture],
    uniformsUsed: ["progress", "pano0Map", "pano1Map"]
  },
  {
    key: ModelChunkType.PanoTexture,
    enabled: e => {
      return e.panoOpacity.value > 0
    },
    dependsOn: [],
    uniformsUsed: ["panoOpacity"]
  },
  {
    key: ModelChunkType.ColorOverlay,
    enabled: e => {
      return null !== e.colorOverlay.value
    },
    dependsOn: [],
    uniformsUsed: ["colorOverlay"]
  },
  {
    key: ModelChunkType.MeshPreviewSphere,
    enabled: e => {
      return null !== e.meshPreviewCenter.value
    },
    dependsOn: [ModelChunkType.MeshTexture],
    uniformsUsed: []
  },
  {
    key: ModelChunkType.MeshTexture,
    enabled: e => {
      return e.meshOpacity.value > 0 && e.map.value
    },
    dependsOn: [],
    uniformsUsed: ["meshOpacity", "map"]
  },
  {
    key: ModelChunkType.Wireframe,
    enabled: e => {
      return !1
    },
    dependsOn: [],
    uniformsUsed: []
  },
  {
    key: ModelChunkType.FlatShading,
    enabled: e => {
      return !1
    },
    dependsOn: [],
    uniformsUsed: []
  },
  {
    key: ModelChunkType.PanoOverlay,
    enabled: e => {
      return !!e.overlay0Map.value
    },
    dependsOn: [ModelChunkType.PanoTexture],
    uniformsUsed: ["overlay0Map"]
  },
  {
    key: ModelChunkType.PanoOverlayTransition,
    enabled: e => {
      return !!(e.progress.value > 0 && e.progress.value < 1 && e.overlay0Map.value && e.overlay1Map.value && e.overlay0Map.value !== e.overlay1Map.value)
    },
    dependsOn: [ModelChunkType.PanoOverlay, ModelChunkType.PanoTexture, ModelChunkType.PanoTextureTransition],
    uniformsUsed: ["progress", "overlay0Map", "overlay1Map"]
  },
  {
    key: ModelChunkType.MeshTrimVertex,
    enabled: (e, { maxVaryings }) => {
      return maxVaryings > q && e.meshTrimMatrices.value.some(e => !!e.elements[15])
    },
    dependsOn: [ModelChunkType.MeshTexture],
    uniformsUsed: []
  },
  {
    key: ModelChunkType.MeshTrimPixel,
    enabled: (e, { maxVaryings }) => {
      return maxVaryings <= q && e.meshTrimMatrices.value.some(e => !!e.elements[15])
    },
    dependsOn: [ModelChunkType.MeshTexture],
    uniformsUsed: []
  },
  {
    key: ModelChunkType.FloorTrimVertex,
    enabled: e => {
      return !!(e.floorTrimHeight.value < 1 && 1 === e.opacity.value)
    },
    dependsOn: [ModelChunkType.MeshTexture],
    uniformsUsed: ["floorTrimHeight"]
  },
  {
    key: ModelChunkType.FloorTrimPixel,
    enabled: e => {
      return !!(e.floorTrimHeight.value < 1 && 1 === e.opacity.value)
    },
    dependsOn: [ModelChunkType.MeshTexture],
    uniformsUsed: ["floorTrimHeight"]
  }
]
const J = new Set(Y.map(e => e.uniformsUsed).reduce((e, t) => e.concat(t), []))
const X = new Set([
  "progress",
  "panoOpacity",
  "meshOpacity",
  "pano0Map",
  "pano0Position",
  "pano0Matrix1",
  "pano0Matrix2",
  "pano1Map",
  "pano1Position",
  "pano1Matrix1",
  "pano1Matrix2",
  "overlay0Map",
  "overlay0Matrix",
  "overlay1Map",
  "overlay1Matrix"
])
export class MeshChunk {
  textureLODInfo?: any
  embeddedTexture?: DataTexture
  meshGroup: number
  meshSubgroup: number
  geometry: BufferGeometry
  sharedState: ChunkSharedState
  textureName: string
  sourceKey: string
  id: number
  name: string
  lod: MeshChunkLOD
  capabilityOverrides: Record<string, boolean>
  onMaterialUpdate: Set<Function>
  uniformCache: any
  opacity: number
  temp: { m1: Matrix4; m2: Matrix4; quat: Quaternion; m3: Matrix4 | null }
  textureCacheKey: string
  standardMaterial: StandardMaterial
  _material: StandardMaterial | RawShaderMaterial | MeshBasicMaterial
  _colorOverlay: Vector4
  _meshTextureOpacity: number
  _progress: number
  chunkIndex: number
  onOpacityUpdate: (e: number) => void
  constructor(e, t, i, o, r = "", n = "", a = !1) {
    this.meshGroup = e
    this.meshSubgroup = t
    this.geometry = i
    this.sharedState = o
    this.textureName = r
    this.sourceKey = n
    this.id = tempID++
    this.name = ""
    this.lod = MeshChunkLOD.Standard
    this.capabilityOverrides = {}
    this.onMaterialUpdate = new Set()
    this.uniformCache = MeshChunk.getUniformDefaults()
    this.opacity = 1
    this.temp = { m1: new Matrix4(), m2: new Matrix4(), quat: new Quaternion(), m3: null }
    this.textureCacheKey = `${n}${r}`
    this.standardMaterial = this.getChunkMaterial(this.getCapabilities(), !1)
    this.updateRenderingMode()
    a && this.setMaterialsUniform(o.globalUniforms)
  }
  dispose() {
    this.geometry.dispose()
  }
  static getUniformDefaults() {
    const e: Record<string, IUniform & { type: string }> = {}
    for (const t in ModelShaderConfig.modelChunk.uniforms) {
      const i = UniformsUtils.clone(ModelShaderConfig.modelChunk.uniforms[t])
      for (const t in i) e[t] = i[t]
    }
    return e
  }
  set material(e) {
    if (this._material !== e && this.onMaterialUpdate) for (const t of this.onMaterialUpdate.values()) t(e)
    this._material = e
  }
  get material() {
    return this._material
  }
  notifyOnMaterialUpdated(e: Function) {
    return createSubscription(
      () => this.onMaterialUpdate.add(e),
      () => this.onMaterialUpdate.delete(e),
      !0
    )
  }
  setMeshTexture(e: DataTexture) {
    this.setMaterialsUniform({ map: e })
  }
  getColorOverlay() {
    return this._colorOverlay
  }
  setColorOverlay(e: Vector4) {
    this._colorOverlay !== e && (this.setMaterialsUniform({ colorOverlay: e }), (this._colorOverlay = e))
  }
  setMeshTextureOpacity(e: number) {
    e !== this._meshTextureOpacity && (this.setMaterialsUniform({ meshOpacity: e, panoOpacity: 1 - e }), (this._meshTextureOpacity = e))
  }
  setProgress(e: number) {
    this._progress !== e && (this.setMaterialsUniform({ progress: e }), (this._progress = e))
  }
  needsTransparent() {
    return this.opacity < Q.xx.FADE_OPAQUE
  }
  setOpacity(e: number) {
    this.opacity = e
    const t = this.needsTransparent()
    this.onOpacityUpdate && this.onOpacityUpdate(e)
    return t !== this._material.transparent
  }
  getOpacity() {
    return this.opacity
  }
  setTime(e: number) {
    this.sharedState.renderingMode === RenderingMode.Wireframe && this.setMaterialsUniform({ time: e })
  }
  setMeshPreviewSphere(e: Vector3 | null, t = 0.3) {
    this.setMaterialsUniform({ meshPreviewCenter: e, meshPreviewSize: t })
  }
  setWireframe(e: boolean) {
    if (e) {
      if (this.geometry.getIndex()) {
        const e = this.geometry
        //@ts-ignore
        e.boundsTree && (e.boundsTree.geometry = this.geometry.clone())
        this.geometry.copy(this.geometry.toNonIndexed())
      }
      computeBarycentricCoordinates(this.geometry)
    }
    this.overrideCapability(ModelChunkType.Wireframe, e)
  }
  setFlatShading(e: boolean) {
    e && this.geometry.computeVertexNormals()
    this.overrideCapability(ModelChunkType.FlatShading, e)
  }
  getCapabilities() {
    const e = new Set<ModelChunkType>()
    for (const t in this.capabilityOverrides) this.capabilityOverrides[t] && e.add(t as ModelChunkType)
    for (const t of Y) {
      if (!e.has(t.key) && t.enabled(this.uniformCache, this.sharedState)) {
        e.add(t.key)
        for (const i of t.dependsOn) e.add(i)
      }
    }

    return e
  }
  overrideCapability(e: ModelChunkType, t: boolean) {
    this.capabilityOverrides[e] = t
    this.updateMaterialCapabilities()
  }
  updateMaterialCapabilities() {
    const e = this.getCapabilities()
    const t = this.standardMaterial
    const i = this.needsTransparent()
    if (setSame(t.capabilities, e) && i === t.transparent) return this._material
    const s = this.getChunkMaterial(e, i)
    this.standardMaterial = s
    this.sharedState.renderingMode === RenderingMode.Standard && (this.material = s)

    return this._material
  }
  getChunkMaterial(e: Set<ModelChunkType>, t: boolean) {
    let i = `chunkMaterial_${this.sourceKey}`
    for (const t of Y) i += e.has(t.key) ? "1" : "0"
    const o = -1 === this.meshGroup && -1 === this.meshSubgroup
    i += o ? "f" : t ? "1" : "0"
    const { chunkMaterials: r } = this.sharedState
    if (!r[i]) {
      const n = new StandardMaterial(i, e, this.getUniformsForCapabilities(e), () => (o ? BackSide : this.sharedState.side))
      o ? ((n.transparent = !0), (n.depthWrite = !1)) : ((n.transparent = t), (n.depthWrite = !t))
      r[i] = n
    }
    return r[i]
  }
  getUniformsForCapabilities(e: Set<ModelChunkType>) {
    const t = {}
    for (const i of e) {
      const e = ModelShaderConfig.modelChunk.uniforms[i]
      for (const i in e) t[i] = UniformsUtils.clone(this.uniformCache[i])
    }
    return t
  }
  setMaterialsUniform(e: UniformsItem, t = !1) {
    let i
    let s = !1
    for (const o in e) {
      let r = !1
      const n = e[o]
      if (!(o in this.uniformCache)) throw new Error(`Uniform ${o} does not exist in Chunk`)
      const a = this.uniformCache[o]
      const h = a.value
      r = "meshPreviewCenter" === o ? r || (null === h) != (null === n) : "meshTrimMatrices" === o || r || (J.has(o) && h !== n)
      a.value = W(a.value, n)

      "opacity" === o && (i = n)
      t && X.has(o) && (this.sharedState.globalUniforms[o] = W(this.sharedState.globalUniforms[o], n))
      s = s || r
    }

    void 0 !== i && (s = this.setOpacity(i) || s)

    s && this.updateMaterialCapabilities()
    return this._material
  }
  updateRenderingMode() {
    const { renderingMode, modeMaterials } = this.sharedState
    renderingMode === RenderingMode.Standard ? (this.material = this.standardMaterial) : (this.material = modeMaterials.get(renderingMode))
  }
  setProjectedPano(e: number, t?: Vector3, i?: Quaternion, s?: CubeTexture, o = !1) {
    let r = 1 === e ? "pano1Map" : "pano0Map"
    const n: UniformsItem = {}
    n[r] = s || K
    t && ((r = 1 === e ? "pano1Position" : "pano0Position"), (n[r] = t))
    if (i && t) {
      r = 1 === e ? "pano1Matrix" : "pano0Matrix"
      this.temp.m1.makeRotationFromQuaternion(this.temp.quat.copy(i).invert())
      this.temp.m2.makeScale(-1, 1, 1)
      n[`${r}1`] = this.temp.m1
      n[`${r}2`] = this.temp.m2
    }
    this.setMaterialsUniform(n, o)
  }
  setOverlayPano(e: number, t?: Quaternion, i?: CubeTexture, o = !1) {
    const r = `overlay${e}`
    const n = {}
    if (t) {
      this.temp.m3 || (this.temp.m3 = new Matrix4())
      const e = this.temp.m3.makeRotationFromQuaternion(t)
      n[r + "Matrix"] = e
    }
    n[r + "Map"] = i || K
    this.setMaterialsUniform(n, o)
  }
  onBeforeDraw(e: RawShaderMaterial) {
    if (this.sharedState.renderingMode === RenderingMode.Standard) {
      for (const t of Object.keys(e.uniforms)) this.uniformCache[t] && null !== this.uniformCache[t].value && (e.uniforms[t].value = this.uniformCache[t].value)
      e.uniformsNeedUpdate = !0
    }
  }
  getSortKey() {
    return this.uniformCache.map?.value?.id || 0
  }
}
const te = new Vector3(0, 0, 0)
const ie = new Vector3(100, 100, 100)
const se = new Vector3()
const oe = new Vector3()
const re = new Box3()
class FallbackMesh extends Mesh<BoxGeometry, StandardMaterial | RawShaderMaterial | MeshBasicMaterial> {
  bounds: Box3
  chunk: MeshChunk
  constructor(e) {
    super()
    this.bounds = new Box3()
    this.geometry = new BoxGeometry(1, 1, 1)
    this.geometry.computeBoundingBox()
    this.geometry.computeBoundingSphere()
    this.chunk = new MeshChunk(-1, -1, this.geometry, e)
    const t = (e: StandardMaterial | RawShaderMaterial | MeshBasicMaterial) => {
      this.material = e
    }
    this.chunk.notifyOnMaterialUpdated(t)
    t(this.chunk.material)
    this.name = "FallbackMesh"
    this.renderOrder = PickingPriorityType.boundingSkybox
    this.setFromCenterAndSize(te, ie)
    this.onBeforeRender = (e, t, i, o, r, n) => {
      r instanceof RawShaderMaterial && this.chunk.onBeforeDraw(r)
    }
  }
  setBounds(e: Box3) {
    if (this.bounds.equals(e)) return
    this.bounds.copy(e)
    const t = e.getSize(se)
    this.position.copy(e.getCenter(oe))
    this.scale.set(t.x, t.y, t.z)
    this.updateMatrixWorld(!0)
  }
  setFromCenterAndSize(e: Vector3, t = ie) {
    this.setBounds(re.setFromCenterAndSize(e, t))
  }
}
class MeshRenderer {
  meshModule: ModelMeshModule
  scene: Scene
  container: ModelMesh | TiledMesh
  mesh: ModelMesh | TiledMesh
  meshData: MeshData
  sweepData: SweepsData
  chunkSharedState: ChunkSharedState
  renderOptions: any
  chunkRenderingModeOverride: RenderingMode | null
  lastChunkRenderingModeOverride: null | RenderingMode
  fallbackMesh: FallbackMesh
  overlayColors: Function[]
  toolMeshColorEnabled: boolean
  TOOL_MESH_COLOR_OVERLAY: Vector4
  overlayTextures: { sweepId: undefined; texture: undefined; renderTarget: WebGLCubeRenderTarget; quaternion: Quaternion }[]
  overlayEnabled: boolean
  bindings: ISubscription[]
  updateFallbackMesh: (t: number) => void
  viewmodeData: ViewmodeData
  cameraData: CameraData
  opacity: null | number
  debugColorizeChunks: (t: boolean, i?: boolean) => void
  applicationData: AppData
  settings: SettingsData
  renderer: WebglRendererModule
  panoRenderer: PanoRenderer
  currentSweepId: string | null
  targetSweepId: string | null
  lastViewmode: ViewModes | null
  constructor(e, t, i, o, r, n, a, h) {
    this.meshModule = e
    this.scene = t
    this.container = i
    this.mesh = o
    this.meshData = r
    this.sweepData = n
    this.chunkSharedState = a
    this.renderOptions = h
    this.chunkRenderingModeOverride = null
    this.lastChunkRenderingModeOverride = null
    this.fallbackMesh = new FallbackMesh(this.chunkSharedState)
    this.overlayColors = []
    this.toolMeshColorEnabled = !1
    this.TOOL_MESH_COLOR_OVERLAY = new Vector4(0, 0, 0, 0.3)
    this.overlayTextures = [
      { sweepId: void 0, texture: void 0, renderTarget: new WebGLCubeRenderTarget(2048, { format: RGBAFormat }), quaternion: new Quaternion() },
      { sweepId: void 0, texture: void 0, renderTarget: new WebGLCubeRenderTarget(2048, { format: RGBAFormat }), quaternion: new Quaternion() }
    ]
    this.overlayEnabled = !1
    this.bindings = []
    this.updateFallbackMesh = (() => {
      const e = new Box3()
      return t => {
        if (this.sweepData.currentAlignedSweepObject && this.viewmodeData.isInside()) {
          const t = e.copy(this.meshData.extendedBounds).expandByScalar(0.2)
          this.fallbackMesh.setBounds(t)
        } else this.cameraData && this.fallbackMesh.setFromCenterAndSize(this.cameraData.pose.position)
        this.fallbackMesh.material && (this.fallbackMesh.material.transparent = !(t < 1e-5))
      }
    })()
    this.opacity = null
    this.debugColorizeChunks = (() => {
      let e = !1
      return (t, i) => {
        const o = new Vector4(1, 1, 1, 0)
        e = !e
        ;(e => {
          for (const t of this.mesh.chunks) {
            const s = i ? 100 * t.id : 100 * t.meshSubgroup
            const r = e ? randomColorMap(0.5, s) : o
            t.setColorOverlay(r)
          }
        })(t || e)
      }
    })()
  }
  init() {}
  dispose() {}
  async activate(e: EngineContext) {
    ;[this.applicationData, this.viewmodeData, this.settings, this.cameraData, this.renderer] = await Promise.all([
      e.market.waitForData(AppData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(SettingsData),
      e.market.waitForData(CameraData),
      e.getModuleBySymbol(WebglRendererSymbol)
    ])
    this.panoRenderer = (await e.getModuleBySymbol(PanoSymbol)).getRenderer()
    this.scene.add(this.container)
    this.scene.add(this.fallbackMesh)
    this.fallbackMesh.layers.mask = this.container.layers.mask
    this.updateRenderState()
    this.bindings.push(
      this.viewmodeData.onChanged(this.updateRenderState.bind(this)),
      this.sweepData.onChanged(this.updateRenderState.bind(this)),
      this.settings.onChanged(this.updateRenderState.bind(this)),
      this.settings.onPropertyChanged(WireframeEnabledKey, e => this.toggleWireframe(e))
    )
    this.bindings.push(
      this.mesh.notifyOnChunksLoaded(e => {
        for (const t of this.overlayColors) t(e)
      })
    )
    this.renderOptions.colorizeRooms && this.debugColorizeChunks(!0)
    this.renderOptions.colorizeChunks && this.debugColorizeChunks(!0, !0)
    this.renderOptions.wireframe && this.toggleWireframe(!0)
  }
  deactivate() {
    for (const e of this.bindings) e.cancel()
    this.bindings = []
    this.scene.remove(this.container)
    this.scene.remove(this.fallbackMesh)
    this.currentSweepId && this.panoRenderer.freeTexture(this.currentSweepId)
    this.currentSweepId = null
    this.targetSweepId = null
  }
  updateSweepRenderTarget(e: number, t: string, i: Vector3, s: Quaternion) {
    const o = this.panoRenderer.useTexture(t)
    if (o) {
      let t = !0
      for (const r of this.allChunks()) r.setProjectedPano(e, i, s, o, t), (t = !1)
    }
  }
  *allChunks() {
    yield* this.mesh.chunks, yield this.fallbackMesh.chunk
  }
  updateExistingTexture(e: string, t, i?: Vector3, s?: Quaternion) {
    let o = !0
    for (const r of this.allChunks())
      e === this.currentSweepId && r.setProjectedPano(0, i, s, t, o), e === this.targetSweepId && r.setProjectedPano(1, i, s, t, o), (o = !1)
  }
  render() {}
  beforeRender() {
    const { floorOpacity: t, globalOpacityModifier: i, meshTextureOpacity: s } = this.meshModule.meshGroupVisuals
    for (const o of this.mesh.visibleChunks) {
      const r = (t.get(`${o.meshGroup}`) || 1) * i.value
      o.setMaterialsUniform({
        meshOpacity: s.value,
        panoOpacity: 1 - s.value,
        opacity: null !== this.opacity ? this.opacity : r,
        progress: this.sweepData.transition.progress.value
      })
    }
    const o = easeOutCubic(s.value, 0, 1, 1)
    this.fallbackMesh.chunk.setMeshTextureOpacity(o)
    this.fallbackMesh.chunk.setProgress(this.sweepData.transition.progress.value)
    this.updateFallbackMesh(o)
  }
  updateChunkMaterialMode(e: boolean, t: RenderingMode | null) {
    const i = e ? DoubleSide : FrontSide
    this.chunkSharedState.side = i
    this.chunkSharedState.renderingMode = t || RenderingMode.Standard
    for (const e of this.mesh.chunks) e.updateRenderingMode()
  }
  updateRenderState() {
    if (this.viewmodeData.currentMode !== this.lastViewmode || this.lastChunkRenderingModeOverride !== this.chunkRenderingModeOverride) {
      this.lastChunkRenderingModeOverride = this.chunkRenderingModeOverride
      const e = this.viewmodeData.isInside()
      this.updateChunkMaterialMode(e, this.chunkRenderingModeOverride)
      this.lastViewmode = this.viewmodeData.currentMode
    }
    if ((this.viewmodeData.transition.active && PanoramaOrMesh(this.viewmodeData.transition.to)) || this.viewmodeData.isInside()) {
      const e = this.sweepData.currentSweep
      const t = this.sweepData.transition
      const i = t.active && (this.applicationData.phase === AppStatus.PLAYING || this.applicationData.phase === AppStatus.STARTING)
      const s = i ? t.from : e
      const o = i ? t.to : e
      const r = this.currentSweepId
      const n = this.targetSweepId
      this.currentSweepId = s || null
      this.targetSweepId = o || null
      this.handleSweepChange(0, r, this.currentSweepId)
      this.handleSweepChange(1, n, this.targetSweepId)
    }
    if (this.overlayEnabled) {
      const e = this.overlayTextures.find(e => e.sweepId === this.currentSweepId)
      const t = this.overlayTextures.find(e => e.sweepId === this.targetSweepId)
      let i = !0
      for (const s of this.allChunks()) {
        s.setOverlayPano(0, e ? e.quaternion : void 0, e ? e.texture : void 0, i)
        s.setOverlayPano(1, t ? t.quaternion : void 0, t ? t.texture : void 0, i)
        i = !1
      }
    }
  }
  handleSweepChange(e: number, t: string | null, i: string | null) {
    if (t !== i && (t && this.panoRenderer.freeTexture(t), i)) {
      const t = this.sweepData.getSweep(i)
      this.updateSweepRenderTarget(e, i, t.position, t.rotation)
    }
  }
  async onPanoOverlayCommand(e: SetPanoOverlayCommand["payload"]) {
    this.overlayEnabled = !0
    const t = t => {
      const i = t.renderTarget
      t.renderTarget.width = e.texture.image.width
      t.renderTarget.height = e.texture.image.height
      t.sweepId = e.sweepId
      t.texture = i.texture
      t.quaternion = e.quaternion
      this.renderer.cwfRenderer.copyCubemap(e.texture, t.renderTarget)
    }
    let i = !1
    for (const s of this.overlayTextures) i || s.sweepId !== e.sweepId || (t(s), (i = !0))
    for (const e of this.overlayTextures) i || e.sweepId === this.targetSweepId || e.sweepId === this.currentSweepId || (t(e), (i = !0))
    this.updateRenderState()
  }
  async onMeshOverlayCommand(e) {
    let t = (e?: any) => !0
    switch (e.selectBy) {
      case SetMeshOverLayColorCommand.selectBy.all:
        t = () => !0
        this.overlayColors.length = 0
        break
      case SetMeshOverLayColorCommand.selectBy.byMeshGroup:
        t = t => t.meshGroup === e.index
        break
      case SetMeshOverLayColorCommand.selectBy.byMeshSubGroup:
        t = t => t.meshSubgroup === e.index
    }
    if (!t) return
    let i: ColorRepresentation | Vector4 | null = "rand"
    e.colorStyle === SetMeshOverLayColorCommand.colorBy.explicit && (i = e.color ? new Vector4(e.color.x, e.color.y, e.color.z, e.color.w) : null)
    const o = s => {
      for (const o of s) t(o) && o.setColorOverlay("rand" === i ? randomColorMap(e.alpha) : i)
    }
    o([...this.allChunks()])
    ;(e.selectBy === SetMeshOverLayColorCommand.selectBy.all && null === i) || this.overlayColors.push(o)
  }
  async toggleMeshOverlayColor({ enabled: e }) {
    if (e !== this.toolMeshColorEnabled) {
      this.toolMeshColorEnabled = e
      return this.onMeshOverlayCommand({
        color: e ? this.TOOL_MESH_COLOR_OVERLAY : null,
        selectBy: SetMeshOverLayColorCommand.selectBy.all,
        colorStyle: SetMeshOverLayColorCommand.colorBy.explicit,
        alpha: 0.5
      })
    }
  }
  async onSetChunkRenderStateCommand(e) {
    this.chunkRenderingModeOverride = e.mode
    this.updateRenderState()
  }
  toggleWireframe(e: boolean) {
    for (const t of this.mesh.chunks) t.setWireframe(e)
  }
}
class TextureKeyToSlot {
  lastLoadedAt: number
  textureName: string
  mesh: ModelMesh
  lod: MeshChunkLOD
  chunkedTexInfo?: any
  chunks: Set<MeshChunk>
  loading: boolean
  unloaded: boolean
  screenCoverage: number
  screenCoverageScore: number
  sightings: UndoBuffer
  quality: number
  targetQuality: number
  minQuality: number
  maxQuality: number
  texture: DataTexture | null
  constructor(e, t: TextureQualityMap, i, s = MeshChunkLOD.Standard, o) {
    this.textureName = e
    this.mesh = i
    this.lod = s
    this.chunkedTexInfo = o
    this.chunks = new Set()
    this.loading = !1
    this.unloaded = !1
    this.screenCoverage = 0
    this.screenCoverageScore = 0
    this.sightings = new UndoBuffer(FlipYConfig.sightingMaxAge)
    if (o) {
      t.registerQualities(s, o.maxTextureSize, o.maxTexelSize, o.minScale)
      this.quality = t.min(s)
      this.targetQuality = this.quality
    }
    this.minQuality = t.min(s)
    this.maxQuality = this.minQuality
  }
  setTexture(e: DataTexture | null) {
    const t = this.texture
    this.texture = e
    t && t !== e && t.dispose()
    if (e) {
      for (const t of this.chunks) {
        t.setMeshTexture(e)
      }
    }
  }
  getEmbeddedTexture() {
    const t = this.chunks.entries().next()?.value as MeshChunk[]
    return t ? t[0].embeddedTexture : void 0
  }
}
class TextureBudgeter {
  textureQualityMap: TextureQualityMap
  renderer: WebglRendererModule
  maxBudget: Function
  pctTotalMemory: number
  lods: Map<MeshChunkLOD, Set<TextureKeyToSlot>>
  orders: Record<number, number[]>
  slotTexSizes: Map<string, number>
  slots: TextureKeyToSlot[]
  budget: number
  constructor(e, t, i, s = 0.85) {
    this.textureQualityMap = e
    this.renderer = t
    this.maxBudget = i
    this.pctTotalMemory = s
    this.lods = new Map()
    this.orders = {}
    this.slotTexSizes = new Map()
  }
  dispose() {
    this.slots.length = 0
    this.lods.clear()
  }
  update(e) {
    this.updateBudget(void 0)
    this.updateTargetQualitiesFromBudget()
  }
  updateBudget(e?: TextureKeyToSlot[]) {
    if (e) {
      this.slots = e
      e.forEach(e => {
        const t = this.lods.get(e.lod) || new Set()
        t.add(e)
        this.lods.set(e.lod, t)
        this.orders[e.lod] = this.textureQualityMap.order(e.lod)
      })
    }
    if (this.shouldRestrictBudget()) {
      const e = this.calcCurrentTexturesSize()
      const t = this.renderer.estimatedGPUMemoryAllocated() - e
      const i = this.maxBudget() - t
      this.budget = i * this.pctTotalMemory
    } else this.budget = 1 / 0
    return this
  }
  updateTargetQualitiesFromBudget() {
    let e = 0
    for (const t of this.slots) {
      this.updateBudgetSize(t)
      t.targetQuality = t.minQuality
      e += this.getBudgetSize(t, t.targetQuality)
    }
    const t = (t, i) =>
      t.maxQuality < i || ((e -= this.getBudgetSize(t, t.targetQuality)), (e += this.getBudgetSize(t, i)), !(e > this.budget) && ((t.targetQuality = i), !0))
    if (this.shouldRestrictBudget()) {
      for (const e of this.slots) for (const i of this.orders[e.lod]) if (!t(e, i)) return
    } else for (const [e, i] of this.lods.entries()) for (const s of this.orders[e]) for (const e of i) if (!t(e, s)) return
  }
  shouldRestrictBudget() {
    return this.maxBudget() !== 1 / 0
  }
  getBudgetSize(e: TextureKeyToSlot, t: number) {
    if (!t) return 0
    const i = this.textureQualityMap.get(t)
    let s = 0
    if (e) {
      const i = this.textureQualityMap.min(e.lod)
      i !== t && e.getEmbeddedTexture() && (s = this.getBudgetSize(e, i))
      const o = e.textureName + t,
        r = this.slotTexSizes.get(o)
      if (r) return r + s
    }
    return (i ? i.textureSize : 4096) ** 2 * 4 + s
  }
  updateBudgetSize(e: TextureKeyToSlot) {
    const i = e.textureName + e.quality
    const s = e.texture || e.getEmbeddedTexture()
    this.slotTexSizes.set(i, this.texSizeBytes(s))
  }
  calcCurrentTexturesSize() {
    return this.slots.reduce((e, t) => {
      const s = t.getEmbeddedTexture()
      const o = t.texture || s
      return o === s ? e + this.texSizeBytes(o) : e + this.texSizeBytes(o) + this.texSizeBytes(s)
    }, 0)
  }
  texSizeBytes(e?: DataTexture): number {
    if (!e) return 0
    if (e.mipmaps.length > 0) return e.mipmaps.reduce((e, t) => e + t.data.length, 0)
    let t = e.image.width * e.image.height * 4,
      i = t / 4
    for (; i >= 1; ) (t += i), (i /= 4)
    return t
  }
}
const we = new DebugInfo("tex-lod")
export class MeshTextureLoader {
  textureQualityMap: TextureQualityMap
  textureLOD: TextureLOD
  api: UserApiClient
  camera: PerspectiveCamera
  renderer: CWFRenderer
  renderToTextureModule: RenderToTextureModule
  engine: EngineContext
  chunkVisibilityChecker: ChunkVisibilityChecker
  rendererModule: WebglRendererModule
  name: string
  limitMemoryUsage: boolean
  allocatedMegsBeforeLimitingLod: number
  slots: TextureKeyToSlot[]
  textureKeyToSlot: Record<string, TextureKeyToSlot>
  chunkSourceToMesh: Record<string, ModelMesh>
  chunkIdToSlot: Record<number, TextureKeyToSlot>
  _systemMin: MeshTextureQuality
  _systemMax: MeshTextureQuality
  allowTextureDownload: () => boolean
  concurrentLoadingTextures: number
  concurrentDownloadingTiles: number
  autoLoadTiles: boolean
  lastSortedAt: number
  loadingTextures: number
  downloadingTiles: number
  totalTextures: Record<number, number>
  totalTiles: number
  abortController: AbortController
  bindings: ISubscription[]
  textureApiInfo: Map<ModelMesh, Record<string, ExpiringResource>>
  _chunkSlotsSet: Set<TextureKeyToSlot>
  loadImage: (e: TextureKeyToSlot, t: number, i: UserApiClient, s: any, o: any) => Promise<ArrayBuffer | ImageBitmap>
  textureBudgeter: TextureBudgeter
  minQuality: Record<number, number>
  maxQuality: Record<number, number>
  analyzeTaskPromise: Promise<any> | null
  constructor(e, t, i, s, o, r, n, a, h) {
    this.textureQualityMap = e
    this.textureLOD = t
    this.api = i
    this.camera = s
    this.renderer = o
    this.renderToTextureModule = r
    this.engine = n
    this.chunkVisibilityChecker = a
    this.rendererModule = h
    this.name = "texture-streaming"
    this.limitMemoryUsage = !1
    this.allocatedMegsBeforeLimitingLod = 350
    this.slots = []
    this.textureKeyToSlot = {}
    this.chunkSourceToMesh = {}
    this.chunkIdToSlot = {}
    this._systemMin = MeshTextureQuality.LOW
    this._systemMax = MeshTextureQuality.ULTRA
    this.allowTextureDownload = () => !0
    this.concurrentLoadingTextures = 1
    this.concurrentDownloadingTiles = 12
    this.autoLoadTiles = !1
    this.lastSortedAt = 0
    this.loadingTextures = 0
    this.downloadingTiles = 0
    this.totalTextures = {}
    this.totalTiles = 0
    this.abortController = new AbortController()
    this.bindings = []
    this.textureApiInfo = new Map()
    this._chunkSlotsSet = new Set()
    this.loadImage = async (e, t, i, s, o) => {
      const n = this.textureQualityMap.get(t)
      const { assetType: a, lod: h } = n
      const l = e.chunkedTexInfo?.maxTextureSize || n.assetSize
      let d: string,
        c = e.textureName

      if (this.textureApiInfo) {
        //pw
        // if (!e.chunkedTexInfo) {
        //   const e = c.match(/[_.]([0-9]{3})[_.]/)
        //   if (!e) throw new Error(`Could not parse texture index from texture name: ${c}`)
        //   c = e[1]
        // }
        const t = this.textureApiInfo.get(e.mesh)

        if (!t) throw new Error(`No texture URLs found for mesh: ${e}`)
        d = (await t[a].get()).urlTemplate.replace("<folder>", `${h}`).replace("<texture>", c)
      } else {
        const e = c.match(/^([a-f0-9]+(_10k|_50k)?)/)
        if (!e) throw new Error(`Unknown format for texture name: ${c}`)
        d = `${e[0]}_texture_jpg_${a}/${c}`
      }
      const { sourceSize: u = l, sourceX: m = 0, sourceY: p = 0, destSize: g = u } = s
      //贴图裁剪
      const y: any = {}
      if (g !== u) {
        y.width = `${g}`
        y["x-image-process"] = `image/resize,w_${g}`
      }
      if (u !== l) {
        y.crop = `${u},${u},x${m / l},y${p / l}`
      }
      d = mergParamsToURL(d, y)
      return i.getImageBitmap(d, g, g, o)
    }
    this.textureBudgeter = new TextureBudgeter(this.textureQualityMap, this.rendererModule, () =>
      this.limitMemoryUsage ? this.allocatedMegsBeforeLimitingLod * 2 ** 20 : 1 / 0
    )
    this.bindings.push(
      this.chunkVisibilityChecker.notifyOnNewSighting((e, t) => {
        const i = this.chunkSourceToMesh[e.sourceKey]
        if (i) {
          const s = this.addChunkSlots(i, [e])
          for (const e of s) e.sightings.push(t)
        }
      })
    )
  }
  setModel(e: ModelMesh, t: MeshChunk[], i: Record<string, ExpiringResource>) {
    this.textureApiInfo.set(e, i)
    if (0 === t.length) throw new Error("Chunks required")
    this.addChunkSlots(e, [...t])
    this.textureBudgeter.updateBudget(this.slots)
    this.updateSystemQualityRanges()
  }
  clearSlots() {
    this.abortController.abort()
    this.slots.forEach(e => {
      this.removeChunks([...e.chunks])
    })
    this.abortController = new AbortController()
  }
  dispose() {
    this.abortController.abort()
    this.bindings.forEach(e => e.cancel())
    this.bindings.length = 0
    this.clearSlots()
    this._chunkSlotsSet.clear()
    this.textureBudgeter.dispose()
    this.textureApiInfo.clear()
  }
  addChunkSlots(e: ModelMesh, t: MeshChunk[]) {
    t.forEach(t => {
      this.chunkSourceToMesh[t.sourceKey] = e
    })
    this._chunkSlotsSet.clear()
    let i = !1
    for (const s of t) {
      const t = s.textureName
      let o = this.textureKeyToSlot[s.textureCacheKey]
      if (!o) {
        i = !0
        o = new TextureKeyToSlot(t, this.textureQualityMap, e, s.lod, s.textureLODInfo)
        s.embeddedTexture && o.setTexture(s.embeddedTexture)
        this.textureKeyToSlot[s.textureCacheKey] = o
        this.slots.push(o)
      }

      if (!o.chunks.has(s)) {
        i = !0
        o.chunks.add(s)
        o.texture && s.setMeshTexture(o.texture)
      }
      this._chunkSlotsSet.add(o)
      this.chunkIdToSlot[s.id] = o
    }
    i && this.textureBudgeter && (this.textureBudgeter.updateBudget(this.slots), this.updateSystemQualityRanges())
    return this._chunkSlotsSet
  }
  removeChunks(e: MeshChunk[]) {
    for (const t of e) {
      const e = this.chunkIdToSlot[t.id]
      if (e) {
        e.chunks.delete(t)
        if (0 === e.chunks.size) {
          e.unloaded = !0
          e.setTexture(null)
          const i = this.slots.indexOf(e)
          this.slots.splice(i, 1)
          delete this.textureKeyToSlot[t.textureCacheKey]
        }
        delete this.chunkIdToSlot[t.id]
      } else we.error("Missing slot for chunk!", t.id, t.textureCacheKey, t)
    }
  }
  setQuality(e: MeshTextureQuality, t: MeshTextureQuality) {
    this._systemMin = e
    this._systemMax = t
    this.updateSystemQualityRanges()
  }
  updateSystemQualityRanges() {
    const e = this.textureQualityMap
    this.minQuality = {}
    this.maxQuality = {}
    for (const t of new Set([...this.slots.map(e => e.lod)]).values()) {
      this.minQuality[t] = e.nearestQuality(t, this._systemMin)
      this.maxQuality[t] = e.nearestQuality(t, this._systemMax)
    }

    for (const e of this.slots) {
      e.minQuality = this.minQuality[e.lod]
      e.maxQuality = e.maxQuality ? Math.min(this.maxQuality[e.lod], e.maxQuality) : this.maxQuality[e.lod]
    }
  }
  get textureCount() {
    return this.slots.length
  }
  async loadAll(e: number) {
    this.slots[0] && this.slots[0].textureName && (await this.loadSlots(this.slots, e))
  }
  async loadSlots(e: TextureKeyToSlot[], t = this.textureQualityMap.min(MeshChunkLOD.Standard)) {
    const i = this.textureQualityMap
    i.valid(t) ? await Promise.all(e.map(e => this.loadTexture(e, t, !1))) : we.warn(t, "not found in", i)
  }
  onWebGLContextLost() {
    this.abortController.abort()
    for (const e of this.slots) e.texture = null
  }
  onWebGLContextRestored() {
    this.abortController = new AbortController()
    for (const e of this.slots) this.loadTexture(e, e.quality)
  }
  async loadTexture(e: TextureKeyToSlot, t: number, i = !0) {
    const r = this.textureQualityMap
    r.valid(t) || we.warn(t, "not found in", r)
    const n = r.get(t)
    const a = e.chunkedTexInfo?.maxTextureSize || n.assetSize
    const h = Math.min(a, n.textureSize)
    e.lastLoadedAt = performance.now()
    let l = e.texture

    if (!l || t !== e.quality) {
      if (l && t < e.quality && e.texture) {
        const i = e.chunks.values().next().value?.embeddedTexture
        if (i && i.image.width >= h && i.mipmaps[0].data.length <= h * h * 4) {
          e.quality = t
          return e.setTexture(i)
        }
        {
          const i = this.renderToTextureModule.resizeTexture(l, h)
          be(i as DataTexture, e)
          e.quality = t
          return e.setTexture(i as DataTexture)
        }
      }
      e.loading = !0
      this.loadingTextures++
      this.totalTextures[h] = (this.totalTextures[h] || 0) + 1
      try {
        l =
          this.textureLOD !== TextureLOD.NONE && i
            ? await this.loadTextureTiled(h, t, e, this.abortController.signal)
            : await this.loadTextureSolid(h, t, e, this.abortController.signal)
        if (e.unloaded) {
          l.dispose()
        } else {
          be(l, e)
          e.setTexture(l)
        }
      } catch (e) {
      } finally {
        this.loadingTextures--
        e.quality = t
        e.loading = !1
      }
    }
  }
  async loadTextureTiled(e: number, t: number, i: TextureKeyToSlot, o: AbortSignal) {
    const n = this.renderer.initSizedTexture2D(e, { generateMipmaps: !1, minFilter: LinearFilter, magFilter: LinearFilter })
    const a = this.textureQualityMap
    const h = i.chunkedTexInfo?.maxTextureSize || a.get(t).assetSize
    const l = Math.min(h, a.get(t).textureSize)
    const d = Math.min(l, a.get(t).tileSize)
    const c = async (e: number, s: number) => {
      let r
      this.downloadingTiles += 1
      this.totalTiles += 1
      const a = FlipYConfig.flipDownload
      try {
        r = await this.loadImage(
          i,
          t,
          this.api,
          { sourceSize: h * (d / l), sourceX: h * (e / l), sourceY: h * (s / l), destSize: d },
          { priority: HttpPriority.LOW, flipY: a, signal: o }
        )
      } finally {
        this.downloadingTiles -= 1
      }
      const c = e
      const u = FlipYConfig.flipUpload ? l - s - d : s
      const m = new ScheduleTaskCommand(
        "mesh/texture/upload-tiles",
        () =>
          this.engine.after(EngineTickState.End).then(() => {
            if (o.aborted) throw new DOMException("Aborted", "AbortError")
            n.flipY = a && r instanceof HTMLImageElement
            this.renderer.uploadTexture2D(r, n, c, u)
          }),
        100
      )
      return (await this.engine.commandBinder.issueCommand(m)).promise.finally(() => {
        r?.close?.call(r)
      })
    }
    const u: Promise<any>[] = []

    for (let e = 0; e < l; e += d) {
      for (let t = 0; t < l; t += d) {
        u.push(c(e, t))
      }
    }
    try {
      await Promise.all(u)
    } catch (e) {
      throw (n.dispose(), e)
    }
    return n
  }
  async loadTextureSolid(e: number, t: number, i: TextureKeyToSlot, s: AbortSignal) {
    const n = this.renderer.initSizedTexture2D(e)
    let a: ArrayBuffer | ImageBitmap | null = null
    try {
      const e = this.textureQualityMap.get(t).textureSize
      const h = FlipYConfig.flipDownload

      a = await this.loadImage(i, t, this.api, { destSize: e }, { priority: HttpPriority.LOW, flipY: h, signal: s })
      n.flipY = h && a instanceof HTMLImageElement

      this.renderer.uploadTexture2D(a, n, 0, 0)
    } catch (e) {
      n.dispose()
      throw e
    } finally {
      //@ts-ignore
      a?.close?.call(a)
    }
    return n
  }
  setImageLoader(e: MeshTextureLoader["loadImage"]) {
    this.loadImage = e
  }
  analyzeTextureScreenCoverageFromRaycasts() {
    const e = this.renderer.getSize().x,
      t = this.camera.getWorldPosition(new Vector3())
    for (const i of this.slots) {
      ;(i.screenCoverage = 0), (i.screenCoverageScore = 0), (i.maxQuality = i.minQuality)
      const s = i.sightings.getList(),
        o = i.sightings.index - 1
      for (let r = 0; r < s.length; r++) {
        const n = s[(o - r + s.length) % s.length]
        if (n.raycastAge < this.chunkVisibilityChecker.raycastCounter - FlipYConfig.sightingMaxAge) break
        const a = t.distanceTo(n.point),
          h = calculateWorldUnitsFromScreenWidth(a, this.camera.projectionMatrix, e)
        let l = this.textureQualityMap.fromPixelSize(i.lod, h)
        ;(l = Math.min(l, this.maxQuality[i.lod])), (i.screenCoverageScore += l), (i.screenCoverage += 1), (i.maxQuality = Math.max(l, i.maxQuality))
      }
    }
    this.slots.sort((e, t) => t.screenCoverageScore - e.screenCoverageScore), this.textureBudgeter.updateTargetQualitiesFromBudget()
  }
  update(e) {
    //pw
    return
    if (!this.camera || !this.autoLoadTiles || this.abortController.signal.aborted) return
    this.textureBudgeter.update(e)
    const t = performance.now()
    this.textureLOD === TextureLOD.RAYCAST && this.scheduleRaycastTasks(t)
    let i = !1
    for (let e = this.slots.length - 1; e >= 0; e--) {
      const s = this.slots[e]
      const o = CheckThreshold(s.targetQuality, s.minQuality, s.maxQuality)
      const r = t - s.lastLoadedAt < 1e3
      if (!s.loading && s.quality > o) {
        r ? (i = !0) : this.loadTexture(s, o)
        break
      }
    }
    if (this.allowTextureDownload() && !i) {
      for (const e of this.slots) {
        if (this.loadingTextures >= this.concurrentLoadingTextures || this.downloadingTiles >= this.concurrentDownloadingTiles) break
        const t = CheckThreshold(e.targetQuality, e.minQuality, e.maxQuality)
        !e.loading && e.quality < t && this.loadTexture(e, this.textureQualityMap.moreDetailed(e.lod, e.quality))
      }
    }
  }
  scheduleRaycastTasks(e: number) {
    if (!this.analyzeTaskPromise && e - this.lastSortedAt > 200) {
      const e = () => {
        this.analyzeTextureScreenCoverageFromRaycasts()
        this.lastSortedAt = performance.now()
      }
      const t = async e => {
        await e.promise
        this.analyzeTaskPromise = null
      }
      const i = new ScheduleTaskCommand("mesh/texture/analyze-screen-coverage", e, 100)
      this.analyzeTaskPromise = this.engine.commandBinder.issueCommand(i).then(t)
    }
  }
}
function be(e: DataTexture, t: TextureKeyToSlot) {
  e.addEventListener("dispose", () => {
    e === t.texture && we.warn("Streamed texture disposed while still in use")
  })
}
const Ce = Math.round(FlipYConfig.sightingMaxAge / 60 / 5) || 1
export class ChunkVisibilityChecker {
  camera: ShowCaseScene["camera"]
  scene: ShowCaseScene
  raycaster: ShowcaseRaycaster
  pose: Pose
  raycastCounter: number
  onNewSighting: Set<Function>
  lastReset: number
  raycastRandomScreenLocation: (s: number, r: number, n?: Function) => void
  constructor(e, t, i) {
    this.scene = e
    this.raycaster = t
    this.pose = i
    this.raycastCounter = 0
    this.onNewSighting = new Set()
    this.lastReset = 0
    this.raycastRandomScreenLocation = (() => {
      const e = new Vector3()
      const t = new Vector3()
      const i = new Vector3()
      function o(e) {
        return !!(isVisibleShowcaseMesh(e) && e instanceof RoomMesh) && e.chunks.some(e => e.getOpacity() > Q.xx.FADE_TILE_VISIBLE_THRESHOLD)
      }
      return (s, r, n) => {
        this.raycastCounter++
        const a = (2 - 2 * r) / s
        const h = -1 + r
        const l = this.raycastCounter % (s * s)
        const d = l % s
        const c = h + ((l - d) / s) * a
        const u = h + d * a + Math.random() * a
        const m = c + Math.random() * a
        e.set(u, m, -1).unproject(this.camera)
        t.set(u, m, 1).unproject(this.camera)
        i.subVectors(t, e).normalize()
        const p = this.raycaster.pick(e, i, o)
        if (p) {
          if (p.face && p.object instanceof RoomMesh) {
            const e = p.object.getChunk(p.face.materialIndex),
              t = { point: p.point.clone(), raycastAge: this.raycastCounter }
            for (const i of this.onNewSighting.values()) i(e, t)
          }
          n && n(p)
        }
      }
    })()
    this.camera = e.camera
  }

  resetCounter() {
    this.lastReset = this.raycastCounter
  }
  update() {
    const e = FlipYConfig.debugLOD ? (0, xe.ef)(65280, this.scene, this.pose) : void 0
    const t = performance.now()
    for (let i = 0; i < Ce && performance.now() - t < 0.5 && this.raycastCounter <= this.lastReset + FlipYConfig.sightingMaxAge; i++)
      this.raycastRandomScreenLocation(5, 0.05, e)
  }
  notifyOnNewSighting(e) {
    return createSubscription(
      () => this.onNewSighting.add(e),
      () => this.onNewSighting.delete(e),
      !0
    )
  }
}

class ModeMaterials {
  materials: Map<RenderingMode, RawShaderMaterial | MeshBasicMaterial>
  constructor() {
    this.materials = new Map()
  }
  get(e: RenderingMode) {
    let t = this.materials.get(e)
    t || ((t = Ee[e]()), this.materials.set(e, t!))
    return t!
  }
}
const Ee = {
  [RenderingMode.Depth]() {
    const e = UniformsUtils.clone(ModelShaderConfig.depth.uniforms)
    return new RawShaderMaterial({
      fragmentShader: ModelShaderConfig.depth.fragmentShader,
      vertexShader: ModelShaderConfig.depth.vertexShader,
      uniforms: e,
      side: FrontSide,
      name: "materialDepth"
    })
  },
  [RenderingMode.Transparent]() {
    const e = UniformsUtils.clone(ModelShaderConfig.modelOutside.uniforms)
    return (
      (e.opacity.value = 0.2),
      e.colorOverlay.value.set(1, 1, 1, 1),
      new RawShaderMaterial({
        fragmentShader: ModelShaderConfig.modelOutside.fragmentShader,
        vertexShader: ModelShaderConfig.modelOutside.vertexShader,
        uniforms: e,
        side: FrontSide,
        transparent: !0,
        name: "materialTransparent"
      })
    )
  },
  [RenderingMode.Wireframe]() {
    const e = UniformsUtils.clone(ModelShaderConfig.modelOutside.uniforms)
    return (
      (e.opacity.value = 0.5),
      e.colorOverlay.value.set(1, 1, 1, 1),
      new RawShaderMaterial({
        fragmentShader: ModelShaderConfig.modelOutside.fragmentShader,
        vertexShader: ModelShaderConfig.modelOutside.vertexShader,
        uniforms: e,
        side: FrontSide,
        transparent: !0,
        wireframe: !0,
        name: "materialWireframe"
      })
    )
  },
  [RenderingMode.UV]: () => new MeshBasicMaterial({ name: "uv-debug", map: LoadTexture(Oe) })
}
export class ChunkSharedState {
  side: Side
  renderingMode: RenderingMode
  chunkMaterials: Record<string, StandardMaterial>
  modeMaterials: ModeMaterials
  maxVaryings: number
  globalUniforms: Record<string, Vector4 | CubeTexture | Matrix4 | Vector3>
  constructor() {
    this.side = FrontSide
    this.renderingMode = RenderingMode.Standard
    this.chunkMaterials = {}
    this.modeMaterials = new ModeMaterials()
    this.globalUniforms = {}
  }
  forEachChunkMaterial(e: (e) => boolean) {
    const { chunkMaterials: t } = this
    for (const i in t) e(t[i])
  }
  dispose() {
    const { chunkMaterials: e } = this
    for (const t in e) {
      const i = e[t]
      for (const e in i.uniforms) i.uniforms[e].value instanceof Texture && i.uniforms[e].value.dispose()
      i.dispose()
      delete e[t]
    }
  }
}
class TextureQualityMap {
  _configs: Record<
    number,
    {
      assetSize: number
      assetType: string
      key: number
      lod: MeshChunkLOD
      texelSize: number
      textureSize: number
      tileSize: number
    }
  >
  _orders: Record<number, number[]>
  _maxLod: number
  _maxTs: number
  _streamAbove: number
  constructor() {
    this._configs = {}
    this._orders = {}
    this._maxLod = -1 / 0
    this._maxTs = 1 / 0
    this._streamAbove = 0
  }
  static encodeKey(e: number, t: number) {
    return e - t
  }
  get maxLod() {
    return this._maxLod
  }
  get maxTexelSize() {
    return this._maxTs
  }
  limitStreamingBelow(e: number) {
    this._streamAbove = e
  }
  order(e: MeshChunkLOD, t = !1) {
    return t && !this._orders[e] && (this._orders[e] = []), this._orders[e]
  }
  reset() {
    this._configs = {}
    this._orders = {}
    this._maxTs = 1 / 0
    this._maxLod = -1 / 0
  }
  valid(e: number) {
    return e in this._configs
  }
  get(e: number) {
    if (!this.valid(e)) throw new Error("invalid quality level " + e)
    return this._configs[e]
  }
  max(e: MeshChunkLOD) {
    return e < this._streamAbove ? this.min(e) : this.order(e)[this.order(e).length - 1]
  }
  min(e: MeshChunkLOD) {
    return this.order(e)[0]
  }
  fromPixelSize(e: MeshChunkLOD, t: MeshChunkLOD) {
    const i = this.order(e)
    const s = this.min(e)
    let o = this.max(e)
    for (let e = i.length - 1; e >= 0; e--) t > this.get(i[e]).texelSize && i.indexOf(o) > i.indexOf(s) && (o = i[e])
    return o
  }
  moreDetailed(e: MeshChunkLOD, t: MeshChunkLOD) {
    let i = this.min(e)
    const s = this.max(e)
    const o = this.order(e)
    const r = o.indexOf(t)
    return r + 1 === o.length ? s : (-1 !== r && (i = Math.min(s, o[r + (1 % o.length)])), i)
  }
  lessDetailed(e: MeshChunkLOD, t: number) {
    const i = this.order(e),
      s = i.indexOf(t)
    let o = t
    return -1 !== s && (o = i[Math.max(0, s - 1)]), o
  }
  minSize() {
    return Object.values(this._configs).sort(Re)[0]
  }
  maxSize() {
    const e = Object.values(this._configs).sort(Re)
    return e[e.length - 1]
  }
  nearestQuality(e: MeshChunkLOD, t: number) {
    const i = this.order(e),
      s = this.max(e),
      o = lerp(t, 1, 4, 0, i.length - 1)
    return Math.min(s, i[Math.round(o)])
  }
  registerQualities(e: MeshChunkLOD, t: number, i: number, s: number, o = "max") {
    const r = this._configs
    const n = this.order(e, !0)
    const a = t * s
    for (let s = t, h = i; s >= a; s *= 0.5, h *= 2) {
      const i = TextureQualityMap.encodeKey(e, h)
      const a = r[i]
      if (!a || (a && a.assetSize < t)) {
        this._maxTs = Math.min(this._maxTs, h)
        this._maxLod = Math.max(this._maxLod, e)
        r[i] = { key: i, lod: e, texelSize: h, textureSize: s, assetSize: t, assetType: o, tileSize: Math.min(s, FlipYConfig.textureTileSize) }
      }
      ;-1 === n.indexOf(i) && n.push(i)
    }

    n.sort((e, t) => r[t].texelSize - r[e].texelSize)
  }
}
function Re(e, t) {
  return e.textureSize > t.textureSize ? 1 : -1
}

interface LoadResult {
  id: string
  meshData: MeshData
  modelMesh: ModelMesh | TiledMesh
  roomMeshData: RoomMeshData
  renderer: MeshRenderer
  tiled?: boolean | null
}
export default class ModelMeshModule extends Module {
  commands: {
    MeshPreviewSetPositonCommand: typeof MeshPreviewPositionCommand
    SetChunkRenderModeCommand: typeof SetChunkRenderModeCommand
    SetMeshOverlayCommand: typeof SetMeshOverLayColorCommand
    SetPanoOverlayCommand: typeof SetPanoOverlayCommand
    ToggleMeshOverlayColorCommand: typeof ToggleMeshOverlayColorCommand
  }
  meshTrimData: MeshTrimData
  meshes: Map<string, LoadResult>
  inactiveMeshes: Map<string, LoadResult>
  meshGroupVisuals: {
    allFloorsVisibleInOrtho: ObservableValue<boolean>
    floorOpacity: ObservableMap<number>
    globalOpacityModifier: ObservableValue<number>
    meshTextureOpacity: AnimationProgress
  }
  meshesLoaded: number
  meshLoadPromises: Map<string, Promise<LoadResult>>
  _firstMeshLoadPromise: OpenDeferred<any>
  _renderMode: RenderMode
  onMeshOverlayCommand: (e: any) => void
  toggleMeshOverlayColor: (e: any) => void
  onSetChunkRenderStateCommand: (e: any) => void
  onPanoOverlayCommand: (e: SetPanoOverlayCommand["payload"]) => void
  meshTrimUpdateRenderMode: (e: any) => void
  meshTrimUniforms: MeshTrimUniforms
  meshTrimFilter: (e: any) => boolean
  viewmodeData: ViewmodeData
  engine: EngineContext
  config: any
  market: MarketContext
  webglScene: ShowCaseScene
  raycasterModule: RaycasterModule
  input: InputIniModule
  chunkVisibilityChecker: ChunkVisibilityChecker
  chunkSharedState: ChunkSharedState
  textureQualityMap: TextureQualityMap
  meshTextureLoader: MeshTextureLoader
  constructor() {
    super(...arguments)
    this.name = "model-mesh"
    this.commands = {
      MeshPreviewSetPositonCommand: MeshPreviewPositionCommand,
      SetChunkRenderModeCommand: SetChunkRenderModeCommand,
      SetMeshOverlayCommand: SetMeshOverLayColorCommand,
      SetPanoOverlayCommand: SetPanoOverlayCommand,
      ToggleMeshOverlayColorCommand: ToggleMeshOverlayColorCommand
    }
    this.meshTrimData = new MeshTrimData()
    this.meshes = new Map()
    this.inactiveMeshes = new Map()
    this.meshGroupVisuals = {
      allFloorsVisibleInOrtho: new ObservableValue(!0),
      floorOpacity: new ObservableMap(),
      globalOpacityModifier: new ObservableValue(1),
      meshTextureOpacity: new AnimationProgress(1)
    }
    this.meshesLoaded = 0
    this.meshLoadPromises = new Map()
    this._firstMeshLoadPromise = new OpenDeferred()
    this._renderMode = RenderMode.Hidden
    this.onMeshOverlayCommand = e => {
      this.meshes.forEach(t => {
        t.renderer.onMeshOverlayCommand(e)
      })
    }
    this.toggleMeshOverlayColor = e => {
      this.meshes.forEach(t => {
        t.renderer.toggleMeshOverlayColor(e)
      })
    }
    this.onSetChunkRenderStateCommand = e => {
      this.meshes.forEach(t => {
        t.renderer.onSetChunkRenderStateCommand(e)
      })
    }
    this.onPanoOverlayCommand = e => {
      this.meshes.forEach(t => {
        t.renderer.onPanoOverlayCommand(e)
      })
    }
    this.meshTrimUpdateRenderMode = e => {
      this.meshTrimUniforms && e !== this.meshTrimUniforms.isPanoMode && ((this.meshTrimUniforms.isPanoMode = e), this.meshTrimUpdate(-1))
    }
    this.meshTrimFilter = e => {
      const t = e.object
      const i = e.point
      let s = !1,
        o = !1
      if (this.meshTrimData && this.viewmodeData && isVisibleShowcaseMesh(t)) {
        for (const e of this.meshTrimData.activeTrimsForMeshGroup(t.meshGroup)) {
          const t = e.isPointTrimmed(i, this.viewmodeData.isPano())
          if (e.discardContents) {
            if (t) return !1
          } else (s = s || !t), (o = !0)
        }
        if (o) return s
      }
      return !0
    }
  }
  get firstMeshLoadPromise() {
    return this._firstMeshLoadPromise.nativePromise()
  }
  getMesh(e: string) {
    return this.meshes.get(e)?.modelMesh || this.inactiveMeshes.get(e)?.modelMesh || null
  }
  hasMesh(e: string) {
    return this.meshes.has(e) || this.inactiveMeshes.has(e) || this.meshLoadPromises.has(e)
  }
  async init(e, t: EngineContext) {
    if (!THREEFix) {
      Mesh.prototype.raycast = ShowcaseMeshRaycast
      BufferGeometry.prototype.computeBoundsTree = buildMeshBVH
      BufferGeometry.prototype.disposeBoundsTree = clearMeshBVH
      THREEFix = !0
    }
    this.engine = t
    this.config = e
    this.market = t.market
    const [i, o, r, n, h, l, d] = await Promise.all([
      t.getModuleBySymbol(Apiv2Symbol),
      t.market.waitForData(CameraData),
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.getModuleBySymbol(RaycasterSymbol),
      t.getModuleBySymbol(RttSymbol),
      t.market.waitForData(ViewmodeData)
    ])
    this.viewmodeData = d
    this.webglScene = n.getScene()
    this.raycasterModule = h
    this.input = r
    this.chunkVisibilityChecker = new ChunkVisibilityChecker(this.webglScene, h.picking, o.pose)
    o.pose.onChanged(() => this.chunkVisibilityChecker.resetCounter())
    this.meshGroupVisuals.floorOpacity.onChanged(() => this.chunkVisibilityChecker.resetCounter())
    this.chunkSharedState = new ChunkSharedState()
    this.chunkSharedState.maxVaryings = n.maxVaryings
    this.textureQualityMap = new TextureQualityMap()
    this.meshTextureLoader = new MeshTextureLoader(
      this.textureQualityMap,
      e.textureLOD,
      i.getApi(),
      this.webglScene.camera,
      n.cwfRenderer,
      l,
      t,
      this.chunkVisibilityChecker,
      n
    )
    this.initRenderMode(e.startingMode, d)
    this.meshTrimInit(this.meshTrimData, h)
    const m = this.meshGroupVisuals.meshTextureOpacity
    this.bindings.push(
      m.onActivate(() => {
        this.meshTrimUpdateRenderMode(0 === m.endValue)
      }),
      m.onComplete(() => {
        this.meshTrimUpdateRenderMode(0 === m.value)
      })
    )
    this.bindings.push(
      this.engine.subscribe(RenderTargetMessage, e => {
        this.meshes.forEach(t => {
          t.renderer.updateExistingTexture(e.sweepId, e.renderTarget.texture)
        })
      })
    )
    this.bindings.push(
      t.commandBinder.addBinding(MeshPreviewPositionCommand, this.setPreviewPosition.bind(this)),
      t.subscribe(WebglRendererContextLostMessage, () => {
        this.meshTextureLoader.onWebGLContextLost()
      }),
      t.subscribe(WebglRendererContextRestoredMessage, () => {
        this.meshTextureLoader.onWebGLContextRestored()
      }),
      t.commandBinder.addBinding(SetMeshOverLayColorCommand, this.onMeshOverlayCommand.bind(this)),
      t.commandBinder.addBinding(ToggleMeshOverlayColorCommand, this.toggleMeshOverlayColor.bind(this)),
      t.commandBinder.addBinding(SetChunkRenderModeCommand, this.onSetChunkRenderStateCommand.bind(this)),
      t.commandBinder.addBinding(SetPanoOverlayCommand, this.onPanoOverlayCommand.bind(this))
    )
    t.broadcast(new SymbolLoadedMessage(ModelMeshSymbol))
    t.broadcast(new SymbolLoadedMessage(StreamingMeshSymbol))
    t.broadcast(new SymbolLoadedMessage(StreamingTextureSymbol))
  }
  onUpdate(e) {
    this.chunkVisibilityChecker && this.chunkVisibilityChecker.update(),
      this.meshTextureLoader && !FlipYConfig.debugPauseTexStream && this.meshTextureLoader.update(e),
      this.meshGroupVisuals.meshTextureOpacity.active &&
        (this.viewmodeData.transition.active
          ? (this.meshGroupVisuals.meshTextureOpacity.updateProgress(this.viewmodeData.transition.progress), this.meshGroupVisuals.meshTextureOpacity.commit())
          : (this.meshGroupVisuals.meshTextureOpacity.tick(e), this.meshGroupVisuals.meshTextureOpacity.commit()))
    const t = performance.now() / 1e3
    this.meshes.forEach(i => {
      for (const e of i.modelMesh.chunks) e.setTime(t)
      i.modelMesh.onUpdate()
    })
  }
  dispose(e) {
    super.dispose(e)
    this.meshTextureLoader.dispose()
    const t = [...this.meshes.values(), ...this.inactiveMeshes.values()]
    const i = e => {
      e.modelMesh.dispose(), e.roomMeshData.floors.clear(), e.roomMeshData.rooms.clear(), this.meshLoadPromises.delete(e.id)
    }
    t.forEach(i)
    this.meshLoadPromises.size > 0 &&
      Promise.all(this.meshLoadPromises.values()).then(e => {
        e.forEach(i)
      })
  }
  async removeMesh(e) {
    const t = this.meshes.get(e) || this.inactiveMeshes.get(e) || (await this.meshLoadPromises.get(e)) || null
    t &&
      (await this.engine.removeComponent(this, t.renderer),
      t.modelMesh.dispose(),
      t.roomMeshData.floors.clear(),
      t.roomMeshData.rooms.clear(),
      t.modelMesh.unregisterCollision(this.input),
      this.meshes.delete(e),
      this.inactiveMeshes.delete(e),
      this.meshLoadPromises.delete(e))
  }
  async isolateMesh(e: ModelObject) {
    this.meshes.forEach(e => {
      this.log.debugWarn("hiding", e)
      this.meshes.delete(e.id)
      this.inactiveMeshes.set(e.id, e)
      e.modelMesh.unregisterCollision(this.input)
      e.renderer.opacity = 0
    })
    const t = this.meshes.get(e.sid) || this.inactiveMeshes.get(e.sid) || (await this.meshLoadPromises.get(e.sid)) || (await this.loadMesh(e, e.sid))
    if (this.inactiveMeshes.has(e.sid)) {
      this.log.debugWarn("showing", t, e)
      this.inactiveMeshes.delete(e.sid)
      await this.engine.addComponent(this, t.renderer)
      this.meshes.set(e.sid, t)
      t.modelMesh.registerCollision(this.input)
      t.renderer.opacity = null
      t.renderer.beforeRender()
      this.onUpdate(0)
    }
    this.inactiveMeshes.forEach(e => {
      this.engine.removeComponent(this, e.renderer)
    })
  }
  async loadMesh(model: ModelObject, t: string) {
    const i = this.meshLoadPromises.get(t)
    if (i) return i
    const s = (async () => {
      this.meshesLoaded++
      const { engine, config, meshTrimUniforms, chunkVisibilityChecker, chunkSharedState } = this
      const renderLayer = engine.claimRenderLayer(this.name)
      const tiled = this.isTiled(model)

      const ModelMeshFactory = await this.getModelMeshFactory(tiled)
      const roomMeshData = new RoomMeshData()
      const modelMesh = await ModelMeshFactory({
        uuid: model.uuid,
        model,
        renderLayer,
        engine,
        settings: FlipYConfig,
        roomMeshData,
        chunkSharedState,
        chunkFactory: (t, i, s, r) => {
          const a = model.key() || "unknown"
          const h = new MeshChunk(t, i, s, chunkSharedState, r, a, !0)
          if (meshTrimUniforms) {
            const e = meshTrimUniforms.getSharedFloorUniforms(t)
            h.setMaterialsUniform(e)
          }
          return h
        },
        chunkVisibilityChecker,
        gltfConfig: config.gltfConfig
      })

      const u = modelMesh.initTextureLoader(this.meshTextureLoader, model.textures)
      const m = await engine.market.waitForData(SweepsData)
      const meshData = this.makeMeshData(modelMesh.chunks, m)
      if (1 === this.meshesLoaded) {
        this.raycasterModule.setupOctree(modelMesh.boundingBox)
        this.market.register(this, RoomMeshData, roomMeshData)
        this.market.register(this, MeshData, meshData)
      }
      this.setupRaycasting(modelMesh, this.input)
      const renderer = new MeshRenderer(this, this.webglScene.scene, modelMesh, modelMesh, meshData, m, chunkSharedState, config)
      await engine.addComponent(this, renderer)
      this.setRenderModeMesh(modelMesh, renderer, this.getRenderMode())
      modelMesh.overrideMaxDetail(this.getMeshDetail())
      await u
      return { id: t, meshData, modelMesh, roomMeshData, renderer, tiled }
    })()
    this.meshLoadPromises.set(t, s)
    const o = await s
    this.meshes.set(t, o)
    1 === this.meshesLoaded && this._firstMeshLoadPromise.resolve()
    // //等待求焦
    // await this.rayFloorMark()
    // //算邻接点
    // await this.getNeighbors()
    return o
  }
  //射线检测相机位底下mark的位置
  async rayFloorMark() {
    const sweepsData = await this.engine.market.waitForData(SweepsData)

    console.log(this.raycasterModule, "获取到的射线检测")
    const { renderer: SweepPuckRender } = await this.engine.getModuleBySymbol(PucksSymbol)!
    console.log(SweepPuckRender, "获取到的mark点模块")

    sweepsData.sweepList.forEach(sweepObject => {
      const origin = new Vector3().copy(sweepObject.position)
      const dir = new Vector3(0, -1, 0)
      const pointInfo = this.raycasterModule.picking.cast(origin, dir)[0]
      const position = pointInfo.point.clone()
      position.y += 0.05
      SweepPuckRender.sweepToMesh[sweepObject.id].position.copy(position)
      sweepObject.floorPosition.copy(position)
    })
  }

  async getNeighbors() {
    console.log("开始计算临界点2")
    const sweepsData = await this.engine.market.waitForData(SweepsData)

    const nearbyIdsMap = {}
    for (const obj of sweepsData.sweepMap) {
      const nearbyIds: number[] = []
      for (const otherObj of sweepsData.sweepMap) {
        if (obj.id !== otherObj.id) {
          const dist = obj.position.distanceTo(otherObj.position)
          //距离
          // const distEnabled = dist <= 10

          // 计算两个点之间的向量
          const vector = obj.position.clone().sub(otherObj.position)
          // 计算水平距离（X和Z坐标的差异）
          const horizontalDistance = Math.sqrt(vector.x * vector.x + vector.z * vector.z)
          // 计算垂直距离（Y坐标的差异）
          const verticalDistance = Math.abs(vector.y)

          //水平距离10m内 垂直距离2m内
          const distEnabled = horizontalDistance <= 10 && verticalDistance <= 2

          //楼层-不考虑
          const floorEnabled = true
          if (distEnabled && floorEnabled) {
            // 10米以内
            //遮挡
            const origin = obj.position.clone()
            const dir = otherObj.position.clone().sub(origin).normalize()
            const pointInfo = this.raycasterModule.picking.cast(origin, dir)[0]
            const modelDistance = pointInfo.distance
            if (dist < modelDistance) {
              //当两点间的距离小于与场景模型碰撞的距离 表示两点之间没有障碍
              nearbyIds.push(otherObj.index)
            }
          }
        }
      }
      nearbyIdsMap[obj.index] = {
        links: nearbyIds
      }
    }

    console.log(nearbyIdsMap, "获取到的临界点")

    // const list = []
    // sweepsData.sweepList.forEach(sweepObject=>{

    //   // const origin  = new Vector3().copy(sweepObject.position)
    //   // const dir = new Vector3(0,-1,0)
    //   // const pointInfo = this.raycasterModule.picking.cast(
    //   //   origin,
    //   //   dir
    //   // )[0]
    //   // const position = pointInfo.point.clone()
    //   // position.y+=0.05
    //   // SweepPuckRender.sweepToMesh[sweepObject.id].position.copy(position)
    //   // sweepObject.floorPosition.copy(position)
    // })
  }

  async getModelMeshFactory(e = !0) {
    // return (e ? await import("../webgl/tiled.mesh") : await import("../webgl/model.mesh")).createModelMesh
    // return (await import("../webgl/model.mesh")).createModelMesh
    return createModelMesh
  }
  setupRaycasting(e: ModelMesh | TiledMesh, t: InputIniModule) {
    e.registerCollision(t)
  }
  setChunkSide(e: Side) {
    const t = this.chunkSharedState.side
    this.chunkSharedState.side = e
    return t
  }
  stats() {
    return { textureCount: this.meshTextureLoader.textureCount, streaming: [...this.meshes.values()].some(e => e.tiled) }
  }
  getRenderMode() {
    return this._renderMode
  }
  setRenderMode(e: RenderMode, t = 0, i = easeInCubic) {
    this.meshes.forEach(s => {
      this.setRenderModeMesh(s.modelMesh, s.renderer, e, t, i)
    })
    this.log.debug(`setRenderMode from ${this._renderMode} to ${e}`)
    this._renderMode = e
  }
  setMeshOptions(e) {
    this.meshes.forEach(t => {
      const s = e.overrideMaxDetail || t.modelMesh.detail
      t.modelMesh.overrideMaxDetail(s)
    })
  }
  getMeshDetail() {
    let e = "default"
    this.meshes.forEach(t => (e = t.modelMesh.detail))
    return e
  }
  setTextureLimits(e: MeshTextureQuality, t: MeshTextureQuality) {
    this.meshes.forEach(i => i.modelMesh.setTextureQuality(this.meshTextureLoader, e, t))
  }
  setTextureStreamMode(e: TextureLOD) {
    switch (e) {
      case TextureLOD.NONE:
        this.meshTextureLoader.autoLoadTiles = !1
        break
      case TextureLOD.RAYCAST:
        this.meshTextureLoader.autoLoadTiles = !0
    }
  }
  setRenderModeMesh(e: ModelMesh | TiledMesh, t: MeshRenderer, i: RenderMode, s = 0, o = easeInCubic) {
    let r = 1
    switch (i) {
      case RenderMode.Hidden:
        r = 1
        e.visible = !1
        break
      case RenderMode.Mesh:
        r = 1
        e.visible = !0
        break
      case RenderMode.PanoramaMesh:
        r = 0
        e.visible = !0
        break
      case RenderMode.PanoramaCube:
        r = 0
        e.visible = !1
        break
      default:
        throw new Error(`unknown mode ${i}!`)
    }
    const n = this.meshGroupVisuals.meshTextureOpacity
    ;(n.value === r && n.easing === o && n.duration === s) || (n.modifyAnimation(n.value, r, s, o), 0 === s && t.beforeRender())
    return r
  }
  initRenderMode(e: ViewModes | null, t: ViewmodeData) {
    let i = e
    null === i && (i = t.transition.active ? t.transition.to : t.currentMode)
    switch (i) {
      case ViewModes.Dollhouse:
      case ViewModes.Floorplan:
      case ViewModes.Mesh:
        this.setRenderMode(RenderMode.Mesh)
        break
      default:
        this.setRenderMode(RenderMode.PanoramaMesh)
    }
    this.bindings.push(
      t.transitionActiveObservable.onChanged(e => {
        if (e) {
          const e = this.viewmodeData.transition.to === ViewModes.Panorama
          const t = this.viewmodeData.transition.from !== ViewModes.Panorama
          const i = e ? RenderMode.PanoramaMesh : RenderMode.Mesh
          const s = t ? 100 : 0
          const o = e ? easeInCubic : easeOutCubic
          this.setRenderMode(i, s, o)
        }
      })
    )
  }
  makeMeshData(e: MeshChunk[], t: SweepsData) {
    const o = new Map<number, MeshChunk[]>(),
      r = new Map<number, MeshChunk[]>(),
      n = new Map<MeshChunk, Vector3>(),
      a = new Box3(),
      l = new Vector3()
    e.forEach(t => {
      t.geometry.boundingBox && a.union(t.geometry.boundingBox)
      if (t.geometry) {
        const i = calculateGeometryCenter(t.geometry)
        n.set(t, i)
        l.addScaledVector(i, 1 / e.length)
      }
      o.set(t.meshGroup, (o.get(t.meshGroup) || []).concat(t))
      r.set(t.meshSubgroup, (r.get(t.meshSubgroup) || []).concat(t))
    })
    const d = a.clone()
    const c = new Box3()
    t.iterate(e => {
      e.isUnplaced() || (c.setFromCenterAndSize(e.position, DirectionVector.UNIT), d.union(c))
    })
    const u = new MeshData([...a.min.toArray(), ...a.max.toArray()], [...d.min.toArray(), ...d.max.toArray()], l)
    for (const [e, t] of o.entries()) {
      const o = new Box3()
      const a = new Vector3()
      t.forEach(e => {
        e.geometry.boundingBox && o.union(e.geometry.boundingBox)
        const i = n.get(e)
        i && a.addScaledVector(i, 1 / t.length)
      })
      u.meshGroups.floors.set(e, { meshGroup: e, boundingBox: o, parentMeshGroup: null, centerOfMass: a })
      const h = [...new Set(t.map(e => e.meshSubgroup))].sort((e, t) => t - e)
      u.meshGroups.roomsByFloor.set(e, h)
      const l = u.meshGroups.rooms
      for (const t of h) {
        const o = new Box3()
        const a = new Vector3()
        const h = r.get(t) || []
        h.forEach(e => {
          e.geometry.boundingBox && o.union(e.geometry.boundingBox)
          const t = n.get(e)
          t && a.addScaledVector(t, 1 / h.length)
        })
        const d = { meshGroup: t, boundingBox: o, parentMeshGroup: e, centerOfMass: a }
        const c = l.get(t)
        c ? (c.parentMeshGroup = Math.min(c.parentMeshGroup || 1 / 0, e)) : l.set(t, d)
      }
      this.meshGroupVisuals.floorOpacity.set(`${e}`, 1)
    }
    const m = [...u.meshGroups.floors.keys()].sort()
    this.meshTrimData.addMeshGroups(m)
    return u
  }
  async setPreviewPosition(e) {
    const t = e.enabled && e.previewCirclePosition ? e.previewCirclePosition : null
    const i = e.size ? e.size : 0.3
    this.meshes.forEach(e => {
      e.modelMesh.chunks.forEach(e => {
        e.setMeshPreviewSphere(t, i)
      })
    })
  }
  isTiled(e: ModelObject) {
    const s = this.engine.tryGetModuleBySymbolSync(SettingsSymbol)?.tryGetProperty(FeaturesTiledMeshKey, !1)
    return !!e.tileset && !!s && !isGooglebot()
  }
  meshTrimInit(e: MeshTrimData, t: RaycasterModule) {
    this.meshTrimUniforms = new MeshTrimUniforms(this.getRenderMode() === RenderMode.PanoramaMesh)
    const { meshTrimsByMeshGroup: i } = e
    this.bindings.push(
      e.onMeshGroupChanged(e => this.meshTrimUpdate(e)),
      e.onMeshTrimChanged(e => {
        this.meshTrimUpdate(e.meshGroup)
      })
    )
    i.keys.forEach(e => {
      this.meshTrimUpdate(+e)
    })
    const s = () => {
      t.setIntersectionFilter(e.meshTrimsById.values.some(e => e.enabled) ? this.meshTrimFilter : null)
    }
    this.bindings.push(e.onMeshTrimChanged(s)), s()
  }
  meshTrimUpdate(e: number) {
    const t = this.meshTrimData.getTrimsForMeshGroup(e)
    this.meshTrimUniforms.updateMeshTrimArrays(e, t),
      this.meshes.forEach(e => {
        e.modelMesh.chunks.forEach(e => {
          e.setMaterialsUniform(this.meshTrimUniforms.getSharedFloorUniforms(e.meshGroup))
        })
      })
  }
}
