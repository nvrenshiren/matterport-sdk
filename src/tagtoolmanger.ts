import { PhraseKey } from "./const/phrase.const"
import * as o from "./other/39689"
import { TagOpenCommand, TagsToggleCommand } from "./command/tag.command"
import { ShowToastrCommand } from "./command/ui.command"
import EngineContext from "./core/engineContext"
import { SettingsData } from "./data/settings.data"
import { TagsViewData } from "./data/tags.view.data"
const { TAGS } = PhraseKey.SHOWCASE
export class TagToolManger {
  engine: EngineContext
  settings: SettingsData
  constructor(e: EngineContext, t: SettingsData) {
    this.engine = e
    this.settings = t
  }
  async activate() {
    await this.engine.commandBinder.issueCommand(new TagsToggleCommand(!0))
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommand(new TagsToggleCommand(!1))
  }
  async deepLink(e: string) {
    const t = (await this.engine.market.waitForData(TagsViewData)).getTagView(e)
    if (t)
      (0, o.W4)(this.settings, t, transition => {
        this.engine.commandBinder.issueCommand(new TagOpenCommand(e, { transition, dock: !0 }))
      })
    else {
      const e = { messagePhraseKey: TAGS.MISSING_MESSAGE, timeout: 4e3, dismissesOnAction: !0 }
      this.engine.commandBinder.issueCommand(new ShowToastrCommand(e))
    }
  }
}
