import { AppPhaseSymbol, WorkShopAppSwitchSymbol } from "../const/symbol.const"
import { isMobilePhone } from "../utils/browser.utils"
declare global {
  interface SymbolModule {
    [WorkShopAppSwitchSymbol]: AppSwitchModule
  }
}
class AppSwitchViewData extends Data {
  expandedIframe: boolean
  editMode: boolean
  constructor() {
    super(...arguments)
    this.name = "app-switch-view-data"
    this.expandedIframe = !1
    this.editMode = !1
  }
}

import { AppSwitchCommand, EditFromParentCommand, ExpandAppCommand, StartApplicationCommand, StopEditFromParentCommand } from "../command/application.command"
import { CloseRemoveToolsCommand } from "../command/tool.command"
import { ConfirmModalCommand, ConfirmModalState } from "../command/ui.command"
import { cloudInitialToolKey } from "../const/tools.const"
import { Data } from "../core/data"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppMode, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { SettingsData } from "../data/settings.data"
import { ToolsData } from "../data/tools.data"
import { AppPhaseChangeMessage } from "../message/app.message"
import { SetAppBarVisibleMessage } from "../message/panel.message"
import { ShowcaseExpandedMessage } from "../message/showcase.message"
import { sameWindow } from "../utils/browser.utils"
import AppPhaseModule from "./appPhase.module"

const De = window.matchMedia("(orientation: landscape) and (min-aspect-ratio: 16/9) and (max-height: 576px)")
export default class AppSwitchModule extends Module {
  appPhase: AppStatus
  appBarLoaded: boolean
  iframe: boolean
  ready: boolean
  waitingToEdit: boolean
  isExpanded: () => any
  data: AppSwitchViewData
  isEditMode: () => any
  isIFrame: () => any
  getAppPhase: () => any
  onEditFromParent: (e: any) => Promise<boolean>
  onStopEditFromParent: () => Promise<void>
  engine: EngineContext
  onAppPhaseChangeMessage: (e: any) => Promise<void>
  config: any
  handleAppSwitchCommand: (e: any) => Promise<boolean>
  handleOrientationChange: ({ matches }: { matches: any }) => void
  onShowcaseExpandedMessage: (e: any) => void
  onToggleWorkshopAppBar: (e: any) => Promise<void>
  appPhaseModule: AppPhaseModule
  disposeWorkshopBar: any
  constructor() {
    super(...arguments),
      (this.name = "app-switch"),
      (this.appPhase = AppStatus.UNINITIALIZED),
      (this.appBarLoaded = !1),
      (this.iframe = sameWindow()),
      (this.ready = !1),
      (this.waitingToEdit = !1),
      (this.isExpanded = () => this.data.expandedIframe),
      (this.isEditMode = () => this.data.editMode),
      (this.isIFrame = () => this.iframe),
      (this.getAppPhase = () => this.appPhase),
      (this.onEditFromParent = e => this.onAppSwitch(!0, e.initialTool)),
      (this.onStopEditFromParent = async () => {
        await this.onAppSwitch(!1), await this.engine.commandBinder.issueCommand(new ExpandAppCommand(!1))
      }),
      (this.onAppPhaseChangeMessage = async e => {
        this.appPhase = e.phase
        if (!this.ready && [AppStatus.WAITING, AppStatus.STARTING, AppStatus.PLAYING].includes(this.appPhase)) {
          this.ready = !0
          // await this.engine.commandBinder.issueCommand(new ShowcaseReadyCommand()),
          this.config.editMode && this.engine.commandBinder.issueCommand(new AppSwitchCommand(AppMode.WORKSHOP))
        }
        if (this.appPhase === AppStatus.PLAYING && this.waitingToEdit) {
          this.waitingToEdit = !1
          await this.switchApp()
        }
      }),
      (this.handleAppSwitchCommand = async e => this.onAppSwitch(e.application === AppMode.WORKSHOP)),
      (this.handleOrientationChange = ({ matches: e }) => {
        isMobilePhone() &&
          (e
            ? this.engine.broadcast(new SetAppBarVisibleMessage(!1))
            : (this.engine.broadcast(new SetAppBarVisibleMessage(!0)),
              this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.CLOSE)).catch(() => {})))
      }),
      (this.onShowcaseExpandedMessage = e => {
        ;(this.data.expandedIframe = e.expanded), this.data.commit(), this.setAppBarVisible(this.isAppBarEnabled())
      }),
      (this.onToggleWorkshopAppBar = async e => {
        this.isAppBarEnabled() && this.setAppBarVisible(e.visible)
      })
  }
  async init(e, t: EngineContext) {
    this.engine = t
    this.config = e
    this.data = new AppSwitchViewData()
    this.bindings.push(
      t.commandBinder.addBinding(AppSwitchCommand, this.handleAppSwitchCommand),
      t.commandBinder.addBinding(EditFromParentCommand, this.onEditFromParent),
      t.commandBinder.addBinding(StopEditFromParentCommand, this.onStopEditFromParent),
      t.subscribe(AppPhaseChangeMessage, this.onAppPhaseChangeMessage),
      t.subscribe(ShowcaseExpandedMessage, this.onShowcaseExpandedMessage),
      t.subscribe(SetAppBarVisibleMessage, this.onToggleWorkshopAppBar)
    )
    this.appPhaseModule = await t.getModuleBySymbol(AppPhaseSymbol)
    t.market.register(this, AppSwitchViewData, this.data)
  }
  dispose(e) {
    super.dispose(e)
    this.disposeWorkshopBar?.call(this)
  }
  async onAppSwitch(e, t?) {
    if (this.engine.market.tryGetData(ToolsData) && !(await this.engine.commandBinder.issueCommand(new CloseRemoveToolsCommand(!0)))) return !1
    const s = this.appPhase === AppStatus.WAITING
    this.data.editMode = e
    this.data.commit()
    const a = e ? AppMode.WORKSHOP : AppMode.SHOWCASE
    this.log.info(`Edit mode updated. Switching application to: ${a}`)
    this.appPhaseModule.updateActiveApp(a)
    this.waitingToEdit = s && this.data.editMode
    await this.engine.commandBinder.issueCommand(new StartApplicationCommand(s, e))
    ;(await this.engine.market.waitForData(SettingsData)).setProperty(cloudInitialToolKey, t ? t.toUpperCase() : "")
    if (!this.waitingToEdit) {
      const e = await this.engine.market.waitForData(CameraData)
      await this.switchApp(), await e.transition.promise
    }
    return !0
  }
  async switchApp() {
    await this.engine.commandBinder.issueCommand(new CloseRemoveToolsCommand(!1))
    this.data.editMode
      ? (this.handleOrientationChange(De), De.addEventListener("change", this.handleOrientationChange))
      : (De.removeEventListener("change", this.handleOrientationChange),
        this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.CLOSE)).catch(() => {}))
    const e = this.data.editMode ? this.config.workshop : this.config.showcase
    return this.config.switchApp(e)
  }
  setAppBarVisible(e) {
    const t = this.config.appContainer
    t && (e ? t.classList.add("app-bar") : t.classList.remove("app-bar"))
  }
  isAppBarEnabled() {
    return !this.config.cloudBarSetting || !this.iframe || this.data.expandedIframe || this.data.editMode
  }
  timeToLoadAppBar() {
    if (this.appBarLoaded) return !1
    switch (this.appPhase) {
      case AppStatus.PLAYING:
      case AppStatus.STARTING:
        return !0
      case AppStatus.WAITING:
        return !this.config.cloudBarSetting
    }
    return !1
  }

  onUpdate() {}
}
