import { ObservableObject } from "../observable/observable.object"
export class Data extends ObservableObject {
  name: string
  constructor(...args: any[]) {
    super()
  }
}
