import { Object3D, Scene, Vector3 } from "three"
import { PinUnselectCommand } from "../command/pin.command"
import { HoverSweepCommand, SelectSweepCommand } from "../command/sweep.command"
import { Features360ViewsKey } from "../const/360.const"
import * as A from "../const/71161"
import { PanoSizeKey } from "../const/76609"
import { Apiv2Symbol, InputSymbol, SweepPinMeshSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { SettingsData } from "../data/settings.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { StartMoveToFloorMessage } from "../message//floor.message"
import { PinNumbererMessage, SelectSweepViewDataMessage, UnalignedRotateEndMessage, UnalignedRotateStartMessage } from "../message/sweep.message"
import { AlignmentType, PlacementType, SweepObject } from "../object/sweep.object"
import { Comparator } from "../utils/comparator"
import { isManualSweep } from "../utils/sweep.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { PinMesh, PinMeshObject } from "../webgl/pin.mesh"
import { ShowcaseTextureLoader } from "../webgl/texture.loader"
import EngineContext from "../core/engineContext"
import WebglRendererModule from "./webglrender.module"
import InputIniModule from "./inputIni.module"
import { RenderLayer } from "../core/layers"
declare global {
  interface SymbolModule {
    [SweepPinMeshSymbol]: SweepPinMeshModule
  }
}
const g = new DebugInfo("pin-mesh")
class PinRenderer {
  static MENU_CLEAR_DEBOUNCE = 100
  sweepViewData: SweepsViewData
  scene: Scene
  sweepTextureLoader: ShowcaseTextureLoader
  input: InputIniModule
  layer: RenderLayer
  container: Object3D
  bindings: ISubscription[]
  visibilityFilter: (e?: SweepObject) => boolean
  updatePlacementType: (e: SweepObject, t: number) => void
  dataToMeshMap: Record<string, PinMeshObject>
  engine: EngineContext
  hoverSweep: (e: string, t: boolean) => void
  meshes: PinMeshObject[]
  meshToDataMap: Record<number, { id: number; sweep: SweepObject }>
  cameraData: CameraData
  issueCommand: EngineContext["commandBinder"]["issueCommand"]
  constructor(e: SweepsViewData, t, i, n, s, o) {
    this.sweepViewData = e
    this.scene = t
    this.sweepTextureLoader = i
    this.input = n
    this.layer = o
    this.container = new Object3D()
    this.bindings = []
    this.visibilityFilter = () => !0
    this.updatePlacementType = (e, t) => {
      this.dataToMeshMap[e.id] || e.placementType !== PlacementType.MANUAL
        ? this.dataToMeshMap[e.id] &&
          e.placementType !== PlacementType.MANUAL &&
          (this.removePinMesh(e), this.engine.broadcast(new PinNumbererMessage(e.id, t, !1)))
        : (this.createPinMesh(e, this.cameraData), this.engine.broadcast(new PinNumbererMessage(e.id, t, !0)))
    }
    this.hoverSweep = (e, t) => {
      this.issueCommand(new HoverSweepCommand(e, t, 0))
      const i = this.sweepViewData.selectedSweep === e
      this.highlightPin(e, t || i)
    }
    this.meshes = []
    this.meshToDataMap = {}
    this.dataToMeshMap = {}
    this.cameraData = s
    e.iterate(t => {
      t.alignmentType !== AlignmentType.ALIGNED &&
        (t.placementType === PlacementType.MANUAL && this.createPinMesh(t, s),
        this.bindings.push(
          t.onChanged(() => {
            const i = e.getIndexByAlignment(!1, t.id)
            this.updatePlacementType(t, i)
            isManualSweep(t) && this.updatePinMeshPosition(t.id, t.position)
          })
        ))
    })
  }

  updatePinMeshPosition(e: string, t: Vector3) {
    this.mapSweepToMesh(e).updatePosition(t)
  }
  mapSweepToMesh(e: string) {
    return this.dataToMeshMap[e]
  }
  mapColliderToSweep(e: PinMesh) {
    const t = e.hasOwnProperty("collider") ? e : e.parent
    if (t) {
      const e = this.meshToDataMap[t.id]
      if (e) return e.sweep
    }
    return null
  }
  filter(e) {
    this.visibilityFilter = e
    for (const e of this.meshes) this.filterMesh(e)
  }
  init() {}
  dispose() {
    for (const e in this.meshToDataMap) {
      const t = this.meshToDataMap[e]
      this.removePinMesh(t.sweep)
    }
  }
  render(e) {
    for (const t of this.meshes) t.render(e)
  }
  activate(e: EngineContext) {
    this.engine = e
    this.issueCommand = e.commandBinder.issueCommand.bind(e.commandBinder)
    this.bindings.push(this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(PinMesh), (e, t) => this.onHoverEvent(t, !0)))
    this.bindings.push(this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PinMesh), (e, t) => this.onHoverEvent(t, !1)))
    this.scene.add(this.container)
  }
  deactivate(e) {
    for (const e of this.bindings) e.cancel()
    ;(this.bindings.length = 0), this.scene.remove(this.container)
  }
  getMeshes() {
    return this.meshToDataMap
  }
  highlightPin(e, t) {
    this.dataToMeshMap[e] && this.dataToMeshMap[e].setPinHover(t ? 1 : 0, !1)
  }
  lockSelection(e, t) {
    return t && (this.engine.broadcast(new SelectSweepViewDataMessage(e.id, !0)), this.hoverSweep(e.id, !0)), !0
  }
  createPinMesh(e: SweepObject, t: CameraData) {
    const i = new PinMeshObject(e.position, null, t, this.layer)
    this.meshes.push(i)
    this.dataToMeshMap[e.id] = i
    this.meshToDataMap[i.id] = { id: i.id, sweep: e }
    this.container.add(i)
    this.filterMesh(i)
    this.sweepTextureLoader
      .loadFace(e, PanoSizeKey.BASE, 1, { flipY: !0 })
      .then(e => {
        i.material.uniforms.tPinHole.value = e
      })
      .catch(t => {
        g.error(`${e.id} failed to load texture: ${t}`)
      })
  }
  removePinMesh(e: SweepObject) {
    const t = this.dataToMeshMap[e.id],
      i = this.meshes.findIndex(e => e.id === t.id)
    this.meshes.splice(i, 1), this.container.remove(t), this.deactivateMesh(t), delete this.meshToDataMap[t.id], delete this.dataToMeshMap[e.id], t.dispose()
  }
  filterMesh(e: PinMeshObject) {
    const t = this.meshToDataMap[e.id]
    if (t) {
      const i = t.sweep
      this.visibilityFilter(i) ? this.activateMesh(e) : this.deactivateMesh(e)
    }
  }
  onHoverEvent(e: PinMesh, t: boolean) {
    const i = this.mapColliderToSweep(e)
    i && this.hoverSweep(i.id, t)
  }
  activateMesh(e: PinMeshObject) {
    this.input.registerMesh(e.collider, !1), e.activate()
  }
  deactivateMesh(e: PinMeshObject) {
    this.input.unregisterMesh(e.collider)
    const t = this.meshToDataMap[e.id]
    t && (this.hoverSweep(t.sweep.id, !1), e.deactivate())
  }
}

