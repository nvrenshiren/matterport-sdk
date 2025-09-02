import { EditFromParentCommand, StopEditFromParentCommand } from "../command/application.command"
import { WorkShopCloudControlSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { ShowcaseReadyCommand, ShowcaseStartCommand, ShowcaseStopCommand } from "../command/showcase.command"

enum ShowcaseAction {
  ShowcaseStart = "JMYDCase-start",
  ShowcaseStop = "JMYDCase-stop",
  ShowcaseReady = "JMYDCase-ready",
  ShowcaseEdit = "JMYDCase-edit",
  ShowcaseStopEdit = "JMYDCase-stop-edit"
}
declare global {
  interface SymbolModule {
    [WorkShopCloudControlSymbol]: CloudControlModule
  }
}
export default class CloudControlModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "cloud-control"),
      (this.onMessage = e => {
        var t, s
        const n = null === (t = e.data) || void 0 === t ? void 0 : t.action
        n === ShowcaseAction.ShowcaseEdit
          ? this.enterEditMode(null === (s = e.data) || void 0 === s ? void 0 : s.initialTool)
          : n === ShowcaseAction.ShowcaseStopEdit && this.exitEditMode()
      }),
      (this.onShowcaseReady = async () => {
        this.postMessageEnabled && window.parent.postMessage({ action: ShowcaseAction.ShowcaseReady }, "*")
      }),
      (this.enterEditMode = e => {
        this.postMessageEnabled && this.engine.commandBinder.issueCommand(new EditFromParentCommand(e))
      }),
      (this.exitEditMode = () => {
        this.postMessageEnabled && this.engine.commandBinder.issueCommand(new StopEditFromParentCommand())
      }),
      (this.toggleShowcase = e => {
        const t = e ? ShowcaseAction.ShowcaseStart : ShowcaseAction.ShowcaseStop
        window.parent.postMessage({ action: t }, "*")
      })
  }
  async init(e, t) {
    ;(this.engine = t),
      (this.postMessageEnabled = window !== window.parent),
      this.postMessageEnabled && window.addEventListener("message", this.onMessage),
      this.bindings.push(
        t.commandBinder.addBinding(ShowcaseStartCommand, async () => this.toggleShowcase(!0)),
        t.commandBinder.addBinding(ShowcaseStopCommand, async () => this.toggleShowcase(!1)),
        t.commandBinder.addBinding(ShowcaseReadyCommand, this.onShowcaseReady)
      )
  }
  dispose() {
    this.postMessageEnabled && window.removeEventListener("message", this.onMessage)
  }
  onUpdate() {}
}
