import { Data } from "../core/data"
import { OpenDeferred } from "../core/deferred"
export class DollhouseControlData extends Data {
  name: string
  autoOrbitPromise: OpenDeferred | null
  _autoOrbitTarget: string
  constructor() {
    super(...arguments)
    this.name = "dollhouse-control-data"
    this.autoOrbitPromise = null
    this._autoOrbitTarget = "top"
  }
  get isAutoOrbitting() {
    return null !== this.autoOrbitPromise
  }
  get autoOrbitTarget() {
    return this._autoOrbitTarget
  }
  get targetState() {
    return this.isAutoOrbitting ? this.autoOrbitTarget : null
  }
  startAutoOrbit(e = "top") {
    this._autoOrbitTarget = e
    this.autoOrbitPromise = new OpenDeferred()
    this.commit()
    return this.autoOrbitPromise.nativePromise()
  }
  stopAutoOrbit() {
    const e = this.autoOrbitPromise
    this.autoOrbitPromise = null
    this.commit()
    null == e || e.resolve()
  }
}
