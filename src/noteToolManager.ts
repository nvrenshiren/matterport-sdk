import * as g from "./other/30616"
import * as f from "./other/39689"
import { NotesModeToggleCommand, NotesOpenNoteCommentCommand } from "./command/notes.command"
import { ShowToastrCommand } from "./command/ui.command"
import { ToggleToolCommand } from "./command/tool.command"
import { FeaturesLabelsKey } from "./const/23037"
import { Features360ViewsKey } from "./const/360.const"
import { NotesPhase } from "./const/38965"
import { PhraseKey } from "./const/phrase.const"
import { FeaturesSweepPucksKey } from "./const/sweep.const"
import { featuresMattertagsKey } from "./const/tag.const"
import { ToolsList } from "./const/tools.const"
import { searchModeType } from "./const/typeString.const"
import EngineContext from "./core/engineContext"
import { SettingsToggler } from "./core/settingsToggler"
import { NotesViewData } from "./data/notes.view.data"
import { SearchData } from "./data/search.data"
import { SettingsData } from "./data/settings.data"
import { getURLParams } from "./utils/urlParams.utils"

const { NOTES } = PhraseKey.SHOWCASE
export class NoteToolManager {
  engine: EngineContext
  settings: SettingsData
  disabledAssets: { "features/sweep_pucks": boolean; "features/labels": boolean; "features/360_views": boolean; "features/mattertags": boolean }
  settingsToggler: SettingsToggler
  initPromise: Promise<void>
  notesViewData: NotesViewData
  searchData: SearchData
  constructor(e, t) {
    this.engine = e
    this.settings = t
    this.disabledAssets = { [FeaturesSweepPucksKey]: !1, [FeaturesLabelsKey]: !1, [Features360ViewsKey]: !1, [featuresMattertagsKey]: !1 }
    this.settingsToggler = new SettingsToggler(this.settings, this.disabledAssets)
    this.initPromise = this.init()
  }
  async init() {
    const { market: e } = this.engine
    ;[this.notesViewData, this.searchData] = await Promise.all([e.waitForData(NotesViewData), e.waitForData(SearchData)])
    this.setSearchItemFC(!0)
  }
  async activate() {
    this.settingsToggler.toggle(!0)
    await this.initPromise
    await this.engine.commandBinder.issueCommand(new NotesModeToggleCommand(!0))
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommand(new NotesModeToggleCommand(!1))
    this.settingsToggler.toggle(!1)
  }
  async dispose() {
    await this.initPromise
    this.setSearchItemFC(!1)
  }
  setSearchItemFC(e) {
    const t = this.searchData.getSearchDataTypeGroup(searchModeType.NOTE)
    t && (t.itemFC = e ? g.c : void 0)
  }
  async deepLink(e) {
    const t = (await this.engine.market.waitForData(NotesViewData)).getNoteView(e)
    if (t)
      (0, f.W4)(this.settings, t, t => {
        this.engine.commandBinder.issueCommand(new NotesOpenNoteCommentCommand(e, !0, !1, getURLParams().comment, t))
      })
    else {
      const e = { messagePhraseKey: NOTES.MISSING_MESSAGE, timeout: 4e3, dismissesOnAction: !0 }
      this.engine.commandBinder.issueCommand(new ShowToastrCommand(e)),
        this.engine.commandBinder.issueCommandWhenBound(new ToggleToolCommand(ToolsList.NOTES, !0))
    }
  }
  async hasPendingEdits() {
    const { notesPhase: e, activeNotation: t } = this.notesViewData
    switch (e) {
      case NotesPhase.IDLE:
      case NotesPhase.CLOSED:
      case NotesPhase.OPENING:
        return !1
      case NotesPhase.EDITING:
      case NotesPhase.CREATING:
        return !0
      default:
        return !!t
    }
  }
}
