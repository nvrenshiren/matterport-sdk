import { RoomBoundData } from "../data/room.bound.data"
import { Data } from "./data"
import Engine from "./engine"
import Market from "./market"
import { Module } from "./module"

function getModuleName<D extends DataType = typeof Data>(e: D, t: Market, n: Engine["moduleLookup"]) {
  const i = t.getModuleNameFromData(e)
  for (const e of Object.values(n)) if (e.module?.name === i) return String(e.symbol).replace("Symbol(", "Market(")
  return "[Unknown module]"
}
export type DataType = typeof Data | typeof RoomBoundData
export type DataInstanceType = Data | RoomBoundData
export default class MarketContext {
  market: Market
  moduleLookup: Engine["moduleLookup"]
  onRegisterData: Function
  fetchedData: Array<{ moduleName: string; isModule: boolean; startAwait: number; finishAwait: number }>
  _register: Market["register"]
  unregister: Market["unregister"]
  tryGetData: Market["tryGetData"]
  getModuleNameFromData: Market["getModuleNameFromData"]
  constructor(e: Market, t: Engine["moduleLookup"], n: Function) {
    this.market = e
    this.moduleLookup = t
    this.onRegisterData = n
    this.fetchedData = []
    this._register = e.register.bind(e)
    this.unregister = e.unregister.bind(e)
    this.tryGetData = e.tryGetData.bind(e)
    this.getModuleNameFromData = e.getModuleNameFromData.bind(e)
  }
  register<D extends DataType = typeof Data, M extends Module = Module>(e: M, n: D, i: InstanceType<D>) {
    this._register(e, n, i)
    this.onRegisterData(getModuleName(n, this.market, this.moduleLookup), Date.now())
  }
  waitForData<D extends DataType = typeof Data>(e: D) {
    const n = Date.now()
    return this.market.waitForData(e).then(i => {
      const s = Date.now()
      return (
        this.fetchedData.push({
          moduleName: getModuleName(e, this.market, this.moduleLookup),
          isModule: !1,
          startAwait: n,
          finishAwait: s
        }),
        i
      )
    }) as Promise<InstanceType<D>>
  }
  getLoadedDependencies() {
    return this.fetchedData
  }
}
