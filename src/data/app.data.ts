import { Data } from "../core/data"
import { OpenDeferred } from "../core/deferred"
import { ObservableProxy, createObservableProxy } from "../observable/observable.proxy"

export enum AppStatus {
  ERROR = 5,
  LOADING = 2,
  PLAYING = 4,
  STARTING = 3,
  UNINITIALIZED = 0,
  WAITING = 1
}
export enum AppMode {
  UNKNOWN = "unknown",
  WEBVR = "webvr",
  SHOWCASE = "JMYDCase",
  WORKSHOP = "workshop"
}

export class AppData extends Data {
  name: string
  phases: typeof AppStatus
  playingPromise: OpenDeferred<any>
  phase: AppStatus
  application: AppMode
  phaseTimes: ObservableProxy<Record<AppStatus, number>>
  error: null | Error
  constructor(e: AppStatus, t = AppMode.UNKNOWN) {
    super()
    this.name = "app"
    this.phases = AppStatus
    this.playingPromise = new OpenDeferred()
    this.phase = e
    this.application = t
    this.phaseTimes = createObservableProxy({
      [AppStatus.UNINITIALIZED]: 0,
      [AppStatus.WAITING]: 0,
      [AppStatus.LOADING]: 0,
      [AppStatus.STARTING]: 0,
      [AppStatus.PLAYING]: 0,
      [AppStatus.ERROR]: 0
    })
    this.error = null
    this.onPhase(() => {
      this.playingPromise.resolve()
    }, AppStatus.PLAYING)
  }
  getName() {
    return this.application.toString()
  }
  getVersion() {
    return "20240906"
  }
  onPhase(e?: Function, t?: AppStatus) {
    return this.onPropertyChanged("phase", n => {
      ;(t && n !== t) || e?.()
    })
  }
  get waitForPlaying() {
    return this.playingPromise.nativePromise()
  }
  toString() {
    return JSON.stringify({
      application: this.getName(),
      version: this.getVersion(),
      error: this.error,
      phaseTimes: this.phaseTimes
    })
  }
}
