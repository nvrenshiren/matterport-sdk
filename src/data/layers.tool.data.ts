import * as rr from "../other/31855"
import { BaseParser } from "../parser/baseParser"
import { AnnotationGrouping } from "../const/63319"
import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class LayersToolData extends Data {
  newLayerItems: any[]
  newLayerAction: string | null
  selectedItemsMap: ObservableMap<BaseParser>
  batchMode: boolean
  grouping: AnnotationGrouping
  static defaultGrouping = AnnotationGrouping.TYPE
  constructor() {
    super()
    this.selectedItemsMap = createObservableMap()
    this.batchMode = !1
    this.grouping = LayersToolData.defaultGrouping
  }
  getSelectedItems() {
    return this.selectedItemsMap.values
  }
  onSelectedItemsChanged(e: ChangeObserver<BaseParser>) {
    return this.selectedItemsMap.onChanged(e)
  }
  isItemSelected(e: BaseParser) {
    const t = (0, rr.w)(e)
    return this.selectedItemsMap.has(t)
  }
  addSelectedItems(e: BaseParser[]) {
    this.atomic(() => {
      e.forEach(e => {
        const t = (0, rr.w)(e)
        this.selectedItemsMap.set(t, e)
      })
    })
  }
  removeSelectedItems(e) {
    this.atomic(() => {
      e.forEach(e => {
        const t = (0, rr.w)(e)
        this.selectedItemsMap.delete(t)
      })
    })
  }
  clearAllSelected() {
    this.selectedItemsMap.clear()
  }
}
