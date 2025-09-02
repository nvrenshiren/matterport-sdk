import * as o from "../const/51524"
import { ChunkConfig } from "../const/51524"
import { AutomationSupportSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
declare global {
  interface SymbolModule {
    [AutomationSupportSymbol]: AutomationSupportModule
  }
}
export default class AutomationSupportModule extends Module {
  constructor() {
    super(...arguments), (this.name = "automation-support")
  }
  async init(t, e: EngineContext) {
    const i = window
    if (i.MP_AUTOMATION) this.addAutomationHooks(e, i.MP_AUTOMATION)
    else {
      const t = performance.now()
      const s = setInterval(() => {
        i.MP_AUTOMATION ? (this.addAutomationHooks(e, i.MP_AUTOMATION), clearInterval(s)) : performance.now() - t > 5e3 && clearInterval(s)
      }, 100)
    }
  }
  async addAutomationHooks(t, e) {
    const i = await t.getModuleBySymbol(WebglRendererSymbol)
    ;(e.estimatedGPUMemoryAllocated = () => i.estimatedGPUMemoryAllocated()), (e.maxLOD = () => ChunkConfig.maxLOD)
  }
}
