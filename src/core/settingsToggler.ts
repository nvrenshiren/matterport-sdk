import { SettingsData } from "../data/settings.data"
import { SettingsDataProperties } from "../interface/settings.interface"

export class SettingsToggler {
  settingsData: SettingsData
  settings: SettingsDataProperties
  cache: Partial<SettingsDataProperties>
  toggle: (e: any) => void
  constructor(e, t) {
    this.settingsData = e
    this.settings = t
    this.cache = {}
    this.toggle = e => {
      e ? this.apply() : this.reset()
    }
  }
  apply() {
    this.cache = {}
    for (const e of Object.keys(this.settings)) {
      const t = this.settingsData.tryGetProperty(e as keyof SettingsDataProperties, void 0)
      t !== this.settings[e] && ((this.cache[e] = t), this.settingsData.setProperty(e as keyof SettingsDataProperties, this.settings[e]))
    }
  }
  reset() {
    for (const e of Object.keys(this.cache)) {
      const t = this.cache[e]
      this.settingsData.setProperty(e as keyof SettingsDataProperties, void 0 !== t && t)
    }
    this.cache = {}
  }
}
