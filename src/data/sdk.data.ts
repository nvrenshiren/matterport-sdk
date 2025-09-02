import { Data } from "../core/data"
import { ObservableArray } from "../observable/observable.array"
export class SdkData extends Data {
  applicationKeys: ObservableArray<string>
  constructor() {
    super(...arguments)
    this.name = "sdk"
    this.applicationKeys = new ObservableArray()
  }
}
