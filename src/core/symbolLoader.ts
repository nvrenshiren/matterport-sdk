import { DebugInfo } from "./debug"
import { OpenDeferred } from "./deferred"
import EngineContext from "./engineContext"
import { Module } from "./module"
export type LazyLoaderModule<M extends typeof Module = typeof Module> = (e?: string) => Promise<{ default: M }>
enum ModuleLoaderState {
  Registered = 0,
  Loading = 1,
  Initialized = 2,
  Unloaded = 3
}
interface ModuleData<M extends typeof Module = typeof Module> {
  es6ModulePromise: LazyLoaderModule
  ctorPromise: OpenDeferred<InstanceType<M>>
  initPromise: OpenDeferred<InstanceType<M>>
  state: ModuleLoaderState
  module?: InstanceType<M>
}
const debug = new DebugInfo("module-loader")

export default class SymbolLoader {
  symbolMap: Map<symbol, ModuleData>
  constructor() {
    this.symbolMap = new Map()
  }
  registerModule(e: symbol, t: LazyLoaderModule) {
    if (this.symbolMap.has(e)) throw Error(`Type ${String(e)} already registered`)
    this.symbolMap.set(e, {
      es6ModulePromise: t,
      ctorPromise: new OpenDeferred(),
      initPromise: new OpenDeferred(),
      state: ModuleLoaderState.Registered
    })
  }
  moduleRegistered(e: symbol) {
    return this.symbolMap.has(e)
  }
  moduleLoaded(e: symbol) {
    const t = this.symbolMap.get(e)
    return !!t && ![ModuleLoaderState.Registered, ModuleLoaderState.Unloaded].includes(t.state)
  }
  getModule<K extends keyof SymbolModule>(e: K) {
    const t = this.symbolMap.get(e)
    if (!t) throw Error(`Trying to get ${String(e)} before it was registered!`)
    if (t.state === ModuleLoaderState.Unloaded) throw Error(`${String(e)} module unloaded`)
    return t.initPromise.nativePromise() as Promise<SymbolModule[K]>
  }
  getModuleSync<K extends keyof SymbolModule>(e: K) {
    const t = this.symbolMap.get(e)
    return t ? (t.state !== ModuleLoaderState.Initialized ? null : (t.module as SymbolModule[K])) : null
  }
  loadModule(e: EngineContext, t: symbol, n: any = {}) {
    const i = this.symbolMap.get(t)
    if (!i) throw Error(`${String(t)} not found`)
    if (i.state === ModuleLoaderState.Initialized) return i
    if (i.state !== ModuleLoaderState.Registered && i.state !== ModuleLoaderState.Unloaded) throw Error(`${String(t)} already loading`)
    i.state = ModuleLoaderState.Loading
    const s = String(t)
    i.es6ModulePromise(s)
      .then(s => {
        if (!s.default) throw new Error(`${String(t)} has no default export during module loading`)
        const r = new s.default()
        i.ctorPromise.resolve(r).then(() => {
          const t = Date.now()
          let s = !1
          setTimeout(() => {
            s || debug.debug(`${r.name} init took over 2 seconds`)
          }, 2e3)
          r.init(n, e)
            .then(() => {
              debug.debug(`${r.name} init took ${(Date.now() - t) / 1e3} secs.`)
              s = !0
              i.state = ModuleLoaderState.Initialized
              i.module = r
              i.initPromise.resolve(r)
            })
            .catch(e => {
              i.initPromise.reject(e)
            })
        })
      })
      .catch(e => {
        debug.error(`Failed to load es6Module for ${String(t)}: ${e}`), i.initPromise.reject(e)
      })
    return i
  }
  whenQueueEmpties(e: number) {
    const t: OpenDeferred<Module>[] = []
    const n = new Map<symbol, OpenDeferred<Module>>()
    for (const [e, i] of this.symbolMap) i.state === ModuleLoaderState.Loading && (t.push(i.initPromise), n.set(e, i.initPromise))
    for (const [t, i] of n) {
      const n = setTimeout(() => {
        debug.debugInfo("still loading", t)
      }, e)
      i.then(() => {
        clearTimeout(n)
      })
    }
    return OpenDeferred.all(t).nativePromise()
  }
  unloadModule(e: symbol) {
    const t = this.symbolMap.get(e)
    if (!t) throw Error("Attempting to unload unregistered module")
    if (t.state === ModuleLoaderState.Unloaded || t.state === ModuleLoaderState.Registered) throw Error("Attempting to unload not-loaded module")
    t.state = ModuleLoaderState.Unloaded
    t.ctorPromise = new OpenDeferred()
    t.initPromise = new OpenDeferred()
    t.module = void 0
  }
}
