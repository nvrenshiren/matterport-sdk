import * as c from "../utils/func.utils"
import { PanoSymbol, PreRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { RestrictSweepsSetMessage } from "../message/sweep.message"
import { RestrictedSweepsMessage } from "../message/sweep.message"
import { booleanMap } from "../utils/func.utils"
declare global {
  interface SymbolModule {
    [PreRendererSymbol]: PrerendererModule
  }
}
enum n {
  None = "none",
  Queued = "queued",
  Rendered = "loaded",
  Rendering = "loading"
}
class l {
  constructor(e) {
    ;(this.panoRenderer = e), (this.statusMap = {}), (this.active = []), (this.queued = [])
  }
  processQueued() {
    let e = 0
    for (const t of Object.keys(this.statusMap)) this.statusMap[t] === n.Rendering && e++
    if (0 === e && this.queued.length > 0) {
      const e = this.queued.shift()
      if (e) {
        this.active.push(e), (this.statusMap[e] = n.Rendering)
        this.panoRenderer.activateSweep(e, !1).then(() => {
          this.statusMap[e] = n.Rendered
        })
      }
    }
  }
  tryPreRender(e) {
    return this.getPreRenderState(e) === n.None && (this.queued.push(e), (this.statusMap[e] = n.Queued), !0)
  }
  getPreRenderState(e) {
    const t = this.statusMap[e]
    return void 0 !== t ? t : n.None
  }
  cleanup(e = []) {
    const t = booleanMap(e),
      i = []
    for (const e of this.queued) t[e] ? i.push(e) : (this.statusMap[e] = n.None)
    ;(this.queued.length = 0), this.queued.push(...i)
    const s = []
    for (const e of this.active) t[e] ? s.push(e) : (this.statusMap[e] = n.None)
    ;(this.active.length = 0), this.active.push(...s)
  }
}
export default class PrerendererModule extends Module {
  constructor() {
    super(...arguments), (this.name = "prerenderer-module"), (this.lastPrerendered = null)
  }
  async init(e, t) {
    ;([this.settings, this.sweepData] = await Promise.all([await t.market.waitForData(SettingsData), await t.market.waitForData(SweepsData)])),
      (this.panoRenderer = (await t.getModuleBySymbol(PanoSymbol)).getRenderer()),
      (this.preRenderer = new l(this.panoRenderer)),
      this.bindings.push(
        t.subscribe(RestrictSweepsSetMessage, e => this.onRestrictSweepsSet(e.sweepIds)),
        t.subscribe(RestrictedSweepsMessage, () => this.onRestrictedSweepsClear())
      )
  }
  enabled() {
    return this.settings.getOverrideParam("pre", true)
  }
  onUpdate() {
    this.enabled() && this.preRenderer.processQueued()
  }
  getCurrentSweeps() {
    return this.currentRestrictedSweeps || []
  }
  onRestrictSweepsSet(e) {
    this.enabled() &&
      ((this.lastPrerendered = null),
      e && e.length >= 3 && ((this.lastPrerendered = e[2]), this.preRenderer.tryPreRender(this.lastPrerendered)),
      this.cleanup(this.sweepData),
      (this.currentRestrictedSweeps = e))
  }
  onRestrictedSweepsClear() {
    this.enabled() && (this.cleanup(this.sweepData, !0), (this.currentRestrictedSweeps = null))
  }
  cleanup(e, t = !1) {
    const i = []
    e.transition.active
      ? (e.transition.from && i.push(e.transition.from), e.transition.to && i.push(e.transition.to))
      : e.currentSweep && i.push(e.currentSweep),
      this.lastPrerendered && i.push(this.lastPrerendered),
      t && this.panoRenderer.freeAllTextures(i),
      this.preRenderer.cleanup(i)
  }
}
