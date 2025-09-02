import { Data } from "./data"
import { DebugInfo } from "./debug"
import { OpenDeferred } from "./deferred"
import { DataInstanceType, DataType } from "./marketContext"
import { Module } from "./module"
import { TypeLookup } from "./typeLookup"
const noData = "Data not present."

export default class Market {
  log: DebugInfo
  typeLookup: TypeLookup
  store: Record<string, DataInstanceType>
  moduleRegistry: Record<string, Module>
  firstUpdatePromises: Record<string, OpenDeferred<DataInstanceType>>
  constructor() {
    this.log = new DebugInfo("market")
    this.typeLookup = new TypeLookup()
    this.store = {}
    this.moduleRegistry = {}
    this.firstUpdatePromises = {}
  }
  register<D extends DataType = typeof Data, M extends Module = Module>(e: M, t: D, n: InstanceType<D>) {
    const i = this.typeLookup.getKeyByType(t, !0)
    if (this.moduleRegistry[i]) throw Error("Data can only be registered to one Module")
    this.moduleRegistry[i] = e
    this.store[i] = n
    n.commit()
    i in this.firstUpdatePromises && (this.firstUpdatePromises[i].resolve(this.store[i]), delete this.firstUpdatePromises[i])
  }
  unregister<D extends DataType = typeof Data>(e, t: D) {
    const n = this.typeLookup.getKeyByType(t, !0)
    if (!this.moduleRegistry[n]) throw Error("No Data was registered to the Module")
    delete this.moduleRegistry[n], delete this.store[n]
  }
  getData<D extends DataType = typeof Data>(e: D) {
    const t = this.typeLookup.getKeyByType(e)
    if (t in this.store) return this.store[t] as InstanceType<D>
    throw Error(noData)
  }
  waitForData<D extends DataType = typeof Data>(e: D) {
    const t = this.typeLookup.getKeyByType(e, !0)
    return t in this.store
      ? (Promise.resolve(this.store[t]) as Promise<InstanceType<D>>)
      : ((this.firstUpdatePromises[t] ||
          ((this.firstUpdatePromises[t] = new OpenDeferred()),
          setTimeout(() => {
            DebugInfo.level >= 3 && !(t in this.store) && this.log.debug(`still waiting for ${e.name}-data after 5 seconds`)
          }, 5e3)),
        this.firstUpdatePromises[t].nativePromise()) as Promise<InstanceType<D>>)
  }
  tryGetData<D extends DataType = typeof Data>(e: D) {
    try {
      return this.getData(e)
    } catch (e) {
      if (e.message !== noData) throw (this.log.error("tryGetData", e.message), e)
    }
    return null
  }
  getModuleNameFromData<D extends DataType = typeof Data>(e: D) {
    const t = this.typeLookup.getKeyByType(e)
    if (t) {
      const e = this.moduleRegistry[t]
      if (e) return e.name
    }
    throw Error(noData)
  }
}
