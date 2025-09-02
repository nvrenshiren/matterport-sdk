import { SetMouseCursorCommand } from "../command/cursor.command"
import { MouseSymbol } from "../const/symbol.const"
import { Module } from "../core/module"

declare global {
  interface SymbolModule {
    [MouseSymbol]: MouseCursorModule
  }
}
export default class MouseCursorModule extends Module {
  activeCursor: any
  config: {
    container: HTMLDivElement
    classPrefix: string
  }
  constructor() {
    super(...arguments)
    this.name = "mouse-cursor"
    this.activeCursor = null
  }

  async init(e, t) {
    this.config = Object.assign({ classPrefix: "cursor" }, e)

    this.bindings.push(t.commandBinder.addBinding(SetMouseCursorCommand, async e => this.changeCursor(e.cursor)))
  }

  changeCursor(e) {
    const { container, classPrefix } = this.config
    e !== this.activeCursor &&
      (this.activeCursor && container.classList.remove(`${classPrefix}-${this.activeCursor}`),
      e && container.classList.add(`${classPrefix}-${e}`),
      (this.activeCursor = e))
  }
}
