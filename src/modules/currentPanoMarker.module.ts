import { Mesh, Vector3 } from "three"
import { TogglePanoMarkerCommand } from "../command/pano.command"
import { PickingPriorityType } from "../const/12529"
import { CurrentPanoSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { MarkerMesh } from "../webgl/marker.mesh"
import { ShowCaseScene } from "../webgl/showcase.scene"
declare global {
  interface SymbolModule {
    [CurrentPanoSymbol]: CurrentPanoMarkerModule
  }
}
const d = new Vector3(0, 1, 0),
  c = 16724312,
  l = [
    { innerRadius: 0, outerRadius: 0.42, color: c, opacity: 0.7 },
    { innerRadius: 0.67, outerRadius: 1, color: c, opacity: 0.7 }
  ]
class Currentpanomarker {
  scene: ShowCaseScene
  sweepData: SweepsData
  mesh: Mesh
  static floorOffset = 0.01
  constructor(e, t, i) {
    ;(this.scene = e),
      (this.sweepData = t),
      (this.mesh = new MarkerMesh({ radius: 0.25, normal: d, rings: l })),
      (this.mesh.name = "CurrentPanoMarker"),
      (this.mesh.renderOrder = PickingPriorityType.panoMarker),
      (this.mesh.layers.mask = i.mask)
  }
  init() {}
  dispose() {
    this.mesh.dispose()
  }
  render() {
    const e = this.sweepData.currentAlignedSweepObject
    e && this.move(e.floorPosition)
  }
  activate() {
    this.scene.add(this.mesh)
  }
  deactivate() {
    this.scene.remove(this.mesh)
  }
  move(e) {
    this.mesh.position.copy(e).setY(e.y + Currentpanomarker.floorOffset)
  }
}

export default class CurrentPanoMarkerModule extends Module {
  state: {
    commandOverride?: any
    markerEnabled: boolean
    transitionPromise: Promise<void> | null
  }
  engine: EngineContext
  sweepData: SweepsData
  viewmodeData: ViewmodeData
  markerRenderer: Currentpanomarker
  constructor() {
    super(...arguments), (this.name = "current-pano-marker"), (this.state = { markerEnabled: !1, transitionPromise: null })
  }
  async init(e, t: EngineContext) {
    const i = (await t.getModuleBySymbol(WebglRendererSymbol)).getScene(),
      n = t.claimRenderLayer(this.name),
      [a, o] = await Promise.all([t.market.waitForData(SweepsData), t.market.waitForData(ViewmodeData)])
    ;(this.engine = t),
      (this.sweepData = a),
      (this.viewmodeData = o),
      (this.markerRenderer = new Currentpanomarker(i, a, n)),
      this.bindings.push(
        t.commandBinder.addBinding(TogglePanoMarkerCommand, async ({ enabled: e }) => this.setCommandOverride(e)),
        this.viewmodeData.makeModeChangeSubscription(() => this.updateMarker()),
        this.sweepData.makeSweepChangeSubscription(() => this.updateMarker())
      ),
      this.updateMarker()
  }
  setCommandOverride(e) {
    ;(this.state.commandOverride = e), this.updateMarker()
  }
  async updateMarker() {
    const { commandOverride: e } = this.state,
      t = this.viewmodeData.currentMode,
      i = this.sweepData.currentAlignedSweepObject,
      n = !1 === e || PanoramaOrMesh(t) || t === ViewModes.Transition
    return this.toggleMarker(!!i && !n)
  }
  async toggleMarker(e) {
    const { markerEnabled: t, transitionPromise: i } = this.state
    if ((i && (await i), t === e)) return
    const n = e ? this.enableMarker() : this.disableMarker()
    return (
      (this.state.transitionPromise = n.finally(() => {
        ;(this.state.markerEnabled = e), (this.state.transitionPromise = null)
      })),
      this.state.transitionPromise
    )
  }
  async enableMarker() {
    return this.engine.addComponent(this, this.markerRenderer)
  }
  async disableMarker() {
    return this.engine.removeComponent(this, this.markerRenderer)
  }
}
