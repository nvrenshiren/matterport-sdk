import { MathUtils } from "three"
import { LockNavigationCommand, UnlockNavigationCommand } from "../command/navigation.command"
import { CaptureSnapshotCommand, EquirectangularSnapshotCommand, UploadSnapshotCommand } from "../command/snapshot.command"
import { LockViewmodeCommand, UnlockViewmodeCommand } from "../command/viewmode.command"
import { RequestRenderCameraCommand, RequestRenderTargetCommand, RequestRenderTargetHeadingCommand } from "../command/webgl.command"
import { SnapshotCategory } from "../const/50090"
import { DollhousePeekabooKey } from "../const/66777"
import { PanoSizeKey } from "../const/76609"
import { highQualityConfig } from "../const/quality.const"
import { PanoSymbol, SnapshotsEditorSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { ToolsList } from "../const/tools.const"
import { RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { SettingsData } from "../data/settings.data"
import { SnapshotsData } from "../data/snapshots.data"
import { SweepsData } from "../data/sweeps.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { BaseExceptionError } from "../error/baseException.error"
import { calculateAngleBetweenVectors } from "../math/81729"
import { SnapshotErrorMessage } from "../message/snapshot.message"
import { SnapshotObject } from "../object/snapshot.object"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import { createObservableValue } from "../observable/observable.value"
import * as F from "../other/92306"
import { QualityManager } from "../qualityManager"
import * as w from "../utils/func.utils"
import { dateToString, waitRun } from "../utils/func.utils"
import { imageDataToBlob, SceneCapture } from "../utils/image.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import EngineContext from "../core/engineContext"
import WebglRendererModule from "./webglrender.module"
import SweepPanoTilingModule from "./sweepPanoTiling.module"
import { RenderTarget } from "./renderToTexture.module"

declare global {
  interface SymbolModule {
    [SnapshotsEditorSymbol]: SnapshotsEditorModule
  }
}
export enum UploadState {
  CAPTURING = "capturing",
  DONE = "done",
  ERROR = "error",
  UPLOADING = "uploading"
}
class SnapshotCaptureError extends BaseExceptionError {
  constructor(e, t = "72002") {
    super(e, t), (this.name = "SnapshotCaptureError")
  }
}
class SnapshotUploadError extends BaseExceptionError {
  constructor(e, t = "73002") {
    super(e, t), (this.name = "SnapshotUploadError")
  }
}
class SnapshotEncodingError extends BaseExceptionError {
  constructor(e, t = "74002") {
    super(e, t), (this.name = "SnapshotEncodingError")
  }
}
const _ = highQualityConfig.uploadIntervalDelay
export default class SnapshotsEditorModule extends Module {
  peekabooActive: boolean
  engine: EngineContext
  renderer: WebglRendererModule
  sweepRenderer: SweepPanoTilingModule
  sweepData: SweepsData
  viewmodeData: ViewmodeData
  cameraData: CameraData
  floorsViewData: FloorsViewData
  snapshotTarget: RenderTarget
  snapshotOverlayTarget: RenderTarget
  static captureProgressFudgeFactor = 90
  constructor() {
    super(...arguments)
    this.name = "snapshots-editor"
    this.peekabooActive = !1
  }
  async init(e, t: EngineContext) {
    this.engine = t
    ;[this.renderer, this.sweepRenderer] = await Promise.all([t.getModuleBySymbol(WebglRendererSymbol), t.getModuleBySymbol(PanoSymbol)])
    ;[this.sweepData, this.viewmodeData, this.cameraData, this.floorsViewData] = await Promise.all([
      t.market.waitForData(SweepsData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(CameraData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(SnapshotsData)
    ])
    ;[this.snapshotTarget, this.snapshotOverlayTarget] = await Promise.all([
      t.commandBinder.issueCommandWhenBound(new RequestRenderTargetCommand()),
      t.commandBinder.issueCommandWhenBound(new RequestRenderTargetCommand())
    ])
    const [i, n] = await Promise.all([t.market.waitForData(ToolsData), t.market.waitForData(SettingsData)])
    this.peekabooActive = n.tryGetProperty(DollhousePeekabooKey, !1)
    this.bindings.push(
      i.onPropertyChanged("activeToolName", this.onToolChanged.bind(this)),
      t.commandBinder.addBinding(CaptureSnapshotCommand, this.onCaptureSnapshotCommand.bind(this)),
      t.commandBinder.addBinding(EquirectangularSnapshotCommand, this.onCaptureEquirectCommand.bind(this))
    )
  }
  onToolChanged(e: ToolsList) {
    this.sweepRenderer.setPreloadQuality(e === ToolsList.PHOTOS || e === ToolsList.START_LOCATION ? this.sweepRenderer.enum.resolution.ULTRAHIGH : null)
  }
  async onCaptureEquirectCommand(e) {
    const t = e.onProgress || createObservableValue(0)
    t.value = 10
    this.engine.commandBinder.issueCommand(new LockNavigationCommand())
    await waitRun(50)
    const i = this.sweepData.currentSweepObject
    if (!i) throw new SnapshotCaptureError("Equirectangular capture is only supported in Panorama mode")
    const n = this.queryIdealEqResolution()
    this.snapshotTarget.setSize(n.width, n.height)
    const s = DirectionVector.FORWARD.clone().applyQuaternion(i.rotation).setY(0),
      a = DirectionVector.FORWARD.clone().applyQuaternion(this.cameraData.pose.rotation).setY(0),
      o = calculateAngleBetweenVectors(s, a) + Math.PI
    await this.fetchHighestAvailable(!0, PanoSizeKey.ULTRAHIGH, e => (t.value = Math.max(10, e)))
    await this.takeEquirectangular(o)
    this.sweepRenderer.resetSweep(i.id)
    this.engine.commandBinder.issueCommand(new UnlockNavigationCommand())
    const d = this.uploadAndAddSnapshot(SnapshotCategory.PANORAMA)
      .then(e => e && e.sid)
      .catch(e => {
        throw (this.log.error(e), this.engine.broadcast(new SnapshotErrorMessage(e)), e)
      })
    return e.waitForUpload ? d : null
  }
  async onCaptureSnapshotCommand(e: CaptureSnapshotCommand["payload"]) {
    const t = e.onProgress || createObservableValue(0)
    t.value = 10
    this.engine.commandBinder.issueCommand(new LockNavigationCommand())
    this.engine.commandBinder.issueCommand(new LockViewmodeCommand())
    const i = this.queryIdealResolution(e.maxSize, e.aspect)
    this.snapshotTarget.setSize(i.width, i.height)
    this.snapshotOverlayTarget.setSize(i.width, i.height)
    await this.fetchHighestAvailable(!1, e.maxSize, e => (t.value = Math.max(10, e)))
    await waitRun(2 * _)
    await this.takeScreenshot()
    const n = this.sweepData.currentSweepObject
    n && this.viewmodeData.currentMode === ViewModes.Panorama && (await this.sweepRenderer.resetSweep(n.id))
    this.engine.commandBinder.issueCommand(new UnlockNavigationCommand())
    this.engine.commandBinder.issueCommand(new UnlockViewmodeCommand())
    let s: SnapshotCategory = e.category
    n &&
      (n.alignmentType === AlignmentType.UNALIGNED || n.placementType === PlacementType.MANUAL) &&
      s === SnapshotCategory.USER &&
      (s = SnapshotCategory.UNALIGNED)
    const a = this.uploadAndAddSnapshot(s)
      .then(e => e && e.sid)
      .catch(e => {
        this.log.error(e)
        this.engine.broadcast(new SnapshotErrorMessage(e))
        throw e
      })
    return e.waitForUpload ? a : null
  }
  async uploadAndAddSnapshot(e: SnapshotCategory) {
    const i = this.createSnapshot(e)
    i.state = UploadState.CAPTURING
    try {
      const e = await SceneCapture(this.snapshotTarget)
      i.imageBlob = imageDataToBlob(e)
    } catch (e) {
      i.state = UploadState.ERROR
      this.log.error(e)
      throw new SnapshotEncodingError(e)
    }
    i.state = UploadState.UPLOADING
    try {
      const e = await this.engine.commandBinder.issueCommand(new UploadSnapshotCommand(i))
      if (!e) {
        i.state = UploadState.ERROR
        this.log.error("Exception during snapshot upload")
        throw new SnapshotUploadError("Exception during snapshot upload")
      }
      i.state = UploadState.DONE
      return e
    } catch (e) {
      i.state = UploadState.ERROR
      this.log.error(e)
      throw new SnapshotUploadError(e)
    }
  }
  createSnapshot(e: SnapshotCategory) {
    const t = this.viewmodeData.isInside()
    const i = this.sweepData.currentSweep
    let n = dateToString(new Date())
    if (i && t) {
      const e = this.sweepData.getSweep(i).name
      e && (n = e)
    }
    const { position: s, viewmode: a } = (0, F.pG)(this.cameraData, this.floorsViewData, this.viewmodeData, this.peekabooActive)
    const o = new SnapshotObject()
    o.width = this.snapshotTarget.width
    o.height = this.snapshotTarget.height
    o.name = n
    o.category = e
    o.is360 = t && !this.sweepData.currentAlignedSweepObject
    o.metadata = {
      cameraMode: a,
      cameraPosition: s,
      cameraQuaternion: this.cameraData.pose.rotation.clone(),
      orthoZoom: a === ViewModes.Floorplan ? this.cameraData.zoom() : -1,
      ssZoom: this.cameraData.zoom(),
      scanId: t ? this.sweepData.currentSweep : void 0,
      floorId: this.floorsViewData.currentFloorId,
      floorVisibility: this.floorsViewData.getFloorsVisibility()
    }
    return o
  }
  queryIdealResolution(e = PanoSizeKey.ULTRAHIGH, t) {
    var i, n
    const s = 1 / Math.max(t, Number.EPSILON)
    let a = 3840,
      o = a * s
    const r = this.renderer.maxTextureSize
    if (
      (a > r &&
        (this.log.warn(`The active gl context does not support 4k x 2k equirectangular capture\nCapture is limited to a max size of ${r}`),
        (a = r),
        (o = a * s)),
      this.viewmodeData.currentMode === ViewModes.Panorama)
    ) {
      const s =
          null !== (n = null === (i = this.sweepData.currentSweepObject) || void 0 === i ? void 0 : i.availableResolution(e)) && void 0 !== n
            ? n
            : PanoSizeKey.STANDARD,
        d = (QualityManager.getPanoSize(s) * (this.cameraData.fovY() * MathUtils.RAD2DEG)) / 90
      ;(a = Math.min(Math.round(d * t), r)), (o = Math.round(a / t))
    }
    return { width: a, height: o }
  }
  queryIdealEqResolution() {
    let e = 8192,
      t = 0.5 * e
    const i = this.renderer.maxTextureSize
    return (
      e > i && this.log.warn(`The active gl context does not support 4k x 2k equirectangular capture\nCapture is limited to a max size of ${i}`),
      (e = Math.min(i, e)),
      (t = 0.5 * e),
      { width: e, height: t }
    )
  }
  fetchHighestAvailable(e: boolean, t = PanoSizeKey.ULTRAHIGH, i: (e: number) => void) {
    const n = this.sweepData.currentSweepObject
    if (n && this.viewmodeData.currentMode === ViewModes.Panorama) {
      const s = e ? this.sweepRenderer.enum.queueStyle.FullPanorama : this.sweepRenderer.enum.queueStyle.CurrentView,
        a = i ? e => i(e * SnapshotsEditorModule.captureProgressFudgeFactor) : void 0
      return this.sweepRenderer.requestResolution({ sweepId: n.id, resolution: t, queueType: s, quickly: !0, onProgress: a }).promise
    }
    return i && i(SnapshotsEditorModule.captureProgressFudgeFactor), Promise.resolve()
  }
  takeScreenshot() {
    const e = RenderLayers.ALL
    e.removeLayers(this.engine.getRenderLayer("grid-underlay"))
    e.removeLayers(this.engine.getRenderLayer("cursor-mesh"))
    e.removeLayers(this.engine.getRenderLayer("current-pano-marker"))
    const t = this.renderer.getScene().scene
    const i = this.renderer.getScene().camera
    const n = i.layers.mask
    i.layers.mask = e.mask
    return this.engine.commandBinder.issueCommand(new RequestRenderCameraCommand(this.snapshotTarget, t, i)).then(() => {
      i.layers.mask = n
    })
  }
  async takeEquirectangular(e) {
    const t = this.sweepData.currentSweep!
    const i = this.sweepRenderer.getRenderer()
    const n = i.useTexture(t)
    const s = this.engine.commandBinder.issueCommand(new RequestRenderTargetHeadingCommand(this.snapshotTarget, n, e))
    await s
    i.freeTexture(t)
  }
}
