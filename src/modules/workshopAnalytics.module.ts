import { AnalyticsSymbol, AppAnalyticsSymbol, WorkShopAnalyticsSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import AnalyticsModule from "./analytics.module"

declare global {
  interface SymbolModule {
    [WorkShopAnalyticsSymbol]: WorkshopAnalyticsModule
  }
}

export default class WorkshopAnalyticsModule extends Module {
  analytics: AnalyticsModule
  constructor() {
    super(...arguments)
    this.name = "workshop-analytics"
  }
  async init(e, t: EngineContext) {
    await t.getModuleBySymbol(AppAnalyticsSymbol)
    this.analytics = await t.getModuleBySymbol(AnalyticsSymbol)
  }
  addMessageHandler(e, t) {
    e.handlers.forEach((e, s) => {
      this.bindings.push(
        t.subscribe(e.msgType, s => {
          e.func(this.analytics, s, t.market)
        })
      )
    })
  }
}
