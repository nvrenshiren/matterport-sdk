import { FeaturesNotesKey } from "../const/39693"
import { MeasureModeToggleCommand } from "../command/measurement.command"
import { MeasurementSelectCommand } from "../command/measurement.command"
import { FeaturesLabelsKey } from "../const/23037"
import { Features360ViewsKey } from "../const/360.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { SettingsToggler } from "../core/settingsToggler"
import { MeasureModeData } from "../data/measure.mode.data"
import { SearchData } from "../data/search.data"
class p {
  constructor(e, t) {
    ;(this.engine = e),
      (this.disabledAssets = {
        [FeaturesSweepPucksKey]: !1,
        [Features360ViewsKey]: !1,
        [FeaturesLabelsKey]: !1,
        [featuresMattertagsKey]: !1,
        [FeaturesNotesKey]: !1
      }),
      (this.settingsToggler = new SettingsToggler(t, this.disabledAssets)),
      (this.initPromise = this.init())
  }
  async init() {
    const { market: e } = this.engine
    ;[this.measurementModeData, this.searchData] = await Promise.all([e.waitForData(MeasureModeData), e.waitForData(SearchData)])
  }
  async activate() {
    this.settingsToggler.toggle(!0), await this.engine.commandBinder.issueCommandWhenBound(new MeasureModeToggleCommand(!0, !0))
  }
  async deactivate() {
    this.settingsToggler.toggle(!1),
      this.engine.commandBinder.issueCommand(new MeasurementSelectCommand(-1)),
      await this.engine.commandBinder.issueCommand(new MeasureModeToggleCommand(!1))
  }
  async dispose() {
    await this.initPromise
  }
}
export const S = p
