import { SaveCommand } from "../command/save.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand } from "../command/searchQuery.command"
import { HighlightReelShowStoryTextCommand, HighlightReelToggleOpenCommand, TourStepCommand, TourSetTourModeCommand } from "../command/tour.command"
import { AggregationType } from "../const/2541"
import { TransitionTypeList } from "../const/64918"
import { DataType } from "../const/79728"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, StorageSymbol, ToursDataSymbol } from "../const/symbol.const"
import { TourMode } from "../const/tour.const"
import { PanDirectionList, TransitionType } from "../const/transition.const"
import { directionType, searchModeType, tourModeType, transitionType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { AppData } from "../data/app.data"
import { LayersData } from "../data/layers.data"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { SnapshotsData } from "../data/snapshots.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData } from "../data/tour.data"
import { ToursViewData } from "../data/tours.view.data"
import { TourStoryMessage } from "../message/tour.message"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
import { ObservableObject } from "../observable/observable.object"
import { TargetMonitors } from "../observable/targetMonitors"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import * as _ from "../other/97478"
import { BaseParser } from "../parser/baseParser"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import GetHighlightReel from "../test/GetHighlightReel"
import { noNull } from "../utils/29282"
import { isRealNumber } from "../utils/37519"
import { getDayTag } from "../utils/date.utils"
import { ViewModes } from "../utils/viewMode.utils"
declare global {
  interface SymbolModule {
    [ToursDataSymbol]: ToursDataModule
  }
}
interface HighlightReelItem {
  sid: string
  title?: string
  description?: string
  overrides?: {
    panDirection?: number
    transitionType?: TransitionType
    panAngle?: number
    snapshotPanDuration?: number
  }
  playName?: any
  pathAudio?: any
  backOpen?: any
  closePrev?: any
}
export class HighlightReel extends ObservableObject {
  reel: ObservableArray<HighlightReelItem>
  modified: Date
  mode: tourModeType
  sid: string
  constructor(t: tourModeType) {
    super()
    this.reel = createObservableArray([])
    this.modified = new Date()
    this.mode = t
    this.commit()
  }
  replace(t: HighlightReel) {
    this.atomic(() => {
      this.sid = t.sid
      this.reel.replace(Array.from(t.reel.values()))
      this.mode = t.mode
      this.modified = t.modified
    })
  }
}
const I = new DebugInfo("mds-reel-element-serializer")
const transitionTypeMap = {
  [transitionType.FADE_TO_BLACK]: TransitionTypeList.FadeToBlack,
  [transitionType.INSTANT]: TransitionTypeList.Instant,
  [transitionType.INTERPOLATE]: TransitionTypeList.Interpolate
}
const directionTypeMap = {
  [directionType.LEFT]: PanDirectionList.Left,
  [directionType.RIGHT]: PanDirectionList.Right,
  [directionType.AUTO]: PanDirectionList.Auto
}
class ReelEntrySerializer {
  deserialize(t) {
    if (!t || !t.asset?.id) return I.debug("Deserialized invalid highlight reel entry from MDS", t), null
    const { playName, pathAudio, backOpen, closePrev } = t
    const i = t.overrides
    const s: any = {}
    const n = i?.transitionType ? transitionTypeMap[i.transitionType] : void 0
    const o = i?.panDirection ? directionTypeMap[i.panDirection] : void 0
    const a = i?.panAngle
    const snapshotPanDuration = i?.snapshotPanDuration
    noNull(n) && (s.transitionType = n)
    noNull(o) && (s.panDirection = o)
    isRealNumber(a) && (s.panAngle = a)
    isRealNumber(snapshotPanDuration) && (s.snapshotPanDuration = snapshotPanDuration)
    const r: any = { sid: t.asset.id, overrides: s, playName, pathAudio, backOpen, closePrev }
    t.title && (r.title = t.title)
    t.description && (r.description = t.description)
    return r
  }
}
const E = new DebugInfo("mds-highlight-reel-serializer")
class TourDeserializer {
  defaultTourMode: tourModeType
  reelEntrySerializer: ReelEntrySerializer
  constructor(t) {
    this.defaultTourMode = t
    this.reelEntrySerializer = new ReelEntrySerializer()
  }
  deserialize(t) {
    if (!t || !this.validate(t)) return E.debug("Deserialized invalid active reel data from MDS", t), null
    const e = new HighlightReel(t.mode || this.defaultTourMode)
    // e.sid = t.id
    e.sid = "jimuyida"
    if (t) {
      for (const i of t) {
        if (!i) continue
        const t = this.reelEntrySerializer.deserialize(i)
        t && e.reel.push(t)
      }
    }

    return e
  }
  validate(t) {
    return !0
  }
}
const TransitionTypeListMap = {
  [TransitionTypeList.FadeToBlack]: transitionType.FADE_TO_BLACK,
  [TransitionTypeList.Instant]: transitionType.INSTANT,
  [TransitionTypeList.Interpolate]: transitionType.INTERPOLATE,
  [TransitionTypeList.MoveToBlack]: transitionType.FADE_TO_BLACK,
  [TransitionTypeList.OrbitTo]: transitionType.INTERPOLATE
}
const PanDirectionListMap = {
  [PanDirectionList.Left]: directionType.LEFT,
  [PanDirectionList.Right]: directionType.RIGHT,
  [PanDirectionList.Auto]: directionType.AUTO
}
export class TourSerializer {
  serialize(t: HighlightReelItem) {
    const { playName, pathAudio, backOpen, closePrev } = t
    const e: any = { id: t.sid, playName, pathAudio, backOpen, closePrev }
    t.title && (e.title = t.title)
    t.description && (e.description = t.description)
    t.overrides &&
      ((e.overrides = {}),
      void 0 !== t.overrides.transitionType && (e.overrides.transitionType = TransitionTypeListMap[t.overrides.transitionType]),
      void 0 !== t.overrides.panDirection && (e.overrides.panDirection = PanDirectionListMap[t.overrides.panDirection]),
      void 0 !== t.overrides.panAngle && (e.overrides.panAngle = t.overrides.panAngle),
      void 0 !== t.overrides.snapshotPanDuration && (e.overrides.snapshotPanDuration = t.overrides.snapshotPanDuration))
    return e
  }
}
const A = new DebugInfo("mds-highlight-reel-store")
class TourStore extends MdsStore {
  baseModelId: any
  serializer: TourSerializer
  prefetchKey: string
  deserializer: TourDeserializer
  constructor(t, e, i) {
    super(t)
    this.baseModelId = i
    this.serializer = new TourSerializer()
    this.prefetchKey = "data.model.activeHighlightReel"
    this.deserializer = new TourDeserializer(e)
  }
  async read(t) {
    const { readonly } = this.config
    //pw
    // const e = { modelId: this.getViewId(), prefetchKey: this.prefetchKey }
    // return this.query(p.GetHighlightReel, e, t).then(t => {
    //   const s = t.data?.model?.activeHighlightReel
    //   return this.deserializer.deserialize(s)
    // })
    const data = await GetHighlightReel(this.baseModelId, !readonly)
    return this.deserializer.deserialize(data)
  }
  async update(t: HighlightReel) {
    //pw
    const e = this.getViewId(),
      i = t.reel.map(t => this.serializer.serialize(t)),
      s = t.mode
    // return this.mutate(p.PutActiveReel, { modelId: e, elements: i, mode: s }).then(async t => {
    //   A.debug(t)
    // })
    return Promise.resolve()
  }
  async fetchAllTourSweeps() {
    //pw
    // const i = { modelId: this.baseModelId }
    // const s = (await this.query(p.GetHighlightReelSweeps, i, { fetchPolicy: "no-cache" })).data?.model?.views
    // const n: Array<{ viewId: string; sweepId: string }> = []
    // s &&
    //   s.forEach(t => {
    //     const s = t.model?.activeHighlightReel?.reel
    //     s &&
    //       s.forEach(e => {
    //         const a = e.asset?.snapshotLocation?.anchor?.id
    //         a && n.push({ viewId: t.id, sweepId: a })
    //       })
    //   })
    // return n
    return []
  }
}
const { HLR: Z } = PhraseKey.WORKSHOP
class TourParser extends BaseParser {
  reelEntry: any
  index: number
  tourMode: any
  locale: any
  title: any
  description: any
  icon: string
  imgUrl: any

  constructor(t, e, i, s, n, o) {
    super(t, void 0, e)
    this.reelEntry = i
    this.index = s
    this.tourMode = n
    this.locale = o
    this.id = this.reelEntry.id
    this.title = this.reelEntry.title || ""
    this.description = this.reelEntry.description || ""
    this.icon = "icon-toolbar-hlr"
    this.typeId = searchModeType.HIGHLIGHTREEL
    this.floorId = ""
    this.roomId = ""
    this.dateBucket = getDayTag(this.reelEntry.snapshot.created)
    this.onSelect = async () => {
      super.onSelect()
      await this.commandBinder.issueCommand(new TourStepCommand(this.index))
      this.tourMode === TourMode.STORIES
        ? await this.commandBinder.issueCommand(new HighlightReelShowStoryTextCommand(!0))
        : this.commandBinder.issueCommand(new HighlightReelToggleOpenCommand(!0))
    }

    if (n === TourMode.STORIES) {
      const t = !!i.title
      const e = !!i.snapshot.name
      this.title = t && e ? i.snapshot.name + " - " + i.title : t || e ? (i.title ? i.title : i.snapshot.name) : this.getDefaultName()
    } else (this.title = i.snapshot.name ? i.snapshot.name : this.getDefaultName()), (this.description = "")
    this.imgUrl = this.reelEntry.snapshot.thumbnailUrl
  }
  supportsBatchDelete() {
    return !1
  }
  getDefaultName() {
    return this.locale.t(Z.SEARCH_HIGHLIGHT_DEFAULTNAME) + " " + (this.index + 1)
  }
}
const { HLR: Q } = PhraseKey.WORKSHOP
export default class ToursDataModule extends Module {
  defaultModes: ViewModes[]
  fetchAllTourSweeps: () => Promise<void>
  store: TourStore
  viewData: ToursViewData
  updateTourMode: () => void
  closeReelIfEmpty: () => void
  tourData: TourData
  saveTourModeChange: (t: any) => Promise<void>
  onToggleReel: (t: any) => Promise<void>
  onForceShowStoryText: (t: any) => Promise<void>
  engine: EngineContext
  onUpdateSnapshots: () => void
  snapshotsData: SnapshotsData
  config: any
  settingsData: SettingsData
  monitor: TargetMonitors
  constructor() {
    super(...arguments)
    this.name = "tours-data"
    this.defaultModes = [ViewModes.Panorama, ViewModes.Outdoor]
    this.fetchAllTourSweeps = async () => {
      const t = await this.store.fetchAllTourSweeps()
      this.viewData.setSweepsInToursAcrossViews(t)
    }
    this.updateTourMode = () => {
      this.viewData.currentTourMode = this.getCurrentTourMode()
      this.viewData.setTourModeSetting(this.getTourModeSetting())
      this.viewData.commit()
    }
    this.closeReelIfEmpty = () => {
      0 === this.tourData.getSnapshotCount() && this.viewData.reelOpen && this.toggleReel(!1)
    }
    this.saveTourModeChange = async t => {
      const { tourMode: e } = t
      e === TourMode.STORIES
        ? this.tourData.setActiveReelTourMode(tourModeType.STORY)
        : e === TourMode.LEGACY && this.tourData.setActiveReelTourMode(tourModeType.REEL),
        this.updateTourMode()
    }
    this.onToggleReel = async t => {
      this.toggleReel(t.open)
    }
    this.onForceShowStoryText = async t => {
      this.engine.broadcast(new TourStoryMessage())
    }
    this.onUpdateSnapshots = () => {
      this.tourData.updateSnapshots(this.snapshotsData.collection)
    }
  }
  async init(t, e: EngineContext) {
    const { readonly: i, baseUrl: o, storyToursFeature: r, baseModelId: c } = t
    this.engine = e
    this.config = t
    const [u, p, m, g] = await Promise.all([
      e.market.waitForData(SettingsData),
      e.market.waitForData(SweepsData),
      e.market.waitForData(SnapshotsData),
      e.market.waitForData(LayersData)
    ])
    this.settingsData = u
    this.snapshotsData = m
    const f = this.getFilterModes(this.defaultModes)
    const w = r ? tourModeType.STORY : tourModeType.REEL
    this.tourData = new TourData(this.snapshotsData.collection, new HighlightReel(w), f, p.getSweepList(), t.looping, this.log)
    this.viewData = new ToursViewData(this.tourData, this.getTourModeSetting(), this.getCurrentTourMode())
    if (!1 === i) {
      const t = await e.getModuleBySymbol(StorageSymbol)
      const i = this.tourData.getReel()
      this.monitor = new TargetMonitors(i, { aggregationType: AggregationType.NextFrame }, e)
      this.monitor.onChanged(() => {
        this.monitor.hasDiffRecord() && this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.HIGHLIGHTS] }))
      })
      this.bindings.push(
        t.onSave(() => this.save(), { dataType: DataType.HIGHLIGHTS }),
        t.onSave(() => this.fetchAllTourSweeps(), { dataType: DataType.SWEEPS })
      )
      this.bindings.push(
        e.commandBinder.addBinding(TourSetTourModeCommand, this.saveTourModeChange),
        //@ts-ignore
        this.settingsData.onPropertyChanged(BtnText.TourButtons, this.updateTourMode),
        //@ts-ignore
        this.settingsData.onPropertyChanged(BtnText.HighlightReel, this.updateTourMode)
      )
    }
    this.store = new TourStore({ context: g.mdsContext, readonly: i, baseUrl: o }, w, c)
    this.bindings.push(
      this.store.onNewData(async (t: HighlightReel) => {
        this.tourData.atomic(() => {
          this.tourData.setHighlightReel(t || new HighlightReel(w))
          this.monitor?.clearDiffRecord()
        })
        this.updateTourMode()
        this.closeReelIfEmpty()
      })
    )
    //pw
    await this.store.refresh()
    this.bindings.push(
      e.commandBinder.addBinding(HighlightReelToggleOpenCommand, this.onToggleReel),
      e.commandBinder.addBinding(HighlightReelShowStoryTextCommand, this.onForceShowStoryText),
      this.snapshotsData.onChanged(this.onUpdateSnapshots)
    )

    const s = await this.engine.market.waitForData(AppData)
    const n = await this.engine.getModuleBySymbol(LocaleSymbol)
    const getSimpleMatches = (s, o, a, r = []) => {
      const h: TourParser[] = []
      const d = this.tourData.getCurrentTourState().highlights
      const l = this.viewData.currentTourMode
      if (r.length > 0 || l === TourMode.NONE) return h
      const c = l === TourMode.STORIES
      let u = 0
      d.forEach(e => {
        const i = e.title && c ? e.title : n.t(Q.SEARCH_HIGHLIGHT_DEFAULTNAME) + " " + (u + 1)
        if (s(i) || (e.snapshot.name && s(e.snapshot.name)) || (c && e.description && s(e.description))) {
          const i = new TourParser(this.engine.commandBinder, o, e, u, l, n)
          h.push(i)
        }
        u++
      })

      return h
    }
    const registerChangeObserver = t => new AggregateSubscription(this.tourData.onChanged(t), this.viewData.onTourModeSettingChanged(t))
    const renew = () => {
      this.engine.commandBinder.issueCommandWhenBound(
        new SearchGroupRegisterCommand({
          id: searchModeType.HIGHLIGHTREEL,
          groupPhraseKey: Q.SEARCH_TOUR_HEADER,
          getSimpleMatches,
          registerChangeObserver,
          groupOrder: 10,
          groupIcon: "toolbar-hlr",
          batchSupported: !1
        })
      )
    }
    const cancel = () => {
      this.engine.commandBinder.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.HIGHLIGHTREEL))
    }
    const d = { renew, cancel }
    const onPropertyChanged = t => {
      cancel()
      renew()
    }

    const cc = s.onPropertyChanged("application", onPropertyChanged)
    onPropertyChanged(s.application)
    new AggregateSubscription(d, cc)
    e.market.register(this, TourData, this.tourData)
    //pw
    // i
    //   ? e.market.register(this, ToursViewData, this.viewData)
    //   : this.fetchAllTourSweeps().then(() => {
    //       e.market.register(this, ToursViewData, this.viewData)
    //     })
    e.market.register(this, ToursViewData, this.viewData)
  }
  dispose(t) {
    this.store.dispose()
    super.dispose(t)
  }
  async save() {
    if (!this.monitor || this.config.readonly) return void this.log.warn("Tour changes will NOT be saved")
    const t = this.tourData.getReel()
    await this.store.update(t)
    this.fetchAllTourSweeps()
    this.monitor.clearDiffRecord()
  }
  getCurrentTourMode() {
    return (0, _.aW)(this.settingsData, this.tourData.getActiveReelTourMode())
  }
  getTourModeSetting() {
    return (0, _.w7)(this.settingsData, this.tourData.getActiveReelTourMode())
  }
  toggleReel(t: boolean) {
    this.viewData.reelOpen = t
    this.viewData.commit()
  }
  getFilterModes(t: ViewModes[]) {
    this.settingsData.tryGetProperty(ShowcaseDollhouseKey, !1) && t.push(ViewModes.Dollhouse)
    this.settingsData.tryGetProperty(ShowcaseFloorPlanKey, !1) && t.push(ViewModes.Floorplan)
    return t
  }
}
