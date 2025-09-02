import { ToolPalette } from "../const/tools.const"
import { SettingsDataProperties } from "../interface/settings.interface"
import { ObservableObject } from "../observable/observable.object"
export class ToolObject extends ObservableObject {
  id: string
  order: number
  showModeControls: boolean
  showTourControls: boolean
  namePhraseKey: string
  panelBar?: any
  panel: boolean
  icon: string
  analytic: string
  palette: ToolPalette
  allViewsPhraseKey: string

  dimmed: boolean
  enabled: boolean
  manager: any
  ui: any
  featureFlag: keyof SettingsDataProperties
  helpMessagePhraseKey: string
  helpHref: string
  panelLeft?: boolean
  hidesAppBar?: boolean
  constructor(e) {
    super()
    this.order = 1e4
    this.showModeControls = !0
    this.showTourControls = !0
    e && Object.assign(this, e)
  }
}
