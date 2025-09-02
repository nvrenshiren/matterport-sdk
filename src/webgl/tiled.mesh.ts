import {
  Box3,
  Camera,
  CompressedTexture,
  Group,
  LinearEncoding,
  LoadingManager,
  MathUtils,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  Quaternion,
  RGB_ETC2_Format,
  Texture,
  Vector3,
  WebGL1Renderer,
  WebGLRenderer
} from "three"
import { MeshBVH } from "three-mesh-bvh"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader"
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader"
import { ModelMeshBase } from "./modelMeshBase"

import { functionCommon } from "@ruler3d/common"
import { ScheduleTaskCommand } from "../command/schedule.command"
import { MeshChunkLOD } from "../const/21270"
import { ChunkConfig } from "../const/51524"
import * as $ from "../const/53203"
import { FlipYConfig } from "../const/53203"
import { MeshTextureQuality } from "../const/99935"
import { Apiv2Symbol, WebglRendererSymbol } from "../const/symbol.const"
import { CommandBinder } from "../core/commandBinder"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { RenderLayer, RenderLayers } from "../core/layers"
import { HttpPriority } from "../core/request"
import { ISubscription, createSubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { RoomMeshData } from "../data/room.mesh.data"
import { PriorityQueue, TilesRenderer } from "../lib/3d-tiles-renderer"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { MeshProgressBindingMessage } from "../message/mesh.message"
import InputIniModule from "../modules/inputIni.module"
import { ModelObject } from "../modules/modelData.module"
import { ChunkSharedState, ChunkVisibilityChecker, CreateModelMeshParams, MeshTextureLoader } from "../modules/modelMesh.module"
import { UserApiClient } from "../modules/userInfo.module"
import WebglRendererModule from "../modules/webglrender.module"
import { isRoomMesh } from "./26269"
import { parseGeometryAttributes } from "./75730"
import { DepthPassRoomMesh } from "./depthPassRoomMesh"
import { RoomMesh } from "./roomMesh"

const h = new Vector3()
const l = new Matrix4().set(1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1)
const d = l.clone().invert()
function c(e, t) {
  if (!1 !== t(e) && e.children) for (const i of e.children) c(i, t)
}
function u(e, t) {
  const { box: i, boxTransformInverse: s } = (function (e) {
    let t = m.get(e)
    if (!t) {
      const i = e.boundingVolume.box,
        s = new Box3(),
        o = new Matrix4(),
        r = new Vector3(i[3], i[4], i[5]),
        n = new Vector3(i[6], i[7], i[8]),
        h = new Vector3(i[9], i[10], i[11]),
        l = r.length(),
        d = n.length(),
        c = h.length()
      r.normalize(),
        n.normalize(),
        h.normalize(),
        0 === l && r.crossVectors(n, h),
        0 === d && n.crossVectors(r, h),
        0 === c && h.crossVectors(r, n),
        o.set(r.x, n.x, h.x, i[0], r.y, n.y, h.y, i[1], r.z, n.z, h.z, i[2], 0, 0, 0, 1).invert(),
        s.min.set(-l, -d, -c),
        s.max.set(l, d, c),
        (t = { box: s, boxTransformInverse: o }),
        m.set(e, t)
    }
    return t
  })(t)
  return h.copy(e).applyMatrix4(l).applyMatrix4(s), i.containsPoint(h)
}
const m = new WeakMap()
function p(e) {
  for (var t; e; ) {
    const i = null === (t = e.extras) || void 0 === t ? void 0 : t.level
    if ("number" == typeof i) return i
    e = e.parent
  }
  return -1
}
class TextureCache {
  caches: Map<GLTFLoader, Map<string, Promise<Texture>>>
  constructor() {
    this.caches = new Map()
  }
  registerPlugin(e: GLTFLoader, t: string) {
    this.caches.has(e) || this.caches.set(e, new Map())
    const i = this.caches.get(e)
    e["pluginCallbacks"].unshift((e: GLTFParser) => new CrossModelTextureCache(e, t, i))
  }
  unregisterLoader(e) {
    this.caches.delete(e)
  }
  unregisterAllLoaders() {
    this.caches.clear()
  }
}
class CrossModelTextureCache {
  parser: GLTFParser
  modelKey: string
  textureCache: Map<string, Promise<Texture>>
  name: string
  constructor(e, t, i) {
    this.parser = e
    this.modelKey = t
    this.textureCache = i
    this.name = "CrossModelTextureCache"
  }
  key(e) {
    return `${e} @ ${this.modelKey}`
  }
  loadTexture(e: number) {
    const i = this.textureCache
    const s = this.parser
    const o = s.json
    const r = o.textures[e]
    let n = r.source
    Object.keys(r.extensions).forEach(e => (n = n || r.extensions[e].source))
    const a = o.images[n]?.uri
    if (void 0 === a) return null
    const h = i.get(this.key(a))
    if (h) return h
    let l: Promise<Texture> = s["_invokeOne"](t => (t === this ? null : t.loadTexture && t.loadTexture(e)))
    l || (l = s.loadTexture(e))
    const d = l.then(e => {
      const t = () => {
        i.delete(this.key(a))
        e?.removeEventListener("dispose", t)
      }
      e?.addEventListener("dispose", t)
      return e
    })
    i.set(this.key(a), d)
    return d
  }
}

class MTTRMeshBvh {
  parser: GLTFParser
  name: string
  constructor(e: GLTFParser) {
    this.parser = e
    this.name = "MTTR_three_mesh_bvh"
  }
  async loadMesh(e) {
    const t = async (t: RoomMesh, i: number) => {
      const r = this.parser.json.meshes[e].primitives[i]
      if (r.extensions?.MTTR_three_mesh_bvh) {
        const e = r.extensions?.MTTR_three_mesh_bvh
        const i = {
          roots: (await Promise.all(e.roots.map(e => this.parser.loadAccessor(e)))).map(e => {
            const t = e.array
            return t.byteLength !== t.buffer.byteLength ? t.slice().buffer : t.buffer
          }),
          index: new Uint8Array(0)
        }
        t.geometry.boundsTree = MeshBVH.deserialize(i, t.geometry, { setIndex: !1 })
      }
    }
    const i: Promise<void>[] = []
    const s = await this.loadMeshInternal(e)
    if (s) {
      if ("Group" === s.type) {
        const e = s
        i.push(...e.children.map((e: RoomMesh, i) => t(e, i)))
      } else {
        "Mesh" === s.type && i.push(t(s as RoomMesh, 0))
      }
    }

    await Promise.all(i)
    return s
  }
  async loadMeshInternal(e) {
    const t = this.parser
    const i = t
    const s = this.parser.json.meshes[e]
    const o = s.primitives
    const n: Promise<any>[] = []
    for (let e = 0, s = o.length; e < s; e++) {
      const s = void 0 === o[e].material ? t["createDefaultMaterial"](i["cache"]) : t.getDependency("material", o[e].material)
      n.push(s)
    }
    n.push(t.loadGeometries(o))
    return Promise.all(n).then(i => {
      const n = i.slice(0, i.length - 1)
      const h = i[i.length - 1]
      const l: RoomMesh[] = []
      for (let i = 0, a = h.length; i < a; i++) {
        const a = h[i]
        const d = o[i]
        let c: RoomMesh
        const u = n[i]
        if (d.mode !== B.TRIANGLES && void 0 !== d.mode) throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + d.mode)
        c = new RoomMesh(0, 0, RenderLayers.DEFAULT)
        c.geometry = a
        c.material = u
        c.name = t.createUniqueName(s.name || "mesh_" + e)
        F(c, s)
        t.assignFinalMaterial(c)
        l.push(c)
      }
      if (1 === l.length) return l[0]
      const d = new Group()
      for (let e = 0, t = l.length; e < t; e++) d.add(l[e])
      return d
    })
  }
}
const B = {
  FLOAT: 5126,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
}
function F(e, t) {
  void 0 !== t.extras && "object" == typeof t.extras && Object.assign(e.userData, t.extras)
}
class V extends KTX2Loader {
  urlSigner: (e: string) => Promise<string>
  api: UserApiClient
  taskCache: WeakMap<WeakKey, { promise: Promise<CompressedTexture> }>
  constructor(e, t, i) {
    super(i)
    this.urlSigner = e
    this.api = t
    this.taskCache = new WeakMap()
  }
  load(e, t, i, s) {
    const o = new CompressedTexture([], 0, 0, RGB_ETC2_Format)
    this.urlSigner(e)
      .then(async e => {
        const s = await this.api.get(e, { onProgress: i, responseType: "arraybuffer", priority: HttpPriority.MEDIUM })
        let r = this.taskCache.get(s)
        if (!r) {
          r = { promise: this["_createTexture"](s) }
          this.taskCache.set(s, r)
        }
        const n = await r.promise
        o.copy(n)
        o.needsUpdate = !0
        t(o)
      })
      .catch(s)
    return o
  }

