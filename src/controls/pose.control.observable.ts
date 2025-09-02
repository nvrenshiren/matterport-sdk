import { ObservableValue, createObservableValue } from "../observable/observable.value"
import CameraDataModule from "../modules/cameraData.module"
export class PoseControllerObservable {
  poseControllerObservable: ObservableValue<CameraDataModule | null>
  constructor() {
    this.poseControllerObservable = createObservableValue(null)
  }
  get poseController() {
    return this.poseControllerObservable.value
  }
  setController(e) {
    return (this.poseControllerObservable.value = e), this
  }
  get isActive() {
    return null != this.poseController
  }
  onActiveStateChanged(e) {
    return this.poseControllerObservable.onChanged(e)
  }
}
