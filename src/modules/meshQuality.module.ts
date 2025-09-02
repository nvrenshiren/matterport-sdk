import { RenderMode } from "../const/24048"
import { InteractionMode } from "../const/57053"
import { TextureLOD } from "../const/80626"
import { MeshTextureQuality } from "../const/99935"
import { ModelMeshQualitySymbol, ModelMeshSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppData } from "../data/app.data"
import { InteractionData } from "../data/interaction.data"
import { MeasureModeData } from "../data/measure.mode.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { InteractionModeChangedMessage } from "../message/interaction.message"
import { EndMoveToSweepMessage, MoveToSweepBeginMessage, SweepDataMessage } from "../message/sweep.message"
import { TourStartedMessage, TourStoppedMessage } from "../message/tour.message"
import { StartViewmodeChange } from "../message/viewmode.message"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import ModelMeshModule from "./modelMesh.module"

declare global {
  interface SymbolModule {
    [ModelMeshQualitySymbol]: MeshQualityModule
  }
}
export default class MeshQualityModule extends Module {
  engine: EngineContext
  measurementModeData: MeasureModeData | null
  modelMeshModule: ModelMeshModule
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  appData: AppData
  interactionModeData: InteractionData
  config: {
    maxQuality: any
    textureLOD: TextureLOD.RAYCAST
    textureLODThreshold
  }
  updateMaxQuality: (e?) => void

  constructor() {
    super(...arguments)
    this.name = "mesh-quality"
    this.measurementModeData = null
    this.updateMaxQuality = (() => {
      let e, t, i
      return ({ modeChange: s, criticalChange: o, interactionChange: r }) => {
        void 0 !== o && (t = o)
        void 0 !== s && (e = s)
        void 0 !== r && (i = r)
        const n = i === InteractionMode.VrOrientOnly || i === InteractionMode.VrWithController || i === InteractionMode.VrWithTrackedController
        const a = this.modelMeshModule.stats()
        const h = a.textureCount <= this.config.textureLODThreshold ? Math.max(MeshTextureQuality.ULTRA, this.config.maxQuality) : MeshTextureQuality.MEDIUM
        const l = Math.max(h, e === ViewModes.Panorama && 0 === this.modelMeshModule.meshGroupVisuals.meshTextureOpacity.value ? h : this.config.maxQuality)
        this.modelMeshModule.setTextureLimits(h, l)
        const d = this.viewmodeData.currentMode !== ViewModes.Dollhouse && this.viewmodeData.currentMode !== ViewModes.Floorplan
        const c = this.viewmodeData.transition.active && PanoramaOrMesh(this.viewmodeData.transition.to)
        n || c || ((a.streaming || t) && d)
          ? this.modelMeshModule.setTextureStreamMode(TextureLOD.NONE)
          : this.modelMeshModule.setTextureStreamMode(this.config.textureLOD)
      }
    })()
  }

  async init(e, t: EngineContext) {
    this.config = e
    this.engine = t
    ;[this.modelMeshModule, this.viewmodeData, this.sweepData, this.appData, this.interactionModeData] = await Promise.all([
      t.getModuleBySymbol(ModelMeshSymbol),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(AppData),
      t.market.waitForData(InteractionData)
    ])
    await this.modelMeshModule.firstMeshLoadPromise
    this.bindAppEventsToTextureQuality()
    this.bindAppEventsToTextureVisibility()
    this.updateMaxQuality({})
    this.showcaseMeshDetailRules()
  }

  bindAppEventsToTextureQuality() {
    let e = 0
    const t = this.modelMeshModule.meshGroupVisuals.meshTextureOpacity
    this.bindings.push(
      t.onChanged(() => {
        t.value !== e && this.updateMaxQuality({}), (e = t.value)
      }),
      this.appData.onPhase(() => {
        this.updateMaxQuality({})
      }),
      this.engine.subscribe(StartViewmodeChange, e => {
        this.updateMaxQuality({ criticalChange: !0, modeChange: e.toMode })
      }),
      this.engine.subscribe(EndSwitchViewmodeMessage, e => {
        this.updateMaxQuality({ criticalChange: !1, modeChange: e.toMode })
      }),
      this.engine.subscribe(TourStartedMessage, () => {
        this.updateMaxQuality({ criticalChange: !0 })
      }),
      this.engine.subscribe(TourStoppedMessage, () => {
        this.updateMaxQuality({ criticalChange: !1 })
      }),
      this.engine.subscribe(MoveToSweepBeginMessage, () => {
        this.updateMaxQuality({ criticalChange: !0 })
      }),
      this.engine.subscribe(EndMoveToSweepMessage, () => {
        this.updateMaxQuality({ criticalChange: !1 })
      }),
      this.engine.subscribe(InteractionModeChangedMessage, e => {
        this.updateMaxQuality({ interactionChange: e.mode })
      })
    )
  }

  showcaseMeshDetailRules() {
    const { modelMeshModule: e, log: t } = this,
      i = () => this.appData.phase <= this.appData.phases.LOADING,
      s = () => this.appData.phase === this.appData.phases.STARTING,
      o = () => this.appData.phase >= this.appData.phases.PLAYING && this.appData.phase !== this.appData.phases.ERROR,
      r = () => this.appData.phase === this.appData.phases.ERROR,
      n = e => this.viewmodeData.closestMode === e,
      a = () => n(ViewModes.Panorama),
      l = () => this.viewmodeData.transition.active,
      d = e => l() && this.viewmodeData.transition.to === e,
      c = () => {
        var e, t
        return null !== (t = null === (e = this.measurementModeData) || void 0 === e ? void 0 : e.isEditingOrCreating()) && void 0 !== t && t
      },
      u = () => this.interactionModeData.isVR(),
      m = () => void 0 !== this.sweepData.currentAlignedSweepObject

    function p() {
      const h = e.getMeshDetail()
      let p = h
      o()
        ? l()
          ? (d(ViewModes.Dollhouse) || d(ViewModes.Floorplan) || d(ViewModes.Mesh)) && (p = "max")
          : ((p = "default"),
            a() && u() && (p = "minimal"),
            a() && !m() && (p = "minimal"),
            a() && c() && (p = "max"),
            (n(ViewModes.Dollhouse) || n(ViewModes.Floorplan) || n(ViewModes.Mesh)) && (p = "max"))
        : (i() && (p = "minimal"), r() && (p = "minimal"), s() && (p = "default")),
        h !== p && (t.debug(`overrideMaxDetail from ${h} to ${p}`), e.setMeshOptions({ overrideMaxDetail: p }))
    }

    this.bindings.push(
      this.appData.onPhase(p),
      this.viewmodeData.onChanged(p),
      this.modelMeshModule.meshGroupVisuals.meshTextureOpacity.onComplete(p),
      this.interactionModeData.onChanged(p)
    )
    this.engine.market.waitForData(MeasureModeData).then(e => {
      this.bindings.push(e.onPhaseChanged(p))
      this.measurementModeData = e
    })
    p()
  }

  bindAppEventsToTextureVisibility() {
    this.bindings.push(
      this.engine.subscribe(SweepDataMessage, e => {
        const t = this.sweepData.isSweepUnaligned(e.toSweep)
        t !== this.sweepData.isSweepUnaligned(e.fromSweep) && this.modelMeshModule.setRenderMode(t ? RenderMode.PanoramaCube : RenderMode.PanoramaMesh)
      })
    )
  }
}
