import { SaveCommand } from "../command/save.command"
import { AggregationType } from "../const/2541"
import { DataType } from "../const/79728"
import { LabelDataSymbol, MeshQuerySymbol, StorageSymbol } from "../const/symbol.const"
import { searchModeType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LabelData } from "../data/label.data"
import { LayersData } from "../data/layers.data"
import { VisionParase } from "../math/2569"
import { LabelObject } from "../object/label.object"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import * as m from "../other/40731"
import { DiffState } from "../other/71954"
import { toDate } from "../utils/date.utils"
declare global {
  interface SymbolModule {
    [LabelDataSymbol]: LabelDataModule
  }
}
const f = new DebugInfo("mds-label-serialize")
class v {
  validate: (t: any) => boolean
  constructor() {
    this.validate = t => {
      if (!t) return !1
      const e = ["enabled", "floorId", "label", "position"].filter(e => !(e in t)),
        i = 0 === e.length,
        s = !!t.floorId && "string" == typeof t.floorId,
        n = !!t.position && (0, m.u)(t.position),
        o = i && s && n
      return o || f.debug("Label invalid:", { missingFields: e, validPosition: n }), o
    }
  }
  serialize(t, e) {
    const i = y(t, e)
    return this.validate(i) ? i : null
  }
}
class w {
  validate: (t: any) => boolean
  constructor() {
    this.validate = t => {
      if (!t) return !1
      const e = ["enabled", "label", "position", "floorId", "roomId", "layerId"]
      return Object.keys(t).every(t => e.includes(t))
    }
  }
  serialize(t, e) {
    const i = y(t, e)
    return i && this.validate(i) ? i : null
  }
}
const y = (t, e) => {
  const i = {}
  return (
    void 0 !== t.visible && (i.enabled = t.visible),
    void 0 !== t.text && (i.label = t.text),
    void 0 !== t.position && (0, m.u)(t.position) && (i.position = VisionParase.toVisionVector(t.position)),
    void 0 !== t.floorId && "" !== t.floorId && (i.floorId = t.floorId),
    void 0 !== t.roomId && "" !== t.roomId && (i.roomId = t.roomId),
    e && void 0 !== t.layerId && "" !== t.layerId && (i.layerId = t.layerId),
    Object.keys(i).length > 0 ? i : null
  )
}
const D = new DebugInfo("mds-label-deserializer")
class S {
  validate: (t: any) => boolean
  constructor() {
    this.validate = t => {
      if (!t) return !1
      const e = ["id", "created", "modified", "enabled", "floor", "label", "position"].filter(e => !(e in t)),
        i = 0 === e.length,
        s = !(!t.floor || !t.floor.id),
        n = !!t.position && (0, m.u)(t.position)
      return (i && s && n) || D.debug("Label invalid:", { missingFields: e, validFloor: s, validPosition: n }), i && s && n
    }
  }
  deserialize(t) {
    var e
    if (!t || !this.validate(t)) return D.debug("Deserialized invalid Label data from MDS", t), null
    const i = new LabelObject()
    return (
      (i.sid = t.id),
      (i.layerId = (null === (e = t.layer) || void 0 === e ? void 0 : e.id) || ""),
      (i.floorId = t.floor.id),
      (i.text = t.label),
      (i.visible = !!t.enabled),
      (i.created = toDate(t.created)),
      (i.modified = toDate(t.modified)),
      (i.position = VisionParase.fromVisionVector(t.position)),
      t.room && t.room.id && (i.roomId = t.room.id),
      i
    )
  }
}
const E = new DebugInfo("MdsLabelStore")
class MdsLabelStore extends MdsStore {
  layeredType: string
  deserializer: S
  updateSerializer: w
  createSerializer: v
  constructor(t) {
    super(t),
      (this.prefetchKey = "data.model.labels"),
      (this.layeredType = searchModeType.LABEL),
      (this.deserializer = new S()),
      (this.updateSerializer = new w()),
      (this.createSerializer = new v())
  }
  async read() {
    return {}
    //pw
    // const { includeDisabled: e = !1 } = this.config,
    //   i = { modelId: this.getViewId(), includeDisabled: e, includeLayers: this.readLayerId() }
    // return this.query(I.GetLabels, i, t).then(t => {
    //   var e, i
    //   const s = null === (i = null === (e = null == t ? void 0 : t.data) || void 0 === e ? void 0 : e.model) || void 0 === i ? void 0 : i.labels
    //   if (!s || !Array.isArray(s)) return null
    //   const n = []
    //   for (const t of s) {
    //     const e = this.deserializer.deserialize(t)
    //     e && n.push(e)
    //   }
    //   return n.reduce((t, e) => ((t[e.sid] = e), t), {})
    // })
  }
  async create(t) {
    //pw
    // const e = this.getViewId(),
    //   i = []
    // for (const s of t) {
    //   const t = this.createSerializer.serialize(s, this.writeLayerId(s.layerId))
    //   if (!t) throw (E.error("Failure saving label:", s.sid, s), new Error("Could not save Label"))
    //   const n = { modelId: e, labelId: s.sid, data: t, includeLayers: this.readLayerId() }
    //   await this.mutate(I.AddLabel, n).then(t => {
    //     var e
    //     const n = null === (e = t.data) || void 0 === e ? void 0 : e.addLabel
    //     if (!n) throw new Error("Could not save label: empty response")
    //     const o = new LabelObject().copy(s)
    //     ;(o.sid = n.id), o.commit(), E.debug(Object.assign({ type: "addLabel" }, t)), i.push(o)
    //   })
    // }
    // return i
    return []
  }
  async update(t) {
    //pw
    // if (!t || 0 === t.length) return
    // const e = this.getViewId()
    // let i = ""
    // const s = {}
    // ;(s.modelId = e), (s.includeLayers = this.readLayerId())
    // let n = ""
    // for (const e of t) {
    //   const t = e.sid,
    //     o = this.updateSerializer.serialize(e, !1)
    //   if (!o) throw (E.error("Failure updating label:", t, e), new Error("Could not update Label"))
    //   ;(i += `, $patch${t}: LabelPatch!`),
    //     (s[`patch${t}`] = o),
    //     (n += `patch${t}:\n        patchLabel(modelId: $modelId, labelId: "${t}", patch: $patch${t}) {\n          ...LabelDetails\n        }\n      `)
    // }
    // const o = gql`
    //   mutation labelUpdate($modelId: ID! ${i}, $includeLayers: Boolean!) {
    //     ${n}
    //   }

    //   ${print(I.LabelDetails)}
    // `
    // return this.mutate(o, s).then(t => {
    //   E.debug(Object.assign({ type: "patchLabel" }, t))
    // })
    return !0
  }
  async delete(t) {
    //pw
    // if (!t || 0 === t.length) return
    // const e = this.getViewId()
    // let i = ""
    // for (const e of t) {
    //   if (!e || (e && !e.sid)) throw (E.error("Failure deleting label:", e), new Error("Could not update Label"))
    //   i += `delete${e.sid}: deleteLabel(modelId: $modelId, labelId: "${e.sid}") `
    // }
    // const s = gql`
    //   mutation batchDeleteLabel($modelId: ID!) {
    //     ${i}
    //   }
    // `
    // return this.mutate(s, { modelId: e }).then(() => {})
    return !0
  }
}
export default class LabelDataModule extends Module {
  monitor: SweepsMonitor | null
  engine: EngineContext
  market: any
  layersData: LayersData
  store: MdsLabelStore
  labelData: LabelData
  constructor() {
    super(...arguments)
    this.name = "label-data"
    this.monitor = null
  }
  async init(t, e: EngineContext) {
    const { readonly: i } = t
    this.engine = e
    this.market = e.market
    this.layersData = await e.market.waitForData(LayersData)
    this.store = new MdsLabelStore({ context: this.layersData.mdsContext, readonly: t.readonly, includeDisabled: !t.readonly, baseUrl: t.baseUrl })
    const s = (await this.store.read()) || {}
    const a = await e.getModuleBySymbol(StorageSymbol)
    const h = await e.getModuleBySymbol(MeshQuerySymbol)
    for (const t of Object.values(s)) h.inferMeshIdsFromPoint(t, t.position, !1)
    this.labelData = e.market.tryGetData(LabelData) || new LabelData(s)
    this.store.onNewData(async t => {
      var e
      this.labelData.atomic(() => {
        this.layersData.replaceBackendLayers(this.labelData.getCollection(), {})
      }),
        t &&
          this.labelData.atomic(() => {
            this.layersData.replaceBackendLayers(this.labelData.getCollection(), t)
          }),
        null === (e = this.monitor) || void 0 === e || e.clearDiffRecord()
    })
    await this.store.refresh()
    this.market.register(this, LabelData, this.labelData)
    i ||
      ((this.monitor = new SweepsMonitor(this.labelData.getCollection(), { aggregationType: AggregationType.Manual, shallow: !0 }, this.engine)),
      this.bindings.push(a.onSave(() => this.saveDiff(), { dataType: DataType.LABELS })))
  }
  dispose(t) {
    this.store.dispose()
    super.dispose(t)
  }
  async save() {
    return this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.LABELS] }))
  }
  getDiffRecord() {
    return this.monitor?.getDiffRecord() || []
  }
  async saveDiff() {
    if (!this.store || !this.monitor) return void this.log.warn("Labels changes will NOT be saved")
    this.monitor.commitChanges()
    const t = this.monitor.getDiffRecord()
    this.monitor.clearDiffRecord()
    const e = t
        .map(t => {
          var e
          const i = t.diff.layerId || (null === (e = this.labelData.getLabel(t.index)) || void 0 === e ? void 0 : e.layerId)
          return Object.assign(Object.assign({}, t), { layerId: i })
        })
        .filter(t => !this.layersData.isInMemoryLayer(t.layerId)),
      i = e.filter(t => t.action === DiffState.removed).map(t => ({ sid: t.index, layerId: t.layerId })),
      s = e.filter(t => t.action === DiffState.added).map(t => this.labelData.getLabel(t.index)),
      n = e.filter(t => t.action === DiffState.updated).map(t => Object.assign(Object.assign({ sid: t.index }, t.diff), { layerId: t.layerId }))
    return Promise.all([this.store.delete(i), this.store.create(s), this.store.update(n)]).then(() => {})
  }
  onUpdate(t) {}
}
