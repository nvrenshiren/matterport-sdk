import { SettingsSymbol } from "../const/symbol.const"
import Engine from "../core/engine"

export class SettingsInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {}
  getDebugData() {
    const SettingsModule = this.engine?.getModuleBySymbolSync(SettingsSymbol)
    if (SettingsModule) {
      const { queuedControls, queuedButtons } = SettingsModule
      return [...queuedButtons, ...queuedControls]
    } else {
      return []
    }
  }
  updateSetting(config: string, val: any) {
    const SettingsModule = this.engine?.getModuleBySymbolSync(SettingsSymbol)!
    SettingsModule.updateSetting(config, val)
  }
}
