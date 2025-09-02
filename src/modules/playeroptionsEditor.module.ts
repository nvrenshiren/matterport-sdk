import {
  PlayerOptionSettingsCommand,
  PlayerOptionsResetTourDefaultsCommand,
  PlayerOptionsSetPanDirectionCommand,
  SetBackgroundColorCommand,
  SetUnitsCommand,
  ToggleOptionCommand
} from "../command/player.command"
import { SettingsSymbol, WorkShopOptionsEditSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { BtnText, PlayerOptionsData } from "../data/player.options.data"
import { UpdateDefaultsDirectionMessage, UpdateDefaultsTransitionsMessage } from "../message/player.message"
declare global {
  interface SymbolModule {
    [WorkShopOptionsEditSymbol]: PlayeroptionsEditorModule
  }
}
export default class PlayeroptionsEditorModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "playeroptions-editor"),
      (this.setOptionPair = async t => {
        this.setOption(t.key, t.value)
      }),
      (this.setOption = (t, e) => {
        ;(this.playerOptionsData.options[t] = e),
          t === BtnText.InstantTransitions && this.engine.broadcast(new UpdateDefaultsTransitionsMessage()),
          t === BtnText.PanDirection && this.engine.broadcast(new UpdateDefaultsDirectionMessage()),
          this.settings.hasProperty(t) && this.settings.updateSetting(t, e),
          this.playerOptionsData.options.commit()
      }),
      (this.setOptions = async t => {
        for (const e in t) {
          const i = e,
            s = t[e]
          this.setOption(i, s)
        }
      }),
      (this.setUnits = async t => {
        this.setOption(BtnText.Units, t.value)
      }),
      (this.setBackgroundColor = async t => {
        this.setOption(BtnText.BackgroundColor, t.backgroundColor)
      }),
      (this.setPanDirection = async t => {
        this.setOption(BtnText.PanDirection, t.panDirection)
      }),
      (this.resetTourDefaults = async () => {
        const t = this.playerOptionsData.options,
          e = t.fast_transitions,
          i = t.pan_direction
        this.playerOptionsData.resetDefaultTourOptions(),
          i !== t.pan_direction && this.engine.broadcast(new UpdateDefaultsDirectionMessage()),
          e !== t.fast_transitions && this.engine.broadcast(new UpdateDefaultsTransitionsMessage()),
          this.settings.hasProperty(BtnText.InstantTransitions) && this.settings.updateSetting(BtnText.InstantTransitions, t.fast_transitions),
          this.settings.hasProperty(BtnText.TransitionSpeed) && this.settings.updateSetting(BtnText.TransitionSpeed, t.transition_speed),
          this.settings.hasProperty(BtnText.TransitionTime) && this.settings.updateSetting(BtnText.TransitionTime, t.transition_time),
          this.settings.hasProperty(BtnText.PanSpeed) && this.settings.updateSetting(BtnText.PanSpeed, t.pan_speed),
          this.settings.hasProperty(BtnText.DollhousePanSpeed) && this.settings.updateSetting(BtnText.DollhousePanSpeed, t.dollhouse_pan_speed),
          this.settings.hasProperty(BtnText.ZoomDuration) && this.settings.updateSetting(BtnText.ZoomDuration, t.zoom_duration),
          this.settings.hasProperty(BtnText.PanAngle) && this.settings.updateSetting(BtnText.PanAngle, t.pan_angle),
          this.settings.hasProperty(BtnText.PanDirection) && this.settings.updateSetting(BtnText.PanDirection, t.pan_direction)
      })
  }
  async init(t, e) {
    const [i, s] = await Promise.all([await e.market.waitForData(PlayerOptionsData), await e.getModuleBySymbol(SettingsSymbol)])
    ;(this.playerOptionsData = i),
      (this.settings = s),
      (this.engine = e),
      this.bindings.push(e.commandBinder.addBinding(ToggleOptionCommand, this.setOptionPair)),
      this.bindings.push(e.commandBinder.addBinding(PlayerOptionSettingsCommand, this.setOptions)),
      this.bindings.push(e.commandBinder.addBinding(SetUnitsCommand, this.setUnits)),
      this.bindings.push(e.commandBinder.addBinding(SetBackgroundColorCommand, this.setBackgroundColor)),
      this.bindings.push(e.commandBinder.addBinding(PlayerOptionsSetPanDirectionCommand, this.setPanDirection)),
      this.bindings.push(e.commandBinder.addBinding(PlayerOptionsResetTourDefaultsCommand, this.resetTourDefaults))
  }
  dispose(t) {
    super.dispose(t)
  }
}
