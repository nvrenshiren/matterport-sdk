import { InteractionMode, InteractionSource } from "../const/57053"
import { Data } from "../core/data"
export class InteractionData extends Data {
  name: string
  _source: string
  _mode: string
  constructor() {
    super(...arguments)
    this.name = "interaction"
    this._source = InteractionData.defaultSource
    this._mode = InteractionData.defaultMode
  }
  static get defaultMode() {
    return InteractionMode.Desktop
  }
  static get defaultSource() {
    return InteractionSource.None
  }
  get mode() {
    return this._mode
  }
  get source() {
    return this._source
  }
  updateSource(e) {
    this._source = e
  }
  updateMode(e) {
    this._mode = e
  }
  hasController(e = this.mode) {
    return e === InteractionMode.VrWithController || e === InteractionMode.VrWithTrackedController
  }
  isVR(e = this.mode) {
    return e === InteractionMode.VrOrientOnly || e === InteractionMode.VrWithController || e === InteractionMode.VrWithTrackedController
  }
  isMobile(e = this.mode) {
    return e === InteractionMode.Mobile
  }
}
