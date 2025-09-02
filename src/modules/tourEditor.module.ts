import { ToggleOptionCommand } from "../command/player.command"
import { CaptureSnapshotCommand, RenameSnapshotCommand } from "../command/snapshot.command"
import {
  AddPhotosToTourCommand,
  ClearTourCommand,
  CreateTourStopCommand,
  DeleteTourStopCommand,
  MoveTourStopCommand,
  TourChangeDescriptionCommand,
  TourChangeTitleCommand,
  TourClearAllPanningSettingsCommand,
  TourClearAllTransitionTypesCommand,
  TourRenameCommand,
  TourStopClearAllOverridesCommand,
  TourStopClearOverridesCommand,
  TourStopOverridesCommand
} from "../command/tour.command"
import { PanoSizeBaseKey } from "../const/14439"
import { SnapshotCategory } from "../const/50090"
import { PanoSizeKey } from "../const/76609"
import { WorkShopTourEditSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { Collection } from "../core/subscription"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { SnapshotsData } from "../data/snapshots.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { AddViewMessage, TourSteppedMessage } from "../message/tour.message"

declare global {
  interface SymbolModule {
    [WorkShopTourEditSymbol]: TourEditorModule
  }
}
export default class TourEditorModule extends Module {
  changeTitle: (t: any) => Promise<void>
  tourData: TourData
  changeDescription: (t: any) => Promise<void>
  onRenameTourSnapshot: (t: any, e: any) => void
  engine: EngineContext
  snapshotsData: SnapshotsData
  moveStop: (t: any) => Promise<void>
  addView: () => Promise<boolean>
  sweepData: SweepsData
  viewmodeData: ViewmodeData
  settingsData: SettingsData
  addPhotos: (t: any) => Promise<boolean>
  onDelete: (t: any) => Promise<void>
  onClear: () => Promise<void>
  onSweepEnabledChanged: (t: any) => void
  constructor() {
    super(...arguments)
    this.name = "tour-editor"
    this.changeTitle = async t => {
      const { sid: e, title: i } = t
      this.tourData.updateReelEntry({ sid: e, title: i })
    }
    this.changeDescription = async t => {
      const { sid: e, description: i } = t
      this.tourData.updateReelEntry({ sid: e, description: i })
    }
    this.onRenameTourSnapshot = (t, e) => {
      this.engine.commandBinder.issueCommand(new RenameSnapshotCommand(t, e)), this.tourData.updateSnapshots(this.snapshotsData.collection)
    }
    this.moveStop = async t => {
      if ((this.tourData.moveTourStop(t.fromSid, t.toSid), t.highlightedSid)) {
        const e = this.tourData.getTourIndexBySid(t.highlightedSid)
        this.tourData.setTourCurrentSnapshotByIndex(e)
        this.engine.broadcast(new TourSteppedMessage(e))
      }
    }
    this.addView = async () => {
      const t = this.sweepData
      if (this.viewmodeData.isInside() && t.currentSweep && !t.getSweep(t.currentSweep).enabled) return !1
      const e = this.settingsData.tryGetProperty(PanoSizeBaseKey, PanoSizeKey.BASE)
      const i = await this.engine.commandBinder.issueCommand(new CaptureSnapshotCommand({ category: SnapshotCategory.TOUR, maxSize: e }))
      0 === this.tourData.getSnapshotCount() &&
        (await this.engine.commandBinder.issueCommand(new ToggleOptionCommand({ key: BtnText.TourButtons, value: !0 })),
        await this.engine.commandBinder.issueCommand(new ToggleOptionCommand({ key: BtnText.HighlightReel, value: !0 })))
      if (i) {
        this.tourData.addSnapshotToTour(this.snapshotsData.get(i))
        const t = this.tourData.getTourIndexBySid(i)
        this.engine.broadcast(new TourSteppedMessage(t)), this.engine.broadcast(new AddViewMessage())
      }
      return !0
    }
    this.addPhotos = async t => {
      0 === this.tourData.getSnapshotCount() &&
        (await this.engine.commandBinder.issueCommand(new ToggleOptionCommand({ key: BtnText.TourButtons, value: !0 })),
        await this.engine.commandBinder.issueCommand(new ToggleOptionCommand({ key: BtnText.HighlightReel, value: !0 })))
      let e = null
      if (
        (t.photoIds.forEach(t => {
          this.tourData.addSnapshotToTour(this.snapshotsData.get(t))
          e = t
        }),
        e)
      ) {
        const t = this.tourData.getTourIndexBySid(e)
        this.engine.broadcast(new TourSteppedMessage(t))
      }
      return !0
    }
    this.onDelete = async t => {
      this.tourData.removeTourStop(t.sid)
    }
    this.onClear = async () => {
      this.tourData.clear()
    }
    this.onSweepEnabledChanged = t => {
      const e = this.tourData.getTourSnapshotsWithSweepId(t.id)
      !t.enabled &&
        e.length &&
        e.forEach(t => {
          this.tourData.removeTourStop(t)
        })
    }
  }
  async init(t, e: EngineContext) {
    this.engine = e
    this.tourData = await e.market.waitForData(TourData)
    this.snapshotsData = await e.market.waitForData(SnapshotsData)
    this.sweepData = await e.market.waitForData(SweepsData)
    this.viewmodeData = await e.market.waitForData(ViewmodeData)
    this.settingsData = await e.market.waitForData(SettingsData)

    const s = this.sweepData.getSweepList()
    const r = "enabled"
    const i = new Collection(
      s,
      r,
      (t, e) => t.onPropertyChanged(r, e),
      (t, e) => t.removeOnPropertyChanged(r, e)
    )

    this.bindings.push(
      i.createSubscription(this.onSweepEnabledChanged, !0),
      e.commandBinder.addBinding(AddPhotosToTourCommand, this.addPhotos),
      e.commandBinder.addBinding(CreateTourStopCommand, this.addView),
      e.commandBinder.addBinding(DeleteTourStopCommand, this.onDelete),
      e.commandBinder.addBinding(ClearTourCommand, this.onClear),
      e.commandBinder.addBinding(MoveTourStopCommand, this.moveStop),
      e.commandBinder.addBinding(TourChangeTitleCommand, this.changeTitle),
      e.commandBinder.addBinding(TourChangeDescriptionCommand, this.changeDescription),
      e.commandBinder.addBinding(TourRenameCommand, async t => this.onRenameTourSnapshot(t.sid, t.name)),
      e.commandBinder.addBinding(TourStopOverridesCommand, async t => this.tourData.applyHighlightOverrides(t.sid, t.overrides)),
      e.commandBinder.addBinding(TourStopClearOverridesCommand, async t => this.tourData.clearHighlightOverrides(t.sid, t.transition, t.pan)),
      e.commandBinder.addBinding(TourStopClearAllOverridesCommand, async () => this.tourData.clearAllHighlightOverrides()),
      e.commandBinder.addBinding(TourClearAllTransitionTypesCommand, async () => this.tourData.resetAllTransitionTypeOverrides()),
      e.commandBinder.addBinding(TourClearAllPanningSettingsCommand, async () => this.tourData.resetAllPanSettingOverrides())
    )
  }
  async dispose(t) {
    super.dispose(t)
  }
}
