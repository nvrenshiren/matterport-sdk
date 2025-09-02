import { DebugInfo } from "./debug"
import EngineContext from "./engineContext"
import { ISubscription } from "./subscription"
export class Module {
  bindings: ISubscription[]
  _logger: DebugInfo
  name: string
  constructor(...e: any[]) {
    this.bindings = []
  }
  async init(e: any, t: EngineContext) {
    return Promise.resolve()
  }
  onUpdate(e) {}
  dispose(e) {
    for (const e of this.bindings) e?.cancel()
    this.bindings = []
  }
  get log() {
    this._logger = this._logger || new DebugInfo(this.name || "module")
    return this._logger
  }
}
