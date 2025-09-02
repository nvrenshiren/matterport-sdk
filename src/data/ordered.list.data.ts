import { Data } from "../core/data"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class OrderedListData extends Data {
  name: string
  lists: ObservableMap<any>
  constructor(e: Record<string, any>) {
    super()
    this.name = "ordered-list-data"
    this.lists = createObservableMap(e)
  }
  replace(e: Record<string, any>) {
    this.lists.replace(e)
  }
  getOrderedLists() {
    return this.lists.values
  }
  getOrderedList(e: string) {
    return this.lists.get(e)
  }
  updateOrderedList(e: { name: string }) {
    this.lists.has(e.name) ? this.lists.get(e.name).copy(e) : this.lists.set(e.name, e)
  }
}
