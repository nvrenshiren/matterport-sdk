import * as x from "../other/65019"
import { MoveToSweepCommand } from "../command/navigation.command"

import { Plane } from "three"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { CanvasSymbol, ModeChangeSymbol, ModeSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { CamStartData } from "../data/camstart.data"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeCommandExceptionError, ViewmodeInvalidError } from "../error/viewmode.error"
import { calculateRayIntersection } from "../math/81729"
import { AppChangeMessage } from "../message/app.message"
import { SweepObject } from "../object/sweep.object"
import { enabledSweep, isAlignedSweep } from "../utils/sweep.utils"
import { sweepScoreByFloorPosition } from "../utils/sweepScore.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import ViewmodeModule from "./viewmode.module"

declare global {
  interface SymbolModule {
    [ModeChangeSymbol]: ViewmodeChangeModule
  }
}
export default class ViewmodeChangeModule extends Module {
  engine: EngineContext
  viewmodesModule: ViewmodeModule
  settings: SettingsData
  previousApp: any
  meshData: any

  constructor() {
    super(...arguments)
    this.name = "viewmode-change"
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.viewmodesModule = await t.getModuleBySymbol(ModeSymbol)
    this.bindings.push(
      t.subscribe(AppChangeMessage, e => this.setEnabledModes(e.application)),
      t.commandBinder.addBinding(ChangeViewmodeCommand, this.onChangeViewmodeCommand.bind(this))
    )
    Promise.all([t.market.waitForData(AppData), t.market.waitForData(SettingsData)]).then(([t, i]) => {
      this.settings = i
      x.g_(i, e.inWorkshop)
      x.CE(i, e.inWorkshop)
      this.setEnabledModes(t.application)
      this.bindings.push(
        i.onPropertyChanged(BtnText.FloorPlan, () => x.g_(i, e.inWorkshop)),
        i.onPropertyChanged(BtnText.Dollhouse, () => x.CE(i, e.inWorkshop))
      )
    })
  }

  async setEnabledModes(e) {
    if (e === AppMode.SHOWCASE) {
      this.viewmodesModule.data.isDollhouseDisabled = () => !this.settings.tryGetProperty(ShowcaseDollhouseKey, !1)
      this.viewmodesModule.data.isFloorplanDisabled = () => !this.settings.tryGetProperty(ShowcaseFloorPlanKey, !1)
      this.viewmodesModule.data.commit()
      if (this.previousApp) {
        const e = this.viewmodesModule.currentMode
        if (
          (e === ViewModes.Dollhouse && this.viewmodesModule.data.isDollhouseDisabled()) ||
          (e === ViewModes.Floorplan && this.viewmodesModule.data.isFloorplanDisabled())
        ) {
          const e = (await this.engine.market.waitForData(CamStartData)).pose
          if (e && PanoramaOrMesh(e.mode)) this.goToInsideMode(TransitionTypeList.Interpolate, { position: e.camera.position }, e.mode)
          else {
            const e = (await this.engine.market.waitForData(CameraData)).pose,
              t: SweepObject | null = (await this.engine.market.waitForData(SweepsData)).getClosestSweep(e.position, !0),
              i = t ? { position: t?.position } : void 0
            this.goToInsideMode(TransitionTypeList.Interpolate, i, ViewModes.Panorama)
          }
        }
      }
    } else e === AppMode.WORKSHOP && ((this.viewmodesModule.data.isDollhouseDisabled = () => !1), (this.viewmodesModule.data.isFloorplanDisabled = () => !1))
    const t = this.settings.tryGetProperty(DollhousePeekabooKey, !1),
      i = this.viewmodesModule.data.isFloorplanDisabled() || this.viewmodesModule.data.isDollhouseDisabled()
    this.settings.setProperty(DollhousePeekabooKey, t && !i)
    this.previousApp = e
  }

