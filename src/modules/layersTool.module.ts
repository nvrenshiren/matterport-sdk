import C from "classnames"
import * as M from "react"
import * as O from "react/jsx-runtime"
import { AnnotationGrouping } from "../const/63319"
import * as o from "../const/73536"
import { ToolPalette, ToolsList } from "../const/tools.const"
import { LayersToolData } from "../data/layers.tool.data"
import { ToolObject } from "../object/tool.object"

import * as z from "../other/14874"
import * as W from "../other/21829"
import * as j from "../other/24673"
import * as V from "../other/30160"
import * as I from "../other/36375"
import * as k from "../other/54549"
import * as H from "../other/62965"
import * as U from "../6550"
import * as A from "../other/66543"
import * as x from "../other/69092"
import * as xn from "../other/73085"
import * as L from "../other/73372"
import { SETTING_DATA_LAYERS_ANALYTIC } from "../other/76087"
import * as N from "../other/85351"
import * as B from "../other/89337"
import * as _ from "../other/97273"
import * as Q from "../other/99930"
import {
  AddUserLayerCommand,
  BatchSelectionAddItemsCommand,
  BatchSelectionClearAllCommand,
  BatchSelectionItemToggleCommand,
  BatchSelectionRemoveItemsCommand,
  BatchSelectionSelectAllCommand,
  ConvertModelToLayeredCommand,
  LayerItemsCopyNewCommand,
  LayerNewCancelCommand,
  LayerNewCommand,
  LayerNewSaveCommand,
  LayersToolSetGroupingCommand,
  SearchBatchToggleCommand
} from "../command/layers.command"
import { MeasureModeToggleCommand } from "../command/measurement.command"
import { PinSelectionClearCommand } from "../command/pin.command"
import { RegisterToolsCommand } from "../command/tool.command"
import { ToggleModalCommand } from "../command/ui.command"
import { LAYERS_SUPPORT_PAGE_URL } from "../const/23829"
import * as R from "../const/25071"
import { PhraseKey } from "../const/phrase.const"
import { WorkShopLayersToolSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { SearchData } from "../data/search.data"
import { ToolsData } from "../data/tools.data"
import { WorkShopFeatureMessage } from "../message/feature.message"
import { LayersBatchItemsCompleteMessage } from "../message/layer.message"
import { BaseParser } from "../parser/baseParser"
declare global {
  interface SymbolModule {
    [WorkShopLayersToolSymbol]: LayersToolModule
  }
}
class f {
  engine: EngineContext
  constructor(t) {
    this.engine = t
  }
  async activate() {
    const { commandBinder: t } = this.engine
    await t.issueCommand(new PinSelectionClearCommand()), await t.issueCommandWhenBound(new MeasureModeToggleCommand(!0, !1, !1))
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommandWhenBound(new MeasureModeToggleCommand(!1, !1, !1))
  }
}

const P = (0, xn.M)(LayersToolData, "grouping", LayersToolData.defaultGrouping)
function F({ item: t }) {
  const { dataTypeGroup: e } = t
  return e && e.itemActionsFC ? (0, O.jsx)(e.itemActionsFC, { item: t }) : null
}
const G = ({ item: t }) => {
  const e = (0, I.k)()
  if (!t) return null
  const { id: i, dataTypeGroup: s } = t
  if (null == s ? void 0 : s.itemFC) return (0, O.jsx)(s.itemFC, { item: t })
  const n = e === i,
    a = (0, O.jsx)(F, { item: t }) || void 0,
    o = (0, O.jsx)(U.A, { item: t })

  return (0, O.jsx)(W.F, { item: t, active: n, title: (0, O.jsx)(H.j, { item: t }), actions: a, badge: o }, i)
}
const { SHOWCASE: Z, WORKSHOP: Y } = PhraseKey
function K() {
  const t = (0, I.k)(),
    e = (0, x.J)(),
    i = (0, B.e)(),
    [s, n] = (0, M.useState)(i),
    a = P(),
    o = (0, A.b)(Z.SEARCH.ITEMS, Y.LAYERS.SELECTED_ITEMS)
  ;(0, M.useEffect)(() => {
    i && (null == i ? void 0 : i.id) !== (null == s ? void 0 : s.id) && n(i)
  }, [null == i ? void 0 : i.id])
  const r = i || s,
    d = ((null == r ? void 0 : r.objectAnnotationId) && r) || null,
    c = (0, O.jsx)(_.B, { filter: (0, O.jsx)(j.a, {}), filterPills: !0 })
  return (0, O.jsxs)(O.Fragment, {
    children: [
      (0, O.jsx)(V.J, { closing: !i, tag: d }),
      (0, O.jsxs)(
        L.L,
        Object.assign(
          { toolId: ToolsList.LAYERS, className: C("layers-tool-panel", { "batch-mode": e }), subheader: c, title: o, subheaderCollapsedHeight: R.vH },
          {
            children: [
              (0, O.jsx)(k.V, { grouping: a }),
              (0, O.jsx)(
                "div",
                Object.assign({ className: "panel-list" }, { children: (0, O.jsx)(N.D, { renderItem: G, renderGroup: z.s, activeItemId: t, grouping: a }) })
              )
            ]
          }
        )
      )
    ]
  })
}
class $ {
  renderPanel: () => M.ReactElement<any, string | M.JSXElementConstructor<any>>
  renderOverlay: () => M.ReactElement<any, string | M.JSXElementConstructor<any>>
  constructor() {
    this.renderPanel = () => (0, O.jsx)(K, {})
    this.renderOverlay = () => (0, O.jsx)(Q.F, {})
  }
}
const { TOOLS: J } = PhraseKey
export default class LayersToolModule extends Module {
  activated: boolean
  onToolChanged: (t: any) => void
  engine: EngineContext
  toolsData: ToolsData
  layersData: LayersData
  searchData: SearchData
  layersToolData: LayersToolData

  constructor() {
    super(...arguments)
    this.name = "layers-tool"
    this.activated = !1
    this.onToolChanged = t => {
      this.toggleBatchMode(!1)
      t === ToolsList.LAYERS ? this.activateTool() : this.deactivateTool()
    }
  }
  async init(t, e: EngineContext) {
    this.engine = e
    ;[this.toolsData, this.layersData, this.searchData] = await Promise.all([
      e.market.waitForData(ToolsData),
      e.market.waitForData(LayersData),
      e.market.waitForData(SearchData)
    ])
    this.layersToolData = new LayersToolData()
    t.hasLayersFeature &&
      (e.broadcast(new WorkShopFeatureMessage(SETTING_DATA_LAYERS_ANALYTIC)),
      this.changeGrouping(AnnotationGrouping.LAYER),
      e.commandBinder.issueCommand(new ConvertModelToLayeredCommand()))
    this.bindings.push(
      this.toolsData.onPropertyChanged("activeToolName", this.onToolChanged),
      e.commandBinder.addBinding(LayersToolSetGroupingCommand, t => this.changeGrouping(t.grouping)),
      e.commandBinder.addBinding(SearchBatchToggleCommand, t => this.toggleBatchMode(t.batchMode)),
      e.subscribe(LayersBatchItemsCompleteMessage, t => {
        this.removeSelectedItems(t.items)
      }),
      this.layersData.onPropertyChanged("currentViewId", () => this.toggleBatchMode(!1)),
      // this.searchData.onSearchResultsChanged(() => this.onSearchResultsChanged()),
      e.commandBinder.addBinding(BatchSelectionClearAllCommand, t => this.clearAllSelectedItems()),
      e.commandBinder.addBinding(BatchSelectionItemToggleCommand, t => this.toggleItemSelected(t.item, t.selected)),
      e.commandBinder.addBinding(BatchSelectionSelectAllCommand, t => this.selectAllItems()),
      e.commandBinder.addBinding(BatchSelectionAddItemsCommand, t => this.addSelectedItems(t.items)),
      e.commandBinder.addBinding(BatchSelectionRemoveItemsCommand, t => this.removeSelectedItems(t.items)),
      e.commandBinder.addBinding(LayerNewCommand, t => this.startNewLayer(t.items, t.action)),
      e.commandBinder.addBinding(LayerNewSaveCommand, t => this.saveNewLayer(t.name, t.common)),
      e.commandBinder.addBinding(LayerNewCancelCommand, t => this.cancelNewLayer())
    )
    this.addTool(t.hasLayersFeature)
    e.market.register(this, LayersToolData, this.layersToolData)
  }
  dispose(t) {
    super.dispose(t)
    t.market.unregister(this, LayersToolData)
  }
  onUpdate() {}
  activateTool() {
    this.activated || (this.activated = !0)
  }
  deactivateTool() {
    this.activated && (this.toggleBatchMode(!1), (this.activated = !1))
  }
  addTool(t: boolean) {
    const e = t ? J.LAYERS : J.SEARCH,
      i = t ? J.LAYERS_HELP_MESSAGE : void 0,
      s = t ? LAYERS_SUPPORT_PAGE_URL : void 0
    if (!this.toolsData.getTool(ToolsList.LAYERS)) {
      const t = new ToolObject({
        id: ToolsList.LAYERS,
        searchModeType: !0,
        namePhraseKey: e,
        helpMessagePhraseKey: i,
        helpHref: s,
        panel: !0,
        icon: "icon-magnifying-glass",
        analytic: "layers",
        dimmed: !1,
        enabled: !0,
        hidesAppBar: !0,
        palette: ToolPalette.VIEW_BASED,
        order: 1,
        ui: new $(),
        manager: new f(this.engine)
      })
      this.engine.commandBinder.issueCommand(new RegisterToolsCommand([t]))
    }
  }
  async toggleBatchMode(t: boolean) {
    t !== this.layersToolData.batchMode && (t || this.clearAllSelectedItems(), (this.layersToolData.batchMode = t), this.layersToolData.commit())
  }
  async startNewLayer(t, e) {
    this.layersToolData.newLayerItems = t || []
    this.layersToolData.newLayerAction = e || null
    this.layersToolData.commit()
    this.engine.commandBinder.issueCommand(new ToggleModalCommand(o.P.LAYER_ADD, !0))
  }
  async saveNewLayer(t, e) {
    const { newLayerItems: i, newLayerAction: s } = this.layersToolData
    this.engine.commandBinder.issueCommand(new ToggleModalCommand(o.P.LAYER_ADD, !1)),
      s && i.length > 0
        ? "copy" === s
          ? await this.engine.commandBinder.issueCommand(new LayerItemsCopyNewCommand(t, i))
          : this.log.error("Unsupported newLayerAction")
        : await this.engine.commandBinder.issueCommand(new AddUserLayerCommand(t.trim(), e))
  }
  async cancelNewLayer() {
    this.layersToolData.newLayerItems = []
    this.layersToolData.newLayerAction = null
    this.layersToolData.commit()
  }
  onSearchResultsChanged() {
    const t = new Set<string>()
    const e: BaseParser[] = []
    this.layersToolData.getSelectedItems().forEach(i => {
      this.searchData.hasSearchResultItem(i) ? i.parentId && t.add(i.parentId) : e.push(i)
    })
    e.length > 0 && this.layersToolData.removeSelectedItems(e)
    const i = this.searchData.getResults().filter(e => e.parentId && t.has(e.parentId))
    i && this.layersToolData.addSelectedItems(i)
  }
  async changeGrouping(t: AnnotationGrouping) {
    this.layersToolData.grouping = t
    this.layersToolData.commit()
  }
  async clearAllSelectedItems() {
    this.layersToolData.clearAllSelected()
  }
  async selectAllItems() {
    const t = this.searchData.getResults().filter(t => t.supportsBatchDelete() || t.supportsLayeredCopyMove())
    this.layersToolData.addSelectedItems(t)
  }
  async toggleItemSelected(t, e) {
    e ? this.addSelectedItems([t]) : this.removeSelectedItems([t])
  }
  async addSelectedItems(t: BaseParser[]) {
    const e = t.filter(t => t.supportsBatchDelete() || t.supportsLayeredCopyMove())
    const i = new Set<string>()
    e.forEach(t => {
      t.parentId && i.add(t.parentId)
    })
    const s = this.searchData.getResults().filter(t => t.parentId && i.has(t.parentId))
    this.layersToolData.addSelectedItems(e.concat(s))
  }
  async removeSelectedItems(t) {
    const e = new Set()
    t.forEach(t => {
      t.parentId && e.add(t.parentId)
    })
    const i = this.searchData.getResults().filter(t => t.parentId && e.has(t.parentId))
    this.layersToolData.removeSelectedItems(t.concat(i))
  }
}

// export const AddSelectedItemsCommand = BatchSelectionAddItemsCommand
// export const CancelNewLayerCommand = LayerNewCancelCommand
// export const ClearAllSelectedItemsCommand = BatchSelectionClearAllCommand
// export const LayersToolData = LayersToolData
// export const RemoveSelectedItemsCommand = BatchSelectionRemoveItemsCommand
// export const SaveNewLayerCommand = LayerNewSaveCommand
// export const SelectAllItemsCommand = BatchSelectionSelectAllCommand
// export const SetDataGroupingCommand = LayersToolSetGroupingCommand
// export const StartNewLayerCommand = LayerNewCommand
// export const ToggleBatchModeCommand = SearchBatchToggleCommand
// export const ToggleSelectBatchItemCommand = BatchSelectionItemToggleCommand
