import { ModelViewType } from "./const/63319"
import { DataLayer } from "./object/dataLayer.object"
import { ObservableArray } from "./observable/observable.array"
import { ObservableObject } from "./observable/observable.object"
export class ModelView extends ObservableObject {
  created: Date
  modified: Date
  id: string
  name: string
  viewType: null | ModelViewType
  rawViewType: string
  enabled: boolean
  layers: ObservableArray<DataLayer>
  constructor(e = {}) {
    super(), (this.name = "")
    this.viewType = null
    this.rawViewType = ""
    this.enabled = !0
    this.layers = new ObservableArray()
    Object.assign(this, e)
  }
}
