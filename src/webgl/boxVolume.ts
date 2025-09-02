import { Box3, Quaternion, Vector3 } from "three"
import { ObserverManager } from "../observable/observer.manager"
export class BoxVolume extends ObserverManager {
  constructor() {
    super(),
      (this.box = new Box3()),
      (this.center = new Vector3()),
      (this.size = new Vector3(1 / 0, 1 / 0, 1 / 0)),
      (this.orientation = new Quaternion()),
      (this.inverseOrientation = new Quaternion()),
      (this.pointCache = new Vector3()),
      (this.transformNeedsUpdate = !1),
      this.box.setFromCenterAndSize(this.center, this.size)
  }
  get origin() {
    return this.center
  }
  updateCenter(e) {
    this.center.copy(e), this.box.setFromCenterAndSize(this.center, this.size), (this.transformNeedsUpdate = !0)
  }
  updateDimensions(e) {
    this.size.copy(e), this.box.setFromCenterAndSize(this.center, this.size)
  }
  updateOrientation(e) {
    this.orientation.copy(e), (this.transformNeedsUpdate = !0)
  }
  containsPoint(e) {
    return (
      this.transformNeedsUpdate && ((this.transformNeedsUpdate = !1), this.inverseOrientation.copy(this.orientation).invert()),
      this.pointCache.copy(e).sub(this.center),
      this.pointCache.applyQuaternion(this.orientation),
      this.pointCache.add(this.center),
      this.box.containsPoint(this.pointCache)
    )
  }
}
