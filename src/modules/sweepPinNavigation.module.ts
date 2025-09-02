import { Quaternion } from "three"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { TransitionTypeList } from "../const/64918"
import { CursorStyle } from "../const/cursor.const"
import { InputSymbol, ModeSymbol, SweepPinMeshSymbol, SweepPinSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { Comparator } from "../utils/comparator"
import { ViewModes } from "../utils/viewMode.utils"
import { PinMesh } from "../webgl/pin.mesh"
declare global {
  interface SymbolModule {
    [SweepPinSymbol]: SweepPinNavigationModule
  }
}
export default class SweepPinNavigationModule extends Module {
  constructor() {
    super(...arguments)
    this.name = "sweep-pin-navigation"
  }
  async init(e, t: EngineContext) {
    const [i, n, g, v] = await Promise.all([
      t.getModuleBySymbol(SweepPinMeshSymbol),
      t.getModuleBySymbol(ModeSymbol),
      t.market.waitForData(ViewmodeData),
      t.getModuleBySymbol(InputSymbol)
    ])
    const y = new Quaternion()
    this.bindings.push(
      v.registerMeshHandler(InputClickerEndEvent, Comparator.isType(PinMesh), (e, t, s) => {
        var o, r
        const a = i.mapColliderToSweep(t)
        return (
          !(!a || g.transition.active) &&
          (y.set(0, 0, 0, 1).multiply(a.rotation),
          (o = a.id),
          (r = y),
          g.currentMode &&
            g.currentMode !== ViewModes.Panorama &&
            n.switchToMode(ViewModes.Panorama, TransitionTypeList.FadeToBlack, { sweepID: o, rotation: r }),
          !0)
        )
      }),
      v.registerMeshHandler(HoverMeshEvent, Comparator.isType(PinMesh), (e, n) => {
        i.mapColliderToSweep(n) && t.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER))
      }),
      v.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(PinMesh), (e, n) => {
        i.mapColliderToSweep(n) && t.commandBinder.issueCommand(new SetMouseCursorCommand(null))
      })
    )
  }
}
