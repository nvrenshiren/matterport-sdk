import { ToolPanelLayout } from "../const/tools.const"
import { Data } from "../core/data"
import { ToolObject } from "../object/tool.object"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { ObservableOrder, ObservableOrderPriority } from "../observable/observable.order"
export class ToolsData extends Data {
  name: string
  tools: ObservableMap<ToolObject>
  assetDocked: boolean
  activeToolName: null | string
  previousToolName: null | string
  openModal: null | string
  toolPanelLayout: ToolPanelLayout
  static defaultToolPanelLayout = ToolPanelLayout.NORMAL
  softOpening: boolean
  toolCollapsed: boolean
  toolChangeInProgress: boolean
  toolPalettes: ObservableOrder
  activeToolChanged: any
  constructor(...rest: any[]) {
    super()
    this.name = "tools-data"
    this.tools = createObservableMap()
    this.assetDocked = !1
    this.activeToolName = null
    this.previousToolName = null
    this.openModal = null
    this.toolPanelLayout = ToolsData.defaultToolPanelLayout
    this.softOpening = !1
    this.toolCollapsed = !1
    this.toolChangeInProgress = !1
    this.toolPalettes = new ObservableOrder(this.tools)
    this.toolPalettes.setFilter("enabled", e => e.enabled)
    this.toolPalettes.setFilter("palette", e => !!e.palette)
    this.toolPalettes.sort((e, t) => e.order - t.order)
    this.toolPalettes.priority = ObservableOrderPriority.LOW
  }
  iterate(e: (e: ToolObject) => void) {
    for (const t of this.tools) e(t)
  }
  get toolsMap() {
    return this.tools
  }
  getToolPalettes() {
    return this.toolPalettes.groupBy("palette")
  }
  hasTool(e: string) {
    return this.toolsMap.has(e)
  }
  getTool(e: string) {
    return this.tools.get(e)
  }
  addTool(...e: ToolObject[]) {
    e.forEach(e => this.tools.set(e.id, e))
  }
  removeTool(...e: string[]) {
    e.forEach(e => {
      const n = this.getTool(e)
      n?.manager?.dispose()
      this.tools.delete(e)
    })
  }
  removeAllTools() {
    this.iterate(e => {
      e.manager?.dispose?.()
    })
    this.tools.clear()
  }
  getActiveTool() {
    return this.activeToolName ? this.getTool(this.activeToolName) : null
  }
  setActiveTool(e: string | null) {
    this.previousToolName = e ? this.activeToolName : null
    this.activeToolName = e
    this.commit()
  }
  isPanelOpen() {
    return this.toolPanelLayout === ToolPanelLayout.SIDE_PANEL || this.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL
  }
  isToolCollapsedToBottom() {
    return this.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL && this.toolCollapsed
  }
}
