import { defaultLayerId } from "../const/mds.const"
import { MdsStore } from "./mds.store"

export default class MdsContext {
  nonBaseLayerWriteEnabled: boolean
  refreshableStores: Set<MdsStore>
  sharedCaches: Set<any>
  updateForAutoProvisionedLayer: (e: any) => Promise<any>
  autoProvisionLayerCheckCallback: any
  baseViewId: string | null
  currentViewId: string
  readLayerId?: boolean
  constructor(e?: string) {
    this.nonBaseLayerWriteEnabled = !1
    this.refreshableStores = new Set()
    this.sharedCaches = new Set()
    this.updateForAutoProvisionedLayer = async e => {
      if (this.autoProvisionLayerCheckCallback) return this.autoProvisionLayerCheckCallback(e)
    }
    this.baseViewId = null != e ? e : null
  }
  toggleNonBaseLayeredWrites(e: boolean) {
    this.nonBaseLayerWriteEnabled = e
  }
  shouldWriteLayerId(e: string) {
    return !!this.nonBaseLayerWriteEnabled && "" !== e && e !== defaultLayerId
  }
  async setCurrentViewId(e) {
    const t = Array.from(this.refreshableStores.values())
    this.currentViewId = e
    await Promise.all(t.map(e => e.refresh()))
  }
  async refreshLayeredStores(e) {
    const t = Array.from(this.refreshableStores.values()).filter(t => e.includes(t.layeredType))
    await Promise.all(t.map(e => e.refresh()))
  }
}
