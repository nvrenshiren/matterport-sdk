import { EventCommon } from "@ruler3d/common"
import Engine from "../core/engine"
import { AppData, AppStatus } from "../data/app.data"
import { AppPhaseChangeMessage } from "../message/app.message"
import { MeshProgressBindingMessage } from "../message/mesh.message"
declare global {
  namespace eventList {
    interface data {
      "app.phasechange": (status: AppPhaseChangeMessage) => void
      "app.progress": (status: MeshProgressBindingMessage) => void
    }
  }
}
export class AppInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {
    this.engine?.subscribe(AppPhaseChangeMessage, e => {
      EventCommon.EventBus.emit("app.phasechange", e)
    })
    this.engine?.subscribe(MeshProgressBindingMessage, e => {
      EventCommon.EventBus.emit("app.progress", e)
    })
  }
  getState() {
    const data = this.engine?.market.getData(AppData)
    return { phase: data?.phase, application: data?.application, phaseTimes: data?.phaseTimes }
  }
  getLoadTimes() {
    const initData = { [AppStatus.WAITING]: null, [AppStatus.LOADING]: null, [AppStatus.STARTING]: null, [AppStatus.PLAYING]: null, [AppStatus.ERROR]: null }
    const data = this.engine?.market.getData(AppData)!
    for (const e in data.phaseTimes) {
      const a = Number(e)
      initData[a] = data.phaseTimes[a]
    }
    return initData as Record<AppStatus, number | null>
  }
}
