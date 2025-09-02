import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
export class BaseControlsModule extends Module {
  inputBindings: ISubscription[]
  controls: any
  constructor(e?) {
    super(...arguments)
    this.name = "base-controls"
    this.inputBindings = []
  }
  registerActiveStateChangeBinding() {
    this.bindings.push(this.controls.onActiveStateChanged(() => this.onActiveStateChanged()))
  }
  updateInputBindings() {
    this.controls.isActive ? this.inputBindings.forEach(e => e.renew()) : this.inputBindings.forEach(e => e.cancel())
  }
  onActiveStateChanged() {
    this.controls.stop()
    this.updateInputBindings()
  }
  dispose(e) {
    super.dispose(e)
    for (const e of this.inputBindings) e.cancel()
    this.inputBindings = []
  }
}