  async onChangeViewmodeCommand(e) {
    try {
      switch (e.mode) {
        case ViewModeCommand.INSIDE:
          return this.goToInsideMode(e.transitionType, e.pose, ViewModes.Panorama, e.transitionTime)
        case ViewModeCommand.DOLLHOUSE:
          return this.goToDollhouse(e.transitionType, e.pose, e.transitionTime)
        case ViewModeCommand.FLOORPLAN:
          return this.goToFloorplan(e.transitionType, e.pose, e.transitionTime)
        case ViewModeCommand.ORTHOGRAPHIC:
          return this.goToOrthographic(e.transitionType, e.pose, e.transitionTime)
        case ViewModeCommand.MESH:
          return this.goToInsideMode(e.transitionType, e.pose, ViewModes.Mesh, e.transitionTime)
      }
    } catch (t) {
      throw (this.log.error(t), new ViewmodeCommandExceptionError(`Could not move to mode ${e.mode}`, t))
    }
  }

  async goToInsideMode(e = TransitionTypeList.Interpolate, t, i?, s?) {
    const o = this.engine.market.tryGetData(SweepsData)
    if (!o) throw new ViewmodeInvalidError()
    if (!PanoramaOrMesh(i)) throw new ViewmodeInvalidError()
    let r = t?.sweepID || o.currentSweep
    if ((r || (r = await this.getLookAtSweep(o)), o.isSweepUnaligned(r))) {
      const e = o.getFirstAlignedSweep()
      r = e ? e.id : this.getFirstSweepId(o)
    }
    return PanoramaOrMesh(this.viewmodesModule.currentMode) && o.isSweepUnaligned(o.currentSweep)
      ? this.engine.commandBinder.issueCommand(
          new MoveToSweepCommand({
            sweep: r,
            rotation: t?.rotation,
            transition: TransitionTypeList.FadeToBlack
          })
        )
      : this.viewmodesModule.switchToMode(i, e, { sweepID: r, rotation: t?.rotation }, s)
  }

  async getLookAtSweep(e) {
    const t = this.engine.market.tryGetData(CameraData)
    if (!t) return this.getFirstSweepId(e)
    const i = this.engine.market.tryGetData(FloorsViewData),
      s = (null == i ? void 0 : i.getFloorMin()) || this.getModelMinHeight(),
      o = new Plane(DirectionVector.DOWN, s),
      r = calculateRayIntersection(t.pose.position, t.pose.rotation, o)
    if (!r) return this.getFirstSweepId(e)
    const n = [isAlignedSweep(), enabledSweep(), e => !i || i.isCurrentOrAllFloors(e.floorId)],
      a = [sweepScoreByFloorPosition(r)],
      h = e.sortByScore(n, a).shift()
    if (h) return h.sweep.id
    const u = e.getClosestSweep(r, !0)
    return u ? u.id : this.getFirstSweepId(e)
  }

  getFirstSweepId(e) {
    const t = e.getFirstSweep()
    if (!t) throw new Error("First enabled sweep not found")
    return t.id
  }

  getModelMinHeight() {
    if (!this.meshData) {
      this.meshData = this.engine.market.tryGetData(MeshData)
    }
    return this.meshData ? this.meshData.extendedBounds.min.y : 0
  }

  async goToDollhouse(e = TransitionTypeList.Interpolate, t = {}, i) {
    if (this.viewmodesModule.data.isDollhouseDisabled()) throw new ViewmodeInvalidError()
    return this.viewmodesModule.switchToMode(ViewModes.Dollhouse, e, t, i)
  }

  async goToFloorplan(e = TransitionTypeList.Interpolate, t = {}, i) {
    if (this.viewmodesModule.data.isFloorplanDisabled()) throw new ViewmodeInvalidError()
    const s = await this.engine.getModuleBySymbol(CanvasSymbol)
    s && (await s.getTransitionPromise())
    return this.viewmodesModule.switchToMode(ViewModes.Floorplan, e, t, i, 1)
  }

  async goToOrthographic(e = TransitionTypeList.Interpolate, t = {}, i) {
    const s = await this.engine.getModuleBySymbol(CanvasSymbol)
    s && (await s.getTransitionPromise())
    return this.viewmodesModule.switchToMode(ViewModes.Orthographic, e, t, i)
  }
}