  preload() {
    this["init"]()
  }
}
let _: TextureCache
const L = /\gltf$/
const N = /\glb$/
enum PrioritizeBy {
  DEFAULT = "DEFAULT",
  FRUSTUM_ERROR_THRESH = "FRUSTUM_ERROR_THRESH"
}
class DownloadQueue extends PriorityQueue {
  urlSigner: (e: string) => Promise<string>
  api: UserApiClient
  onProgress: Function

  constructor(e, t, i, s) {
    super()
    this.urlSigner = e
    this.api = t
    this.onProgress = s
    this.priorityCallback = i
  }
  add(e, t) {
    return super.add(e, async e => {
      if (e.content?.uri) {
        const i = e.content.uri
        try {
          const r = this.onProgress?.bind(this, e)
          e.content.uri = await this.urlSigner(i)
          if (e.extras?.level === MeshChunkLOD.Min) {
            return t(e).then(e =>
              r
                ? ((e, t) => {
                    if (e.ok && e.body) {
                      const i = e.body.getReader()
                      const s = e.headers.get("Content-Length")
                      let o = s ? +s : 0,
                        r = 0 !== o,
                        n = 0
                      const a = new ReadableStream({
                        async start(e) {
                          for (;;) {
                            const { done: s, value: a } = await i.read()
                            a && ((n += a.byteLength), e.enqueue(a))
                            s && ((o = n), (r = !0))
                            t?.(new ProgressEvent("progress", { lengthComputable: r, loaded: n, total: o }))
                            if (s) {
                              e.close()
                              break
                            }
                          }
                        }
                      })
                      e = new Response(a)
                    }
                    return e
                  })(e, r)
                : e
            )
          }

          {
            const i = window.fetch
            try {
              window.fetch = async (e: string, t) => {
                const i = await this.api.get(e, { responseType: "blob", priority: HttpPriority.MEDIUM, onProgress: r, signal: t?.signal })
                return new Response(i)
              }
              return t(e)
            } finally {
              window.fetch = i
            }
          }
        } finally {
          e.content.uri = i
        }
      }
    })
  }
}
class ParseQueue extends PriorityQueue {
  settings: TiledMesh["settings"]
  prioritizeBy: any
  priorityCallback: (e: any, t: any) => 0 | 1 | -1
  constructor(e) {
    super()
    this.settings = e
    this.prioritizeBy = PrioritizeBy.FRUSTUM_ERROR_THRESH
    this.priorityCallback = (e, t) => {
      switch (this.prioritizeBy) {
        case PrioritizeBy.FRUSTUM_ERROR_THRESH:
          return this.sortBySelectors(e, t, [
            e => Number(e.__inFrustum),
            e => Number(e.__error <= this.settings.errorTarget),
            e => e.__error,
            e => e.__distanceFromCamera
          ])
        default:
          return this.defaultPriorityCallback(e, t)
      }
    }
  }
  sortBySelectors(e, t, i) {
    for (const s of i) {
      const i = this.compareTile(e, t, s)
      if (null !== i) return i
    }
    return 0
  }
  compareTile(e, t, i) {
    const s = i(e),
      o = i(t)
    return s === o ? null : s > o ? 1 : -1
  }
  defaultPriorityCallback(e, t) {
    return e.__depth !== t.__depth
      ? e.__depth > t.__depth
        ? -1
        : 1
      : e.__inFrustum !== t.__inFrustum
        ? e.__inFrustum
          ? 1
          : -1
        : e.__used !== t.__used
          ? e.__used
            ? 1
            : -1
          : e.__error !== t.__error
            ? e.__error > t.__error
              ? 1
              : -1
            : e.__distanceFromCamera !== t.__distanceFromCamera
              ? e.__distanceFromCamera > t.__distanceFromCamera
                ? -1
                : 1
              : 0
  }
}

