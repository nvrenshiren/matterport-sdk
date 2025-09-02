import { SubmitModelRatingCommand, ToggleModelRatingDialogCommand } from "../command/model.command"
import { ToggleModalCommand } from "../command/ui.command"
import * as d from "../const/73536"
import { ModelRatingSymbol, SettingsSymbol } from "../const/symbol.const"
import { UserPreferencesKeys } from "../const/user.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { ModelData } from "../data/model.data"
import { ModelRatingViewData } from "../data/model.rating.view.data"
import { SettingsData } from "../data/settings.data"
import { ModelRatedMessage } from "../message//model.message"
import { ActivitycMessage } from "../message/activity.ping.message"
import * as l from "../other/3907"
declare global {
  interface SymbolModule {
    [ModelRatingSymbol]: ModelRatingModule
  }
}
const c = new DebugInfo("model-rating-data-store"),
  u = t => t,
  p = t => t
class m extends l.MU {
  constructor(t, e, i) {
    super({ queue: t, deserialize: u, serialize: p, path: `${e}/api/v1/jsonstore/model/model-rating/${i}` }),
      (this.queue = t),
      (this.baseUrl = e),
      (this.modelId = i)
  }
  async canPromptRating() {
    let t
    try {
      t = await this.read()
    } catch (t) {
      return c.error("Failed to read existing rating data from JSONStore"), !1
    }
    const e = !!t.rated_at
    return !!!t.prompt_dismissed_at && !e
  }
  async recordRatingSubmitted() {
    this.update({ rated_at: new Date().toISOString() })
  }
  async recordAutomaticPromptDismissed() {
    this.update({ prompt_dismissed_at: new Date().toISOString() })
  }
  async reset() {
    var t
    const e = `${this.baseUrl}/api/v1/jsonstore/model/model-rating/${this.modelId}`
    if (!(null === (t = this.modelId) || void 0 === t ? void 0 : t.length)) throw new Error(`Refusing to DELETE ${e}`)
    if (window.confirm("Are you sure you want to reset the Model Rated value for this space? This cannot be undone."))
      return this.queue.delete(e, this.options).then(() => {
        window.location.reload()
      })
  }
}
const y = t => 864e5 * t,
  b = y(1),
  D = y(7)
export default class ModelRatingModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "model-rating"),
      (this.promptEnabled = !1),
      (this.totalActiveTime = 0),
      (this.wasLastOpeningAutomatic = !1),
      (this.canPrompt = async () => {
        const t = Date.now(),
          e = +this.settings.tryGetProperty(UserPreferencesKeys.LastRatingPromptTime, null),
          i = !e || isNaN(e) || +new Date(t) - +new Date(e) >= b,
          s = await this.store.canPromptRating()
        return this.log.debug(`canPromptUser: ${i}, canPromptModel: ${s}`), i && s
      }),
      (this.handleActivitycMessage = async t => {
        if (
          ((this.totalActiveTime += t.durationDollhouse + t.durationFloorplan + t.durationInside),
          this.log.debug(`prompt timing update: totalActiveTime:${this.totalActiveTime}, threshHold: 74500`),
          this.totalActiveTime < 74500 || !this.promptEnabled)
        )
          return
        this.engine.unsubscribe(ActivitycMessage, this.handleActivitycMessage)
        if ((await this.canPrompt()) && !this.viewData.isDialogVisible) {
          this.log.debug("automatically prompting user for Model Rating")
          const t = new Date().toISOString()
          this.settings.setLocalStorageProperty(UserPreferencesKeys.LastRatingPromptTime, t),
            this.engine.commandBinder.issueCommand(new ToggleModelRatingDialogCommand(!0)),
            (this.wasLastOpeningAutomatic = !0)
        }
      }),
      (this.handleSubmitModelRatingCommand = async ({ rating: t, didFinish: e }) => {
        this.log.info(t),
          this.engine.broadcast(new ModelRatedMessage(t)),
          this.store.recordRatingSubmitted(),
          e &&
            (this.engine.commandBinder.issueCommand(new ToggleModelRatingDialogCommand(!1)),
            this.engine.commandBinder.issueCommand(new ToggleModalCommand(d.P.RATING_THANK_YOU, !0)))
      }),
      (this.handleToggleDialogCommand = async ({ toVisible: t }) => {
        this.viewData.setDialogVisible(t)
        !this.viewData.isDialogVisible && this.wasLastOpeningAutomatic && (this.store.recordAutomaticPromptDismissed(), (this.wasLastOpeningAutomatic = !1))
      })
  }
  async init(t, e) {
    ;(this.engine = e),
      (this.config = t),
      (this.viewData = new ModelRatingViewData()),
      (this.store = new m(t.queue, t.baseUrl, t.baseModelId)),
      (this.promptEnabled = t.promptEnabled),
      (this.settings = await e.market.waitForData(SettingsData)),
      (this.modelData = await e.market.waitForData(ModelData)),
      this.bindings.push(
        e.commandBinder.addBinding(ToggleModelRatingDialogCommand, this.handleToggleDialogCommand),
        e.commandBinder.addBinding(SubmitModelRatingCommand, this.handleSubmitModelRatingCommand)
      )
    const i = this.modelData.model.created
    let n = !!i && Date.now() - +new Date(i) < D
    this.promptEnabled && t.debug && (this.log.info("Debug Mode Enabled: Ignoring max model age requirement for rating prompt."), (n = !0)),
      this.log.debug(`promptEnabled: ${t.promptEnabled}, isModelEligible: ${n}`),
      this.promptEnabled && n && this.bindings.push(e.subscribe(ActivitycMessage, this.handleActivitycMessage)),
      e.market.register(this, ModelRatingViewData, this.viewData),
      this.registerSettings()
  }
  async registerSettings() {
    const t = await this.engine.getModuleBySymbol(SettingsSymbol),
      { debug: e } = this.config
    e &&
      t.registerMenuButton({
        header: "Model Rating",
        buttonName: "Reset Model Rated value",
        callback: () => {
          this.settings.setLocalStorageProperty(UserPreferencesKeys.LastRatingPromptTime, null), this.store.reset()
        }
      })
  }
  dispose(t) {
    this.bindings.forEach(t => {
      t.cancel()
    }),
      (this.bindings = []),
      super.dispose(t)
  }
}
