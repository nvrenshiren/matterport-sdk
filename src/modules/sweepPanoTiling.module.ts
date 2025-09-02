import { LinearFilter, MathUtils, Matrix4, NormalBlending, Quaternion, Vector3, WebGLCubeRenderTarget } from "three"
import { SymbolLoadedMessage } from "../other/2032"
import { ObjectDescriptor, UsePool } from "../utils/70903"
import { ScheduleTaskCommand } from "../command/schedule.command"
import { SetEavPanoSizeCommand } from "../command/sweep.command"
import { PanoSize, PanoSizeKey, PanoSizeWithKey } from "../const/76609"
import { EngineTickState } from "../const/engineTick.const"
import { PanoTilingSettings, highQualityConfig, tilingPreloadQualityKey } from "../const/quality.const"
import { Apiv2Symbol, MeshQuerySymbol, PanoSymbol, PanoTilesSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { CubeMapPositive } from "../const/webgl.const"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { HttpPriority } from "../core/request"
import { CameraData } from "../data/camera.data"
import { PointerData } from "../data/pointer.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { BaseExceptionError } from "../error/baseException.error"
import { OutOfRangeExceptionError } from "../error/range.error"
import { HandlePuckHoverMessage } from "../message//sweep.message"
import { PixelRatioChangedMessage, WebglRendererContextLostMessage, WebglRendererContextRestoredMessage } from "../message//webgl.message"
import { CameraZoomMessage, SetCameraDimensionsMessage } from "../message/camera.message"
import { RestrictSweepsSetMessage, RestrictedSweepsMessage } from "../message/sweep.message"
import { TileDownloadedMessage } from "../message/title.message"
import { LoadSpinnerMessage } from "../message/ui.message"
import { StartViewmodeChange, ViewModeChangeMessage } from "../message/viewmode.message"
import { RenderTargetMessage } from "../message/webgl.message"
import { SweepObject } from "../object/sweep.object"
import { createObservableValue } from "../observable/observable.value"
import { QualityManager } from "../qualityManager"
import { isMobilePhone } from "../utils/browser.utils"
import { booleanMap } from "../utils/func.utils"
import { diffSweep, enabledSweep, farSweep, nearSquaredSweep } from "../utils/sweep.utils"
import { sweepScoreByDirection, sweepScoreByDistance, sweepScoreByPosition } from "../utils/sweepScore.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { getSweepByIntersection } from "../webgl/20043"
import { DirectionVector } from "../webgl/vector.const"
import MeshQueryModule from "./meshQuery.module"
import { UserApiClient } from "./userInfo.module"
import { CWFRenderer } from "./webglrender.module"
declare global {
  interface SymbolModule {
    [PanoSymbol]: SweepPanoTilingModule
  }
}
const h = {
  0: CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Y,
  1: CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Z,
  2: CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_X,
  3: CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Z,
  4: CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_X,
  5: CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Y
}
const d = (e: number) => {
  if (e < 0 || e > 5) throw new OutOfRangeExceptionError("mapFaceToCubemapFace() -> face must be in the range [0, 5]")
  return h[e]
}
class S<T = any> {
  _value: T
  constructor(e: T) {
    this._value = e
  }
  value() {
    return this._value
  }
  set(e: T) {
    this._value = e
  }
}
class PersistentStorage {
  storage: Record<string, any>
  constructor() {
    this.storage = {}
  }
  get<A extends (...args: any) => any>(e: string, t: A) {
    let i = this.storage[e]
    i || ((i = t()), (this.storage[e] = i))
    return i as ReturnType<A>
  }
  getNumber(e: string) {
    return this.get(e, () => new S(0))
  }
  getString(e: string) {
    return this.get(e, () => new S(""))
  }
  getArray<T = any>(e: string) {
    return this.get(e, () => []) as T[]
  }
  getNumberMap<T = any>(e: string) {
    return this.get(e, () => ({})) as T
  }
  getStringMap<T = any>(e: string) {
    return this.get(e, () => ({})) as T
  }
}
enum DirectionType {
  Center = 0,
  LowerLeft = 4,
  LowerRight = 3,
  UpperLeft = 1,
  UpperRight = 2
}

const A = 512
const F = (e, t, i, o, r, s: DirectionType, n: number, a: Vector3) => {
  const u = e / t,
    h = 2 * (t / e),
    d = h / 2
  let c = 2 * (o / u) - 1 + d,
    p = 2 * ((r = u - 1 - r) / u) - 1 + d
  switch ((s = s || DirectionType.Center)) {
    case DirectionType.UpperLeft:
      ;(c -= d), (p += d), (c += n * h)
      break
    case DirectionType.UpperRight:
      ;(c += d), (p += d), (p -= n * h)
      break
    case DirectionType.LowerRight:
      ;(c += d), (p -= d), (c -= n * h)
      break
    case DirectionType.LowerLeft:
      ;(c -= d), (p -= d), (p += n * h)
      break
    case DirectionType.Center:
  }
  switch (i) {
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_X:
      a.set(-1, p, -c)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_X:
      a.set(1, p, c)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Y:
      a.set(-c, 1, -p)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Y:
      a.set(-c, -1, p)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_POSITIVE_Z:
      a.set(-c, p, 1)
      break
    case CubeMapPositive.GL_TEXTURE_CUBE_MAP_NEGATIVE_Z:
      a.set(c, p, -1)
  }
  a.normalize()
}
const b = (e: PanoSize, t: number) => {
  let i = A
  e < A && (i = e)
  const o = Math.floor(e / i),
    r = o * o
  return Math.floor(t / r)
}
const U = (e: number, t: number, i: Partial<ReturnType<TileDownloader["buildDownloadDescriptor"]>>) => {
  let o = A
  e < A && (o = e)
  const r = b(e, t),
    s = Math.floor(e / o),
    n = t - r * (s * s)
  ;(i.tileX = n % s), (i.tileY = Math.floor(n / s)), (i.face = r), (i.faceTileIndex = n)
}
const x = function (e: PanoSize) {
  if (e <= A) return 6
  const t = Math.floor(e / A)
  return 6 * (t * t)
}
const C = (function () {
  const e = new Matrix4(),
    t = new Quaternion()
  return (i: Quaternion, o: Vector3) => {
    t.copy(i)
    t.invert()
    e.makeRotationFromQuaternion(t)
    o.applyMatrix4(e)
    o.normalize()
  }
})()
const I = (function () {
  const e = new Vector3(),
    t = new Vector3(0, 0, -1),
    i = new Quaternion(),
    o = function (e, t) {
      e.push({ face: t.face, faceTileIndex: t.faceTileIndex, tileX: t.tileX, tileY: t.tileY })
    },
    r = (function () {
      const e = { face: -1, faceTileIndex: -1, tileX: -1, tileY: -1 }
      return (t, i, r) => {
        const s = x(t)
        let n = 0
        for (let a = 0; a < s; a++) U(t, a, e), (i && !i(e)) || (n++, r && o(r, e))
        return n
      }
    })()
  return (o: SweepObject, s: PanoSize, n: Vector3, l, u = !1, h?, d?) => {
    l.length = u ? 0 : l.length
    const c = s < A ? s : A
    if (!h && !d) return r(s, null, l)
    const p = !!d
    ;(h = h || 0), (d = d || h), (d = Math.max(0, Math.min(d, 360))), (h = Math.max(0, Math.min(h, 360))), e.copy(n)
    const g = o.rotation || new Quaternion()
    if ((C(g, e), p)) {
      i.setFromUnitVectors(e, t)
      return r(
        s,
        function (e) {
          return L(s, c, e.face, e.tileX, e.tileY, i, h || 0, d || 0)
        },
        l
      )
    }
    return r(
      s,
      function (t) {
        return M(s, c, t.face, t.tileX, t.tileY, e, h || 0)
      },
      l
    )
  }
})()
const L = (function () {
  const e = new Vector3()
  return (t, i, o, r, s, n, a, l) => {
    const u = Math.tan(0.5 * l * MathUtils.DEG2RAD),
      h = -u,
      c = Math.tan(0.5 * a * MathUtils.DEG2RAD),
      p = -c,
      g = d(o)
    let w = 0,
      f = 0,
      S = 0,
      T = 0,
      m = 0
    for (let o = DirectionType.Center; o <= DirectionType.LowerLeft; o++) {
      if ((F(t, i, g, r, s, o, 0, e), e.applyQuaternion(n), e.z >= -1e-5)) continue
      const a = -1 / e.z,
        l = e.x * a,
        d = e.y * a
      d > u ? w++ : d < h && f++, l > c ? S++ : l < p && T++, m++
    }
    return f !== m && w !== m && S !== m && T !== m
  }
})()
const M = (function () {
  const e = new Vector3(),
    t = new Vector3(0, 1, 0),
    i = new Vector3(1, 0, 0)
  return (o, r, s, n, a, l, u) => {
    const h = d(s)
    if ((i.copy(l).cross(t), F(o, r, h, n, a, DirectionType.Center, 0, e), E(e, l, u))) return !0
    const c = u / 360,
      p = Math.floor(1 / c)
    let g = 0
    for (let t = 0; t < p; t++) {
      for (let t = DirectionType.UpperLeft; t <= DirectionType.LowerLeft; t++) if ((F(o, r, h, n, a, t, g, e), E(e, l, u))) return !0
      g += c
    }
    return !1
  }
})()
const E = (function () {
  const e = new Vector3(),
    t = new Vector3()
  return (i, o, r, s?) => {
    if ((t.copy(i), s)) {
      e.copy(s), e.normalize()
      const o = e.dot(i)
      ;(e.x *= o), (e.y *= o), (e.z *= o), t.sub(e)
    }
    const n = (r / 2) * MathUtils.DEG2RAD,
      a = Math.cos(n)
    return t.dot(o) >= a
  }
})()
enum N {
  PostOrder = 1,
  PreOrder = 0
}
class NodeList {
  tree: TileTree | null
  parent: NodeList | null
  children: NodeList[]
  id: number
  static _id: number
  extra: { tile?: TileDirectory }
  level: number
  constructor(e: TileTree, t: NodeList | null) {
    this.tree = e
    this.parent = t
    this.children = []
    this.id = ++NodeList._id
    this.extra = {}
    this.level = -1
  }
}
NodeList._id = 0
class TileTree {
  levels: number
  tileSize: number
  root: NodeList | null
  allNodes: Array<NodeList | null>
  constructor(e: number, t: number) {
    this.levels = t
    this.tileSize = e
    this.root = null
    this.allNodes = []
    O(this)
  }
  getSizeForLevel(e, t) {
    return Math.pow(2, t) * e
  }
  getSubNode(e, t, i) {
    ;(!t || e < this.tileSize) && (t = 0), (!i || e < this.tileSize) && (i = 0), e < this.tileSize && (e = this.tileSize)
    const o = q(this.tileSize, e)
    return Z(this.root, 0, o, t, i)
  }
  deleteAllNodes() {
    this.depthFirst(
      function (e, t, i, o, r) {
        for (let t = 0; t < e.children.length; t++) {
          const i = e.children[t]
          i && ((i.parent = null), (i.tree = null)), (e.children[t] = null)
        }
        e.children.length = 0
      }.bind(this),
      null,
      N.PostOrder
    )
    for (let e = 0; e < this.allNodes.length; e++) {
      const t = this.allNodes[e]
      t && ((t.parent = null), (t.tree = null)), (this.allNodes[e] = null)
    }
    ;(this.allNodes.length = 0), (this.root = null)
  }
  breadthFirst(e) {
    const t = !!(e = e || {}).nullLevelEnd,
      i = e.maxLevel,
      o = e.minLevel,
      r = e.callback,
      s = e.saveVisited,
      n: NodeList[] = [],
      a = new NodeList(this, null)
    let l = 0
    if (this.root)
      for (n.push(this.root), n.push(a); n.length > 0 && !(i && l > i); ) {
        const e = n.shift()
        if (e)
          if (e === a) (!o || l >= o) && (r && t && r(), s && t && s.push(null)), n.length > 0 && n.push(a), l++
          else {
            if (e.children) for (const t of e.children) t && n.push(t)
            const t = this.getFaceIndexFromNode(e)
            ;(!o || l >= o) && (r && r(e, l, t), s && s.push(e))
          }
      }
  }
  getFaceIndexFromNode(e) {
    if (!e) return -1
    let t = 1,
      i = e,
      o = 0,
      r = 0
    for (;;) {
      const e = i.parent
      if (!e) break
      let s = -1
      for (let t = 0; t < e.children.length; t++) e.children[t] === i && (s = t)
      ;(o = (s % 2) * t + o), (r = Math.floor(s / 2) * t + r), (t *= 2), (i = e)
    }
    return r * t + o
  }
  depthFirst(e, t, i) {
    B(this.root, 0, 0, 0, e, t, i, this.tileSize)
  }
}
const q = function (e: number, t: number) {
  let i = 0
  for (t < e && (t = e); !((t /= 2) < e); ) i++
  return i
}
const B = function (e, t, i, o, r, s, n, a) {
  if (!e) return
  const l = 2 * o + i
  if (((n = n || N.PreOrder) === N.PreOrder && (r && r(e, t, l, i, o), s && s.push(e)), !e.children || 0 === e.children.length)) return
  const u = 2 * o,
    h = 2 * i
  for (let i = 0; i < 2; i++) for (let o = 0; o < 2; o++) B(e.children[2 * o + i], t + 1, h + i, u + o, r, s, n, a)
  n === N.PostOrder && (r && r(e, t, l, i, o), s && s.push(e))
}
const O = (e: TileTree) => {
  e.root = H(e, null, 0)
}
const H = (e: TileTree, t: NodeList | null, i: number) => {
  if (i > e.levels) return null
  const o = new NodeList(e, t)
  ;(o.level = i), e.allNodes.push(o)
  for (let t = 0; t < 4; t++) {
    const r = H(e, o, i + 1)
    r && (o.children[t] = r)
  }
  return o
}
const Z = (e, t, i, o, r) => {
  if (!e) return null
  if (0 === i) return e
  {
    if (!e.children || 0 === e.children.length) return null
    const s = Math.pow(2, i) / 2,
      n = o % s,
      a = r % s,
      l = 2 * Math.floor(r / s) + Math.floor(o / s),
      u = e.children[l]
    return Z(u, t + 1, i - 1, n, a)
  }
}
class PanoTilingError extends BaseExceptionError {
  constructor(e) {
    super(e)
    this.name = "PanoTilingError"
  }
}
enum k {
  Base = 0,
  Remaining = 1
}
interface LODDescriptors {
  uploadCount: number
  uploadAttempts: number
}
class TileUploadQueue {
  tilePrioritizer: TilePrioritizer
  forceQueue: TileDirectory[]
  uploadQueues: Record<string, TileDirectory[]>
  panoLODDescriptors: Record<string, Record<number, LODDescriptors>>
  constructor(e) {
    this.tilePrioritizer = e
    this.forceQueue = []
    this.uploadQueues = {}
    this.panoLODDescriptors = {}
  }
  addToForceQueue(e: TileDirectory) {
    this.forceQueue.push(e)
  }
  addToPanoQueue(e: string, t: TileDirectory) {
    this.getUploadQueueForPano(e).push(t)
  }
  insertSortedIntoPanoQueue(e: TileDirectory, t: SweepObject, i: Vector3) {
    const o = this.getUploadQueueForPano(t.id)
    this.tilePrioritizer.insertSortedPanoTile(o, e, t, i)
  }
  sortQueue(e: SweepObject, t: Vector3) {
    const i = this.getUploadQueueForPano(e.id)
    this.tilePrioritizer.sortTiles(i, e, t)
  }
  getUploadQueueForPano(e: string) {
    let t = this.uploadQueues[e]

    t || ((t = []), (this.uploadQueues[e] = t))
    return t
  }
  hasQueuedTiles() {
    if (this.forceQueue.length > 0) return !0
    for (const e in this.uploadQueues) {
      const t = this.getUploadQueueForSweep(e)
      if (t && t.length > 0) return !0
    }
    return !1
  }
  getUploadQueueForSweep(e: string) {
    let t = this.uploadQueues[e]
    return t || ((t = []), (this.uploadQueues[e] = t)), t
  }
  getTopUploadQueue(e: SweepObject[]) {
    let t: TileDirectory[] | null = null
    for (let i = k.Base; i <= k.Remaining; i++)
      for (const o of e)
        if (((t = this.getUploadQueueForSweep(o.id)), t.length > 0))
          switch (i) {
            case k.Base:
              if (0 === t[0].level) return t
              break
            case k.Remaining:
              return t
          }
    return null
  }
  processNextQueueItem(e: TileDirectory[]) {
    const t = e.shift()
    return t ? ((t.uploadQueued = !1), t) : null
  }
  getNextFromUploadQueue(e: SweepObject[]) {
    if (this.forceQueue.length > 0) return this.processNextQueueItem(this.forceQueue)
    const t = this.getTopUploadQueue(e)
    return t && t.length > 0 ? this.processNextQueueItem(t) : null
  }
  peekNextFromUploadQueue(e: SweepObject[]) {
    if (this.forceQueue.length > 0) return this.forceQueue[0]
    const t = this.getTopUploadQueue(e)
    return t && t.length > 0 ? t[0] : null
  }
  clearAllQueuedUploads() {
    this.clearAllUploadQueues(null, 0)
  }
  clearAllUploadQueues(e: string | null, t = 0) {
    if (e) this.clearUploadQueue(this.getUploadQueueForSweep(e), t), this.clearUploadQueue(this.forceQueue, t, e)
    else {
      for (const e in this.uploadQueues) this.clearUploadQueue(this.getUploadQueueForSweep(e), t)
      this.clearUploadQueue(this.forceQueue, t)
    }
  }
  clearUploadQueue(e: TileDirectory[], t = 0, i?: string) {
    let o = 0
    for (; o < e.length; ) {
      const r = e[o]
      ;(!i || (i && i === r.sweepId)) && r.level >= t ? ((r.uploadQueued = !1), e.splice(o, 1)) : o++
    }
  }
  resetPanoLODDescriptors(e: string) {
    const t = this.getPanoLODDescriptors(e)
    for (const e in t)
      if (t.hasOwnProperty(e)) {
        const i = t[e]
        i.uploadCount = 0
        i.uploadAttempts = 0
      }
  }
  getPanoLODDescriptor(e: string, t: number) {
    const i = this.getPanoLODDescriptors(e)
    let o = i[t]
    if (!o) {
      o = { uploadCount: 0, uploadAttempts: 0 }
      i[t] = o
    }
    return o
  }
  getPanoLODDescriptors(e: string) {
    let t = this.panoLODDescriptors[e]
    return t || ((t = {}), (this.panoLODDescriptors[e] = t)), t
  }
}
const TilesDebugInfo = new DebugInfo("tiles")
const W = highQualityConfig.uploadIntervalDelay
interface TileDirectory {
  _tileKey?: number
  downloaded: boolean
  uploaded: boolean
  uploadAttempted: boolean
  zoomUploaded: boolean
  uploadQueued: boolean
  image: any
  panoSize: number
  tileX: number
  tileY: number
  totalTiles: number
  tileIndex: number
  faceTileIndex: number
  face: number
  cubeFace: number
  sweepId: string
  tileSize: number
  direction: Vector3
  node: null | NodeList
  level: number
}
export class PanoRenderer {
  cwfRenderer: CWFRenderer
  panoQualityManager: QualityManager
  tileDownloader: TileDownloader
  tilePrioritizer: TilePrioritizer
  sweepData: SweepsData
  cameraData: CameraData
  tilingSettings: PanoTilingSettings
  persistentStorage: PersistentStorage
  activeSweeps: SweepObject[]
  sweepLoadHistory: Array<string | null>
  activeRenderTargetDescriptors: Record<string, ObjectDescriptor<WebGLCubeRenderTarget> | null>
  panoLoadMinimumCallbacks: Record<string, Function>
  panoLoadPromises: Record<string, Promise<void>>
  panoLoadResolvers: Record<string, (value: void | PromiseLike<void>) => void>
  tileDirectory: Record<string, Record<number, TileDirectory>>
  tileTrees: Record<string, TileTree[] | null>
  zoomSweepRenderingDisabled: boolean
  zoomingActive: boolean
  zoomSweepId: null | string
  usingTileOverlay: boolean
  overlayTilesLoaded: boolean
  overlayTilesBasic: {}
  overlayTilesEnhanced: {}
  currentState: { direction: Vector3; position: Vector3; rotation: Quaternion; sweepId?: string }
  textureUsageCounter: Record<string, number>
  tileUploadQueue: TileUploadQueue
  renderTargetPool: UsePool<WebGLCubeRenderTarget>
  engine: EngineContext
  zoomRenderTarget: WebGLCubeRenderTarget
  currentUploadPromise: any
  constructor(e, t, i, o, r, s, n) {
    this.cwfRenderer = e
    this.panoQualityManager = t
    this.tileDownloader = i
    this.tilePrioritizer = o
    this.sweepData = r
    this.cameraData = s
    this.tilingSettings = n
    this.persistentStorage = new PersistentStorage()
    this.activeSweeps = []
    this.sweepLoadHistory = []
    this.activeRenderTargetDescriptors = {}
    this.panoLoadMinimumCallbacks = {}
    this.panoLoadPromises = {}
    this.panoLoadResolvers = {}
    this.tileDirectory = {}
    this.tileTrees = {}
    this.zoomSweepRenderingDisabled = !1
    this.zoomingActive = !1
    this.zoomSweepId = null
    this.usingTileOverlay = !1
    this.overlayTilesLoaded = !1
    this.overlayTilesBasic = {}
    this.overlayTilesEnhanced = {}
    this.currentState = { direction: new Vector3(), position: new Vector3(), rotation: new Quaternion(), sweepId: void 0 }
    this.textureUsageCounter = {}
    this.tileUploadQueue = new TileUploadQueue(this.tilePrioritizer)
    this.renderTargetPool = new UsePool((e, t) => e.object.height === t.size && e.object.width === t.size)
    this.onTileDownLoaded = this.onTileDownLoaded.bind(this)
  }
  render() {}
  deactivate() {}
  dispose() {}
  activate(e: EngineContext) {
    this.engine = e
  }
  getActivePanos() {
    const e: string[] = []
    for (const t of Object.keys(this.activeRenderTargetDescriptors)) {
      this.activeRenderTargetDescriptors[t] && e.push(t)
    }
    return e
  }
  init() {
    this.loadOverlayTiles()
  }
  _activateSweep(e: string) {
    this.textureUsageCounter[e] || (this.textureUsageCounter[e] = 0)
  }
  _useTexture(e: string) {
    this.textureUsageCounter[e]++
  }
  _freeTexture(e: string) {
    this.textureUsageCounter[e] > 0 && this.textureUsageCounter[e]--
  }
  _setTextureUsage(e: string, t: number) {
    this.textureUsageCounter[e] = t
  }
  _freeUnusedTextures() {
    for (const e of Object.keys(this.textureUsageCounter)) 0 === this.textureUsageCounter[e] && this.freeTexture(e)
  }
  highResRenderTarget(e: boolean, t?: string) {
    if (e) {
      if (!t) throw new PanoTilingError("Cannot activate zooming without sweepId!")
      this.zoomingActive = !0
      this.zoomSweepId = t
      this.copyTargetToZoom(t)
    } else (this.zoomingActive = !1), (this.zoomSweepId = null)
    if (t) {
      const e = this.getRenderTargetDescriptorForSweep(t)
      if (!e) throw new PanoTilingError("Zooming at a null render target!")
      const i = this.zoomingActive ? this.zoomRenderTarget : e.object,
        o = i.width
      this.engine.broadcast(new RenderTargetMessage(o, t, i))
    }
  }
  getCurrentPanoResolution() {
    const e = this.zoomingActive ? this.panoQualityManager.getZoomPanoSize() : this.panoQualityManager.getNavPanoSize()
    return QualityManager.getPanoSizeClass(e)
  }
  beforeRender() {
    this.currentState.position.copy(this.cameraData.pose.position)
    this.currentState.rotation.copy(this.cameraData.pose.rotation)
    this.currentState.direction.copy(DirectionVector.FORWARD).applyQuaternion(this.cameraData.pose.rotation)
    if (this.tileUploadQueue.hasQueuedTiles()) for (const e of this.activeSweeps) this.tileUploadQueue.sortQueue(e, this.currentState.direction)
    const e = this.sweepData.transition.to
    const t = this.sweepData.currentSweep
    const i = e || t || this.currentState.sweepId
    i && (this.currentState.sweepId = i)
    const o = i ? this.sweepData.getSweep(i) : null
    o && this.tilePrioritizer.updateCriteria(o, this.currentState.position, this.currentState.direction, this.currentState.rotation)
    this.updateUploadQueueProcessing()
  }
  activateSweep(e: string, t = !0) {
    this._activateSweep(e)
    const i = this.sweepData.getSweep(e)
    if (!i) throw (TilesDebugInfo.error(e, i), new PanoTilingError("Invalid sweepId passed to TiledPanoRenderer.activate()"))
    let o: Promise<void> = this.panoLoadPromises[e]
    if (!o) {
      const r = (() => {
        const i = this.engine
        let o: number
        t &&
          (o = window.setTimeout(() => {
            i.broadcast(new LoadSpinnerMessage(!0))
          }, highQualityConfig.loadIndicatorDelay))
        this._useTexture(e)
        return () => {
          clearTimeout(o)
          i.broadcast(new LoadSpinnerMessage(!1))
          this._freeTexture(e)
        }
      })()
      t && (this.panoLoadMinimumCallbacks[e] = r)
      o = new Promise((t, o) => {
        this.panoLoadResolvers[e] = t
        this.activatePano(i)
        this.queueUploadForAllTiles(e)
        //pw
        this.tileDownloader.forceQueueTiles(i, PanoSize.BASE, this.currentState.direction, !0)
      })
      this.panoLoadPromises[e] = o
    }
    return o
  }
  useTexture(e: string) {
    const t = this.getRenderTargetDescriptorForSweep(e)
    if (!t) throw (TilesDebugInfo.error(e), new PanoTilingError("Texture for sweep not activated before using"))
    const i = t.object.texture
    this._useTexture(e)
    this._freeUnusedTextures()
    return this.zoomingActive ? this.zoomRenderTarget.texture : i
  }
  freeTexture(e: string) {
    this._freeTexture(e)
    0 === this.textureUsageCounter[e] && this.deactivatePano(e)
  }
  freeAllTextures(e: string[] = []) {
    const t = booleanMap(e)
    const i = this.getActivePanos()
    for (const e of i) t[e] || this.freeTexture(e)
  }
  enableUltraHighQualityMode(e: string) {
    this.setupZoomRenderTarget()
    this.zoomSweepId && this.engine.broadcast(new RenderTargetMessage(this.zoomRenderTarget.width, this.zoomSweepId, this.zoomRenderTarget))
  }
  resetRenderStatus(e: string, t: boolean, i: boolean, o: PanoSize) {
    let r: undefined | number
    o && (r = q(A, o) + 1)
    const s = (e, o, r, s) => {
      i && (o.extra.tile.zoomUploaded = !1)
      t && (o.extra.tile.uploaded = !1)
    }
    for (let t = 0; t < 6; t++) {
      this.getTileTree(e, t).breadthFirst({ callback: s.bind(this, t), minLevel: r })
    }
  }
  copyBaseRenderStatusToZoomed(e: string) {
    const t = q(A, this.panoQualityManager.getNavPanoSize())
    const i = (e, t, i, o) => {
      t.extra.tile.zoomUploaded = t.extra.tile.uploaded
      t.extra.zoomCovered = t.extra.covered
    }
    for (let o = 0; o < 6; o++) {
      this.getTileTree(e, o).breadthFirst({ callback: i.bind(this, o), maxLevel: t })
    }
  }
  renderPanoTiles(e: string, t: Vector3 | null, i: boolean, o: boolean) {
    const r: NodeList[] = []
    if (this.zoomRenderTarget?.width !== this.panoQualityManager.getZoomPanoSize() && !this.zoomSweepRenderingDisabled) {
      this.setupZoomRenderTarget()
    }
    t = t || this.currentState.direction || DirectionVector.FORWARD
    const s = this.getRenderTargetDescriptorForSweep(e)
    if (!this.isRenderTargetDescriptorValid(s)) throw new PanoTilingError("PanoRenderer.renderPanoTiles() -> Cannot render to a pano that is not activated.")
    for (let t = 0; t < 6; t++) {
      const s = this.getTileTree(e, t)
      r.length = 0
      s.breadthFirst({ saveVisited: r })
      for (let e = 0; e < r.length; e++) {
        const t = r[e]
        this.queueUploadForTile(t.extra.tile!, !1, o || (0 === e && i))
      }
    }
  }
  renderAllActivePanos() {
    for (const e of this.getActivePanos()) {
      this.resetUploadState(e, !0, !0)
      this.clearAllQueuedUploadsForPano(e)
      this.renderPanoTiles(e, null, !0, !0)
    }
  }
  clearAllQueuedUploads() {
    this.tileUploadQueue.clearAllUploadQueues(null, 0)
  }
  clearAllQueuedUploadsForPano(e: string) {
    this.tileUploadQueue.clearAllUploadQueues(e, 0)
  }
  activatePano(e: SweepObject) {
    this.tileUploadQueue.clearAllQueuedUploads()
    const t = e.availableResolution(PanoSizeKey.ULTRAHIGH)
    const i = PanoSizeWithKey[t]
    const o = e.id
    for (let t = 0; t < 6; t++) {
      let r = this.tileTrees[o]
      r || ((r = []), (this.tileTrees[o] = r))
      let s = r[t]
      if (!s) {
        const o = q(A, i)
        s = new TileTree(A, o)
        r[t] = s
        s.breadthFirst({
          callback: (i: NodeList, o, r) => {
            const s = this.getTileDirectoryEntry(e.id, t, o, r)
            i.extra.tile = s
            s.node = i
          }
        })
      }
    }
    let r: ObjectDescriptor<WebGLCubeRenderTarget> | null = this.getRenderTargetDescriptorForSweep(e.id)
    if (!r) {
      const t = this.panoQualityManager.getNavPanoSize()
      r = this.renderTargetPool.get({ size: t })
      if (!r) {
        const e = this.cwfRenderer.initRenderTargetCube(t)
        r = this.renderTargetPool.add(e)
        r.extra = {}
        r.extra.size = e.width
      }
      r!.extra!.sweep = e
      r!.extra!.sweepindex = e.index
      this.activeRenderTargetDescriptors[e.id] = r
      this.tileUploadQueue.resetPanoLODDescriptors(e.id)
      this.resetUploadState(e.id, !0, !0)
    }
    this.updateActiveSweeps(e)
    return r.object
  }
  deactivatePano(e: string) {
    const t = this.getRenderTargetDescriptorForSweep(e)
    if (t && this.isRenderTargetDescriptorValid(t)) {
      this.renderTargetPool.free(t.object)
      this.activeRenderTargetDescriptors[e] = null
      this.updateActiveSweeps()
      this.tileUploadQueue.clearAllUploadQueues(e)
      this.tileUploadQueue.resetPanoLODDescriptors(e)
      this.clearCachedTileData()
      delete this.panoLoadPromises[e]
    }
  }
  clearCachedTileData() {
    for (let e = this.sweepLoadHistory.length - 1; e >= 0; e--) {
      let t = !1
      const i = this.sweepLoadHistory[e]
      if (i) {
        for (const e of this.activeSweeps) {
          if (i === e.id) {
            t = !0
            break
          }
        }
        if (!t) {
          this.checkTileTreeInitialized(i) && (this.clearTileState(i, !0, !0), this.deleteTileTrees(i))
          this.deleteTileDirectoryEntries(i)
          this.tileDownloader.deleteAllTileDownloadDescriptors(i)
          this.sweepLoadHistory[e] = null
        }
      }
    }
    this.updateSweepLoadHistory()
  }
  updateActiveSweeps(e?: SweepObject) {
    const t = this.persistentStorage.getArray<SweepObject>("updateActiveSweeps:tempSweeps")
    t.length = 0
    for (const i of this.activeSweeps) {
      const o = this.getRenderTargetDescriptorForSweep(i.id)
      ;(e && i.id === e.id) || !this.isRenderTargetDescriptorValid(o) || t.push(i)
    }
    e && t.unshift(e)
    this.activeSweeps.length = 0
    this.activeSweeps.push(...t)
  }
  queueUploadForAllTiles(e: string) {
    if (this.zoomRenderTarget?.width !== this.panoQualityManager.getZoomPanoSize() && !this.zoomSweepRenderingDisabled) {
      this.setupZoomRenderTarget()
    }
    const t = this.getRenderTargetDescriptorForSweep(e)
    if (!this.isRenderTargetDescriptorValid(t)) throw new PanoTilingError("queueUploadForAllTiles() -> Cannot render to a pano that is not activated.")
    const i = this.persistentStorage.getArray("queueUploadForAllTiles:nodeList")
    for (let t = 0; t < 6; t++) {
      const o = this.getTileTree(e, t)

      i.length = 0

      o.breadthFirst({ saveVisited: i })
      for (const e of i) this.queueUploadForTile(e.extra.tile, !1, 0 === e.level)
    }
  }
  onTileDownLoaded(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>) {
    if (!e.sweep) return
    const t = q(A, e.panoSize)
    const i = this.getTileDirectoryEntry(e.sweep.id, e.face, t, e.faceTileIndex)
    this.updateUploadDescriptorFromDownloadDescriptor(i, e), this.updateSweepLoadHistory(i.sweepId)
    const o = this.getRenderTargetDescriptorForSweep(i.sweepId)
    if (this.isRenderTargetDescriptorValid(o)) {
      const e = this.getTileTree(i.sweepId, i.face).getSubNode(i.panoSize, i.tileX, i.tileY)
      e && ((e.extra.tile = i), (i.node = e), this.queueUploadForTile(i, !0))
    }
  }
  updateUploadDescriptorFromDownloadDescriptor(e: TileDirectory, t: ReturnType<TileDownloader["buildDownloadDescriptor"]>) {
    e.downloaded = !0
    e.image = t.image
    e.panoSize = t.panoSize
    e.tileX = t.tileX
    e.tileY = t.tileY
    e.totalTiles = t.totalTiles
    e.tileIndex = t.tileIndex
    e.faceTileIndex = t.faceTileIndex
    e.face = t.face
    e.cubeFace = d(t.face)
    t.sweep && (e.sweepId = t.sweep.id)
    e.tileSize = t.tileSize
    e.direction.copy(t.direction)
    e.node = null
    e.level = q(A, e.panoSize)
  }
  updateSweepLoadHistory(e?: string) {
    const t = this.persistentStorage.getArray("updateSweepLoadHistory:tempHistory")
    t.length = 0
    for (const i of this.sweepLoadHistory) i && (!e || (e && e !== i)) && t.push(i)
    this.sweepLoadHistory.length = 0
    e && this.sweepLoadHistory.push(e)
    this.sweepLoadHistory.push(...t)
  }
  onPanoRendered(e, t) {
    var i, o
    const r = this.panoLoadResolvers[e],
      s = this.activeRenderTargetDescriptors[e]
    s && s.object && (null === (o = (i = this.panoLoadMinimumCallbacks)[e]) || void 0 === o || o.call(i), delete this.panoLoadMinimumCallbacks[e], r()),
      this.clearTileState(e, !1, !0)
  }
  getRenderTargetDescriptorForSweep(e: string) {
    return this.activeRenderTargetDescriptors[e]
  }
  isRenderTargetDescriptorValid(e: ObjectDescriptor<WebGLCubeRenderTarget> | null) {
    return !!e && !!e.object
  }
  isSweepZoomed(e) {
    return this.zoomingActive && this.zoomSweepId === e
  }
  getTileTrees(e: string) {
    const t = this.tileTrees[e]

    if (!t) throw new PanoTilingError("TiledPanoRenderer.getTileTrees() -> Tree array not yet initialized!")
    return t
  }
  checkTileTreeInitialized(e) {
    return !!this.tileTrees[e]
  }
  getTileTree(e: string, t: number) {
    const i = this.getTileTrees(e)[t]
    if (!i) throw new PanoTilingError("TiledPanoRenderer.getTileTree() -> Tree not yet initialized!")
    return i
  }
  deleteTileTrees(e: string) {
    const t = this.getTileTrees(e)
    for (let e = 0; e < 6; e++) {
      const i = t[e]
      i && i.deleteAllNodes()
    }
    this.tileTrees[e] = null
    delete this.tileTrees[e]
  }
  clearTileState(e: string, t = !1, i = !1) {
    const o = (e, o: NodeList, r, s) => {
      if (i) {
        o.extra.tile!.image?.close?.call(o.extra.tile!.image)
        o.extra.tile!.image = null
      }
      t && ((o.extra.tile!.uploaded = !1), (o.extra.tile!.downloaded = !1), (o.extra.tile!.zoomUploaded = !1), (o.extra.tile!.uploadAttempted = !1))
    }
    for (let t = 0; t < 6; t++) {
      const i = this.getTileTree(e, t)
      i && i.breadthFirst({ callback: o.bind(this, t), maxLevel: q(A, this.panoQualityManager.getZoomPanoSize()) })
    }
  }
  resetUploadState(e: string, t: boolean, i: boolean) {
    const o = (e, o: NodeList, r, s) => {
      o.extra.tile!.zoomUploaded = !i && o.extra.tile!.zoomUploaded
      o.extra.tile!.uploaded = !t && o.extra.tile!.uploaded
    }
    for (let t = 0; t < 6; t++) {
      this.getTileTree(e, t).breadthFirst({ callback: o.bind(this, t), minLevel: 0 })
    }
  }
  anyUploaded(e: NodeList | null) {
    if (!e) return !1
    if (e.extra.tile && this.isTileUploaded(e.extra.tile)) return !0
    if (e.children) for (const t of e.children) if (this.anyUploaded(t)) return !0
    return !1
  }
  getTileDirectoryEntry(e: string, t: number, i: number, o: number) {
    let r = this.tileDirectory[e]
    r || ((r = {}), (this.tileDirectory[e] = r))
    const s = 16384 * t + 1024 * i + o
    let n = r[s]
    if (!n) {
      n = {
        downloaded: !1,
        uploaded: !1,
        uploadAttempted: !1,
        zoomUploaded: !1,
        uploadQueued: !1,
        image: null,
        panoSize: -1,
        tileX: -1,
        tileY: -1,
        totalTiles: -1,
        tileIndex: o,
        faceTileIndex: -1,
        face: t,
        cubeFace: -1,
        sweepId: e,
        tileSize: -1,
        direction: new Vector3(),
        node: null,
        level: i
      }
      r[s] = n
    }
    n._tileKey = s
    return n
  }
  deleteTileDirectoryEntries(e: string) {
    const o = this.tileDirectory[e]
    if (o) {
      for (const e of Object.values(o)) {
        if (e.image) {
          e.image.close?.call(e.image)
          e.image = null
        }
      }
    }
    delete this.tileDirectory[e]
  }
  isTileUploaded(e: TileDirectory) {
    return this.isSweepZoomed(e.sweepId) ? e.zoomUploaded : e.uploaded
  }
  setUploaded(e: TileDirectory, t: boolean) {
    this.isSweepZoomed(e.sweepId) ? (e.zoomUploaded = t) : (e.uploaded = t)
  }
  queueUploadForTile(e: TileDirectory, t: boolean, i?: boolean) {
    const o =
      !e.downloaded || (e.uploadQueued && !i) || this.isTileUploaded(e) || (e.panoSize > this.panoQualityManager.getNavPanoSize() && !this.zoomingActive)
    const r = this.getRenderTargetDescriptorForSweep(e.sweepId)

    if (!o && r && this.isRenderTargetDescriptorValid(r)) {
      if (i) {
        this.uploadTile(e)
      } else {
        0 === q(A, e.panoSize)
          ? this.tileUploadQueue.addToForceQueue(e)
          : t && this.currentState.direction
            ? this.tileUploadQueue.insertSortedIntoPanoQueue(e, r.extra!.sweep!, this.currentState.direction)
            : this.tileUploadQueue.addToPanoQueue(e.sweepId, e)
        e.uploadQueued = !0
      }
    }
  }
  uploadTile(e: TileDirectory) {
    const t = this.persistentStorage.get("uploadTile:tempTileTexture", () => ({})),
      i = this.tileUploadQueue.getPanoLODDescriptor(e.sweepId, e.panoSize),
      o = this.getRenderTargetDescriptorForSweep(e.sweepId)
    if (!o || !e.image || !this.isRenderTargetDescriptorValid(o)) return
    let r = o.object,
      n = o.extra!.size!
    if (
      (this.isSweepZoomed(e.sweepId) && ((r = this.zoomRenderTarget), (n = this.panoQualityManager.getZoomPanoSize())),
      this.isTileUploaded(e) || this.anyUploaded(e.node))
    )
      this.setUploaded(e, !1)
    else {
      const o = e.tileX * e.tileSize,
        l = e.tileY * e.tileSize,
        u = (e.tileSize / e.panoSize) * n,
        h = (o / e.panoSize) * n,
        d = (l / e.panoSize) * n
      let c = t[e.tileSize]
      if (
        (t[e.tileSize] ||
          ((c = this.cwfRenderer.initSizedTexture2D(e.tileSize, { generateMipmaps: !1, minFilter: LinearFilter, flipY: !1 })), (t[e.tileSize] = c)),
        this.cwfRenderer.uploadTexture2D(e.image, c, 0, 0),
        this.cwfRenderer.renderToCubeMap(c, r, e.tileSize, e.tileSize, 0, 0, e.tileSize, e.tileSize, h, d, u, u, e.cubeFace),
        highQualityConfig.overlayStyle > 0)
      ) {
        const t = 1 === highQualityConfig.overlayStyle ? this.overlayTilesBasic : this.overlayTilesEnhanced
        this.cwfRenderer.renderToCubeMap(
          t[e.panoSize],
          r,
          e.tileSize,
          e.tileSize,
          0,
          0,
          e.tileSize,
          e.tileSize,
          h,
          d,
          u,
          u,
          e.cubeFace,
          NormalBlending,
          !0,
          0.5
        )
      }
      i.uploadCount++, this.setUploaded(e, !0)
    }
    e.uploadAttempted || i.uploadAttempts++
    e.uploadAttempted = !0
    i.uploadAttempts === e.totalTiles && this.onPanoRendered(e.sweepId, e.panoSize)
  }
  updateUploadQueueProcessing() {
    if (!this.currentUploadPromise && (this.overlayTilesLoaded || !this.usingTileOverlay)) {
      const e = new ScheduleTaskCommand(
        "pano/tiling/upload",
        () =>
          this.engine
            .after(EngineTickState.End)
            .then(() => this.processUploadQueue(this.tilingSettings.highResUploadsPerFrame, this.tilingSettings.uploadsPerFrame)),
        W
      )
      this.currentUploadPromise = this.engine.commandBinder.issueCommand(e).then(async e => {
        await e.promise, (this.currentUploadPromise = null)
      })
    }
  }
  processUploadQueue(e = 1, t: number) {
    let i = 0,
      o = 0,
      r: TileDirectory | null = null
    for (; (r = this.tileUploadQueue.getNextFromUploadQueue(this.activeSweeps)); ) {
      const s = this.getRenderTargetDescriptorForSweep(r.sweepId)
      if (
        !((r.panoSize > this.panoQualityManager.getNavPanoSize() && !this.zoomingActive) || !this.isRenderTargetDescriptorValid(s)) &&
        (this.uploadTile(r), (i += 0 !== r.level ? 1 : 0), (o += 0 === r.level ? 1 : 0), o >= t || i >= e)
      )
        break
    }
  }
  loadOverlayTiles() {
    if (0 !== highQualityConfig.overlayStyle) {
      let e = 0
      const t: Array<[string, any, number]> = []
      const o = (i, o, r: HTMLImageElement) => {
        const s = (i[o] = this.cwfRenderer.initSizedTexture2D(A, { generateMipmaps: !1, minFilter: LinearFilter, flipY: !1 }))
        this.cwfRenderer.uploadTexture2D(r, s, 0, 0)
        e++
        e >= t.length && (this.overlayTilesLoaded = !0)
      }
      switch (highQualityConfig.overlayStyle) {
        case 1:
          t.push(["/images/outlineBasic512.png", this.overlayTilesBasic, 256])
          t.push(["/images/outlineBasic512.png", this.overlayTilesBasic, 512])
          t.push(["/images/outlineBasic1024.png", this.overlayTilesBasic, 1024])
          t.push(["/images/outlineBasic2048.png", this.overlayTilesBasic, 2048])
          t.push(["/images/outlineBasic4096.png", this.overlayTilesBasic, 4096])
          break
        case 2:
          t.push(["/images/outlineEnhanced512.png", this.overlayTilesEnhanced, 256])
          t.push(["/images/outlineEnhanced512.png", this.overlayTilesEnhanced, 512])
          t.push(["/images/outlineEnhanced1024.png", this.overlayTilesEnhanced, 1024])
          t.push(["/images/outlineEnhanced2048.png", this.overlayTilesEnhanced, 2048])
          t.push(["/images/outlineEnhanced4096.png", this.overlayTilesEnhanced, 4096])
      }
      t.forEach(e => {
        const t = document.createElement("img")
        t.crossOrigin = "anonymous"
        t.src = e[0]
        t.onload = () => {
          o.call(this, e[1], e[2], t)
        }
      })
      this.usingTileOverlay = !0
    } else this.usingTileOverlay = !1
  }
  copyTargetToZoom(e: string) {
    if (!this.zoomingActive) return
    const t = this.getRenderTargetDescriptorForSweep(e)
    if (!t) throw new PanoTilingError("Error in copying a null render target to a zoomed target")
    const i = t.object
    this.cwfRenderer.copyCubemap(i.texture, this.zoomRenderTarget)
    this.copyBaseRenderStatusToZoomed(e)
  }
  setupZoomRenderTarget() {
    if (this.panoQualityManager.getZoomPanoSize() >= this.panoQualityManager.getNavPanoSize()) {
      if (this.zoomRenderTarget && this.zoomRenderTarget.width === this.panoQualityManager.getZoomPanoSize()) return
      const e = this.zoomRenderTarget
      this.zoomRenderTarget = this.cwfRenderer.initRenderTargetCube(this.panoQualityManager.getZoomPanoSize())
      //@ts-ignore
      e && (this.cwfRenderer.copyCubemap(e.texture, this.zoomRenderTarget), e.texture.dispose(), (e.texture.version = 0), (e.texture = null))
      this.zoomSweepRenderingDisabled = !1
    } else this.zoomSweepRenderingDisabled = !0
  }
}
enum DownloadState {
  DownloadFailed = 5,
  Downloaded = 4,
  Downloading = 3,
  ForceQueued = 2,
  None = 0,
  Queued = 1
}

enum ae {
  DirectionalFOV = 1,
  None = 0
}

enum QueueStyle {
  CurrentView = 0,
  FullPanorama = 1
}
export class TilePrioritizer {
  panoQualityManager: QualityManager
  tilingSettings: PanoTilingSettings
  sweepData: SweepsData
  raycaster: PointerData
  tempQueue: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>
  priorityCriteria: PriorityCriteria
  filterAndPrioritize: (e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) => void
  currViewQueue: ReturnType<typeof de>
  fullPanoQueue: ReturnType<typeof de>
  queueRaycast: (t: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, i: TileDownloader) => void
  getSweepIdInLocalDirection: (t: Vector3) => string
  persistentStorage: PersistentStorage
  maxResolution: PanoSize
  isMobileDevice: boolean
  meshQuery: MeshQueryModule
  constructor(e: QualityManager, t, i, o) {
    this.panoQualityManager = e
    this.tilingSettings = t
    this.sweepData = i
    this.raycaster = o
    this.tempQueue = []
    this.priorityCriteria = new PriorityCriteria()
    this.filterAndPrioritize = (e, t) => {
      if (!this.priorityCriteria.sweep) return
      const i = void 0 !== this.priorityCriteria.upcomingSweeps && null !== this.priorityCriteria.upcomingSweeps
      const o = this.tempQueue
      o.length = 0
      this.queueTilesForPano(o, t, this.priorityCriteria.sweep, PanoSize.BASE)
      const r = pe(e, o, !0)

      this.currViewQueue[PanoSizeKey.BASE].value = r
      this.fullPanoQueue[PanoSizeKey.BASE].value = r

      i
        ? this.queueForRestrictedSweeps(e, t)
        : this.priorityCriteria.viewmode !== ViewModes.Panorama
          ? this.queueForNonPanoViewmode(e, t)
          : this.queueForPanoViewmode(e, t),
        this.tilingSettings.downloadFullPano && this.queueFullPano(e, t)
    }
    this.queueRaycast = (() => {
      const e = new Vector3()
      return (t, i) => {
        if (this.priorityCriteria.sweep)
          if (this.priorityCriteria.hovered) this.queueTilesForPano(t, i, this.priorityCriteria.hovered, PanoSize.BASE)
          else if (this.raycaster && this.raycaster.hit) {
            const o = e.copy(this.raycaster.hit.point).sub(this.priorityCriteria.sweep.position),
              r = this.getSinglePanoInDirection(o),
              s = this.sweepData.getSweep(r)
            s && this.queueTilesForPano(t, i, s, PanoSize.BASE)
          }
      }
    })()
    this.getSweepIdInLocalDirection = (() => {
      const e = new Vector3()
      return (t: Vector3) => {
        const i = this.priorityCriteria.rotation
        const o = e.copy(t).applyQuaternion(i)
        return this.getSinglePanoInDirection(o)
      }
    })()
    this.persistentStorage = new PersistentStorage()
    this.maxResolution = e.getNavPanoSize()
    this.currViewQueue = de()
    this.fullPanoQueue = de()
    this.isMobileDevice = isMobilePhone()
  }
  getQualityQueueSize(e: QueueStyle, t: PanoSizeKey) {
    return e === QueueStyle.CurrentView ? this.currViewQueue[t].value : this.fullPanoQueue[t].value
  }
  makeQueueSubscription(e: QueueStyle, t: PanoSizeKey, i) {
    return (e === QueueStyle.CurrentView ? this.currViewQueue[t] : this.fullPanoQueue[t]).onChanged(i)
  }
  updateCriteria(e: SweepObject, t: Vector3, i: Vector3, o: Quaternion) {
    this.priorityCriteria.sweep = e
    this.priorityCriteria.position.copy(t)
    this.priorityCriteria.direction.copy(i)
    this.priorityCriteria.rotation.copy(o)
  }
  setHoveredSweep(e?: SweepObject) {
    this.priorityCriteria.hovered = null != e ? e : null
  }
  setUpcomingSweeps(e: SweepObject[]) {
    this.priorityCriteria.upcomingSweeps = e
  }
  clearUpcomingSweeps() {
    this.priorityCriteria.upcomingSweeps = void 0
  }
  setDownloadFOV(e: number) {
    this.priorityCriteria.fov = e
  }
  queueForRestrictedSweeps(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (!this.priorityCriteria.upcomingSweeps) return
    let i = 0
    for (const o of this.priorityCriteria.upcomingSweeps) {
      i++
      this.queueTilesForPano(e, t, o, PanoSize.BASE)
      if (i >= 3) break
    }
    this.queueFOVStandardNarrow(e, t)
    this.queueFOVHighNarrow(e, t)
  }
  queueForPanoViewmode(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    this.queueRaycast(e, t)
    this.queueFOVStandardNarrow(e, t)
    this.queueScoredSweeps(e, t)
    this.queueFOVHighNarrow(e, t)
    this.isMobileDevice || this.queueWASD(e, t)
  }
  queueForNonPanoViewmode(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (!this.raycaster || !this.raycaster.hit || !this.meshQuery) return 0
    const i = getSweepByIntersection(this.sweepData, !1, this.raycaster.hit.intersection, this.meshQuery)
    const o = i.length > 0 ? i[0].sweep : this.sweepData.getClosestSweep(this.raycaster.hit.point, !0)

    return o ? this.queueTilesForPano(e, t, o, PanoSize.BASE) : 0
  }
  queueFOVTiles(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: PanoSizeKey, i: number, o: TileDownloader) {
    if (!this.priorityCriteria.sweep) return 0
    const r = PanoSizeWithKey[t]
    return this.canDownloadSize(this.priorityCriteria.sweep, t)
      ? this.queueTilesInDirectionForPano(e, o, this.priorityCriteria.sweep, r, this.priorityCriteria.direction, i)
      : 0
  }
  queueScoredSweeps(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (this.priorityCriteria.sweep && this.maxResolution <= 2048) {
      const i = this.persistentStorage.getArray<SweepObject>("filterAndPrioritize:scoredSweeps")
      this.populateScoredSweeps(this.priorityCriteria.sweep, i, this.priorityCriteria.direction, 6), this.queueTilesForPanos(e, i, t, PanoSize.BASE, 4)
    }
  }
  queueFOVStandardNarrow(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (!this.priorityCriteria.sweep) return
    const i = this.tempQueue
    i.length = 0
    const { direction: o, fov: r, sweep: s } = this.priorityCriteria,
      n = this.queueFOVTiles(i, PanoSizeKey.STANDARD, r, t)
    this.sortTiles(i, s, o), pe(e, i), (this.currViewQueue[PanoSizeKey.STANDARD].value = n), (this.fullPanoQueue[PanoSizeKey.STANDARD].value = n)
  }
  queueFOVHighNarrow(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (!this.priorityCriteria.sweep) return
    const i = this.tempQueue
    i.length = 0
    const { fov: o } = this.priorityCriteria
    const r = this.queueFOVTiles(i, PanoSizeKey.HIGH, o, t)
    const s = this.queueFOVTiles(i, PanoSizeKey.ULTRAHIGH, o, t)
    this.sortTiles(i, this.priorityCriteria.sweep, this.priorityCriteria.direction)
    pe(e, i)

    this.currViewQueue[PanoSizeKey.HIGH].value = r
    this.currViewQueue[PanoSizeKey.ULTRAHIGH].value = s
  }
  queueFullPano(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    if (!this.priorityCriteria.sweep) return
    const i = this.tempQueue
    if (((i.length = 0), this.maxResolution <= PanoSize.HIGH)) {
      if (this.canDownloadSize(this.priorityCriteria.sweep, PanoSizeKey.HIGH)) {
        const e = this.queueTilesForPano(i, t, this.priorityCriteria.sweep, PanoSize.HIGH)
        this.fullPanoQueue[PanoSizeKey.HIGH].value = e
      }
    } else if (this.canDownloadSize(this.priorityCriteria.sweep, PanoSizeKey.ULTRAHIGH)) {
      const e = this.queueTilesForPano(i, t, this.priorityCriteria.sweep, PanoSize.ULTRAHIGH)
      this.fullPanoQueue[PanoSizeKey.ULTRAHIGH].value = e
    }
    this.sortTiles(i, this.priorityCriteria.sweep, this.priorityCriteria.direction), pe(e, i, !0)
  }
  queueWASD(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader) {
    const i = this.persistentStorage.getArray("filterAndPrioritize:neighbors") || []
    if (((i.length = 0), !this.priorityCriteria.sweep)) return
    const o = [DirectionVector.FORWARD, DirectionVector.RIGHT, DirectionVector.LEFT, DirectionVector.BACK]
    for (const e of o) {
      const t = this.getSweepIdInLocalDirection(e),
        o = this.sweepData.getSweep(t)
      o && i.push(o)
    }
    this.queueTilesForPanos(e, i, t, PanoSize.BASE)
  }
  canDownloadSize(e: SweepObject, t: PanoSizeKey) {
    const i = PanoSizeWithKey[t]
    const o = this.panoQualityManager.getNavPanoSize() >= i || (this.maxResolution >= i && this.panoQualityManager.getZoomPanoSize() >= i)

    return e.availableResolution(t) === t && o
  }
  populateScoredSweeps(e: SweepObject, t: SweepObject[], i: Vector3, o: number) {
    t = t || []
    t.length = 0

    const r = new Vector3().copy(e.position)
    const n = [enabledSweep(), diffSweep(e), nearSquaredSweep(r, 400), farSweep(r, i, 0.75)]
    const l = [sweepScoreByPosition(r, highQualityConfig.navigation.distanceFactor), sweepScoreByDirection(r, i, highQualityConfig.navigation.directionFactor)]
    const u = this.sweepData.getSweepNeighbours(e)
    const h = this.sweepData.sortByScore(n, l, u)
    for (let e = 0; e < h.length && e < o; e++) {
      const i = h[e].sweep
      t.push(i)
    }
  }
  queueTilesForPanos(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: SweepObject[], i: TileDownloader, o: PanoSize, r?: number) {
    let s = 0
    for (const n of t) {
      if (((s += this.queueTilesForPano(e, i, n, o) > 0 ? 1 : 0), r && s >= r)) break
    }
    return s
  }
  queueTilesForPano(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: TileDownloader, i: SweepObject, o: PanoSize) {
    const r = this.persistentStorage.get("queueTilesForSweep:filterCriteria", () => ({ filter: ae.None }))
    return this.filterAndQueueTileDownloadDescriptors(e, t, i, o, r)
  }
  queueTilesInDirectionForPano(
    e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>,
    t: TileDownloader,
    i: SweepObject,
    o: PanoSize,
    r: Vector3,
    s: number
  ) {
    const n = this.persistentStorage.get("queueTilesInDirectionForSweep:panoSpaceDir", () => new Vector3())
    const l = this.persistentStorage.get("queueTilesInDirectionForSweep:filterCriteria", () => ({
      filter: ae.DirectionalFOV,
      direction: new Vector3(),
      fov: 60
    }))
    n.copy(r)
    C(i.rotation, n)
    l.direction.copy(n)
    l.fov = s
    return this.filterAndQueueTileDownloadDescriptors(e, t, i, o, l)
  }
  filterAndQueueTileDownloadDescriptors(
    e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>,
    t: TileDownloader,
    i: SweepObject,
    o: PanoSize,
    r: {
      filter: ae
    }
  ) {
    const s = this.persistentStorage.getArray<ReturnType<TileDownloader["buildDownloadDescriptor"]>>("filterAndQueueTileDownloadDescriptors:descriptors")
    const n = t.getTileDownloadDescriptors(i, o)
    s.length = 0
    this.filterTileDownloadDescriptors(n, s, r)
    let a = 0
    for (const t of s) t && (e.push(t), a++)
    return a
  }
  filterTileDownloadDescriptors(
    e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>,
    t: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>,
    i: {
      filter: ae
      direction?: any
      fov?: number
    }
  ) {
    let o: number, r: ReturnType<TileDownloader["buildDownloadDescriptor"]> | null
    switch (i.filter) {
      case ae.DirectionalFOV:
        for (o = 0; o < e.length; o++) (r = e[o]), r && M(r.panoSize, r.tileSize, r.face, r.tileX, r.tileY, i.direction, i.fov) && t.push(r)
        break
      default:
        for (o = 0; o < e.length; o++) (r = e[o]), t.push(r)
    }
    for (o = 0; o < t.length; o++) (r = t[o]), r && !this.canIncludeDescriptor(r) && (t[o] = null)
  }
  canIncludeDescriptor(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>) {
    return e.status !== DownloadState.Downloading && e.status !== DownloadState.Downloaded
  }
  sortTiles(e: Array<ReturnType<TileDownloader["buildDownloadDescriptor"]> | TileDirectory | null>, t: SweepObject, i: Vector3) {
    ue.panoSpaceDir.copy(i)
    C(t.rotation, ue.panoSpaceDir)
    ue.fovThresholdNarrow = ce(this.priorityCriteria.fov)
    e.sort(he)
  }
  insertSortedPanoTile(e: TileDirectory[], t: TileDirectory, i: SweepObject, o: Vector3) {
    ue.panoSpaceDir.copy(o)
    C(i.rotation, ue.panoSpaceDir)
    ue.fovThresholdNarrow = ce(this.priorityCriteria.fov)
    let r = -1
    for (let i = 0; i < e.length; i++) {
      if (he(t, e[i]) <= 0) {
        r = i
        break
      }
    }
    if (-1 === r) e[e.length] = t
    else {
      for (let t = e.length; t > r; t--) e[t] = e[t - 1]
      e[r] = t
    }
  }
  getSinglePanoInDirection(e: Vector3) {
    const t = this.priorityCriteria.sweep
    if (!t) return ""
    const i = [diffSweep(t), enabledSweep(), farSweep(t.position, e)],
      o = [sweepScoreByDirection(t.position, e), sweepScoreByDistance(t.position)],
      r = t.neighbours
        .filter(e => {
          const t = this.sweepData.getSweep(e)
          return i.every(e => e(t))
        })
        .map(e => {
          const t = this.sweepData.getSweep(e)
          return { sweepId: e, score: o.reduce((e, i) => e + i(t), 0) }
        }),
      s = r.reduce((e, t) => (e.score > t.score ? e : t), r[0])
    return s ? s.sweepId : ""
  }
}
const ue = { panoSpaceDir: new Vector3(), fovThresholdNarrow: -1 }
const he = (
  e: ReturnType<TileDownloader["buildDownloadDescriptor"]> | TileDirectory,
  t: ReturnType<TileDownloader["buildDownloadDescriptor"]> | TileDirectory
) => {
  const i = ue.panoSpaceDir,
    o = ue.fovThresholdNarrow,
    r = Math.max(Math.min(i.dot(e.direction), 1), -1),
    s = Math.max(Math.min(i.dot(t.direction), 1), -1)
  return r >= o && s < o ? -1 : (r < o && s >= o) || e.panoSize > t.panoSize ? 1 : t.panoSize > e.panoSize ? -1 : -(r - s)
}
function de() {
  return {
    [PanoSizeKey.BASE]: createObservableValue(0),
    [PanoSizeKey.STANDARD]: createObservableValue(0),
    [PanoSizeKey.HIGH]: createObservableValue(0),
    [PanoSizeKey.ULTRAHIGH]: createObservableValue(0)
  }
}
function ce(e: number) {
  return Math.cos((Math.PI / 180) * (e / 2))
}
function pe(e, t, i = !1) {
  let o = 0
  if (e && t) for (const r of t) (i && -1 !== e.indexOf(r)) || (e.push(r), o++)
  return o
}
class PriorityCriteria {
  direction: Vector3
  position: Vector3
  rotation: Quaternion
  hovered: SweepObject | null
  sweep: null | SweepObject
  viewmode: number | null
  fov: number
  upcomingSweeps?: SweepObject[]
  constructor() {
    this.direction = new Vector3()
    this.position = new Vector3()
    this.rotation = new Quaternion()
    this.hovered = null
    this.sweep = null
    this.viewmode = null
    this.fov = 120
  }
  set(e: Partial<PriorityCriteria>) {
    const { direction, fov, hovered, position, rotation, sweep, upcomingSweeps, viewmode } = e
    this.direction.copy(void 0 === direction ? this.direction : direction)
    this.position.copy(void 0 === position ? this.position : position)
    this.rotation.copy(void 0 === rotation ? this.rotation : rotation)
    this.hovered = void 0 === hovered ? this.hovered : hovered
    this.sweep = void 0 === sweep ? this.sweep : sweep
    this.upcomingSweeps = upcomingSweeps
    this.viewmode = void 0 === viewmode ? this.viewmode : viewmode
    this.fov = void 0 === fov ? this.fov : fov
    return this
  }
  clone() {
    const e = new PriorityCriteria()
    e.set(this)
    return e
  }
}
const Se = new DebugInfo("tile-downloader")
export class TileDownloader {
  sweepData: SweepsData
  api: UserApiClient
  tilePrioritizer: TilePrioritizer
  settings: PanoTilingSettings
  persistentStorage: PersistentStorage
  downloadDescriptors: Record<string, Record<PanoSize, ReturnType<TileDownloader["buildDownloadDescriptorArray"]>> | null>
  priorityQueue: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>
  forceQueue: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>
  activeDownloads: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>
  lastPrioritizedTime: number
  processPriorityQueue: boolean
  processQueuePromise: Promise<any> | null
  engine: EngineContext
  onTileDownloaded: PanoRenderer["onTileDownLoaded"]
  onPanoDownloaded: (e: { sweep: SweepObject; tileSize: number; panoSize: number }) => void
  constructor(e, t, i, o) {
    this.sweepData = e
    this.api = t
    this.tilePrioritizer = i
    this.settings = o
    this.persistentStorage = new PersistentStorage()
    this.downloadDescriptors = {}
    this.priorityQueue = []
    this.forceQueue = []
    this.activeDownloads = []
    this.lastPrioritizedTime = Date.now()
    this.processPriorityQueue = !0
  }
  init() {}
  render() {
    this.update()
  }
  update() {
    this.processQueue(this.forceQueue, !1)
    if (this.processPriorityQueue) {
      if (!this.processQueuePromise && this.activeDownloads.length < this.settings.concurrentDownloads && Date.now() - this.lastPrioritizedTime > 200) {
        this.processQueuePromise = this.engine.commandBinder
          .issueCommand(
            new ScheduleTaskCommand(
              "pano/tiling/queue-download",
              () => {
                this.queuePrioritizedTiles()
                this.lastPrioritizedTime = Date.now()
              },
              100
            )
          )
          .then(async e => {
            await e.promise
            this.processQueuePromise = null
          })
      }
      this.processQueue(this.priorityQueue, !1)
    }
  }
  dispose() {}
  activate(e: EngineContext) {
    this.engine = e
  }
  deactivate(e) {}
  setRestrictedSweeps(e: string[]) {
    const t = e.map(e => this.sweepData.getSweep(e))
    this.tilePrioritizer.setUpcomingSweeps(t)
    this.clearFromAllQueuesBySweep(e)
  }
  clearRestrictedSweeps() {
    this.tilePrioritizer.clearUpcomingSweeps()
  }
  setLoadCallbacks(e, t?) {
    this.onTileDownloaded = e
    this.onPanoDownloaded = t
  }
  getNonDownloadedTiles(e: SweepObject, t: PanoSize, i) {
    i.length = 0
    const o = this.getTileDownloadDescriptors(e, t)
    for (const e of o) !e || (e.status !== DownloadState.None && e.status !== DownloadState.Queued) || i.push(e)
  }
  forceQueueTiles(e: SweepObject, t: PanoSize, i: Vector3, o: boolean) {
    const r = this.persistentStorage.getArray("forceQueueTiles:remaining")
    const s = this.persistentStorage.getArray("forceQueueTiles:matching")
    const n = this.persistentStorage.getArray("forceQueueTiles:toDownload")
    this.getNonDownloadedTiles(e, t, r)
    n.length = 0
    if (r.length > 0) {
      this.tilePrioritizer.sortTiles(r, e, i), (s.length = 0), I(e, t, i, s, !0)
      for (const e of r) for (const t of s) e.face === t.face && e.faceTileIndex === t.faceTileIndex && n.push(e)
      this.forceQueue.push(...n),
        this.setStatusForAllDescriptors(this.forceQueue, DownloadState.ForceQueued),
        this.clearFromQueue(this.priorityQueue, DownloadState.ForceQueued, !1),
        o && this.processQueue(this.forceQueue, !0)
    }
  }
  clearForceQueue() {
    this.clearQueue(this.forceQueue)
  }
  queuePrioritizedTiles() {
    this.clearQueue(this.priorityQueue)
    this.tilePrioritizer.filterAndPrioritize(this.priorityQueue, this)
    this.invalidateDuplicateEntries(this.priorityQueue)
    this.clearFromQueue(this.priorityQueue, DownloadState.None, !0)
    this.setStatusForAllDescriptors(this.priorityQueue, DownloadState.Queued)
    this.lastPrioritizedTime = Date.now()
  }
  clearQueue(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>) {
    this.setStatusForAllDescriptors(e, DownloadState.None)
    e.length = 0
  }
  clearFromQueue(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: DownloadState, i: boolean) {
    for (let o = 0; o < e.length; o++) {
      const r = e[o]
      r && ((t === r.status && !i) || (t !== r.status && i)) && (e[o] = null)
    }
  }
  clearFromAllQueuesBySweep(e: string[]) {
    this.clearFromQueueBySweep(this.forceQueue, e)
    this.clearFromQueueBySweep(this.priorityQueue, e)
  }
  clearFromQueueBySweep(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: string[]) {
    const i = booleanMap(t)
    for (let t = 0; t < e.length; t++) {
      const o = e[t]
      o && o.sweep && (i[o.sweep.id] || (e[t] = null))
    }
  }
  setStatusForAllDescriptors(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: DownloadState) {
    for (const i of e) i && (i.status = t)
  }
  invalidateDuplicateEntries(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>) {
    for (const t of e) t && (t.queuedCount = 0)
    for (let t = 0; t < e.length; t++) {
      const i = e[t]
      i && (i.queuedCount++, i.queuedCount > 1 && (e[t] = null))
    }
  }
  getTileDownloadDescriptors(e: SweepObject, t: PanoSize) {
    const i = this.getAllTileDownloadDescriptors(e.id)
    let o = i[t]
    o || ((o = this.buildDownloadDescriptorArray(t)), (i[t] = o), this.initTileDownloadDescriptors(o, e, t))
    return o
  }
  getAllTileDownloadDescriptors(e: string) {
    const t = this.downloadDescriptors[e] || ({} as Record<PanoSize, ReturnType<TileDownloader["buildDownloadDescriptorArray"]>>)
    this.downloadDescriptors[e] = t
    return t
  }
  deleteAllTileDownloadDescriptors(e: string) {
    this.downloadDescriptors[e] = null
    delete this.downloadDescriptors[e]
  }
  processQueue(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: boolean) {
    this.cleanupActiveDownloads()
    if (this.activeDownloads.length < this.settings.concurrentDownloads || t) {
      const i = t ? e.length : this.settings.concurrentDownloads - this.activeDownloads.length
      let o = 0
      for (let t = 0; o < i && e.length > 0; t++) {
        const t = e.shift()
        t && (this.startDownload(t), o++)
      }
    }
  }
  async startDownload(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>) {
    if (e.sweep) {
      const t = e.status === DownloadState.ForceQueued ? HttpPriority.HIGHEST : HttpPriority.MEDIUM
      e.status = DownloadState.Downloading
      this.checkRestrictedSweep(e.sweep.id) || Se.warn("Downloading a tile that is not in restricted list")
      this.activeDownloads.push(e)
      const i = await this.getTileUrl(e.sweep, e.panoSize, e.tileSize, e.tileIndex)
      this.api
        .getImageBitmap(i, e.tileSize, e.tileSize, { maxRetries: 3, priority: t })
        .then(this.downloadComplete.bind(this, e), this.downloadFailed.bind(this, e))
    }
  }
  checkRestrictedSweep(e: string) {
    const t = this.tilePrioritizer.priorityCriteria.upcomingSweeps
    if (t) {
      let i = !1
      for (const o of t) o && o.id === e && (i = !0)
      return i
    }
    return !0
  }
  downloadFailed(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>, t) {
    e.status = DownloadState.DownloadFailed
  }
  downloadComplete(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>, t: ArrayBuffer | ImageBitmap) {
    if (
      e.sweep &&
      ((e.status = DownloadState.Downloaded),
      (e.image = t),
      this.onTileDownloaded && this.onTileDownloaded(e),
      this.engine.broadcast(new TileDownloadedMessage()),
      this.isPanoDownloaded(e.sweep, e.panoSize))
    ) {
      const t = { sweep: e.sweep, tileSize: e.tileSize, panoSize: e.panoSize }
      this.onPanoDownloaded && this.onPanoDownloaded(t)
    }
  }
  cleanupActiveDownloads() {
    const e = this.persistentStorage.getArray("cleanupActiveDownloads:temp")
    e.length = 0
    for (const t of this.activeDownloads) t!.status !== DownloadState.Downloaded && t!.status !== DownloadState.DownloadFailed && e.push(t)
    this.activeDownloads.length = 0
    this.activeDownloads.push(...e)
  }
  isPanoDownloaded(e: SweepObject, t: PanoSize) {
    const i = this.getTileDownloadDescriptors(e, t)
    if (!i || i.length <= 0) return !1
    for (const e of i) if (e && e.status !== DownloadState.Downloaded) return !1
    return !0
  }
  buildDownloadDescriptorArray(e: PanoSize) {
    const t = x(e)
    const i: Array<ReturnType<TileDownloader["buildDownloadDescriptor"]> | null> = []
    for (let e = 0; e < t; e++) {
      const e = this.buildDownloadDescriptor()
      i.push(e)
    }
    return i
  }
  buildDownloadDescriptor() {
    return {
      sweep: null as SweepObject | null,
      panoSize: -1 as PanoSize,
      tileSize: -1,
      tileIndex: -1,
      totalTiles: -1,
      faceTileIndex: -1,
      status: DownloadState.None,
      url: null as string | null,
      image: null as ArrayBuffer | ImageBitmap | null,
      direction: new Vector3(),
      face: -1,
      cubeFace: -1,
      tileX: -1,
      tileY: -1,
      queuedCount: -1
    }
  }
  initTileDownloadDescriptors(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>, t: SweepObject, i: PanoSize) {
    for (let o = 0; o < e.length; o++) {
      const r = e[o]
      r && this.initTileDownloadDescriptor(r, t, i, o)
    }
  }
  initTileDownloadDescriptor(e: ReturnType<TileDownloader["buildDownloadDescriptor"]>, t: SweepObject, i: PanoSize, o: number) {
    const r = i >= A ? A : i
    e.face = b(i, o)
    e.cubeFace = d(e.face)
    e.sweep = t
    e.panoSize = i
    e.tileSize = r
    e.tileIndex = o
    e.totalTiles = x(i)
    e.status = DownloadState.None
    e.image = null
    U(e.panoSize, e.tileIndex, e)
    F(e.panoSize, e.tileSize, e.cubeFace, e.tileX, e.tileY, DirectionType.Center, 0, e.direction)
  }
  getTileUrl(e: SweepObject, t: number, i: number, o: number) {
    const r = this.persistentStorage.get("getTileUrl:locationInfo", () => ({ face: -1, faceTileIndex: -1, tileX: -1, tileY: -1 }))
    U(t, o, r)
    const s = Math.floor(t / i)
    const n = s * s
    const a = Math.floor(o / n)
    const l = QualityManager.getPanoSizeClass(t)
    return e.getTileUrl(l, a, r.tileX, r.tileY)
  }
}
export default class SweepPanoTilingModule extends Module {
  enum: { resolution: typeof PanoSizeKey; queueStyle: typeof QueueStyle }
  preloadQuality: PanoSizeKey | null
  preloadResolution: null | PanoSize
  handleResolutionChange: (e: string | undefined, t: number) => void
  panoRenderer: PanoRenderer
  qualityManager: QualityManager
  settingsData: SettingsData
  cameraData: CameraData
  sweepData: SweepsData
  cwfRenderer: CWFRenderer
  settings: PanoTilingSettings
  tilePrioritizer: TilePrioritizer
  tileDownloader: TileDownloader
  constructor() {
    super(...arguments)
    this.name = "sweep-pano-tiling"
    this.enum = { resolution: PanoSizeKey, queueStyle: QueueStyle }
    this.preloadQuality = null
    this.preloadResolution = null
    this.handleResolutionChange = (e, t) => {
      const i = this.panoRenderer.getCurrentPanoResolution()
      this.qualityManager.update({ height: this.getVerticalResolution() })
      i !== this.panoRenderer.getCurrentPanoResolution() && e && this.resetPano(e)
    }
  }
  setPreloadQuality(e: PanoSizeKey | null) {
    this.settingsData.setProperty(tilingPreloadQualityKey, e)
  }
  async init(e, t: EngineContext) {
    const { market } = t
    const [o, a, l] = await Promise.all([t.getModuleBySymbol(Apiv2Symbol), t.getModuleBySymbol(WebglRendererSymbol), market.waitForData(PointerData)])
    ;[this.cameraData, this.settingsData, this.sweepData] = await Promise.all([
      market.waitForData(CameraData),
      market.waitForData(SettingsData),
      market.waitForData(SweepsData)
    ])
    const u = (this.cwfRenderer = a.cwfRenderer)
    const h = a.maxCubemapSize
    const { navPanoSize, zoomPanoSize } = (e => {
      let t = PanoSize.STANDARD,
        i = PanoSize.HIGH
      return (
        isMobilePhone() ? e && ((t = PanoSize.STANDARD), (i = PanoSize.HIGH)) : ((t = PanoSize.HIGH), (i = PanoSize.ULTRAHIGH)),
        { navPanoSize: t, zoomPanoSize: i }
      )
    })(a.isHighPerformanceMobileGPU())

    this.settings = new PanoTilingSettings()
    this.qualityManager = new QualityManager(h, navPanoSize, zoomPanoSize, this.getVerticalResolution())
    this.tilePrioritizer = new TilePrioritizer(this.qualityManager, this.settings, this.sweepData, l)
    t.getModuleBySymbol(MeshQuerySymbol).then(e => (this.tilePrioritizer.meshQuery = e))
    this.tileDownloader = new TileDownloader(this.sweepData, o.getApi(), this.tilePrioritizer, this.settings)
    this.panoRenderer = new PanoRenderer(u, this.qualityManager, this.tileDownloader, this.tilePrioritizer, this.sweepData, this.cameraData, this.settings)
    this.tileDownloader.setLoadCallbacks(this.panoRenderer.onTileDownLoaded)
    t.addComponent(this, this.tileDownloader)
    t.addComponent(this, this.panoRenderer)
    this.bindings.push(
      t.commandBinder.addBinding(SetEavPanoSizeCommand, async ({ navSize }) => {
        this.overrideNavPanoResolutionMax(navSize)
      })
    )
    this.bindings.push(
      t.subscribe(CameraZoomMessage, e => {
        this.setTilingFOV()
      }),
      t.subscribe(SetCameraDimensionsMessage, () => {
        const e = this.setTilingFOV()
        this.handleResolutionChange(this.sweepData.currentSweep, e)
      }),
      t.subscribe(PixelRatioChangedMessage, () => {
        const e = this.setTilingFOV()
        this.handleResolutionChange(this.sweepData.currentSweep, e)
      }),
      t.subscribe(RestrictSweepsSetMessage, e => {
        this.tileDownloader.setRestrictedSweeps(e.sweepIds)
      }),
      t.subscribe(RestrictedSweepsMessage, e => {
        this.tileDownloader.clearRestrictedSweeps()
      }),
      t.subscribe(HandlePuckHoverMessage, e => {
        const t = this.sweepData.getSweep(e.sweepId)
        this.setHoverPreloadSweep(e.hovered ? t : void 0)
      }),
      t.subscribe(ViewModeChangeMessage, e => {
        this.tilePrioritizer.priorityCriteria.viewmode = e.toMode
      }),
      t.subscribe(StartViewmodeChange, e => {
        this.tilePrioritizer.priorityCriteria.viewmode = e.toMode
      }),
      this.sweepData.onPropertyChanged("transitionActive", () => {
        if (this.sweepData.transition.to) {
          const e = this.sweepData.getSweep(this.sweepData.transition.to)
          this.handlePreloadQualityChange(e)
        }
      }),
      this.settingsData.onPropertyChanged(tilingPreloadQualityKey, () => {
        this.preloadQuality = this.settingsData.tryGetProperty(tilingPreloadQualityKey, null)
        this.qualityManager.overrideWindowMaximums(null !== this.preloadQuality)
        this.sweepData.currentSweepObject && this.handlePreloadQualityChange(this.sweepData.currentSweepObject)
      }),
      t.subscribe(WebglRendererContextLostMessage, () => {
        this.panoRenderer.clearAllQueuedUploads()
      }),
      t.subscribe(WebglRendererContextRestoredMessage, () => {
        this.panoRenderer.renderAllActivePanos()
      })
    )
    this.setTilingFOV()
    t.broadcast(new SymbolLoadedMessage(PanoTilesSymbol))
  }
  getVerticalResolution() {
    return this.cwfRenderer.getSize().height * this.cwfRenderer.getPixelRatio()
  }
  overrideNavPanoResolutionMax(e: PanoSizeKey) {
    const t = PanoSizeWithKey[e || this.panoRenderer.getCurrentPanoResolution()]
    const i = null !== this.settingsData.tryGetProperty(tilingPreloadQualityKey, null)
    this.qualityManager.overrideWindowMaximums(i)
    this.qualityManager.overrideNavPanoSize(t)
  }
  setTilingFOV() {
    const e = this.cameraData.fovX()
    const t = this.cameraData.fovY()
    const i = Math.max(e, t) * MathUtils.RAD2DEG
    this.tilePrioritizer.setDownloadFOV(i)

    return i
  }
  getRenderer() {
    return this.panoRenderer
  }
  setHoverPreloadSweep(e?: SweepObject) {
    this.tilePrioritizer && this.tilePrioritizer.setHoveredSweep(e)
  }
  handlePreloadQualityChange(e: SweepObject) {
    if (null !== this.preloadQuality) {
      const t = e.availableResolution(this.preloadQuality)
      this.preloadResolution = QualityManager.getPanoSize(t)
    } else this.preloadResolution = null
    this.enableHighRes(!1)
  }
  enableHighRes(e = !0, t?: string) {
    const i = null !== this.preloadResolution ? this.preloadResolution : e ? this.qualityManager.getZoomPanoSize() : this.qualityManager.getNavPanoSize()
    this.tilePrioritizer.maxResolution !== i && this.log.debug(`Setting max resolution: ${i}`)
    this.tilePrioritizer.maxResolution = i
    this.panoRenderer.highResRenderTarget(e, t)
  }
  enableZooming(e: boolean, sweepId: string) {
    if (e) {
      const resolution = QualityManager.getPanoSizeClass(this.qualityManager.getZoomPanoSize())

      return this.requestResolution({ sweepId, resolution }).res >= resolution
    }
    this.enableHighRes(!1, sweepId)
    this.resetPano(sweepId)
    return !1
  }
  requestResolution({
    onProgress: e,
    queueType: t = QueueStyle.CurrentView,
    quickly: i = !1,
    resolution: o,
    sweepId: r,
    timeout: n = 1e3
  }: {
    onProgress?: any
    queueType?: QueueStyle
    quickly?: boolean
    resolution: PanoSizeKey
    sweepId: string
    timeout?: number
  }) {
    const a = this.sweepData.getSweep(r)
    this.settings.highResUploadsPerFrame = i ? highQualityConfig.maxHighResUploadsPerFrame : highQualityConfig.highResUploadsPerFrame
    this.settings.concurrentDownloads = i ? highQualityConfig.maxConcurrentDownloads : highQualityConfig.concurrentDownloads
    this.settings.downloadFullPano = t === QueueStyle.FullPanorama
    const l = a.availableResolution(o)
    const u = PanoSizeWithKey[l]
    u > PanoSize.HIGH && (this.qualityManager.overrideWindowMaximums(!0), this.panoRenderer.enableUltraHighQualityMode(a.id))
    ;(u > PanoSizeWithKey[this.panoRenderer.getCurrentPanoResolution()] || u > this.qualityManager.getNavPanoSize()) &&
      (this.enableHighRes(!0, a.id), this.resetPano(a.id))
    const h = this.waitForQueue(t, o, n)

    e && h.progress(e)
    return { res: l, promise: h.nativePromise() }
  }
  waitForQueue(e: QueueStyle, t: PanoSizeKey, i = 1000) {
    const o = new OpenDeferred()
    const r = () => {
      a.cancel()
      o.notify(1)
      o.resolve()
    }
    let s = this.tilePrioritizer.getQualityQueueSize(e, t),
      n = window.setTimeout(() => {
        this.log.debug(`Download queue ${e} timed out from inactivity after ${i}ms`)
        r()
      }, i)
    const a = this.tilePrioritizer.makeQueueSubscription(e, t, e => {
      if ((n && (window.clearTimeout(n), (n = 0), (s = e)), e > 0)) {
        const t = (s - e) / Math.max(s, 1)
        o.notify(t)
      } else r()
    })
    return o.promise()
  }
  resetSweep(e: string) {
    this.enableHighRes(!1, e)
    this.resetPano(e)
    this.settings.reset()
  }
  resetPano(e: string) {
    this.panoRenderer.resetRenderStatus(e, !1, !0, this.panoRenderer.panoQualityManager.getNavPanoSize())
    this.panoRenderer.clearAllQueuedUploadsForPano(e)
    this.panoRenderer.renderPanoTiles(e, null, !1, !1)
  }
}
