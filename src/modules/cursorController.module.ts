import { DisableCursorMeshCommand } from "../command/cursor.command"
import { FeaturesCursorKey } from "../const/cursor.const"
import { CursorControllerSymbol, CursorMeshSymbol, CursorSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { InteractionData } from "../data/interaction.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { LoadTexture } from "../utils/loadTexture"
import { PanoramaOrMesh } from "../utils/viewMode.utils"
import CursorDataModule from "./cursorData.module"
import CursorMeshModule from "./cursorMesh.module"
import cursorBg from "../images/cursor_bg.png"
import EngineContext from "../core/engineContext"
const cursorBgTexture = LoadTexture(cursorBg)
declare global {
  interface SymbolModule {
    [CursorControllerSymbol]: CursorControllerModule
  }
}
export default class CursorControllerModule extends Module {
  visibilityRules: any[]
  disabled: boolean
  cursorMesh: CursorMeshModule
  cursorModule: CursorDataModule
  constructor() {
    super(...arguments)
    this.name = "cursor-controller"
    this.visibilityRules = []
    this.disabled = !1
  }
  async init(e, t: EngineContext) {
    this.bindings.push(
      t.commandBinder.addBinding(DisableCursorMeshCommand, async e => {
        this.disabled = e.disable
      })
    )
    this.cursorMesh = await t.getModuleBySymbol(CursorMeshSymbol)
    this.cursorModule = await t.getModuleBySymbol(CursorSymbol)
    this.visibilityRules.push(
      () => {
        const e = t.market.tryGetData(ViewmodeData)
        return !!e && PanoramaOrMesh(e.closestMode)
      },
      () => {
        const e = t.market.tryGetData(SweepsData)
        return !!e && !e.isSweepUnaligned(e.currentSweep)
      },
      () => {
        const e = t.market.tryGetData(TourData)
        return !!e && !e.isTourActive()
      },
      () => {
        const e = t.market.tryGetData(InteractionData)
        return !!e && !e.isMobile()
      },
      () => {
        const e = t.market.tryGetData(SettingsData)
        return !!e && e.tryGetProperty(FeaturesCursorKey, !0)
      }
    )
    this.setTexture(cursorBgTexture)
  }
  onUpdate() {
    this.updateCursorVisibility()
  }
  addVisibilityRule(e) {
    this.visibilityRules.push(e)
  }
  removeVisibilityRule(e) {
    const t = this.visibilityRules.indexOf(e)
    ;-1 !== t && this.visibilityRules.splice(t, 1)
  }
  setFadeProps(e) {
    this.cursorModule.setFadeProps(e)
  }
  updateCursorVisibility() {
    const e = !this.disabled && this.visibilityRules.reduce((e, t) => e && t(), !0)
    this.cursorMesh.setVisible(e)
  }
  setTexture(e) {
    this.cursorModule.setTexture(e)
  }
}
