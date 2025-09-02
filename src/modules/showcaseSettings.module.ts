import * as M from "../other/18448"

import { SaveCommand } from "../command/save.command"
import { TransitionTypeKey } from "../const/14715"
import { AggregationType } from "../const/2541"
import { BackgroundColorDefault } from "../const/28361"
import { TransitionTypeList } from "../const/64918"
import { DataType } from "../const/79728"
import { SettingsSymbol, ShowcaseSettingsSymbol, StorageSymbol } from "../const/symbol.const"
import { PanDirectionList } from "../const/transition.const"
import { backgroundColorType, directionType, measurementsOptions, playerOptions, unitsType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { BtnText, PlayerOptionsData } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { TargetMonitors } from "../observable/targetMonitors"
import GetModelOptions from "../test/GetModelOptions"
import { UnitTypeKey } from "../utils/unit.utils"
declare global {
  interface SymbolModule {
    [ShowcaseSettingsSymbol]: ShowcaseSettingsModule
  }
}
const y = new DebugInfo("mds-player-options-deserializer"),
  f = { [directionType.LEFT]: PanDirectionList.Left, [directionType.RIGHT]: PanDirectionList.Right, [directionType.AUTO]: PanDirectionList.Auto },
  v = {
    [backgroundColorType.BLACK]: BackgroundColorDefault.black,
    [backgroundColorType.GREY]: BackgroundColorDefault.grey,
    [backgroundColorType.WHITE]: BackgroundColorDefault.white
  }
class w {
  deserialize(e) {
    var t
    if (!e || !this.validate(e)) return y.debug("Deserialized invalid options data from MDS", e), null
    const i = (null === (t = e.publication) || void 0 === t ? void 0 : t.options) || {},
      s = e.options || {},
      o = (null == s ? void 0 : s.tourPanDirection) ? f[s.tourPanDirection] : PanDirectionList.Auto,
      r = {
        address: i.address,
        contact_email: i.contactEmail,
        contact_name: i.contactName,
        contact_phone: i.contactPhone,
        dollhouse: s.dollhouseEnabled,
        external_url: i.externalUrl,
        floor_plan: s.floorplanEnabled,
        floor_select: s.floorSelectEnabled,
        highlight_reel: s.highlightReelEnabled,
        labels: s.labelsEnabled,
        labels_dh: s.dollhouseLabelsEnabled,
        model_name: i.modelName,
        model_summary: i.modelSummary,
        presented_by: i.presentedBy,
        measurements: s.measurements !== measurementsOptions.DISABLED,
        measurements_saved: s.measurements === measurementsOptions.MEASUREANDVIEW,
        room_bounds: s.roomBoundsEnabled,
        unit_type: s.unitType === unitsType.IMPERIAL ? UnitTypeKey.IMPERIAL : UnitTypeKey.METRIC,
        background_color: (null == s ? void 0 : s.backgroundColor) ? v[s.backgroundColor] : BackgroundColorDefault.black,
        tour_buttons: s.tourButtonsEnabled,
        fast_transitions: s.tourFastTransitionsEnabled,
        transition_speed: s.tourTransitionSpeed,
        transition_time: s.tourTransitionTime,
        pan_speed: s.tourPanSpeed,
        dollhouse_pan_speed: s.tourDollhousePanSpeed,
        zoom_duration: s.tourZoomDuration,
        pan_angle: s.tourPanAngle,
        pan_direction: o,
        space_search: s.spaceSearchEnabled
      }
    return new PlayerOptionsData(r)
  }
  validate(e) {
    if (!e) return !1
    return ["id", "options", "publication"].every(t => t in e)
  }
}
const b = M.S(f),
  D = M.S(v)
class S {
  serialize(e) {
    const t: any = {},
      i = e.options || {}
    if (
      (void 0 !== i.dollhouse && (t.dollhouseOverride = i.dollhouse ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.floor_plan && (t.floorplanOverride = i.floor_plan ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.floor_select && (t.floorSelectOverride = i.floor_select ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.room_bounds && (t.roomBoundsOverride = i.room_bounds ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.space_search && (t.spaceSearchOverride = i.space_search ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.labels && (t.labelsOverride = i.labels ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.labels_dh && (t.dollhouseLabelsOverride = i.labels_dh ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.highlight_reel && (t.highlightReelOverride = i.highlight_reel ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.background_color && (t.backgroundColor = { set: D[i.background_color] || backgroundColorType.BLACK }),
      void 0 !== i.unit_type)
    ) {
      const e = i.unit_type === UnitTypeKey.METRIC ? unitsType.METRIC : unitsType.IMPERIAL
      t.unitType = { set: e }
    }
    if (void 0 !== i.measurements || void 0 !== i.measurements_saved) {
      const e =
        i.measurements && i.measurements_saved
          ? measurementsOptions.MEASUREANDVIEW
          : i.measurements
            ? measurementsOptions.MEASURE
            : measurementsOptions.DISABLED
      t.measurements = { set: e }
    }
    void 0 !== i.tour_buttons && (t.tourButtonsOverride = i.tour_buttons ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.fast_transitions && (t.tourFastTransitionsOverride = i.fast_transitions ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.pan_angle && (t.tourPanAngle = { set: i.pan_angle }),
      void 0 !== i.pan_direction && (t.tourPanDirection = { set: b[i.pan_direction] }),
      void 0 !== i.pan_speed && (t.tourPanSpeed = { set: i.pan_speed }),
      void 0 !== i.transition_speed && (t.tourTransitionSpeed = { set: i.transition_speed }),
      void 0 !== i.transition_time && (t.tourTransitionTime = { set: i.transition_time }),
      void 0 !== i.zoom_duration && (t.tourZoomDuration = { set: i.zoom_duration }),
      void 0 !== i.dollhouse_pan_speed && (t.tourDollhousePanSpeed = { set: i.dollhouse_pan_speed })
    const s: any = {}
    void 0 !== i.presented_by && (s.presentedByOverride = i.presented_by ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.contact_email && (s.contactEmailOverride = i.contact_email ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.contact_name && (s.contactNameOverride = i.contact_name ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.contact_phone && (s.contactPhoneOverride = i.contact_phone ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.external_url && (s.externalUrlOverride = i.external_url ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.model_name && (s.modelNameOverride = i.model_name ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.model_summary && (s.modelSummaryOverride = i.model_summary ? playerOptions.ENABLED : playerOptions.DISABLED),
      void 0 !== i.address && (s.addressOverride = i.address ? playerOptions.ENABLED : playerOptions.DISABLED)
    return { options: t, publication: Object.keys(s).length > 0 ? { options: s } : void 0 }
  }
}
const x = new DebugInfo("mds-player-options-store")
class C extends MdsStore {
  serializer: S
  deserializer: w
  constructor(e) {
    super(...arguments)
    this.serializer = new S()
    this.deserializer = new w()
    this.prefetchKey = "data.model.publication.options"
  }
  async read(e = {}) {
    const t = { modelId: this.getViewId() }
    //pw
    // return this.query(T.GetModelOptions, t, e).then(e => {
    //   return this.deserializer.deserialize(e?.data?.model)
    // })
    const data = GetModelOptions
    return this.deserializer.deserialize(data?.data?.model)
  }
  async update(e) {
    const t = this.getViewId(),
      i = this.serializer.serialize(e)
    if (0 === Object.keys(i).length) throw new Error("No data to update?")
    return Promise.resolve()
  }
}
export default class ShowcaseSettingsModule extends Module {
  engine: EngineContext
  store: C
  playerOptionsData: PlayerOptionsData
  monitor: TargetMonitors
  updateTransitionType: (e, t, i) => void
  constructor() {
    super(...arguments),
      (this.name = "JMYDCase-settings"),
      (this.updateTransitionType = (e, t, i) => {
        const s = e.options.fast_transitions ? TransitionTypeList.FadeToBlack : TransitionTypeList.Interpolate
        t.hasProperty(TransitionTypeKey) ? t.setProperty(TransitionTypeKey, s) : i.registerSetting("player_options", TransitionTypeKey, s)
      })
  }
  async init(e, t: EngineContext) {
    const { baseModelId: i, readonly: s, baseUrl: h } = e
    this.engine = t
    const l = await t.market.waitForData(LayersData)
    this.store = new C({ context: l.mdsContext, readonly: s, baseUrl: h, viewId: i })
    const [d, c, u, m] = await Promise.all([
      t.getModuleBySymbol(SettingsSymbol),
      t.market.waitForData(SettingsData),
      t.getModuleBySymbol(StorageSymbol),
      this.store.read()
    ])
    this.playerOptionsData = m || new PlayerOptionsData()
    t.market.register(this, PlayerOptionsData, this.playerOptionsData)
    for (const e in BtnText) {
      const t = BtnText[e]
      const i = this.playerOptionsData.options[t]
      if (d.hasProperty(t)) {
        const e = d.getProperty(t)
        d.updateSetting(t, i && e)
        this.log.debug(`Updated player_options setting ${t} = ${i && e}`)
      } else {
        d.registerSetting("player_options", t, i), this.log.debug(`Registered player_options setting ${t} = ${i}`)
      }
    }
    this.updateTransitionType(this.playerOptionsData, c, d),
      this.bindings.push(c.onPropertyChanged(BtnText.InstantTransitions, () => this.updateTransitionType(this.playerOptionsData, c, d))),
      s ||
        (this.bindings.push(u.onSave(() => this.save(), { dataType: DataType.SETTINGS })),
        (this.monitor = new TargetMonitors(this.playerOptionsData, { aggregationType: AggregationType.NextFrame }, this.engine)),
        this.monitor.onChanged(() => this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.SETTINGS] }))))
  }
  async save() {
    if (!this.store || !this.monitor) return void this.log.warn("Settings changes will NOT be saved")
    const e = this.monitor.getDiffRecord(),
      t = e.options
    return (
      t &&
        (t && void 0 === t.measurements && void 0 !== t.measurements_saved && (t.measurements = this.playerOptionsData.options.measurements),
        t && void 0 !== t.measurements && void 0 === t.measurements_saved && (t.measurements_saved = this.playerOptionsData.options.measurements_saved),
        void 0 !== (null == t ? void 0 : t.floor_select) && (t.floor_select = this.playerOptionsData.options.floor_select),
        void 0 !== (null == t ? void 0 : t.labels_dh) && (t.labels_dh = this.playerOptionsData.options.labels_dh),
        (void 0 === t.presented_by &&
          void 0 === t.contact_email &&
          void 0 === t.contact_name &&
          void 0 === t.contact_phone &&
          void 0 === t.external_url &&
          void 0 === t.model_name &&
          void 0 === t.model_summary &&
          void 0 === t.address) ||
          ((t.presented_by = this.playerOptionsData.options.presented_by),
          (t.contact_email = this.playerOptionsData.options.contact_email),
          (t.contact_name = this.playerOptionsData.options.contact_name),
          (t.contact_phone = this.playerOptionsData.options.contact_phone),
          (t.external_url = this.playerOptionsData.options.external_url),
          (t.model_name = this.playerOptionsData.options.model_name),
          (t.model_summary = this.playerOptionsData.options.model_summary),
          (t.address = this.playerOptionsData.options.address))),
      this.monitor.clearDiffRecord(),
      this.store.update(e)
    )
  }
}
