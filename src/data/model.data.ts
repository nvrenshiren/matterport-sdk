import * as s from "../const/59961"
import { Data } from "../core/data"
import { ModelObject } from "../modules/modelData.module"
import { ObservableMap } from "../observable/observable.map"
export class ModelData extends Data {
  activeModelId: string
  models: ObservableMap<ModelObject>
  constructor() {
    super()
    this.name = "model"
    this.models = new ObservableMap()
  }
  get model() {
    return this.getModel()
  }
  addModel(e: string, t: ModelObject) {
    this.activeModelId || (this.activeModelId = e), this.models.set(e, t)
  }
  getModel(e = this.activeModelId) {
    return this.models.get(e)
  }
  hasModel(e: string) {
    return this.models.has(e)
  }
  hasDiscoverUrl() {
    return [s.LU.PUBLIC, s.LU.UNLISTED].includes(this.getModel().visibility)
  }
}
