import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { WireframeEnabledKey } from "../const/53203"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { HotKeysSymbol, InputSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { SettingsData } from "../data/settings.data"
import { ViewmodeData } from "../data/viewmode.data"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"

declare global {
  interface SymbolModule {
    [HotKeysSymbol]: ShowcaseHotkeysModule
  }
}
export default class ShowcaseHotkeysModule extends Module {
  inputCommandMap: any
  currentView: number
  meshViews: any[]
  viewmodeData: ViewmodeData
  settings: SettingsData
  cameraData: CameraData
  issueCommand: any
  constructor() {
    super(...arguments)
    this.name = "JMYDCase-hotkeys"
    this.inputCommandMap = {
      [KeyboardStateList.PRESSED]: {
        [KeyboardCode.ONE]: () => (
          this.viewmodeData.currentMode === ViewModes.Panorama && (this.settings.setProperty(WireframeEnabledKey, !1), (this.currentView = 0)),
          this.switchToMode(ViewModeCommand.INSIDE)
        ),
        [KeyboardCode.TWO]: () => this.switchToMode(ViewModeCommand.DOLLHOUSE),
        [KeyboardCode.THREE]: () => this.switchToMode(ViewModeCommand.FLOORPLAN),
        [KeyboardCode.ZERO]: () => {
          const e = this.currentView++ % this.meshViews.length
          return this.meshViews[e]()
        }
      }
    }
    this.currentView = 0
    this.meshViews = [
      () => (this.settings.setProperty(WireframeEnabledKey, !1), this.switchToMode(ViewModeCommand.MESH)),
      () => (this.settings.setProperty(WireframeEnabledKey, !0), this.switchToMode(ViewModeCommand.MESH)),
      () => (this.settings.setProperty(WireframeEnabledKey, !0), this.switchToMode(ViewModeCommand.INSIDE)),
      () => (this.settings.setProperty(WireframeEnabledKey, !1), this.switchToMode(ViewModeCommand.INSIDE))
    ]
  }
  async init(e, t) {
    const i = await t.getModuleBySymbol(InputSymbol)
    ;[this.viewmodeData, this.settings, this.cameraData] = await Promise.all([
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(SettingsData),
      t.market.waitForData(CameraData)
    ])
    this.issueCommand = t.commandBinder.issueCommand.bind(t.commandBinder)
    i.registerHandler(KeyboardCallbackEvent, async e => {
      this.inputCommandMap[e.state] && this.inputCommandMap[e.state][e.key] && (await this.inputCommandMap[e.state][e.key]())
    })
  }
  async switchToMode(e) {
    const { currentMode } = this.viewmodeData
    if (currentMode !== ViewModes.Transition) {
      const i = PanoramaOrMesh(currentMode) && (e === ViewModeCommand.MESH || e === ViewModeCommand.INSIDE) ? this.cameraData.pose.rotation : void 0
      try {
        await this.issueCommand(new ChangeViewmodeCommand(e, void 0, { rotation: i }))
      } catch (e) {
        this.log.debug("Unable to switchToMode", e)
      }
    }
  }
}
