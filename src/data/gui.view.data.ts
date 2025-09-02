import { Data } from "../core/data"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class GuiViewData extends Data {
  name: string
  collapsedAccordionGroupsObservable: ObservableMap<unknown>
  constructor() {
    super()
    this.name = "gui-view-data"
    this.collapsedAccordionGroupsObservable = createObservableMap()
  }
  isAccordionGroupCollapsed(e) {
    return this.collapsedAccordionGroupsObservable.get(e)
  }
  setAccordionGroupCollapsed(e, t) {
    this.collapsedAccordionGroupsObservable.set(e, t)
  }
  getAccordionGroupCollapsedStates() {
    return this.collapsedAccordionGroupsObservable.deepCopy()
  }
  onAccordionCollapsedGroupsChanged(e) {
    return this.collapsedAccordionGroupsObservable.onChanged(e)
  }
}
