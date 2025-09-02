import { AppStatus } from "../data/app.data"
declare global {
  interface Window {
    profilingData: {
      phaseTimes: ModuleProfiler["phaseTimes"]
      modules: ModuleProfiler["modules"]
      rows: moduleItem[]
    }
  }
}
type moduleItem = [string, string, null, number, number, null, number, string]
interface addModule {
  moduleName: string
  isModule: boolean
  startAwait: number
  finishAwait: number
}
export default class ModuleProfiler {
  phaseTimes: number[]
  modules: Record<string, moduleItem>
  constructor() {
    this.phaseTimes = []
    this.modules = {}
    this.onDataRegister = this.onDataRegister.bind(this)
    this.addAppPhase(AppStatus.UNINITIALIZED)
    window.profilingData = {
      phaseTimes: this.phaseTimes,
      modules: this.modules,
      rows: []
    }
  }
  addAppPhase(e: AppStatus) {
    ;(e !== AppStatus.PLAYING && e !== AppStatus.ERROR) || (window.profilingData.rows = [...Object.values(this.modules)].sort((e, t) => e[4] - t[4])),
      (this.phaseTimes[e] = Date.now())
  }
  addModuleLoadTime(e: string, t: number, n: number, i: addModule[]) {
    e = e.replace("Symbol(", "Module(")
    const s = [i.map(e => `${e.moduleName}`)].join(",")
    const r = i.reduce((e, t) => e + t.finishAwait - t.startAwait, 0)
    const a = Math.min(100, (r / (n - t)) * 100)
    this.modules[e] = [e, e, null, t, n, null, a, s]
  }
  onDataRegister(e: string, t: number) {
    this.modules[e] = [e, e, null, t, t, null, 0, ""]
  }
}
