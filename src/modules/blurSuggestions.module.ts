import * as C from "../3907"
import { DiffState } from "../other/71954"
import * as y from "../other/73635"
import { Blur } from "../observable/observable.blur"
import {
  AcceptBlurSuggestionsCommand,
  HideBlurSuggestionsCommand,
  RejectBlurSuggestionsCommand,
  SaveBlursCommand,
  SaveBlurSuggestionsCommand,
  ShowBlurSuggestionsCommand
} from "../command/blurs.command"
import { SaveCommand } from "../command/save.command"
import { AggregationType } from "../const/2541"
import { DataType } from "../const/79728"
import { SettingsSymbol, StorageSymbol, WorkShopBlurSuggestSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { RequestManager } from "../core/request"
import { BlurData } from "../data/blur.data"
import { BlurSuggestionData } from "../data/blur.suggestion.data"
import { SweepsData } from "../data/sweeps.data"
import { VisionCatalogData } from "../data/vision.catalog.data"
import { ObservableObject } from "../observable/observable.object"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import { toDate, toISOString } from "../utils/date.utils"
import { randomString } from "../utils/func.utils"
import { processDotsData } from "../webgl/50257"
declare global {
  interface SymbolModule {
    [WorkShopBlurSuggestSymbol]: BlurSuggestionsModule
  }
}
class p {
  constructor(e) {
    this.config = e
  }
  async read() {
    const { url: e, deserializer: t, format: s, queue: i } = this.config
    let n = await i.get(e)
    return "json" === s && (n = JSON.parse(n)), t ? t(n) : n
  }
}
class E extends ObservableObject {
  constructor(e) {
    super(),
      (this.accepted = null),
      (this.index = -1),
      (this.classification = []),
      (this.visible = !0),
      (this.id = randomString(11)),
      e && Object.assign(this, e)
  }
}
const Blursuggestiondeserializer = new DebugInfo("blurSuggestionDeserializer")
function D(e) {
  const t = (function (e) {
    return function (t) {
      const s = (0, y.LB)(null == t ? void 0 : t.dots),
        i = e.getSweepByUuid(null == t ? void 0 : t.sweepId)
      if (!(t && s && s.length && i)) return Blursuggestiondeserializer.debug("Deserialized invalid Blur suggestion", t), null
      const n = !0 === t.accepted || !1 === t.accepted ? t.accepted : null
      return new E({
        id: t.sid,
        accepted: n,
        dots: s,
        index: t.index,
        floorId: i.floorId,
        roomId: i.roomId,
        sweepId: i.id,
        classification: t.tags || [],
        visible: !0,
        created: toDate(t.created),
        modified: toDate(t.modified)
      })
    }
  })(e)
  return function (e) {
    const s = {}
    for (const i in e) {
      const n = t(e[i])
      n && (s[i] = n)
    }
    return s
  }
}
function R(e) {
  const t = (function (e) {
    return function (t) {
      const s = e.getSweep(t.sweepId),
        i = processDotsData(t.dots)
      return s && (null == i ? void 0 : i.length)
        ? {
            sid: t.id,
            accepted: t.accepted,
            dots: i,
            index: t.index,
            sweepId: s.uuid,
            tags: t.classification,
            visible: t.visible,
            created: toISOString(t.created),
            modified: toISOString(t.modified)
          }
        : null
    }
  })(e)
  return function (e) {
    const s = {}
    for (const i in e) {
      const n = t(e[i])
      n && (s[i] = n)
    }
    return s
  }
}
class _ extends C.MU {
  constructor(e) {
    const { queue: t, baseUrl: s, modelId: i, sweepData: n } = e
    super({ queue: t, path: `${s}/api/v1/jsonstore/model/blur-suggestions/${i}`, batchUpdate: !0, deserialize: D(n), serialize: R(n) }),
      (this.baseUrl = s),
      (this.modelId = i)
  }
  async read() {
    const e = await super.read()
    return Object.values(e || {})
  }
  async reset() {
    var e
    const { queue: t } = this.config,
      s = `${this.baseUrl}/api/v1/jsonstore/model/blur-suggestions/${this.modelId}`
    if (!(null === (e = this.modelId) || void 0 === e ? void 0 : e.length)) throw new Error(`Refusing to DELETE ${s}`)
    if (window.confirm("Are you sure you want to reset all suggestions? This cannot be undone."))
      return t.delete(s, this.options).then(() => {
        window.location.reload()
      })
  }
}
function L(e) {
  return t => {
    const s = []
    if (!(null == t ? void 0 : t.blurs)) return []
    const i = Object.values(t.blurs).filter(e => !e.blurEnabled)
    for (const t of i) {
      const i = e.getSweepByUuid(t.sweepId),
        n = (0, y.LB)(t.dots)
      if (!(null == n ? void 0 : n.length) || !i || !Array.isArray(null == t ? void 0 : t.dots)) continue
      const a = new E({ accepted: null, sweepId: i.id, dots: n, classification: ["face"], floorId: i.floorId || void 0, visible: !0 })
      s.push(a)
    }
    return s
  }
}
export default class BlurSuggestionsModule extends Module {
  constructor() {
    super(...arguments), (this.name = "blur-suggestions")
  }
  async init(e, t) {
    ;(this.engine = t), (this.config = e), await this.load(), await this.registerSettings()
  }
  async load() {
    const { baseUrl: e, modelId: t, queue: s, readonly: n } = this.config,
      { market: a, commandBinder: l } = this.engine,
      [c, h] = await Promise.all([a.waitForData(BlurData), a.waitForData(SweepsData)])
    ;(this.blurData = c), (this.store = new _({ queue: s, baseUrl: e, modelId: t, sweepData: h })), (this.data = new BlurSuggestionData())
    const p = this.store.read()
    if (
      (this.log.debug("Loaded existing suggestions", p),
      p &&
        p.then(async e => {
          if (this.data)
            if (0 === e.length) {
              const e = await this.getSuggestionsFromVision()
              if (!this.data || 0 === e.length) return
              this.data.add(...e), this.log.debug(`Importing ${e.length} suggestions from Vision...`), l.issueCommand(new SaveBlurSuggestionsCommand())
            } else this.data.add(...(e || []))
        }),
      !n)
    ) {
      const e = await this.engine.getModuleBySymbol(StorageSymbol)
      this.bindings.push(
        l.addBinding(SaveBlurSuggestionsCommand, () => l.issueCommand(new SaveCommand({ dataTypes: [DataType.BLUR_SUGGESTIONS] }))),
        l.addBinding(AcceptBlurSuggestionsCommand, ({ ids: e }) => this.accept(...e)),
        l.addBinding(RejectBlurSuggestionsCommand, ({ ids: e }) => this.reject(...e)),
        l.addBinding(ShowBlurSuggestionsCommand, ({ ids: e }) => this.show(...e)),
        l.addBinding(HideBlurSuggestionsCommand, ({ ids: e }) => this.hide(...e)),
        e.onSave(() => this.save(), { dataType: DataType.BLUR_SUGGESTIONS })
      )
    }
    a.register(this, BlurSuggestionData, this.data), n || (this.monitor = new SweepsMonitor(this.data.suggestions, { aggregationType: AggregationType.Manual }))
  }
  dispose(e) {
    super.dispose(e), e.market.unregister(this, BlurSuggestionData), (this.data = void 0)
  }
  async accept(...e) {
    const { commandBinder: t } = this.engine,
      s = e.length ? e.map(e => this.data.get(e)) : this.data.getByAccepted(null),
      i = s.map(e => Blur.from(e))
    return (
      this.blurData.add(...i),
      this.data.accept(...s.map(e => e.id)),
      Promise.all([t.issueCommand(new SaveBlursCommand()), t.issueCommand(new SaveBlurSuggestionsCommand())]).then(() => {})
    )
  }
  async reject(...e) {
    const { commandBinder: t } = this.engine,
      s = e.length ? e : this.data.getByAccepted(null).map(e => e.id)
    return this.data.reject(...s), t.issueCommand(new SaveBlurSuggestionsCommand())
  }
  async show(...e) {
    this.data.show(...e)
  }
  async hide(...e) {
    this.data.hide(...e)
  }
  async save() {
    const { readonly: e } = this.config
    if (e || !this.monitor) return
    this.monitor.commitChanges()
    const t = this.monitor.getDiffRecord()
    if ((this.monitor.clearDiffRecord(), !t.length)) return
    const s = {}
    for (const e of t)
      switch (e.action) {
        case DiffState.added:
        case DiffState.updated:
          s[e.index] = this.data.get(e.index)
          break
        case DiffState.removed:
          s[e.index] = null
      }
    return this.store.update(s).catch(e => {
      this.log.error(e)
    })
  }
  async getSuggestionsFromVision() {
    const { market: e } = this.engine,
      [t, s] = await Promise.all([e.waitForData(VisionCatalogData), e.waitForData(SweepsData)])
    let i = null
    const n = t.objectBlur
    if (null == n ? void 0 : n.url) {
      const e = new p({ url: n.url, queue: this.config.queue || new RequestManager(), format: "json", deserializer: L(s) })
      i = await e.read()
    }
    return i || []
  }
  async registerSettings() {
    const e = await this.engine.getModuleBySymbol(SettingsSymbol),
      { debug: t } = this.config
    t &&
      e.registerMenuButton({
        header: "Blur Suggestions",
        buttonName: "Reset Suggestions",
        callback: () => {
          this.store.reset()
        }
      })
  }
}
