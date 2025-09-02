import { ScreenOrientationType } from "../const/screen.const"
import { Data } from "../core/data"
import { ObservableValue } from "../observable/observable.value"
export class ContainerData extends Data {
  element: HTMLDivElement
  rootNode: Node
  name: string
  sizeObservable: ObservableValue<{ width: number; height: number }>
  orientation: ScreenOrientationType
  constructor(e: HTMLDivElement) {
    super()
    this.name = "container"
    this.sizeObservable = new ObservableValue({
      width: 0,
      height: 0
    })
    this.orientation = ScreenOrientationType.LANDSCAPE
    this.element = e
    this.rootNode = e.getRootNode()
  }
  get size() {
    return this.sizeObservable.value
  }
  set size(e) {
    this.sizeObservable.value = e
  }
  onPropertyChanged(e, t) {
    return "size" === e ? this.sizeObservable.onChanged(t) : super.onPropertyChanged(e, t)
  }
}
