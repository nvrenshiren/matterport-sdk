import { Vector3 } from "three"
import { ObserverManager } from "./observable/observer.manager"
export class SphereVolume extends ObserverManager {
  origin: Vector3
  radius: number
  constructor() {
    super(...arguments)
    this.origin = new Vector3()
    this.radius = 1 / 0
  }
  updateRadius(e) {
    this.radius = e
  }
  updateOrigin(e) {
    this.origin.copy(e)
  }
  containsPoint(e) {
    return this.origin.distanceToSquared(e) <= this.radius ** 2
  }
}