export default class SweepPinMeshModule extends Module {
  onChange: () => void
  sweepViewData: SweepsViewData
  pinRenderer: PinRenderer
  settingsData: SettingsData
  viewmodeData: ViewmodeData
  nextFloor: string | null
  config: any
  applicationData: AppData
  onSelectedPinChange: () => void
  engine: EngineContext
  webglRenderer: WebglRendererModule
  input: InputIniModule
  cameraData: CameraData
  floorsViewData: FloorsViewData
  constructor() {
    super(...arguments)
    this.name = "sweep-pin-mesh"
    this.onChange = () => {
      const e = this.sweepViewData,
        t = e.selectedSweep,
        i = e.toolState === A._.ROTATING || e.toolState === A._.ROTATED
      this.pinRenderer.filter(e => {
        if (!this.settingsData.tryGetProperty(Features360ViewsKey, !0)) return !1
        if (i && t === e.id) return !1
        if (this.viewmodeData.transition.active && PanoramaOrMesh(this.viewmodeData.transition.to)) return !1
        const n = !this.nextFloor || this.nextFloor === e.floorId || !e.floorId,
          s = this.config.showPinsInFloorplanDollhouse || this.applicationData.application === AppMode.WORKSHOP,
          a = this.viewmodeData.closestMode === ViewModes.Dollhouse || this.viewmodeData.closestMode === ViewModes.Floorplan
        return n && a && s
      })
    }
    this.onSelectedPinChange = () => {
      const e = this.sweepViewData.selectedSweep
      e && (this.engine.commandBinder.issueCommand(new SelectSweepCommand(e, !0, 0)), this.pinRenderer.highlightPin(e, !0))
    }
  }
  async init(e, t: EngineContext) {
    var i
    ;[this.webglRenderer, this.input, this.sweepViewData, this.cameraData, this.settingsData, this.viewmodeData, this.floorsViewData, this.applicationData] =
      await Promise.all([
        t.getModuleBySymbol(WebglRendererSymbol),
        t.getModuleBySymbol(InputSymbol),
        t.market.waitForData(SweepsViewData),
        t.market.waitForData(CameraData),
        t.market.waitForData(SettingsData),
        t.market.waitForData(ViewmodeData),
        t.market.waitForData(FloorsViewData),
        t.market.waitForData(AppData)
      ])
    const n = await t.getModuleBySymbol(Apiv2Symbol)
    const a = t.claimRenderLayer(this.name)
    const o = this.webglRenderer.getScene().scene
    this.config = { showPinsInFloorplanDollhouse: e?.showPinsInFloorplanDollhouse }
    this.engine = t
    const r = new ShowcaseTextureLoader(n.getApi())
    this.pinRenderer = new PinRenderer(this.sweepViewData, o, r, this.input, this.cameraData, a)
    t.addComponent(this, this.pinRenderer)
    this.bindings.push(
      this.applicationData.onPropertyChanged("application", this.onChange),
      this.settingsData.onPropertyChanged(Features360ViewsKey, this.onChange),
      this.viewmodeData.onChanged(this.onChange),
      this.sweepViewData.onSelectedSweepChanged(this.onSelectedPinChange),
      t.subscribe(StartMoveToFloorMessage, e => {
        ;(this.nextFloor = e.to), this.onChange()
      }),
      t.subscribe(UnalignedRotateStartMessage, this.onChange),
      t.subscribe(UnalignedRotateEndMessage, this.onChange),
      t.commandBinder.addBinding(PinUnselectCommand, async e => {
        this.pinRenderer.highlightPin(e.id, !1)
      })
    )
    this.nextFloor = this.floorsViewData.currentFloorId
    this.onChange()
  }
  mapColliderToSweep(e) {
    return this.pinRenderer.mapColliderToSweep(e)
  }
  selectPinMesh(e, t) {
    return this.pinRenderer.lockSelection(e, t)
  }
  highlightPinMesh(e, t) {
    this.pinRenderer.highlightPin(e, t)
  }
  mapSweepToMesh(e) {
    return this.pinRenderer.mapSweepToMesh(e)
  }
  updatePosition(e, t) {
    this.pinRenderer.updatePinMeshPosition(e, t)
  }
}
