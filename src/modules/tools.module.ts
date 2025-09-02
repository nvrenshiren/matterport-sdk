import { RegisterConfirmViewChangeCommand } from "../command/layers.command"
import { ResizeCanvasCommand } from "../command/screen.command"
import {
  CloseCurrentToolCommand,
  CloseRemoveToolsCommand,
  CloseToolCommand,
  OpenInitialToolCommand,
  OpenPreviousToolCommand,
  OpenToolCommand,
  RegisterToolsCommand,
  ToggleToolCommand,
  ToolBottomPanelCollapseCommand,
  ToolPanelToggleCollapseCommand
} from "../command/tool.command"
import { CloseModalCommand, ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState, ToggleModalCommand } from "../command/ui.command"
import * as f from "../const/25071"
import { TransactionState } from "../const/45905"
import { PhraseKey } from "../const/phrase.const"
import { AnalyticsSymbol, AppAnalyticsSymbol, ToolsSymbol } from "../const/symbol.const"
import { ToolPanelLayout, ToolsDuration, ToolsSize } from "../const/tools.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { ContainerData } from "../data/container.data"
import { SettingsData } from "../data/settings.data"
import { StorageData } from "../data/storage.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { AssetUndockedMessage, AssetDockedMessage, PanelCollapseMessage } from "../message/panel.message"
import { HandleTextBoxFocusMessage, LoadSpinnerMessage, ModalToggledMeeage } from "../message/ui.message"
import { ToolObject } from "../object/tool.object"
import * as x from "../other/19280"
import { createOffsetBasedResizeDimensions } from "../other/38319"
import { HasTool, isDeepLinkParam } from "../utils/59425"
import { StartTransition } from "../utils/6282"
import * as T from "../utils/80361"
import * as k from "../utils/observable.utils"
import AnalyticsModule from "./analytics.module"
declare global {
  interface SymbolModule {
    [ToolsSymbol]: ToolsModule
  }
}
export default class ToolsModule extends Module {
  activeToolDurationMap: Record<string, number>
  keyboardTimeout: number
  bottomPanelHeight: number
  sidePanelWidth: number
  sidePanelLeft: number
  initialUrlToolOpened: boolean
  closeAndRemoveTools: (e: any) => Promise<boolean>
  toolsData: ToolsData
  onAssetDocked: () => void
  onAssetUndocked: () => void
  handleTextBoxFocus: (e: any) => void
  onToggleModal: (e: any) => Promise<void>
  allowToolOrViewChange: () => Promise<boolean>
  engine: EngineContext
  toggleTool: (e: { toolName: any; active: any }) => Promise<void>
  closeCurrentTool: () => Promise<boolean>
  openInitialTool: () => Promise<void>
  openPreviousTool: () => Promise<void>
  updateLayoutSize: () => void
  handleToolCollapse: (e: any) => Promise<void>
  handleBottomPanelCollapse: (e: any) => Promise<any>
  adjustCanvasForPanelActual: () => Promise<void>
  containerData: ContainerData
  // analytics: AnalyticsModule
  appData: AppData
  storageData: StorageData
  toolInit: null | (() => Promise<any>)
  toolClosing: any
  settingsData: SettingsData
  closeModal: () => void
  adjustCanvasForPanel: (...e: any[]) => void
  resizeCanvas: (e) => void
  constructor() {
    super(...arguments)
    this.name = "tools-module"
    this.activeToolDurationMap = {}
    this.keyboardTimeout = 0
    this.bottomPanelHeight = 0
    this.sidePanelWidth = 0
    this.sidePanelLeft = 0
    this.initialUrlToolOpened = !1
    this.closeAndRemoveTools = async e =>
      !(e && !(await this.deactivateCurrentTool())) && (this.closeModal(), this.toolsData.setActiveTool(null), this.toolsData.removeAllTools(), !0)
    this.onAssetDocked = () => {
      this.toolsData.assetDocked = !0
      this.toolsData.commit()
    }
    this.onAssetUndocked = () => {
      this.toolsData.assetDocked = !1
      this.toolsData.commit()
    }
    this.handleTextBoxFocus = e => {
      window.clearTimeout(this.keyboardTimeout)
      e.focused
        ? (this.keyboardTimeout = window.setTimeout(() => {
            document.documentElement.classList.add("keyboard-layout")
          }, 500))
        : document.documentElement.classList.remove("keyboard-layout")
    }
    this.onToggleModal = async e => {
      this.toggleModal(e.modal, e.open)
    }
    this.closeModal = () => {
      this.toolsData.openModal && this.toggleModal(this.toolsData.openModal, !1)
    }
    this.allowToolOrViewChange = async () => {
      const t = this.toolsData.getActiveTool()
      if (!t?.manager?.hasPendingEdits) return !0
      if (await t.manager.hasPendingEdits()) {
        const e = {
          title: PhraseKey.TOOLS.UNSAVED_CHANGES_TITLE,
          message: PhraseKey.TOOLS.UNSAVED_CHANGES_MESSAGE,
          cancellable: !0,
          confirmPhraseKey: PhraseKey.TOOLS.UNSAVED_CHANGES_CONFIRM,
          cancelPhraseKey: PhraseKey.TOOLS.UNSAVED_CHANGES_CANCEL
        }
        return (await this.engine.commandBinder.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, e))) === ConfirmBtnSelect.CLOSE
      }
      return !0
    }
    this.toggleTool = async ({ toolName: e, active: t }) => (t ? this.openTool(e, !1) : this.closeTool(e))
    this.closeCurrentTool = async () => !!(await this.deactivateCurrentTool()) && (this.toolsData.setActiveTool(null), !0)
    this.openInitialTool = async () => {
      const t = HasTool(this.settingsData, this.initialUrlToolOpened)
      if (t) {
        const i = this.toolsData.getTool(t)
        if (i) {
          const s = isDeepLinkParam(this.settingsData, i)
          s && i.manager?.deepLink ? i.manager.deepLink(s) : this.engine.commandBinder.issueCommandWhenBound(new ToggleToolCommand(t, !0))
        }
      }
      this.initialUrlToolOpened = !0
    }
    this.openPreviousTool = async () => {
      this.toolsData.softOpening = !1
      this.toolsData.commit()
      const e = this.toolsData.previousToolName
      if (null === e) return
      const t = this.toolsData.getTool(e) || null
      null !== t
        ? (await this.deactivateCurrentTool(t)) && (await this.activateTool(t), this.toolsData.setActiveTool(e))
        : this.log.error(`Tool not loaded: ${e}`)
    }
    this.updateLayoutSize = () => {
      const { toolPanelLayout: e } = this.toolsData
      let t = e
      const i = this.isSidePanelLayout()
      switch (e) {
        case ToolPanelLayout.NORMAL:
          i || (t = ToolPanelLayout.NARROW)
          break
        case ToolPanelLayout.SIDE_PANEL:
          i || (t = ToolPanelLayout.BOTTOM_PANEL)
          break
        case ToolPanelLayout.NARROW:
          i && (t = ToolPanelLayout.NORMAL)
          break
        case ToolPanelLayout.BOTTOM_PANEL:
          i && (t = ToolPanelLayout.SIDE_PANEL)
      }
      t !== e ? ((this.toolsData.toolPanelLayout = t), this.toolsData.commit()) : e === ToolPanelLayout.BOTTOM_PANEL && this.adjustCanvasForPanel()
    }
    this.handleToolCollapse = async e => {
      e !== this.toolsData.toolCollapsed &&
        ((this.toolsData.toolCollapsed = e),
        this.toolsData.commit(),
        e || this.toolsData.toolPanelLayout !== ToolPanelLayout.BOTTOM_PANEL || this.closeModal(),
        this.engine.broadcast(new PanelCollapseMessage(e)))
    }
    this.handleBottomPanelCollapse = async e => {
      if (this.toolsData.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL) return this.handleToolCollapse(e.collapse)
    }
    this.adjustCanvasForPanelActual = async () => {
      const { toolPanelLayout: e, toolCollapsed: t, assetDocked: i, openModal: s } = this.toolsData,
        { sidePanelWidth: o, bottomPanelHeight: r, sidePanelLeft: n } = this,
        a = this.toolsData.getActiveTool(),
        h = e === ToolPanelLayout.SIDE_PANEL,
        d = a && h && !t,
        u = d && !!(null == a ? void 0 : a.panelLeft),
        m = d ? -f.LH : 0,
        p = m !== o ? m : void 0,
        g = u ? f.LH : 0,
        y = g !== n ? g : void 0,
        w = e === ToolPanelLayout.BOTTOM_PANEL && !s && i,
        M = -Math.floor(((this.containerData.size.height - 55) * ToolsSize) / 100),
        b = w ? M : 0,
        D = b !== r ? b : void 0,
        S = 0 === p || 0 === D ? 0 : ToolsDuration
      this.resizeCanvas(createOffsetBasedResizeDimensions(p, D, y, S))
      this.bottomPanelHeight = b
      this.sidePanelWidth = m
      this.sidePanelLeft = g
    }
    this.adjustCanvasForPanel = (0, T.D)(this.adjustCanvasForPanelActual, 50)
    this.resizeCanvas = async e => {
      this.engine.commandBinder.issueCommand(new ResizeCanvasCommand(e))
    }
  }

  async init(e, t: EngineContext) {
    this.engine = t
    // await t.getModuleBySymbol(AppAnalyticsSymbol)
    // this.analytics = await t.getModuleBySymbol(AnalyticsSymbol)
    ;[this.settingsData, this.appData, this.containerData, this.storageData] = await Promise.all([
      t.market.waitForData(SettingsData),
      t.market.waitForData(AppData),
      t.market.waitForData(ContainerData),
      t.market.waitForData(StorageData)
    ])
    this.toolsData = new ToolsData()
    this.updateLayoutSize()
    this.bindings.push(
      t.commandBinder.addBinding(ToggleToolCommand, this.toggleTool),
      t.commandBinder.addBinding(OpenPreviousToolCommand, this.openPreviousTool),
      t.commandBinder.addBinding(OpenToolCommand, async e => this.openTool(e.toolName, e.softOpening)),
      t.commandBinder.addBinding(OpenInitialToolCommand, this.openInitialTool),
      t.commandBinder.addBinding(CloseToolCommand, async e => this.closeTool(e.toolName)),
      t.commandBinder.addBinding(CloseCurrentToolCommand, this.closeCurrentTool),
      t.commandBinder.addBinding(ToggleModalCommand, this.onToggleModal),
      t.commandBinder.addBinding(CloseModalCommand, async () => this.closeModal()),
      t.commandBinder.addBinding(ToolPanelToggleCollapseCommand, async e => {
        this.handleToolCollapse(e.collapse)
      }),
      t.commandBinder.addBinding(ToolBottomPanelCollapseCommand, this.handleBottomPanelCollapse),
      this.containerData.onPropertyChanged("size", this.updateLayoutSize),
      t.subscribe(AssetDockedMessage, this.onAssetDocked),
      t.subscribe(AssetUndockedMessage, this.onAssetUndocked),
      t.subscribe(HandleTextBoxFocusMessage, this.handleTextBoxFocus),
      this.toolsData.onPropertyChanged("toolPanelLayout", this.adjustCanvasForPanel),
      this.toolsData.onPropertyChanged("activeToolChanged", this.adjustCanvasForPanel),
      this.toolsData.onPropertyChanged("toolCollapsed", this.adjustCanvasForPanel),
      this.toolsData.onPropertyChanged("assetDocked", this.adjustCanvasForPanel),
      t.commandBinder.addBinding(CloseRemoveToolsCommand, ({ checkForEdits: e }) => this.closeAndRemoveTools(e)),
      t.commandBinder.addBinding(RegisterToolsCommand, async ({ tools: e }) => this.registerTools(...e))
    )
    t.commandBinder.issueCommand(new RegisterConfirmViewChangeCommand(this.allowToolOrViewChange))
    t.market.register(this, ToolsData, this.toolsData)
  }
  dispose(e) {
    super.dispose(e)
    this.closeAndRemoveTools(!1)
    e.market.unregister(this, ToolsData)
  }
  registerTools(...e: ToolObject[]) {
    e.forEach(e => {
      e.featureFlag && this.bindings.push(this.settingsData.onPropertyChanged(e.featureFlag, () => this.updateEnabledTools()))
    })
    this.toolsData.addTool(...e)
  }
  closePanel() {
    this.toolsData.toolPanelLayout = this.isSidePanelLayout() ? ToolPanelLayout.NORMAL : ToolPanelLayout.NARROW
    this.toolsData.commit()
  }
  openPanel(e: ToolObject) {
    if (!e.panel) return (this.toolsData.toolCollapsed = !!e.panelBar), void this.toolsData.commit()
    const t = this.isSidePanelLayout()
    this.toolsData.toolPanelLayout = t ? ToolPanelLayout.SIDE_PANEL : ToolPanelLayout.BOTTOM_PANEL
    const i = !t && !this.toolsData.softOpening
    this.toolsData.toolCollapsed = i
    this.toolsData.commit()
  }
  toggleModal(e: string, t: boolean) {
    const { openModal: i, toolPanelLayout: s } = this.toolsData
    if ((t && i === e) || (!t && e !== i)) return
    const o = e.toLowerCase()
    const n = this.appData.application === AppMode.WORKSHOP ? "workshop_gui" : "JMYDCase_gui"
    // this.analytics.track(n, { gui_action: `open_${o}` })
    // e && this.analytics.track("modal_shown", { modal: e })
    this.toolsData.openModal = t ? e : null
    this.toolsData.commit()
    s === ToolPanelLayout.BOTTOM_PANEL && t !== !!i && this.adjustCanvasForPanel()
    this.engine.broadcast(new ModalToggledMeeage(e, t))
  }
  async activateTool(e: ToolObject) {
    if (this.toolInit) throw new Error("Current tool has not finished initializing!")
    this.toolsData.toolChangeInProgress = !0
    this.toolsData.commit()
    this.closeModal()
    this.openPanel(e)
    e.manager && ((this.toolInit = e.manager.activate()), await this.toolInit, (this.toolInit = null))
    this.toolsData.toolChangeInProgress = !1
    this.toolsData.commit()
    this.startTrackingTool(e)
  }
  async deactivateCurrentTool(e?: ToolObject, t = !0) {
    if (this.toolClosing) return !1
    const i = this.toolsData.getActiveTool()
    if (!i) return !0
    if ((await this.toolInit, t && !(await this.allowToolOrViewChange()))) return !1
    this.engine.broadcast(new LoadSpinnerMessage(!0))
    await (0, k.PM)(this.storageData, e => e.transactionState === TransactionState.IDLE)
    i.manager &&
      ((this.toolsData.toolChangeInProgress = !0),
      this.toolsData.commit(),
      (this.toolClosing = i.manager.deactivate()),
      await this.toolClosing,
      (this.toolsData.toolChangeInProgress = !1),
      this.toolsData.commit())
    this.engine.broadcast(new LoadSpinnerMessage(!1))
    this.closeModal()
    const s =
      this.toolsData.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL ||
      this.toolsData.toolPanelLayout === ToolPanelLayout.NARROW ||
      (null == e ? void 0 : e.panelLeft) === i.panelLeft
    !(e && e.panel && e.panel === i.panel && s) && this.closePanel()
    this.toolClosing = null
    this.stopTrackingTool(i)
    return !0
  }
  async activateToolName(e: string, t: boolean) {
    const { activeToolName: i, toolChangeInProgress: s } = this.toolsData
    if (s) return
    if (i === e) return (this.toolsData.softOpening = t), void this.toolsData.commit()
    const o = this.toolsData.getTool(e) || null
    if (null === o) return void this.log.error(`Tool not loaded: ${e}`)
    const [r, l] = await Promise.all([this.engine.market.waitForData(CameraData), this.engine.market.waitForData(ViewmodeData)])
    await StartTransition(r, l)
    ;(await this.deactivateCurrentTool(o)) &&
      (await StartTransition(r, l), (this.toolsData.softOpening = t), this.toolsData.commit(), await this.activateTool(o), this.toolsData.setActiveTool(o.id))
  }
  async deactivateToolName(e: string, t?: ToolObject) {
    e === this.toolsData.activeToolName && (await this.deactivateCurrentTool(t)) && this.toolsData.setActiveTool(null)
  }
  async openTool(e: string, t: boolean) {
    await this.activateToolName(e, t)
  }
  async closeTool(e: string) {
    await this.deactivateToolName(e)
  }
  startTrackingTool(e: ToolObject) {
    this.activeToolDurationMap[e.analytic] = Date.now()
  }
  stopTrackingTool(e: ToolObject) {
    const { analytic: t } = e
    this.activeToolDurationMap[t] = Date.now() - this.activeToolDurationMap[t]
    const i = { tool: `${t}_session_time`, duration: this.activeToolDurationMap[t] }
    // this.analytics.track("tool_session_time", i)
  }
  updateEnabledTools() {
    const e = this.toolsData.toolsMap
    e.atomic(() => {
      for (const t of e)
        if (t.featureFlag) {
          const e = this.settingsData.tryGetProperty(t.featureFlag, !1)
          t.enabled !== e && ((t.enabled = e), t.commit())
        }
    })
  }
  isSidePanelLayout() {
    return !(0, x.p)(this.containerData.size)
  }
}