const W = 3
class TileLoader {
  container: TiledMesh
  threeRenderer: WebGLRenderer | WebGL1Renderer
  chunkFactory: CreateModelMeshParams["chunkFactory"]
  tilesetInfo: ModelObject["tileset"]
  commandBinder: CommandBinder
  api: UserApiClient
  gltfConfig: any
  settings: TiledMesh["settings"]
  name: string
  log: DebugInfo
  loadStats: { startTimes: { start: number; tileset: number; lod0: number }; timings: { tileset: string; lod0: string } }
  lodDeferreds: OpenDeferred[]
  tileProgress: WeakMap<WeakKey, number>
  onChunksLoaded: Set<Function>
  onChunksUnloaded: Set<Function>
  tileSetLoaded: boolean
  minimalLoaded: boolean
  minimalTileCount: number
  signUrl: (e: string) => Promise<string>
  onTileGltfDownloadProgress: (e: any, t: any) => void
  tilesRenderer: TilesRenderer
  adjustScreenSpaceError: any
  onTileActiveChange: any
  onTileVisibleChange: any
  adjustTileInView: any
  onModelLoaded: any
  onModelUnloaded: any
  onTilesetLoaded: any
  checkLoadStatus: Function
  constructor(e, t, i, s, o, r, n, a) {
    this.container = e
    this.threeRenderer = t
    this.chunkFactory = i
    this.tilesetInfo = s
    this.commandBinder = o
    this.api = r
    this.gltfConfig = n
    this.settings = a
    this.name = "MttrTileLoader"
    this.log = new DebugInfo("3d-tiles")
    this.loadStats = { startTimes: { start: 0, tileset: 0, lod0: 0 }, timings: { tileset: "", lod0: "" } }
    this.lodDeferreds = []
    this.tileProgress = new WeakMap()
    this.onChunksLoaded = new Set()
    this.onChunksUnloaded = new Set()
    this.tileSetLoaded = !1
    this.minimalLoaded = !1
    this.minimalTileCount = 0
    this.signUrl = async e => {
      if (e.startsWith("blob")) return e
      return (await this.tilesetInfo.urlTemplate.get()).replace(this.settings.urlTemplateToken, e)
    }
    this.onTileGltfDownloadProgress = (e, t) => {
      this.tileProgress.set(e, t.lengthComputable ? (0.5 * t.loaded) / t.total : 0), this.checkLoadStatus()
    }
    this.checkLoadStatus = (() => {
      const e: any[] = []
      let t = !1,
        i = !1
      return functionCommon.debounce(() => {
        if (!(t && i) && this.tileSetLoaded) {
          if (0 === e.length) {
            e.push([], [])
            this.tilesRenderer.traverse((t, i, s) => {
              const r = t["extras"]?.level
              ;(0 !== r && 1 !== r) || e[r].push(t)
              return !1
            }, null)
          }
          if (!t) {
            t = this.notifyIfFullyLoaded(0, e, !0)
            if (t) {
              this.tilesRenderer.update()
              this.log.debug("LOD0 fully downloaded, allow showing more lods")
              this.minimalLoaded = !0
              this.minimalTileCount = e[0].length
              this.loadStats.timings.lod0 = (performance.now() - this.loadStats.startTimes.lod0).toFixed(1) + "ms"
            }
          }
          if (!i) {
            i = this.notifyIfFullyLoaded(1, e, !1)
            i && (e.length = 0)
          }
        }
      }, 16)
    })()
  }

