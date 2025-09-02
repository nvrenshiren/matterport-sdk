import { RenameFloorCommand } from "../command/floors.command"
import { WorkShopFloorsEditSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { FloorsData } from "../data/floors.data"
declare global {
  interface SymbolModule {
    [WorkShopFloorsEditSymbol]: FloorsEditorModule
  }
}
export default class FloorsEditorModule extends Module {
  onRename: (t: any) => Promise<void>
  floorsData: FloorsData
  constructor() {
    super(...arguments),
      (this.name = "floors-editor"),
      (this.onRename = async t => {
        if (void 0 === t.text) throw new Error("Text Required")
        this.floorsData.rename(t.floorId, t.text)
      })
  }
  async init(t, e) {
    ;(this.floorsData = await e.market.waitForData(FloorsData)), this.bindings.push(e.commandBinder.addBinding(RenameFloorCommand, this.onRename))
  }
  dispose(t) {
    super.dispose(t)
  }
}
