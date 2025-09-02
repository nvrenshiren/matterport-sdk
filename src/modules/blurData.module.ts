import * as b from "../3907"
import { ApplyBlursCommand, DeleteBlursCommand, RefreshBlursCommand, SaveBlursCommand } from "../command/blurs.command"
import { SaveCommand } from "../command/save.command"
import { AggregationType } from "../const/2541"
import * as S from "../const/36074"
import { BlurChunksKey, BlurMeshKey, BlurPipelineKey } from "../const/36074"
import { BlurStatus } from "../const/66310"
import { DataType } from "../const/79728"
import { BlurDataSymbol, SettingsSymbol, StorageSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { BlurData } from "../data/blur.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import { DiffState } from "../other/71954"
import * as C from "../other/73635"
import { waitRun } from "../utils/func.utils"
import { createSweepDataMapper, createSweepDataObjectMapper } from "../webgl/50257"
declare global {
  interface SymbolModule {
    [BlurDataSymbol]: BlurDataModule
  }
}
const BlurstoreDebugInfo = new DebugInfo("BlurStore")
class E extends b.MU {
  constructor(e) {
    const { baseUrl: t, modelId: s, queue: i, sweepData: n } = e
    super({ queue: i, path: `${t}/api/v1/jsonstore/model/blurs/${s}`, batchUpdate: !0, deserialize: (0, C.B4)(n), serialize: createSweepDataObjectMapper(n) }),
      (this.queue = i),
      (this.baseUrl = t),
      (this.modelId = s),
      (this.serialize = createSweepDataMapper(n))
  }
  async apply(e, { useChunks: t, meshBlurEnabled: s, pipelineEnabled: i }) {
    if (!i) return void BlurstoreDebugInfo.info("Pipeline disabled, no blurs will be applied to the model")
    const n = { enableMeshBlur: s, levels: S.TW.map(e => ({ size: e.size, sigmaRadians: (0.5 * e.sigma) / e.size })) },
      a = {}
    for (const s of e) {
      const e = t ? s.sweepId : 0,
        i = this.serialize(s)
      i && (a[e] || (a[e] = {}), (a[e][s.id] = i))
    }
    const r = Object.keys(a).length,
      o = []
    for (const e in a) {
      const s = a[e]
      t && BlurstoreDebugInfo.debug(`Applying ${Object.values(s).length} blurs to Sweep ${e}`)
      const i = this.queue.post(`${this.baseUrl}/api/v2/pano-edit/${this.modelId}/blur-panos`, { withCredentials: !0, body: { blurs: s, options: n } })
      o.push(i), r > o.length && (BlurstoreDebugInfo.debug("waiting 100ms"), await waitRun(250))
    }
    return Promise.all(o)
  }
}
export default class BlurDataModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "blur_data"),
      (this.refreshPromise = null),
      (this.saveBlurs = async () => {
        const { commandBinder: e } = this.engine
        return e.issueCommand(new SaveCommand({ dataTypes: [DataType.BLURS] }))
      }),
      (this.onApplyBlursCommand = () => this.applyBlurs())
  }
  async init(e, t) {
    ;(this.engine = t), (this.config = e), await this.load(t)
  }
  dispose(e) {
    super.dispose(e), e.market.unregister(this, BlurData), (this.data = void 0)
  }
  async configureStorage() {
    if (this.store) return
    const { baseUrl: e, modelId: t, queue: s, readonly: n } = this.config,
      { commandBinder: a, market: r } = this.engine,
      o = await r.waitForData(SweepsData)
    ;(this.store = new E({ baseUrl: e, modelId: t, queue: s, sweepData: o })),
      n ||
        (this.bindings.push(
          a.addBinding(RefreshBlursCommand, () => this.refresh()),
          a.addBinding(ApplyBlursCommand, this.onApplyBlursCommand),
          a.addBinding(SaveBlursCommand, this.saveBlurs),
          a.addBinding(DeleteBlursCommand, async ({ ids: e }) => this.deleteById(...e))
        ),
        this.engine.getModuleBySymbol(StorageSymbol).then(e => {
          this.bindings.push(e.onSave(() => this.save(), { dataType: DataType.BLURS }))
        }))
  }
  async load(e) {
    await this.configureStorage(),
      (this.settings = await e.getModuleBySymbol(SettingsSymbol)),
      (this.data = new BlurData()),
      e.market.register(this, BlurData, this.data)
    const t = await this.store.read()
    this.data.add(...Object.values(t || {})), (this.monitor = new SweepsMonitor(this.data.blurs, { aggregationType: AggregationType.Manual }))
  }
  async refresh() {
    if (this.refreshPromise) return
    if (!this.data.hasAppliedBlurs()) return
    const e = this.store
      .read()
      .then(e => {
        this.updateBlursFrom(...Object.values(e || {}))
      })
      .finally(() => {
        this.refreshPromise = null
      })
    return (this.refreshPromise = e), e
  }
  async save() {
    if (!this.monitor || this.config.readonly) return void this.log.warn("Blur changes will NOT be saved")
    await this.refresh(), this.monitor.commitChanges()
    const e = this.monitor.getDiffRecord().filter(({ index: e, action: t }) => t === DiffState.removed || (this.data.has(e) && this.data.get(e).editable))
    if ((this.monitor.clearDiffRecord(), !e.length)) return
    const t = {}
    for (const s of e)
      switch (s.action) {
        case DiffState.added:
        case DiffState.updated:
          t[s.index] = this.data.get(s.index)
          break
        case DiffState.removed:
          t[s.index] = null
      }
    return this.store.update(t)
  }
  async applyBlurs() {
    var e, t, s
    if (this.data.hasProcessingBlurs()) return
    await this.save()
    const i = this.data.getByStatus(BlurStatus.PENDING, BlurStatus.FAILED)
    if (!i.length) return
    i.length > S.Dr && (this.log.info(`Applying Blurs: Truncating request to the maximum of ${S.Dr} Blurs. Total Pending: ${i.length}`), (i.length = S.Dr)),
      this.data.setStatus(BlurStatus.PROCESSING, ...i.map(e => e.id)),
      this.log.info(`Applying ${i.length} blurs...`)
    const n = null === (e = this.settings) || void 0 === e ? void 0 : e.tryGetProperty(BlurPipelineKey, !1),
      r = null === (t = this.settings) || void 0 === t ? void 0 : t.tryGetProperty(BlurMeshKey, !1),
      o = null === (s = this.settings) || void 0 === s ? void 0 : s.tryGetProperty(BlurChunksKey, !1)
    return this.store.apply(i, { useChunks: o, meshBlurEnabled: r, pipelineEnabled: n })
  }
  async deleteById(...e) {
    if (this.data.delete(...e)) return this.save()
  }
  updateBlursFrom(...e) {
    this.data.atomic(() => {
      e.forEach(e => {
        if (this.data.has(e.id)) {
          const t = this.data.get(e.id)
          e.status !== t.status && ((t.status = e.status), t.modified.setTime(e.modified.getTime()), t.commit())
        }
      })
    })
  }
}