  async init() {
    this.loadStats.startTimes.start = performance.now()
    const e = await this.signUrl(this.tilesetInfo.rootFilename)
    this.tilesRenderer = new TilesRenderer(e)
    this.tilesRenderer.manager = new LoadingManager()
    const t = (function (e, t, i, s, o, r) {
      const n = new DRACOLoader(t)
      n.setDecoderPath(`${o.dracoDecoderPath}`)
      n.preload()
      const a = new GLTFLoader(t)
      a.setDRACOLoader(n)
      a.register(e => new MTTRMeshBvh(e))
      _ || (_ = new TextureCache())
      _.registerPlugin(a, r)
      const h = new V(i, s, t)
      h.setTranscoderPath(o.basisTranscoderPath)
      h.detectSupport(e)
      h.preload()
      a.setKTX2Loader(h)
      t.removeHandler(L)
      t.addHandler(L, a)
      t.removeHandler(N)
      t.addHandler(N, a)
      return a
    })(this.threeRenderer, this.tilesRenderer.manager, this.signUrl, this.api, this.gltfConfig, e)
    this.configureTilesRenderer(this.tilesRenderer, t)
  }
  setCamera(e: Camera, t: number, i: number) {
    this.tilesRenderer.setCamera(e)
    this.tilesRenderer.setResolution(e, t, i)
  }
  hasCamera(e: Camera) {
    return this.tilesRenderer.hasCamera(e)
  }
  deleteCamera(e: Camera) {
    return this.tilesRenderer.deleteCamera(e)
  }
  notifyOnChunksLoaded(e) {
    return createSubscription(
      () => this.onChunksLoaded.add(e),
      () => this.onChunksLoaded.delete(e),
      !0
    )
  }
  notifyOnChunksUnloaded(e) {
    return createSubscription(
      () => this.onChunksUnloaded.add(e),
      () => this.onChunksUnloaded.delete(e),
      !0
    )
  }
  notifyOnLodProgress(e, t) {
    this.getLodDeferred(e).progress(t)
  }
  awaitLod(e) {
    return this.getLodDeferred(e).nativePromise()
  }
  getLodDeferred(e) {
    return this.lodDeferreds[e] || (this.lodDeferreds[e] = new OpenDeferred())
  }
  update() {
    const { minimalLoaded: e, tilesRenderer: t } = this
    e
      ? ((t.displayActiveTiles = this.settings.displayActiveTiles),
        (t.loadSiblings = this.settings.loadSiblings),
        (t.stopAtEmptyTiles = this.settings.stopAtEmptyTiles),
        (t.autoDisableRendererCulling = this.settings.autoDisableRendererCulling),
        (t.downloadQueue.maxJobs = this.settings.downloadQueueConcurrency),
        (t.parseQueue.maxJobs = this.settings.parseQueueConcurrency))
      : ((t.loadSiblings = !0), (t.downloadQueue.maxJobs = 1 / 0), (t.parseQueue.maxJobs = 1 / 0)),
      (t.optimizeRaycast = this.settings.optimizeRaycast),
      (t.errorTarget = this.settings.errorTarget),
      (t.lruCache.maxSize = e ? Math.max(this.settings.lruMaxTiles, this.minimalTileCount) : 1 / 0),
      t.update(),
      (t.lruCache.minSize = this.settings.lruMinExtraTiles + t.lruCache["usedSet"].size),
      (t.lruCache.unloadPercent = this.settings.lruUnloadPercent)
  }
  getDownloadParseStatus() {
    return this.tilesRenderer["stats"]
  }
  configureTilesRenderer(e: TilesRenderer, t: GLTFLoader) {
    const i = e.calculateError.bind(e)
    e.calculateError = e => {
      i(e), this.adjustScreenSpaceError && (e.__error = this.adjustScreenSpaceError(e.__error, e))
    }
    e.errorTarget = this.settings.errorTarget
    e.loadSiblings = this.settings.loadSiblings
    e.stopAtEmptyTiles = this.settings.stopAtEmptyTiles
    e.displayActiveTiles = this.settings.displayActiveTiles
    const s = e.preprocessNode.bind(e)
    e.preprocessNode = function (e, t, i) {
      return s(e, t, "")
    }
    this.configurePriorityQueues()
    this.container.add(e.group)
    const o = new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), MathUtils.degToRad(90))
    this.container.quaternion.copy(o)
    this.container.updateMatrixWorld(!0)
    e.onLoadTileSet = this.onLoadTileset.bind(this)
    e.onLoadModel = this.onLoadModel.bind(this)
    e.onDisposeModel = this.onDisposeModel.bind(this)
    const r = e.setTileActive.bind(e)
    e.setTileActive = (e, t) => {
      r(e, t)
      this.onTileActiveChange && this.onTileActiveChange(e, t)
    }
    const n = e.setTileVisible.bind(e)
    e.setTileVisible = (e, t) => {
      n(e, t), this.onTileVisibleChange && this.onTileVisibleChange(e, t)
    }
    const h = e.tileInView.bind(e)
    e.tileInView = e => {
      let t = h(e)
      return this.adjustTileInView && (t = this.adjustTileInView(t, e)), t
    }
  }
  configurePriorityQueues() {
    const { tilesRenderer: e } = this
    e.downloadQueue = new DownloadQueue(this.signUrl, this.api, e.downloadQueue.priorityCallback, this.onTileGltfDownloadProgress)
    e.parseQueue = new ParseQueue(this.settings)
    const t = e => {
      this.commandBinder.issueCommand(new ScheduleTaskCommand("mesh/tiled/priorityQueue", e, 100))
    }
    ;(e.parseQueue.schedulingCallback = t), (e.downloadQueue.schedulingCallback = t)
  }
  async onLoadModel(e: Mesh, t) {
    const i = (function (e, t, i) {
      const o = []
      const r = t.extras?.id || "" + e.id
      e.name = r
      e.traverse(s => {
        var n, h
        s.matrixAutoUpdate = !1
        s.updateMatrix()
        if (s instanceof RoomMesh) {
          const l = new DepthPassRoomMesh(s)
          e.add(l)
          const { group: d, subgroup: c, chunkIndex: u } = parseGeometryAttributes(`${r}-${s.name}`)
          const m = s.material
          console.log(m)
          const p = m.map
          let g = p?.name || m.name
          g = g.replace(".jpg", "")
          p && (p.encoding = LinearEncoding)
          const y = i(d, c, s.geometry, g)
          ;(y.textureLODInfo =
            (function (e, t) {
              if (
                t &&
                (null == t ? void 0 : t.maxTextureSize) &&
                (null == t ? void 0 : t.texelSize) &&
                (null == t ? void 0 : t.textureScale) &&
                t.textureScale > 0
              ) {
                const i = t.textureScale
                return {
                  name: e,
                  maxTexelSize: 0.001 * t.texelSize,
                  maxTextureSize: t.maxTextureSize,
                  minTexelSize: (1 / i) * t.texelSize * 0.001,
                  minTextureSize: i * t.maxTextureSize,
                  minScale: i
                }
              }
              return null
            })(g, t.extras) || void 0),
            (y.lod = (null === (h = t.extras) || void 0 === h ? void 0 : h.level) || 0),
            (y.chunkIndex = u),
            y.notifyOnMaterialUpdated(e => {
              s.material = e
            })
          const f = {}
          ;(f.map = p), s.buildWithSingleChunk(y), (s.material = y.setMaterialsUniform(f)), (y.name = s.name), (y.embeddedTexture = f.map), o.push(y)
        }
      })
      e.matrixWorld.copy(e.matrix)
      e.matrixWorld.premultiply(d)
      e.children.forEach(e => e.updateMatrixWorld(!0))
      return o
    })(e, t, this.chunkFactory)
    for (const e of i) this.container.addChunk(e)
    for (const e of this.onChunksLoaded.values()) e(i, t)
    this.onModelLoaded && this.onModelLoaded(e, t), this.tileProgress.set(t, 1), await new Promise(e => setTimeout(e, 0)), this.checkLoadStatus()
  }
  onDisposeModel(e, t) {
    e.traverse(e => {
      if (isRoomMesh(e)) {
        const i = e.chunks
        if (!i) return void this.log.error("Missing chunks from RoomMesh")
        for (const e of i) this.container.removeChunk(e)
        for (const e of this.onChunksUnloaded.values()) e(i, t)
      }
    }),
      this.onModelUnloaded && this.onModelUnloaded(e, t),
      e.traverse(e => {
        isRoomMesh(e) && e.reset()
      })
  }
  onLoadTileset(e, t) {
    var i
    const s = !this.tileSetLoaded
    let o = ""
    s && ((o = (performance.now() - this.loadStats.startTimes.start).toFixed(1)), (this.loadStats.timings.tileset = o + "ms"))
    const r = null === (i = t.match(/[^/]*\.json/)) || void 0 === i ? void 0 : i[0]
    this.log.debug(`Tileset ${r} load${s ? `: ${o}ms` : ""}`, e),
      s && (this.loadStats.startTimes.lod0 = performance.now()),
      (this.tileSetLoaded = !0),
      this.onTilesetLoaded && this.onTilesetLoaded(e, t),
      this.tilesRenderer.update()
  }
  notifyIfFullyLoaded(e, t, i) {
    if (!t[e]) return !1
    const s = t[e],
      o = s.filter(e => e.__loadingState !== W),
      r = this.getLodDeferred(e)
    return i && r.notify(s.reduce((e, t) => e + (this.tileProgress.get(t) || 0) / s.length, 0)), 0 === o.length && r.resolve(), 0 === o.length
  }
}
export class TiledMesh extends ModelMeshBase {
  renderLayer: RenderLayer
  chunkSharedState: ChunkSharedState
  tilesByChunkId: Map<any, any>
  bindings: ISubscription[]
  roomMeshesByTile: Map<any, any>
  activeRoomMeshes: Set<RoomMesh>
  visibleRoomMeshes: Set<RoomMesh>
  activeTiles: Set<unknown>
  tileActiveDescendantCounts: WeakMap<WeakKey, any>
  isActiveRoomMeshFilter: (e: any) => any
  isActiveRoomMeshSnapFilter: (e: any) => boolean
  settings: typeof ChunkConfig
  maxLOD: number
  renderer: WebglRendererModule
  cameraData: CameraData
  tileLoader: TileLoader
  inputIni: InputIniModule
  constructor(e, t = RenderLayers.ALL, i) {
    super()
    this.uuid = e
    this.renderLayer = t
    this.chunkSharedState = i
    this.boundingBox = new Box3()
    this.size = new Vector3()
    this.center = new Vector3()
    this.tilesByChunkId = new Map()
    this.bindings = []
    this.roomMeshesByTile = new Map()
    this.activeRoomMeshes = new Set()
    this.visibleRoomMeshes = new Set()
    this.activeTiles = new Set()
    this.tileActiveDescendantCounts = new WeakMap()
    this.isActiveRoomMeshFilter = e => this.activeRoomMeshes.has(e)
    this.isActiveRoomMeshSnapFilter = e => {
      var t, i, s
      const o = null === (t = e.meta) || void 0 === t ? void 0 : t.tile
      if (o) {
        const { snappingMaxLOD: e } = this.settings,
          t = null !== (s = null === (i = o.extras) || void 0 === i ? void 0 : i.level) && void 0 !== s ? s : 1 / 0
        if ((t === e && (this.tileActiveDescendantCounts.get(o) || 0) > 0) || (t <= e && this.activeTiles.has(o))) return !0
      }
      return !1
    }
    this.settings = Object.assign({}, ChunkConfig)
    this.maxLOD = this.settings.maxLOD
    this.layers.mask = t.mask
    this.overriddenIsTileInView = this.overriddenIsTileInView.bind(this)
  }
  dispose() {
    super.dispose(), this.bindings.forEach(e => e.cancel()), (this.bindings = [])
  }
  async load(
    e: EngineContext,
    t: WebglRendererModule,
    i: PerspectiveCamera,
    s: CameraData,
    o: ModelObject["tileset"],
    r: RoomMeshData,
    a: CreateModelMeshParams["chunkFactory"],
    h: ChunkVisibilityChecker,
    l: UserApiClient,
    c
  ) {
    this.renderer = t
    this.cameraData = s
    r.root = this
    this.maxLOD = this.settings.maxLOD = o.maxLOD
    this.tileLoader = new TileLoader(this, t.threeRenderer, a, o, e.commandBinder, l, c, this.settings)
    await this.tileLoader.init()
    this.tileLoader.setCamera(i, s.width, s.height)
    this.bindings.push(
      e.subscribe(SetCameraDimensionsMessage, e => {
        this.tileLoader.setCamera(i, e.width, e.height)
      })
    )
    this.tileLoader.onModelLoaded = (e, t) => {
      let i = this.roomMeshesByTile.get(t)
      i || ((i = []), this.roomMeshesByTile.set(t, i)),
        e.traverse(e => {
          ;(e.layers.mask = this.renderLayer.mask),
            isRoomMesh(e) && (r.rooms.add(e), i.push(e), this.inputIni && this.registerMeshForCollision(this.inputIni, e, t))
        }),
        r.commit()
    }
    this.tileLoader.onModelUnloaded = (e, t) => {
      e.traverse(e => {
        e instanceof RoomMesh && (r.rooms.delete(e), this.inputIni && this.unregisterMeshFromCollision(this.inputIni, e))
      }),
        r.commit(),
        this.tileLoader.onTileActiveChange(t, !1),
        this.tileLoader.onTileVisibleChange(t, !1),
        this.roomMeshesByTile.delete(t)
    }
    this.tileLoader.onTileActiveChange = (e, t) => {
      var i
      const s = t ? "add" : "delete"
      null === (i = this.roomMeshesByTile.get(e)) ||
        void 0 === i ||
        i.forEach(e => {
          this.activeRoomMeshes[s](e)
        }),
        this.activeTiles[s](e)
      for (let i = e.parent; i; i = i.parent) {
        const e = this.tileActiveDescendantCounts.get(i) || 0
        this.tileActiveDescendantCounts.set(i, e + (t ? 1 : -1))
      }
    }
    this.tileLoader.onTileVisibleChange = (e, t) => {
      var i
      null === (i = this.roomMeshesByTile.get(e)) ||
        void 0 === i ||
        i.forEach(e => {
          this.visibleRoomMeshes[t ? "add" : "delete"](e)
        })
    }
    this.initTileLodAdjustments(this.tileLoader, h)
    this.tileLoader.notifyOnLodProgress(0, t => {
      e.broadcast(new MeshProgressBindingMessage(t, 1))
    })
    this.tileLoader.notifyOnChunksLoaded((e, i) => {
      var s
      0 === (null === (s = i.extras) || void 0 === s ? void 0 : s.level) &&
        e.forEach(e => {
          t.threeRenderer.initTexture(e.embeddedTexture)
        })
    })
    this.tileLoader.update()
    this._detail = "minimal"
    await this.tileLoader.awaitLod(this.settings.initialMaxLOD)
    this._detail = "default"
    this.tileLoader.tilesRenderer.getBounds(this.boundingBox)
    this.boundingBox.applyMatrix4(d)
    this.boundingBox.getSize(this.size)
    this.boundingBox.getCenter(this.center)
    const u = this.size.clone().multiplyScalar(0.5).length()
    const { smallMeshThreshold: m, smallMeshErrorMultiplier: p } = this.settings
    u < m && (this.settings.errorTarget = Math.min(this.settings.errorTarget, u * p))
  }
  initTextureLoader(e, t) {
    e.limitMemoryUsage = this.settings.limitMemoryUsage
    e.setModel(this, this._chunks, t)
    this.bindings.push(
      this.tileLoader.notifyOnChunksLoaded(t => {
        e.addChunkSlots(this, t)
        for (const e of this.onChunksLoaded.values()) e(t)
      }),
      this.tileLoader.notifyOnChunksUnloaded(t => {
        e.removeChunks(t)
      })
    )
    e.allowTextureDownload = () => {
      const { downloading: e, parsing: t } = this.tileLoader.getDownloadParseStatus()
      return 0 === e && 0 === t
    }
    return Promise.resolve()
  }
  initTileLodAdjustments(e, t) {
    e.adjustTileInView = this.overriddenIsTileInView
    const i = this.tilesByChunkId,
      s = new Map()
    let o = 0
    this.bindings.push(
      e.notifyOnChunksLoaded((e, t) => {
        for (const s of e) i.set(s.id, t)
      }),
      t.notifyOnNewSighting((e, t) => {
        o++
        const r = i.get(e.id)
        if (r) {
          for (let e = r.parent; e; e = e.parent) s.set(e, o)
          c(r, e => !(e !== r && !u(t.point, e)) && (s.set(e, o), !0))
        }
      }),
      this.tileLoader.notifyOnChunksUnloaded(e => {
        for (const t of e) i.delete(t.id), t.dispose()
      })
    ),
      (e.adjustScreenSpaceError = (e, t) => {
        var i, r
        if (1 !== this.settings.errorMultiplierRaycastOcclusion) {
          ;(null !== (i = s.get(t)) && void 0 !== i ? i : -1 / 0) < o - FlipYConfig.sightingMaxAge && (e *= this.settings.errorMultiplierRaycastOcclusion)
        }
        if (1 !== this.settings.errorMultiplierHiddenFloors) {
          ;(null === (r = this.roomMeshesByTile.get(t)) || void 0 === r
            ? void 0
            : r.some(e => e.chunks.some(e => e.getOpacity() > $.xx.FADE_TILE_VISIBLE_THRESHOLD))) || (e *= this.settings.errorMultiplierHiddenFloors)
        }
        return p(t) < this.settings.minLOD && (e = Math.max(e, this.settings.errorTarget + 1e-10)), e
      })
  }
  registerCollision(e) {
    ;(this.inputIni = e),
      this.tileLoader.tilesRenderer.forEachLoadedModel((t, i) => {
        t.traverse(t => {
          isRoomMesh(t) && this.registerMeshForCollision(e, t, i)
        })
      })
  }
  unregisterCollision(e) {
    this.tileLoader.tilesRenderer.forEachLoadedModel((t, i) => {
      t.traverse(t => {
        isRoomMesh(t) && this.unregisterMeshFromCollision(e, t)
      })
    })
  }
  addChunk(e) {
    this._chunks.push(e)
  }
  removeChunk(e) {
    const t = this._chunks.indexOf(e)
    this._chunks.splice(t, 1)
  }
  onUpdate() {
    this.settings.disableTileUpdates ||
      (this.tileLoader.tilesRenderer.setResolution(this.renderer.getCamera(), this.cameraData.width, this.cameraData.height),
      this.tileLoader.update(),
      this.checkDispose()),
      this.downgradeIfMemoryConstrained()
  }
  setTextureQuality(e: MeshTextureLoader, t: MeshTextureQuality, i: MeshTextureQuality) {
    e.setQuality(MeshTextureQuality.LOW, i)
  }
  get visibleChunks() {
    const e = this.visibleRoomMeshes
    return {
      *[Symbol.iterator]() {
        for (const t of e) for (const e of t.chunks) yield e
      }
    }
  }
  registerMeshForCollision(e: InputIniModule, t, i) {
    e.registerMesh(t, !0, this.isActiveRoomMeshFilter),
      t.chunks[0].lod <= this.settings.snappingMaxLOD &&
        e.registerSnappingMeshGeometry(t.name, t.geometry, { tile: i, meshGroup: t.meshGroup }, this.isActiveRoomMeshSnapFilter)
  }
  unregisterMeshFromCollision(e, t) {
    e.unregisterMesh(t)
    e.unregisterSnappingMeshGeometry(t.name)
  }
  overriddenIsTileInView(e, t) {
    const i = p(t.parent)
    if ("minimal" === this._detail && -1 === i) return !0
    let s = this.settings.nonMeshMaxLOD
    return "max" === this._detail && (s = this.settings.maxLOD), "minimal" === this._detail && (s = this.settings.initialMaxLOD), !(i >= s) && e
  }
  overrideMaxDetail(e) {
    if (e !== this._detail)
      switch (((this._detail = e), this._detail)) {
        case "minimal":
          this.setMaxLOD(0)
          break
        case "max":
          this.setMaxLOD(null)
          break
        default:
          const e = this.size.length() / 2 < this.settings.smallMeshThreshold
          this.setMaxLOD(e ? this.settings.maxLOD : this.settings.nonMeshMaxLOD)
      }
  }
  setMaxLOD(e) {
    ;(e = null != e ? e : this.maxLOD), (this.settings.maxLOD = e)
  }
  downgradeIfMemoryConstrained() {
    this.renderer.estimatedGPUMemoryAllocated() > 2 ** 20 * (this.settings.limitMemoryUsage ? this.settings.allocatedMegsBeforeLimitingLod : 1 / 0) &&
      this.settings.maxLOD > 0 &&
      this.setMaxLOD(this.settings.maxLOD - 1)
  }
  checkDispose() {
    if (this.settings.disposeModel) {
      const e = this.tileLoader.tilesRenderer,
        t = e
      for (const e of t.cameras) t.deleteCamera(e)
      const i = 0.001,
        s = new OrthographicCamera(-i, i, i, -i, i, 2 * i)
      s.position.set(0, -1e4, 0),
        s.rotation.setFromVector3(new Vector3(0, -1, 0)),
        s.updateMatrix(),
        s.updateMatrixWorld(),
        this.tileLoader.setCamera(s, 100, 100),
        (e.lruCache.minSize = 0),
        (e.lruCache.unloadPercent = 1),
        e.lruCache.markAllUnused(),
        e.update(),
        e.dispose(),
        this.chunkSharedState.dispose(),
        (this.settings.disableTileUpdates = !0)
    }
  }
}
export const createModelMesh = async (params: CreateModelMeshParams) => {
  const { uuid, model, engine, renderLayer, settings, roomMeshData, chunkFactory, chunkVisibilityChecker, chunkSharedState, gltfConfig } = params
  settings.flipDownload = !1
  settings.flipUpload = !1
  const [u, m, p] = await Promise.all([
    engine.getModuleBySymbol(WebglRendererSymbol),
    engine.getModuleBySymbol(Apiv2Symbol),
    engine.market.waitForData(CameraData)
  ])
  const g = new TiledMesh(uuid, renderLayer, chunkSharedState)
  await g.load(engine, u, u.getCamera(), p, model.tileset, roomMeshData, chunkFactory, chunkVisibilityChecker, m.getApi(), gltfConfig)
  return g
}
