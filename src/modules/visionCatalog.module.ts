import { WorkShopCatalogSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { VisionCatalogData } from "../data/vision.catalog.data"
declare global {
  interface SymbolModule {
    [WorkShopCatalogSymbol]: VisionCatalogModule
  }
}
class VisionCatalogStore extends MdsStore {
  loadCatalog: boolean
  constructor(e, t = !1) {
    super(e)
    this.loadCatalog = t
  }
  async read() {
    return this._readAssets().then(e => (!e.length || this.loadCatalog ? this._readCatalog() : e))
  }
  async _readAssets() {
    const e = { modelId: this.getViewId() }
    const i: Array<{ name: string; contentType: string; format: string; url: string; validUntil: Date }> = []
    return i
  }
  _readCatalog() {
    const e = { modelId: this.getViewId() }
    const a: Array<{ name: string; contentType: string; format: string; url: string; validUntil: Date }> = []
    return a
  }
}
export default class VisionCatalogModule extends Module {
  data: VisionCatalogData
  constructor() {
    super(...arguments)
    this.name = "vision-catalog"
  }
  async init(e, t: EngineContext) {
    const s = await t.market.waitForData(LayersData)
    const i = new VisionCatalogStore({ context: s.mdsContext, readonly: !0, viewId: e.baseModelId }, e.loadCatalog)
    const a = await i.read().catch(e => (this.log.info("Failed to load Vision Catalog"), []))
    this.data = new VisionCatalogData(a)
    t.market.register(this, VisionCatalogData, this.data)
  }
  dispose(e) {
    super.dispose(e), e.market.unregister(this, VisionCatalogData)
  }
}
