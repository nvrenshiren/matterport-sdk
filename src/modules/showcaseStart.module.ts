import { Vector3 } from "three"
import * as y from "../math/2569"
import * as M from "../other/44237"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import { MovetoFloorCommand, MovetoFloorNumberCommand } from "../command/floors.command"
import { StartLocationFlyInCommand, StartLocationGotoCommand } from "../command/startLocation.command"
import { TransitionTypeList } from "../const/64918"
import {
  CameraSymbol,
  InitUISymbol,
  ModeSymbol,
  ModelMeshSymbol,
  ShowcaseSettingsSymbol,
  ShowcaseStartSymbol,
  SweepDataSymbol,
  WebglRendererSymbol
} from "../const/symbol.const"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppData, AppMode } from "../data/app.data"
import { CamStartData, DeepLinkPose } from "../data/camstart.data"
import { PlayerOptionsData } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ModelViewChangeCompleteMessage } from "../message/layer.message"
import { LoadSpinnerSuppressMessage } from "../message/ui.message"
import { AlignmentType } from "../object/sweep.object"
import { waitRun } from "../utils/func.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import CameraDataModule from "./cameraData.module"
import SweepDataModule from "./sweepData.module"
import { DEFAULT_TRANSITION_TIME } from "./viewmode.module"
import WebglRendererModule from "./webglrender.module"
import { createRotationMatrixFromQuaternion } from "../math/2569"
declare global {
  interface SymbolModule {
    [ShowcaseStartSymbol]: ShowcaseStartModule
  }
}
export default class ShowcaseStartModule extends Module {
  firstRenderPromise: OpenDeferred<any>
  flyInPromise: OpenDeferred<any>
  handleFlyIn: (e: any, t: any, i: any) => Promise<void>
  renderer: WebglRendererModule
  sweepData: SweepsData
  sweepModule: SweepDataModule
  cameraModule: CameraDataModule
  appData: AppData
  constructor() {
    super(...arguments)
    this.name = "JMYDCase-start"
    this.firstRenderPromise = new OpenDeferred()
    this.flyInPromise = new OpenDeferred()
    this.handleFlyIn = async (e, t, i) => {
      this.renderer.startRender(false)
      try {
        await this.doStandardStart(e, t, i, true)
      } catch (error) {
        this.log.error(error)
        this.renderer.startRender(true)
      }
    }
  }
  async init(_e, t: EngineContext) {
    const [settingsData, camStartData, playerOptionsData] = await Promise.all([
      t.market.waitForData(SettingsData),
      t.market.waitForData(CamStartData),
      t.market.waitForData(PlayerOptionsData)
    ])
    ;[this.sweepData, this.sweepModule, this.cameraModule, this.renderer, this.appData] = await Promise.all([
      t.market.waitForData(SweepsData),
      t.getModuleBySymbol(SweepDataSymbol),
      t.getModuleBySymbol(CameraSymbol),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.market.waitForData(AppData)
    ])
    const quickStart = settingsData.tryGetProperty("quickstart", false)
    const startingPose = this.getStartingPose(camStartData, playerOptionsData)
    const startAction = quickStart ? this.doQuickStart(startingPose, t, TransitionTypeList.Instant) : this.doStandardStart(startingPose, t, settingsData, false)
    startAction
      .catch(error => {
        this.log.error("Handling error during initial fly-in, attempting recover", { startingPose: startingPose, error }),
          this.doQuickStart(startingPose, t, TransitionTypeList.FadeToBlack),
          this.renderBeforeStarting(t)
      })
      .finally(() => this.flyInPromise.resolve()),
      this.bindings.push(
        t.commandBinder.addBinding(StartLocationFlyInCommand, async e => {
          this.handleFlyIn(e.pose || camStartData.getStartingPose(), t, settingsData)
        }),
        t.commandBinder.addBinding(StartLocationGotoCommand, async e => {
          this.fadeToStartLocation(camStartData, t)
        }),
        t.subscribe(ModelViewChangeCompleteMessage, async () => {
          this.appData.application !== AppMode.WORKSHOP && camStartData.moveCameraOnViewChange && this.fadeToStartLocation(camStartData, t)
        })
      )
    return this.waitForFirstRender
  }
  getStartingPose(e: CamStartData, t: PlayerOptionsData) {
    const i = e.getStartingPose()
    const s = !t.options.dollhouse
    const o = !t.options.floor_plan
    return (s && i.mode === ViewModes.Dollhouse) || (o && i.mode === ViewModes.Floorplan) ? new DeepLinkPose() : i
  }
  fadeToStartLocation(e, t) {
    const i = e.getStartingPose()
    this.doQuickStart(i, t, TransitionTypeList.FadeToBlack)
  }
  get waitForFirstRender() {
    return this.firstRenderPromise.nativePromise()
  }
  get waitForFlyin() {
    return this.flyInPromise.nativePromise()
  }
  async doQuickStart(e: DeepLinkPose, t: EngineContext, i: number) {
    const getStartSweep = this.sweepData.getStartSweep(e)
    const sweepID = getStartSweep && getStartSweep.id
    const getModuleBySymbol = await t.getModuleBySymbol(ModeSymbol)

    return (
      await getModuleBySymbol.switchToMode(e.mode, i, {
        sweepID,
        position: e.camera.position || (getStartSweep && getStartSweep.position),
        rotation: e.camera.rotation,
        zoom: -1 !== e.camera.zoom ? e.camera.zoom : void 0
      }),
      t.broadcast(new LoadSpinnerSuppressMessage(false)),
      (e.mode !== ViewModes.Dollhouse && e.mode !== ViewModes.Floorplan) ||
        (e.floorVisibility && (await t.commandBinder.issueCommandWhenBound(new MovetoFloorNumberCommand(e.floorVisibility.lastIndexOf(1), true, 0)))),
      this.renderBeforeStarting(t)
    )
  }
  async doStandardStart(e: DeepLinkPose, t: EngineContext, i, o) {
    const [d] = await Promise.all([t.getModuleBySymbol(ModeSymbol)])
    await t.getModuleBySymbol(ShowcaseSettingsSymbol)
    const u = !i.tryGetProperty(ShowcaseDollhouseKey, !1)
    const p = !i.tryGetProperty(ShowcaseFloorPlanKey, !1)
    e && ((e.mode === ViewModes.Dollhouse && u) || (e.mode === ViewModes.Floorplan && p) || (e.mode === ViewModes.Panorama && !e.pano)) && (e = null)
    const g = !e || (e && (e.mode === ViewModes.Dollhouse || e.mode === ViewModes.Floorplan))
    const f = !e || (e && !this.is360Pano(e) && PanoramaOrMesh(e.mode) && !u)
    const b = e ? e.mode : ViewModes.Panorama
    const D = this.sweepData.getStartSweep(e)
    const T = D && D.id
    const x = this.sweepData.getFirstSweep()
    let C = x && x.rotation

    e?.camera?.rotation && !(0, M.mB)(e.camera.rotation) && (C = e.camera.rotation)
    C && b !== ViewModes.Floorplan && (C = createRotationMatrixFromQuaternion(C))
    if (f) {
      await (
        await t.getModuleBySymbol(ModelMeshSymbol)
      ).firstMeshLoadPromise
      const i = d.getFlyinEndPose({ sweepID: T, position: e?.camera?.position, rotation: C })
      const n = d.getFlyinStartPose(i, o ? new Vector3(0, 0, 0) : void 0)
      t.broadcast(new LoadSpinnerSuppressMessage(!0))
      const l = T ? this.sweepModule.activateSweepUnsafe({ sweepId: T }) : Promise.resolve()
      await d.switchToMode(ViewModes.Dollhouse, TransitionTypeList.Instant, n)
      await this.renderBeforeStarting(t)
      await waitRun(750)
      await this.cameraModule.moveTo({ transitionType: TransitionTypeList.Interpolate, pose: i }).nativePromise()
      await l
      t.broadcast(new LoadSpinnerSuppressMessage(!1))
      await d.switchToMode(b, TransitionTypeList.Interpolate, { sweepID: T, rotation: C }, DEFAULT_TRANSITION_TIME)
    } else
      await d.switchToMode(b, TransitionTypeList.Instant, {
        sweepID: T,
        position: e?.camera?.position,
        rotation: C,
        zoom: e && -1 !== e.camera.zoom ? e.camera.zoom : void 0
      }),
        g &&
          e &&
          (e.floorVisibility
            ? await t.commandBinder.issueCommandWhenBound(new MovetoFloorNumberCommand(e.floorVisibility.lastIndexOf(1), !0, 0))
            : await t.commandBinder.issueCommandWhenBound(new MovetoFloorCommand(null))),
        await this.renderBeforeStarting(t)
  }
  is360Pano(e) {
    if (e.pano.uuid) {
      const t = this.sweepData.getSweep(e.pano.uuid)
      if (t) return t.alignmentType !== AlignmentType.ALIGNED
    } else {
      const e = this.sweepData.getFirstSweep()
      if (!!e) return e.alignmentType !== AlignmentType.ALIGNED
    }
    return !1
  }
  async renderBeforeStarting(e) {
    await this.renderer.renderOnce()
    await e.getModuleBySymbol(InitUISymbol)
    this.renderer.startRender(!0)
    this.firstRenderPromise.resolve()
  }
}
