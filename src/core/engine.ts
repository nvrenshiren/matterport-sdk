import { OpenDeferred } from "./deferred"

import { EngineTickState } from "../const/engineTick.const"
import { CommandBinder } from "./commandBinder"
import { DebugInfo } from "./debug"
import EngineContext from "./engineContext"
import { EngineGenerators, GeneratorsProcess } from "./engineGenerators"
import { RenderLayers } from "./layers"
import Market from "./market"
import { MessageBus, MessageCallback, MessageType } from "./messageBus"
import { Module } from "./module"
import ModuleProfiler from "./moduleProfiler"
import ShowCase from "./showcase"
import SymbolLoader, { LazyLoaderModule } from "./symbolLoader"
import { AppPhaseChangeMessage } from "../message/app.message"
import { Message } from "./message"
export interface ModuleItem<K extends keyof SymbolModule = keyof SymbolModule> {
  type: K
  promise: LazyLoaderModule
}
const debug = new DebugInfo("engine")
let tickState = EngineTickState.End
export default class Engine {
  moduleLookup: Record<string, { symbol: symbol; module?: Module; initialized: boolean; initPromise: Promise<Module> }>
  componentLookup: Record<string, Array<{ component: any; active: boolean }>>
  currentApplication: null | ShowCase
  moduleProfiler: ModuleProfiler
  commandBinder: CommandBinder
  market: Market
  messageBus: MessageBus
  engineGenerators: EngineGenerators
  layers: RenderLayers
  symbolLoader: SymbolLoader
  afterPhasePromises: OpenDeferred[]
  afterPhaseListenerCount: number[]
  moduleLoadInjectionHook: null | ((name: string, config: any) => any)
  lastTick: number
  constructor() {
    this.moduleLookup = {}
    this.componentLookup = {}
    this.currentApplication = null
    this.moduleProfiler = new ModuleProfiler()
    this.commandBinder = new CommandBinder()
    this.market = new Market()
    this.messageBus = new MessageBus()
    this.engineGenerators = new EngineGenerators()
    this.layers = new RenderLayers()
    this.symbolLoader = new SymbolLoader()
    this.afterPhasePromises = []
    this.afterPhaseListenerCount = []
    this.resetPromises()
    this.subscribe(AppPhaseChangeMessage, e => this.moduleProfiler.addAppPhase(e.phase))
    if (process.env.NODE_ENV === "development") {
      window["engine"] = this
    }
  }
  async loadApplication(e: ShowCase, t: Function, autoPlay = false) {
    if (e === this.currentApplication) throw Error("Application already loaded")
    const i = (this.currentApplication ? this.currentApplication.getManifest() : []).map(e => e.type)
    const s = e.getManifest()
    const r = s.map(e => e.type)
    const currentApplication = this.currentApplication
    this.currentApplication = null
    const o = s.filter(e => -1 === i.indexOf(e.type))
    for (const e of o) this.symbolLoader.moduleRegistered(e.type) || this.registerModule(e)
    if (currentApplication)
      try {
        await this.unload(currentApplication, e => !r.includes(e))
      } catch (e) {
        debug.error(e), t && t(e)
      }
    try {
      this.currentApplication = e
      await e.load(this, {
        coldStart: null === currentApplication,
        autoPlay
      })
    } catch (e) {
      debug.error(e), t && t(e)
    }
  }
  async unload(e: ShowCase, t?: <K extends keyof SymbolModule>(e: K) => boolean) {
    const n = [
      ...e
        .getManifest()
        .map(e => e.type)
        .filter(t || (() => !0))
        .map((e: keyof SymbolModule) => this.unloadModuleBySymbol(e)),
      e.unload(this)
    ]
    n.length && (await Promise.all(n))
  }
  async dispose() {
    this.currentApplication && (await this.unload(this.currentApplication), this.currentApplication.stop(), (this.currentApplication = null))
  }
  registerModule(e: ModuleItem) {
    if (this.currentApplication) throw Error("Cannot register modules while application is running")
    this.symbolLoader.registerModule(e.type, e.promise)
  }
  loadModuleBySymbol<K extends keyof SymbolModule>(e: { type: K; config?: any }) {
    const t = e,
      i = String(t.type)
    this.moduleLoadInjectionHook && (t.config = this.moduleLoadInjectionHook(i, t.config || {}))
    const s = new EngineContext(this, this.moduleLookup, this.moduleProfiler.onDataRegister),
      r = Date.now(),
      a = this.symbolLoader.loadModule(s, t.type, t.config)
    a.ctorPromise.then(e => {
      this.moduleLookup[i] = {
        symbol: t.type,
        module: e,
        initialized: !1,
        initPromise: a.initPromise.nativePromise()
      }
    })
    a.initPromise.then(e => {
      this.moduleProfiler.addModuleLoadTime(i, r, Date.now(), s.getLoadedDependencies())
      this.moduleLookup[i].initialized = !0
    })
    return a.initPromise.nativePromise() as Promise<SymbolModule[K]>
  }
  setLoadInjection(e: (name: string, config: any) => boolean) {
    if (void 0 !== this.moduleLoadInjectionHook) throw Error("Hook already registered")
    this.moduleLoadInjectionHook = e
  }
  async unloadModuleBySymbol<K extends keyof SymbolModule>(e: K) {
    if (!this.symbolLoader.moduleLoaded(e)) return void debug.debug(`${String(e)} module already unloaded`)
    debug.debug(`Unloading ${String(e)} module`)
    const t = await this.getModuleBySymbol(e)
    const n = this.getModuleIndex(t as Module)
    if (this.componentLookup[n]) {
      await Promise.all(
        this.componentLookup[n].map(async e => {
          await this.removeComponent(t as Module, e.component), e.component.dispose()
        })
      )
      this.componentLookup[n] = []
    }

    this.symbolLoader.unloadModule(e)
    t.dispose(this)
  }
  async waitForLoadingModules(e = 1000) {
    await Promise.all([this.symbolLoader.whenQueueEmpties(e)])
  }
  getModuleBySymbol<K extends keyof SymbolModule>(e: K) {
    return this.symbolLoader.getModule(e)
  }
  getModuleBySymbolSync<K extends keyof SymbolModule>(e: K) {
    return this.symbolLoader.getModuleSync(e)
  }
  tryGetModuleBySymbolSync<K extends keyof SymbolModule>(e: K) {
    try {
      return this.getModuleBySymbolSync(e)
    } catch (e) {
      return null
    }
  }
  getComponentByType(e) {
    for (const t in this.moduleLookup) {
      const n = this.moduleLookup[t].module!
      const i = this.getModuleIndex(n)
      const s = this.componentLookup[i] || []
      for (const t of s) if (t.component instanceof e) return t.component
    }
    return null
  }
  async addComponent<M extends Module = Module>(e: M, t: any) {
    const n = this.getModuleIndex(e)
    let i = this.componentLookup[n]
    i || (this.componentLookup[n] = i = [])
    let s = -1
    for (let e = 0; e < i.length; e++) {
      if (i[e].component === t) {
        s = e
        break
      }
    }

    if (
      (-1 === s &&
        ((s =
          i.push({
            component: t,
            active: !1
          }) - 1),
        t.init()),
      i[s].active)
    ) {
      throw Error("Tried to add already active component: " + typeof t)
    }
    await t.activate(this)
    i[s].active = !0
  }
  async removeComponent<M extends Module = Module>(e: M, t: any) {
    const n = this.getModuleIndex(e),
      i = this.componentLookup[n]
    if (i) {
      let e: { component: any; active: boolean } | null = null
      for (const n of i)
        if (n.component === t) {
          e = n
          break
        }
      e && e.active && (await t.deactivate(this), (e.active = !1))
    }
  }
  tick() {
    if (tickState !== EngineTickState.End) throw Error("Engine.tick called outside of waiting. Did the engine get called recursively?!")
    tickState = EngineTickState.Begin
    this.resolveAfterPhase(EngineTickState.Begin)
    const e = performance.now()
    const t = this.lastTick ? e - this.lastTick : 16
    this.lastTick = e
    tickState = EngineTickState.Logic
    try {
      for (const e in this.moduleLookup) {
        const n = this.moduleLookup[e]
        n && n.initialized && n.module?.onUpdate(t)
      }
    } catch (e) {
      throw (debug.error(e), e)
    }
    this.resolveAfterPhase(EngineTickState.Logic)
    this.engineGenerators.processGenerators(GeneratorsProcess.Phase, EngineTickState.Logic)
    try {
      this.renderComponents(t)
    } catch (e) {
      throw (debug.error(e), e)
    }
    try {
      tickState = EngineTickState.Render
      this.resolveAfterPhase(EngineTickState.Render)
      this.engineGenerators.processGenerators(GeneratorsProcess.Phase, EngineTickState.Render)
      tickState = EngineTickState.End
      this.resolveAfterPhase(EngineTickState.End)
      this.engineGenerators.processGenerators(GeneratorsProcess.None)
      this.engineGenerators.processGenerators(GeneratorsProcess.Promise)
      this.engineGenerators.processGenerators(GeneratorsProcess.Duration)
    } catch (e) {
      throw (debug.error(e), e)
    }
  }
  subscribe<M extends typeof Message = typeof Message>(e: M, t: MessageCallback<M>, n = MessageType.PERMANENT) {
    return this.messageBus.subscribe(e, t, n)
  }
  unsubscribe<M extends typeof Message>(e: M, t: MessageCallback<M>) {
    this.messageBus.unsubscribe(e, t)
  }
  broadcast<T extends Message = Message>(e: T) {
    this.messageBus.broadcast(e)
  }
  claimRenderLayer(e: string) {
    return this.layers.claimLayer(e)
  }
  getRenderLayer(e: string) {
    return this.layers.getLayer(e)
  }
  disposeRenderLayer(e: string) {
    this.layers.disposeLayer(e)
  }
  startGenerator(e: () => Generator) {
    this.engineGenerators.startGenerator(e)
  }
  stopGenerator(e: () => Generator) {
    this.engineGenerators.stopGenerator(e)
  }
  after(e: EngineTickState) {
    this.afterPhaseListenerCount[e]++
    return this.afterPhasePromises[e].nativePromise()
  }
  getModuleIndex<M extends Module = Module>(e: M) {
    for (const t in this.moduleLookup) if (this.moduleLookup[t] && this.moduleLookup[t].module === e) return t
    return ""
  }
  *getComponents() {
    for (const e in this.moduleLookup) {
      const t = this.componentLookup[e]
      if (t) for (const e of t) yield e
    }
  }
  toggleRendering(e, t) {
    const n = this.getModuleIndex(e),
      i = this.componentLookup[n]
    if (i) for (const e of i) e.active = t
  }
  renderComponents(e) {
    for (const t in this.moduleLookup) {
      const n = this.componentLookup[t]
      if (n) for (const t of n) t.active && t.component.beforeRender && t.component.beforeRender(e)
    }
    for (const t in this.moduleLookup) {
      if (!t) continue
      const n = this.componentLookup[t]
      if (n) for (const t of n) t.active && t.component.render(e)
    }
  }
  resetPromises() {
    this.resetAfterPhasePromises()
  }
  resetAfterPhasePromises() {
    this.resetAfterPhasePromise(EngineTickState.Logic),
      this.resetAfterPhasePromise(EngineTickState.Render),
      this.resetAfterPhasePromise(EngineTickState.Begin),
      this.resetAfterPhasePromise(EngineTickState.End)
  }
  resetAfterPhasePromise(e: EngineTickState) {
    ;(this.afterPhasePromises[e] = new OpenDeferred()), (this.afterPhaseListenerCount[e] = 0)
  }
  resolveAfterPhase(e: EngineTickState) {
    this.afterPhaseListenerCount[e] > 0 && (this.afterPhasePromises[e].resolve(), this.resetAfterPhasePromise(e))
  }
  get msgBus() {
    return this.messageBus
  }
}
