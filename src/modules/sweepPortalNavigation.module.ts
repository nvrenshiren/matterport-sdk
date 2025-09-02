import { MoveToSweepCommand } from "../command/navigation.command"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { Features360ViewsKey } from "../const/360.const"
import { TransitionTypeList } from "../const/64918"
import { setStemHeight } from "../const/78283"
import { CursorStyle } from "../const/cursor.const"
import { ModeSymbol, PortalNavSymbol, PortalSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { MeshToDataMapMessage, PortalHoverMessage } from "../message/sweep.message"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { PortalMeshState } from "../webgl/portal.mesh"
import SweepPortalMeshModule from "./sweepPortalMesh.module"
import ViewmodeModule from "./viewmode.module"
const n = setStemHeight(20)
declare global {
  interface SymbolModule {
    [PortalNavSymbol]: SweepPortalNavigationModule
  }
}
export default class SweepPortalNavigationModule extends Module {
  onChange: (e?: any) => any
  portalRenderer: SweepPortalMeshModule
  settingsData: SettingsData
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  engine: EngineContext
  cameraData: CameraData
  viewmodeModule: ViewmodeModule
  constructor() {
    super(...arguments)
    this.name = "sweep-portal-navigation"
    this.onChange = () => {
      this.portalRenderer.filter(e => {
        if (!this.settingsData.tryGetProperty(Features360ViewsKey, !0)) return PortalMeshState.HIDE
        if (!PanoramaOrMesh(this.viewmodeData.closestMode)) return PortalMeshState.HIDE
        const t = this.sweepData.getSweep(this.sweepData.currentSweep || "")
        if (t)
          if (t.alignmentType === AlignmentType.ALIGNED) {
            if (e.fromInterior && e.toExterior && e.position.distanceTo(t.position) < n) return PortalMeshState.SHOW
          } else if (t.placementType === PlacementType.MANUAL && e.fromSweep.id === t.id) return PortalMeshState.ONTOP
        return PortalMeshState.HIDE
      })
    }
  }
  async init(e, t: EngineContext) {
    this.engine = t
    ;[this.portalRenderer, this.cameraData, this.viewmodeModule, this.viewmodeData, this.sweepData, this.settingsData] = await Promise.all([
      t.getModuleBySymbol(PortalSymbol),
      t.market.waitForData(CameraData),
      t.getModuleBySymbol(ModeSymbol),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(SettingsData)
    ])
    const i = (e: string, i?) => {
      if (this.viewmodeData.currentMode && this.cameraData.canTransition()) {
        this.viewmodeData.currentMode !== ViewModes.Panorama
          ? this.viewmodeModule.switchToMode(ViewModes.Panorama, TransitionTypeList.FadeToBlack, { sweepID: e, rotation: i })
          : t.commandBinder.issueCommand(new MoveToSweepCommand({ sweep: e, rotation: i, transition: TransitionTypeList.FadeToBlack }))
      }
    }
    this.settingsData.onPropertyChanged(Features360ViewsKey, this.onChange)
    this.bindings.push(
      t.subscribe(MeshToDataMapMessage, e => {
        i(e.toSweep.id)
      }),
      t.subscribe(PortalHoverMessage, e => this.onPortalHover(e.hovered)),
      this.viewmodeData.onChanged(this.onChange),
      this.sweepData.onChanged(this.onChange)
    )
    this.onChange()
  }
  onPortalHover(e: boolean) {
    const t = e ? CursorStyle.FINGER : null
    this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(t))
  }
}
