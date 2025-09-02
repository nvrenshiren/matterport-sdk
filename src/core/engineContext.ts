import Engine from "./engine"
import MarketContext from "./marketContext"

function e(e, t) {
  for (const n in t) if (e === t[n].module) return n.replace("Symbol(", "Module(")
  return "[Unknown module]"
}
export default class EngineContext {
  engine: Engine
  moduleLookup: Engine["moduleLookup"]
  fetchedModules: Array<{ moduleName: string; isModule: boolean; startAwait: number; finishAwait: number }>
  messageBus: Engine["messageBus"]
  market: MarketContext
  commandBinder: Engine["commandBinder"]
  getModuleBySymbolSync: Engine["getModuleBySymbolSync"]
  tryGetModuleBySymbolSync: Engine["tryGetModuleBySymbolSync"]
  addComponent: Engine["addComponent"]
  getComponentByType: Engine["getComponentByType"]
  getComponents: Engine["getComponents"]
  removeComponent: Engine["removeComponent"]
  subscribe: Engine["subscribe"]
  unsubscribe: Engine["unsubscribe"]
  broadcast: Engine["broadcast"]
  claimRenderLayer: Engine["claimRenderLayer"]
  getRenderLayer: Engine["getRenderLayer"]
  disposeRenderLayer: Engine["disposeRenderLayer"]
  startGenerator: Engine["startGenerator"]
  stopGenerator: Engine["stopGenerator"]
  after: Engine["after"]
  toggleRendering: Engine["toggleRendering"]
  constructor(e: Engine, t: Engine["moduleLookup"], n: Function) {
    this.engine = e
    this.moduleLookup = t
    this.fetchedModules = []
    this.messageBus = e.msgBus
    this.market = new MarketContext(e.market, t, n)
    this.commandBinder = e.commandBinder
    this.getModuleBySymbolSync = e.getModuleBySymbolSync.bind(e)
    this.tryGetModuleBySymbolSync = e.tryGetModuleBySymbolSync.bind(e)
    this.addComponent = e.addComponent.bind(e)
    this.getComponentByType = e.getComponentByType.bind(e)
    this.getComponents = e.getComponents.bind(e)
    this.removeComponent = e.removeComponent.bind(e)
    this.subscribe = e.subscribe.bind(e)
    this.unsubscribe = e.unsubscribe.bind(e)
    this.broadcast = e.broadcast.bind(e)
    this.claimRenderLayer = e.claimRenderLayer.bind(e)
    this.getRenderLayer = e.getRenderLayer.bind(e)
    this.disposeRenderLayer = e.disposeRenderLayer.bind(e)
    this.startGenerator = e.startGenerator.bind(e)
    this.stopGenerator = e.stopGenerator.bind(e)
    this.after = e.after.bind(e)
    this.toggleRendering = e.toggleRendering.bind(e)
  }
  async getModuleBySymbol<K extends keyof SymbolModule>(t: K) {
    const n = Date.now()
    const module = await this.engine.getModuleBySymbol(t)
    const i = Date.now()
    this.fetchedModules.push({
      moduleName: e(module, this.moduleLookup),
      isModule: !0,
      startAwait: n,
      finishAwait: i
    })
    return module
  }
  getLoadedDependencies() {
    return [...this.fetchedModules, ...this.market.getLoadedDependencies()]
  }
  get msgBus() {
    return this.messageBus
  }
}
