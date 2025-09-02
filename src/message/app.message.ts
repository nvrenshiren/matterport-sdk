import { Message } from "../core/message"
import { AppMode, AppStatus } from "../data/app.data"
export class AppPhaseChangeMessage extends Message {
  phase: AppStatus
  application: AppMode
  constructor(e: AppStatus, t: AppMode) {
    super()
    this.phase = e
    this.application = t
  }
}
export class AppChangeMessage extends Message {
  application: AppMode
  constructor(e: AppMode) {
    super()
    this.application = e
  }
}
export class ApplicationLoadedMessage extends Message {
  application: AppMode
  constructor(e: AppMode) {
    super()
    this.application = e
  }
}
