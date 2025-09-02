import { AnalyticsSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { waitRun } from "../utils/func.utils"
declare global {
  interface SymbolModule {
    [AnalyticsSymbol]: AnalyticsModule
  }
}
export default class AnalyticsModule extends Module {
  bufferedData: any[]
  endpoints: any[]
  options: {
    ab_tests?: any[]
  }
  loaded: boolean
  constructor() {
    super(...arguments)
    this.name = "analytics"
    this.endpoints = []
    this.loaded = !1
    this.bufferedData = []
    this.options = {}
  }

  async load(e, t, n) {
    this.loaded = !1
    Object.assign(this.options, t)
    for (const t of e) {
      await t.init(this.options, n)
      this.endpoints.push(t)
    }
    this.loaded = !0
    if (this.loaded) {
      this.flushBufferedData()
    }
    return this.loaded
  }

  setOptions(e) {
    Object.assign(this.options, e)
    this.endpoints.forEach(t => {
      t.setOptions(e)
    })
  }

  setUser(e) {
    if (e && e.loggedIn) for (const t of this.endpoints) t.identify(e)
  }

  track(e: string, t, n?) {
    return this.loaded
      ? waitRun(0).then(() => {
          this.endpoints.forEach(i => {
            i.track(e, t, n)
          })
        })
      : (this.bufferedData.push({
          event: e,
          data: t
        }),
        Promise.resolve())
  }

  trackAsync(e, t, n) {
    this.loaded
      ? this.endpoints.forEach(i => {
          i.trackAsync(e, t, n)
        })
      : this.bufferedData.push({
          event: e,
          data: t
        })
  }

  trackFeatures(...e) {
    const t = this.options.ab_tests || []
    t.push(...e)
    const n = new Map(t.map(e => e.split(":")))
    const i = {
      ab_tests: Array.from(n, ([e, t]) => `${e}:${t}`)
    }
    this.endpoints.forEach(e => {
      e.setOptions(i)
    })
  }

  flushBufferedData() {
    for (const e of this.bufferedData)
      this.endpoints.forEach(t => {
        t.track(e.event, e.data, e.intercom)
      })
    this.bufferedData.length = 0
  }
}
