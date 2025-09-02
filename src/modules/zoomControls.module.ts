import { MathUtils } from "three"
import { MatrixBase } from "../webgl/matrix.base"
import * as Z from "../const/6739"
import { ZoomInCommand, ZoomMaxValueCommand, ZoomOutCommand, ZoomResetCommand, ZoomSetCommand } from "../command/zoom.command"
import { CameraSymbol, ControlsZoomSymbol, InputSymbol, PanoSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { CameraZoomMessage } from "../message/camera.message"
import { CameraRigConfig } from "../utils/camera.utils"
import { PanoSizeKey } from "../const/76609"
import { KeyboardCode } from "../const/keyboard.const"
import { KeyboardStateList } from "../const/keyboard.const"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { PincherMoveEvent } from "../events/pinch.ecvent"
import { WheelBindEvent } from "../events/wheel.event"
import { CheckThreshold } from "../utils/49827"
import SweepPanoTilingModule from "./sweepPanoTiling.module"
import EngineContext from "../core/engineContext"
import CameraDataModule from "./cameraData.module"
import { SweepObject } from "../object/sweep.object"

declare global {
  interface SymbolModule {
    [ControlsZoomSymbol]: ZoomControlsModule
  }
}
export default class ZoomControlsModule extends Module {
  uhQuality: {}
  config: { enabled: boolean }
  sweepTilingModule: SweepPanoTilingModule
  engine: EngineContext
  cameraModule: CameraDataModule
  cameraData: CameraData
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  zoomedSweep: SweepsData["currentSweepObject"]

  constructor() {
    super(...arguments)
    this.name = "zoom-controls"
    this.uhQuality = {}
    this.config = { enabled: !0 }
  }

  async init(e, o: EngineContext) {
    this.config.enabled = !!e.enabled
    this.sweepTilingModule = await o.getModuleBySymbol(PanoSymbol)
    this.config.enabled && (await this.registerControls(o))
    this.engine = o
    this.cameraModule = await o.getModuleBySymbol(CameraSymbol)
    this.cameraData = await o.market.waitForData(CameraData)
    this.viewmodeData = await o.market.waitForData(ViewmodeData)
    this.sweepData = await o.market.waitForData(SweepsData)
    this.bindings.push(
      o.commandBinder.addBinding(ZoomInCommand, async e => this.zoomBy(e.step)),
      o.commandBinder.addBinding(ZoomOutCommand, async e => this.zoomBy(-e.step)),
      o.commandBinder.addBinding(ZoomResetCommand, async () => this.zoomTo(1)),
      o.commandBinder.addBinding(ZoomSetCommand, async e => this.zoomTo(e.value)),
      o.commandBinder.addBinding(ZoomMaxValueCommand, async () => Promise.resolve(this.getMaxZoomAvailable()))
    )
  }

  async registerControls(e) {
    e.getModuleBySymbol(InputSymbol).then(e => {
      this.bindings.push(e.registerHandler(WheelBindEvent, e => this.zoomByInput(this.scrollToZoomDelta(e)))),
        this.bindings.push(e.registerHandler(PincherMoveEvent, e => this.zoomByInput(this.pinchToZoomDelta(e)))),
        this.bindings.push(e.registerHandler(KeyboardCallbackEvent, e => this.keyHandler(e)))
    })
  }

  zoomTo(e) {
    const o = this.cameraData.zoom()
    if (!this.validateViewmode()) return o
    const { currentSweep: t, currentSweepObject: i } = this.sweepData
    if ((i && this.checkTilingZoomLevels(e, i), (e = CheckThreshold(e, Z.X.minZoom, this.getMaxZoom(t))) !== o)) {
      const o = MathUtils.radToDeg(this.cameraData.baseFovY / e),
        t = CameraRigConfig.near,
        i = CameraRigConfig.far
      this.cameraModule.updateCameraProjection(new MatrixBase().makePerspectiveFov(o, this.cameraData.aspect(), t, i))
    }
    return this.engine.broadcast(new CameraZoomMessage(e)), e
  }

  checkTilingZoomLevels(e, o: SweepObject) {
    if (e >= Z.X.highResThreshold && this.zoomedSweep !== o) {
      this.zoomedSweep = o
      this.sweepTilingModule.enableZooming(!0, o.id) ? (this.uhQuality[o.id] = !0) : ((this.uhQuality[o.id] = !1), (this.zoomedSweep = void 0))
    } else
      e < Z.X.highResThreshold &&
        this.zoomedSweep &&
        this.zoomedSweep === o &&
        (this.sweepTilingModule.enableZooming(!1, this.zoomedSweep.id), (this.zoomedSweep = void 0))
  }

  getMaxZoom(e) {
    return this.uhQuality[null != e ? e : "none"] ? Z.X.maxHighResZoom : Z.X.maxZoom
  }

  zoomBy(e) {
    const o = this.cameraData.zoom()
    return this.validateViewmode() ? this.zoomTo(o + e) : o
  }

  validateViewmode() {
    return this.viewmodeData.isInside() && this.cameraData.canTransition()
  }

  scrollToZoomDelta(e) {
    return -Math.sign(e.delta.y) * Z.X.zoomStep
  }

  pinchToZoomDelta(e) {
    return e.pinchDelta * (Z.X.maxZoom - Z.X.minZoom)
  }

  zoomByInput(e) {
    const o = this.cameraData.zoom()
    if (!this.validateViewmode()) return o
    const t = this.sweepData.currentSweep,
      i = CheckThreshold(o + e, Z.X.minZoom, this.getMaxZoom(t))
    return this.zoomTo(i)
  }

  keyHandler(e) {
    if (e.state === KeyboardStateList.DOWN)
      switch (e.key) {
        case KeyboardCode.PLUSEQUALS:
          this.zoomByInput(Z.X.zoomStep)
          break
        case KeyboardCode.DASHUNDERSCORE:
          this.zoomByInput(-Z.X.zoomStep)
          break
        case KeyboardCode.OPENBRACKET:
          this.zoomTo(1)
      }
  }

  getMaxZoomAvailable() {
    if (!this.sweepData.currentSweepObject) return Z.X.maxZoom
    return this.sweepData.currentSweepObject.availableResolution(PanoSizeKey.ULTRAHIGH) >= PanoSizeKey.ULTRAHIGH ? Z.X.maxHighResZoom : Z.X.maxZoom
  }
}
