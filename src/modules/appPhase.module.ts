import { AppPhaseSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { AppData, AppMode, AppStatus } from "../data/app.data"
import { AppChangeMessage, AppPhaseChangeMessage, ApplicationLoadedMessage } from "../message/app.message"
import { setAppName } from "../utils/appname.utils"
import { setAppVersion } from "../utils/appversion.utils"
import Engine from "../core/engine"
import EngineContext from "../core/engineContext"

declare global {
  interface SymbolModule {
    [AppPhaseSymbol]: AppPhaseModule
  }
}

export default class AppPhaseModule extends Module {
  broadcast: Engine["broadcast"]
  tasks: Function
  appState: AppData

  constructor() {
    super(...arguments)
    this.name = "app-phase"
  }
  async init(e, t: EngineContext) {
    this.broadcast = t.broadcast.bind(t)
    this.tasks = e.tasks
    this.appState = new AppData(AppStatus.UNINITIALIZED)
    this.appState.phase = AppStatus.UNINITIALIZED
    this.appState.phaseTimes[AppStatus.UNINITIALIZED] = Date.now()
    this.appState.application = AppMode.SHOWCASE
    this.appState.onChanged(() => {
      this.appState.error && this.updateCurrentPhase(AppStatus.ERROR)
    })
    t.market.register(this, AppData, this.appState)
    this.watchTasks(this.appState.phase)
    this.watchErrors()
    this.updateAppHeaders()
    this.bindings.push(this.appState.onPropertyChanged("application", () => this.updateAppHeaders()))
  }

  async watchTasks(e) {
    if (e >= AppStatus.PLAYING) return
    const t = e + 1
    try {
      await Promise.all(this.tasks[t])
    } catch (e) {
      this.error(e)
    }
    t === AppStatus.PLAYING && this.broadcast(new ApplicationLoadedMessage(this.appState.application))
    this.appState.phase !== AppStatus.ERROR && e !== AppStatus.ERROR && (this.updateCurrentPhase(t), this.watchTasks(t))
  }

  async watchErrors() {
    try {
      await Promise.all(this.tasks[AppStatus.ERROR])
    } catch (e) {
      this.error(e)
    }
  }

  updateCurrentPhase(e) {
    this.log.info(`Entering "${AppStatus[e]}" for "${this.appState.application}"`)
    this.appState.phase = e
    this.appState.phaseTimes[e] = Date.now()
    this.log.debug(this.appState.toString())
    this.appState.commit()
    this.broadcast(new AppPhaseChangeMessage(e, this.appState.application))
  }

  error(e) {
    this.appState.error = e
    this.appState.commit()
  }

  updateActiveApp(e) {
    this.appState.application = e
    this.appState.commit()
    this.broadcast(new AppChangeMessage(e))
  }

  getData() {
    return this.appState
  }

  updateAppHeaders() {
    this.log.debug(`updating application headers ${this.appState.application}`)
    setAppName(this.appState.getName())
    setAppVersion(this.appState.getVersion())
  }
}
